import { i18n } from '../i18n';
import { catalogService } from '../data/catalog';
import { createProductCard } from './productCard';

export function createSearchBar(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'search-bar-container';

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'search-input-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = i18n.t('search.placeholder');

  const icon = document.createElement('span');
  icon.className = 'search-icon';
  icon.innerHTML = '🔍';

  inputWrapper.appendChild(icon);
  inputWrapper.appendChild(input);

  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'search-results hidden';

  container.appendChild(inputWrapper);
  container.appendChild(resultsContainer);

  let debounceTimer: number;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      const query = input.value.trim();

      if (!query) {
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
      }

      const results = catalogService.searchProducts(query);

      if (results.length === 0) {
        resultsContainer.innerHTML = `<p class="search-no-results">${i18n.t('search.noResults')}</p>`;
        resultsContainer.classList.remove('hidden');
        return;
      }

      resultsContainer.innerHTML = '';
      resultsContainer.classList.remove('hidden');

      const grid = document.createElement('div');
      grid.className = 'product-grid';

      results.slice(0, 6).forEach((product) => {
        grid.appendChild(createProductCard(product));
      });

      resultsContainer.appendChild(grid);
    }, 300);
  });

  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      resultsContainer.classList.add('hidden');
    }
  });

  return container;
}
