import {
  ExternalMenuPreset,
  TransportItemDto,
  TransportItemSizeDto,
  TransportMenuCategoryDto,
} from "@/__generated__/graphql";
import { useMemo } from "react";

export type MenuListCategoryItem = {
  type: "category";
  category: TransportMenuCategoryDto;
};

export type MenuListFillerItem = {
  type: "filler";
  key: string;
};

export type MenuListProductItem = {
  type: "item";
  category: TransportMenuCategoryDto;
  item: TransportItemDto;
  itemSize: TransportItemSizeDto;
};

export type MenuListItem =
  | MenuListCategoryItem
  | MenuListProductItem
  | MenuListFillerItem;

export const useMenuFlatList = (menu: ExternalMenuPreset | undefined) => {
  return useMemo<[MenuListItem[], number[]]>(() => {
    const listItems: MenuListItem[] = [];
    const categoryIndices: number[] = [];

    menu?.itemCategories.forEach((category) => {
      categoryIndices.push(listItems.length / 2);
      listItems.push({
        type: "category",
        category,
      });
      listItems.push({
        type: "filler",
        key: `${category.id}-filler-1`,
      });

      category.items.forEach((item) => {
        item.itemSizes.forEach((itemSize) => {
          listItems.push({
            type: "item",
            category,
            item,
            itemSize,
          });
        });
      });

      if (listItems.length % 2 === 1) {
        listItems.push({
          type: "filler",
          key: `${category.id}-filler-2`,
        });
      }
    });

    return [listItems, categoryIndices];
  }, [menu]);
};
