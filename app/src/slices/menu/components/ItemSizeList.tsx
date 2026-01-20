import { TransportItemSizeDto } from "@/__generated__/graphql";
import { FlatList, View } from "react-native";
import { ItemSizeCard } from "./ItemSizeCard";
import { useState } from "react";

/**
 * ItemSizeList Component
 *
 * A horizontal scrollable list that displays item size options as cards.
 * Users can select one size from the available options.
 *
 * @param itemSizes - Array of TransportItemSizeDto objects to display
 * @param onSizeSelect - Callback function called when a size is selected
 * @param selectedSizeId - Optional controlled selected size ID
 *
 * @example
 * <ItemSizeList
 *   itemSizes={menuItem.itemSizes}
 *   onSizeSelect={(size) => console.log('Selected:', size)}
 *   selectedSizeId={currentSelectedId}
 * />
 */
export interface ItemSizeListProps {
  itemSizes: TransportItemSizeDto[];
  onSizeSelect?: (itemSize: TransportItemSizeDto) => void;
  selectedSizeId?: string | null;
}

export function ItemSizeList({
  itemSizes,
  onSizeSelect,
  selectedSizeId,
}: ItemSizeListProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedSizeId ||
      itemSizes.find((size) => size.isDefault)?.sizeId ||
      itemSizes[0]?.sizeId ||
      null
  );

  const handleSizePress = (itemSize: TransportItemSizeDto) => {
    setInternalSelectedId(itemSize.sizeId || null);
    onSizeSelect?.(itemSize);
  };

  const currentSelectedId = selectedSizeId || internalSelectedId;

  return (
    <FlatList
      data={itemSizes}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        gap: 12,
        paddingHorizontal: 16,
      }}
      keyExtractor={(item) => item.sizeId || item.sku}
      renderItem={({ item }) => (
        <ItemSizeCard
          itemSize={item}
          isSelected={currentSelectedId === item.sizeId}
          onPress={() => handleSizePress(item)}
        />
      )}
    />
  );
}
