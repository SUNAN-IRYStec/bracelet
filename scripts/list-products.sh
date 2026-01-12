#!/bin/bash
# List all products and their original image files
# Usage: ./scripts/list-products.sh

IMAGES_DIR="public/images"

if [ ! -d "$IMAGES_DIR" ]; then
    echo "Error: $IMAGES_DIR directory not found"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Product Image Mapping"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

found_any=false

for dir in "$IMAGES_DIR"/*/ ; do
    [ -d "$dir" ] || continue

    folder_name=$(basename "$dir")
    found_any=true

    echo "📁 Product: $folder_name"
    echo "   Path: $dir"

    # Check if original.png exists and what it points to
    if [ -L "$dir/original.png" ]; then
        target=$(readlink "$dir/original.png")
        echo "   Main image: $target (via symlink)"
    elif [ -f "$dir/original.png" ]; then
        echo "   Main image: original.png (direct file)"
    else
        # Find the first non-generated image
        first_img=$(find "$dir" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) \
            ! -name "thumb.webp" ! -name "preview.webp" ! -name "g*.webp" \
            | head -1)
        if [ -n "$first_img" ]; then
            echo "   Main image: $(basename "$first_img") (not processed yet)"
        else
            echo "   ⚠️  No image files found"
        fi
    fi

    # Count gallery images
    gallery_count=$(find "$dir" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) \
        ! -name "thumb.webp" ! -name "preview.webp" ! -name "original.png" \
        | wc -l)

    if [ "$gallery_count" -gt 0 ]; then
        echo "   Gallery: $gallery_count additional image(s)"
        find "$dir" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) \
            ! -name "thumb.webp" ! -name "preview.webp" ! -name "original.png" \
            -exec basename {} \; | sed 's/^/     - /'
    fi

    # Check if processed
    if [ -f "$dir/thumb.webp" ] && [ -f "$dir/preview.webp" ]; then
        echo "   Status: ✓ Processed"
    else
        echo "   Status: ⚠️  Not processed (run: ./scripts/process-images.sh $dir)"
    fi

    echo ""
done

if [ "$found_any" = false ]; then
    echo "No product folders found in $IMAGES_DIR"
    echo ""
    echo "To add a product, run:"
    echo "  mkdir public/images/your-product-name"
    echo "  cp your_image.png public/images/your-product-name/"
    echo "  ./scripts/process-images.sh public/images/your-product-name"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
