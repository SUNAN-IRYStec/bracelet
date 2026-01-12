1. nameKey 的作用
作用： 国际化翻译的 key（键值），不是直接显示的文本

显示方式： 通过 i18n.t(nameKey) 转换为对应语言的文本后显示在页面上

在 categoryCard.ts:16 和 categoryCard.ts:35 中可以看到：


img.alt = i18n.t(category.nameKey);  // 转换为翻译文本
name.textContent = i18n.t(category.nameKey);  // 显示翻译文本
命名规范：

使用点分隔的层级结构
格式：类型.标识符
示例：
分类：category.sensors、category.controllers
产品：product.p001.name、product.p001.shortDesc
在翻译文件中的对应：


// en.json
"category.sensors": "Sensors"

// zh.json  
"category.sensors": "传感器"

// fr.json
"category.sensors": "Capteurs"
2. sort 相同会怎样？
排序逻辑： catalog.ts:62


return [...catalog.categories].sort((a, b) => b.sort - a.sort);
规则：

降序排序：sort 值越大越靠前
相同值处理：保持原数组中的顺序（JavaScript 的 sort 是稳定排序）
示例：


{
  "categories": [
    {"id": "c01", "sort": 100},  // 显示第1位
    {"id": "c02", "sort": 100},  // 显示第2位（与c01同值，保持原顺序）
    {"id": "c03", "sort": 90},   // 显示第3位
    {"id": "c04", "sort": 80}    // 显示第4位
  ]
}
3. featuredProductId 的作用
作用： 指定该分类在首页展示的特色产品

显示位置： 首页的分类卡片上，会显示：

该产品的缩略图（作为分类的代表图）
该产品的名称
代码逻辑： catalog.ts:82-89


getFeaturedProduct(category: Category): Product | undefined {
  if (category.featuredProductId) {
    return this.getProductById(category.featuredProductId);
  }
  // Fallback: use first product in category
  const products = this.getProductsByCategory(category.id);
  return products[0];
}
如果不指定： 自动使用该分类下 sortInCategory 最高的产品作为特色产品

推荐用法：

选择该分类最具代表性或最新的产品
选择图片质量最好的产品（因为会在首页展示）
示例：


{
  "id": "c01",
  "nameKey": "category.sensors",
  "sort": 100,
  "featuredProductId": "wireless-sensor"  // 指定无线传感器作为特色展示
}
总结表格
字段	作用	显示/引用	注意事项
nameKey	国际化翻译 key	通过 i18n 转换后显示	点分隔命名，需在所有语言文件中定义
sort	排序权重	程序引用	值越大越靠前，相同值保持原顺序
featuredProductId	特色产品 ID	程序引用	可选，不指定则自动选择第一个产品
同样解释一下选中每个字段的作用
让我查看代码中这些字段的具体使用方式。

Read product.ts
根据代码分析，我来详细解释产品对象中每个字段的作用：

产品字段详解
1. 基础字段
字段	类型	作用	示例	代码位置
id	string	产品唯一标识符，用于 URL 路由和查询	"p001"	catalog.ts:72
published	boolean	控制产品是否显示（未发布的产品不会出现在任何列表中）	true	catalog.ts:72, catalog.ts:100
categoryId	string	所属分类的 ID，用于分类筛选	"c01"	catalog.ts:78
sortInCategory	number	在分类内的排序权重，值越大越靠前	100	catalog.ts:79
published 的具体作用：


// 只返回 published: true 的产品
return catalog.products.find((p) => p.id === id && p.published);
2. 国际化字段
字段	类型	作用	使用方式	显示位置
nameKey	string	产品名称的翻译 key	i18n.t(product.nameKey)	列表卡片、详情页标题
shortDescKey	string	简短描述的翻译 key	i18n.t(product.shortDescKey)	列表卡片下方
longDescKey	string	详细描述的翻译 key	i18n.t(product.longDescKey)	详情页主要内容
显示示例： product.ts:89, product.ts:109


name.textContent = i18n.t(product.nameKey);  // "Wireless Smart Sensor"
desc.textContent = i18n.t(product.longDescKey);  // 详细描述...
翻译文件示例：


{
  "product.p001.name": "Wireless Smart Sensor",
  "product.p001.shortDesc": "Plug and play, low power design",
  "product.p001.longDesc": "This wireless smart sensor features..."
}
3. 标签和价格
字段	类型	作用	示例	代码位置
tags	string[]	产品标签数组，用于搜索和分类展示	["hand", "cutie"]	product.ts:99-104
priceText	string	价格文本（自由格式，支持任何货币符号）	"€299"	product.ts:94
tags 的两个作用：

搜索匹配： catalog.ts:105

const tagMatch = p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
页面展示： 详情页显示为标签样式
priceText 特点：

纯文本，不做计算
可以包含任何内容："€299"、"Contact us"、"¥2,999"
4. 图片对象
字段路径	类型	尺寸/用途	生成方式	使用位置
images.thumb	string	600px 宽，缩略图	脚本生成	列表卡片
images.preview	string	1200px 宽，预览图	脚本生成	详情页主图
images.gallery	string[]	1600px 宽，画廊图数组	脚本生成	详情页图片切换
images.original	string	原图路径（symlink）	脚本生成	"查看原图"按钮
图片对象的使用： product.ts:34-78


mainImage.src = product.images.preview;  // 主图使用 preview

product.images.gallery.forEach((imgSrc) => {  // 遍历画廊图
  // 创建缩略图，点击切换主图
});

viewOriginalBtn.onclick = () => {
  window.open(product.images.original, '_blank');  // 新标签页打开原图
};
路径格式：

所有路径都是相对于网站根目录的绝对路径
以 / 开头："/images/p001/thumb.webp"
5. 规格参数
字段	类型	作用	示例	代码位置
specs	Array<{k, v}>	规格参数数组，k 是翻译 key，v 是值	[{ "k": "specs.size", "v": "10cm x 5cm" }]	product.ts:121-135
specs 的数据结构：


"specs": [
  { "k": "specs.size", "v": "10cm x 5cm" },    // k 需要翻译，v 直接显示
  { "k": "specs.weight", "v": "80g" }
]
页面显示方式：


keyCell.textContent = i18n.t(spec.k);  // "Size" / "尺寸" / "Taille"
valueCell.textContent = spec.v;         // "10cm x 5cm" (直接显示)
表格示例：

规格名称（翻译）	值（直接显示）
Size	10cm x 5cm
Weight	80g
完整字段总结表
字段	必填	作用	注意事项
id	✅ 是	产品唯一标识	推荐使用描述性名称（如 wireless-sensor）
published	✅ 是	是否发布	false 时产品不会显示在任何地方
categoryId	✅ 是	所属分类	必须是已存在的分类 ID
sortInCategory	✅ 是	分类内排序	值越大越靠前，相同则按原顺序
nameKey	✅ 是	名称翻译 key	需在所有语言文件中定义
shortDescKey	✅ 是	简短描述 key	需在所有语言文件中定义
longDescKey	✅ 是	详细描述 key	需在所有语言文件中定义
tags	✅ 是	标签数组	影响搜索结果和页面展示
priceText	✅ 是	价格文本	自由格式，可以是任意文本
images.thumb	✅ 是	缩略图路径	由脚本自动生成
images.preview	✅ 是	预览图路径	由脚本自动生成
images.gallery	✅ 是	画廊图数组	可以为空数组 []
images.original	✅ 是	原图路径	统一使用 original.png（symlink）
specs	✅ 是	规格参数数组	可以为空数组 []
实际使用建议
ID 命名： 使用有意义的名称（wireless-sensor-v2）而非编号（p001）
排序策略： 为新产品设置较高的 sortInCategory 值，让它们显示在前面
翻译 key： 使用统一的命名模式：product.{id}.{type}
标签选择： 选择能帮助用户搜索的关键词
价格文本： 如果不展示价格，可以写 "Contact us" 或 "询价"
规格参数： k 字段统一使用 specs.{name} 格式，方便多语言管理

产品显示：
"#2"是在语言文件中手动配置的
