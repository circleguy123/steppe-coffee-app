import {
  GetCurrentMembershipQuery,
  LoyaltyUserQuery,
} from "@/__generated__/graphql";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/context/AuthContext";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import SteppeLoading from "@/src/components/SteppeLoading";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import {
  CANCEL_MEMBERSHIP_MUTATION,
  GET_CURRENT_MEMBERSHIP_QUERY,
  LOYALTY_QUERY,
} from "@/src/slices/loyalty/loyalty.gql";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import { useMutation, useQuery } from "@apollo/client";
import { format } from "date-fns";
import { router } from "expo-router";
import { useMemo } from "react";
import { Alert, View } from "react-native";
import Toast from "react-native-toast-message";

export default function MembershipSettings() {
  const { session } = useSession();

  const currentMemberhipQuery = useQuery<GetCurrentMembershipQuery>(
    GET_CURRENT_MEMBERSHIP_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  const [cancelMembership, cancelMembershipState] = useMutation(
    CANCEL_MEMBERSHIP_MUTATION,
    {
      fetchPolicy: "network-only",
      refetchQueries: [LOYALTY_QUERY, GET_CURRENT_MEMBERSHIP_QUERY],
      onCompleted: () => {
        Toast.show({
          text1: "Sorry to see you go",
          text2: "Your membership subscription has been cancelled",
          type: "info",
        });
      },
      onError: (error) => {
        Toast.show({
          text1: "Error",
          text2: error.message,
          type: "error",
        });
      },
    }
  );

  const loyaltyQuery = useQuery<LoyaltyUserQuery>(LOYALTY_QUERY, {
    fetchPolicy: "network-only",
    skip: !session,
  });

  const hasMembership = useMemo(() => {
    const category = loyaltyQuery.data?.loyaltyUser?.categories.find(
      ({ id }) => id === "8cd10d1e-abba-4353-a04d-9f0529e7ad37"
    );

    return !!category?.id;
  }, [loyaltyQuery.data?.loyaltyUser?.categories.length]);

  return (
    <ProfileLayout>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ gap: 8 }}>
          <SteppeTitle style={{ fontSize: 32 }}>Membership</SteppeTitle>

          {hasMembership &&
          loyaltyQuery.data?.getCurrentMembership?.id &&
          loyaltyQuery.data.getCurrentMembership.status === "active" ? (
            <View>
              <SteppeText>
                You are currently a member of the Steppe Coffee franchise.
              </SteppeText>
              <SteppeText>
                Next payment will be charged on{" "}
                {format(
                  loyaltyQuery.data?.getCurrentMembership?.expiresAt,
                  "MMMM dd "
                )}
              </SteppeText>
              <SteppeLink
                title="Cancel membership"
                textStyle={{ color: Colors.red }}
                onPress={() => {
                  Alert.alert(
                    "Do you really want to cancel your membership?",
                    "You will lose all your benefits and rewards.",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          cancelMembership({
                            variables: {
                              id: loyaltyQuery.data?.getCurrentMembership?.id,
                            },
                          });
                        },
                      },
                    ]
                  );
                }}
              />
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <SteppeText>
                Becoming a member of the Steppe Coffee franchise provides you
                with lots of benefits such as a bonus program, free drinks and
                much more!
              </SteppeText>
              <SteppeText>
                Ask our barista for more information about the membership
              </SteppeText>
              <SteppeLink
                title="Become a member"
                onPress={() => router.push("/(app)/membership-payment-modal")}
              />
            </View>
          )}
          {(currentMemberhipQuery.loading || cancelMembershipState.loading) && (
            <SteppeLoading />
          )}
        </View>
        <SteppeButton
          title="Back"
          onPress={() => {
            router.back();
          }}
        />
      </View>
    </ProfileLayout>
  );
}
