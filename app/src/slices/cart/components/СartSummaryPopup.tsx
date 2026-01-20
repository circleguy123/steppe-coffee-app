import { useEffect } from "react";
import { Animated, Pressable, useAnimatedValue, View } from "react-native";
import AnimatedTotal from "../../menu/components/AnimatedTotal";
import { CartItemType } from "../store/cart.store";
import { UrlImage } from "@/src/components/UrlImage";

export interface CartSummaryPopupProps {
  total: number;
  onPress: () => void;
  cartItems: CartItemType[];
}

export const CartSummaryPopup: React.FC<CartSummaryPopupProps> = ({
  total,
  onPress,
  cartItems,
}) => {
  const bottomAnim = useAnimatedValue(-100); // Initial value for opacity: 0

  useEffect(() => {
    if (total > 0) {
      Animated.timing(bottomAnim, {
        toValue: 26,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(bottomAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [total > 0]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: bottomAnim,
        left: 0,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Pressable
        style={({ pressed }) => [
          {
            width: "auto",
            backgroundColor: "#FFF",
            borderRadius: 60,
            shadowOffset: {
              height: 0,
              width: 0,
            },
            shadowColor: "black",
            shadowOpacity: 0.12,
            shadowRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={onPress}
      >
        <AnimatedTotal
          total={total}
          style={{ marginRight: 50, fontSize: 28 }}
        />

        {cartItems.slice(0, 5).map((cartItem, idx) => (
          <View
            key={`${cartItem.itemId}-${cartItem.itemSize.sizeId}`}
            style={{
              margin: 2,
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              borderRadius: 60,
              backgroundColor: "#EEE",
              width: 60,
              height: 60,
              marginLeft: -40,
              zIndex: cartItems.length - idx,
            }}
          >
            <UrlImage
              style={{ height: 60, width: 60, borderRadius: 60 }}
              source={cartItem.itemSize.buttonImageUrl || undefined}
              placeholderContentFit="cover"
              contentFit="cover"
            />
          </View>
        ))}
      </Pressable>
    </Animated.View>
  );
};
