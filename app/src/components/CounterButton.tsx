import React from "react";
import {
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  TextStyle,
} from "react-native";
import { SteppeText } from "./SteppeText";
import { Colors } from "@/constants/Colors";

interface CounterButtonProps {
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  count: number;
  onCountChange: (count: number) => void;
}

export const CounterButton: React.FC<CounterButtonProps> = ({
  buttonStyle,
  textStyle,
  count = 0,
  onCountChange,
}) => {
  if (count === 0) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.button,
          buttonStyle,
          {
            opacity: pressed ? 0.5 : 1,
          },
        ]}
        onPress={() => onCountChange(1)}
      >
        <SteppeText style={[styles.text, textStyle]}>+</SteppeText>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.button,
        buttonStyle,
        {
          backgroundColor: Colors.green,
        },
      ]}
    >
      <Pressable
        onPress={() => onCountChange(Math.max(0, count - 1))}
        style={({ pressed }) => [
          { flex: 1, alignItems: "center", opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <SteppeText style={[styles.textWhite, textStyle]}>-</SteppeText>
      </Pressable>
      <SteppeText style={[styles.textWhite, textStyle]}>{count}</SteppeText>
      <Pressable
        onPress={() => onCountChange(count + 1)}
        style={({ pressed }) => [
          { flex: 1, alignItems: "center", opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <SteppeText style={[styles.textWhite, textStyle]}>+</SteppeText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: Colors.yellow,
    padding: 4,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
  },
  textWhite: {
    fontSize: 18,
    color: "#FFF",
  },
});
