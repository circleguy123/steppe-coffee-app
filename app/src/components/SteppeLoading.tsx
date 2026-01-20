import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface SteppeLoadingProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const SteppeLoading: React.FC<SteppeLoadingProps> = ({
  containerStyle,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  // Animation effect for rotation
  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    loopAnimation.start();
    return () => loopAnimation.stop(); // Stop animation when unmounted
  }, [rotation]);

  // Interpolate rotation value
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialCommunityIcons name="loading" size={24} color="black" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SteppeLoading;
