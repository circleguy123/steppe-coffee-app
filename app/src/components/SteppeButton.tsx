import React, { useRef, useEffect } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SteppeText } from "./SteppeText";
import { Colors } from "@/constants/Colors";

interface SteppeButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  icon?: React.ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

export const SteppeButton = React.forwardRef<View, SteppeButtonProps>(
  function SteppeButton(
    { title, icon, textStyle, buttonStyle, loading = false, ...props },
    ref
  ) {
    const rotation = useRef(new Animated.Value(0)).current;

    // Animation effect for rotation
    useEffect(() => {
      if (loading) {
        const loopAnimation = Animated.loop(
          Animated.timing(rotation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        );
        loopAnimation.start();
        return () => loopAnimation.stop(); // Stop animation when unmounted
      }
    }, [loading, rotation]);

    // Interpolate rotation value
    const spin = rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <Pressable
        {...props}
        style={({ pressed }) => [
          styles.button,
          buttonStyle,
          {
            opacity: pressed ? 0.5 : 1,
          },
          props.disabled && {
            backgroundColor: "#EEE",
          },
        ]}
        ref={ref}
        disabled={loading || props.disabled} // Disable button during loading
      >
        {loading ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons name="loading" size={24} color="black" />
          </Animated.View>
        ) : (
          <>
            {icon}
            <SteppeText
              style={[
                styles.text,
                textStyle,
                props.disabled && {
                  color: "#999",
                },
              ]}
            >
              {title}
            </SteppeText>
          </>
        )}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: Colors.yellow,
    padding: 24,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontSize: 18,
  },
});
