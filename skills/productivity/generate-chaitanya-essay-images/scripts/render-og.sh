#!/usr/bin/env bash
# chaitanya.gg OG card: hand-drawn essay sketch as the field, clean Switzer
# title top-left, small domain bottom-left. 1200x630 JPEG.
set -euo pipefail

ART="$1"     # source art png (16:9 generation)
OUT="$2"
TITLE="$3"
SEMIBOLD="${SEMIBOLD:-/tmp/switzer/Switzer_Complete/Fonts/OTF/Switzer-Semibold.otf}"
MEDIUM="${MEDIUM:-/tmp/switzer/Switzer_Complete/Fonts/OTF/Switzer-Medium.otf}"

INK="#1c1b18"
MUTED="#71706a"

TITLE_PNG=$(mktemp --suffix=.png)
trap 'rm -f "$TITLE_PNG"' EXIT

convert -background none -fill "$INK" -font "$SEMIBOLD" \
  -size 760x220 -gravity northwest caption:"$TITLE" "$TITLE_PNG"

convert "$ART" -gravity center -crop '1536x806+0+60' +repage -resize '1200x630!' \
  "$TITLE_PNG" -gravity northwest -geometry +72+64 -composite \
  -font "$MEDIUM" -pointsize 26 -fill "$MUTED" \
  -gravity southwest -annotate +72+56 "chaitanya.gg" \
  -colorspace sRGB -quality 92 "$OUT"

echo "wrote $OUT"
