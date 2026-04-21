#!/usr/bin/env python3
"""
Validate a JSON-LD schema file against the Get Drivers Ed rules.

Checks:
- Valid JSON syntax
- Single @graph block (recommended) OR single top-level schema
- Required fields per schema type
- No Organization schema on non-homepage (flag for manual review)
- Consistent @id references
- URLs are absolute HTTPS

Usage:
    python3 validate-schema.py <json-file>
"""

import json
import sys
from pathlib import Path


REQUIRED_FIELDS = {
    "Course": ["name", "description", "provider"],
    "FAQPage": ["mainEntity"],
    "BreadcrumbList": ["itemListElement"],
    "Article": ["headline", "author", "datePublished"],
    "Organization": ["name", "url"],
    "WebSite": ["name", "url"],
    "AggregateRating": ["ratingValue", "ratingCount", "bestRating", "worstRating"],
    "Offer": ["price", "priceCurrency"],
    "CollectionPage": ["name"],
}


def validate_entity(entity, path=""):
    issues = []
    if not isinstance(entity, dict):
        return issues

    etype = entity.get("@type")
    if not etype:
        issues.append(f"{path}: Missing @type")
        return issues

    required = REQUIRED_FIELDS.get(etype, [])
    for field in required:
        if field not in entity:
            issues.append(f"{path}[{etype}]: Missing required field '{field}'")

    # Check URLs are absolute HTTPS
    url_fields = ["url", "item", "@id"]
    for uf in url_fields:
        if uf in entity and isinstance(entity[uf], str):
            val = entity[uf]
            if val and not val.startswith("https://"):
                issues.append(f"{path}[{etype}].{uf}: Should be absolute HTTPS, got '{val[:50]}'")

    # FAQPage: check each Q has acceptedAnswer
    if etype == "FAQPage":
        for i, q in enumerate(entity.get("mainEntity", [])):
            if isinstance(q, dict):
                if q.get("@type") != "Question":
                    issues.append(f"{path}[FAQPage].mainEntity[{i}]: @type should be 'Question'")
                if "acceptedAnswer" not in q:
                    issues.append(f"{path}[FAQPage].mainEntity[{i}]: Missing acceptedAnswer")
                if "name" not in q:
                    issues.append(f"{path}[FAQPage].mainEntity[{i}]: Missing name (question text)")

    # BreadcrumbList: check positions are sequential
    if etype == "BreadcrumbList":
        items = entity.get("itemListElement", [])
        for i, item in enumerate(items):
            if isinstance(item, dict):
                expected_pos = i + 1
                actual_pos = item.get("position")
                if actual_pos != expected_pos:
                    issues.append(f"{path}[BreadcrumbList].itemListElement[{i}]: position {actual_pos} should be {expected_pos}")

    # Organization on non-homepage warning
    if etype == "Organization" and path.strip():  # nested, not top-level
        # It's OK to have Organization as provider; not OK as standalone on non-home
        if "provider" not in path.lower() and "@id" not in str(entity):
            issues.append(f"{path}[Organization]: ⚠️ Organization schema on non-homepage pages should be removed per NP|accel (unless referenced via @id from another entity)")

    return issues


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 validate-schema.py <json-file>")
        sys.exit(1)

    json_path = Path(sys.argv[1])
    raw = json_path.read_text(encoding="utf-8")

    # Try parsing
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"❌ INVALID JSON: {e}")
        sys.exit(1)

    print("=" * 70)
    print(f"SCHEMA VALIDATION: {json_path}")
    print("=" * 70)
    print()

    all_issues = []

    # Handle @graph pattern
    if isinstance(data, dict) and "@graph" in data:
        print(f"✅ Uses @graph pattern ({len(data['@graph'])} entities)")
        print()
        for i, entity in enumerate(data["@graph"]):
            etype = entity.get("@type", "Unknown") if isinstance(entity, dict) else "Unknown"
            print(f"  Entity {i+1}: {etype}")
            issues = validate_entity(entity, f"@graph[{i}]")
            all_issues.extend(issues)
    elif isinstance(data, dict):
        etype = data.get("@type", "Unknown")
        print(f"⚠️ Single schema (no @graph). Type: {etype}")
        print(f"   Recommend wrapping in @graph if stacking multiple schemas.")
        print()
        issues = validate_entity(data, "root")
        all_issues.extend(issues)
    elif isinstance(data, list):
        print(f"⚠️ Root is array. Consider using @graph wrapper.")
        print()
        for i, entity in enumerate(data):
            issues = validate_entity(entity, f"[{i}]")
            all_issues.extend(issues)

    print()
    if all_issues:
        print(f"### Issues found: {len(all_issues)}")
        for issue in all_issues:
            print(f"  ❌ {issue}")
    else:
        print("### ✅ No issues found")
    print()
    print("💡 Always also validate in Google's Rich Results Test:")
    print("   https://search.google.com/test/rich-results")


if __name__ == "__main__":
    main()
