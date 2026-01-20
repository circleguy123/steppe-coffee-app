import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

export default function MenuLayout() {
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
      <Stack.Screen
        name="[item]"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
