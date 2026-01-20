import { CreateUserOrderInput } from "@/__generated__/graphql";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/context/AuthContext";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { RewardList } from "@/src/slices/loyalty/components/RewardList";
import { useRewardsContext } from "@/src/slices/loyalty/context/rewards.context";
import { REDEEM_REWARD_MUTATION } from "@/src/slices/loyalty/loyalty.gql";
import { useMutation } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Index() {
  const { session } = useSession();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { rewards, selectedReward, selectReward, clearReward } =
    useRewardsContext();
  const rewardCategory = useMemo(() => {
    return rewards?.itemCategories.find(({ id }) => categoryId === id);
  }, [categoryId, rewards]);

  const [redeemRewardMutation, redeemMutationState] = useMutation(
    REDEEM_REWARD_MUTATION,
    {
      onCompleted: () => {
        Toast.show({
          text1: "Reward redeemed",
          text2: "Ask barista for your reward",
          type: "success",
        });
        router.back();
      },
    }
  );

  useEffect(() => {
    return () => clearReward();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <SteppeTitle
          style={{ fontSize: 32, paddingHorizontal: 16, paddingTop: 16 }}
        >
          Choose your {rewardCategory?.name}
        </SteppeTitle>

        <RewardList
          onSelectReward={selectReward}
          activeItem={selectedReward}
          category={rewardCategory}
        />
      </View>
      <View style={styles.cartFooter}>
        <View style={{ justifyContent: "center", flex: 1 / 2 }}>
          <SteppeText>Total</SteppeText>
          <SteppeText style={{ fontSize: 24 }}>
            {Number(rewardCategory?.description)} pts
          </SteppeText>
        </View>

        <SteppeButton
          onPress={() => {
            if (session) {
              redeemRewardMutation({
                variables: {
                  order: {
                    userOrderItem: [
                      {
                        productId: selectedReward?.itemId,
                        productSizeId: selectedReward?.itemSizeId,
                        amount: selectedReward?.amount,
                      },
                    ],
                  } as CreateUserOrderInput,
                },
              });
            } else {
              router.dismissTo("/(app)/register");
            }
          }}
          loading={redeemMutationState.loading}
          title="Redeem"
          buttonStyle={styles.buttonStyle}
          disabled={!selectedReward}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.main,
  },
  itemsContainer: {
    flex: 1,
    gap: 16,
  },
  cartFooter: {
    padding: 24,

    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 0,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowColor: "black",
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  buttonStyle: {
    flex: 1 / 2,
    borderRadius: 60,
    paddingHorizontal: 50,
  },
});
