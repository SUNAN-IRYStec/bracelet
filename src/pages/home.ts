import { catalogService } from '../data/catalog';
import { createCategoryCard } from '../components/categoryCard';
import { createProductCard } from '../components/productCard';
import { i18n } from '../i18n';

export function renderHomePage(): void {
  const main = document.getElementById('main');
  if (!main) return;

  main.innerHTML = '';
  main.className = 'home-page';

  // Categories overview section
  const categoriesSection = document.createElement('section');
  categoriesSection.className = 'categories-overview';

  const categoriesTitle = document.createElement('h1');
  categoriesTitle.textContent = i18n.t('site.title');
  categoriesSection.appendChild(categoriesTitle);

  const categoriesGrid = document.createElement('div');
  categoriesGrid.className = 'categories-grid';

  const categories = catalogService.getCategoriesSorted();

  categories.forEach((category) => {
    const featured = catalogService.getFeaturedProduct(category);
    const card = createCategoryCard(category, featured);
    categoriesGrid.appendChild(card);
  });

  categoriesSection.appendChild(categoriesGrid);
  main.appendChild(categoriesSection);

  // Products by category section (lazy loaded)
  const productsSection = document.createElement('section');
  productsSection.className = 'products-by-category';

  categories.forEach((category) => {
    const categorySection = document.createElement('div');
    categorySection.className = 'category-section';
    categorySection.dataset.categoryId = category.id;

    const header = document.createElement('div');
    header.className = 'category-section-header';

    const title = document.createElement('h2');
    title.textContent = i18n.t(category.nameKey);

    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = `#/c/${category.id}`;
    viewAllBtn.className = 'btn-link';
    viewAllBtn.textContent = i18n.t('button.viewAll');

    header.appendChild(title);
    header.appendChild(viewAllBtn);
    categorySection.appendChild(header);

    const productsContainer = document.createElement('div');
    productsContainer.className = 'products-container';
    productsContainer.dataset.loaded = 'false';
    categorySection.appendChild(productsContainer);

    productsSection.appendChild(categorySection);
  });

  main.appendChild(productsSection);

  // Setup Intersection Observer for lazy loading
  setupLazyLoading();
}

function setupLazyLoading(): void {
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const section = entry.target as HTMLElement;
        const productsContainer = section.querySelector('.products-container') as HTMLElement;

        if (productsContainer && productsContainer.dataset.loaded === 'false') {
          loadCategoryProducts(section);
          observer.unobserve(section);
        }
      }
    });
  }, options);

  const categorySections = document.querySelectorAll('.category-section');
  categorySections.forEach((section) => observer.observe(section));
}

function loadCategoryProducts(section: HTMLElement): void {
  const categoryId = section.dataset.categoryId;
  if (!categoryId) return;

  const productsContainer = section.querySelector('.products-container') as HTMLElement;
  if (!productsContainer) return;

  const products = catalogService.getProductsByCategory(categoryId);

  const productGrid = document.createElement('div');
  productGrid.className = 'product-grid';

  products.forEach((product) => {
    productGrid.appendChild(createProductCard(product));
  });

  productsContainer.appendChild(productGrid);
  productsContainer.dataset.loaded = 'true';
}
