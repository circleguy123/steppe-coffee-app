import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from "react-native";

import { useSession } from "@/context/AuthContext";
import { router } from "expo-router";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { UrlImage } from "@/src/components/UrlImage";
import { MenuListData, MenuListItem } from "@/src/components/MenuListItem";
import { useMemo, useState } from "react";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import { useMutation } from "@apollo/client";
import { Colors } from "@/constants/Colors";
import { DELETE_ACCOUNT_MUTATION } from "@/src/slices/auth/auth.gql";
import { useTranslation } from "react-i18next";
import { languages, setStoredLanguage } from "@/src/i18n";

export default function TabTwoScreen() {
  const { signOut, loyalty } = useSession();
  const { t, i18n } = useTranslation();
  const [langModalVisible, setLangModalVisible] = useState(false);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[1];

  const [deleteAccountMutation, { loading }] = useMutation(
    DELETE_ACCOUNT_MUTATION
  );

  const selectLanguage = async (code: string) => {
    await setStoredLanguage(code);
    setLangModalVisible(false);
  };

  const profileMenu = useMemo<MenuListData[]>(
    () => [
      {
        title: t('profile.editProfile'),
        onPress: () => router.push("/(app)/(tabs)/profile/edit"),
        icon: "user",
      },
      {
        title: t('booking.myBookings'),
        onPress: () => router.push("/(app)/(tabs)/profile/my-bookings"),
        icon: "calendar",
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
    [t]
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
          
          {/* Language Selector */}
          <MenuListItem 
            title={`${t('profile.language')}: ${currentLang.flag} ${currentLang.name}`}
            onPress={() => setLangModalVisible(true)}
            icon="earth"
          />
        </View>

        <View>
          <MenuListItem title={t('auth.logout')} onPress={signOut} icon="logout" />
          <MenuListItem
            title={t('profile.deleteAccount')}
            onPress={() => {
              Alert.alert(
                "Do you really want to delete your account?",
                "Your data will be removed but you can always sign up again",
                [
                  {
                    text: t('common.cancel'),
                    style: "cancel",
                  },
                  {
                    text: t('common.confirm'),
                    onPress: () => {
                      deleteAccountMutation({
                        onCompleted: () => {
                          signOut();
                        },
                        onError: (error) => {
                          console.error(error);
                          Alert.alert(
                            "Could not delete account",
                            "Contact us at +7 701 522 2727 to remove your account",
                            [
                              {
                                text: "Call",
                                onPress: () => {
                                  Linking.openURL("tel:+77015222727");
                                },
                              },
                              {
                                text: t('common.cancel'),
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
          
          {/* Staff Login */}
          <TouchableOpacity 
            style={styles.staffLink}
            onPress={() => router.push("/(app)/barista")}
          >
            <SteppeText style={styles.staffText}>{t('profile.staffLogin')}</SteppeText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.modal}>
            <SteppeText style={styles.modalTitle}>{t('profile.language')}</SteppeText>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  i18n.language === lang.code && styles.langOptionActive
                ]}
                onPress={() => selectLanguage(lang.code)}
              >
                <SteppeText style={styles.langFlag}>{lang.flag}</SteppeText>
                <SteppeText style={[
                  styles.langOptionText,
                  i18n.language === lang.code && styles.langOptionTextActive
                ]}>
                  {lang.name}
                </SteppeText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  staffLink: {
    paddingVertical: 20,
    alignItems: "center",
  },
  staffText: {
    color: "#999",
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    gap: 12,
  },
  langOptionActive: {
    backgroundColor: Colors.yellow,
  },
  langFlag: {
    fontSize: 24,
  },
  langOptionText: {
    fontSize: 16,
    color: '#333',
  },
  langOptionTextActive: {
    fontWeight: '600',
  },
});