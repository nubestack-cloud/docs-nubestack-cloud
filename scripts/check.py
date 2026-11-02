"""Checks the built site and the sources. Run after `mkdocs build --strict`:

    python scripts/check.py

1. Every internal link and anchor in the built HTML resolves (MkDocs checks Markdown links; this
   also covers generated pages, the theme and raw HTML).
2. No page, image text, script or data file carries a forbidden value: names of real sites,
   people or private address ranges that must never appear in customer docs.
3. Every screenshot and diagram has alt text, every screenshot its captured-text audit, every
   diagram a title and description, and no page loads anything from another host.
4. No unfinished stubs, and the search index has the core terms.
"""
from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
HOST = "docs.nubestack.com"
FORBIDDEN = re.compile(r"hinxton|sanger|\bhgi\b|\blab\b|\blabs\b|10\.11\.|172\.27\.|nip\.io", re.I)
SCANNED = ("docs", "data", "openapi", "scripts", "overrides", "site")
SUFFIXES = {".md", ".html", ".json", ".txt", ".ts", ".mjs", ".py", ".svg", ".css", ".yml", ".js"}


class Page(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.images_without_alt: list[str] = []
        self.external: list[str] = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        loaded = attrs.get("src") if tag in ("img", "script") else attrs.get("href") if tag == "link" else None
        if loaded:
            if urlsplit(loaded).netloc not in ("", HOST):
                self.external.append(loaded)
            else:
                self.links.append(loaded)
        if tag == "img" and not (attrs.get("alt") or "").strip():
            self.images_without_alt.append(attrs.get("src", "?"))


def check() -> list[str]:
    errors: list[str] = []
    if not (SITE / "index.html").exists():
        return ["No built site: run mkdocs build --strict first."]
    pages = {p.relative_to(SITE).as_posix(): Page(p.read_text()) for p in SITE.rglob("*.html")}
    for source, page in pages.items():
        base = "/" + (source.removesuffix("index.html") if source.endswith("index.html") else source)
        for link in page.links:
            if link.startswith(("mailto:", "tel:", "data:", "javascript:")):
                continue
            target = urlsplit(urljoin(f"https://{HOST}{base}", link))
            if target.netloc != HOST:
                continue
            path = unquote(target.path).lstrip("/")
            if not path or path.endswith("/"):
                path += "index.html"
            if not (SITE / path).exists():
                errors.append(f"Broken link: {source} -> {link}")
            elif target.fragment and path in pages and unquote(target.fragment) not in pages[path].ids:
                errors.append(f"Missing anchor: {source} -> {link}")
        for src in page.images_without_alt:
            if "assets/screens/" in src or "assets/diagrams/" in src:
                errors.append(f"Image without alt text: {source} -> {src}")
        for ref in page.external:
            errors.append(f"Loads from another host: {source} -> {ref}")

    for directory in SCANNED:
        for path in (ROOT / directory).rglob("*"):
            if path.suffix not in SUFFIXES or path.name in {"check.py", "take.ts"} or "node_modules" in path.parts:
                continue
            match = FORBIDDEN.search(path.read_text(errors="ignore"))
            if match:
                errors.append(f"Forbidden value: {path.relative_to(ROOT)} ({match[0]})")

    for path in (ROOT / "docs").rglob("*.md"):
        if re.search(r"\bTODO\b|\bTBD\b|To be written|# Stub", path.read_text()):
            errors.append(f"Unfinished page: {path.relative_to(ROOT)}")

    for path in (ROOT / "docs/assets/diagrams").glob("*.svg"):
        try:
            svg = ET.fromstring(path.read_text())
        except ET.ParseError as error:
            errors.append(f"Invalid SVG: {path.name}: {error}")
            continue
        ns = {"svg": "http://www.w3.org/2000/svg"}
        if svg.find("svg:title", ns) is None or svg.find("svg:desc", ns) is None:
            errors.append(f"Diagram without title and description: {path.name}")

    shots = sorted((ROOT / "docs/assets/screens").rglob("*.webp"))
    for shot in shots:
        audit = ROOT / "data/screen-text" / shot.relative_to(ROOT / "docs/assets/screens").with_suffix(".txt")
        if not audit.exists():
            errors.append(f"Screenshot without its text audit: {shot.relative_to(ROOT)}")
    for audit in (ROOT / "data/screen-text").rglob("*.txt"):
        shot = ROOT / "docs/assets/screens" / audit.relative_to(ROOT / "data/screen-text").with_suffix(".webp")
        if not shot.exists():
            errors.append(f"Text audit without its screenshot: {audit.relative_to(ROOT)}")

    index = SITE / "search/search_index.json"
    entries = json.loads(index.read_text()).get("docs", []) if index.exists() else []
    for term in ("Instances", "Certificates", "SNI", "Idempotency", "API reference"):
        if not any(term.lower() in (e.get("title", "") + e.get("text", "")).lower() for e in entries):
            errors.append(f"Search index lacks {term}")

    if not errors:
        print(f"Passed: {len(pages)} HTML pages (links, anchors, alt text, no external loads), "
              f"{len(shots)} screenshots with text audits, diagrams, forbidden-value scan, search index.")
    return errors


if __name__ == "__main__":
    failures = check()
    if failures:
        print("\n".join(failures), file=sys.stderr)
    sys.exit(bool(failures))
