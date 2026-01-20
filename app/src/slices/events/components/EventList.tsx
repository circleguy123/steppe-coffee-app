import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { EventListItem } from "./EventListItem";
import { EventOutput } from "@/__generated__/graphql";
import { RefreshControl } from "react-native-gesture-handler";

export interface EventListProps {
  data: EventOutput[];
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export const EventList: React.FC<EventListProps> = ({
  data,
  onScroll,
  isLoading,
  onRefresh,
}) => {
  return (
    <FlatList
      onScroll={onScroll}
      contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 32 }}
      data={data}
      renderItem={({ item }) => <EventListItem event={item} />}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    />
  );
};
