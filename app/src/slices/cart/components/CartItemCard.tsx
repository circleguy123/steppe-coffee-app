import { Animated, PanResponder, View } from "react-native";
import { CartItemType } from "../store/cart.store";
import { SteppeText } from "@/src/components/SteppeText";
import { formatNumber } from "@/src/utils/formatNumber";
import { CounterButton } from "@/src/components/CounterButton";
import { useEffect, useRef } from "react";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { UrlImage } from "@/src/components/UrlImage";

export interface CartItemCardProps {
  item: CartItemType;
  onAmountChange: (amount: number) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onAmountChange,
}) => {
  const panX = useRef(new Animated.Value(0)).current;
  const animatedFade = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          return Animated.event([null, { dx: panX }], {
            useNativeDriver: false,
          })(evt, gestureState);
        }
      },
      onPanResponderTerminate: () => {
        panX.setValue(0);
      },
      onPanResponderRelease: () => {
        const dx = Number(JSON.stringify(panX));
        if (dx < -100) {
          Animated.parallel([
            Animated.timing(panX, {
              toValue: -10000,
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.timing(animatedFade, {
              toValue: 1,
              duration: 100,
              useNativeDriver: false,
            }),
          ]).start(() => onAmountChange(0));
          // Swipe right threshold, you can adjust this value
        } else {
          panX.setValue(0);
        }
      },
    });
  }).current;

  useEffect(() => panX.removeAllListeners(), []);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: Colors.red,
        borderRadius: 8,
        marginBottom: animatedFade.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100],
        }),
        opacity: animatedFade.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
        }),
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          paddingRight: 24,
        }}
      >
        <AntDesign name="delete" color="#FFF" size={24} style={{}} />
      </View>
      <Animated.View
        style={[
          {
            flexDirection: "row",
            transform: [{ translateX: panX }],
            flex: 1,
            backgroundColor: "#FFF",
            borderRadius: 8,
          },
        ]}
        {...panResponder().panHandlers}
      >
        <UrlImage
          source={item.itemSize.buttonImageUrl || undefined}
          placeholderContentFit="contain"
          contentFit="cover"
          style={{
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            width: 100,
            height: 100,
          }}
        />
        <View
          style={{
            padding: 16,
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <SteppeText style={{ fontWeight: "600" }}>{item.name}</SteppeText>
            <SteppeText style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              {item.itemSize.sizeName || item.itemSize.sizeCode}
            </SteppeText>

            {item.modifiers && item.modifiers.length > 0 && (
              <View style={{ marginTop: 4 }}>
                {item.modifiers.map((modifier, index) => (
                  <SteppeText
                    key={`${modifier.modifier.itemId}-${index}`}
                    style={{
                      fontSize: 11,
                      color: "#888",
                      marginLeft: 8,
                    }}
                  >
                    {modifier.modifier.name}
                    {modifier.amount > 1 && ` (x${modifier.amount})`}
                  </SteppeText>
                ))}
              </View>
            )}
          </View>

          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <SteppeText style={{ flex: 1, fontWeight: "600" }}>
              {formatNumber(
                (() => {
                  const basePrice = item.itemSize.prices[0]?.price ?? 0;
                  const modifierPrice = (item.modifiers || []).reduce(
                    (total, modifier) => {
                      const price = modifier.modifier.prices[0]?.price ?? 0;
                      return total + price * modifier.amount;
                    },
                    0
                  );
                  return (basePrice + modifierPrice) * item.amount;
                })()
              )}{" "}
              ₸
            </SteppeText>

            <CounterButton
              buttonStyle={{}}
              count={item.amount}
              onCountChange={onAmountChange}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};
