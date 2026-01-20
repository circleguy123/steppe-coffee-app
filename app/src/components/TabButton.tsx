import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TabTriggerSlotProps } from "expo-router/ui";
import { ComponentProps, Ref, forwardRef } from "react";
import { Text, Pressable, View } from "react-native";

type Icon = ComponentProps<typeof AntDesign>["name"];

export type TabButtonProps = TabTriggerSlotProps & {
  icon?: Icon;
};

export const TabButton = forwardRef(
  ({ icon, children, isFocused, ...props }: TabButtonProps, ref: Ref<View>) => {
    return (
      <View
        ref={ref}
        {...props}
        style={[
          {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            padding: 20,
            borderRadius: 60,
          },
          isFocused ? { backgroundColor: "#EEE" } : undefined,
        ]}
      >
        <AntDesign
          name={icon}
          size={32}
          color={isFocused ? Colors.green : "black"}
        />
      </View>
    );
  }
);
