import { View, TouchableOpacity, StyleSheet, Animated, Modal, TextInput, Alert } from "react-native";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SaigakHeader } from "@/src/components/SaigakHeader";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { CommunityList } from "@/src/slices/community/components/CommunityList";
import { 
  GET_COMMUNITIES_QUERY,
  GET_COMMUNITY_BY_INVITE_CODE_QUERY,
  JOIN_BY_INVITE_CODE_MUTATION,
} from "@/src/slices/community/community.gql";
import { Colors } from "@/constants/Colors";

export default function CommunitiesScreen() {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { t } = useTranslation();
  const { data, loading, refetch } = useQuery(GET_COMMUNITIES_QUERY);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

  const [lookupCommunity] = useLazyQuery(GET_COMMUNITY_BY_INVITE_CODE_QUERY);
  const [joinByCode] = useMutation(JOIN_BY_INVITE_CODE_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITIES_QUERY }],
  });

  const handleJoinByCode = async () => {
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      Alert.alert(t('common.error'), t('communities.enterCode'));
      return;
    }

    setJoining(true);
    try {
      // First look up the community
      const { data: lookupData } = await lookupCommunity({ 
        variables: { inviteCode: code } 
      });
      
      const community = lookupData?.communityByInviteCode;
      if (!community) {
        Alert.alert(t('common.error'), t('communities.invalidCode'));
        setJoining(false);
        return;
      }

      // Join it
      const result = await joinByCode({ variables: { inviteCode: code } });
      const joinedName = result.data?.joinByInviteCode?.community?.name || community.name;
      
      setShowJoinModal(false);
      setInviteCode("");
      
      Alert.alert(
        t('communities.joinCommunity'),
        t('communities.joinedSuccess', { name: joinedName }),
        [{ text: t('common.ok'), onPress: () => router.push(`/(app)/(tabs)/community/${community.id}`) }]
      );
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SaigakHeader animHeaderValue={scrollOffsetY}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AntDesign name="team" color={Colors.green} size={20} />
          <SteppeText style={{ fontSize: 16 }}>{t('communities.title')}</SteppeText>
        </View>
      </SaigakHeader>
      
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <SteppeTitle style={{ fontSize: 32 }}>{t('communities.title')}</SteppeTitle>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={styles.joinCodeButton}
              onPress={() => setShowJoinModal(true)}
            >
              <AntDesign name="key" size={20} color={Colors.green} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push("/(app)/(tabs)/community/create")}
            >
              <AntDesign name="plus" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <CommunityList
          data={data?.communities ?? []}
          isLoading={loading}
          onRefresh={refetch}
        />
      </View>

      {/* Join by Code Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <SteppeTitle style={{ fontSize: 22 }}>{t('communities.joinByCode')}</SteppeTitle>
              <TouchableOpacity onPress={() => setShowJoinModal(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <SteppeText style={styles.modalDescription}>
              {t('communities.joinByCodeDescription')}
            </SteppeText>

            <TextInput
              style={styles.codeInput}
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder={t('communities.enterCode')}
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
            />

            <TouchableOpacity 
              style={[styles.joinSubmitButton, joining && { opacity: 0.6 }]}
              onPress={handleJoinByCode}
              disabled={joining}
            >
              <SteppeText style={styles.joinSubmitText}>
                {joining ? t('communities.joining') : t('communities.joinCommunity')}
              </SteppeText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 0,
  },
  createButton: {
    backgroundColor: Colors.green,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  joinCodeButton: {
    backgroundColor: "#FFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.green,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 6,
    fontWeight: "700",
    marginBottom: 20,
  },
  joinSubmitButton: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  joinSubmitText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
