import { Colors } from "@/constants/Colors";
import { SteppeText } from "@/src/components/SteppeText";
import { UrlImage } from "@/src/components/UrlImage";
import { formatNumber } from "@/src/utils/formatNumber";
import { TransportItemSizeDto } from "@/__generated__/graphql";
import { Pressable, View, GestureResponderEvent } from "react-native";

/**
 * ItemSizeCard Component
 *
 * A card component that displays an individual item size option.
 * Shows the size image, name, price, and weight if available.
 *
 * @param itemSize - The TransportItemSizeDto object containing size data
 * @param isSelected - Whether this size option is currently selected
 * @param onPress - Callback function called when the card is pressed
 *
 * @example
 * <ItemSizeCard
 *   itemSize={sizeOption}
 *   isSelected={selectedSizeId === sizeOption.sizeId}
 *   onPress={() => handleSizeSelection(sizeOption)}
 * />
 */
export interface ItemSizeCardProps {
  itemSize: TransportItemSizeDto;
  isSelected?: boolean;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
}

export function ItemSizeCard({
  itemSize,
  isSelected = false,
  onPress,
}: ItemSizeCardProps) {
  const price = itemSize.prices[0]?.price;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: "#FFF",
          opacity: pressed ? 0.8 : 1,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: isSelected ? Colors.green : "#E0E0E0",
          padding: 8,
          alignItems: "center",
          minWidth: 120,
        },
      ]}
      onPress={onPress}
    >
      {itemSize.buttonImageUrl && (
        <UrlImage
          source={itemSize.buttonImageUrl}
          style={{
            width: 60,
            height: 60,
            borderRadius: 4,
            marginBottom: 8,
          }}
          contentFit="contain"
          placeholderContentFit="contain"
        />
      )}

      <View style={{ alignItems: "center", gap: 4 }}>
        {itemSize.sizeName && (
          <SteppeText
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isSelected ? Colors.green : "#000",
            }}
          >
            {itemSize.sizeName}
          </SteppeText>
        )}

        {price && (
          <SteppeText
            style={{
              fontSize: 12,
              color: isSelected ? Colors.green : "#666",
            }}
          >
            {`${formatNumber(price)} ₸`}
          </SteppeText>
        )}

        {itemSize.portionWeightGrams && (
          <SteppeText
            style={{
              fontSize: 10,
              color: "#999",
            }}
          >
            {`${itemSize.portionWeightGrams}g`}
          </SteppeText>
        )}
      </View>
    </Pressable>
  );
}
