// Exercise the built site as a customer: search, theme choice, navigation and small screens.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdirSync } from "node:fs";
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
const browser = await chromium.launch();
try {
  for (let n = 0; n < 100; n++) {
    try { if ((await fetch(base)).ok) break; } catch { /* start-up */ }
    if (n === 99) throw new Error("Preview failed to start");
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  for (const width of [1440, 390]) {
    for (const colorScheme of ["light", "dark"] as const) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.setDefaultNavigationTimeout(15000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("response", response => { if (response.status() >= 400 && response.url().startsWith(base)) errors.push(`${response.status()}: ${response.url()}`); });
      for (const path of ["/", "/compute/instances/", "/networking/load-balancers/", "/api/reference/", "/api/reference/instances/"]) {
        console.log(`Checking ${width}px ${colorScheme} ${path}`);
        await page.goto(base + path, { waitUntil: "networkidle" });
        await page.locator("article h1, .docs-home h1").first().waitFor();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Horizontal overflow: ${width} ${path}`);
        if (width < 760 && path === "/") {
          for (const paragraph of await page.locator(".docs-start > div > p:last-child").all()) {
            assert((await paragraph.boundingBox())!.width > 200, "Quickstart text is too narrow on mobile");
          }
        }
        assert.equal(await page.locator("body").getAttribute("data-md-color-scheme"), colorScheme === "dark" ? "slate" : "default");
        if (path === "/" || path === "/compute/instances/") {
          await page.screenshot({ path: `artifacts/${path === "/" ? "home" : "article"}-${width}-${colorScheme}.png`, fullPage: true });
        }
      }
      await page.goto(base, { waitUntil: "networkidle" });
      if (width < 760) {
        await page.locator('.md-header__button[for="__drawer"]').click();
        await page.locator('.md-sidebar--primary').getByText("Get started", { exact: true }).first().waitFor();
        await page.locator('input#__drawer').evaluate((input: HTMLInputElement) => { input.checked = false; input.dispatchEvent(new Event("change", { bubbles: true })); });
      }
      const input = page.getByRole("textbox", { name: "Search" });
      if (width < 760) await page.locator('.md-header__button[for="__search"]').click();
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
