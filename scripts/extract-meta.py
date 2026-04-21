#!/usr/bin/env python3
"""
Extract SEO-relevant elements from a page's HTML.

Usage:
    python3 extract-meta.py <html-file>
    python3 extract-meta.py page.html

Outputs:
    - Title + length
    - Meta description + length
    - Canonical
    - Meta robots
    - All headers (H1–H6) with nesting
    - Schema types present (JSON-LD)
    - Image count + alt coverage %
    - Internal/external link count
    - Visible word count estimate
"""

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class SEOExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.meta = {}
        self.canonical = ""
        self.headers = []  # list of (level, text)
        self.current_header = None
        self.in_title = False
        self.schema_blocks = []
        self.in_schema = False
        self.current_schema = ""
        self.images = []
        self.links = []
        self.current_link_href = None
        self.current_link_text = ""
        self.in_link = False
        self.visible_text_parts = []
        self.skip_text = False
        self.skip_tags = {"script", "style", "noscript"}

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            name = attrs_dict.get("name", "").lower()
            prop = attrs_dict.get("property", "").lower()
            content = attrs_dict.get("content", "")
            if name:
                self.meta[name] = content
            if prop:
                self.meta[prop] = content
        elif tag == "link" and attrs_dict.get("rel", "").lower() == "canonical":
            self.canonical = attrs_dict.get("href", "")
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.current_header = (int(tag[1]), "")
        elif tag == "script" and attrs_dict.get("type", "") == "application/ld+json":
            self.in_schema = True
            self.current_schema = ""
            self.skip_text = True
        elif tag == "img":
            self.images.append({
                "src": attrs_dict.get("src", ""),
                "alt": attrs_dict.get("alt", ""),
                "loading": attrs_dict.get("loading", ""),
            })
        elif tag == "a":
            href = attrs_dict.get("href", "")
            if href:
                self.current_link_href = href
                self.current_link_text = ""
                self.in_link = True
        elif tag in self.skip_tags:
            self.skip_text = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self.current_header:
            self.headers.append(self.current_header)
            self.current_header = None
        elif tag == "script" and self.in_schema:
            self.in_schema = False
            self.skip_text = False
            try:
                self.schema_blocks.append(json.loads(self.current_schema))
            except json.JSONDecodeError:
                self.schema_blocks.append({"_invalid": self.current_schema[:200]})
            self.current_schema = ""
        elif tag == "a" and self.in_link:
            self.links.append({
                "href": self.current_link_href,
                "text": self.current_link_text.strip(),
            })
            self.in_link = False
            self.current_link_href = None
        elif tag in self.skip_tags:
            self.skip_text = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.current_header is not None:
            self.current_header = (self.current_header[0], self.current_header[1] + data)
        if self.in_schema:
            self.current_schema += data
        if self.in_link:
            self.current_link_text += data
        if not self.skip_text and not self.in_schema:
            self.visible_text_parts.append(data)


def analyze(html_path: Path):
    html = html_path.read_text(encoding="utf-8", errors="ignore")
    extractor = SEOExtractor()
    extractor.feed(html)

    title = extractor.title.strip()
    meta_desc = extractor.meta.get("description", "")
    meta_robots = extractor.meta.get("robots", "index, follow (implied)")

    headers = [(lvl, txt.strip()) for lvl, txt in extractor.headers if txt.strip()]

    schema_types = []
    for block in extractor.schema_blocks:
        if isinstance(block, dict):
            if "@graph" in block:
                for item in block.get("@graph", []):
                    if isinstance(item, dict):
                        t = item.get("@type", "Unknown")
                        schema_types.append(t if isinstance(t, str) else ", ".join(t))
            else:
                t = block.get("@type", "Unknown")
                schema_types.append(t if isinstance(t, str) else ", ".join(t) if isinstance(t, list) else "Unknown")

    total_imgs = len(extractor.images)
    imgs_with_alt = sum(1 for img in extractor.images if img["alt"].strip())
    alt_pct = (imgs_with_alt / total_imgs * 100) if total_imgs else 0

    internal_links = [l for l in extractor.links if l["href"].startswith("/") or "getdriversed.com" in l["href"]]
    external_links = [l for l in extractor.links if l not in internal_links and (l["href"].startswith("http"))]

    visible_text = " ".join(extractor.visible_text_parts)
    visible_text = re.sub(r"\s+", " ", visible_text).strip()
    word_count = len(visible_text.split())

    # Build output
    print("=" * 70)
    print(f"SEO EXTRACTION: {html_path}")
    print("=" * 70)
    print()

    print("### Title")
    print(f"Text: {title}")
    print(f"Length: {len(title)} chars  {'✅' if 50 <= len(title) <= 60 else '⚠️ target 50–60'}")
    print()

    print("### Meta Description")
    print(f"Text: {meta_desc}")
    print(f"Length: {len(meta_desc)} chars  {'✅' if 140 <= len(meta_desc) <= 155 else '⚠️ target 140–155'}")
    print()

    print("### Meta Robots")
    print(f"Value: {meta_robots}")
    print()

    print("### Canonical")
    print(f"URL: {extractor.canonical or '⚠️ MISSING'}")
    print()

    print(f"### Headers ({len(headers)} total)")
    for lvl, txt in headers:
        indent = "  " * (lvl - 1)
        print(f"{indent}H{lvl}: {txt}")
    print()

    h1_count = sum(1 for lvl, _ in headers if lvl == 1)
    h2_count = sum(1 for lvl, _ in headers if lvl == 2)
    print(f"H1 count: {h1_count}  {'✅' if h1_count == 1 else '⚠️ should be exactly 1'}")
    print(f"H2 count: {h2_count}  {'✅' if 5 <= h2_count <= 8 else '⚠️ target 6–7 for state course page'}")
    print()

    print(f"### Schema Types ({len(schema_types)} detected)")
    for t in schema_types:
        print(f"  - {t}")
    print()

    print(f"### Images")
    print(f"Total: {total_imgs}")
    print(f"With alt text: {imgs_with_alt} ({alt_pct:.0f}%)  {'✅' if alt_pct == 100 else '⚠️ fill remaining'}")
    print()

    print(f"### Links")
    print(f"Internal: {len(internal_links)}  {'✅' if len(internal_links) >= 2 else '⚠️ need ≥ 2'}")
    print(f"External: {len(external_links)}  {'✅' if len(external_links) == 0 else '⚠️ remove from commercial pages'}")
    print()

    print(f"### Visible Word Count (approx)")
    print(f"Words: {word_count}  {'✅' if word_count >= 1200 else '⚠️ target ≥ 1,200 for course pages'}")
    print()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 extract-meta.py <html-file>")
        sys.exit(1)
    analyze(Path(sys.argv[1]))
