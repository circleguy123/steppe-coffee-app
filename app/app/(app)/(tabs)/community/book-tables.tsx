import { View, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { CREATE_COMMUNITY_TABLE_BOOKING_MUTATION, GET_COMMUNITY_QUERY } from "@/src/slices/community/community.gql";

const GET_BOOKED_TABLES = gql`
  query BookedTables($date: String!, $timeSlot: String!) {
    bookedTables(date: $date, timeSlot: $timeSlot)
  }
`;

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
];

const TABLES = ["1", "2", "3", "4", "5", "6", "7", "8"];

const LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  ru: "ru-RU",
  kk: "kk-KZ",
  zh: "zh-CN",
};

export default function CommunityBookingScreen() {
  const router = useRouter();
  const { communityId, eventId } = useLocalSearchParams<{ communityId: string; eventId?: string }>();
  
  const { t, i18n } = useTranslation();
  const dateLocale = LOCALE_MAP[i18n.language] || "en-US";

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [partySize, setPartySize] = useState("4");
  const [notes, setNotes] = useState("");
  const [bookedTables, setBookedTables] = useState<string[]>([]);

  const { data: communityData } = useQuery(GET_COMMUNITY_QUERY, {
    variables: { id: communityId },
    skip: !communityId,
  });

  const [fetchBookedTables, { loading: loadingTables }] = useLazyQuery(GET_BOOKED_TABLES, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setBookedTables(data?.bookedTables || []);
      // Clear any selected tables that are now booked
      setSelectedTables(prev => prev.filter(t => !data?.bookedTables?.includes(t)));
    },
  });

  const [createBooking, { loading }] = useMutation(CREATE_COMMUNITY_TABLE_BOOKING_MUTATION);

  // Fetch booked tables when date or time changes
  useEffect(() => {
    if (selectedTime) {
      fetchBookedTables({
        variables: {
          date: selectedDate.toISOString(),
          timeSlot: selectedTime,
        },
      });
    }
  }, [selectedDate, selectedTime]);

  const toggleTable = (table: string) => {
    if (bookedTables.includes(table)) return; // Can't select booked tables
    
    setSelectedTables(prev => 
      prev.includes(table) 
        ? prev.filter(t => t !== table)
        : [...prev, table]
    );
  };

  const handleBook = async () => {
    if (!selectedTime || selectedTables.length === 0 || !communityId) return;

    try {
      await createBooking({
        variables: {
          communityId,
          eventId: eventId || null,
          tableNumbers: selectedTables,
          date: selectedDate.toISOString(),
          timeSlot: selectedTime,
          partySize: parseInt(partySize) || 4,
          notes: notes || null,
        },
      });
      
      Alert.alert(
        t("bookTables.confirmed"),
        t("bookTables.confirmedMessage", { tables: selectedTables.join(', '), time: selectedTime }),
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error("Booking failed:", error);
      Alert.alert(t("bookTables.failed"), error.message || t("bookTables.failedMessage"));
    }
  };

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const communityName = communityData?.community?.name || t("communities.title");
  const availableTables = TABLES.filter(t => !bookedTables.includes(t)).length;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <SteppeTitle style={{ fontSize: 28, marginBottom: 8 }}>
          {t("bookTables.title")}
        </SteppeTitle>
        <SteppeText style={styles.subtitle}>
          {t("bookTables.forCommunity", { name: communityName })}
        </SteppeText>

        {/* Date Selection */}
        <SteppeText style={styles.label}>{t("bookTables.selectDate")}</SteppeText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dateCard,
                selectedDate.toDateString() === date.toDateString() && styles.dateCardSelected,
              ]}
              onPress={() => {
                setSelectedDate(date);
                setSelectedTables([]); // Clear selections when date changes
              }}
            >
              <SteppeText style={[
                styles.dateDay,
                selectedDate.toDateString() === date.toDateString() && styles.dateTextSelected,
              ]}>
                {date.toLocaleDateString(dateLocale, { weekday: "short" })}
              </SteppeText>
              <SteppeText style={[
                styles.dateNum,
                selectedDate.toDateString() === date.toDateString() && styles.dateTextSelected,
              ]}>
                {date.getDate()}
              </SteppeText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Selection */}
        <SteppeText style={styles.label}>{t("bookTables.selectTime")}</SteppeText>
        <View style={styles.grid}>
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.timeCardSelected,
              ]}
              onPress={() => {
                setSelectedTime(time);
                setSelectedTables([]); // Clear selections when time changes
              }}
            >
              <SteppeText style={[
                styles.timeText,
                selectedTime === time && styles.timeTextSelected,
              ]}>
                {time}
              </SteppeText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Table Selection - Multi Select */}
        <View style={styles.labelRow}>
          <SteppeText style={styles.label}>
            {t("bookTables.selectTables", { count: selectedTables.length })}
          </SteppeText>
          {loadingTables && <ActivityIndicator size="small" color={Colors.green} />}
        </View>
        
        {selectedTime && (
          <SteppeText style={styles.availabilityText}>
            {t("bookTables.tablesAvailable", { available: availableTables, total: TABLES.length })}
          </SteppeText>
        )}

        <View style={styles.tableGrid}>
          {TABLES.map((table) => {
            const isSelected = selectedTables.includes(table);
            const isBooked = bookedTables.includes(table);
            
            return (
              <TouchableOpacity
                key={table}
                style={[
                  styles.tableCard,
                  isSelected && styles.tableCardSelected,
                  isBooked && styles.tableCardBooked,
                ]}
                onPress={() => toggleTable(table)}
                disabled={isBooked}
              >
                <AntDesign 
                  name={isBooked ? "closecircle" : isSelected ? "checkcircle" : "inbox"} 
                  size={24} 
                  color={isBooked ? "#FFF" : isSelected ? "#FFF" : "#666"} 
                />
                <SteppeText style={[
                  styles.tableText,
                  isSelected && styles.tableTextSelected,
                  isBooked && styles.tableTextBooked,
                ]}>
                  {t("bookTables.table", { number: table })}
                </SteppeText>
                {isBooked && (
                  <SteppeText style={styles.bookedLabel}>{t("bookTables.booked")}</SteppeText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Party Size */}
        <SteppeText style={styles.label}>{t("bookTables.attendees")}</SteppeText>
        <TextInput
          style={styles.input}
          value={partySize}
          onChangeText={setPartySize}
          keyboardType="number-pad"
          placeholder="4"
        />

        {/* Notes */}
        <SteppeText style={styles.label}>{t("bookTables.specialRequests")}</SteppeText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder={t("bookTables.specialRequestsPlaceholder")}
          multiline
          numberOfLines={3}
        />

        {/* Summary */}
        {selectedTables.length > 0 && selectedTime && (
          <View style={styles.summary}>
            <SteppeText style={styles.summaryTitle}>{t("bookTables.summary")}</SteppeText>
            <SteppeText style={styles.summaryText}>
              {t("bookTables.summaryTables", { count: selectedTables.length, tables: selectedTables.sort().join(', ') })}
            </SteppeText>
            <SteppeText style={styles.summaryText}>
              {selectedDate.toLocaleDateString(dateLocale, { weekday: "long", month: "long", day: "numeric" })}
            </SteppeText>
            <SteppeText style={styles.summaryText}>{selectedTime}</SteppeText>
            <SteppeText style={styles.summaryText}>{t("bookTables.summaryPeople", { count: partySize })}</SteppeText>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.button, (!selectedTime || selectedTables.length === 0) && styles.buttonDisabled]}
          onPress={handleBook}
          disabled={!selectedTime || selectedTables.length === 0 || loading}
        >
          <SteppeText style={styles.buttonText}>
            {loading ? t("bookTables.booking") : t("bookTables.bookButton", { count: selectedTables.length })}
          </SteppeText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dateCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    minWidth: 70,
  },
  dateCardSelected: {
    backgroundColor: Colors.green,
  },
  dateDay: {
    fontSize: 14,
    color: "#666",
  },
  dateNum: {
    fontSize: 20,
    fontWeight: "600",
  },
  dateTextSelected: {
    color: "#FFF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeCard: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  timeCardSelected: {
    backgroundColor: Colors.green,
  },
  timeText: {
    fontSize: 14,
  },
  timeTextSelected: {
    color: "#FFF",
  },
  tableGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tableCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "23%",
  },
  tableCardSelected: {
    backgroundColor: Colors.green,
  },
  tableCardBooked: {
    backgroundColor: "#f44336",
  },
  tableText: {
    fontSize: 12,
    marginTop: 4,
  },
  tableTextSelected: {
    color: "#FFF",
  },
  tableTextBooked: {
    color: "#FFF",
  },
  bookedLabel: {
    fontSize: 10,
    color: "#FFF",
    marginTop: 2,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  summary: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
