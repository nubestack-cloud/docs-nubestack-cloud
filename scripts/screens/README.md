# Console screenshots

Screenshots are rendered from the real Nexus portal with Playwright, using only the sample world in `world.ts` and the mock routes in `mock.ts`. The product's fixtures and source are not edited. The API join helpers are read from its `portal/e2e/mock-api.ts`.

## Regenerate

Install Node 24+, run `npm ci` in this documentation repository and install Chromium with `npx playwright install chromium`. The product portal must already have its dependencies installed.

```bash
NEXUS_PORTAL_DIR=/path/to/nexus/portal npm run screens
# One subset:
NEXUS_PORTAL_DIR=/path/to/nexus/portal npm run screens -- networking
```

The runner starts Vite on a free localhost port, renders each entry in `shots.ts`, then stops the Vite process by its PID in a `finally` block. It uses a 1365px viewport, device scale factor 2, light theme and a fixed sample clock. Dialogs and panels are cropped where useful. WebP files go to `docs/assets/screens/`.

It aborts browser requests to origins other than its local portal. API reads and writes are mocked; it never needs cloud credentials or a live installation. Rendered page text is checked before each image is saved and recorded in `data/screen-text/` for review alongside the images. A failed image is not substituted with an invented screen.

## Sample data and review

The world uses Acme, web-shop and analytics; Karachi and Islamabad; invented people with `acme.example` addresses; and reserved documentation ranges for public IPs. Private network form examples use RFC 1918 ranges, never addresses of a real customer. `0.0.0.0/0` represents an actual firewall wildcard, not a sample host. Prices are invented examples and remain provisional.

After regenerating, run `mkdocs build --strict` and `python scripts/check.py`. Review screenshots for readability and compare each guide's action names with the portal. Capture new screens by adding a route and optional interaction to `shots.ts`; keep all scenario overrides here instead of editing the product fixtures.
