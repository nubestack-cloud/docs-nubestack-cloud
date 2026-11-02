# Console screenshots

The screenshots in `docs/assets/screens/` are rendered from the real Nexus portal (the console
NubeStack Cloud runs), on Vite, against a mock of the customer API that answers with this site's
sample world. No live installation or cloud is ever reached.

| File | What it is |
|---|---|
| `take.ts` | The runner: starts Vite, takes each shot, encodes WebP, writes the text audit |
| `shots.ts` | Every shot: its name, portal path, what to click, and what to crop to |
| `world.ts` | The sample world: Acme, web-shop and analytics, Karachi and Islamabad, Ayesha Khan and colleagues |
| `mock.ts` | Answers the API routes from `world.ts`, importing the portal mock's join helpers |
| `register.mjs` | Lets Node load the portal's TypeScript helpers |

## Regenerate

You need Node 24 (it runs TypeScript itself) and a Nexus checkout whose portal has its
dependencies installed. This repository installs no Node packages: Playwright comes from the
portal.

```bash
cd /path/to/nexus/portal && npm ci && cd -
NEXUS_PORTAL_DIR=/path/to/nexus/portal node --import ./scripts/screens/register.mjs scripts/screens/take.ts
# only the shots whose name contains a filter:
NEXUS_PORTAL_DIR=/path/to/nexus/portal node --import ./scripts/screens/register.mjs scripts/screens/take.ts security/ instance-create
```

The runner:

- starts Vite on a free local port and stops it by its PID when done;
- uses a 1365 px wide window at device scale factor 2, the light theme, a fixed clock and the
  `Asia/Karachi` time zone;
- blocks every request that is not to the local portal, and answers `/api/**` from the mock;
- draws NubeStack's mark and name in place of the platform's wordmark;
- crops to the content panel or a dialog where that reads better;
- refuses to save a shot whose visible text matches a forbidden value;
- encodes WebP in the browser and writes the visible text to `data/screen-text/<name>.txt`.

A failed shot leaves a PNG in `scripts/screens/failed/` (ignored) and the old image in place.

## Sample data rules

- Organization **Acme**, projects **web-shop** and **analytics**, locations **Karachi
  (pak-khi-1)** and **Islamabad (pak-isb-1)**, person **Ayesha Khan &lt;ayesha@acme.example&gt;**;
  colleagues are invented names at `acme.example`.
- Public addresses only from 203.0.113.0/24, 198.51.100.0/24 and 192.0.2.0/24. Private networks
  use 10.0.0.0/24 and 10.0.1.0/24, because a location accepts only private ranges for networks.
- Prices and quantities are invented and marked provisional.

## Add a shot

Add an entry to `shots.ts`, extend `world.ts` or a shot's `mock.extra` if the page needs data,
run the runner for that shot, look at the image, then reference it from a page with alt text.
After regenerating, run `mkdocs build --strict` and `python scripts/check.py`.
