import React, { forwardRef } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { SteppeText } from "./SteppeText";

interface SteppeLinkProps extends Omit<PressableProps, "style"> {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const SteppeLink = forwardRef<View, SteppeLinkProps>(function (
  { title, textStyle, containerStyle, disabled, ...props },
  ref
) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        containerStyle,
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      ref={ref}
    >
      <SteppeText
        style={[
          styles.text,
          textStyle,
          disabled
            ? {
                color: "#999",
              }
            : {},
        ]}
      >
        {title}
      </SteppeText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  text: {
    // borderBottomWidth: 2,
    borderBottomColor: "#038300",
    color: "#038300",
    fontSize: 16,
  },
});
