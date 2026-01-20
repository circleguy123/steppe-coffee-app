import {
  CreateUserOrderInput,
  CreateUserOrderItemModifierInput,
  ExternalMenuPreset,
  TransportItemDto,
  TransportItemSizeDto,
  TransportModifierItemDto,
} from "@/__generated__/graphql";
import { createStore } from "zustand";

export type CartItemType = Omit<TransportItemDto, "itemSizes"> & {
  amount: number;
  itemSize: TransportItemSizeDto;
  modifiers?: CartModifierType[];
};

export type CartModifierType = {
  modifier: TransportModifierItemDto;
  amount: number;
};

export interface CartState {
  menu?: ExternalMenuPreset;
  menuItemPrices: Record<string, number>;
  modifierPrices: Record<string, number>;
  order: CreateUserOrderInput;
  total: number;
  cartItems: CartItemType[];
  /** Key value storage with menu items */
  menuItems: Record<string, TransportItemDto>;
  /** Key value storage with modifier items */
  modifierItems: Record<string, TransportModifierItemDto>;
}

export interface CartActions {
  setMenu: (menu: ExternalMenuPreset) => void;
  addItem: (item: {
    productId: string;
    amount: number;
    productSizeId: string | null | undefined;
    modifiers?: CreateUserOrderItemModifierInput[];
  }) => void;
  clearOrder: () => void;
}

export const cartStore = createStore<CartState & CartActions>()((set) => ({
  total: 0,
  menu: undefined,
  menuItemPrices: {},
  modifierPrices: {},
  order: {
    userOrderItem: [],
  },
  cartItems: [],
  menuItems: {},
  modifierItems: {},
  clearOrder: () =>
    set(() => ({
      order: {
        userOrderItem: [],
      },
      total: 0,
      cartItems: [],
    })),
  setMenu: (menu: ExternalMenuPreset) =>
    set(() => {
      const menuItemsFlat = menu.itemCategories.flatMap(
        (category) => category.items
      );

      // Calculate prices for menu items
      const menuItemPrices = menuItemsFlat
        .flatMap((item) =>
          item.itemSizes.flatMap((size) => ({
            key: `${item.itemId}-${size.sizeId}`,
            price: size.prices[0]?.price ?? 0,
          }))
        )
        .reduce((acc, curr) => {
          acc[curr.key] = curr.price;
          return acc;
        }, {} as Record<string, number>);

      // Extract all modifiers and their prices
      const allModifiers = menuItemsFlat.flatMap((item) =>
        item.itemSizes.flatMap((size) =>
          size.itemModifierGroups.flatMap((group) => group.items)
        )
      );

      const modifierPrices = allModifiers
        .map((modifier) => ({
          key: modifier.itemId,
          price: modifier.prices[0]?.price ?? 0,
        }))
        .reduce((acc, curr) => {
          acc[curr.key] = curr.price;
          return acc;
        }, {} as Record<string, number>);

      const modifierItems = allModifiers.reduce((acc, curr) => {
        acc[curr.itemId] = curr;
        return acc;
      }, {} as Record<string, TransportModifierItemDto>);

      const menuItems = menuItemsFlat.reduce((acc, curr) => {
        acc[curr.itemId] = curr;
        return acc;
      }, {} as Record<string, TransportItemDto>);

      return {
        menu,
        menuItems,
        menuItemPrices,
        modifierPrices,
        modifierItems,
      };
    }),
  addItem: ({ productId, amount, productSizeId, modifiers = [] }) =>
    set(
      ({ order, menuItemPrices, modifierPrices, menuItems, modifierItems }) => {
        const items = (() => {
          const existingItem = order.userOrderItem?.find(
            (userOrderItem) =>
              userOrderItem?.productId === productId &&
              userOrderItem.productSizeId === productSizeId &&
              JSON.stringify(userOrderItem.modifiers) ===
                JSON.stringify(modifiers)
          );

          if (existingItem) {
            return amount === 0
              ? order.userOrderItem?.filter(
                  (item) =>
                    !(
                      item?.productId === productId &&
                      item?.productSizeId === productSizeId &&
                      JSON.stringify(item.modifiers) ===
                        JSON.stringify(modifiers)
                    )
                ) ?? []
              : order.userOrderItem?.map((item) =>
                  item?.productId === productId &&
                  item.productSizeId === productSizeId &&
                  JSON.stringify(item.modifiers) === JSON.stringify(modifiers)
                    ? { ...item, amount }
                    : item
                ) ?? [];
          }
          return (order.userOrderItem ?? []).concat([
            {
              productId,
              amount,
              productSizeId,
              modifiers,
            },
          ]);
        })();

        const total = items.reduce((total, curr) => {
          // Base price
          const basePrice =
            menuItemPrices[`${curr?.productId}-${curr?.productSizeId}`] ?? 0;

          // Modifier prices
          const modifierPrice = (curr?.modifiers || []).reduce(
            (modTotal, modifier) => {
              if (modifier) {
                const price = modifierPrices[modifier.productId] ?? 0;
                return modTotal + price * modifier.amount;
              }
              return modTotal;
            },
            0
          );

          const itemTotal = basePrice + modifierPrice;
          return total + (curr?.amount ?? 0) * itemTotal;
        }, 0);

        const cartItems = items.reduce((cartItems, item) => {
          if (item) {
            const menuItem = menuItems[item.productId];

            if (menuItem) {
              const { itemSizes, ...cartItem } = menuItem;
              const itemSize = itemSizes.find(
                ({ sizeId }) => item.productSizeId === sizeId
              );
              if (itemSize) {
                // Map modifiers to cart modifier format
                const cartModifiers: CartModifierType[] = (item.modifiers || [])
                  .map((modifier) => {
                    if (modifier) {
                      const modifierItem = modifierItems[modifier.productId];
                      if (modifierItem) {
                        return {
                          modifier: modifierItem,
                          amount: modifier.amount,
                        };
                      }
                    }
                    return null;
                  })
                  .filter(
                    (modifier): modifier is CartModifierType =>
                      modifier !== null
                  );

                return cartItems.concat([
                  {
                    ...cartItem,
                    itemSize,
                    amount: item.amount,
                    modifiers:
                      cartModifiers.length > 0 ? cartModifiers : undefined,
                  },
                ]);
              }
            }
          }
          return cartItems;
        }, [] as CartItemType[]);

        return {
          order: {
            userOrderItem: items,
          },
          total,
          cartItems,
        };
      }
    ),
}));
