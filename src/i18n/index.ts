import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en";
import { ru } from "./locales/ru";

export const supportedLanguages = ["ru", "en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const languageStorageKey = "tripforge.language";
const defaultLanguage: SupportedLanguage = "ru";

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return supportedLanguages.includes(language as SupportedLanguage);
}

export function getCurrentLanguage(): SupportedLanguage {
  if (typeof localStorage === "undefined") {
    return defaultLanguage;
  }

  const storedLanguage = localStorage.getItem(languageStorageKey);

  if (storedLanguage && isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return defaultLanguage;
}

export function setCurrentLanguage(language: SupportedLanguage): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(languageStorageKey, language);
}

export const resources = {
  ru: { translation: ru },
  en: { translation: en }
} as const;

void i18next.use(initReactI18next).init({
  resources,
  lng: getCurrentLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export { en, ru };
export default i18next;
