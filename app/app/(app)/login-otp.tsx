import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, View, StyleSheet } from "react-native";
import { useMutation } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import OneTimePasswordForm from "@/src/slices/auth/components/OneTimePasswordForm";
import { LanguageSelector } from "@/src/components/LanguageSelector";
import {
  LOGIN_MUTATION,
  REQUEST_CODE_MUTATION,
} from "@/src/slices/auth/auth.gql";
import { useSession } from "@/context/AuthContext";
import { Colors } from "@/constants/Colors";

type OneTimePasswordRouteParams = { phone?: string; resend?: string };

export default function Index() {
  const params = useLocalSearchParams<OneTimePasswordRouteParams>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { signIn } = useSession();
  const [lastResentAt, setLastResentAt] = useState(0);
  const [canResendIn, setCanResendIn] = useState(60);
  const phone = useMemo(() => {
    const p = params.phone || "";
    if (p.startsWith(" ")) {
      return "+" + p.substring(1);
    }
    if (p.startsWith("+")) {
      return p;
    }
    return "+" + p;
  }, [params.phone]);

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.accessToken) {
        signIn(data.login.accessToken as string);
        router.replace("/");
      }
    },
    onError: (error) => {
      Alert.alert(t('common.error'), error.message);
    },
  });
  
  const [requestCodeMutation, { loading: requestCodeLoading }] = useMutation(
    REQUEST_CODE_MUTATION,
    {
      onCompleted: (data) => {
        setLastResentAt(Date.now());
      },
      onError: (error) => {
        console.log("Request code error:", error.message);
      },
    }
  );

  useEffect(() => {
    if (params.resend === "true") {
      router.setParams({ resend: undefined });
      requestCodeMutation({ variables: { phone } });
    }
  }, [params.resend]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCanResendIn(
        Math.max(0, 60 - Math.floor((Date.now() - lastResentAt) / 1000))
      );
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [lastResentAt]);

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
      <OneTimePasswordForm
        phone={phone}
        isLoading={loading || requestCodeLoading}
        onLogin={({ code }) => {
          loginMutation({
            variables: { phone, code },
          });
        }}
        canResendIn={canResendIn}
        onResend={() =>
          requestCodeMutation({
            variables: {
              phone,
            },
          })
        }
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