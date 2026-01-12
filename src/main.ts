import './styles/main.css';
import { i18n } from './i18n';
import { router } from './router';
import { catalogService } from './data/catalog';
import { renderHomePage } from './pages/home';
import { renderCategoryPage } from './pages/category';
import { renderProductPage } from './pages/product';
import { renderContactPage } from './pages/contact';
import { createSearchBar } from './components/searchBar';
import { createLangSwitcher } from './components/langSwitcher';

async function init(): Promise<void> {
  try {
    // Initialize i18n and load catalog
    await Promise.all([i18n.init(), catalogService.load()]);

    // Setup header
    renderHeader();

    // Register routes
    router.register('/', renderHomePage);
    router.register('/c/:id', renderCategoryPage);
    router.register('/p/:id', renderProductPage);
    router.register('/contact', renderContactPage);

    // Start router
    router.init();

    // Listen for locale changes and re-render
    window.addEventListener('localechange', () => {
      renderHeader();
      // Re-render current page
      window.dispatchEvent(new Event('hashchange'));
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    const main = document.getElementById('main');
    if (main) {
      main.innerHTML = '<div class="error-page"><p>Failed to load application. Please refresh the page.</p></div>';
    }
  }
}

function renderHeader(): void {
  const header = document.getElementById('header');
  if (!header) return;

  header.innerHTML = '';
  header.className = 'header';

  const nav = document.createElement('nav');
  nav.className = 'nav';

  // Logo / Home link
  const logo = document.createElement('a');
  logo.href = '#/';
  logo.className = 'logo';
  logo.textContent = i18n.t('site.title');

  // Search bar
  const searchBar = createSearchBar();

  // Right section: Contact link + Lang switcher
  const rightSection = document.createElement('div');
  rightSection.className = 'nav-right';

  const contactLink = document.createElement('a');
  contactLink.href = '#/contact';
  contactLink.className = 'nav-link';
  contactLink.textContent = i18n.t('nav.contact');

  const langSwitcher = createLangSwitcher();

  rightSection.appendChild(contactLink);
  rightSection.appendChild(langSwitcher);

  nav.appendChild(logo);
  nav.appendChild(searchBar);
  nav.appendChild(rightSection);

  header.appendChild(nav);
}

// Start the app
init();
