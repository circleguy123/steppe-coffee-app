import { FlatList, RefreshControl, View, StyleSheet } from "react-native";
import { CommunityCard } from "./CommunityCard";
import { SteppeText } from "@/src/components/SteppeText";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

interface Community {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  memberCount?: number;
}

interface CommunityListProps {
  data: Community[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function CommunityList({ data, isLoading, onRefresh }: CommunityListProps) {
  const router = useRouter();

  if (!isLoading && data.length === 0) {
    return (
      <View style={styles.empty}>
        <SteppeText style={styles.emptyText}>No communities yet</SteppeText>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CommunityCard
          {...item}
          onPress={() => router.push(`/(app)/(tabs)/community/${item.id}`)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={Colors.green}
        />
      }
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});