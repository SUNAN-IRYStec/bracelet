# Product Showcase Site

A mobile-first product showcase website built with Vite + Vanilla TypeScript. Features multi-language support (English, Chinese, French), category-based browsing, product search, and smooth image loading.

## Features

- **Multi-language**: English (default), Chinese, French
- **Category Management**: Sort and organize products by categories
- **Search**: Real-time product search by name and tags
- **Image Optimization**: Three-tier image system (thumb/preview/original)
- **Mobile-First**: Responsive design optimized for mobile devices
- **Lazy Loading**: Intersection Observer for smooth scrolling
- **Hash Routing**: GitHub Pages-compatible routing
- **Static Deployment**: Deploys to GitHub Pages via GitHub Actions

## Project Structure

```
bracelet/
├── public/
│   ├── data/
│   │   └── catalog.json          # Product and category data
│   ├── images/
│   │   └── p001/                 # Product image folders
│   │       ├── original.png
│   │       ├── thumb.webp
│   │       ├── preview.webp
│   │       └── g1.webp
│   └── locales/
│       ├── en.json               # English translations
│       ├── zh.json               # Chinese translations
│       └── fr.json               # French translations
├── src/
│   ├── main.ts                   # App entry point
│   ├── router.ts                 # Hash router
│   ├── i18n.ts                   # Internationalization
│   ├── data/catalog.ts           # Data service layer
│   ├── pages/                    # Page components
│   ├── components/               # Reusable components
│   └── styles/main.css           # Global styles
└── scripts/
    └── process-images.sh         # Image processing script
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- ImageMagick (for image processing)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Products

**Supported Image Formats**: The system supports PNG, JPG, and JPEG formats for source images. All processed images will be converted to WebP format for optimal web performance.

### 1. Create Product Folder (Use Descriptive Names!)

**Important**: Use descriptive folder names that match your product names, not generic IDs like "p001".

```bash
# ✅ Good - descriptive and memorable
mkdir public/images/wireless-sensor
mkdir public/images/industrial-controller-v2
mkdir public/images/temperature-gauge

# ❌ Bad - hard to maintain
mkdir public/images/p001
mkdir public/images/p002
```

### 2. Add Your Images (Keep Original Filenames!)

Copy your images **with their original filenames** - no need to rename them!

```bash
# Copy your images keeping their original names
cp ~/Downloads/MySensorPhoto_2024.jpg public/images/wireless-sensor/
cp ~/Downloads/Sensor_Detail1.jpg public/images/wireless-sensor/
cp ~/Downloads/Sensor_Detail2.png public/images/wireless-sensor/
```

Your folder now looks like:
```
public/images/wireless-sensor/
├── MySensorPhoto_2024.jpg    # Your original filename (preserved!)
├── Sensor_Detail1.jpg         # Gallery image 1
└── Sensor_Detail2.png         # Gallery image 2
```

### 3. Process Images

Run the script - it will automatically find your images:

```bash
./scripts/process-images.sh public/images/wireless-sensor
```

The script will:
- ✅ Find your first image as the main image (regardless of filename)
- ✅ Keep your original filenames intact
- ✅ Create an `original.png` symlink (points to your actual source file, regardless of format)
- ✅ Generate optimized versions: `thumb.webp` (600px), `preview.webp` (1200px)
- ✅ Process additional images as gallery: `g1.webp`, `g2.webp` (1600px)

Result:
```
public/images/wireless-sensor/
├── MySensorPhoto_2024.jpg    # Your original (preserved)
├── Sensor_Detail1.jpg         # Your original (preserved)
├── Sensor_Detail2.png         # Your original (preserved)
├── original.png               # Symlink → MySensorPhoto_2024.jpg
├── thumb.webp                 # Generated
├── preview.webp               # Generated
├── g1.webp                    # Generated
└── g2.webp                    # Generated
```

### 4. List All Products (Optional)

View all your products and their original filenames:

```bash
./scripts/list-products.sh
```

This shows you which original files map to which product folders.

### 5. Update catalog.json

Add your product to `public/data/catalog.json`:

```json
{
  "id": "wireless-sensor",        // Use folder name as ID!
  "published": true,
  "categoryId": "c01",
  "sortInCategory": 90,
  "nameKey": "product.wireless-sensor.name",
  "shortDescKey": "product.wireless-sensor.shortDesc",
  "longDescKey": "product.wireless-sensor.longDesc",
  "tags": ["hand", "cutie"],
  "priceText": "€399",
  "images": {
    "thumb": "/images/wireless-sensor/thumb.webp",
    "preview": "/images/wireless-sensor/preview.webp",
    "gallery": ["/images/wireless-sensor/g1.webp", "/images/wireless-sensor/g2.webp"],
    "original": "/images/wireless-sensor/original.png"
  },
  "specs": [
    { "k": "specs.size", "v": "12cm x 6cm" },
    { "k": "specs.weight", "v": "100g" }
  ]
}
```

**Important**: Use the same folder name as the product ID for easy tracking!

### 6. Add Translations

Update translation files in `public/locales/`:

**en.json**:
```json
{
  "product.wireless-sensor.name": "Wireless Smart Sensor",
  "product.wireless-sensor.shortDesc": "Plug and play, low power design",
  "product.wireless-sensor.longDesc": "Detailed description..."
}
```

**zh.json**:
```json
{
  "product.wireless-sensor.name": "无线智能传感器",
  "product.wireless-sensor.shortDesc": "即插即用，低功耗设计",
  "product.wireless-sensor.longDesc": "详细描述..."
}
```

**fr.json**:
```json
{
  "product.wireless-sensor.name": "Capteur Intelligent Sans Fil",
  "product.wireless-sensor.shortDesc": "Plug and play, conception basse consommation",
  "product.wireless-sensor.longDesc": "Description détaillée..."
}
```

### 7. Managing Product Images

**Important Note on Symlinks:**
- The `original.png` is a symbolic link that can point to any format (.jpg, .png, .jpeg)
- Your source files keep their original filenames and extensions
- The catalog.json always uses `/images/*/original.png` path for consistency
- Browsers identify image format by content (Content-Type header), not extension

**To update an image later:**

1. Find your product folder by its descriptive name (e.g., `public/images/wireless-sensor`)
2. Check which file is the original:
   ```bash
   ls -l public/images/wireless-sensor/original.png
   ```
   This shows: `original.png -> MySensorPhoto_2024.png`
3. Replace your original file with the same name
4. Re-process:
   ```bash
   ./scripts/process-images.sh public/images/wireless-sensor
   ```

**To see all products and their mappings:**

```bash
./scripts/list-products.sh
```

Output example:
```
📁 Product: wireless-sensor
   Path: public/images/wireless-sensor/
   Main image: MySensorPhoto_2024.png (via symlink)
   Gallery: 2 additional image(s)
     - Sensor_Detail1.png
     - Sensor_Detail2.png
   Status: ✓ Processed
```

See [PRODUCT_MAPPING.md](PRODUCT_MAPPING.md) for more details on managing product images.

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set Source to "GitHub Actions"
4. The site will automatically deploy on push to `main` branch

**Note**: Update `base` in `vite.config.ts` to match your repository name:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## Configuration

### Contact Information

Update contact details in `public/data/catalog.json`:

```json
{
  "contact": {
    "email": "your@email.com",
    "phone": "+1 234 567 8900"
  }
}
```

### Adding Categories

Add new categories to `catalog.json`:

```json
{
  "categories": [
    {
      "id": "c03",
      "nameKey": "category.newcategory",
      "sort": 80,
      "featuredProductId": "p004"
    }
  ]
}
```

Then add translations for `category.newcategory` in all locale files.

## Additional Documentation

- **[CATALOG_GUIDE.md](CATALOG_GUIDE.md)** - Complete reference for catalog.json data structure
  - Category fields explained
  - Product fields explained
  - Translation keys
  - Images and specs

- **[QUICK_START.md](QUICK_START.md)** - Quick start guide (Chinese) for adding products

- **[PRODUCT_MAPPING.md](PRODUCT_MAPPING.md)** - Product image mapping and management

## Development Tips

- **Hot reload**: Changes to source files trigger automatic reload
- **Image optimization**: Always process images before committing
- **Translations**: Keep translation keys consistent across all locale files
- **Product IDs**: Use descriptive IDs (e.g., wireless-sensor, temp-gauge-v2)
- **Category sorting**: Higher `sort` values appear first

## License

MIT
