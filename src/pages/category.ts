import { catalogService } from '../data/catalog';
import { createProductCard } from '../components/productCard';
import { i18n } from '../i18n';
import { router } from '../router';

export function renderCategoryPage(params: Record<string, string>): void {
  const main = document.getElementById('main');
  if (!main) return;

  const categoryId = params.id;
  const category = catalogService.getCategoryById(categoryId);

  if (!category) {
    main.innerHTML = `<div class="error-page"><p>Category not found</p></div>`;
    return;
  }

  main.innerHTML = '';
  main.className = 'category-page';

  const header = document.createElement('div');
  header.className = 'category-header';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-back';
  backBtn.textContent = '← ' + i18n.t('button.backToHome');
  backBtn.onclick = () => router.navigate('/');

  const title = document.createElement('h1');
  title.textContent = i18n.t(category.nameKey);

  header.appendChild(backBtn);
  header.appendChild(title);
  main.appendChild(header);

  const products = catalogService.getProductsByCategory(categoryId);

  if (products.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No products in this category';
    main.appendChild(emptyState);
    return;
  }

  const productGrid = document.createElement('div');
  productGrid.className = 'product-grid';

  products.forEach((product) => {
    productGrid.appendChild(createProductCard(product));
  });

  main.appendChild(productGrid);
}
