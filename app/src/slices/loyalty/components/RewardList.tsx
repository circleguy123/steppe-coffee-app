import { TransportMenuCategoryDto } from "@/__generated__/graphql";
import { FlatList } from "react-native";
import { RewardListItem } from "./RewardListItem";
import { RewardItem } from "../store/reward.store";

export interface RewardListProps {
  category?: TransportMenuCategoryDto;
  onSelectReward: (item: RewardItem) => void;
  activeItem?: RewardItem;
}

export const RewardList: React.FC<RewardListProps> = ({
  category,
  activeItem,
  onSelectReward,
}) => {
  return (
    <FlatList
      contentContainerStyle={{ gap: 16, padding: 16 }}
      data={category?.items}
      keyExtractor={({ itemId }) => itemId}
      renderItem={({ item }) => (
        <RewardListItem
          isActive={activeItem?.itemId === item.itemId}
          onPress={() =>
            onSelectReward({
              amount: 1,
              itemId: item.itemId,
              itemSizeId: item.itemSizes[0].sizeId,
            })
          }
          item={item}
        />
      )}
    />
  );
};
