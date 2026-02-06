import { View, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { gql } from "@apollo/client";
import { useTranslation } from "react-i18next";

const GET_EVENT_QUERY = gql`
  query Event($id: String!) {
    event(id: $id) {
      id
      title
      description
      eventDate
      eventLength
      ticketsNumber
      photoUrl
      price
      location
      eventUrl
      isArchived
      hasRegistered
      ticketsLeft
    }
  }
`;

const RSVP_MUTATION = gql`
  mutation RsvpToEvent($eventId: String!) {
    rsvpToEvent(createEventRsvpInput: { eventId: $eventId }) {
      id
      hasRegistered
      ticketsLeft
    }
  }
`;

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const { data, loading, refetch } = useQuery(GET_EVENT_QUERY, {
    variables: { id },
  });

  const [rsvp, { loading: rsvpLoading }] = useMutation(RSVP_MUTATION, {
    onCompleted: () => refetch(),
  });

  const event = data?.event;

  if (loading) {
    return (
      <View style={styles.loading}>
        <SteppeText>{t('common.loading')}</SteppeText>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.loading}>
        <SteppeText>{t('events.notFound')}</SteppeText>
      </View>
    );
  }

  const handleRsvp = async () => {
    try {
      await rsvp({ variables: { eventId: id } });
    } catch (error) {
      console.error("Failed to RSVP:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {event.photoUrl ? (
          <Image source={{ uri: event.photoUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <AntDesign name="calendar" size={64} color={Colors.green} />
          </View>
        )}

        <View style={styles.content}>
          <SteppeTitle style={{ fontSize: 28 }}>{event.title}</SteppeTitle>

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
            <View style={styles.metaRow}>
              <AntDesign name="team" size={20} color={Colors.green} />
              <SteppeText style={styles.metaText}>
                {t('events.spotsLeft', { count: event.ticketsLeft ?? event.ticketsNumber })}
              </SteppeText>
            </View>
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

          {event.hasRegistered ? (
            <View style={styles.registeredBadge}>
              <AntDesign name="checkcircle" size={24} color={Colors.green} />
              <SteppeText style={styles.registeredText}>{t('events.registered')}</SteppeText>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.rsvpButton}
              onPress={handleRsvp}
              disabled={rsvpLoading || event.ticketsLeft === 0}
            >
              <SteppeText style={styles.rsvpButtonText}>
                {rsvpLoading
                  ? t('events.registering')
                  : event.ticketsLeft === 0
                  ? t('events.soldOut')
                  : t('events.registerNow')}
              </SteppeText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.yellow },
  header: { padding: 16, paddingTop: 60 },
  image: { width: "100%", height: 250 },
  placeholder: { backgroundColor: "#F5F5F5", justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
  meta: { marginTop: 16, gap: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  metaText: { fontSize: 16 },
  priceTag: { backgroundColor: Colors.green, alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 16 },
  priceText: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  description: { fontSize: 16, color: "#666", marginTop: 16, lineHeight: 24 },
  rsvpButton: { backgroundColor: Colors.green, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  rsvpButtonText: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  registeredBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#E8F5E9", padding: 16, borderRadius: 12, marginTop: 24 },
  registeredText: { fontSize: 18, fontWeight: "600", color: Colors.green },
});
