import {
  TransportItemDto,
  TransportItemSizeDto,
} from "@/__generated__/graphql";
import { CounterButton } from "@/src/components/CounterButton";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeButton } from "@/src/components/SteppeButton";
import { UrlImage } from "@/src/components/UrlImage";
import { formatNumber } from "@/src/utils/formatNumber";
import { useCartContext } from "@/src/slices/cart/context/cart.context";
import { router } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";

export interface MenuItemCardProps {
  item: TransportItemDto;
  itemSize: TransportItemSizeDto;
  onPress: (data: {
    productId: string;
    amount: number;
    productSizeId: string | null | undefined;
    modifiers?: any[];
  }) => void;
  amount: number;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  itemSize,
  onPress,
  amount,
}) => {
  const { cartItems } = useCartContext();

  const hasVariations = useMemo(() => {
    return (
      item.itemSizes.length > 1 ||
      item.itemSizes[0].itemModifierGroups.length > 0
    );
  }, [item]);

  // Get all cart items that match this menu item
  const itemCartItems = useMemo(() => {
    return cartItems.filter((cartItem) => cartItem.itemId === item.itemId);
  }, [cartItems, item.itemId]);

  const onPressHandler = (count: number, cartItemIndex?: number) => {
    if (cartItemIndex !== undefined) {
      // Update existing cart item
      const cartItem = itemCartItems[cartItemIndex];
      onPress({
        productId: cartItem.itemId,
        amount: count,
        productSizeId: cartItem.itemSize.sizeId,
        modifiers: cartItem.modifiers?.map((m) => ({
          productId: m.modifier.itemId,
          amount: m.amount,
        })),
      });
    } else if (hasVariations) {
      // Navigate to customization screen
      router.navigate(`/(app)/(tabs)/menu/${item.itemId}`, {});
    } else {
      // Add simple item
      typeof itemSize.prices[0]?.price === "number" &&
        onPress({
          productId: item.itemId,
          amount: count,
          productSizeId: itemSize.sizeId,
        });
    }
  };

  const handleAddVariation = () => {
    router.navigate(`/(app)/(tabs)/menu/${item.itemId}`, {});
  };

  return (
    <View
      style={[
        {
          backgroundColor: "#FFF",
          borderRadius: 6,
          flex: 1 / 2,
        },
      ]}
      // onPress={() => onPress(item.itemId, amount, itemSize.sizeId)}
    >
      <UrlImage
        source={itemSize.buttonImageUrl}
        style={{
          width: "100%",
          minHeight: 120,
          flex: 1,
          alignSelf: "center",
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
        placeholderContentFit="contain"
        contentFit="cover"
      />
      <View
        style={{
          padding: 8,
          flex: 1,
          flexWrap: "nowrap",
          flexGrow: 1,
          width: "100%",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 2 }}>
          <SteppeTitle
            style={{
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {item.name}
          </SteppeTitle>
          <SteppeText style={{ fontSize: 12 }}>
            {itemSize.prices[0]?.price &&
              itemSize.prices[0]?.price > 0 &&
              `${hasVariations ? "From " : ""}${formatNumber(
                itemSize.prices[0]?.price
              )} ₸`}
          </SteppeText>
        </View>
        {/* Show existing cart items for this menu item */}
        {hasVariations && itemCartItems.length > 0 && (
          <View style={{ gap: 6, marginTop: 4 }}>
            {itemCartItems.map((cartItem, index) => {
              const modifierKey = cartItem.modifiers
                ? cartItem.modifiers
                    .map((m) => `${m.modifier.itemId}:${m.amount}`)
                    .join("-")
                : "no-modifiers";
              const uniqueKey = `${cartItem.itemId}-${cartItem.itemSize.sizeId}-${modifierKey}-${index}`;

              return (
                <View key={uniqueKey} style={{}}>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: 4,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <SteppeText style={{ fontSize: 10, fontWeight: "600" }}>
                        {cartItem.itemSize.sizeName ||
                          cartItem.itemSize.sizeCode}
                      </SteppeText>
                      {cartItem.modifiers && cartItem.modifiers.length > 0 && (
                        <View>
                          {cartItem.modifiers.map((modifier, modIndex) => (
                            <SteppeText
                              key={`${modifier.modifier.itemId}-${modIndex}`}
                              style={{ fontSize: 9, color: "#666" }}
                            >
                              {modifier.modifier.name}
                              {modifier.amount > 1 && ` (x${modifier.amount})`}
                            </SteppeText>
                          ))}
                        </View>
                      )}
                    </View>
                    <CounterButton
                      count={cartItem.amount}
                      onCountChange={(count) => onPressHandler(count, index)}
                      buttonStyle={{
                        width: "50%",
                        alignSelf: "flex-end",
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        minWidth: 20,
                        height: 20,
                      }}
                      textStyle={{ fontSize: 10 }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Add variation button or simple counter */}
        {hasVariations ? (
          <SteppeButton
            title={itemCartItems.length > 0 ? "Add Another" : "Customize"}
            onPress={handleAddVariation}
            buttonStyle={{
              paddingVertical: 6,
              paddingHorizontal: 8,
              marginTop: 4,
            }}
            textStyle={{
              fontSize: 10,
              fontWeight: "600",
            }}
          />
        ) : (
          <CounterButton
            buttonStyle={{ maxHeight: 28 }}
            count={amount}
            onCountChange={onPressHandler}
          />
        )}
      </View>
    </View>
  );
};
