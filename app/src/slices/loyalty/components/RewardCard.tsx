import { SteppeText } from "@/src/components/SteppeText";
import * as React from "react";
import { View, Pressable, GestureResponderEvent } from "react-native";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { UrlImage } from "@/src/components/UrlImage";
import { ComponentProps } from "react";
export interface RewardCardProps {
  title: string;
  image: ComponentProps<typeof UrlImage>["source"];
  points: number;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
}

export function RewardCard({ title, points, onPress, image }: RewardCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: "#FFF",
          opacity: pressed ? 0.8 : 1,
          borderRadius: 6,
          width: 150,
        },
      ]}
      onPress={onPress}
    >
      <UrlImage
        source={image}
        style={{
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          width: 150,
          height: 150,
        }}
        contentFit="contain"
        placeholderContentFit="contain"
      />
      <View
        style={{
          padding: 8,
        }}
      >
        <SteppeTitle>{title}</SteppeTitle>
        <SteppeText style={{}}>{points} pts</SteppeText>
      </View>
    </Pressable>
  );
}
