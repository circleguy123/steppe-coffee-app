import { Colors } from "@/constants/Colors";
import { SteppeText } from "@/src/components/SteppeText";
import { UrlImage } from "@/src/components/UrlImage";
import { formatNumber } from "@/src/utils/formatNumber";
import { TransportModifierItemDto } from "@/__generated__/graphql";
import { View, Pressable, GestureResponderEvent } from "react-native";

/**
 * ItemModifierRadioCard Component
 *
 * A radio-style card component that displays an individual modifier option.
 * Shows the modifier image, name, price, and allows single selection (radio button style).
 *
 * @param modifier - The TransportModifierItemDto object containing modifier data
 * @param isSelected - Whether this modifier is currently selected
 * @param onPress - Callback function called when the card is pressed
 * @param disabled - Whether the modifier is disabled for selection
 *
 * @example
 * <ItemModifierRadioCard
 *   modifier={modifierItem}
 *   isSelected={selectedModifierId === modifierItem.itemId}
 *   onPress={() => handleModifierSelection(modifierItem.itemId)}
 * />
 */
export interface ItemModifierRadioCardProps {
  modifier: TransportModifierItemDto;
  isSelected: boolean;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  disabled?: boolean;
}

export function ItemModifierRadioCard({
  modifier,
  isSelected,
  onPress,
  disabled = false,
}: ItemModifierRadioCardProps) {
  const price = modifier.prices[0]?.price || 0;
  const isFree = price === 0;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: "#FFF",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: isSelected ? Colors.green : "#E0E0E0",
          padding: 12,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Radio button indicator */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: isSelected ? Colors.green : "#E0E0E0",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isSelected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: Colors.green,
            }}
          />
        )}
      </View>

      {modifier.buttonImage && (
        <UrlImage
          source={modifier.buttonImage}
          style={{
            width: 50,
            height: 50,
            borderRadius: 6,
          }}
          contentFit="cover"
          placeholderContentFit="cover"
        />
      )}

      <View style={{ flex: 1, gap: 4 }}>
        <SteppeText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: isSelected ? Colors.green : "#000",
          }}
        >
          {modifier.name}
        </SteppeText>

        {modifier.description && (
          <SteppeText
            style={{
              fontSize: 12,
              color: "#666",
              lineHeight: 16,
            }}
          >
            {modifier.description}
          </SteppeText>
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SteppeText
            style={{
              fontSize: 12,
              color: isSelected ? Colors.green : "#666",
              fontWeight: isFree ? "600" : "normal",
            }}
          >
            {isFree ? "Free" : "+" + formatNumber(price) + " ₸"}
          </SteppeText>

          {modifier.portionWeightGrams && (
            <SteppeText
              style={{
                fontSize: 10,
                color: "#999",
              }}
            >
              {modifier.portionWeightGrams + "g"}
            </SteppeText>
          )}
        </View>
      </View>
    </Pressable>
  );
}
