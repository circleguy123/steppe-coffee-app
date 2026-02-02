import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/src/hooks/useColorScheme";
import { useSession } from "@/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartContextProvider } from "@/src/slices/cart/context/cart.context";
import { RewardsContextProvider } from "@/src/slices/loyalty/context/rewards.context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading: isSessionLoading } = useSession();

  const [loaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../../assets/fonts/Montserrat-Bold.ttf"),
    MontserratBlack: require("../../assets/fonts/Montserrat-Black.ttf"),
    Opsilon: require("../../assets/fonts/Opsilon-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && isSessionLoading === false) {
      router.replace("/(app)/(tabs)");

      SplashScreen.hideAsync();
    }
  }, [loaded, isSessionLoading]);

  if (!loaded) {
    return null;
  }

  return (
    <CartContextProvider>
      <RewardsContextProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
              screenOptions={{ headerShown: false }}
              initialRouteName="(tabs)"
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="login-otp" />
              <Stack.Screen name="barista" />
              <Stack.Screen
                name="membership-payment-modal"
                options={{
                  presentation: "modal",
                  title: "Membership Payment",
                }}
              />
              <Stack.Screen
                name="cart"
                options={{
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="reward"
                options={{
                  presentation: "modal",
                }}
              />
            </Stack>
            <StatusBar style="dark" />
          </GestureHandlerRootView>
        </ThemeProvider>
      </RewardsContextProvider>
    </CartContextProvider>
  );
}