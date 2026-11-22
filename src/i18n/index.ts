import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import zh from './locales/zh.json';

export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
] as const;

export const STORAGE_KEY = 'napacitor-lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    // English is the default; only an explicit user choice (persisted in
    // localStorage) overrides it, so we deliberately do not detect from the
    // browser language.
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    load: 'currentOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: STORAGE_KEY,
    },
  });

export default i18n;
