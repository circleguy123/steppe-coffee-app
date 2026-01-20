import {
  CreateMembershipMutation,
  ExternalMenuPreset,
  GetUserCardsQuery,
  LoyaltyUserQuery,
} from "@/__generated__/graphql";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/context/AuthContext";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import {
  CREATE_MEMBERSHIP_MUTATION,
  LOYALTY_QUERY,
} from "@/src/slices/loyalty/loyalty.gql";
import { MEMBERSHIP_MENU_QUERY } from "@/src/slices/menu/menu.gql";
import { useAddCard } from "@/src/slices/profile/hooks/useAddCard";
import { GET_USER_CARDS_QUERY } from "@/src/slices/profile/profile.gql";
import { formatNumber } from "@/src/utils/formatNumber";
import { useMutation, useQuery } from "@apollo/client";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";

export default function MembershipPaymentModal() {
  const [selectedMembershipId, setSelectedMembershipId] = useState<
    string | null
  >(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const { session, setLoyalty } = useSession();

  const menuQuery = useQuery<{ membershipMenu: ExternalMenuPreset }>(
    MEMBERSHIP_MENU_QUERY,
    {
      onError: (err) => console.log(err),
      onCompleted: (data) => {
        const membershipItem = data.membershipMenu.itemCategories[0].items[0];
        setSelectedMembershipId(membershipItem.itemId);
      },
    }
  );

  const [createMembershipMutation, createMembershipStatus] =
    useMutation<CreateMembershipMutation>(CREATE_MEMBERSHIP_MUTATION, {
      refetchQueries: [LOYALTY_QUERY],
      onCompleted: () => {
        Toast.show({
          text1: "Membership created",
          text2: "You have successfully subscribed to a membership plan.",
          type: "success",
        });
        router.dismissTo("/(app)/(tabs)");
      },
      onError: (error) => {
        Toast.show({
          text1: "Error",
          text2: error.message,
          type: "error",
        });
        console.error("Error creating membership:", error);
      },
    });

  const userCardsQuery = useQuery<GetUserCardsQuery>(GET_USER_CARDS_QUERY, {
    onCompleted: ({ getUserCards }) => {
      if (getUserCards.length > 0) {
        setCardId(getUserCards[0].id);
      }
    },
  });

  const { createAddCardOrderMutation } = useAddCard();
  const [open, setOpen] = useState(false);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: "#FFF",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: 16 }}>
        <SteppeTitle style={{ fontSize: 32 }}>Become a member</SteppeTitle>

        <SteppeText>
          Pick your membership tier and enjoy exclusive benefits and rewards.
        </SteppeText>
        <SteppeText>
          Your membership will be charged monthly, and you can cancel anytime.
        </SteppeText>

        <View style={{ gap: 8 }}>
          {menuQuery.data?.membershipMenu.itemCategories.map((category) =>
            category.items.map((item) => {
              const name = item.name;
              const itemId = item.itemId;
              const price = item.itemSizes[0].prices[0]?.price;
              return (
                <TouchableOpacity
                  key={itemId}
                  style={{
                    borderWidth: 1,
                    borderColor:
                      selectedMembershipId === itemId
                        ? Colors.green
                        : "#E0E0E0",
                    borderRadius: 4,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    gap: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={() => setSelectedMembershipId(itemId)}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor:
                        selectedMembershipId === itemId
                          ? Colors.green
                          : "#E0E0E0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {selectedMembershipId === itemId && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: Colors.green,
                        }}
                      />
                    )}
                  </View>

                  <SteppeText>
                    {item.name} -{" "}
                    {item.itemSizes[0].prices[0]?.price &&
                      `${formatNumber(item.itemSizes[0].prices[0]?.price)} ₸`}
                  </SteppeText>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      <View style={{ gap: 16 }}>
        {userCardsQuery.data &&
        userCardsQuery.data?.getUserCards.length === 0 ? (
          <SteppeLink
            title="+ Add a card"
            onPress={() => createAddCardOrderMutation()}
            containerStyle={{ paddingVertical: 15 }}
          />
        ) : (
          <DropDownPicker
            loading={userCardsQuery.loading}
            dropDownDirection="TOP"
            open={open}
            setOpen={setOpen}
            value={cardId}
            items={
              userCardsQuery.data?.getUserCards.map((card) => ({
                label: card.cardMask,
                value: card.id,
              })) ?? []
            }
            setValue={setCardId}
            placeholder="Select a card"
          />
        )}

        <SteppeButton
          title="Subscribe"
          disabled={selectedMembershipId === null || cardId === null}
          loading={createMembershipStatus.loading}
          onPress={() => {
            console.log("productId", selectedMembershipId);
            console.log("cardId", cardId);
            createMembershipMutation({
              variables: {
                productId: selectedMembershipId,
                cardId: cardId,
              },
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
