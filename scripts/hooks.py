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


def _plain(node):
    """`anyOf: [X, null]` as X marked nullable, so the reference shows a type instead of a blank."""
    if isinstance(node, list):
        return [_plain(v) for v in node]
    if not isinstance(node, dict):
        return node
    any_of = node.get("anyOf")
    if isinstance(any_of, list) and len(any_of) == 2 and {"type": "null"} in any_of:
        other = next(v for v in any_of if v != {"type": "null"})
        node = {**{k: v for k, v in node.items() if k != "anyOf"}, **other, "nullable": True}
    return {k: _plain(v) for k, v in node.items()}


def _public_names(part: dict) -> dict:
    """Schema names such as `nexus__api__routes__ssh_keys__KeyBody` come from the server's module
    paths. Show the last part, or the module and the name where two would clash."""
    schemas = part["components"]["schemas"]
    short = [k.rsplit("__", 1)[-1] for k in schemas]
    rename = {}
    for key in schemas:
        if "__" not in key:
            continue
        name = key.rsplit("__", 1)[-1]
        if short.count(name) > 1 or name in schemas:
            name = "".join(w.capitalize() for w in key.split("__")[-2].split("_")) + name
        rename[key] = name
    if not rename:
        return part
    text = json.dumps(part)
    for old, new in rename.items():
        text = text.replace(f'"#/components/schemas/{old}"', f'"#/components/schemas/{new}"')
    part = json.loads(text)
    part["components"]["schemas"] = {rename.get(k, k): v for k, v in part["components"]["schemas"].items()}
    return part


def _slices() -> tuple[dict, list[tuple[str, str, int, bool]]]:
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
        (CACHE / f"{slug(name)}.json").write_text(json.dumps(_public_names(_plain(part))))
        count = sum(len(v) for v in paths.values())
        changes = any(m != "get" for v in paths.values() for m in v)
        listing.append((name, tag.get("description", ""), count, changes))
    return spec, listing


_STATE: dict = {}


def on_config(config):
    spec, listing = _slices()
    _STATE["spec"], _STATE["listing"] = spec, listing
    for item in config.nav:
        if isinstance(item, dict) and "API" in item:
            api = item["API"]
            api[-1] = {"API reference": ["api/reference/index.md", *[{n: f"api/reference/{slug(n)}.md"} for n, *_ in listing]]}
    return config


def on_files(files, config):
    spec, listing = _STATE["spec"], _STATE["listing"]
    total = sum(c for _, _, c, _ in listing)
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
    for name, desc, count, changes in listing:
        index.append(f"| [{name}]({slug(name)}.md) | {count} | {html.escape(desc)} |")
        page = [
            "---", f"title: {name} API", f"description: {desc}", "---", "",
            f"# {name}", "", desc, "",
            "Paths are relative to your API address. See [Authentication](../authentication.md)"
            + (" and [Operations](../operations.md). Changes that answer `202 Accepted` return an operation "
               "to follow." if changes else "."),
            "", "Request and response examples are generated from the schema; the tables under "
            "**Schemas** are the reference.", "",
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
    text = _OP.sub(lambda m: f'## {m[3].strip()}\n\n<p class="api-endpoint">{m[1]} <code>{re.sub(r"(?<!<)/", "/<wbr>", m[2])}</code></p>\n', text)
    text = re.sub(r'\?\?\? note "Description"\n((?:    .*\n|\n)+?)(?=\S)',
                  lambda m: re.sub(r"^    ", "", m[1], flags=re.M), text)
    # Said once in the page intro instead of under every example.
    text = re.sub(r'<span class="small-note">⚠️</span>&nbsp;<em class="small-note warning">.*?</em>', "", text)
    # The raw JSON Schema under each example repeats the tables under Schemas.
    text = re.sub(r'\?\?\? hint "Schema of the [^"]*"\n(?:    .*\n|\n)+?(?=\S)', "", text)
    # The site's h2 already draws a rule above Schemas.
    text = re.sub(r'(?:<hr\s*/?>|^---$)\s*(?=## Schemas)', "", text, flags=re.M)
    # Descriptions go into raw HTML cells, where Markdown is not applied: render `code` there.
    text = re.sub(r"<td>(.*?)</td>", lambda m: "<td>" + re.sub(r"`([^`<]+)`", r"<code>\1</code>", m[1]) + "</td>",
                  text, flags=re.S)
    # Material's scroll wrapper, as for Markdown tables, so these are full width and scroll on phones.
    text = text.replace("<table>", '<div class="md-typeset__scrollwrap"><div class="md-typeset__table ns-api-table"><table>')
    text = text.replace("</table>", "</table></div></div>")
    return text.replace('<hr class="operation-separator" />', "")


def on_page_markdown(markdown, page, config, files):
    markdown = _OAD.sub(_render_openapi, markdown)
    if "<!-- problem-table -->" in markdown:
        problems = json.loads((ROOT / "data" / "problems.json").read_text())
        rows = ['<div class="ns-compact" markdown>', "", "| Code | Meaning | Retry? |", "|---|---|:-:|"]
        rows += [f"| `{p['code']}` | {_cell(p['title'])} | {'Yes' if p['retryable'] else '—'} |" for p in problems]
        rows += ["", "</div>"]
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
