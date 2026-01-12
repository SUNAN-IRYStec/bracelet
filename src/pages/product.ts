import { catalogService } from '../data/catalog';
import { i18n } from '../i18n';
import { router } from '../router';

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

  // Left: Images
  const imageSection = document.createElement('div');
  imageSection.className = 'product-images';

  const mainImage = document.createElement('img');
  mainImage.src = product.images.preview;
  mainImage.alt = i18n.t(product.nameKey);
  mainImage.className = 'product-main-image';
  imageSection.appendChild(mainImage);

  // Gallery thumbnails
  if (product.images.gallery.length > 0) {
    const gallery = document.createElement('div');
    gallery.className = 'product-gallery';

    // Include preview as first thumbnail
    const previewThumb = document.createElement('img');
    previewThumb.src = product.images.preview;
    previewThumb.alt = i18n.t(product.nameKey);
    previewThumb.className = 'gallery-thumb active';
    previewThumb.onclick = () => {
      mainImage.src = product.images.preview;
      document.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
      previewThumb.classList.add('active');
    };
    gallery.appendChild(previewThumb);

    product.images.gallery.forEach((imgSrc) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.alt = i18n.t(product.nameKey);
      thumb.className = 'gallery-thumb';
      thumb.loading = 'lazy';
      thumb.onclick = () => {
        mainImage.src = imgSrc;
        document.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      };
      gallery.appendChild(thumb);
    });

    imageSection.appendChild(gallery);
  }

  // View Original button
  const viewOriginalBtn = document.createElement('button');
  viewOriginalBtn.className = 'btn-primary btn-view-original';
  viewOriginalBtn.textContent = i18n.t('button.viewOriginal');
  viewOriginalBtn.onclick = () => {
    window.open(product.images.original, '_blank');
  };
  imageSection.appendChild(viewOriginalBtn);

  container.appendChild(imageSection);

  // Right: Info
  const infoSection = document.createElement('div');
  infoSection.className = 'product-info';

  const name = document.createElement('h1');
  name.textContent = i18n.t(product.nameKey);
  infoSection.appendChild(name);

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = product.priceText;
  infoSection.appendChild(price);

  const tags = document.createElement('div');
  tags.className = 'product-tags';
  product.tags.forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.className = 'tag';
    tagEl.textContent = tag;
    tags.appendChild(tagEl);
  });
  infoSection.appendChild(tags);

  const desc = document.createElement('p');
  desc.className = 'product-long-desc';
  desc.textContent = i18n.t(product.longDescKey);
  infoSection.appendChild(desc);

  // Specs table
  if (product.specs.length > 0) {
    const specsTitle = document.createElement('h3');
    specsTitle.textContent = i18n.t('specs.title');
    infoSection.appendChild(specsTitle);

    const specsTable = document.createElement('table');
    specsTable.className = 'specs-table';

    product.specs.forEach((spec) => {
      const row = document.createElement('tr');

      const keyCell = document.createElement('td');
      keyCell.textContent = i18n.t(spec.k);
      keyCell.className = 'spec-key';

      const valueCell = document.createElement('td');
      valueCell.textContent = spec.v;
      valueCell.className = 'spec-value';

      row.appendChild(keyCell);
      row.appendChild(valueCell);
      specsTable.appendChild(row);
    });

    infoSection.appendChild(specsTable);
  }

  container.appendChild(infoSection);
  main.appendChild(container);
}
