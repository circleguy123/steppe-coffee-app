import { View, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { gql } from "@apollo/client";

const GET_COMMUNITY_EVENT_QUERY = gql`
  query CommunityEvent($id: String!) {
    communityEvent(id: $id) {
      id
      communityId
      title
      description
      imageUrl
      eventDate
      eventLength
      location
      maxAttendees
      price
      community {
        id
        name
      }
    }
  }
`;

export default function CommunityEventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, loading } = useQuery(GET_COMMUNITY_EVENT_QUERY, {
    variables: { id },
  });

  const event = data?.communityEvent;

  if (loading) {
    return (
      <View style={styles.loading}>
        <SteppeText>Loading...</SteppeText>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loading}>
        <SteppeText>Event not found</SteppeText>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <AntDesign name="calendar" size={64} color={Colors.green} />
          </View>
        )}

        <View style={styles.content}>
          <SteppeTitle style={{ fontSize: 28 }}>{event.title}</SteppeTitle>

          {event.community && (
            <TouchableOpacity 
              style={styles.communityBadge}
              onPress={() => router.push(`/(app)/(tabs)/community/${event.communityId}`)}
            >
              <AntDesign name="team" size={16} color={Colors.green} />
              <SteppeText style={styles.communityName}>{event.community.name}</SteppeText>
            </TouchableOpacity>
          )}

          <View style={styles.meta}>
            <View style={styles.metaRow}>
              <AntDesign name="calendar" size={20} color={Colors.green} />
              <SteppeText style={styles.metaText}>
                {format(new Date(event.eventDate), "EEEE, d MMMM yyyy")}
              </SteppeText>
            </View>
            <View style={styles.metaRow}>
              <AntDesign name="clockcircleo" size={20} color={Colors.green} />
              <SteppeText style={styles.metaText}>
                {format(new Date(event.eventDate), "HH:mm")} · {event.eventLength}
              </SteppeText>
            </View>
            {event.location && (
              <View style={styles.metaRow}>
                <AntDesign name="enviromento" size={20} color={Colors.green} />
                <SteppeText style={styles.metaText}>{event.location}</SteppeText>
              </View>
            )}
            {event.maxAttendees && (
              <View style={styles.metaRow}>
                <AntDesign name="team" size={20} color={Colors.green} />
                <SteppeText style={styles.metaText}>
                  Max {event.maxAttendees} attendees
                </SteppeText>
              </View>
            )}
          </View>

          {event.price > 0 && (
            <View style={styles.priceTag}>
              <SteppeText style={styles.priceText}>
                {event.price.toLocaleString()} ₸
              </SteppeText>
            </View>
          )}

          {event.description && (
            <SteppeText style={styles.description}>{event.description}</SteppeText>
          )}

          <TouchableOpacity style={styles.rsvpButton}>
            <SteppeText style={styles.rsvpButtonText}>RSVP to Event</SteppeText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.yellow,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  image: {
    width: "100%",
    height: 200,
  },
  placeholder: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  communityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  communityName: {
    color: Colors.green,
    fontSize: 16,
  },
  meta: {
    marginTop: 20,
    gap: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaText: {
    fontSize: 16,
  },
  priceTag: {
    backgroundColor: Colors.green,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  priceText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    lineHeight: 24,
  },
  rsvpButton: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  rsvpButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});