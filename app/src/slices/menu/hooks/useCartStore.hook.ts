import {
  CreateUserOrderInput,
  ExternalMenuPreset,
} from "@/__generated__/graphql";
import { create } from "zustand/react";

interface CartState {
  menu?: ExternalMenuPreset;
  menuItemPrices: Record<string, number>;
  order: CreateUserOrderInput;
  total: number;
}

interface CartActions {
  setMenu: (menu: ExternalMenuPreset) => void;
  addItem: (
    productId: string,
    amount: number,
    sizeId: string | null | undefined
  ) => void;
  clearOrder: () => void;
}

export const useCartStore = create<CartState & CartActions>((set) => ({
  total: 0,
  menu: undefined,
  menuItemPrices: {},
  order: {
    userOrderItem: [],
  },
  clearOrder: () =>
    set(() => ({
      order: {
        userOrderItem: [],
      },
      total: 0,
    })),
  setMenu: (menu: ExternalMenuPreset) =>
    set(() => {
      const menuItemPrices = menu.itemCategories
        .flatMap((category) =>
          category.items.flatMap((item) =>
            item.itemSizes.flatMap((size) => ({
              key: `${item.itemId}-${size.sizeId}`,
              price: size.prices[0]?.price ?? 0,
            }))
          )
        )
        .reduce((acc, curr) => {
          acc[curr.key] = curr.price;
          return acc;
        }, {} as Record<string, number>);

      return {
        menu,
        menuItemPrices,
      };
    }),
  addItem: (
    productId: string,
    amount: number,
    productSizeId: string | null | undefined
  ) =>
    set(({ order, menuItemPrices }) => {
      const existingItem = order.userOrderItem?.find(
        (userOrderItem) =>
          userOrderItem?.productId === productId &&
          userOrderItem.productSizeId === productSizeId
      );

      if (existingItem) {
        const items =
          amount === 0
            ? order.userOrderItem?.filter(
                (item) =>
                  !(
                    item?.productId === productId &&
                    item?.productSizeId === productSizeId
                  )
              ) ?? []
            : order.userOrderItem?.map((item) =>
                item?.productId === productId &&
                item.productSizeId === productSizeId
                  ? { ...item, amount }
                  : item
              ) ?? [];

        const total = items.reduce((total, curr) => {
          const price =
            menuItemPrices[`${curr?.productId}-${curr?.productSizeId}`] ?? 0;
          return total + (curr?.amount ?? 0) * price;
        }, 0);

        return {
          order: {
            userOrderItem: items,
          },
          total,
        };
      }

      const items = (order.userOrderItem ?? []).concat([
        {
          productId,
          amount,
          productSizeId,
        },
      ]);

      const total = items.reduce((total, curr) => {
        const price =
          menuItemPrices[`${curr?.productId}-${curr?.productSizeId}`] ?? 0;
        return total + (curr?.amount ?? 0) * price;
      }, 0);

      return {
        order: {
          userOrderItem: items,
        },
        total,
      };
    }),
}));
