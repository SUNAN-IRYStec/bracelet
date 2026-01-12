# Catalog Configuration Guide

This guide explains the data structure of `public/data/catalog.json` and how each field is used in the application.

---

## Table of Contents

1. [Category Object](#category-object)
2. [Product Object](#product-object)
3. [Contact Object](#contact-object)
4. [Complete Example](#complete-example)

---

## Category Object

Categories organize products into groups and appear on the homepage.

### Structure

```json
{
  "id": "c01",
  "nameKey": "category.sensors",
  "sort": 100,
  "featuredProductId": "wireless-sensor"
}
```

### Field Reference

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **id** | string | ✅ Yes | Unique category identifier | `"c01"`, `"sensors"` |
| **nameKey** | string | ✅ Yes | Translation key for category name | `"category.sensors"` |
| **sort** | number | ✅ Yes | Display order (higher = first) | `100` |
| **featuredProductId** | string | ❌ Optional | Product to showcase for this category | `"wireless-sensor"` |

### How Fields Are Used

#### nameKey - Category Display Name

**Purpose:** Internationalization (i18n) key that maps to translated category names.

**Usage in code:** `i18n.t(category.nameKey)`

**Translation files:**
```json
// en.json
"category.sensors": "Sensors"

// zh.json
"category.sensors": "传感器"

// fr.json
"category.sensors": "Capteurs"
```

**Where displayed:**
- Homepage category cards
- Category page headers
- Navigation menus

**Naming convention:** `category.{identifier}`

---

#### sort - Display Order

**Purpose:** Controls the order categories appear on the homepage.

**Sorting logic:** Descending order (higher values appear first)

```typescript
// Code: src/data/catalog.ts:62
return [...catalog.categories].sort((a, b) => b.sort - a.sort);
```

**Examples:**
```json
[
  {"id": "c01", "sort": 100},  // Displays 1st
  {"id": "c02", "sort": 100},  // Displays 2nd (same value = original order)
  {"id": "c03", "sort": 90},   // Displays 3rd
  {"id": "c04", "sort": 80}    // Displays 4th
]
```

**Best practices:**
- Use increments of 10 (90, 100, 110) to allow easy insertion
- New categories: use high values to appear first
- Equal values: maintain stable order from JSON array

---

#### featuredProductId - Showcase Product

**Purpose:** Specifies which product image to display on the category card.

**Display location:** Homepage category card thumbnail

```typescript
// Code: src/data/catalog.ts:82-89
getFeaturedProduct(category: Category): Product | undefined {
  if (category.featuredProductId) {
    return this.getProductById(category.featuredProductId);
  }
  // Fallback: use first product in category
  const products = this.getProductsByCategory(category.id);
  return products[0];
}
```

**Behavior:**
- **If specified:** Uses the designated product's thumbnail
- **If omitted:** Automatically uses the first product (highest `sortInCategory`)

**Best practices:**
- Choose your most representative or newest product
- Use products with high-quality images
- Update when adding better products

---

## Product Object

Products are the core content items displayed throughout the site.

### Structure

```json
{
  "id": "wireless-sensor",
  "published": true,
  "categoryId": "c01",
  "sortInCategory": 100,
  "nameKey": "product.wireless-sensor.name",
  "shortDescKey": "product.wireless-sensor.shortDesc",
  "longDescKey": "product.wireless-sensor.longDesc",
  "tags": ["hand", "cutie"],
  "priceText": "€299",
  "images": {
    "thumb": "/images/wireless-sensor/thumb.webp",
    "preview": "/images/wireless-sensor/preview.webp",
    "gallery": ["/images/wireless-sensor/g1.webp"],
    "original": "/images/wireless-sensor/original.png"
  },
  "specs": [
    { "k": "specs.size", "v": "10cm x 5cm" },
    { "k": "specs.weight", "v": "80g" }
  ]
}
```

### Basic Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **id** | string | ✅ Yes | Unique product identifier (used in URLs) | `"wireless-sensor"` |
| **published** | boolean | ✅ Yes | Controls product visibility | `true` / `false` |
| **categoryId** | string | ✅ Yes | Parent category ID | `"c01"` |
| **sortInCategory** | number | ✅ Yes | Display order within category (higher = first) | `100` |

#### id - Product Identifier

**Purpose:** Unique identifier for routing and lookups.

**Where used:**
- URL routing: `https://site.com/#/p/wireless-sensor`
- Category listings
- Featured product references
- Search results

**Naming recommendations:**
- ✅ Descriptive: `wireless-sensor`, `industrial-controller-v2`
- ❌ Generic: `p001`, `prod1`
- Use folder name for easy management

---

#### published - Visibility Control

**Purpose:** Hide products without deleting them from the catalog.

**Behavior:**
```typescript
// Code: src/data/catalog.ts:72
return catalog.products.find((p) => p.id === id && p.published);
```

**Effects when `published: false`:**
- ❌ Not shown in category lists
- ❌ Not shown in search results
- ❌ Direct URL access returns "Product not found"
- ❌ Won't appear as featured product

**Use cases:**
- Temporarily hide out-of-stock items
- Prepare products before launch
- Archive discontinued products

---

#### sortInCategory - Category Ordering

**Purpose:** Controls display order within category pages.

**Sorting logic:** Descending order (higher values first)

```typescript
// Code: src/data/catalog.ts:79
.sort((a, b) => b.sortInCategory - a.sortInCategory);
```

**Best practices:**
- New products: higher values (110, 120)
- Standard products: 100
- Older products: lower values (90, 80)
- Equal values: preserve JSON order

---

### Internationalization Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **nameKey** | string | ✅ Yes | Translation key for product name |
| **shortDescKey** | string | ✅ Yes | Translation key for brief description |
| **longDescKey** | string | ✅ Yes | Translation key for detailed description |

#### Translation Keys Usage

**How they work:**
```typescript
// Code: src/pages/product.ts:89, 109
name.textContent = i18n.t(product.nameKey);        // Display translated name
desc.textContent = i18n.t(product.longDescKey);    // Display translated description
```

**Where each key is displayed:**

| Key | Display Locations |
|-----|------------------|
| **nameKey** | Product cards, detail page title, image alt text |
| **shortDescKey** | Product cards subtitle |
| **longDescKey** | Product detail page main content |

**Translation file example:**
```json
// en.json
{
  "product.wireless-sensor.name": "Wireless Smart Sensor",
  "product.wireless-sensor.shortDesc": "Plug and play, low power design",
  "product.wireless-sensor.longDesc": "This wireless smart sensor features plug-and-play installation and advanced low-power design for extended battery life. Perfect for IoT applications and industrial monitoring."
}

// zh.json
{
  "product.wireless-sensor.name": "无线智能传感器",
  "product.wireless-sensor.shortDesc": "即插即用，低功耗设计",
  "product.wireless-sensor.longDesc": "这款无线智能传感器采用即插即用安装方式和先进的低功耗设计，电池寿命更长。非常适合物联网应用和工业监控。"
}
```

**Naming convention:** `product.{product-id}.{type}`

---

### Tags and Pricing

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **tags** | string[] | ✅ Yes | Searchable keywords (can be empty array) |
| **priceText** | string | ✅ Yes | Price display text (free-form) |

#### tags - Search Keywords

**Purpose:** Enable product search and display product features.

**Two main uses:**

1. **Search matching:**
```typescript
// Code: src/data/catalog.ts:105
const tagMatch = p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
```

2. **Visual display:** Tags appear as chips on product detail pages

**Examples:**
```json
"tags": ["portable", "low-power", "wireless", "IoT"]
```

**Best practices:**
- Use lowercase for consistency
- Include key features and use cases
- 3-6 tags is optimal
- Think about what users would search for

---

#### priceText - Price Display

**Purpose:** Free-form text for price display.

**Format:** Any string - no calculations or currency conversions

**Examples:**
```json
"priceText": "€299"           // Fixed price
"priceText": "¥2,999"         // Different currency
"priceText": "Contact us"     // No public price
"priceText": "From €199"      // Starting price
"priceText": "询价"           // Chinese "inquire for price"
```

**Display:** Shows as-is on product detail page

```typescript
// Code: src/pages/product.ts:94
price.textContent = product.priceText;
```

---

### Images Object

| Field | Type | Required | Description | Generated By |
|-------|------|----------|-------------|--------------|
| **thumb** | string | ✅ Yes | 600px thumbnail | `process-images.sh` |
| **preview** | string | ✅ Yes | 1200px preview | `process-images.sh` |
| **gallery** | string[] | ✅ Yes | 1600px gallery images (can be empty) | `process-images.sh` |
| **original** | string | ✅ Yes | Original image path (symlink) | `process-images.sh` |

#### Image Path Structure

**All paths are absolute from site root:**
```json
"images": {
  "thumb": "/images/wireless-sensor/thumb.webp",
  "preview": "/images/wireless-sensor/preview.webp",
  "gallery": [
    "/images/wireless-sensor/g1.webp",
    "/images/wireless-sensor/g2.webp"
  ],
  "original": "/images/wireless-sensor/original.png"
}
```

#### Where Each Image Is Used

**thumb (600px):**
- Homepage product cards
- Category page product cards
- Category featured product image

```typescript
// Code: src/components/productCard.ts:15
img.src = product.images.thumb;
```

**preview (1200px):**
- Product detail page main image
- First thumbnail in gallery

```typescript
// Code: src/pages/product.ts:34
mainImage.src = product.images.preview;
```

**gallery (1600px):**
- Additional detail page images
- Click to switch main image

```typescript
// Code: src/pages/product.ts:56-68
product.images.gallery.forEach((imgSrc) => {
  // Create clickable thumbnail
  thumb.onclick = () => {
    mainImage.src = imgSrc;  // Switch to gallery image
  };
});
```

**original (symlink to source file):**
- "View Original Image" button target
- Opens in new browser tab

```typescript
// Code: src/pages/product.ts:78
window.open(product.images.original, '_blank');
```

#### Important Note on original.png

The `original.png` is a **symbolic link** created by `process-images.sh`:

```
Source file:    MySensorPhoto_2024.jpg
Symlink:        original.png → MySensorPhoto_2024.jpg
Catalog path:   "/images/wireless-sensor/original.png"
```

**Key points:**
- ✅ Supports any format: JPG, PNG, JPEG
- ✅ Preserves your original filename
- ✅ Catalog always uses consistent path
- ✅ Browsers identify format by content, not extension

---

### Specifications Array

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **specs** | Array<{k, v}> | ✅ Yes | Technical specifications (can be empty array) |

#### Structure

Each spec is an object with two fields:
- **k**: Translation key for spec name
- **v**: Spec value (displayed as-is)

```json
"specs": [
  { "k": "specs.size", "v": "10cm x 5cm" },
  { "k": "specs.weight", "v": "80g" },
  { "k": "specs.voltage", "v": "3.3V - 5V" }
]
```

#### How Specs Are Displayed

```typescript
// Code: src/pages/product.ts:121-135
product.specs.forEach((spec) => {
  keyCell.textContent = i18n.t(spec.k);  // Translated name
  valueCell.textContent = spec.v;         // Value (as-is)
});
```

**Rendered table:**

| Specification | Value |
|---------------|-------|
| Size | 10cm x 5cm |
| Weight | 80g |
| Voltage | 3.3V - 5V |

**Translation files:**
```json
// en.json
{
  "specs.size": "Size",
  "specs.weight": "Weight",
  "specs.voltage": "Voltage"
}

// zh.json
{
  "specs.size": "尺寸",
  "specs.weight": "重量",
  "specs.voltage": "电压"
}
```

**Naming convention:** `specs.{property-name}`

---

## Contact Object

```json
{
  "contact": {
    "email": "contact@example.com",
    "phone": "+33 1 23 45 67 89"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **email** | string | ✅ Yes | Contact email address |
| **phone** | string | ✅ Yes | Contact phone number |

**Usage:** Displayed on the Contact page with `mailto:` and `tel:` links.

---

## Complete Example

```json
{
  "version": 1,
  "updatedAt": "2026-01-11T00:00:00Z",
  "contact": {
    "email": "contact@example.com",
    "phone": "+33 1 23 45 67 89"
  },
  "categories": [
    {
      "id": "c01",
      "nameKey": "category.sensors",
      "sort": 100,
      "featuredProductId": "wireless-sensor"
    },
    {
      "id": "c02",
      "nameKey": "category.controllers",
      "sort": 90,
      "featuredProductId": "industrial-controller"
    }
  ],
  "products": [
    {
      "id": "wireless-sensor",
      "published": true,
      "categoryId": "c01",
      "sortInCategory": 100,
      "nameKey": "product.wireless-sensor.name",
      "shortDescKey": "product.wireless-sensor.shortDesc",
      "longDescKey": "product.wireless-sensor.longDesc",
      "tags": ["portable", "low-power", "wireless"],
      "priceText": "€299",
      "images": {
        "thumb": "/images/wireless-sensor/thumb.webp",
        "preview": "/images/wireless-sensor/preview.webp",
        "gallery": ["/images/wireless-sensor/g1.webp"],
        "original": "/images/wireless-sensor/original.png"
      },
      "specs": [
        { "k": "specs.size", "v": "10cm x 5cm" },
        { "k": "specs.weight", "v": "80g" }
      ]
    }
  ]
}
```

---

## Field Summary Tables

### Category Fields

| Field | Required | Default | Purpose |
|-------|----------|---------|---------|
| id | ✅ | - | Unique identifier |
| nameKey | ✅ | - | Display name (translated) |
| sort | ✅ | - | Display order (higher first) |
| featuredProductId | ❌ | First product | Featured product image |

### Product Fields

| Field | Required | Default | Purpose |
|-------|----------|---------|---------|
| id | ✅ | - | URL identifier |
| published | ✅ | - | Visibility control |
| categoryId | ✅ | - | Parent category |
| sortInCategory | ✅ | - | Category order |
| nameKey | ✅ | - | Display name |
| shortDescKey | ✅ | - | Card description |
| longDescKey | ✅ | - | Detail description |
| tags | ✅ | `[]` | Search keywords |
| priceText | ✅ | - | Price display |
| images.thumb | ✅ | - | 600px thumbnail |
| images.preview | ✅ | - | 1200px main image |
| images.gallery | ✅ | `[]` | 1600px gallery |
| images.original | ✅ | - | Original image |
| specs | ✅ | `[]` | Specifications |

---

## Best Practices

### IDs and Naming

✅ **Good practices:**
- Use descriptive IDs: `wireless-sensor-v2`, `pressure-gauge-digital`
- Match product ID to folder name
- Use translation keys consistently: `product.{id}.{type}`

❌ **Avoid:**
- Generic IDs: `p001`, `prod1`
- Inconsistent naming patterns
- Special characters in IDs

### Sorting Strategy

✅ **Recommended:**
- Use increments of 10 (90, 100, 110)
- Higher values for new/featured items
- Reserve very high values (200+) for temporary promotions

### Translation Management

✅ **Best practices:**
- Keep translation keys synchronized across all locale files
- Use consistent key structure: `type.identifier.field`
- Test all languages before deployment
- Use meaningful key names (not numbers)

### Image Management

✅ **Recommendations:**
- Keep original filenames descriptive
- Run `process-images.sh` after any image changes
- Use `list-products.sh` to verify mappings
- Always specify gallery array (even if empty: `[]`)

---

## Related Documentation

- [README.md](README.md) - Project overview and setup
- [QUICK_START.md](QUICK_START.md) - Quick start guide (Chinese)
- [PRODUCT_MAPPING.md](PRODUCT_MAPPING.md) - Image management guide

---

**Last Updated:** 2026-01-11
