import { useEffect, useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";

const GET_TODAY_DATA = gql`
  query GetTodayData {
    adminBookings {
      id
      tableNumber
      date
      timeSlot
      partySize
      status
      notes
      user {
        id
        name
        phone
      }
    }
    adminEvents {
      id
      title
      description
      eventDate
      location
      ticketsNumber
      price
    }
  }
`;

export default function BaristaDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch } = useQuery(GET_TODAY_DATA, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    loadUser();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("barista_user");
    if (userData) setUser(JSON.parse(userData));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("barista_token");
    await AsyncStorage.removeItem("barista_user");
    router.replace("/(app)/barista");
  };

  const today = format(new Date(), "yyyy-MM-dd");
  const todayBookings = (data?.adminBookings ?? []).filter(
    (b: any) => format(new Date(b.date), "yyyy-MM-dd") === today
  );

  const todayEvents = (data?.adminEvents ?? []).filter(
    (e: any) => format(new Date(e.eventDate), "yyyy-MM-dd") === today
  );

  const upcomingEvents = (data?.adminEvents ?? [])
    .filter((e: any) => new Date(e.eventDate) >= new Date())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "#4CAF50";
      case "pending": return "#FF9800";
      case "cancelled": return "#f44336";
      default: return "#999";
    }
  };

  const showTableDetails = (booking: any, tableNum: number) => {
    if (booking) {
      Alert.alert(
        t('booking.tableNumber', { number: tableNum }),
        `${t('booking.guestsCount', { count: booking.partySize })}\n${booking.user?.name || 'Guest'}\n${booking.user?.phone || 'N/A'}\n${t('booking.time')}: ${booking.timeSlot}${booking.notes ? `\n${t('booking.notes')}: ${booking.notes}` : ''}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <SteppeText style={styles.greeting}>{t('barista.hello')}, {user?.name || "Barista"}</SteppeText>
          <SteppeText style={styles.date}>{format(currentTime, "EEEE, d MMMM")}</SteppeText>
        </View>
        <View style={styles.headerRight}>
          <SteppeText style={styles.clock}>{format(currentTime, "HH:mm")}</SteppeText>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <AntDesign name="logout" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing || loading} 
            onRefresh={onRefresh}
            colors={[Colors.yellow]}
            tintColor={Colors.yellow}
          />
        }
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <SteppeText style={styles.statNumber}>{todayBookings.length}</SteppeText>
            <SteppeText style={styles.statLabel}>{t('barista.bookingsToday')}</SteppeText>
          </View>
          <View style={styles.statCard}>
            <SteppeText style={styles.statNumber}>{todayEvents.length}</SteppeText>
            <SteppeText style={styles.statLabel}>{t('barista.eventsToday')}</SteppeText>
          </View>
        </View>

        {/* Table Overview */}
        <View style={styles.section}>
          <SteppeTitle style={styles.sectionTitle}>{t('barista.tableStatus')}</SteppeTitle>
          <View style={styles.tableGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => {
              const booking = todayBookings.find(
                (b: any) => b.tableNumber === String(table) && b.status !== "cancelled"
              );
              return (
                <TouchableOpacity
                  key={table}
                  style={[
                    styles.tableBox,
                    { backgroundColor: booking ? Colors.yellow : "#E8F5E9" },
                  ]}
                  onPress={() => showTableDetails(booking, table)}
                >
                  <SteppeText style={styles.tableNum}>{table}</SteppeText>
                  <SteppeText style={styles.tableStatus}>
                    {booking ? booking.timeSlot : t('barista.free')}
                  </SteppeText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Today's Bookings */}
        <View style={styles.section}>
          <SteppeTitle style={styles.sectionTitle}>{t('barista.todaysBookings')}</SteppeTitle>
          {todayBookings.length === 0 ? (
            <View style={styles.emptyCard}>
              <SteppeText style={styles.emptyText}>{t('barista.noBookings')}</SteppeText>
            </View>
          ) : (
            todayBookings.map((booking: any) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <SteppeText style={styles.bookingTable}>{t('booking.tableNumber', { number: booking.tableNumber })}</SteppeText>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <SteppeText style={styles.statusText}>{t(`booking.${booking.status}`)}</SteppeText>
                  </View>
                </View>
                <View style={styles.bookingTime}>
                  <AntDesign name="clockcircleo" size={16} color="#333" />
                  <SteppeText style={styles.timeText}>{booking.timeSlot}</SteppeText>
                </View>
                <View style={styles.bookingDetails}>
                  <SteppeText style={styles.guestName}>{booking.user?.name || "Guest"}</SteppeText>
                  <SteppeText style={styles.guestInfo}>
                    {t('barista.guests', { count: booking.partySize })} • {booking.user?.phone || "No phone"}
                  </SteppeText>
                  {booking.notes && (
                    <SteppeText style={styles.notes}>{booking.notes}</SteppeText>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <SteppeTitle style={styles.sectionTitle}>{t('barista.upcomingEvents')}</SteppeTitle>
          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyCard}>
              <SteppeText style={styles.emptyText}>{t('barista.noEvents')}</SteppeText>
            </View>
          ) : (
            upcomingEvents.map((event: any) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventDateBadge}>
                  <SteppeText style={styles.eventDateText}>
                    {format(new Date(event.eventDate), "MMM d")}
                  </SteppeText>
                </View>
                <View style={styles.eventInfo}>
                  <SteppeText style={styles.eventTitle}>{event.title}</SteppeText>
                  <SteppeText style={styles.eventMeta}>
                    {format(new Date(event.eventDate), "HH:mm")} • {event.location || "Steppe Coffee"}
                  </SteppeText>
                  <SteppeText style={styles.eventMeta}>
                    {t('events.tickets', { count: event.ticketsNumber })} • {event.price > 0 ? t('events.price', { price: event.price }) : t('events.free')}
                  </SteppeText>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: {
    color: "#333",
    fontSize: 20,
    fontWeight: "600",
  },
  date: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  clock: {
    color: "#333",
    fontSize: 28,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  logoutBtn: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    color: Colors.yellow,
    fontSize: 36,
    fontWeight: "700",
  },
  statLabel: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#333",
    fontSize: 18,
    marginBottom: 12,
  },
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  tableBox: {
    width: "22%",
    minWidth: 70,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableNum: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  tableStatus: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingTable: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  bookingTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  timeText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
  bookingDetails: {
    gap: 4,
  },
  guestName: {
    color: "#333",
    fontSize: 16,
  },
  guestInfo: {
    color: "#666",
    fontSize: 14,
  },
  notes: {
    color: "#FF9800",
    fontSize: 14,
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventDateBadge: {
    backgroundColor: Colors.yellow,
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  eventDateText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  eventMeta: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
});