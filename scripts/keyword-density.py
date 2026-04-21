#!/usr/bin/env python3
"""
Check keyword density for a primary keyword and halo keywords against page content.

Usage:
    python3 keyword-density.py <text-file> "<primary kw>" ["<halo1>" "<halo2>" ...]

Example:
    python3 keyword-density.py body.txt "new york 5-hour online pre-licensing course" \\
        "5 hour course online new york" "nyc pre licensing course online"
"""

import re
import sys
from pathlib import Path


def count_phrase(text: str, phrase: str) -> int:
    """Count case-insensitive occurrences of a phrase (word-boundary aware)."""
    pattern = r"\b" + re.escape(phrase) + r"\b"
    return len(re.findall(pattern, text, flags=re.IGNORECASE))


def main():
    if len(sys.argv) < 3:
        print('Usage: python3 keyword-density.py <text-file> "<primary kw>" ["<halo1>" ...]')
        sys.exit(1)

    text_path = Path(sys.argv[1])
    primary = sys.argv[2]
    halos = sys.argv[3:] if len(sys.argv) > 3 else []

    text = text_path.read_text(encoding="utf-8", errors="ignore")
    total_words = len(re.findall(r"\b\w+\b", text))

    print("=" * 70)
    print(f"KEYWORD DENSITY: {text_path}")
    print(f"Total words: {total_words}")
    print("=" * 70)
    print()

    # Primary
    p_count = count_phrase(text, primary)
    words_in_primary = len(primary.split())

    # Keyword density (standard SEO convention): treats the phrase as ONE instance
    # regardless of how many words it contains. 1 occurrence = 1 "keyword" in the text.
    # So: density = occurrences / total_words * 100
    p_density = (p_count / total_words * 100) if total_words else 0

    # Target occurrence range at 1.2–1.8% density, for THIS text size
    target_min = round(1.2 * total_words / 100)
    target_max = round(1.8 * total_words / 100)

    status_primary = "✅" if 1.2 <= p_density <= 1.8 else ("⚠️ under" if p_density < 1.2 else "⚠️ over")
    print(f"### Primary Keyword: \"{primary}\"")
    print(f"Occurrences: {p_count}")
    print(f"Density: {p_density:.2f}%  {status_primary} (target 1.2–1.8%)")
    print(f"Target occurrence range for this text length: {target_min}–{target_max} occurrences")
    if p_count < target_min:
        print(f"  → add {target_min - p_count} more occurrence(s) of the primary keyword")
    elif p_count > target_max:
        print(f"  → remove {p_count - target_max} occurrence(s) of the primary keyword")
    print()

    if halos:
        print("### Halo Keywords")
        for halo in halos:
            h_count = count_phrase(text, halo)
            status_halo = "✅" if 1 <= h_count <= 3 else ("⚠️ missing" if h_count == 0 else "⚠️ overused")
            print(f"  \"{halo}\" — {h_count}×  {status_halo} (target 1–2×)")
        print()

    # Flag any halo that's zero
    missing = [h for h in halos if count_phrase(text, h) == 0]
    if missing:
        print("### ⚠️ Missing halo keywords (add to body):")
        for h in missing:
            print(f"  - {h}")
        print()


if __name__ == "__main__":
    main()
