import { Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/src/components/ParallaxScrollView";

export const ProfileLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.yellowDark,
        dark: Colors.yellowDark,
      }}
      headerImage={
        <Image
          source={require("@/assets/images/onboarding/slide-1.png")}
          style={styles.headerImage}
        />
      }
    >
      {children}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: 200,
    height: 117,
    bottom: 10,
    left: 100,
    position: "absolute",
  },
});
