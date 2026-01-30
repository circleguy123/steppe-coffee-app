import { View, ScrollView, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { gql } from "@apollo/client";
import { GET_COMMUNITY_EVENTS_QUERY } from "@/src/slices/community/community.gql";

const CREATE_COMMUNITY_EVENT_MUTATION = gql`
  mutation CreateCommunityEvent(
    $communityId: String
    $title: String!
    $description: String
    $eventDate: String!
    $eventLength: String
    $location: String
    $maxAttendees: Int
    $price: Int
  ) {
    createCommunityEvent(
      communityId: $communityId
      title: $title
      description: $description
      eventDate: $eventDate
      eventLength: $eventLength
      location: $location
      maxAttendees: $maxAttendees
      price: $price
    ) {
      id
      title
    }
  }
`;

export default function CreateCommunityEventScreen() {
  const router = useRouter();
  const { communityId } = useLocalSearchParams<{ communityId: string }>();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Steppe Coffee Zheltoqsan");
  const [eventLength, setEventLength] = useState("2 hours");
  const [maxAttendees, setMaxAttendees] = useState("20");
  const [price, setPrice] = useState("0");
  
  // Date selection
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("18:00");

  const [createEvent, { loading }] = useMutation(CREATE_COMMUNITY_EVENT_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_EVENTS_QUERY, variables: { communityId } }],
  });

  const handleCreate = async () => {
    if (!title.trim()) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const eventDate = new Date(selectedDate);
    eventDate.setHours(hours, minutes, 0, 0);

    try {
      await createEvent({
        variables: {
          communityId,
          title: title.trim(),
          description: description.trim() || null,
          eventDate: eventDate.toISOString(),
          eventLength,
          location,
          maxAttendees: parseInt(maxAttendees) || 20,
          price: parseInt(price) || 0,
        },
      });
      router.back();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const times = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <SteppeTitle style={{ fontSize: 28, marginBottom: 24 }}>
          Create Event
        </SteppeTitle>

        <View style={styles.field}>
          <SteppeText style={styles.label}>Event Title *</SteppeText>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Coffee Meetup"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <SteppeText style={styles.label}>Description</SteppeText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this event about?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.field}>
          <SteppeText style={styles.label}>Location</SteppeText>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Steppe Coffee Zheltoqsan"
            placeholderTextColor="#999"
          />
        </View>

        {/* Date Selection */}
        <SteppeText style={styles.label}>Select Date *</SteppeText>
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
        <SteppeText style={styles.label}>Select Time *</SteppeText>
        <View style={styles.timeGrid}>
          {times.map((time) => (
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

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <SteppeText style={styles.label}>Duration</SteppeText>
            <TextInput
              style={styles.input}
              value={eventLength}
              onChangeText={setEventLength}
              placeholder="2 hours"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <SteppeText style={styles.label}>Max Attendees</SteppeText>
            <TextInput
              style={styles.input}
              value={maxAttendees}
              onChangeText={setMaxAttendees}
              keyboardType="number-pad"
              placeholder="20"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.field}>
          <SteppeText style={styles.label}>Price (₸)</SteppeText>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
            placeholder="0 (Free)"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !title.trim() && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={!title.trim() || loading}
        >
          <SteppeText style={styles.buttonText}>
            {loading ? "Creating..." : "Create Event"}
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
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  dateRow: {
    marginBottom: 16,
  },
  dateCard: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    minWidth: 60,
  },
  dateCardSelected: {
    backgroundColor: Colors.green,
  },
  dateDay: {
    fontSize: 12,
    color: "#666",
  },
  dateNum: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateTextSelected: {
    color: "#FFF",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  timeCard: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 14,
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
  button: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
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