import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: require("../public/locales/en/common.json"),
    },
    cn: {
      common: require("../public/locales/cn/common.json"),
    },
  },
  lng: "en", // 设置默认语言
  fallbackLng: "en", // 回退语言
  interpolation: {
    escapeValue: false, // React 已经安全
  },
});

export default i18n;
