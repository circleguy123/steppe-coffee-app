import { SteppeText } from "./SteppeText";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ComponentProps } from "react";

export interface MenuListData {
  title: string;
  onPress: () => void;
  icon?: ComponentProps<typeof AntDesign>["name"];
}

export interface MenuListProps extends MenuListData {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
}

export const MenuListItem: React.FC<MenuListProps> = ({
  icon,
  title,
  onPress,
  style,
  textStyle,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={StyleSheet.compose(
        {
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 4,
          borderBottomColor: "#999",
          borderBottomWidth: 1,
        },
        style
      )}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        {icon && <AntDesign color={iconColor} name={icon} size={18} />}
        <SteppeText style={StyleSheet.compose({ fontSize: 16 }, textStyle)}>
          {title}
        </SteppeText>
      </View>

      <AntDesign name="right" size={24} />
    </TouchableOpacity>
  );
};
