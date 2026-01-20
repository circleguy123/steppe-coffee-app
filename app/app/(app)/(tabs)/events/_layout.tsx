import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.yellow,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
