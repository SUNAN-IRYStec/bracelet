type Locale = 'en' | 'zh' | 'fr';

interface Translations {
  [key: string]: string;
}

class I18n {
  private currentLocale: Locale = 'en';
  private translations: Translations = {};
  private fallbackTranslations: Translations = {};

  async init(): Promise<void> {
    const saved = localStorage.getItem('locale') as Locale;
    const browserLang = navigator.language.toLowerCase();

    // Determine locale: saved > browser > default (en)
    if (saved && ['en', 'zh', 'fr'].includes(saved)) {
      this.currentLocale = saved;
    } else if (browserLang.startsWith('zh')) {
      this.currentLocale = 'zh';
    } else if (browserLang.startsWith('fr')) {
      this.currentLocale = 'fr';
    } else {
      this.currentLocale = 'en';
    }

    await this.loadTranslations();
  }

  async loadTranslations(): Promise<void> {
    try {
      // Load current locale
      const response = await fetch(`${import.meta.env.BASE_URL}locales/${this.currentLocale}.json`);
      this.translations = await response.json();

      // Load fallback (en) if not already loaded
      if (this.currentLocale !== 'en') {
        const fallbackResponse = await fetch(`${import.meta.env.BASE_URL}locales/en.json`);
        this.fallbackTranslations = await fallbackResponse.json();
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
