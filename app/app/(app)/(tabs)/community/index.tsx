import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useQuery } from "@apollo/client";
import { useRef } from "react";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SaigakHeader } from "@/src/components/SaigakHeader";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { CommunityList } from "@/src/slices/community/components/CommunityList";
import { GET_COMMUNITIES_QUERY } from "@/src/slices/community/community.gql";
import { Colors } from "@/constants/Colors";

export default function CommunitiesScreen() {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { data, loading, refetch } = useQuery(GET_COMMUNITIES_QUERY);

  return (
    <View style={{ flex: 1 }}>
      <SaigakHeader animHeaderValue={scrollOffsetY}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AntDesign name="team" color={Colors.green} size={20} />
          <SteppeText style={{ fontSize: 16 }}>Communities</SteppeText>
        </View>
      </SaigakHeader>
      
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <SteppeTitle style={{ fontSize: 32 }}>Communities</SteppeTitle>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/(app)/(tabs)/community/create")}
          >
            <AntDesign name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <CommunityList
          data={data?.communities ?? []}
          isLoading={loading}
          onRefresh={refetch}
        />
      </View>
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
});