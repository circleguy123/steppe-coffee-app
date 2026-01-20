import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeButton } from "@/src/components/SteppeButton";
import { useCartContext } from "@/src/slices/cart/context/cart.context";
import { useLocalSearchParams, router } from "expo-router";
import { ItemSizeList } from "@/src/slices/menu/components/ItemSizeList";
import { ItemModifierList } from "@/src/slices/menu/components/ItemModifierList";
import { formatNumber } from "@/src/utils/formatNumber";

import { View } from "react-native";
import {
  TransportItemDto,
  TransportItemSizeDto,
} from "@/__generated__/graphql";
import { useState, useEffect, useMemo } from "react";

export default function MenuItemOptionsModal() {
  const { item: itemId } = useLocalSearchParams<{ item: string }>();
  const { menu, addItem } = useCartContext();
  const [selectedSize, setSelectedSize] = useState<TransportItemSizeDto | null>(
    null
  );
  const [modifierSelections, setModifierSelections] = useState<
    Record<string, string | null>
  >({});

  const item = menu?.itemCategories.reduce((menuItem, category) => {
    return menuItem || category.items.find((i) => i.itemId === itemId);
  }, undefined as TransportItemDto | undefined);

  // Set default size when item loads
  useEffect(() => {
    if (item && !selectedSize) {
      const defaultSize =
        item.itemSizes.find((size) => size.isDefault) || item.itemSizes[0];
      if (defaultSize) {
        setSelectedSize(defaultSize);
      }
    }
  }, [item, selectedSize]);

  const handleSizeSelect = (itemSize: TransportItemSizeDto) => {
    setSelectedSize(itemSize);
    // Reset modifier selections when size changes
    setModifierSelections({});
  };

  const handleModifierSelectionsChange = (
    selections: Record<string, string | null>
  ) => {
    setModifierSelections(selections);
  };

  const handleAddToCart = () => {
    if (selectedSize && item) {
      // Convert modifier selections to the format expected by addItem
      const modifiers = Object.values(modifierSelections)
        .filter((modifierId): modifierId is string => modifierId !== null)
        .map((modifierId) => ({
          productId: modifierId,
          amount: 1,
        }));

      addItem({
        productId: item.itemId,
        amount: 1,
        productSizeId: selectedSize.sizeId,
        modifiers: modifiers.length > 0 ? modifiers : undefined,
      });
      router.back();
    }
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!selectedSize) return 0;

    let basePrice = selectedSize.prices[0]?.price || 0;
    let modifierPrice = 0;

    // Add modifier prices
    Object.values(modifierSelections).forEach((modifierId) => {
      if (modifierId && selectedSize) {
        // Find the modifier in all modifier groups
        for (const group of selectedSize.itemModifierGroups) {
          const modifier = group.items.find(
            (item) => item.itemId === modifierId
          );
          if (modifier) {
            modifierPrice += modifier.prices[0]?.price || 0;
            break;
          }
        }
      }
    });

    return basePrice + modifierPrice;
  }, [selectedSize, modifierSelections]);

  // Check if all required modifiers are selected
  const areRequiredModifiersComplete = useMemo(() => {
    if (!selectedSize) return false;

    // Check each modifier group to see if required ones are selected
    for (const group of selectedSize.itemModifierGroups) {
      const minQuantity = group.restrictions.minQuantity || 0;
      const isRequired = minQuantity > 0;

      if (isRequired) {
        const hasSelection = modifierSelections[group.itemGroupId];
        if (!hasSelection) {
          return false; // Required group is not selected
        }
      }
    }

    return true; // All required modifiers are selected
  }, [selectedSize, modifierSelections]);

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        flex: 1,
        justifyContent: "space-between",
        paddingVertical: 16,
      }}
    >
      <SteppeTitle style={{ fontSize: 32, paddingHorizontal: 16 }}>
        Configure your order
      </SteppeTitle>
      <View style={{ flex: 1 }}>
        {item && item.itemSizes.length > 0 && (
          <View style={{ marginTop: 24 }}>
            <SteppeText
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
                paddingHorizontal: 16,
              }}
            >
              Choose Size
            </SteppeText>
            <ItemSizeList
              itemSizes={item.itemSizes}
              onSizeSelect={handleSizeSelect}
              selectedSizeId={selectedSize?.sizeId}
            />
          </View>
        )}

        {selectedSize && selectedSize.itemModifierGroups.length > 0 && (
          <View style={{ marginTop: 24, flex: 1 }}>
            <SteppeText
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
                paddingHorizontal: 16,
              }}
            >
              Customize Your Order
            </SteppeText>
            <ItemModifierList
              modifierGroups={selectedSize.itemModifierGroups}
              onSelectionsChange={handleModifierSelectionsChange}
              selectedModifiers={modifierSelections}
            />
          </View>
        )}

        {selectedSize && (
          <View
            style={{
              margin: 16,
              borderRadius: 8,
            }}
          >
            {!areRequiredModifiersComplete &&
              selectedSize &&
              selectedSize.itemModifierGroups.some(
                (group) => (group.restrictions.minQuantity || 0) > 0
              ) && (
                <SteppeText
                  style={{ marginBottom: 8, color: "#E53E3E", fontSize: 12 }}
                >
                  Please complete all required selections
                </SteppeText>
              )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <SteppeText style={{ fontSize: 18, fontWeight: "600" }}>
                Total: {formatNumber(totalPrice)} ₸
              </SteppeText>

              <SteppeButton
                title={
                  areRequiredModifiersComplete
                    ? "Add to Cart"
                    : "Complete Selection"
                }
                onPress={handleAddToCart}
                buttonStyle={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 30,
                }}
                textStyle={{
                  fontSize: 14,
                }}
                disabled={!areRequiredModifiersComplete} // Disable if required modifiers are not selected
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
