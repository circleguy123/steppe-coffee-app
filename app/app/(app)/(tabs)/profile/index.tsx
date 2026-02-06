import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  TextInput,
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const currentLang = languages.find(l => l.code === i18n.language) || languages[1];

  const [deleteAccountMutation, { loading: deleting }] = useMutation(
    DELETE_ACCOUNT_MUTATION
  );

  const selectLanguage = async (code: string) => {
    await setStoredLanguage(code);
    setLangModalVisible(false);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") return;

    deleteAccountMutation({
      onCompleted: () => {
        setDeleteModalVisible(false);
        setDeleteConfirmText("");
        signOut();
      },
      onError: (error) => {
        console.error(error);
        setDeleteModalVisible(false);
        setDeleteConfirmText("");
        Alert.alert(
          t('profile.deleteAccountError'),
          t('profile.deleteAccountContact'),
          [
            {
              text: t('common.call'),
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
        title: t('profile.paymentMethods'),
        onPress: () => router.push("/(app)/(tabs)/profile/payment"),
        icon: "creditcard",
      },
      {
        title: t('profile.orders'),
        onPress: () => router.push("/(app)/(tabs)/profile/orders"),
        icon: "shoppingcart",
      },
      {
        title: t('profile.membership'),
        onPress: () => router.push("/(app)/(tabs)/profile/membership"),
        icon: "staro",
      },
      {
        title: t('profile.feedback'),
        onPress: () => router.push("/(app)/(tabs)/profile/feedback"),
        icon: "message1",
      },
    ],
    [t]
  );

  return (
    <ProfileLayout>
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
      
      <MenuListItem 
        title={`${t('profile.language')}: ${currentLang.flag} ${currentLang.name}`}
        onPress={() => setLangModalVisible(true)}
        icon="earth"
      />

      <View style={{ height: 32 }} />

      {/* Sign Out - prominent button */}
      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <SteppeText style={styles.signOutText}>{t('auth.logout')}</SteppeText>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.staffLink}
        onPress={() => router.push("/(app)/barista")}
      >
        <SteppeText style={styles.staffText}>{t('profile.staffLogin')}</SteppeText>
      </TouchableOpacity>

      {/* Delete Account - small, subtle text at very bottom */}
      <TouchableOpacity 
        style={styles.deleteLink}
        onPress={() => setDeleteModalVisible(true)}
      >
        <SteppeText style={styles.deleteText}>{t('profile.deleteAccount')}</SteppeText>
      </TouchableOpacity>

      <View style={{ height: 50 }} />

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

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setDeleteModalVisible(false);
          setDeleteConfirmText("");
        }}
      >
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteModalHeader}>
              <SteppeTitle style={{ fontSize: 20 }}>{t('profile.deleteAccountTitle')}</SteppeTitle>
              <TouchableOpacity onPress={() => {
                setDeleteModalVisible(false);
                setDeleteConfirmText("");
              }}>
                <SteppeText style={{ fontSize: 24, color: "#999" }}>✕</SteppeText>
              </TouchableOpacity>
            </View>

            <View style={styles.warningBox}>
              <SteppeText style={styles.warningTitle}>⚠️ {t('profile.deleteAccountPermanent')}</SteppeText>
              <SteppeText style={styles.warningText}>
                {t('profile.deleteAccountWarning')}
              </SteppeText>
            </View>

            <SteppeText style={styles.deleteInstructions}>
              {t('profile.deleteAccountTypeConfirm')}
            </SteppeText>

            <TextInput
              style={styles.deleteInput}
              value={deleteConfirmText}
              onChangeText={setDeleteConfirmText}
              placeholder={t('profile.deleteAccountTypePlaceholder')}
              placeholderTextColor="#CCC"
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={[
                styles.deleteConfirmButton,
                deleteConfirmText !== "DELETE" && styles.deleteConfirmDisabled,
              ]}
              onPress={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || deleting}
            >
              <SteppeText style={styles.deleteConfirmText}>
                {deleting ? t('profile.deleteAccountDeleting') : t('profile.deleteAccountButton')}
              </SteppeText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteCancelButton}
              onPress={() => {
                setDeleteModalVisible(false);
                setDeleteConfirmText("");
              }}
            >
              <SteppeText style={styles.deleteCancelText}>{t('common.cancel')}</SteppeText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 16,
  },
  signOutButton: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.green,
  },
  signOutText: {
    color: Colors.green,
    fontSize: 17,
    fontWeight: "600",
  },
  staffLink: {
    paddingVertical: 20,
    alignItems: "center",
  },
  staffText: {
    color: "#999",
    fontSize: 14,
  },
  deleteLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  deleteText: {
    color: "#BBB",
    fontSize: 13,
    textDecorationLine: "underline",
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
  deleteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  deleteModal: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 48,
  },
  deleteModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E65100",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#BF360C",
    lineHeight: 20,
  },
  deleteInstructions: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  deleteInput: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 4,
    fontWeight: "700",
    marginBottom: 20,
  },
  deleteConfirmButton: {
    backgroundColor: "#f44336",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteConfirmDisabled: {
    backgroundColor: "#E0E0E0",
  },
  deleteConfirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteCancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteCancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});
