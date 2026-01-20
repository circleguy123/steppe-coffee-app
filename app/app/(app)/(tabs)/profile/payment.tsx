import { GetUserCardsQuery } from "@/__generated__/graphql";
import { Colors } from "@/constants/Colors";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import SteppeLoading from "@/src/components/SteppeLoading";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import { useAddCard } from "@/src/slices/profile/hooks/useAddCard";
import { GET_USER_CARDS_QUERY } from "@/src/slices/profile/profile.gql";
import { useQuery } from "@apollo/client";
import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";

export default function PaymentMethods() {
  const pathname = usePathname();

  const { createAddCardOrderMutation, createAddCardOrderState } = useAddCard();

  const userCardsQuery = useQuery<GetUserCardsQuery>(GET_USER_CARDS_QUERY, {});

  useEffect(() => {
    userCardsQuery.refetch();
  }, [pathname]);

  return (
    <ProfileLayout>
      <SteppeTitle style={{ fontSize: 32 }}>Payment methods</SteppeTitle>

      <ScrollView
        style={{
          marginHorizontal: -16,
          paddingHorizontal: 16,
        }}
        contentContainerStyle={{
          gap: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={userCardsQuery.loading}
            onRefresh={userCardsQuery.refetch}
          />
        }
      >
        {userCardsQuery.data?.getUserCards.map((card, idx) => (
          <View
            key={card.id}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomColor: "#f0f0f0",
              borderBottomWidth:
                idx + 1 !== userCardsQuery.data?.getUserCards.length ? 1 : 0,
              paddingTop: 8,
              paddingBottom: 16,
            }}
          >
            <View style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <SteppeText variant="bold">{card.cardMask}</SteppeText>
              <SteppeText style={{ color: "#999999" }}>
                {card.cardType} | {card.issuer}
              </SteppeText>
            </View>

            <TouchableOpacity>
              <IconSymbol name="trash" color={Colors.red} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View>
        <SteppeLink
          title="+ Add new card"
          onPress={() => {
            createAddCardOrderMutation();
          }}
        />
        {createAddCardOrderState.loading && <SteppeLoading />}
      </View>

      <SteppeButton title="Back" onPress={() => router.back()} />
    </ProfileLayout>
  );
}
