import * as React from "react";
import { StyleSheet, Animated } from "react-native";
import { SteppeTitle } from "@/src/components/SteppeTitle";

const Header_Max_Height = 60;
const Header_Min_Height = 0;

export interface MenuHeaderProps {
  animHeaderValue: Animated.Value;
}

export default function MenuHeader({ animHeaderValue }: MenuHeaderProps) {
  const animateHeaderHeight = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: animateHeaderHeight,
        },
      ]}
    >
      <SteppeTitle style={styles.headerText}>Menu</SteppeTitle>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 52,
  },
});
