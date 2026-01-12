# Product Image Mapping

**Supported Formats**: This system supports PNG, JPG, and JPEG formats for source images. The `original.png` symlink can point to any of these formats.

This file helps you track which original image files correspond to which products.

## Product Directory Structure

| Product ID | Folder Name | Original Image Filename | Description |
|------------|-------------|------------------------|-------------|
| p001 | wireless-sensor | WirelessSensor_V2.jpg | Wireless Smart Sensor |
| p002 | industrial-controller | Controller_Main_2024.png | Industrial Controller |
| - | - | - | - |

## How to Add New Products

### Step 1: Create product folder with descriptive name

```bash
mkdir public/images/your-product-name
```

Use a descriptive folder name that you can easily recognize:
- ✅ Good: `wireless-sensor`, `temp-controller-v3`, `pressure-gauge-digital`
- ❌ Bad: `p001`, `prod1`, `img123`

### Step 2: Copy your images (keep original filenames!)

```bash
# Copy your original image files, keep their names!
cp ~/Downloads/MySensor_MainPhoto.jpg public/images/wireless-sensor/
cp ~/Downloads/MySensor_Detail1.png public/images/wireless-sensor/
cp ~/Downloads/MySensor_Detail2.jpg public/images/wireless-sensor/
```

Your folder should look like:
```
public/images/wireless-sensor/
├── MySensor_MainPhoto.jpg      # Your original filename
├── MySensor_Detail1.png        # Your original filename
└── MySensor_Detail2.jpg        # Your original filename
```

### Step 3: Run the processing script

```bash
./scripts/process-images.sh public/images/wireless-sensor
```

This will:
- ✅ Keep your original filenames intact
- ✅ Generate optimized versions (thumb.webp, preview.webp, g*.webp)
- ✅ Create an `original.png` symlink pointing to your main image
- ✅ Automatically process additional images as gallery

Result:
```
public/images/wireless-sensor/
├── MySensor_MainPhoto.jpg      # Your original (preserved)
├── MySensor_Detail1.png        # Your original (preserved)
├── MySensor_Detail2.jpg        # Your original (preserved)
├── original.png                # Symlink → MySensor_MainPhoto.jpg
├── thumb.webp                  # Generated
├── preview.webp                # Generated
├── g1.webp                     # Generated from Detail1
└── g2.webp                     # Generated from Detail2
```

### Step 4: Update catalog.json

Use the folder name as the product ID:

```json
{
  "id": "wireless-sensor",  // Same as folder name
  "published": true,
  "categoryId": "c01",
  "images": {
    "thumb": "/images/wireless-sensor/thumb.webp",
    "preview": "/images/wireless-sensor/preview.webp",
    "gallery": ["/images/wireless-sensor/g1.webp", "/images/wireless-sensor/g2.webp"],
    "original": "/images/wireless-sensor/original.png"
  }
}
```

### Step 5: Add this mapping to the table above

Update the table at the top of this file to track your products.

## Updating Product Images

When you need to update a product image:

1. **Find the product folder** - Use the descriptive folder name (e.g., `wireless-sensor`)
2. **Check the original filename** - Look at what file `original.png` links to, or check the table above
3. **Replace your original file** - Copy the new file with the same name
4. **Re-run the script**:
   ```bash
   ./scripts/process-images.sh public/images/wireless-sensor
   ```

## Quick Reference Commands

```bash
# List all products and their original images
for dir in public/images/*/; do
    echo "=== $(basename "$dir") ==="
    ls -l "$dir" | grep -v "webp"
done

# Batch process all products
for dir in public/images/*/; do
    ./scripts/process-images.sh "$dir"
done

# Find which folder contains a specific filename pattern
find public/images -name "*Sensor*"
```

## Tips

1. **Use descriptive folder names** - Makes finding products much easier
2. **Keep original filenames** - No need to rename to "original.png"
3. **All formats supported** - PNG, JPG, and JPEG source images are all supported
4. **Symlink mechanism** - `original.png` is a symlink that can point to any format
5. **Document in the table** - Keep the mapping table above updated
6. **Version your originals** - Include version numbers in filenames (e.g., `Sensor_V2.jpg`)
7. **Backup originals** - Keep a backup of your original images outside the project
