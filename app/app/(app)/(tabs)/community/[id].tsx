import { View, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { 
  GET_COMMUNITY_QUERY, 
  GET_COMMUNITY_EVENTS_QUERY,
  JOIN_COMMUNITY_MUTATION,
  LEAVE_COMMUNITY_MUTATION,
  GET_COMMUNITIES_QUERY
} from "@/src/slices/community/community.gql";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/context/AuthContext";

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loyalty } = useSession();
  
  const { data, loading, refetch } = useQuery(GET_COMMUNITY_QUERY, {
    variables: { id },
  });

  const { data: eventsData, refetch: refetchEvents } = useQuery(GET_COMMUNITY_EVENTS_QUERY, {
    variables: { communityId: id },
  });

  const [joinCommunity] = useMutation(JOIN_COMMUNITY_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_QUERY, variables: { id } }, { query: GET_COMMUNITIES_QUERY }],
  });

  const [leaveCommunity] = useMutation(LEAVE_COMMUNITY_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_QUERY, variables: { id } }, { query: GET_COMMUNITIES_QUERY }],
  });

  const community = data?.community;
  const events = eventsData?.communityEvents ?? [];

  const isMember = community?.members?.length > 0;
  const isAdmin = community?.members?.some((m: any) => m.role === "admin");

  if (loading) {
    return (
      <View style={styles.loading}>
        <SteppeText>Loading...</SteppeText>
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.loading}>
        <SteppeText>Community not found</SteppeText>
      </View>
    );
  }

  const handleJoin = async () => {
    try {
      await joinCommunity({ variables: { communityId: id } });
    } catch (error) {
      console.error("Failed to join:", error);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveCommunity({ variables: { communityId: id } });
    } catch (error) {
      console.error("Failed to leave:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity 
            onPress={() => router.push(`/(app)/(tabs)/community/create-event?communityId=${id}`)}
          >
            <AntDesign name="plus" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {community.imageUrl ? (
          <Image source={{ uri: community.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <AntDesign name="team" size={64} color={Colors.green} />
          </View>
        )}

        <View style={styles.content}>
          <SteppeTitle style={{ fontSize: 28 }}>{community.name}</SteppeTitle>
          
          {community.description && (
            <SteppeText style={styles.description}>
              {community.description}
            </SteppeText>
          )}

          <View style={styles.stats}>
            <View style={styles.stat}>
              <AntDesign name="user" size={20} color={Colors.green} />
              <SteppeText style={styles.statText}>
                {community.members?.length ?? 0} members
              </SteppeText>
            </View>
          </View>

          {isMember ? (
            <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
              <SteppeText style={styles.leaveButtonText}>Leave Community</SteppeText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
              <SteppeText style={styles.joinButtonText}>Join Community</SteppeText>
            </TouchableOpacity>
          )}

          {/* Events Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SteppeTitle style={{ fontSize: 20 }}>Events</SteppeTitle>
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => router.push(`/(app)/(tabs)/community/create-event?communityId=${id}`)}
                >
                  <AntDesign name="pluscircleo" size={24} color={Colors.green} />
                </TouchableOpacity>
              )}
            </View>
            
            {events.length === 0 ? (
              <View style={styles.emptyEvents}>
                <AntDesign name="calendar" size={32} color="#CCC" />
                <SteppeText style={styles.emptyText}>No events yet</SteppeText>
              </View>
            ) : (
              events.map((event: any) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push(`/(app)/(tabs)/community/event/${event.id}`)}
                >
                  <View style={styles.eventDate}>
                    <SteppeText style={styles.eventDateDay}>
                      {format(new Date(event.eventDate), "d")}
                    </SteppeText>
                    <SteppeText style={styles.eventDateMonth}>
                      {format(new Date(event.eventDate), "MMM")}
                    </SteppeText>
                  </View>
                  <View style={styles.eventInfo}>
                    <SteppeText style={styles.eventTitle}>{event.title}</SteppeText>
                    <SteppeText style={styles.eventMeta}>
                      {format(new Date(event.eventDate), "HH:mm")} · {event.location ?? "TBD"}
                    </SteppeText>
                  </View>
                  <AntDesign name="right" size={16} color="#999" />
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Members Section */}
          <View style={styles.section}>
            <SteppeTitle style={{ fontSize: 20 }}>Members</SteppeTitle>
            {community.members?.map((member: any) => (
              <View key={member.id} style={styles.memberRow}>
                <AntDesign name="user" size={20} color="#666" />
                <SteppeText style={styles.memberName}>
                  {member.user?.name ?? "Unknown"}
                </SteppeText>
                {member.role === "admin" && (
                  <View style={styles.adminBadge}>
                    <SteppeText style={styles.adminText}>Admin</SteppeText>
                  </View>
                )}
              </View>
            ))}
          </View>
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
  },
  header: {
    padding: 16,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
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
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  stats: {
    flexDirection: "row",
    marginTop: 16,
    gap: 24,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 16,
  },
  joinButton: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  joinButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  leaveButton: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  leaveButtonText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emptyEvents: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFF",
    borderRadius: 12,
  },
  emptyText: {
    color: "#999",
    marginTop: 8,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  eventDate: {
    backgroundColor: Colors.yellow,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 50,
  },
  eventDateDay: {
    fontSize: 20,
    fontWeight: "600",
  },
  eventDateMonth: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 8,
    gap: 12,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
  },
  adminBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  adminText: {
    color: "#FFF",
    fontSize: 12,
  },
});