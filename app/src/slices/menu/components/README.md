# Item Modifier Components

This module provides a complete solution for displaying and managing item modifiers in a menu system. The components are designed to work together to create a comprehensive modifier selection interface.

## Components Overview

### 1. `ItemModifierCard`

**Location**: `/src/slices/menu/components/ItemModifierCard.tsx`

A card component that displays an individual modifier option with:

- Modifier image, name, and description
- Price display (shows "Free" for zero-cost items)
- Quantity selection with counter button
- Visual feedback for selected state

**Key Features**:

- Supports quantity restrictions (min/max)
- Visual green highlighting when selected
- Disabled state handling
- Responsive card layout

### 2. `ItemModifierGroup`

**Location**: `/src/slices/menu/components/ItemModifierGroup.tsx`

A group component that manages a collection of related modifiers with:

- Group title and description
- Restriction enforcement (min/max quantities)
- Real-time validation feedback
- Selection state management

**Key Features**:

- Displays selection requirements ("Required", "Select 1-3 items", etc.)
- Shows current selection count
- Enforces group-level restrictions
- Automatically disables options when limits are reached

### 3. `ItemModifierList`

**Location**: `/src/slices/menu/components/ItemModifierList.tsx\*\*

A scrollable list that displays all modifier groups for a selected item size:

- Manages state across multiple modifier groups
- Provides callbacks for selection changes
- Scrollable interface for large modifier lists

**Key Features**:

- Handles complex nested state (groups → modifiers → quantities)
- Clean state management with automatic cleanup
- Smooth scrolling experience

## Data Flow

```
TransportItemSizeDto
└── itemModifierGroups: TransportModifierGroupDto[]
    ├── restrictions: ModifierRestrictionsDto
    └── items: TransportModifierItemDto[]
        ├── prices: TransportPriceDto[]
        └── restrictions?: ModifierRestrictionsDto
```

## Usage Example

```tsx
// In a menu item detail screen
const [selectedSize, setSelectedSize] = useState<TransportItemSizeDto | null>(
  null
);
const [modifierSelections, setModifierSelections] = useState<
  Record<string, Record<string, number>>
>({});

// When size changes, reset modifiers
const handleSizeSelect = (itemSize: TransportItemSizeDto) => {
  setSelectedSize(itemSize);
  setModifierSelections({});
};

// Display modifiers for selected size
{
  selectedSize && selectedSize.itemModifierGroups.length > 0 && (
    <ItemModifierList
      modifierGroups={selectedSize.itemModifierGroups}
      onSelectionsChange={setModifierSelections}
      selectedModifiers={modifierSelections}
    />
  );
}
```

## State Structure

The modifier selection state follows this structure:

```typescript
type ModifierSelections = Record<string, Record<string, number>>;

// Example:
{
  "milk-options-group-id": {
    "whole-milk-id": 1,
    "oat-milk-id": 0
  },
  "extras-group-id": {
    "extra-shot-id": 2,
    "whipped-cream-id": 1
  }
}
```

## Features

### Restriction Handling

- **Group Level**: Min/max total items in a group
- **Item Level**: Min/max quantity per individual modifier
- **Required Groups**: Visual indication and validation
- **Dynamic Disabling**: Prevents selection when limits are reached

### Visual Design

- Consistent with existing app design system
- Uses `Colors.green` for selection states
- Responsive card layouts
- Clear typography hierarchy
- Loading and disabled states

### Accessibility

- Proper touch targets
- Clear visual feedback
- Descriptive text for restrictions
- Keyboard navigation support

## Integration Notes

These components integrate seamlessly with:

- `ItemSizeList` for size selection
- Existing cart management system
- GraphQL schema types
- App-wide theming and styling

The components are designed to be reusable across different menu contexts while maintaining consistent behavior and appearance.
