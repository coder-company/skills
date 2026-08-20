#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 6 ]]; then
  echo "usage: $0 INPUT OUTPUT TITLE AUTHOR DOMAIN FONT" >&2
  exit 2
fi

input=$1
output=$2
title=$3
author=$4
domain=$5
font=$6

for path in "$input" "$font"; do
  if [[ ! -f "$path" ]]; then
    echo "missing file: $path" >&2
    exit 2
  fi
done

if command -v magick >/dev/null 2>&1; then
  image=(magick)
  identify_image=(magick identify)
elif command -v convert >/dev/null 2>&1; then
  image=(convert)
  identify_image=(identify)
else
  echo "ImageMagick is required (magick or convert)" >&2
  exit 2
fi

mkdir -p "$(dirname "$output")"

"${image[@]}" "$input" \
  -resize '1200x630^' -gravity center -extent 1200x630 \
  -font "$font" \
  -fill '#F4F1EA' -pointsize 64 -gravity northwest -annotate +76+205 "$title" \
  -fill '#8EA8A4' -pointsize 28 -annotate +76+300 "$author" \
  -fill '#CDD5D2' -pointsize 20 -annotate +76+548 "$domain" \
  -colorspace sRGB -sampling-factor 4:2:0 -quality 88 -strip \
  "$output"

dimensions=$("${identify_image[@]}" -format '%wx%h' "$output")
if [[ "$dimensions" != "1200x630" ]]; then
  echo "unexpected dimensions: $dimensions" >&2
  exit 1
fi

echo "$output ($dimensions)"
