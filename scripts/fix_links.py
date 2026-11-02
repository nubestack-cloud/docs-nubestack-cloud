"""Rewrite site-absolute Markdown links (/section/page.md#anchor) as relative links.

    python scripts/fix_links.py            rewrite docs/**/*.md in place
    python scripts/fix_links.py --check    list what would change, exit 1 if anything would

Pages that moved are mapped to their new paths. An anchor is kept only when the target page
has a heading with that id (or the page is generated, such as the API reference, whose
anchors the strict build checks); otherwise the link points at the page without it.
"""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MOVED = {
    "api/overview.md": "api/index.md",
    "native-access/overview.md": "native-access/index.md",
    "networking/network-map.md": "networking/network-topology.md",
    "tutorials/index.md": "get-started/index.md",
    "tutorials/recover-a-volume.md": "tutorials/persistent-storage.md",
    "tutorials/clean-up-resources.md": "concepts/deletion-and-retention.md",
}
LINK = re.compile(r"(\]\(|\]: |href=\")(/[^)\s\"#]+\.md)(#[^)\s\"]*)?")


def slugify(text: str) -> str:
    text = re.sub(r"\{[^}]*\}\s*$", "", text)          # attr_list
    text = re.sub(r"<[^>]+>|[`*_\[\]]|\(.*?\)", "", text) if "](" in text else re.sub(r"<[^>]+>|[`*_]", "", text)
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[\s]+", "-", text)


def anchors(page: Path) -> set[str]:
    if not page.exists():
        return set()
    found = set()
    for line in page.read_text().splitlines():
        heading = re.match(r"#{1,6}\s+(.*)$", line)
        if heading:
            explicit = re.search(r"\{[^}]*#([\w-]+)[^}]*\}\s*$", heading[1])
            found.add(explicit[1] if explicit else slugify(heading[1]))
        found.update(re.findall(r'id="([\w-]+)"', line))
    return found


def main() -> int:
    check = "--check" in sys.argv
    changed = 0
    for page in sorted(DOCS.rglob("*.md")):
        text = page.read_text()

        def fix(match: re.Match) -> str:
            nonlocal changed
            prefix, target, anchor = match[1], match[2].lstrip("/"), match[3] or ""
            target = MOVED.get(target, target)
            destination = DOCS / target
            generated = target.startswith("api/reference/")
            if anchor and not generated and anchor[1:] not in anchors(destination):
                anchor = ""
            if generated and target != "api/reference/index.md":
                anchor = ""  # the reference's anchors are operation summaries now, not operation IDs
            relative = os.path.relpath(destination, page.parent).replace(os.sep, "/")
            changed += 1
            if check:
                print(f"{page.relative_to(DOCS)}: {match[2]}{match[3] or ''} -> {relative}{anchor}")
            return f"{prefix}{relative}{anchor}"

        new = LINK.sub(fix, text)
        if new != text and not check:
            page.write_text(new)
    print(f"{changed} absolute link(s) {'found' if check else 'rewritten'}")
    return 1 if check and changed else 0


if __name__ == "__main__":
    raise SystemExit(main())
