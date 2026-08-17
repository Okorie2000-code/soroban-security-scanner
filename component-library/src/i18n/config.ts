import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-fs-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../../../locales/en/common.json';
import esTranslations from '../../../locales/es/common.json';
import arTranslations from '../../../locales/ar/common.json';

/**
 * Right-to-left (RTL) locales — the single authoritative source of text
 * direction for this package. Arabic (`ar`) and Hebrew (`he`) resolve to
 * RTL; add new RTL locales here and `supportedLanguages`, `isRTL` and
 * `getTextDirection` pick them up automatically.
 */
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'] as const;

export type RtlLocale = (typeof RTL_LOCALES)[number];

export type TextDirection = 'rtl' | 'ltr';

// Utility functions
export const isRTL = (language: string): boolean => {
  return RTL_LOCALES.includes(language as RtlLocale);
};

export const getTextDirection = (language: string): TextDirection => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

// Supported languages. Direction is derived from `RTL_LOCALES` so the RTL
// list stays the single source of truth.
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ar', name: 'العربية' }
].map(lang => ({ ...lang, dir: getTextDirection(lang.code) }));

// Resources object
const resources = {
  en: {
    common: enTranslations
  },
  es: {
    common: esTranslations
  },
  ar: {
    common: arTranslations
  }
};

// i18n configuration
const i18nConfig = {
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  
  supportedLngs: supportedLanguages.map(lang => lang.code),
  
  resources,
  
  ns: ['common'],
  defaultNS: 'common',
  
  interpolation: {
    escapeValue: false, // React already escapes
    
    // Custom formatters
    format: (value: string, format?: string, lng?: string): string => {
      if (format === 'currency') {
        const currencyFormats: Record<string, string> = {
          'en': 'en-US',
          'es': 'es-ES',
          'ar': 'ar-SA'
        };
        
        return new Intl.NumberFormat(currencyFormats[lng || 'en'], {
          style: 'currency',
          currency: 'USD'
        }).format(Number(value));
      }
      
      if (format === 'date') {
        const dateFormats: Record<string, string> = {
          'en': 'en-US',
          'es': 'es-ES',
          'ar': 'ar-SA'
        };
        
        return new Intl.DateTimeFormat(dateFormats[lng || 'en']).format(new Date(value));
      }
      
      return value;
    }
  },
  
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng'
  }
};

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n;

export const formatCurrency = (
  amount: number, 
  language: string = 'en', 
  currency: string = 'USD'
): string => {
  const currencyFormats: Record<string, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'ar': 'ar-SA'
  };
  
  return new Intl.NumberFormat(currencyFormats[language] || 'en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatDate = (
  date: Date | string | number,
  language: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateFormats: Record<string, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'ar': 'ar-SA'
  };
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat(
    dateFormats[language] || 'en-US',
    { ...defaultOptions, ...options }
  ).format(new Date(date));
};

export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export const changeLanguage = async (language: string): Promise<void> => {
  await i18n.changeLanguage(language);
  
  // Update document direction for RTL support
  document.documentElement.dir = getTextDirection(language);
  document.documentElement.lang = language;
};

// Hook for language management
export const useLanguage = () => {
  const currentLanguage = getCurrentLanguage();
  const direction = getTextDirection(currentLanguage);
  const isRTLDirection = isRTL(currentLanguage);
  
  return {
    currentLanguage,
    direction,
    isRTLDirection,
    changeLanguage,
    supportedLanguages
  };
};
