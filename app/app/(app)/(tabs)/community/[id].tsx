import { View, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, Share } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { 
  GET_COMMUNITY_QUERY, 
  GET_COMMUNITY_EVENTS_QUERY,
  GET_COMMUNITY_BOOKINGS_QUERY,
  JOIN_COMMUNITY_MUTATION,
  LEAVE_COMMUNITY_MUTATION,
  DELETE_BOOKING_MUTATION,
  GENERATE_INVITE_CODE_MUTATION,
  GET_COMMUNITIES_QUERY
} from "@/src/slices/community/community.gql";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  
  const { data, loading } = useQuery(GET_COMMUNITY_QUERY, {
    variables: { id },
  });

  const { data: eventsData } = useQuery(GET_COMMUNITY_EVENTS_QUERY, {
    variables: { communityId: id },
  });

  const { data: bookingsData, refetch: refetchBookings } = useQuery(GET_COMMUNITY_BOOKINGS_QUERY, {
    variables: { communityId: id },
    skip: !id,
  });

  const [joinCommunity] = useMutation(JOIN_COMMUNITY_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_QUERY, variables: { id } }, { query: GET_COMMUNITIES_QUERY }],
  });

  const [leaveCommunity] = useMutation(LEAVE_COMMUNITY_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_QUERY, variables: { id } }, { query: GET_COMMUNITIES_QUERY }],
  });

  const [deleteBooking] = useMutation(DELETE_BOOKING_MUTATION, {
    onCompleted: () => {
      refetchBookings();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const [generateInviteCode] = useMutation(GENERATE_INVITE_CODE_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITY_QUERY, variables: { id } }],
  });

  const community = data?.community;
  const events = eventsData?.communityEvents ?? [];
  const bookings = bookingsData?.communityBookings ?? [];

  const isMember = community?.members?.length > 0;
  const isAdmin = community?.members?.some((m: any) => m.role === "admin");

  if (loading) {
    return (
      <View style={styles.loading}>
        <SteppeText>{t('common.loading')}</SteppeText>
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.loading}>
        <SteppeText>{t('common.error')}</SteppeText>
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

  const handleBookTables = () => {
    router.push(`/(app)/(tabs)/community/book-tables?communityId=${id}`);
  };

  const handleInvite = async () => {
    try {
      let code = community.inviteCode;
      
      // Generate code if none exists (admin only)
      if (!code && isAdmin) {
        const result = await generateInviteCode({ variables: { communityId: id } });
        code = result.data?.generateInviteCode?.inviteCode;
      }

      if (!code) {
        Alert.alert(t('communities.noInviteCode'), t('communities.noInviteCodeMessage'));
        return;
      }

      const deepLink = `steppecoffee://community/join?code=${code}`;
      const message = `Join "${community.name}" on Steppe Coffee!\n\nInvite code: ${code}\n\nOr tap this link: ${deepLink}`;

      await Share.share({
        message,
        title: `Join ${community.name}`,
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert(t('common.error'), t('communities.shareError'));
      }
    }
  };

  const handleDeleteBooking = (bookingIds: string[], tableNumbers: string[]) => {
    Alert.alert(
      t('booking.deleteBooking'),
      t('booking.deleteBookingConfirm', { tables: tableNumbers.join(', ') }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                bookingIds.map(bookingId => 
                  deleteBooking({ variables: { bookingId } })
                )
              );
              Alert.alert(t('common.ok'), t('booking.bookingCancelled'));
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message);
            }
          },
        },
      ]
    );
  };

  // Group bookings by date, time slot, and user
  const groupedBookings = bookings.reduce((acc: any, booking: any) => {
    const key = `${booking.date}-${booking.timeSlot}-${booking.user?.id}`;
    if (!acc[key]) {
      acc[key] = {
        date: booking.date,
        timeSlot: booking.timeSlot,
        partySize: booking.partySize,
        tables: [],
        bookingIds: [],
        user: booking.user,
        status: booking.status,
      };
    }
    acc[key].tables.push(booking.tableNumber);
    acc[key].bookingIds.push(booking.id);
    return acc;
  }, {});

  const bookingsList = Object.values(groupedBookings);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 16 }}>
          {isMember && (
            <TouchableOpacity onPress={handleInvite}>
              <AntDesign name="adduser" size={24} color="#000" />
            </TouchableOpacity>
          )}
          {isAdmin && (
            <TouchableOpacity 
              onPress={() => router.push(`/(app)/(tabs)/community/create-event?communityId=${id}`)}
            >
              <AntDesign name="plus" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
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
                {t('communities.members', { count: community.members?.length ?? 0 })}
              </SteppeText>
            </View>
            {community.inviteCode && (
              <View style={styles.stat}>
                <AntDesign name="key" size={16} color={Colors.green} />
                <SteppeText style={styles.statText}>
                  {community.inviteCode}
                </SteppeText>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          {isMember ? (
            <View style={{ gap: 10, marginTop: 24 }}>
              <TouchableOpacity style={styles.bookButton} onPress={handleBookTables}>
                <AntDesign name="calendar" size={20} color="#FFF" />
                <SteppeText style={styles.bookButtonText}>{t('communities.bookTable')}</SteppeText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
                <AntDesign name="adduser" size={20} color={Colors.green} />
                <SteppeText style={styles.inviteButtonText}>{t('communities.inviteFriends')}</SteppeText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
              <SteppeText style={styles.joinButtonText}>{t('communities.joinCommunity')}</SteppeText>
            </TouchableOpacity>
          )}

          {/* Events Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <SteppeTitle style={{ fontSize: 20 }}>{t("events.title")}</SteppeTitle>
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
                <SteppeText style={styles.emptyText}>{t('events.noUpcoming')}</SteppeText>
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

          {/* Bookings Section */}
          {isMember && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <SteppeTitle style={{ fontSize: 20 }}>{t("booking.bookings")}</SteppeTitle>
                <TouchableOpacity onPress={() => refetchBookings()}>
                  <AntDesign name="reload1" size={20} color={Colors.green} />
                </TouchableOpacity>
              </View>
              
              {bookingsList.length === 0 ? (
                <View style={styles.emptyEvents}>
                  <AntDesign name="inbox" size={32} color="#CCC" />
                  <SteppeText style={styles.emptyText}>{t('booking.noBookings')}</SteppeText>
                </View>
              ) : (
                bookingsList.map((booking: any, index: number) => (
                  <View key={index} style={styles.bookingCard}>
                    <View style={styles.bookingLeft}>
                      <View style={styles.bookingDateBox}>
                        <SteppeText style={styles.bookingDateDay}>
                          {format(new Date(booking.date), "d")}
                        </SteppeText>
                        <SteppeText style={styles.bookingDateMonth}>
                          {format(new Date(booking.date), "MMM")}
                        </SteppeText>
                      </View>
                    </View>
                    <View style={styles.bookingInfo}>
                      <SteppeText style={styles.bookingTables}>
                        {t('booking.selectTables')} {booking.tables.join(', ')}
                      </SteppeText>
                      <SteppeText style={styles.bookingMeta}>
                        {booking.timeSlot} · {booking.partySize} {t('barista.guests', { count: booking.partySize })}
                      </SteppeText>
                      {booking.user && (
                        <SteppeText style={styles.bookingUser}>
                          {booking.user.name}
                        </SteppeText>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteBooking(booking.bookingIds, booking.tables)}
                    >
                      <AntDesign name="close" size={16} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Members Section */}
          <View style={styles.section}>
            <SteppeTitle style={{ fontSize: 20 }}>{t("communities.membersTitle")}</SteppeTitle>
            {community.members?.map((member: any) => (
              <View key={member.id} style={styles.memberRow}>
                <AntDesign name="user" size={20} color="#666" />
                <SteppeText style={styles.memberName}>
                  {member.user?.name ?? "Unknown"}
                </SteppeText>
                {member.role === "admin" && (
                  <View style={styles.adminBadge}>
                    <SteppeText style={styles.adminText}>{t('communities.admin')}</SteppeText>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Leave Button at Bottom */}
          {isMember && (
            <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
              <SteppeText style={styles.leaveButtonText}>{t('communities.leave')}</SteppeText>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
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
  bookButton: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  bookButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  inviteButton: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.green,
  },
  inviteButtonText: {
    color: Colors.green,
    fontSize: 18,
    fontWeight: "600",
  },
  leaveButton: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  leaveButtonText: {
    color: "#f44336",
    fontSize: 16,
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
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.green,
  },
  bookingLeft: {
    marginRight: 12,
  },
  bookingDateBox: {
    backgroundColor: "#E8F5E9",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 50,
  },
  bookingDateDay: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.green,
  },
  bookingDateMonth: {
    fontSize: 12,
    textTransform: "uppercase",
    color: Colors.green,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTables: {
    fontSize: 16,
    fontWeight: "600",
  },
  bookingMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  bookingUser: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
  },
});
