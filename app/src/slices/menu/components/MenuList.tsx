import { forwardRef, useMemo } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  View,
} from "react-native";

import {
  CreateUserOrderInput,
  ExternalMenuPreset,
} from "@/__generated__/graphql";

import { SteppeTitle } from "@/src/components/SteppeTitle";
import { Colors } from "@/constants/Colors";

import { MenuItemCard } from "./MenuItemCard";
import { useMenuFlatList } from "../hooks/useMenuFlatList.hook";

export interface MenuProps {
  menu?: ExternalMenuPreset;
  order: CreateUserOrderInput;
  isLoading: boolean;
  onRefresh: () => void;
  onCategoryIdChange: (categoryId: string) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onAddItem: (item: {
    productId: string;
    amount: number;
    productSizeId: string | null | undefined;
  }) => void;
}

export const MenuList = forwardRef<FlatList, MenuProps>(
  (
    {
      menu,
      isLoading,
      onRefresh,
      onCategoryIdChange,
      onScroll,
      onAddItem,
      order,
    },
    ref
  ) => {
    const [menuListItems, menuCategoryIndices] = useMenuFlatList(menu);
    const itemAmountMap = useMemo(
      () =>
        order.userOrderItem?.reduce(
          (itemMap, item) =>
            item
              ? {
                  ...itemMap,
                  [item?.productId]: item?.amount,
                }
              : itemMap,
          {} as Record<string, number>
        ) ?? {},
      [JSON.stringify(order.userOrderItem)]
    );

    return (
      <FlatList
        ref={ref}
        stickyHeaderIndices={menuCategoryIndices}
        style={{}}
        contentContainerStyle={{
          gap: 16,
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
        columnWrapperStyle={{
          gap: 16,
          backgroundColor: Colors.dark.main,
        }}
        numColumns={2}
        onScroll={onScroll}
        data={menuListItems}
        onViewableItemsChanged={(info) => {
          info.viewableItems.map((item) => {
            if (
              item.isViewable &&
              typeof item.index === "number" &&
              item.item.type === "item" &&
              item.item?.category?.id
            ) {
              onCategoryIdChange(item.item?.category?.id);
            }
          });
        }}
        keyExtractor={(item) => {
          switch (item.type) {
            case "category":
              return `${item.category.id}`;
            case "filler":
              return item.key;
            default:
              return `${item.item.itemId}-${item.itemSize.sizeId}`;
          }
        }}
        renderItem={({ item }) => {
          if (item.type === "category") {
            return (
              <SteppeTitle
                style={{
                  fontSize: 39,
                  paddingVertical: 4,
                  flex: 1,
                  backgroundColor: Colors.dark.main,

                  shadowOffset: {
                    height: 10,
                    width: 0,
                  },
                  shadowColor: Colors.dark.main,
                  shadowOpacity: 0.12,
                  shadowRadius: 16,
                }}
              >
                {item.category.name}
              </SteppeTitle>
            );
          }

          if (item.type === "filler") {
            return <View style={{}} />;
          }

          return (
            <MenuItemCard
              key={`${item.item.itemId}-${item.itemSize.sizeId}`}
              itemSize={item.itemSize}
              item={item.item}
              onPress={onAddItem}
              amount={itemAmountMap[item.item.itemId]}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    );
  }
);
