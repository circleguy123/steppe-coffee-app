import { Pressable, StyleSheet, View } from "react-native";
import { TransportMenuCategoryDto } from "@/__generated__/graphql";
import { SteppeText } from "@/src/components/SteppeText";
import { useRef } from "react";

export interface MenuCategoryButtonProps {
  isActive: boolean;
  category: TransportMenuCategoryDto;
  onMeasureComplete: (
    categoryId: string,
    coords: { x: number; y: number }
  ) => void;
  onPress: (categoryId: string) => void;
}

export const MenuCategoryButton: React.FC<MenuCategoryButtonProps> = ({
  isActive,
  category,
  onMeasureComplete,
  onPress,
}) => {
  const buttonRef = useRef<View>(null);
  return (
    <Pressable
      ref={buttonRef}
      onLayout={() => {
        buttonRef.current?.measureInWindow((x, y) => {
          onMeasureComplete(category.id, { x, y });
        });
      }}
      style={({ pressed }) => [
        styles.buttonBase,
        isActive ? styles.buttonActive : styles.buttonInactive,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={() => onPress(category.id)}
    >
      <SteppeText style={isActive ? styles.textActive : styles.textInactive}>
        {category.name}
      </SteppeText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: 30,
    borderRadius: 6,
    paddingHorizontal: 26,
    paddingVertical: 6,
  },
  buttonActive: {
    backgroundColor: "#2D9237",
  },
  buttonInactive: {},
  textActive: {
    color: "#FFF",
  },
  textInactive: {
    color: "#000",
    opacity: 0.35,
  },
});
