export interface Category {
  id: string;
  nameKey: string;
  sort: number;
  featuredProductId?: string;
}

export interface Product {
  id: string;
  published: boolean;
  categoryId: string;
  sortInCategory: number;
  nameKey: string;
  shortDescKey: string;
  longDescKey: string;
  tags: string[];
  priceText: string;
  images: {
    thumb: string;
    preview: string;
    gallery: string[];
    original: string;
  };
  specs: Array<{ k: string; v: string }>;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface Catalog {
  version: number;
  updatedAt: string;
  contact: ContactInfo;
  categories: Category[];
  products: Product[];
}

class CatalogService {
  private catalog: Catalog | null = null;

  async load(): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/catalog.json`);
      this.catalog = await response.json();
    } catch (error) {
      console.error('Failed to load catalog:', error);
      throw error;
    }
  }

  getCatalog(): Catalog {
    if (!this.catalog) {
      throw new Error('Catalog not loaded. Call load() first.');
    }
    return this.catalog;
  }

  getCategoriesSorted(): Category[] {
    const catalog = this.getCatalog();
    return [...catalog.categories].sort((a, b) => b.sort - a.sort);
  }

  getCategoryById(id: string): Category | undefined {
    const catalog = this.getCatalog();
    return catalog.categories.find((c) => c.id === id);
  }

  getProductById(id: string): Product | undefined {
    const catalog = this.getCatalog();
    return catalog.products.find((p) => p.id === id && p.published);
  }

  getProductsByCategory(categoryId: string): Product[] {
    const catalog = this.getCatalog();
    return catalog.products
      .filter((p) => p.categoryId === categoryId && p.published)
      .sort((a, b) => b.sortInCategory - a.sortInCategory);
  }

  getFeaturedProduct(category: Category): Product | undefined {
    if (category.featuredProductId) {
      return this.getProductById(category.featuredProductId);
    }
    // Fallback: use first product in category
    const products = this.getProductsByCategory(category.id);
    return products[0];
  }

  searchProducts(query: string): Product[] {
    if (!query.trim()) {
      return [];
    }

    const catalog = this.getCatalog();
    const lowerQuery = query.toLowerCase();

    return catalog.products.filter((p) => {
      if (!p.published) return false;

      // Search in name, short desc, tags
      const nameMatch = p.nameKey.toLowerCase().includes(lowerQuery);
      const descMatch = p.shortDescKey.toLowerCase().includes(lowerQuery);
      const tagMatch = p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

      return nameMatch || descMatch || tagMatch;
    });
  }

  getAllProducts(): Product[] {
    const catalog = this.getCatalog();
    return catalog.products.filter((p) => p.published);
  }

  getContactInfo(): ContactInfo {
    const catalog = this.getCatalog();
    return catalog.contact;
  }
}

export const catalogService = new CatalogService();
