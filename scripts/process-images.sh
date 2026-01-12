#!/bin/bash
# Image processing script for product images
# Usage: ./scripts/process-images.sh public/images/wireless-sensor

set -e

# --------------------------------------------------
# Detect ImageMagick command
# IM7: magick
# IM6: convert
# --------------------------------------------------
if command -v magick &> /dev/null; then
    IM_CMD="magick"
elif command -v convert &> /dev/null; then
    IM_CMD="convert"
else
    echo "Error: ImageMagick is not installed."
    echo "Install with:"
    echo "  sudo apt install imagemagick"
    exit 1
fi

echo "✓ Using ImageMagick command: $IM_CMD"
echo ""

# --------------------------------------------------
# Argument check
# --------------------------------------------------
if [ -z "$1" ]; then
    echo "Usage: $0 <image-directory>"
    echo "Example: $0 public/images/wireless-sensor"
    exit 1
fi

DIR="$1"

if [ ! -d "$DIR" ]; then
    echo "Error: Directory '$DIR' does not exist"
    exit 1
fi

echo "Processing images in: $DIR"
echo ""

# --------------------------------------------------
# Find main image
# --------------------------------------------------
ORIGINAL=$(find "$DIR" -maxdepth 1 -type f \
    \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) \
    ! -name "thumb.webp" \
    ! -name "preview.webp" \
    ! -name "g*.webp" \
    ! -name "original.png" \
    | head -1)

# Fallback to original.png if nothing else found
if [ -z "$ORIGINAL" ]; then
    ORIGINAL=$(find "$DIR" -maxdepth 1 -type f -name "original.png" | head -1)
fi

if [ -z "$ORIGINAL" ]; then
    echo "Error: No image file found in $DIR"
    echo "Please add at least one PNG or JPG file"
    exit 1
fi

ORIGINAL_BASENAME=$(basename "$ORIGINAL")
echo "✓ Found main image: $ORIGINAL_BASENAME"

# --------------------------------------------------
# Create or update original.png symlink
# --------------------------------------------------
if [ "$ORIGINAL_BASENAME" != "original.png" ]; then
    [ -L "$DIR/original.png" ] && rm "$DIR/original.png"
    ln -sf "$ORIGINAL_BASENAME" "$DIR/original.png"
    echo "✓ Created symlink: original.png → $ORIGINAL_BASENAME"
fi

# --------------------------------------------------
# ImageMagick common options
# --------------------------------------------------
IM_OPTS=(
    -auto-orient     # Fix EXIF orientation and apply rotation to pixels
    -strip           # Remove EXIF/metadata (recommended for web)
)

# --------------------------------------------------
# Generate main images
# --------------------------------------------------
echo ""
echo "Generating optimized images..."

"$IM_CMD" "$ORIGINAL" \
    "${IM_OPTS[@]}" \
    -resize 600x\> \
    -quality 80 \
    "$DIR/thumb.webp"
echo "  ✓ thumb.webp (600px, proportional)"

"$IM_CMD" "$ORIGINAL" \
    "${IM_OPTS[@]}" \
    -resize 1200x\> \
    -quality 85 \
    "$DIR/preview.webp"
echo "  ✓ preview.webp (1200px, proportional)"

# --------------------------------------------------
# Process gallery images
# --------------------------------------------------
echo ""
echo "Looking for gallery images..."
count=0

shopt -s nullglob
for img in "$DIR"/*.{png,jpg,jpeg,PNG,JPG,JPEG}; do
    filename=$(basename "$img")

    if [ "$img" = "$ORIGINAL" ] || \
       [ "$filename" = "original.png" ] || \
       [ "$filename" = "thumb.webp" ] || \
       [ "$filename" = "preview.webp" ] || \
       [[ "$filename" =~ ^g[0-9]+\.webp$ ]]; then
        continue
    fi

    ((count++))
    echo "  Processing gallery image $count: $filename"

    "$IM_CMD" "$img" \
        "${IM_OPTS[@]}" \
        -resize 1600x\> \
        -quality 85 \
        "$DIR/g${count}.webp"

    echo "    ✓ Generated g${count}.webp"
done
shopt -u nullglob

if [ $count -eq 0 ]; then
    echo "  No additional gallery images found"
else
    echo "  ✓ Processed $count gallery image(s)"
fi

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Processing complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Source images (preserved):"
echo "  • $ORIGINAL_BASENAME"
[ $count -gt 0 ] && echo "  • $count additional gallery image(s)"
echo ""
echo "Generated files:"
echo "  • thumb.webp   (600px wide)"
echo "  • preview.webp (1200px wide)"
[ $count -gt 0 ] && echo "  • g1.webp → g${count}.webp (1600px wide)"
[ "$ORIGINAL_BASENAME" != "original.png" ] && echo "  • original.png → $ORIGINAL_BASENAME (symlink)"
echo ""
