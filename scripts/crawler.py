#!/usr/bin/env python3
"""
SEO Spider — Crawl a website and analyze every page for:
  - Title, meta description, canonical, robots
  - H1–H6 headings structure
  - Keyword presence (check your target KWs against page content)
  - Word count, image alt coverage
  - Internal link graph
  - Schema types present
  - Duplicate title/meta detection across the site
  - Missing / thin content flags

Usage:
    # Crawl a site (up to 200 pages by default):
    python3 crawler.py https://www.getdriversed.com

    # Crawl competitor, limit to 50 pages:
    python3 crawler.py https://www.driversed.com --limit 50

    # Crawl + check for specific keywords:
    python3 crawler.py https://www.getdriversed.com --keywords "drivers ed,pre-licensing,online course"

    # Crawl only pages matching a path pattern:
    python3 crawler.py https://www.getdriversed.com --path-filter "/courses-details/"

    # Save full CSV report:
    python3 crawler.py https://www.getdriversed.com --output reports/crawl-report.csv

Requirements:
    pip install requests beautifulsoup4 lxml
"""

import argparse
import csv
import json
import re
import sys
import time
from collections import defaultdict, deque
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing dependencies. Run: pip install requests beautifulsoup4 lxml")
    sys.exit(1)

# ── Constants ────────────────────────────────────────────────────────────────

DEFAULT_LIMIT      = 200
DEFAULT_DELAY      = 0.5          # seconds between requests (be polite)
DEFAULT_TIMEOUT    = 15
USER_AGENT         = (
    "Mozilla/5.0 (compatible; GDE-SEO-Crawler/1.0; "
    "+https://getdriversed.com)"
)
THIN_CONTENT_WORDS = 300          # pages below this are flagged thin
TARGET_WORDS       = 1200         # NP|accel recommended minimum for course pages

# ── Helpers ──────────────────────────────────────────────────────────────────

def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()

def word_count(text: str) -> int:
    return len(text.split()) if text else 0

def get_schema_types(soup) -> list:
    types = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "")
            if isinstance(data, dict):
                if "@graph" in data:
                    for item in data["@graph"]:
                        t = item.get("@type", "")
                        types.append(t if isinstance(t, str) else ", ".join(t))
                else:
                    t = data.get("@type", "")
                    if t:
                        types.append(t if isinstance(t, str) else ", ".join(t))
        except (json.JSONDecodeError, AttributeError):
            pass
    return types

def is_same_domain(url: str, base: str) -> bool:
    return urlparse(url).netloc == urlparse(base).netloc

def normalize_url(url: str) -> str:
    p = urlparse(url)
    # strip fragment, lowercase scheme+host
    return p._replace(fragment="", scheme=p.scheme.lower(), netloc=p.netloc.lower()).geturl()

def keyword_hits(text: str, keywords: list) -> dict:
    text_lower = text.lower()
    return {kw: text_lower.count(kw.lower()) for kw in keywords}

# ── Page analysis ─────────────────────────────────────────────────────────────

def analyze_page(url: str, html: str, keywords: list, base_domain: str) -> dict:
    soup = BeautifulSoup(html, "lxml")

    # Remove script/style noise
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    # Title
    title_tag = soup.find("title")
    title = clean(title_tag.get_text()) if title_tag else ""

    # Meta description
    meta_desc_tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    meta_desc = clean(meta_desc_tag.get("content", "")) if meta_desc_tag else ""

    # Robots
    robots_tag = soup.find("meta", attrs={"name": re.compile(r"^robots$", re.I)})
    robots = clean(robots_tag.get("content", "")) if robots_tag else "index, follow (implied)"

    # Canonical
    canonical_tag = soup.find("link", rel="canonical")
    canonical = canonical_tag.get("href", "") if canonical_tag else ""

    # H1–H6
    headers = {}
    for lvl in range(1, 7):
        tags = soup.find_all(f"h{lvl}")
        headers[f"h{lvl}"] = [clean(t.get_text()) for t in tags if clean(t.get_text())]

    h1_count  = len(headers["h1"])
    h2_count  = len(headers["h2"])
    h1_text   = " | ".join(headers["h1"])
    h2_texts  = " | ".join(headers["h2"])

    # Body text
    body_text = clean(soup.get_text(separator=" "))
    wc = word_count(body_text)

    # Images
    images    = soup.find_all("img")
    img_total = len(images)
    img_no_alt = sum(1 for i in images if not i.get("alt", "").strip())

    # Links
    links          = soup.find_all("a", href=True)
    internal_links = []
    external_links = []
    for a in links:
        href = urljoin(url, a["href"])
        norm = normalize_url(href)
        if is_same_domain(norm, base_domain):
            internal_links.append(norm)
        elif urlparse(norm).scheme in ("http", "https"):
            external_links.append(norm)

    # Schema
    schema_types = get_schema_types(soup)

    # Keyword analysis
    kw_hits = keyword_hits(body_text, keywords) if keywords else {}

    # Flags
    flags = []
    if not title:               flags.append("MISSING_TITLE")
    if len(title) < 30:         flags.append("TITLE_TOO_SHORT")
    if len(title) > 65:         flags.append("TITLE_TOO_LONG")
    if not meta_desc:           flags.append("MISSING_META_DESC")
    if len(meta_desc) < 120:    flags.append("META_DESC_SHORT")
    if len(meta_desc) > 160:    flags.append("META_DESC_LONG")
    if not canonical:           flags.append("MISSING_CANONICAL")
    if h1_count == 0:           flags.append("MISSING_H1")
    if h1_count > 1:            flags.append("MULTIPLE_H1")
    if wc < THIN_CONTENT_WORDS: flags.append("THIN_CONTENT")
    if img_no_alt > 0:          flags.append(f"IMG_MISSING_ALT({img_no_alt})")
    if len(external_links) > 0: flags.append(f"EXTERNAL_LINKS({len(external_links)})")
    if "noindex" in robots.lower(): flags.append("NOINDEX")

    return {
        "url":            url,
        "title":          title,
        "title_len":      len(title),
        "meta_desc":      meta_desc,
        "meta_desc_len":  len(meta_desc),
        "robots":         robots,
        "canonical":      canonical,
        "h1_count":       h1_count,
        "h1_text":        h1_text,
        "h2_count":       h2_count,
        "h2_texts":       h2_texts,
        "h3_texts":       " | ".join(headers["h3"]),
        "word_count":     wc,
        "img_total":      img_total,
        "img_no_alt":     img_no_alt,
        "internal_links": len(set(internal_links)),
        "external_links": len(external_links),
        "schema_types":   ", ".join(schema_types),
        "flags":          " | ".join(flags),
        "kw_hits":        json.dumps(kw_hits),
        "_outlinks":      list(set(internal_links)),  # for crawl queue (stripped in CSV)
    }

# ── Crawler ───────────────────────────────────────────────────────────────────

def crawl(
    start_url: str,
    limit: int        = DEFAULT_LIMIT,
    delay: float      = DEFAULT_DELAY,
    keywords: list    = None,
    path_filter: str  = None,
    output: str       = None,
    verbose: bool     = True,
) -> list:

    keywords   = keywords or []
    base_domain = start_url
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    queue    = deque([normalize_url(start_url)])
    visited  = set()
    results  = []

    print(f"\n{'='*65}")
    print(f"  GDE SEO Crawler")
    print(f"  Start: {start_url}")
    print(f"  Limit: {limit} pages | Delay: {delay}s | Keywords: {keywords or 'none'}")
    if path_filter:
        print(f"  Path filter: {path_filter}")
    print(f"{'='*65}\n")

    while queue and len(results) < limit:
        url = queue.popleft()

        if url in visited:
            continue
        visited.add(url)

        # Apply path filter
        if path_filter and path_filter not in urlparse(url).path:
            continue

        # Skip non-HTML resources
        if re.search(r"\.(pdf|jpg|jpeg|png|gif|svg|css|js|zip|xml|txt|ico)(\?|$)", url, re.I):
            continue

        try:
            resp = session.get(url, timeout=DEFAULT_TIMEOUT, allow_redirects=True)
            final_url = normalize_url(resp.url)

            # Only process HTML
            ct = resp.headers.get("Content-Type", "")
            if "text/html" not in ct:
                continue

            data = analyze_page(final_url, resp.text, keywords, base_domain)
            results.append(data)

            # Queue discovered internal links
            for link in data["_outlinks"]:
                if link not in visited:
                    queue.append(link)

            # Progress
            flag_summary = data["flags"] or "✅ clean"
            if verbose:
                print(f"[{len(results):>3}] {final_url[:70]}")
                print(f"       Title({data['title_len']}): {data['title'][:60]}")
                print(f"       H1({data['h1_count']}) WC:{data['word_count']} Schema:{data['schema_types'] or 'none'}")
                print(f"       Flags: {flag_summary}")
                print()

            time.sleep(delay)

        except requests.RequestException as e:
            if verbose:
                print(f"[ERR] {url} — {e}")
            continue

    # ── Site-wide duplicate detection ─────────────────────────────────────────
    title_map    = defaultdict(list)
    meta_map     = defaultdict(list)
    for r in results:
        if r["title"]:     title_map[r["title"]].append(r["url"])
        if r["meta_desc"]: meta_map[r["meta_desc"]].append(r["url"])

    for r in results:
        if len(title_map[r["title"]]) > 1:
            r["flags"] = (r["flags"] + " | DUP_TITLE").strip(" |")
        if len(meta_map[r["meta_desc"]]) > 1:
            r["flags"] = (r["flags"] + " | DUP_META").strip(" |")

    # ── Summary ───────────────────────────────────────────────────────────────
    total       = len(results)
    thin        = sum(1 for r in results if "THIN_CONTENT" in r["flags"])
    no_h1       = sum(1 for r in results if "MISSING_H1" in r["flags"])
    dup_titles  = sum(1 for r in results if "DUP_TITLE" in r["flags"])
    dup_metas   = sum(1 for r in results if "DUP_META" in r["flags"])
    no_schema   = sum(1 for r in results if not r["schema_types"])
    noindex     = sum(1 for r in results if "NOINDEX" in r["flags"])

    print(f"\n{'='*65}")
    print(f"  CRAWL SUMMARY — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*65}")
    print(f"  Pages crawled:        {total}")
    print(f"  Thin content (<{THIN_CONTENT_WORDS}w): {thin}  ({thin/total*100:.0f}%)" if total else "")
    print(f"  Missing H1:           {no_h1}")
    print(f"  Duplicate titles:     {dup_titles}")
    print(f"  Duplicate meta descs: {dup_metas}")
    print(f"  No schema markup:     {no_schema}")
    print(f"  Noindex pages:        {noindex}")
    print(f"{'='*65}\n")

    # ── CSV export ────────────────────────────────────────────────────────────
    if output:
        out_path = Path(output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        csv_fields = [
            "url", "title", "title_len", "meta_desc", "meta_desc_len",
            "robots", "canonical", "h1_count", "h1_text", "h2_count",
            "h2_texts", "h3_texts", "word_count", "img_total", "img_no_alt",
            "internal_links", "external_links", "schema_types", "flags", "kw_hits"
        ]
        with open(out_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=csv_fields, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(results)
        print(f"  📄 Report saved to: {out_path}\n")

    return results


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="GDE SEO Crawler — analyze any website for keywords, headings, schema, duplicates"
    )
    parser.add_argument("url",           help="Start URL to crawl (e.g. https://www.getdriversed.com)")
    parser.add_argument("--limit",       type=int,   default=DEFAULT_LIMIT, help=f"Max pages to crawl (default: {DEFAULT_LIMIT})")
    parser.add_argument("--delay",       type=float, default=DEFAULT_DELAY, help=f"Delay between requests in seconds (default: {DEFAULT_DELAY})")
    parser.add_argument("--keywords",    type=str,   default="",            help='Comma-separated keywords to count on each page (e.g. "drivers ed,pre-licensing")')
    parser.add_argument("--path-filter", type=str,   default="",            help='Only crawl URLs containing this path (e.g. /courses-details/)')
    parser.add_argument("--output",      type=str,   default="",            help="Save CSV report to this path (e.g. reports/crawl.csv)")
    parser.add_argument("--quiet",       action="store_true",               help="Suppress per-page output, show summary only")

    args = parser.parse_args()

    keywords = [k.strip() for k in args.keywords.split(",") if k.strip()]

    crawl(
        start_url   = args.url,
        limit       = args.limit,
        delay       = args.delay,
        keywords    = keywords,
        path_filter = args.path_filter or None,
        output      = args.output or None,
        verbose     = not args.quiet,
    )


if __name__ == "__main__":
    main()
