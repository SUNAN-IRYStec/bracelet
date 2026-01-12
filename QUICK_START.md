# 快速开始指南

## 你现在有一些 PNG/JPG 源图片，应该怎么做？

**支持的格式：** 本系统支持 PNG、JPG、JPEG 格式的源图片。所有处理后的图片将转换为 WebP 格式以优化网页性能。

### 第一步：组织你的图片文件

假设你有以下产品图片：

```
~/Downloads/
├── 无线传感器主图.jpg
├── 无线传感器细节1.jpg
├── 工业控制器主图.png
├── 温度表主图.jpg
└── 温度表细节.png
```

### 第二步：为每个产品创建文件夹（使用有意义的名称！）

```bash
# 使用描述性的英文文件夹名（方便管理）
mkdir -p public/images/wireless-sensor
mkdir -p public/images/industrial-controller
mkdir -p public/images/temperature-gauge
```

**为什么要用描述性名称？**
- ✅ 一眼就能看出是什么产品
- ✅ 后续更新图片时容易找到对应文件夹
- ✅ 代码中的产品 ID 也更有意义
- ❌ 避免使用 p001, p002 这种无意义的编号

### 第三步：复制你的图片（保持原文件名！）

**重要：直接复制，保留原文件名！**

```bash
# 无线传感器
cp ~/Downloads/无线传感器主图.jpg public/images/wireless-sensor/
cp ~/Downloads/无线传感器细节1.jpg public/images/wireless-sensor/

# 工业控制器
cp ~/Downloads/工业控制器主图.png public/images/industrial-controller/

# 温度表
cp ~/Downloads/温度表主图.jpg public/images/temperature-gauge/
cp ~/Downloads/温度表细节.png public/images/temperature-gauge/
```

现在的文件结构：
```
public/images/
├── wireless-sensor/
│   ├── 无线传感器主图.jpg       ← 你的原文件名（保留！）
│   └── 无线传感器细节1.jpg      ← 你的原文件名（保留！）
├── industrial-controller/
│   └── 工业控制器主图.png
└── temperature-gauge/
    ├── 温度表主图.jpg
    └── 温度表细节.png
```

### 第四步：批量处理所有图片
```bash
使用 scripts/organize_files.py 将文件夹中的图片进行预处理，需要设置输入/输出目录
# 一次性处理所有产品图片
for dir in public/images/*/; do
    echo "Processing: $dir"
    ./scripts/process-images.sh "$dir"
done
```

或者逐个处理：
```bash
./scripts/process-images.sh public/images/wireless-sensor
./scripts/process-images.sh public/images/industrial-controller
./scripts/process-images.sh public/images/temperature-gauge
```

**脚本会自动：**
- ✅ 找到每个文件夹中的第一张图作为主图
- ✅ 保留你的原文件名
- ✅ 创建 `original.png` 软链接（指向你的原图）
- ✅ 生成优化后的 WebP 格式图片
- ✅ 自动处理额外的图片作为 Gallery

处理后的结果：
```
public/images/wireless-sensor/
├── 无线传感器主图.jpg        ← 原文件（保留）
├── 无线传感器细节1.jpg       ← 原文件（保留）
├── original.png            ← 软链接 → 无线传感器主图.jpg
├── thumb.webp              ← 生成：600px 宽
├── preview.webp            ← 生成：1200px 宽
└── g1.webp                 ← 生成：1600px 宽（从细节图）
```

### 第五步：查看所有产品映射

```bash
./scripts/list-products.sh
```

输出示例：
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Product Image Mapping
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Product: wireless-sensor
   Path: public/images/wireless-sensor/
   Main image: 无线传感器主图.png (via symlink)
   Gallery: 1 additional image(s)
     - 无线传感器细节1.png
   Status: ✓ Processed

📁 Product: industrial-controller
   Path: public/images/industrial-controller/
   Main image: 工业控制器主图.png (via symlink)
   Status: ✓ Processed

📁 Product: temperature-gauge
   Path: public/images/temperature-gauge/
   Main image: 温度表主图.png (via symlink)
   Gallery: 1 additional image(s)
     - 温度表细节.png
   Status: ✓ Processed
```

### 第六步：更新 catalog.json

编辑 `public/data/catalog.json`，为每个产品添加条目：

```json
{
  "products": [
    {
      "id": "wireless-sensor",      // 使用文件夹名作为 ID
      "published": true,
      "categoryId": "c01",
      "sortInCategory": 100,
      "nameKey": "product.wireless-sensor.name",
      "shortDescKey": "product.wireless-sensor.shortDesc",
      "longDescKey": "product.wireless-sensor.longDesc",
      "tags": ["wireless", "sensor"],
      "priceText": "¥299",
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
    },
    {
      "id": "industrial-controller",  // 使用文件夹名作为 ID
      "published": true,
      "categoryId": "c02",
      "sortInCategory": 100,
      // ... 其他字段
    }
  ]
}
```

### 第七步：添加翻译

在 `public/locales/` 的三个文件中添加翻译：

**en.json**:
```json
{
  "product.wireless-sensor.name": "Wireless Sensor",
  "product.wireless-sensor.shortDesc": "Smart wireless sensor",
  "product.wireless-sensor.longDesc": "Detailed description..."
}
```

**zh.json**:
```json
{
  "product.wireless-sensor.name": "无线传感器",
  "product.wireless-sensor.shortDesc": "智能无线传感器",
  "product.wireless-sensor.longDesc": "详细描述..."
}
```

**fr.json**:
```json
{
  "product.wireless-sensor.name": "Capteur Sans Fil",
  "product.wireless-sensor.shortDesc": "Capteur intelligent sans fil",
  "product.wireless-sensor.longDesc": "Description détaillée..."
}
```

### 第八步：启动并测试

```bash
# 启动开发服务器
npm run dev

# 浏览器访问 http://localhost:3000
```

---

## 后续更新图片怎么办？

假设你要更新"无线传感器"的主图：

### 方案 1：替换原文件（推荐）

```bash
# 1. 找到原文件名
ls -l public/images/wireless-sensor/original.png
# 输出：original.png -> 无线传感器主图.png

# 2. 用相同文件名替换
cp ~/Downloads/无线传感器主图_新版.png public/images/wireless-sensor/无线传感器主图.png

# 3. 重新处理
./scripts/process-images.sh public/images/wireless-sensor
```

### 方案 2：直接复制新文件

```bash
# 1. 复制新文件（可以用新名字）
cp ~/Downloads/传感器2025版.png public/images/wireless-sensor/

# 2. 删除旧的软链接和生成文件
rm public/images/wireless-sensor/original.png
rm public/images/wireless-sensor/*.webp

# 3. 重新处理（会自动找到新图片）
./scripts/process-images.sh public/images/wireless-sensor
```

---

## 常见问题

### Q: 我的图片文件名是中文，会有问题吗？

A: 不会！脚本完全支持中文文件名。保持你习惯的命名方式即可。

### Q: 我不记得某个产品用的是哪个原图了？

A: 运行 `./scripts/list-products.sh` 查看所有产品和它们的原图映射。

### Q: 我能不能把所有图片都改成 original.png？

A: 可以，但**不推荐**。保留原文件名能让你：
- 一眼看出这是什么产品的图
- 文件名可以包含版本信息
- 更容易管理和更新

### Q: 我有很多产品，怎么批量操作？

A: 使用 for 循环：
```bash
# 批量创建文件夹
for name in sensor1 sensor2 controller gauge; do
    mkdir -p public/images/$name
done

# 批量处理
for dir in public/images/*/; do
    ./scripts/process-images.sh "$dir"
done
```

### Q: 我的原图是 JPG 格式，会有问题吗？

A: 完全没问题！脚本支持 PNG、JPG、JPEG 三种格式。`original.png` 是一个软链接（symlink），它会指向你的实际源文件，无论是什么格式。浏览器会根据文件内容而非扩展名来正确识别图片格式。

---

## 文件命名建议

### ✅ 推荐的文件夹命名

- `wireless-sensor-v2`
- `industrial-controller-2024`
- `pressure-gauge-digital`
- `temperature-monitor-pro`

### ✅ 推荐的图片文件命名

- `传感器主图_2024版.png`
- `Controller_MainPhoto_V3.png`
- `压力表_正面视图.png`
- `TempGauge_Detail_Front.png`

### ❌ 避免使用

- 文件夹：`p001`, `prod1`, `img_folder`
- 图片：`1.png`, `image.png`, `photo.png`

---

需要帮助？查看：
- [README.md](README.md) - 完整文档
- [PRODUCT_MAPPING.md](PRODUCT_MAPPING.md) - 产品映射管理
