// Makes the site's logo variants from NubeStack's logo (1500×351: the hexagon "N" mark, then the
// wordmark). Run once after the logo changes:
//
//   node scripts/brand.mjs [path/to/logo.png]
//
// Writes:
//   docs/assets/brand/logo-light.png  the logo as it is, for the light theme
//   docs/assets/brand/logo-dark.png   the charcoal parts lightened, for the dark theme
//   docs/assets/favicon.png, docs/assets/apple-touch-icon.png, docs/assets/brand/mark.png
//                                    the mark alone, square, from the left of the logo
import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = process.argv[2] ?? join(root, "docs/assets/brand/logo-light.png");
const out = (p) => join(root, p);
mkdirSync(out("docs/assets/brand"), { recursive: true });
mkdirSync(out("docs/assets"), { recursive: true });

if (source !== out("docs/assets/brand/logo-light.png")) copyFileSync(source, out("docs/assets/brand/logo-light.png"));

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Dark theme: a pixel close to the charcoal (#474747, grey with R≈G≈B) becomes light grey; the
// teal keeps its colour.
const dark = Buffer.from(data);
for (let i = 0; i < dark.length; i += 4) {
  const [r, g, b] = [dark[i], dark[i + 1], dark[i + 2]];
  const grey = Math.abs(r - g) < 12 && Math.abs(g - b) < 12 && r < 140;
  if (grey) { dark[i] = 0xe8; dark[i + 1] = 0xe8; dark[i + 2] = 0xe8; }
}
await sharp(dark, { raw: info }).png().toFile(out("docs/assets/brand/logo-dark.png"));

// The mark: the columns before the first empty gap after x=200.
let end = info.width;
for (let x = 200; x < info.width; x++) {
  let empty = true;
  for (let y = 0; y < info.height && empty; y++) if (data[(y * info.width + x) * 4 + 3] > 20) empty = false;
  if (empty) { end = x; break; }
}
const side = Math.max(end, info.height);
const mark = await sharp(source)
  .extract({ left: 0, top: 0, width: end, height: info.height })
  .extend({ top: Math.floor((side - info.height) / 2) + 8, bottom: Math.ceil((side - info.height) / 2) + 8,
    left: Math.floor((side - end) / 2) + 8, right: Math.ceil((side - end) / 2) + 8,
    background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png().toBuffer();
await sharp(mark).resize(512, 512).toFile(out("docs/assets/brand/mark.png"));
await sharp(mark).resize(64, 64).toFile(out("docs/assets/favicon.png"));
await sharp(mark).resize(180, 180).flatten({ background: "#ffffff" }).toFile(out("docs/assets/apple-touch-icon.png"));
console.log(`mark: columns 0-${end}; wrote logo-light, logo-dark, mark, favicon, apple-touch-icon`);
