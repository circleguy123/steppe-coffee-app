import { Pressable, View } from "react-native";
import { SteppeText } from "@/src/components/SteppeText";
import { TransportItemDto } from "@/__generated__/graphql";
import { UrlImage } from "@/src/components/UrlImage";
import { Colors } from "@/constants/Colors";

export interface RewardListItemProps {
  item: TransportItemDto;
  onPress: () => void;
  isActive: boolean;
}

export const RewardListItem: React.FC<RewardListItemProps> = ({
  item,
  onPress,
  isActive,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          flexDirection: "row",
          flex: 1,
          backgroundColor: "#FFF",
          borderRadius: 8,
          opacity: pressed ? 0.7 : 1,
          borderWidth: 1,
          borderColor: "#FFF",
        },
      ]}
      onPress={onPress}
    >
      <UrlImage
        source={
          (item.itemSizes[0]?.buttonImageCroppedUrl &&
            item.itemSizes[0]?.buttonImageCroppedUrl["475x250"] &&
            item.itemSizes[0]?.buttonImageCroppedUrl["475x250"].url) ||
          undefined
        }
        style={{
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          width: 100,
          height: 100,
        }}
      />
      <View
        style={{
          padding: 8,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <SteppeText>{item.name}</SteppeText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              backgroundColor: isActive ? Colors.yellow : "transparent",
              borderColor: isActive ? "#FFF" : Colors.yellow,
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
              padding: 8,
              gap: 8,
            }}
          >
            <SteppeText>{isActive ? "Selected" : "Select"}</SteppeText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
