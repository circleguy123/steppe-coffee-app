import { TransportModifierGroupDto } from "@/__generated__/graphql";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { View } from "react-native";
import { ItemModifierRadioCard } from "./ItemModifierRadioCard";
import { Colors } from "@/constants/Colors";

/**
 * ItemModifierGroup Component
 *
 * A component that displays a group of modifiers with radio selection behavior.
 * Allows only one modifier to be selected per group, enforcing single-choice selection.
 *
 * @param modifierGroup - The TransportModifierGroupDto object containing group data
 * @param selectedModifierId - The ID of the currently selected modifier (null if none selected)
 * @param onSelectionChange - Callback called when modifier selection changes
 *
 * @example
 * <ItemModifierGroup
 *   modifierGroup={modifierGroupData}
 *   selectedModifierId={selectedModifierId}
 *   onSelectionChange={(modifierId) => setSelectedModifierId(modifierId)}
 * />
 */
export interface ItemModifierGroupProps {
  modifierGroup: TransportModifierGroupDto;
  selectedModifierId?: string | null;
  onSelectionChange?: (modifierId: string | null) => void;
}

export function ItemModifierGroup({
  modifierGroup,
  selectedModifierId,
  onSelectionChange,
}: ItemModifierGroupProps) {
  const handleModifierPress = (modifierId: string) => {
    // If the same modifier is pressed again, deselect it
    if (selectedModifierId === modifierId) {
      onSelectionChange?.(null);
    } else {
      onSelectionChange?.(modifierId);
    }
  };

  // Check if selection is required based on restrictions
  const restrictions = modifierGroup.restrictions;
  const minQuantity = restrictions.minQuantity || 0;
  const isRequired = minQuantity > 0;

  return (
    <View style={{ gap: 12 }}>
      <View>
        <SteppeTitle style={{ fontSize: 18, fontWeight: "600" }}>
          {modifierGroup.name}
          {isRequired && (
            <SteppeText
              style={{
                fontSize: 14,
                color: Boolean(selectedModifierId) ? Colors.green : Colors.red,
              }}
            >
              {" "}
              (Required)
            </SteppeText>
          )}
        </SteppeTitle>

        {modifierGroup.description && (
          <SteppeText style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            {modifierGroup.description}
          </SteppeText>
        )}

        <SteppeText style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
          Choose one option
        </SteppeText>
      </View>

      <View style={{ gap: 8 }}>
        {modifierGroup.items.map((modifier) => (
          <ItemModifierRadioCard
            key={modifier.itemId}
            modifier={modifier}
            isSelected={selectedModifierId === modifier.itemId}
            onPress={() => handleModifierPress(modifier.itemId)}
          />
        ))}
      </View>
    </View>
  );
}
