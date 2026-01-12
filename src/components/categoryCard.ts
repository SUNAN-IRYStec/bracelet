import { Category, Product } from '../data/catalog';
import { i18n } from '../i18n';
import { router } from '../router';

export function createCategoryCard(category: Category, featuredProduct?: Product): HTMLElement {
  const card = document.createElement('div');
  card.className = 'category-card';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'category-card-image-container';
  imageContainer.onclick = () => router.navigate(`/c/${category.id}`);

  if (featuredProduct) {
    const img = document.createElement('img');
    img.src = featuredProduct.images.thumb;
    img.alt = i18n.t(category.nameKey);
    img.loading = 'lazy';
    img.className = 'category-card-image';
    imageContainer.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'category-card-image-placeholder';
    placeholder.textContent = i18n.t(category.nameKey);
    imageContainer.appendChild(placeholder);
  }

  const content = document.createElement('div');
  content.className = 'category-card-content';

  const header = document.createElement('div');
  header.className = 'category-card-header';

  const name = document.createElement('h2');
  name.className = 'category-card-name';
  name.textContent = i18n.t(category.nameKey);

  const viewAllBtn = document.createElement('button');
  viewAllBtn.className = 'btn-link';
  viewAllBtn.textContent = i18n.t('button.viewAll');
  viewAllBtn.onclick = (e) => {
    e.stopPropagation();
    router.navigate(`/c/${category.id}`);
  };

  header.appendChild(name);
  header.appendChild(viewAllBtn);
  content.appendChild(header);

  if (featuredProduct) {
    const productName = document.createElement('p');
    productName.className = 'category-card-product-name';
    productName.textContent = i18n.t(featuredProduct.nameKey);
    productName.onclick = () => router.navigate(`/p/${featuredProduct.id}`);
    content.appendChild(productName);
  }

  card.appendChild(imageContainer);
  card.appendChild(content);

  return card;
}
