import { Stack } from "expo-router";

export default function ProfileLayoutRoute() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="feedback" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="membership" />
      <Stack.Screen name="add-card" options={{ presentation: "modal" }} />
      <Stack.Screen name="my-bookings" />
      <Stack.Screen name="booking" />
    </Stack>
  );
}