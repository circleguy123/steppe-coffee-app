import { Image, Animated } from "react-native";
import Constants from "expo-constants";

export interface SaigakHeaderProps extends React.PropsWithChildren {
  title?: string;
  animHeaderValue: Animated.Value;
}

const Header_Max_Padding = 28;
const Header_Min_Padding = 8;

export const SaigakHeader: React.FC<SaigakHeaderProps> = ({
  title,
  children,
  animHeaderValue,
}) => {
  const animateHeaderPadding = animHeaderValue.interpolate({
    inputRange: [0, Header_Max_Padding - Header_Min_Padding],
    outputRange: [Header_Max_Padding, Header_Min_Padding],
    extrapolate: "clamp",
  });
  const animateHeaderPaddingTop = animHeaderValue.interpolate({
    inputRange: [
      0,
      Constants.statusBarHeight + Header_Max_Padding - Header_Min_Padding,
    ],
    outputRange: [
      Constants.statusBarHeight + Header_Max_Padding,
      Constants.statusBarHeight + Header_Min_Padding,
    ],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        paddingTop: animateHeaderPaddingTop,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: animateHeaderPadding,
        paddingHorizontal: 16,
        backgroundColor: "#FFF",
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        shadowOffset: {
          height: 10,
          width: 0,
        },
        shadowColor: "black",
        shadowOpacity: 0.12,
        shadowRadius: 16,
      }}
    >
      {children}

      <Image
        style={{
          position: "absolute",
          bottom: 0,
          right: 90,
          width: 109,
          height: 86,
        }}
        source={require("@/assets/images/saigak-header-bg.png")}
      />
    </Animated.View>
  );
};
