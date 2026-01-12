import { Product, catalogService } from '../data/catalog';
import { i18n } from '../i18n';
import { router } from '../router';
import { toAbsoluteUrl } from '../utils/url';

function createGalleryThumb(
  imgSrc: string,
  alt: string,
  mainImage: HTMLImageElement,
  isActive: boolean = false,
  lazyLoad: boolean = false
): HTMLImageElement {
  const thumb = document.createElement('img');
  thumb.src = toAbsoluteUrl(imgSrc);
  thumb.alt = alt;
  thumb.className = isActive ? 'gallery-thumb active' : 'gallery-thumb';

  if (lazyLoad) {
    thumb.loading = 'lazy';
  }

  thumb.onclick = () => {
    mainImage.src = toAbsoluteUrl(imgSrc);
    document.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
  };

  return thumb;
}

function createImageSection(product: Product): HTMLElement {
  const section = document.createElement('div');
  section.className = 'product-images';

  const mainImage = document.createElement('img');
  mainImage.src = toAbsoluteUrl(product.images.preview);
  mainImage.alt = i18n.t(product.nameKey);
  mainImage.className = 'product-main-image';
  section.appendChild(mainImage);

  if (product.images.gallery.length > 0) {
    const gallery = document.createElement('div');
    gallery.className = 'product-gallery';

    const alt = i18n.t(product.nameKey);
    gallery.appendChild(createGalleryThumb(product.images.preview, alt, mainImage, true));

    product.images.gallery.forEach((imgSrc) => {
      gallery.appendChild(createGalleryThumb(imgSrc, alt, mainImage, false, true));
    });

    section.appendChild(gallery);
  }

  const viewOriginalBtn = document.createElement('button');
  viewOriginalBtn.className = 'btn-primary btn-view-original';
  viewOriginalBtn.textContent = i18n.t('button.viewOriginal');
  viewOriginalBtn.onclick = () => {
    window.open(toAbsoluteUrl(product.images.original), '_blank');
  };
  section.appendChild(viewOriginalBtn);

  return section;
}

function createSpecsTable(specs: Array<{ k: string; v: string }>): HTMLElement {
  const table = document.createElement('table');
  table.className = 'specs-table';

  specs.forEach((spec) => {
    const row = document.createElement('tr');

    const keyCell = document.createElement('td');
    keyCell.textContent = i18n.t(spec.k);
    keyCell.className = 'spec-key';

    const valueCell = document.createElement('td');
    valueCell.textContent = spec.v;
    valueCell.className = 'spec-value';

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  });

  return table;
}

function createInfoSection(product: Product): HTMLElement {
  const section = document.createElement('div');
  section.className = 'product-info';

  const name = document.createElement('h1');
  name.textContent = i18n.t(product.nameKey);
  section.appendChild(name);

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = product.priceText;
  section.appendChild(price);

  const tags = document.createElement('div');
  tags.className = 'product-tags';
  product.tags.forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tag;
    tags.appendChild(tagEl);
  });
  section.appendChild(tags);

  const desc = document.createElement('p');
  desc.className = 'product-long-desc';
  desc.textContent = i18n.t(product.longDescKey);
  section.appendChild(desc);

  if (product.specs.length > 0) {
    const specsTitle = document.createElement('h3');
    specsTitle.textContent = i18n.t('specs.title');
    section.appendChild(specsTitle);
    section.appendChild(createSpecsTable(product.specs));
  }

  return section;
}

export function renderProductPage(params: Record<string, string>): void {
  const main = document.getElementById('main');
  if (!main) return;

  const productId = params.id;
  const product = catalogService.getProductById(productId);

  if (!product) {
    main.innerHTML = `<div class="error-page"><p>Product not found</p></div>`;
    return;
  }

  main.innerHTML = '';
  main.className = 'product-page';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-back';
  backBtn.textContent = '← ' + i18n.t('button.backToHome');
  backBtn.onclick = () => router.navigate('/');
  main.appendChild(backBtn);

  const container = document.createElement('div');
  container.className = 'product-detail-container';

  container.appendChild(createImageSection(product));
  container.appendChild(createInfoSection(product));

  main.appendChild(container);
}
