"""Check built links, customer-safe examples, screenshot coverage and the search index."""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
FORBIDDEN = re.compile(r"hinxton|sanger|\bhgi\b|\blab\b|10\.11\.|172\.27\.|nip\.io", re.I)


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for attr in ("href", "src"):
            if attrs.get(attr):
                self.links.append(attrs[attr])


def check():
    errors = []
    if not (SITE / "index.html").exists():
        return ["No built site. Run mkdocs build --strict first."]
    pages = {p.relative_to(SITE).as_posix(): Page(p.read_text()) for p in SITE.rglob("*.html")}
    for source, page in pages.items():
        base = "/" + (source.removesuffix("index.html") if source.endswith("index.html") else source)
        for link in page.links:
            if link.startswith(("mailto:", "tel:", "data:", "javascript:")):
                continue
            target = urlsplit(urljoin("https://docs.nubestack.cloud" + base, link))
            if target.netloc != "docs.nubestack.cloud":
                continue
            path = unquote(target.path).lstrip("/")
            if not path or path.endswith("/"):
                path += "index.html"
            dest = SITE / path
            if not dest.exists():
                errors.append(f"Broken link: {source} -> {link}")
            elif target.fragment and path in pages and unquote(target.fragment) not in pages[path].ids:
                errors.append(f"Missing anchor: {source} -> {link}")
    for directory in ("docs", "data", "openapi", "site", "scripts/screens"):
        for path in (ROOT / directory).rglob("*"):
            if path.suffix not in {".md", ".html", ".json", ".txt", ".ts"}:
                continue
            if path.name == "take.ts":
                continue  # The runner contains the deny pattern itself.
            match = FORBIDDEN.search(path.read_text())
            if match:
                errors.append(f"Forbidden sample value: {path.relative_to(ROOT)} ({match[0]})")
    for path in (ROOT / "docs").rglob("*.md"):
        if re.search(r"This page is being written|TODO|TBD", path.read_text()):
            errors.append(f"Unfinished page: {path.relative_to(ROOT)}")
    shots = list((ROOT / "docs/assets/screens").rglob("*.webp"))
    for shot in shots:
        audit = ROOT / "data/screen-text" / shot.relative_to(ROOT / "docs/assets/screens").with_suffix(".txt")
        if not audit.exists():
            errors.append(f"Screenshot lacks captured-text audit: {shot.relative_to(ROOT)}")
    index = SITE / "search/search_index.json"
    if not index.exists():
        errors.append("Missing search index")
    else:
        entries = json.loads(index.read_text()).get("docs", [])
        for term in ("Instances", "Certificates", "Idempotency", "API reference"):
            if not any(term.lower() in (p.get("title", "") + p.get("text", "")).lower() for p in entries):
                errors.append(f"Search index lacks {term}")
    if not errors:
        print(f"Passed: {len(pages)} HTML pages, local links and anchors, {len(shots)} audited screenshots, search index, customer-data scan and no unfinished stubs.")
    return errors


if __name__ == "__main__":
    failures = check()
    if failures:
        print("\n".join(failures), file=sys.stderr)
    sys.exit(bool(failures))
