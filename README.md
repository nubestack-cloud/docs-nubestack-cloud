# NubeStack Cloud documentation

The customer documentation for NubeStack Cloud: guides, concepts, service pages, the API and its
reference, for people who run instances, networks, storage, load balancers and certificates in
Karachi and Islamabad. Built with [MkDocs](https://www.mkdocs.org/) and
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## Set up

Python 3.10 or later:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.lock      # every package pinned; requirements.txt lists the direct ones
```

## Serve

```bash
.venv/bin/mkdocs serve -a 0.0.0.0:8000
```

Open <http://localhost:8000>. Pages reload as you edit. Restart `mkdocs serve` after changing
`scripts/hooks.py`: MkDocs keeps hook modules loaded.

## Build and check

```bash
.venv/bin/mkdocs build --strict    # fails on any broken link, missing anchor or absolute link
.venv/bin/python scripts/check.py  # built links, alt text, no external loads, forbidden values
```

The output is `site/`, a static site with no external requests (fonts, icons and the API
reference are all local). Publish that directory to any static host at `site_url`.

## Regenerate the screenshots

Screenshots are taken from the Nexus portal running on Vite against a mock API with this site's
sample world (Acme, web-shop and analytics, Karachi and Islamabad, Ayesha Khan). You need Node 24
and a Nexus checkout with the portal's dependencies:

```bash
cd /path/to/nexus/portal && npm ci && cd -
NEXUS_PORTAL_DIR=/path/to/nexus/portal node --import ./scripts/screens/register.mjs scripts/screens/take.ts
# only some: … take.ts security/ compute/instance
```

See [scripts/screens/README.md](scripts/screens/README.md).

## Refresh the API reference from Nexus

```bash
.venv/bin/python scripts/refresh_api.py /path/to/nexus
.venv/bin/mkdocs build --strict
```

This copies `openapi/v1.json` and the customer error codes (`data/problems.json`) from a Nexus
checkout, groups operations by service and names the product NubeStack Cloud in descriptions. The
paths, fields and responses are unchanged. At build time `scripts/hooks.py` renders one reference
page per service with Neoteroi's `essentials-openapi`, offline.

## Layout

| Path | What |
|---|---|
| `mkdocs.yml` | Site configuration and navigation |
| `docs/` | Pages in Markdown, and `assets/` (brand, fonts, stylesheets, screenshots, diagrams) |
| `docs/assets/diagrams/` | Inline SVG diagrams, styled by `extra.css` for both themes; include with `--8<-- "name.svg"` |
| `overrides/` | Material template overrides: the logo, the 404 page, head tags |
| `includes/` | Snippets appended to every page (abbreviations) |
| `openapi/v1.json` | The customer API contract the reference is built from |
| `data/problems.json` | The error codes the Errors page lists |
| `data/screen-text/` | The text each screenshot showed, for review and the forbidden-value scan |
| `scripts/` | Build hooks, the API refresh, the link fixer, the checker and the screenshot runner |

## Writing pages

- Service pages follow one pattern: what it is and when to use it; before you start; tasks, each in
  `=== "Console"` and `=== "API"` tabs; how it connects; what blocks a delete; limits and good
  practice; related pages.
- Use the customer's words: location, project, instance, network, public IP, volume, operation.
- Link pages relatively (`../networking/networks.md`); the strict build rejects absolute links.
- A screenshot alone in its paragraph becomes a figure; its alt text is the caption.
- Sample data only: Acme, `acme.example`, public addresses from 203.0.113.0/24, 198.51.100.0/24
  and 192.0.2.0/24, private networks on 10.0.0.0/16.

The 2026-11-02 review that led to this structure is in [REVIEW-2026-11-02.md](REVIEW-2026-11-02.md).
