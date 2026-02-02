import { REGISTRATION_MUTATION } from "@/src/slices/auth/auth.gql";
import RegistrationForm from "@/src/slices/auth/components/RegistrationForm";
import { LanguageSelector } from "@/src/components/LanguageSelector";
import { useMutation } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { KeyboardAvoidingView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { Colors } from "@/constants/Colors";

type RegistrationRouteParams = { phone?: string };

export default function Index() {
  const params = useLocalSearchParams<RegistrationRouteParams>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const phone = useMemo(() => {
    const p = params.phone || "";
    if (p.startsWith(" ")) return "+" + p.substring(1);
    if (p.startsWith("+")) return p;
    return "+" + p;
  }, [params.phone]);

  useEffect(() => {
    Toast.show({
      text1: t('auth.createAccount'),
      text2: t('auth.enterName'),
    });
  }, [phone, t]);

  const [registrationMutation, { loading }] = useMutation(
    REGISTRATION_MUTATION,
    {
      onCompleted: (data) => {
        console.log("Registration completed:", data);
        const registeredPhone = data?.registration?.phone || phone;
        router.replace(`/login-otp?phone=${registeredPhone}`);
      },
      onError: (error) => {
        console.log("Registration error:", error.message);
        if (error.message === "Телефон уже зарегестрирован") {
          router.replace(`/login-otp?phone=${phone}&resend=true`);
        } else {
          Toast.show({
            type: "error",
            text1: t('common.error'),
            text2: error.message,
          });
        }
      },
    }
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: Colors.light.main,
      }}
      behavior="padding"
    >
      <View style={[styles.languageContainer, { top: insets.top + 10 }]}>
        <LanguageSelector />
      </View>
      <RegistrationForm
        defaultPhone={phone}
        isLoading={loading}
        onSubmit={({ name, phone }) => {
          console.log("Form submitted:", { name, phone });
          registrationMutation({
            variables: {
              phone,
              name,
            },
          });
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  languageContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
});