// Takes the documentation's screenshots from the Nexus portal, running on Vite against a mock of
// the customer API that answers with this site's sample world (world.ts, mock.ts).
//
//   NEXUS_PORTAL_DIR=/path/to/nexus/portal npm run screens            all shots
//   NEXUS_PORTAL_DIR=/path/to/nexus/portal npm run screens -- compute  only shots whose name has "compute"
//
// The portal needs its own dependencies first: `cd $NEXUS_PORTAL_DIR && npm ci`. Writes WebP
// files to docs/assets/screens/<name>.webp; see scripts/screens/README.md.
import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import { installMock, type MockOptions } from "./mock.ts";
import { SHOTS } from "./shots.ts";
import { FIXED_NOW } from "./world.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const portal = resolve(process.env.NEXUS_PORTAL_DIR ?? join(root, "..", "nexus", "portal"));
if (!existsSync(join(portal, "node_modules", ".bin", "vite"))) {
  console.error(`No portal with its dependencies at ${portal}. Set NEXUS_PORTAL_DIR to a Nexus checkout's portal/ and run npm ci there.`);
  process.exit(2);
}
const filter = process.argv.slice(2);
const forbidden = /hinxton|\bhgi\b|sanger|\blab\b|10\.11\.|172\.27\.|nip\.io/i;

async function freePort(): Promise<number> {
  return new Promise((ok, fail) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => (typeof address === "object" && address ? ok(address.port) : fail(new Error("no port"))));
    });
  });
}

async function waitFor(url: string, ms: number): Promise<void> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try { if ((await fetch(url)).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`${url} did not answer within ${ms} ms`);
}

export interface Shot {
  /** Output name, `<section>/<name>`, written to docs/assets/screens/<name>.webp. */
  name: string;
  /** Path in the portal, such as `/orgs/<org>/projects/<project>/instances`. */
  path: string;
  /** Text or a selector to wait for before the shot. */
  wait?: string;
  /** Steps after the page loads: open a menu or a dialog. */
  act?: (page: Page) => Promise<void>;
  /** What to capture: "window" (default), "main" (the content panel), "dialog", or a CSS selector. */
  clip?: string;
  /** Height of the window in CSS pixels (default 860). */
  height?: number;
  /** Width of the window in CSS pixels (default 1365). */
  width?: number;
  theme?: "light" | "dark";
  mock?: MockOptions;
  /** Signed out: the session answers unauthenticated. */
  signedOut?: boolean;
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
console.log(`Starting the portal from ${portal} on ${base}`);
const vite: ChildProcess = spawn(join(portal, "node_modules", ".bin", "vite"), ["--port", String(port), "--strictPort", "--host", "127.0.0.1"],
  { cwd: portal, stdio: ["ignore", "ignore", "inherit"], detached: false });
const stop = () => { if (vite.pid && vite.exitCode === null) vite.kill("SIGTERM"); };
process.on("exit", stop);
process.on("SIGINT", () => { stop(); process.exit(130); });

const helpers = await import(pathToFileURL(join(portal, "e2e", "mock-api.ts")).href);
let failed = 0;
try {
  await waitFor(`${base}/`, 60_000);
  const browser = await chromium.launch();
  const shots = SHOTS.filter((s) => filter.length === 0 || filter.some((f) => s.name.includes(f)));
  for (const shot of shots) {
    const theme = shot.theme ?? "light";
    const context = await browser.newContext({
      viewport: { width: shot.width ?? 1365, height: shot.height ?? 860 }, deviceScaleFactor: 2, colorScheme: theme,
      timezoneId: "Asia/Karachi", locale: "en-GB",
    });
    await context.addInitScript((t) => {
      try { window.localStorage.setItem("nexus-theme", t); } catch { /* private mode */ }
    }, theme);
    const page = await context.newPage();
    page.on("pageerror", (error) => console.error(`  page error in ${shot.name}: ${error.message}`));
    try {
      // Fail closed: neither a live cloud nor a third-party service can be reached by a shot.
      await page.route("**/*", (route) => {
        const target = new URL(route.request().url());
        return target.origin === base ? route.continue() : route.abort("blockedbyclient");
      });
      await page.clock.setFixedTime(new Date(FIXED_NOW));
      await installMock(page, helpers, shot.mock);
      if (shot.signedOut) {
        await page.route("**/auth/session", (route) => route.fulfill({ json: { authenticated: false, csrf_token: null, banner: null } }));
      }
      await page.goto(base + shot.path, { waitUntil: "networkidle" });
      if (shot.wait) {
        const target = /^[.#\[]|^[a-z]+\[|^main|^table|^h1/.test(shot.wait) ? page.locator(shot.wait).first() : page.locator("main.content").getByText(shot.wait).first();
        await target.waitFor({ state: "visible", timeout: 15_000 });
      }
      if (shot.act) await shot.act(page);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(400);
      const visibleText = await page.locator("body").innerText();
      if (forbidden.test(visibleText)) throw new Error(`Forbidden sample text in ${shot.name}`);
      const clip = shot.clip ?? "window";
      let png: Buffer;
      if (clip === "window") png = await page.screenshot({ animations: "disabled", caret: "hide" });
      else {
        const selector = clip === "main" ? "main.content" : clip === "dialog" ? "[role=dialog]" : clip;
        const panel = page.locator(selector).first();
        png = await panel.screenshot({ animations: "disabled", caret: "hide" });
        if (clip === "main") {
          // Crop empty viewport padding, keeping all visible text and controls intact.
          const contentHeight = await panel.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            const leaves = [...element.querySelectorAll("h1,h2,h3,h4,p,table,button,a,input,select,textarea,[role=tablist],pre,dl,svg,canvas")];
            const bottom = Math.max(bounds.top, ...leaves.filter(e => e.getClientRects().length > 0).map(e => e.getBoundingClientRect().bottom));
            return Math.min(bounds.height, Math.ceil(bottom - bounds.top + 24));
          });
          const info = await sharp(png).metadata();
          const height = Math.min(info.height!, Math.ceil(contentHeight * 2));
          if (height > 0 && height < info.height!) png = await sharp(png).extract({ left: 0, top: 0, width: info.width!, height }).toBuffer();
        }
      }
      const out = join(root, "docs", "assets", "screens", `${shot.name}.webp`);
      mkdirSync(dirname(out), { recursive: true });
      await sharp(png).webp({ quality: 86, effort: 5 }).toFile(out);
      const textFile = join(root, "data", "screen-text", `${shot.name}.txt`);
      mkdirSync(dirname(textFile), { recursive: true });
      writeFileSync(textFile, visibleText.split("\n").map(line => line.trimEnd()).join("\n") + "\n");
      console.log(`  ok  ${shot.name}`);
    } catch (error) {
      failed += 1;
      console.error(`FAIL  ${shot.name}: ${(error as Error).message.split("\n")[0]}`);
      mkdirSync(join(root, "scripts", "screens", "failed"), { recursive: true });
      await page.screenshot({ path: join(root, "scripts", "screens", "failed", `${shot.name.replaceAll("/", "-")}.png`) }).catch(() => undefined);
    } finally {
      await context.close();
    }
  }
  await browser.close();
} finally {
  stop();
}
console.log(failed ? `${failed} shot(s) failed` : "All shots taken");
process.exit(failed ? 1 : 0);
