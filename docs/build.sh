#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PARTIALS_DIR="$SCRIPT_DIR/_partials"
PAGES_DIR="$SCRIPT_DIR/_pages"
OUT_DIR="$ROOT_DIR/build"

CURRENT_YEAR="$(date +%Y)"
CURRENT_MONTH="$(date +%Y-%m)"
CURRENT_DATE="$(date +%Y-%m-%d)"

if [[ ! -d "$PARTIALS_DIR" || ! -d "$PAGES_DIR" ]]; then
  echo "Missing build source directories in $SCRIPT_DIR"
  exit 1
fi

if [[ ! -f "$SCRIPT_DIR/styles.css" || ! -f "$SCRIPT_DIR/app.js" || ! -d "$SCRIPT_DIR/assets" ]]; then
  echo "Missing required static source files in $SCRIPT_DIR"
  exit 1
fi

mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR"/*.html

cp "$SCRIPT_DIR/styles.css" "$OUT_DIR/styles.css"
cp "$SCRIPT_DIR/app.js" "$OUT_DIR/app.js"
rm -rf "$OUT_DIR/assets"
cp -a "$SCRIPT_DIR/assets" "$OUT_DIR/assets"

echo "Building static pages from $PAGES_DIR"
echo "Date: $CURRENT_DATE"
echo "Output: $OUT_DIR"

for page in "$PAGES_DIR"/*.html; do
  [[ -f "$page" ]] || continue

  filename="$(basename "$page")"
  if [[ "$filename" == _* ]]; then
    echo "Skipping template page: $filename"
    continue
  fi

  page_title="$(sed -n 's/^[[:space:]]*<!--[[:space:]]*TITLE:[[:space:]]*\(.*\)[[:space:]]*-->[[:space:]]*$/\1/p' "$page" | head -n1 | sed 's/[[:space:]]*$//')"
  page_description="$(sed -n 's/^[[:space:]]*<!--[[:space:]]*DESCRIPTION:[[:space:]]*\(.*\)[[:space:]]*-->[[:space:]]*$/\1/p' "$page" | head -n1 | sed 's/[[:space:]]*$//')"
  nav_active="$(sed -n 's/^[[:space:]]*<!--[[:space:]]*NAV:[[:space:]]*\([A-Za-z0-9_-]*\)[[:space:]]*-->[[:space:]]*$/\1/p' "$page" | head -n1)"

  page_title="${page_title:-Research}"
  page_description="${page_description:-A lightweight public portal for BC Government AI research papers and briefs.}"

  header="$(cat "$PARTIALS_DIR/header.html")"
  footer="$(cat "$PARTIALS_DIR/footer.html")"
  content="$(sed '/^[[:space:]]*<!--[[:space:]]*\(TITLE\|DESCRIPTION\|NAV\):.*-->[[:space:]]*$/d' "$page")"

  document="$header"$'\n'"$content"$'\n'"$footer"

  document="${document//\{\{PAGE_TITLE\}\}/$page_title}"
  document="${document//\{\{PAGE_DESCRIPTION\}\}/$page_description}"
  document="${document//\{\{YEAR\}\}/$CURRENT_YEAR}"
  document="${document//\{\{CURRENT_MONTH\}\}/$CURRENT_MONTH}"
  document="${document//\{\{CURRENT_DATE\}\}/$CURRENT_DATE}"

  if [[ -n "$nav_active" ]]; then
    nav_key="$(echo "$nav_active" | tr '[:lower:]-' '[:upper:]_')"
    document="${document//\{\{NAV_${nav_key}\}\}/active}"
  fi

  document="${document//\{\{NAV_INDEX\}\}/}"
  document="${document//\{\{NAV_COMPUTE\}\}/}"
  document="${document//\{\{NAV_PUBLICATIONS\}\}/}"

  output_file="$OUT_DIR/$filename"
  printf "%s\n" "$document" > "$output_file"
  echo "Built: $output_file"
done

echo "Build complete."
