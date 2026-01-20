import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import {
  LoyaltyCard,
  LoyaltyTiers,
} from "@/src/slices/loyalty/components/LoyaltyCard";
import { RewardCard } from "@/src/slices/loyalty/components/RewardCard";
import { router } from "expo-router";
import { Animated, ScrollView, View } from "react-native";
import { LOYALTY_QUERY, PROFILE_QUERY } from "@/src/slices/loyalty/loyalty.gql";
import { NetworkStatus, useQuery } from "@apollo/client";
import { ExternalMenuPreset, LoyaltyUserQuery } from "@/__generated__/graphql";
import { RefreshControl } from "react-native-gesture-handler";
import { SaigakHeader } from "@/src/components/SaigakHeader";
import { useMemo, useRef } from "react";
import { REWARD_MENU_QUERY } from "@/src/slices/menu/menu.gql";
import SteppeLoading from "@/src/components/SteppeLoading";
import { useRewardsContext } from "@/src/slices/loyalty/context/rewards.context";
import { useSession } from "@/context/AuthContext";

export default function Index() {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { setRewards } = useRewardsContext();
  const { session } = useSession();

  const profileQuery = useQuery(PROFILE_QUERY, {
    onError: (error) => {
      console.log(error);
    },
    skip: !session,
  });
  const { refetch: refetchLoyalty, ...loyaltyQuery } =
    useQuery<LoyaltyUserQuery>(LOYALTY_QUERY, {
      fetchPolicy: "network-only",
      skip: !session,
    });

  const hasMembership = useMemo(() => {
    const category = loyaltyQuery.data?.loyaltyUser?.categories.find(
      ({ id }) => id === "8cd10d1e-abba-4353-a04d-9f0529e7ad37"
    );

    return !!category?.id;
  }, [loyaltyQuery.data?.loyaltyUser, loyaltyQuery.networkStatus]);

  const rewardQuery = useQuery<{ rewardMenu: ExternalMenuPreset }>(
    REWARD_MENU_QUERY,
    {
      onCompleted: ({ rewardMenu }) => {
        setRewards(rewardMenu);
      },
    }
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.light.main,
      }}
    >
      <SaigakHeader animHeaderValue={scrollOffsetY} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={[NetworkStatus.refetch, NetworkStatus.loading].includes(
              loyaltyQuery.networkStatus
            )}
            onRefresh={() => {
              refetchLoyalty();
            }}
          />
        }
        contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
      >
        <LoyaltyCard
          tier={hasMembership ? LoyaltyTiers.paid : LoyaltyTiers.free}
          cardNumber={loyaltyQuery.data?.loyaltyUser?.cards[0]?.number}
          name={profileQuery.data?.profile?.name ?? "Guest"}
          cashback={5}
          points={
            loyaltyQuery.data?.loyaltyUser?.walletBalances[0].balance ?? 0
          }
        />

        <View
          style={{
            padding: 16,
          }}
        >
          <SteppeText
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            CHOOSE YOUR REWARD
          </SteppeText>

          <SteppeText style={{}}>
            Look how much points you got there!
          </SteppeText>
        </View>

        {!rewardQuery.data && (
          <View
            style={{
              height: 200,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SteppeLoading />
          </View>
        )}

        <ScrollView
          directionalLockEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 16,
            paddingHorizontal: 16,
          }}
        >
          {rewardQuery.data?.rewardMenu.itemCategories.map((category) => (
            <RewardCard
              key={category.id}
              title={category.name}
              onPress={() => {
                router.navigate(`/(app)/reward?categoryId=${category.id}`);
              }}
              points={Number(category.description)}
              image={category.buttonImageUrl ?? undefined}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
