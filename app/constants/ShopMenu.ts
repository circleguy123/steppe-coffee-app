export enum MenuItemTypes {
  drinkSizeable,
  drinkNonSizeable,
  food,
}

export const menuItems = [
  {
    image: require("@/assets/images/menu/coffee-1.jpg"),
    title: "Americano",
    description: "Classical American coffee with a rich, deep-rooted aroma.",
    type: MenuItemTypes.drinkSizeable,
    sizes: [
      {
        size: 250,
        price: 700,
      },
      {
        size: 300,
        price: 900,
      },
      {
        size: 400,
        price: 1000,
      },
    ],
  },
  {
    image: require("@/assets/images/menu/coffee-1.jpg"),
    title: "Cappuccino",
    description: "Classical American coffee with a rich, deep-rooted aroma.",
    type: MenuItemTypes.drinkSizeable,
    sizes: [
      {
        size: 250,
        price: 1000,
      },
      {
        size: 300,
        price: 1200,
      },
      {
        size: 400,
        price: 1400,
      },
    ],
  },
  {
    image: require("@/assets/images/menu/coffee-1.jpg"),
    title: "Latte",
    description: "Classical American coffee with a rich, deep-rooted aroma.",
    type: MenuItemTypes.drinkSizeable,
    sizes: [
      {
        size: 100,
        price: 100,
      },
      {
        size: 200,
        price: 200,
      },
      {
        size: 300,
        price: 300,
      },
    ],
  },
];
