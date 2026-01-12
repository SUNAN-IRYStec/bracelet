import { Product } from '../data/catalog';
import { i18n } from '../i18n';
import { router } from '../router';
import { toAbsoluteUrl } from '../utils/url';

export function createProductCard(product: Product): HTMLElement {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.onclick = () => router.navigate(`/p/${product.id}`);

  const img = document.createElement('img');
  img.src = toAbsoluteUrl(product.images.thumb);
  img.alt = i18n.t(product.nameKey);
  img.loading = 'lazy';
  img.className = 'product-card-image';

  const content = document.createElement('div');
  content.className = 'product-card-content';

  const name = document.createElement('h3');
  name.className = 'product-card-name';
  name.textContent = i18n.t(product.nameKey);

  const desc = document.createElement('p');
  desc.className = 'product-card-desc';
  desc.textContent = i18n.t(product.shortDescKey);

  const footer = document.createElement('div');
  footer.className = 'product-card-footer';

  const price = document.createElement('span');
  price.className = 'product-card-price';
  price.textContent = product.priceText;

  const tags = document.createElement('div');
  tags.className = 'product-card-tags';
  product.tags.slice(0, 2).forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tag;
    tags.appendChild(tagEl);
  });

  footer.appendChild(price);
  content.appendChild(name);
  content.appendChild(desc);
  content.appendChild(tags);
  content.appendChild(footer);

  card.appendChild(img);
  card.appendChild(content);

  return card;
}
