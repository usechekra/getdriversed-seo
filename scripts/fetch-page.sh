#!/usr/bin/env bash
# Fetch a page's HTML cleanly and save to a file.
# Usage: ./fetch-page.sh <URL> [output-file]

set -euo pipefail

URL="${1:-}"
OUTPUT="${2:-page.html}"

if [[ -z "$URL" ]]; then
  echo "Usage: $0 <URL> [output-file]"
  exit 1
fi

# Use a realistic user-agent — some sites block default curl
curl -sL \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9" \
  "$URL" > "$OUTPUT"

echo "Fetched $URL → $OUTPUT"
echo "Size: $(wc -c < "$OUTPUT") bytes"
