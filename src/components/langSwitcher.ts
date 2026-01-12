import { i18n } from '../i18n';

export function createLangSwitcher(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'lang-switcher';

  const currentLang = i18n.getLocale();
  const locales = i18n.getSupportedLocales();

  locales.forEach((locale) => {
    const button = document.createElement('button');
    button.className = 'lang-btn';
    button.textContent = locale.name;

    if (locale.code === currentLang) {
      button.classList.add('active');
    }

    button.onclick = async () => {
      await i18n.setLocale(locale.code);
      // Will trigger re-render via 'localechange' event in main.ts
    };

    container.appendChild(button);
  });

  return container;
}
