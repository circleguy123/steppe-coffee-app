import i18n from "@/src/i18n";

// Static translation map for iiko items.
// Russian is the source language. Add new items as needed.
const map: Record<string, Record<string, string>> = {
  // ---- Categories ----
  "Кофе": { en: "Coffee", zh: "咖啡", kk: "Кофе" },
  "Спэшл напитки": { en: "Special Drinks", zh: "特调饮品", kk: "Арнайы сусындар" },
  "Напитки": { en: "Drinks", zh: "饮品", kk: "Сусындар" },
  "Комбо": { en: "Combo", zh: "套餐", kk: "Комбо" },
  "Десерты": { en: "Desserts", zh: "甜点", kk: "Десерттер" },
  "Еда": { en: "Food", zh: "餐食", kk: "Тамақ" },
  "Выпечка": { en: "Pastries", zh: "烘焙", kk: "Пісірілген тағамдар" },
  "Снеки": { en: "Snacks", zh: "小吃", kk: "Снектер" },

  // ---- Coffee ----
  "Айс Американо": { en: "Iced Americano", zh: "冰美式咖啡", kk: "Айс Американо" },
  "Американо S": { en: "Americano S", zh: "美式咖啡 S", kk: "Американо S" },
  "Американо L": { en: "Americano L", zh: "美式咖啡 L", kk: "Американо L" },
  "Капучино S": { en: "Cappuccino S", zh: "卡布奇诺 S", kk: "Капучино S" },
  "Капучино L": { en: "Cappuccino L", zh: "卡布奇诺 L", kk: "Капучино L" },
  "Латте S": { en: "Latte S", zh: "拿铁 S", kk: "Латте S" },
  "Латте L": { en: "Latte L", zh: "拿铁 L", kk: "Латте L" },
  "Флэт Уайт": { en: "Flat White", zh: "澳白咖啡", kk: "Флэт Уайт" },
  "Раф S": { en: "Raf S", zh: "拉夫咖啡 S", kk: "Раф S" },
  "Раф L": { en: "Raf L", zh: "拉夫咖啡 L", kk: "Раф L" },
  "Эспрессо": { en: "Espresso", zh: "浓缩咖啡", kk: "Эспрессо" },
  "Двойной Эспрессо": { en: "Double Espresso", zh: "双份浓缩", kk: "Қос Эспрессо" },
  "Мокко S": { en: "Mocha S", zh: "摩卡 S", kk: "Мокко S" },
  "Мокко L": { en: "Mocha L", zh: "摩卡 L", kk: "Мокко L" },
  "Айс Латте": { en: "Iced Latte", zh: "冰拿铁", kk: "Айс Латте" },
  "Айс Капучино": { en: "Iced Cappuccino", zh: "冰卡布奇诺", kk: "Айс Капучино" },
  "Айс Мокко": { en: "Iced Mocha", zh: "冰摩卡", kk: "Айс Мокко" },
  "Айс Раф": { en: "Iced Raf", zh: "冰拉夫咖啡", kk: "Айс Раф" },
  "Айс Флэт Уайт": { en: "Iced Flat White", zh: "冰澳白", kk: "Айс Флэт Уайт" },
  "Какао": { en: "Cocoa", zh: "可可", kk: "Какао" },
  "Матча Латте": { en: "Matcha Latte", zh: "抹茶拿铁", kk: "Матча Латте" },
  "Чай": { en: "Tea", zh: "茶", kk: "Шай" },
  "Лимонад": { en: "Lemonade", zh: "柠檬水", kk: "Лимонад" },
  "Бамбл": { en: "Bumble", zh: "蜂蜜咖啡", kk: "Бамбл" },
  "Фильтр кофе": { en: "Filter Coffee", zh: "滴滤咖啡", kk: "Фильтр кофе" },
  "Кофе с молоком": { en: "Coffee with Milk", zh: "牛奶咖啡", kk: "Сүтті кофе" },
  "Горячий шоколад": { en: "Hot Chocolate", zh: "热巧克力", kk: "Ыстық шоколад" },
  "Айс Чай": { en: "Iced Tea", zh: "冰茶", kk: "Айс Шай" },

  // ---- Rewards (these come from iiko in English) ----
  "COFFEE EXTRAS": { zh: "咖啡配料", kk: "КОФЕ ҚОСЫМША", ru: "Кофейные допы" },
  "CONVENTIONAL DRINK": { zh: "经典饮品", kk: "ДӘСТҮРЛІ СУСЫН", ru: "Обычный напиток" },
  "SPECIAL DRINK": { zh: "特调饮品", kk: "АРНАЙЫ СУСЫН", ru: "Спецнапиток" },

  // ---- Sizes ----
  "Маленький": { en: "Small", zh: "小杯", kk: "Кіші" },
  "Средний": { en: "Medium", zh: "中杯", kk: "Орта" },
  "Большой": { en: "Large", zh: "大杯", kk: "Үлкен" },
};

export function translateIiko(text: string | null | undefined): string {
  if (!text) return "";
  const lang = i18n.language || "en";
  if (lang === "ru") return text;
  if (map[text]?.[lang]) return map[text][lang];
  // Case-insensitive fallback
  for (const [key, vals] of Object.entries(map)) {
    if (key.toLowerCase() === text.toLowerCase() && vals[lang]) return vals[lang];
  }
  return text;
}
