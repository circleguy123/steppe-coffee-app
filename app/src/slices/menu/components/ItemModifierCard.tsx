import { Colors } from "@/constants/Colors";
import { CounterButton } from "@/src/components/CounterButton";
import { SteppeText } from "@/src/components/SteppeText";
import { UrlImage } from "@/src/components/UrlImage";
import { formatNumber } from "@/src/utils/formatNumber";
import { TransportModifierItemDto } from "@/__generated__/graphql";
import { View, Pressable, GestureResponderEvent } from "react-native";

/**
 * ItemModifierCard Component
 *
 * A card component that displays an individual modifier option.
 * Shows the modifier image, name, price, and allows quantity selection.
 *
 * @param modifier - The TransportModifierItemDto object containing modifier data
 * @param quantity - Current selected quantity for this modifier
 * @param minQuantity - Minimum allowed quantity (from restrictions)
 * @param maxQuantity - Maximum allowed quantity (from restrictions)
 * @param onQuantityChange - Callback function called when quantity changes
 * @param disabled - Whether the modifier is disabled for selection
 *
 * @example
 * <ItemModifierCard
 *   modifier={modifierItem}
 *   quantity={selectedQuantities[modifierItem.itemId] || 0}
 *   minQuantity={0}
 *   maxQuantity={5}
 *   onQuantityChange={(quantity) => handleQuantityChange(modifierItem.itemId, quantity)}
 * />
 */
export interface ItemModifierCardProps {
  modifier: TransportModifierItemDto;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  disabled?: boolean;
}

export function ItemModifierCard({
  modifier,
  quantity,
  minQuantity = 0,
  maxQuantity = 10,
  onQuantityChange,
  disabled = false,
}: ItemModifierCardProps) {
  const price = modifier.prices[0]?.price || 0;
  const isFree = price === 0;

  return (
    <View
      style={{
        backgroundColor: "#FFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: quantity > 0 ? Colors.green : "#E0E0E0",
        padding: 12,
        opacity: disabled ? 0.5 : 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
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
            color: quantity > 0 ? Colors.green : "#000",
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
              color: quantity > 0 ? Colors.green : "#666",
              fontWeight: isFree ? "600" : "normal",
            }}
          >
            {isFree ? "Free" : `+${formatNumber(price)} ₸`}
          </SteppeText>

          {modifier.portionWeightGrams && (
            <SteppeText
              style={{
                fontSize: 10,
                color: "#999",
              }}
            >
              {modifier.portionWeightGrams}g
            </SteppeText>
          )}
        </View>
      </View>

      <CounterButton
        count={quantity}
        onCountChange={onQuantityChange || (() => {})}
        buttonStyle={{
          backgroundColor: quantity > 0 ? Colors.green : "#f0f0f0",
        }}
      />
    </View>
  );
}
