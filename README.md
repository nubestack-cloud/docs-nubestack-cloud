# NubeStack Cloud Docs

The customer documentation for NubeStack Cloud: the console, the API and native OpenStack
access. Built with [Starlight](https://starlight.astro.build) (Astro), with Pagefind search.

## Run it

Needs Node 24 (`.nvmrc`).

```bash
npm ci
npm run dev        # live preview on http://localhost:4321
npm run build      # static site in dist/: link check, API reference, search index
npm run preview    # serve the built dist/
npm run check      # astro check
npm run check:names  # pages, screenshot data and dist/ free of names that must not appear
```

`npm run dev -- --host 0.0.0.0 --port 8080` listens on all interfaces, on another port.
