# NubeStack Cloud documentation

Customer documentation built with MkDocs 1.6 and Material 9.7, with a neutral documentation layout, a service sidebar, light/dark themes, local search and a generated API reference. The output is a static site; Python is the only requirement for building it. Node is optional for screenshots and browser verification.

## Build and preview

Use Python 3.10 or later:

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.lock
mkdocs serve --dev-addr 127.0.0.1:8000
```

Build and check the publishable output:

```bash
mkdocs build --strict
python scripts/check.py
python -m http.server 8000 --directory site
```

Open `http://127.0.0.1:8000`. Search works in the static preview. `npm run dev`, `npm run build` and `npm run preview` are convenience aliases; the build alias automatically uses `.venv` when present. MkDocs is pinned to 1.6.1 for compatibility with the chosen Material theme.

## Content and design

- `docs/`: customer guides in Markdown. Link to source `.md` files; strict validation checks pages and anchors.
- `docs/assets/`: brand assets, custom CSS and real console screenshots.
- `overrides/`: small Material template overrides for the logo, article label and home layout.
- `mkdocs.yml`: navigation, theme, Markdown features and validation.
- `openapi/nubestack-cloud-v1.json`: checked-in customer contract; no product checkout needed for builds.
- `data/problems.json`: customer problem catalog used by the errors guide.
- `data/examples.json`: service request bodies used in generated curl examples.
- `data/action-tabs.json`: inventory of the 132 action sections and their API operations across 39 guides.
- `scripts/build_docs.py`: generates reference pages and schemas in memory, adds navigation and search, expands `api-example` markers and builds the problem table.
- `data/screen-text/`: rendered sample text captured with each screenshot, for the data audit.

The generated reference covers every operation in the contract, including nested request/response schemas, parameters and response statuses. It works offline after building and does not embed a remote reference viewer.

## Refresh the contract

With Node 24+ and a local Nexus checkout:

```bash
NEXUS_DIR=/path/to/nexus node scripts/sync-api.mjs
mkdocs build --strict
python scripts/check.py
```

The sync script reads the product contract and problem catalog. It updates presentation and service grouping without changing API paths or request fields. Check guides and examples whenever the contract changes.

## Screenshots and browser checks

```bash
npm ci
npx playwright install chromium
NEXUS_PORTAL_DIR=/path/to/nexus/portal npm run screens
npm run check:browser
```

The product portal needs its own installed dependencies. See [the screenshot guide](scripts/screens/README.md). Screenshots use sample data against a mocked API. The browser check starts and stops its own static server, tests desktop/mobile in both themes, search navigation and theme persistence, and writes review images to ignored `artifacts/`.

## Validation and publication

CI builds strictly and checks local links, anchors, search, screenshot text audits, unfinished stubs and forbidden sample values. The output is `site/`; publish that directory to a static host at the configured site URL. This repository has no automatic production deployment or live API connection.

The real customer API endpoint and support contact details must be supplied by NubeStack before public launch. The dedicated CLI and Terraform provider remain coming later; usage and costs remain provisional. The [completion report](REPORT.md) records scope and verification.

## Authoring method tabs and visual guides

Write method tabs directly in Markdown, beside each action, rather than generating a page-wide switch in Python. Add `action_tabs: true` to frontmatter and register the action heading and operations in `data/action-tabs.json` so the built-site checker verifies coverage.

```markdown
## Create the resource

=== "Console"

    1. Open the service and choose **Create**.
    2. Complete the fields and follow the operation.

=== "API"

    API instructions, request example and reference link.

## Delete the resource

=== "Console"

    Review dependencies and choose **Delete**.

=== "API"

    The equivalent delete request and its completion checks.
```

The native Material tabs work without custom Python transformations or JavaScript. For a page-wide method control, copy the `.docs-method-picker` block from an existing guide. Its choices synchronize the action tabs, persist across pages and remain available while scrolling. Shared prerequisites, limits and verification stay outside the tabs. Direct API links open the corresponding action tab.

When a CLI or Terraform workflow is released, add a native `=== "CLI"` or `=== "Terraform"` block and its method-picker button. Do not add empty tabs for unavailable interfaces. Restart `mkdocs serve` after editing Python hooks: MkDocs caches imported hook modules for the lifetime of the preview process.

Inline diagrams use `<!-- diagram: storage-recovery -->` with accessible SVGs in `docs/assets/diagrams/`. Diagram text explains resource relationships rather than platform internals. Screenshot Markdown is framed with its alt text as a caption and opens in a keyboard-accessible enlargement dialog; the underlying image link also works without JavaScript.

Keep user content in the customer perspective. Deployment of the platform, underlying cloud administration and operator procedures belong in the product repository, not this site's navigation. The coverage review is recorded in [CONTENT_REVIEW.md](CONTENT_REVIEW.md).
