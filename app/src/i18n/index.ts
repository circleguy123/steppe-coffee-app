import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ru from './locales/ru.json';
import kk from './locales/kk.json';
import zh from './locales/zh.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  kk: { translation: kk },
  zh: { translation: zh },
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

const LANGUAGE_KEY = 'app_language';

export const getStoredLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (lang) return lang;
    
    const deviceLang = Localization.locale.split('-')[0];
    if (['en', 'ru', 'kk', 'zh'].includes(deviceLang)) {
      return deviceLang;
    }
    return 'ru';
  } catch {
    return 'ru';
  }
};

export const setStoredLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

// Clear broken auto-translate cache (one-time cleanup)
AsyncStorage.getAllKeys().then(keys => {
  const bad = keys.filter(k => k.startsWith('iiko_tr_'));
  if (bad.length > 0) AsyncStorage.multiRemove(bad);
});

getStoredLanguage().then((lang) => {
  i18n.changeLanguage(lang);
});

export default i18n;