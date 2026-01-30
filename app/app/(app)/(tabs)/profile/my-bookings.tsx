import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { GET_MY_BOOKINGS_QUERY } from "@/src/slices/community/community.gql";

export default function MyBookingsScreen() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_MY_BOOKINGS_QUERY);

  const bookings = data?.myBookings ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return Colors.green;
      case "pending": return "#FFA500";
      case "cancelled": return "#FF0000";
      default: return "#666";
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <SteppeTitle style={{ fontSize: 28 }}>My Bookings</SteppeTitle>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(app)/(tabs)/profile/booking")}
        >
          <AntDesign name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={Colors.green} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <AntDesign name="calendar" size={48} color="#CCC" />
            <SteppeText style={styles.emptyText}>No bookings yet</SteppeText>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => router.push("/(app)/(tabs)/profile/booking")}
            >
              <SteppeText style={styles.bookButtonText}>Book a Table</SteppeText>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tableInfo}>
                <AntDesign name="inbox" size={24} color={Colors.green} />
                <SteppeText style={styles.tableText}>Table {item.tableNumber}</SteppeText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <SteppeText style={styles.statusText}>{item.status}</SteppeText>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <AntDesign name="calendar" size={16} color="#666" />
                <SteppeText style={styles.infoText}>
                  {format(new Date(item.date), "EEEE, d MMMM yyyy")}
                </SteppeText>
              </View>
              <View style={styles.infoRow}>
                <AntDesign name="clockcircleo" size={16} color="#666" />
                <SteppeText style={styles.infoText}>{item.timeSlot}</SteppeText>
              </View>
              <View style={styles.infoRow}>
                <AntDesign name="user" size={16} color="#666" />
                <SteppeText style={styles.infoText}>{item.partySize} guests</SteppeText>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 60,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  addButton: {
    backgroundColor: Colors.green,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
  },
  bookButton: {
    backgroundColor: Colors.green,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tableInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tableText: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});