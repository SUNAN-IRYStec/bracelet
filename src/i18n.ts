type Locale = 'en' | 'zh' | 'fr';

const SUPPORTED_LOCALES: Locale[] = ['en', 'zh', 'fr'];
const DEFAULT_LOCALE: Locale = 'en';

interface Translations {
  [key: string]: string;
}

function isValidLocale(locale: string | null): locale is Locale {
  return locale !== null && SUPPORTED_LOCALES.includes(locale as Locale);
}

function detectBrowserLocale(): Locale {
  const browserLang = navigator.language.toLowerCase();

  for (const locale of SUPPORTED_LOCALES) {
    if (browserLang.startsWith(locale)) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
}

class I18n {
  private currentLocale: Locale = DEFAULT_LOCALE;
  private translations: Translations = {};
  private fallbackTranslations: Translations = {};

  async init(): Promise<void> {
    const saved = localStorage.getItem('locale');

    if (isValidLocale(saved)) {
      this.currentLocale = saved;
    } else {
      this.currentLocale = detectBrowserLocale();
    }

    await this.loadTranslations();
  }

  private async fetchTranslations(locale: Locale): Promise<Translations> {
    const response = await fetch(`${import.meta.env.BASE_URL}locales/${locale}.json`);
    return response.json();
  }

  async loadTranslations(): Promise<void> {
    try {
      this.translations = await this.fetchTranslations(this.currentLocale);

      if (this.currentLocale !== DEFAULT_LOCALE) {
        this.fallbackTranslations = await this.fetchTranslations(DEFAULT_LOCALE);
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  t(key: string): string {
    return this.translations[key] || this.fallbackTranslations[key] || key;
  }

  getLocale(): Locale {
    return this.currentLocale;
  }

  async setLocale(locale: Locale): Promise<void> {
    if (locale === this.currentLocale) return;

    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
    await this.loadTranslations();

    // Trigger re-render by dispatching custom event
    window.dispatchEvent(new CustomEvent('localechange'));
  }

  getSupportedLocales(): { code: Locale; name: string }[] {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'zh', name: '中文' },
    ];
  }
}

export const i18n = new I18n();
