// Exercise the built site as a customer: search, theme choice, navigation and small screens.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdirSync, readFileSync } from "node:fs";
import { strict as assert } from "node:assert";

const port = await new Promise<number>((resolve, reject) => {
  const socket = createServer();
  socket.listen(0, "127.0.0.1", () => {
    const address = socket.address();
    socket.close(() => typeof address === "object" && address ? resolve(address.port) : reject(new Error("No port")));
  });
});
const base = `http://127.0.0.1:${port}`;
const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", "site"], { stdio: "ignore" });
const stop = () => { if (server.exitCode === null) server.kill("SIGTERM"); };
process.on("exit", stop);
mkdirSync("artifacts", { recursive: true });
const inventory = JSON.parse(readFileSync("data/action-tabs.json", "utf8")) as Record<string, { heading: string }[]>;
const browser = await chromium.launch();
try {
  for (let n = 0; n < 100; n++) {
    try { if ((await fetch(base)).ok) break; } catch { /* start-up */ }
    if (n === 99) throw new Error("Preview failed to start");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const width of [1440, 768, 390]) {
    for (const colorScheme of ["light", "dark"] as const) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.setDefaultNavigationTimeout(15000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${response.status()}: ${response.url()}`); });
      for (const path of ["/", "/compute/", "/storage/", "/tutorials/recover-a-volume/", "/compute/instances/", "/compute/manage-instances/", "/storage/volumes/", "/networking/load-balancers/", "/api/reference/"]) {
        console.log(`Checking ${width}px ${colorScheme} ${path}`);
        await page.goto(base + path, { waitUntil: "networkidle" });
        await page.locator("article h1, .docs-home h1").first().waitFor();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Horizontal overflow: ${width} ${path}`);
        if (path === "/") {
          assert(await page.locator(".project-blueprint").isVisible(), "Overview illustration is missing");
        }
        if (width < 760 && path === "/") {
          for (const paragraph of await page.locator(".guide-feature > div:first-child > p").all()) {
            assert((await paragraph.boundingBox())!.width > 200, "The quickstart feature text is too narrow on mobile");
          }
        }
        assert.equal(await page.locator("body").getAttribute("data-md-color-scheme"), colorScheme === "dark" ? "slate" : "default");
        if (path === "/" || path === "/compute/manage-instances/") {
          // Load below-the-fold figures before full-page review captures.
          for (const image of await page.locator("article img").all()) {
            await image.evaluate(async (image: HTMLImageElement) => { image.loading = "eager"; await image.decode(); });
          }
          await page.screenshot({ path: `artifacts/${path === "/" ? "home" : "article"}-${width}-${colorScheme}.png`, fullPage: true });
        }
      }
      await page.goto(base + "/compute/instances/", { waitUntil: "networkidle" });
      const sets = page.locator(".tabbed-set");
      assert.equal(await sets.count(), inventory["compute/instances.md"].length);
      for (const set of await sets.all()) {
        assert.deepEqual(await set.locator(".tabbed-labels > label").allTextContents(), ["Console", "API"]);
      }
      await page.getByRole("button", { name: "API", exact: true }).click();
      for (const set of await sets.all()) {
        assert(await set.locator(":scope > input").nth(1).isChecked());
        assert((await set.locator(".tabbed-block:visible").innerText()).includes("curl"), "API action did not become visible");
      }
      await page.goto(base + "/storage/volumes/", { waitUntil: "networkidle" });
      const volumeSets = page.locator(".tabbed-set");
      assert.equal(await volumeSets.count(), inventory["storage/volumes.md"].length);
      assert.equal(await page.getByRole("button", { name: "API", exact: true }).getAttribute("aria-pressed"), "true");
      for (const set of await volumeSets.all()) {
        assert(await set.locator(':scope > input').nth(1).isChecked(), "Method preference did not follow to all actions");
      }
      await volumeSets.first().locator(".tabbed-labels > label").filter({ hasText: /^Console$/ }).click();
      for (const set of await volumeSets.all()) {
        assert(await set.locator(':scope > input').first().isChecked(), "A local action tab did not synchronize other actions");
      }
      assert.equal(await page.getByRole("button", { name: "Console", exact: true }).getAttribute("aria-pressed"), "true");
      await page.screenshot({ path: `artifacts/volume-actions-${width}-${colorScheme}.png` });
      const screenshot = page.locator("a[data-docs-zoom]").first();
      await screenshot.click();
      assert(await page.locator("dialog.docs-image-dialog").isVisible(), "Screenshot enlargement did not open");
      await page.keyboard.press("Escape");
      assert(!(await page.locator("dialog.docs-image-dialog").isVisible()), "Escape did not close the screenshot");
      assert(await screenshot.evaluate(el => el === document.activeElement), "Screenshot focus was not restored");
      await page.goto(base + "/compute/launch-templates/#with-the-api", { waitUntil: "networkidle" });
      assert(await page.locator('.tabbed-set > input').nth(1).isChecked(), "A direct API-section link did not open its tab");
      assert.equal(await page.getByRole("button", { name: "API", exact: true }).getAttribute("aria-pressed"), "true");
      await page.goto(base, { waitUntil: "networkidle" });
      if (width < 1220) {
        await page.locator('.md-header__button[for="__drawer"]').click();
        await page.locator('.md-sidebar--primary').getByText("Get started", { exact: true }).first().waitFor();
        await page.locator('label.md-overlay[for="__drawer"]').click({ position: { x: width - 20, y: 250 } });
        assert(!(await page.locator('input#__drawer').isChecked()), "Mobile navigation did not close");
      }
      const input = page.getByRole("textbox", { name: "Search" });
      const searchButton = page.locator('.md-header__button[for="__search"]');
      if (await searchButton.isVisible()) await searchButton.click();
      else await input.click();
      await input.pressSequentially("certificates", { delay: 50 });
      const results = page.locator(".md-search-result__link").filter({ visible: true });
      await results.first().waitFor({ timeout: 15000 }).catch(async error => {
        await page.screenshot({ path: `artifacts/search-failure-${width}-${colorScheme}.png` });
        console.log(await page.locator(".md-search").innerText(), errors);
        throw error;
      });
      assert((await results.count()) > 0, "No real search results");
      await results.first().click();
      await page.waitForLoadState("networkidle");
      assert(page.url() !== base + "/", "Search did not navigate");
      assert.equal(errors.length, 0, errors.join("\n"));
      console.log(`Passed browser: ${width}px ${colorScheme}; home, articles, reference, search and layout`);
      await context.close();
    }
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const nativePage = await noJS.newPage();
  await nativePage.goto(base + '/compute/manage-instances/');
  const nativeSet = nativePage.locator('.tabbed-set').first();
  await nativeSet.locator('.tabbed-labels > label').filter({ hasText: /^API$/ }).click();
  assert(await nativeSet.locator(':scope > input').nth(1).isChecked(), 'Native tabs require JavaScript');
  assert((await nativeSet.locator('.tabbed-block:visible').innerText()).includes('curl'));
  assert(!(await nativePage.locator('.docs-method-picker').isVisible()), 'Nonfunctional method controls shown without JavaScript');
  await noJS.close();
  console.log('Passed native action tabs without JavaScript');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator('label[title="Switch to dark mode"]').click();
  assert.equal(await page.locator("body").getAttribute("data-md-color-scheme"), "slate");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("body").getAttribute("data-md-color-scheme"), "slate");
  console.log("Passed theme toggle and persistence");
} finally {
  await browser.close();
  stop();
}
