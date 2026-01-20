import { TransportModifierGroupDto } from "@/__generated__/graphql";
import { ScrollView, View } from "react-native";
import { ItemModifierGroup } from "./ItemModifierGroup";
import { useState } from "react";

/**
 * ItemModifierList Component
 *
 * A scrollable list component that displays all modifier groups for a selected item size.
 * Manages the state of all modifier selections across groups using radio selection.
 *
 * @param modifierGroups - Array of TransportModifierGroupDto objects to display
 * @param onSelectionsChange - Callback function called when any modifier selections change
 * @param selectedModifiers - Object mapping group IDs to their selected modifier ID
 *
 * @example
 * <ItemModifierList
 *   modifierGroups={selectedSize?.itemModifierGroups || []}
 *   onSelectionsChange={(selections) => setAllModifierSelections(selections)}
 *   selectedModifiers={currentSelections}
 * />
 */
export interface ItemModifierListProps {
  modifierGroups: TransportModifierGroupDto[];
  onSelectionsChange?: (selections: Record<string, string | null>) => void;
  selectedModifiers?: Record<string, string | null>;
}

export function ItemModifierList({
  modifierGroups,
  onSelectionsChange,
  selectedModifiers = {},
}: ItemModifierListProps) {
  const [internalSelections, setInternalSelections] =
    useState<Record<string, string | null>>(selectedModifiers);

  const currentSelections = selectedModifiers || internalSelections;

  const handleGroupChange = (groupId: string, modifierId: string | null) => {
    const newSelections = {
      ...currentSelections,
      [groupId]: modifierId,
    };

    // Clean up null selections
    if (modifierId === null) {
      delete newSelections[groupId];
    }

    setInternalSelections(newSelections);
    onSelectionsChange?.(newSelections);
  };

  if (modifierGroups.length === 0) {
    return null;
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        gap: 24,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {modifierGroups.map((group) => (
        <ItemModifierGroup
          key={group.itemGroupId}
          modifierGroup={group}
          selectedModifierId={currentSelections[group.itemGroupId] || null}
          onSelectionChange={(modifierId) =>
            handleGroupChange(group.itemGroupId, modifierId)
          }
        />
      ))}
    </ScrollView>
  );
}
