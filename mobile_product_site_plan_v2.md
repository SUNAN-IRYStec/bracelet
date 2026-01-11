# 移动端丝滑产品展示站（分类 + 排序 + 原图放大）（GitHub Pages / 前期免费）开发方案

> 适用场景：管理员上传产品图片与介绍；用户在手机端浏览；前期不做站内登录与支付，但为后期升级保留扩展点。

---

## 0. 关键结论（你最关心的点）

- **分类与排序**：不必拆多个 JSON；**一个 JSON 足够**。建议在同一个文件里同时维护 `categories`（分类顺序）与 `products`（产品顺序）。如果多人频繁改动、担心冲突，可以再拆成 `categories.json` + `products.json`（可选）。
- **首页交互**：先显示“分类列表（每类只露出第一个产品）”，用户不点进去继续向下滚动时，按分类顺序看到各分类下的完整产品列表；点击分类进入分类页显示该分类全部产品。
- **大图策略（原图 3–5MB）**：强烈建议**预生成两套派生图**（缩略图/预览图），列表与详情默认加载派生图；只有用户点击“查看原图”时才加载原图（或打开新页面/新标签页展示），保证手机端丝滑。
- **PNG 是否处理**：建议保留原始 PNG 作为“原图”，同时生成 WebP（或保持 JPG）作为缩略/预览。这样体积小、加载快。
- **GitHub LFS**：**不建议用于 GitHub Pages 的站点静态资源**，因为 Pages 通常无法直接提供 LFS 的二进制内容（会变成指针文件）。此外 GitHub 对单文件与 Pages 站点体积也有限制。citeturn0search7turn0search5turn0search0turn0search3

---

## 1. MVP 技术选型（vibe coding 友好）

### 方案 A（推荐）：Vite + Vanilla TypeScript（最轻、最快）
- 构建：Vite
- 运行：纯静态（GitHub Pages）
- 数据：`public/data/catalog.json`
- 图片：`public/images/...`

> 后期需要真正后台/登录时，再迁移到 Vercel + Supabase。

---

## 2. 页面与路由

- `#/` 首页（分类概览 + 按分类滚动浏览全部产品）
- `#/c/<categoryId>` 分类页（该分类全部产品）
- `#/p/<productId>` 产品详情页（图集 + 文案 + 参数）
- `#/about`（可选）

> 使用 hash 路由避免 GitHub Pages 刷新 404。

---

## 3. 内容管理与数据模型（推荐一个 JSON）

### 3.1 文件结构
```text
public/
  data/
    catalog.json
  images/
    p001/
      original.png
      thumb.webp
      preview.webp
      g1.webp
      g2.webp
    p002/
      ...
```

### 3.2 catalog.json（单文件：分类 + 产品）
`public/data/catalog.json`
```json
{
  "version": 1,
  "updatedAt": "2026-01-10T00:00:00Z",
  "categories": [
    {
      "id": "c01",
      "name": "传感器",
      "sort": 100,
      "featuredProductId": "p001"
    }
  ],
  "products": [
    {
      "id": "p001",
      "published": true,
      "categoryId": "c01",
      "sortInCategory": 100,
      "name": "无线智能传感器",
      "shortDesc": "即插即用，低功耗设计",
      "longDesc": "更详细的介绍文字，可分段。",
      "tags": ["便携", "低功耗"],
      "priceText": "¥299",
      "images": {
        "thumb": "/images/p001/thumb.webp",
        "preview": "/images/p001/preview.webp",
        "gallery": ["/images/p001/g1.webp", "/images/p001/g2.webp"],
        "original": "/images/p001/original.png"
      },
      "specs": [
        { "k": "尺寸", "v": "10cm x 5cm" },
        { "k": "重量", "v": "80g" }
      ]
    }
  ]
}
```

#### 说明
- `categories.sort`：控制**分类显示顺序**（越大越靠前）
- `products.sortInCategory`：控制**分类内产品顺序**
- `categories.featuredProductId`：首页分类卡片展示的“第一个产品”
  - 可选：也可以不写，前端用“该分类 sortInCategory 最大的产品”自动当 featured

### 3.3 何时拆成多个 JSON（可选）
- 如果多人频繁改动，担心合并冲突：
  - `categories.json`：只含分类与顺序
  - `products.json`：只含产品
- 否则：单文件更简单，足够支撑你给出的规模（<=20 分类，<=100/类）。

---

## 4. 首页交互实现（符合你的描述）

### 4.1 首屏：分类列表（每类只显示 1 个产品）
- UI：分类卡片（分类名 + featured 产品封面 + 简短描述）
- 点击分类卡片：进入 `#/c/<categoryId>`
- 点击 featured 产品：进入 `#/p/<productId>`

### 4.2 向下滚动：按分类顺序浏览全部产品
首页在“分类列表”下面继续渲染“分类分组列表”：
- 每个分类一个 section：
  - section header：分类名 + “查看全部”（跳转分类页）
  - section body：该分类的产品卡片流（按 `sortInCategory`）

### 4.3 性能策略（确保丝滑）
- 首屏只渲染：
  - 分类列表（20 个以内）
  - 每个分类只渲染 1 张 featured 产品卡片
- 下方“分类分组列表”使用 **IntersectionObserver**：
  - 某个分类 section 进入视口时，再追加渲染该分类剩余产品（分批 12 个）
- 图片：
  - 列表卡片只加载 `thumb`
  - 详情页优先加载 `preview` + `gallery`（懒加载）

---

## 5. 大图（3–5MB PNG）与“点击放大看原图”的实现

### 5.1 推荐的三层图片体系
- `thumb`：列表用（小，快）
- `preview`：详情页主图/首图（中等，清晰，仍快）
- `original`：原图（PNG），仅在用户明确点击后加载

### 5.2 交互方式（两种都可）
- 方式 A（最省内存）：点击“查看原图” → 新标签页打开 `original.png`
- 方式 B（更沉浸）：点击放大 → 弹窗 modal 内加载 `original.png`
  - 注意：原图较大，建议加加载提示与关闭按钮

> 无论哪种方式，默认都不要请求 original，否则移动端首屏会明显变慢。

### 5.3 PNG 是否要预处理
建议：
- 原图 PNG：保留（作为“原图/下载”）
- 派生图：生成 WebP（thumb/preview/gallery）
  - 体积通常显著小于 PNG，适合移动端浏览
- 如果你必须保持原图也是“可放大但更快”，可以再额外生成：
  - `original.webp`（尺寸与原图相同，但压缩更好）
  - 点击“查看原图”默认打开 `original.webp`，并提供“下载 PNG 原图”链接（可选）

---

## 6. 图片批处理工具链（Ubuntu）

你上传的是大 PNG，建议在提交前本地批处理生成派生图。

### 6.1 用 ImageMagick（示例）
> 需要 `sudo apt install imagemagick webp`

对某个产品目录：
```bash
# 进入 /images/p001
cd public/images/p001

# 1) 生成缩略图 thumb.webp（宽 600）
magick original.png -resize 600x -quality 80 thumb.webp

# 2) 生成预览图 preview.webp（宽 1200）
magick original.png -resize 1200x -quality 85 preview.webp

# 3) 生成若干详情图（如果你有多张原图，也可循环）
magick original.png -resize 1600x -quality 85 g1.webp
```

### 6.2 推荐尺寸（可按你产品图实际调整）
- `thumb`：600px 宽（列表足够清晰）
- `preview`：1200px 宽（详情清晰，体积可控）
- `gallery`：1600px 宽（可选）

---

## 7. GitHub 上传与仓库体积建议（重点：不要用 LFS 承载 Pages 静态资源）

### 7.1 GitHub / Pages 相关限制（你必须考虑）
- GitHub Pages 源仓库建议不超过 **1 GB**，发布的 Pages 站点也存在体积限制（文档中列出不应超过 1 GB）。citeturn0search0turn0search3  
- GitHub 对单文件有硬限制：超过 **100 MiB** 会被拒绝（需要 LFS 才能追踪）。citeturn0search5turn0search13  
- GitHub 官方文档明确指出：**Git LFS 不能用于 GitHub Pages 站点**（静态资源无法按预期提供）。citeturn0search7  

### 7.2 因此，推荐策略
- **不要把大量 3–5MB 的 PNG 当“默认浏览图”放进 Pages**（会迅速膨胀到 1GB）。
- 在 Pages 仓库里放：
  - `thumb.webp / preview.webp / gallery.webp`（浏览必需）
  - `original.png`（如果数量很少、总量可控，可以放；否则不建议）
- 如果原图很多、总量可能超标：
  - 方案 1（推荐）：把 `original.png` 放到**单独的 assets 仓库**（不启用 Pages），前端用 raw 文件地址引用（注意总带宽与访问策略）。
  - 方案 2：把原图打包作为 Release 附件（更像“下载原图”而不是“站内浏览”）。
  - 方案 3：后期迁移到对象存储（Cloudflare R2 / S3 等）并用 CDN。

> 如果你坚持“原图必须站内打开”，最稳的做法是生成 `original.webp` 取代 `original.png` 作为放大查看图，PNG 仅提供下载。

---

## 8. 前端实现要点（vibe coding 关键任务清单）

### 8.1 数据层
- 拉取 `/data/catalog.json`，做内存缓存
- 提供：
  - `getCategoriesSorted()`
  - `getProductsByCategory(categoryId)`
  - `getFeaturedProduct(category)`

### 8.2 首页渲染
- 顶部：分类卡片列表（每卡 1 个 featured 产品）
- 下方：分类 section 列表（滚动触发加载该分类剩余产品）

### 8.3 分类页
- 显示该分类所有产品（可分批加载）

### 8.4 详情页
- 默认加载 `preview` + `gallery`
- “查看原图”按钮：
  - A：`window.open(product.images.original, '_blank')`
  - B：打开 modal 并懒加载 original

---

## 9. GitHub Pages 自动部署（Actions）
（沿用你现有 workflow：构建 dist 并 deploy）

---

## 10. 给 Codex / Claude Code 的提示词（增量功能版）

### Prompt：实现分类 + 首页行为 + 原图放大
- “在现有 Vite + Vanilla TS 产品展示站基础上，实现分类与排序：catalog.json 含 categories(sort) 与 products(sortInCategory)。首页首屏显示分类列表，每个分类只展示 featured 产品；继续向下滚动按分类顺序展示各分类下的全部产品（使用 IntersectionObserver 懒渲染每个分类的剩余产品）。点击分类进入分类页显示该分类全部产品。图片分三层：thumb/preview/original；列表用 thumb，详情用 preview+gallery，点击‘查看原图’时才打开 original（新标签页或 modal）。请给出具体代码文件与关键函数。”

---

## 11. 验收清单
- [ ] 首页首屏：只加载分类 + 每类 1 个产品（不加载原图）
- [ ] 向下滚动：分类 section 逐个加载，不一次性渲染 2000 卡片
- [ ] 详情页：点击后才加载 original
- [ ] 仓库体积：长期可控（避免超过 Pages 推荐限制）citeturn0search0turn0search3
