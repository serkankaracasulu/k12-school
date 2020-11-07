import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../public/locales/en/translation.json";
import tr from "../public/locales/tr/translation.json";
i18n.use(initReactI18next).init({
  fallbackLng: "en",
  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",
  resources: {
    en: {
      translation: en
    },
    tr: {
      translation: tr
    }
  },
  keySeparator: false,
  interpolation: {
    escapeValue: false // not needed for react!!
  }
});

export default i18n;
