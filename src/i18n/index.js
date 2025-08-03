import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: 'en',            // default language
    fallbackLng: 'en',    // fallback language
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
