import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";

import { useSession } from "@/context/AuthContext";
import { router } from "expo-router";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { UrlImage } from "@/src/components/UrlImage";
import { MenuListData, MenuListItem } from "@/src/components/MenuListItem";
import { useMemo } from "react";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import { useMutation } from "@apollo/client";
import { Colors } from "@/constants/Colors";
import { DELETE_ACCOUNT_MUTATION } from "@/src/slices/auth/auth.gql";

export default function TabTwoScreen() {
  const { signOut, loyalty } = useSession();

  const [deleteAccountMutation, { loading }] = useMutation(
    DELETE_ACCOUNT_MUTATION
  );

  const profileMenu = useMemo<MenuListData[]>(
    () => [
      {
        title: "Edit profile information",
        onPress: () => router.push("/(app)/(tabs)/profile/edit"),
        icon: "user",
      },
      {
        title: "Payment methods",
        onPress: () => router.push("/(app)/(tabs)/profile/payment"),
        icon: "creditcard",
      },
      {
        title: "Orders",
        onPress: () => router.push("/(app)/(tabs)/profile/orders"),
        icon: "shoppingcart",
      },
      {
        title: "Membership",
        onPress: () => router.push("/(app)/(tabs)/profile/membership"),
        icon: "staro",
      },
      {
        title: "Feedback",
        onPress: () => router.push("/(app)/(tabs)/profile/feedback"),
        icon: "message1",
      },
    ],
    []
  );

  return (
    <ProfileLayout>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <TouchableOpacity style={styles.titleContainer}>
            <UrlImage
              source={require("@/assets/images/avatar.png")}
              style={{
                width: 96,
                height: 96,
                borderRadius: 96,
              }}
            />
            <View>
              <SteppeTitle style={{ fontSize: 36 }}>
                {loyalty?.name +
                  (loyalty?.surname ? " " + loyalty?.surname : "")}
              </SteppeTitle>
            </View>
          </TouchableOpacity>

          {profileMenu.map((data, idx) => (
            <MenuListItem {...data} key={`${idx}-${data.title}`} />
          ))}
        </View>

        <View>
          <MenuListItem title="Sign out" onPress={signOut} icon="logout" />
          <MenuListItem
            title="Delete Account"
            onPress={() => {
              Alert.alert(
                "Do you really want to delete your account?",
                "Your data will be removed but you can always sign up again",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      deleteAccountMutation({
                        onCompleted: () => {
                          signOut();
                        },
                        onError: (error) => {
                          console.error(error);
                          Alert.alert(
                            "Could not delete account",
                            "Contact us at +7 701 522 2727 to remove your account",
                            [
                              {
                                text: "Call",
                                onPress: () => {
                                  Linking.openURL("tel:+77015222727");
                                },
                              },
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                            ]
                          );
                        },
                      });
                    },
                  },
                ]
              );
            }}
            icon="deleteuser"
            iconColor={Colors.red}
            textStyle={{ color: Colors.red }}
          />
        </View>
      </View>
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 16,
  },
});
