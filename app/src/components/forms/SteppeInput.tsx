import React from "react";
import { View, StyleSheet, TextInput, TextInputProps } from "react-native";
import MaskedTextInput from "react-native-mask-input";
import { SteppeText } from "../SteppeText";

interface SteppeInputProps extends TextInputProps {
  label?: string;
  error?: string;
  mask?: (string | RegExp)[];
  disabled?: boolean;
}

export const SteppeInput: React.FC<SteppeInputProps> = ({
  label,
  error,
  mask,
  disabled,
  ...props
}) => {
  const InputComponent = mask ? MaskedTextInput : TextInput;

  return (
    <View style={styles.container}>
      {label && <SteppeText style={styles.label}>{label}</SteppeText>}
      <InputComponent
        {...props}
        {...(disabled ? { onChange: () => {} } : {})}
        mask={mask}
        style={[styles.input, disabled && styles.disabledInput, props.style]}
        placeholderTextColor="#999"
        focusable={!disabled}
      />
      {error && <SteppeText style={styles.error}>{error}</SteppeText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    fontSize: 14,
    marginTop: 5,
    color: "red",
  },
  input: {
    borderColor: "#DDD",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    padding: 16,
    fontFamily: "Montserrat",
    color: "black",
  },
  disabledInput: {
    backgroundColor: "#EEE",
  },
});
