"""MkDocs hooks for the NubeStack Cloud docs.

1. The API reference: one page per service group, each rendered by Neoteroi's OpenAPI renderer
   from a slice of openapi/v1.json (that group's operations and the schemas they use). The slices
   are written to .cache/api/ at build time; nothing generated is committed.
2. The Errors page's problem-code table, from data/problems.json (`<!-- problem-table -->`).
3. A screenshot alone in a paragraph becomes a captioned figure.
"""
from __future__ import annotations

import html
import json
import re
from collections import defaultdict
from pathlib import Path

from mkdocs.structure.files import File
from openapidocs.mk.v3 import OpenAPIV3DocumentationHandler

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / ".cache" / "api"
METHODS = {"get", "post", "put", "patch", "delete"}


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def _refs(node, found: set[str]) -> None:
    if isinstance(node, dict):
        ref = node.get("$ref")
        if isinstance(ref, str) and ref.startswith("#/components/schemas/"):
            found.add(ref.rsplit("/", 1)[1])
        for value in node.values():
            _refs(value, found)
    elif isinstance(node, list):
        for value in node:
            _refs(value, found)


def _slices() -> tuple[dict, list[tuple[str, str, int]]]:
    spec = json.loads((ROOT / "openapi" / "v1.json").read_text())
    schemas = spec["components"]["schemas"]
    groups: dict[str, dict] = defaultdict(dict)
    for path, item in spec["paths"].items():
        for method, op in item.items():
            if method in METHODS:
                groups[op["tags"][0]].setdefault(path, {})[method] = op
    CACHE.mkdir(parents=True, exist_ok=True)
    listing = []
    for tag in spec.get("tags", []):
        name = tag["name"]
        paths = groups.get(name)
        if not paths:
            continue
        needed: set[str] = set()
        _refs(paths, needed)
        while True:  # the closure of schemas the operations reach
            more: set[str] = set()
            for schema in needed:
                _refs(schemas[schema], more)
            if more <= needed:
                break
            needed |= more
        part = {
            "openapi": spec["openapi"],
            "info": {"title": name, "version": spec["info"]["version"]},
            "servers": spec.get("servers", []),
            "tags": [tag],
            "paths": paths,
            "components": {
                "schemas": {k: schemas[k] for k in sorted(needed)},
                "securitySchemes": spec["components"].get("securitySchemes", {}),
            },
        }
        (CACHE / f"{slug(name)}.json").write_text(json.dumps(part))
        count = sum(len(v) for v in paths.values())
        listing.append((name, tag.get("description", ""), count))
    return spec, listing


_STATE: dict = {}


def on_config(config):
    spec, listing = _slices()
    _STATE["spec"], _STATE["listing"] = spec, listing
    for item in config.nav:
        if isinstance(item, dict) and "API" in item:
            api = item["API"]
            api[-1] = {"API reference": ["api/reference/index.md", *[{n: f"api/reference/{slug(n)}.md"} for n, _, _ in listing]]}
    return config


def on_files(files, config):
    spec, listing = _STATE["spec"], _STATE["listing"]
    total = sum(c for _, _, c in listing)
    index = [
        "---", "title: API reference", "description: Every operation of the NubeStack Cloud API, by service.", "---", "",
        "# API reference", "",
        f"The NubeStack Cloud API has {total} operations. Each page below lists one service's operations with "
        "their parameters, request bodies, responses and schemas, generated from the API's OpenAPI contract.", "",
        "Read [Authentication](../authentication.md), [Requests](../requests.md) and "
        "[Operations](../operations.md) first. Every path starts with `/v1`.", "",
        "[:material-download: Download the OpenAPI contract](../../assets/openapi/v1.json){ .md-button }", "",
        "| Service | Operations | What it covers |", "|---|--:|---|",
    ]
    for name, desc, count in listing:
        index.append(f"| [{name}]({slug(name)}.md) | {count} | {html.escape(desc)} |")
        page = [
            "---", f"title: {name} API", f"description: {desc}", "---", "",
            f"# {name}", "", desc, "",
            "Paths are relative to your API address. See [Authentication](../authentication.md) and "
            "[Operations](../operations.md). Changes that answer `202 Accepted` return an operation to follow.", "",
            f"[OAD(.cache/api/{slug(name)}.json)]", "",
        ]
        files.append(File.generated(config, f"api/reference/{slug(name)}.md", content="\n".join(page)))
    files.append(File.generated(config, "api/reference/index.md", content="\n".join(index) + "\n"))
    files.append(File.generated(config, "assets/openapi/v1.json", content=json.dumps(spec, indent=2, ensure_ascii=False) + "\n"))
    return files


def _cell(value) -> str:
    return html.escape(str(value)).replace("|", "&#124;")


_OAD = re.compile(r"\[OAD\(([^)]+)\)\]")


_OP = re.compile(r'^### (<span class="http-[a-z]+">[A-Z]+</span>) (.+)\n(.+)$', re.M)


def _render_openapi(match: re.Match) -> str:
    """Neoteroi's Markdown for one slice, trimmed to the operations and their schemas.

    Its title, servers, tag heading, security schemes and tag table repeat what the page already
    says; each operation's heading becomes its summary, with the method and path under it."""
    source = ROOT / match[1]
    text = OpenAPIV3DocumentationHandler(json.loads(source.read_text()), style="MKDOCS", source=str(source)).write()
    text = text[text.index('<hr class="operation-separator" />'):]
    text = text[: text.index("## Security schemes")]
    text = _OP.sub(lambda m: f'## {m[3].strip()}\n\n<p class="api-endpoint">{m[1]} <code>{m[2]}</code></p>\n', text)
    text = re.sub(r'\?\?\? note "Description"\n((?:    .*\n|\n)+?)(?=\S)',
                  lambda m: re.sub(r"^    ", "", m[1], flags=re.M), text)
    return text.replace('<hr class="operation-separator" />', "")


def on_page_markdown(markdown, page, config, files):
    markdown = _OAD.sub(_render_openapi, markdown)
    if "<!-- problem-table -->" in markdown:
        problems = json.loads((ROOT / "data" / "problems.json").read_text())
        rows = ["| Code | Meaning | Retry? |", "|---|---|:-:|"]
        rows += [f"| `{p['code']}` | {_cell(p['title'])} | {'Yes' if p['retryable'] else '—'} |" for p in problems]
        markdown = markdown.replace("<!-- problem-table -->", "\n".join(rows))
    return markdown


_FIGURE = re.compile(r'<p>\s*(<img\b[^>]*>)\s*</p>')


def on_page_content(content, page, config, files):
    """A screenshot alone in its paragraph becomes a figure. Its caption is the image's title
    when it has one (`![alt](src "Caption")`), else its alt text."""
    def figure(match: re.Match) -> str:
        img = match[1]
        if "assets/screens/" not in img:
            return match[0]
        title = re.search(r'\btitle="([^"]*)"', img)
        alt = re.search(r'\balt="([^"]*)"', img)
        caption = title[1] if title else (alt[1] if alt else "")
        img = re.sub(r'\s*title="[^"]*"', "", img)
        if "loading=" not in img:
            img = img.replace("<img ", '<img loading="lazy" decoding="async" ', 1)
        src = re.search(r'\bsrc="([^"]*)"', img)
        link = f'<a href="{src[1]}" title="Open the full-size image" target="_blank" rel="noopener">{img}</a>' if src else img
        return f'<figure class="ns-shot">{link}<figcaption>{caption}</figcaption></figure>'

    return _FIGURE.sub(figure, content)
