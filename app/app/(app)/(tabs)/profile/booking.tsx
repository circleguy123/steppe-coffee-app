import { View, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { CREATE_TABLE_BOOKING_MUTATION, GET_MY_BOOKINGS_QUERY } from "@/src/slices/community/community.gql";

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

export default function BookingScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [partySize, setPartySize] = useState("2");
  const [notes, setNotes] = useState("");

  const [createBooking, { loading }] = useMutation(CREATE_TABLE_BOOKING_MUTATION, {
    refetchQueries: [{ query: GET_MY_BOOKINGS_QUERY }],
  });

  const handleBook = async () => {
    if (!selectedTime || !selectedTable) return;

    try {
      await createBooking({
        variables: {
          tableNumber: selectedTable,
          date: selectedDate.toISOString(),
          timeSlot: selectedTime,
          partySize: parseInt(partySize) || 2,
          notes: notes || null,
        },
      });
      router.back();
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <SteppeTitle style={{ fontSize: 28, marginBottom: 24 }}>
          Book a Table
        </SteppeTitle>

        {/* Date Selection */}
        <SteppeText style={styles.label}>Select Date</SteppeText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
          {dates.map((date) => (
            <TouchableOpacity
              key={date.toISOString()}
              style={[
                styles.dateCard,
                selectedDate.toDateString() === date.toDateString() && styles.dateCardSelected,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <SteppeText style={[
                styles.dateDay,
                selectedDate.toDateString() === date.toDateString() && styles.dateTextSelected,
              ]}>
                {date.toLocaleDateString("en-US", { weekday: "short" })}
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
        <SteppeText style={styles.label}>Select Time</SteppeText>
        <View style={styles.grid}>
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeCard,
                selectedTime === time && styles.timeCardSelected,
              ]}
              onPress={() => setSelectedTime(time)}
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

        {/* Table Selection */}
        <SteppeText style={styles.label}>Select Table</SteppeText>
        <View style={styles.grid}>
          {TABLES.map((table) => (
            <TouchableOpacity
              key={table}
              style={[
                styles.tableCard,
                selectedTable === table && styles.tableCardSelected,
              ]}
              onPress={() => setSelectedTable(table)}
            >
              <AntDesign 
                name="inbox" 
                size={24} 
                color={selectedTable === table ? "#FFF" : "#666"} 
              />
              <SteppeText style={[
                styles.tableText,
                selectedTable === table && styles.tableTextSelected,
              ]}>
                Table {table}
              </SteppeText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Party Size */}
        <SteppeText style={styles.label}>Party Size</SteppeText>
        <TextInput
          style={styles.input}
          value={partySize}
          onChangeText={setPartySize}
          keyboardType="number-pad"
          placeholder="2"
        />

        {/* Notes */}
        <SteppeText style={styles.label}>Special Requests (Optional)</SteppeText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special requests..."
          multiline
          numberOfLines={3}
        />

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.button, (!selectedTime || !selectedTable) && styles.buttonDisabled]}
          onPress={handleBook}
          disabled={!selectedTime || !selectedTable || loading}
        >
          <SteppeText style={styles.buttonText}>
            {loading ? "Booking..." : "Confirm Booking"}
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 16,
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
  tableText: {
    fontSize: 12,
    marginTop: 4,
  },
  tableTextSelected: {
    color: "#FFF",
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