import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView } from "react-native";
import { useMutation } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";

import OneTimePasswordForm from "@/src/slices/auth/components/OneTimePasswordForm";
import {
  LOGIN_MUTATION,
  REQUEST_CODE_MUTATION,
} from "@/src/slices/auth/auth.gql";
import { useSession } from "@/context/AuthContext";

type OneTimePasswordRouteParams = { phone?: string; resend?: string };

export default function Index() {
  const params = useLocalSearchParams<OneTimePasswordRouteParams>();
  const { signIn } = useSession();
  const [lastResentAt, setLastResentAt] = useState(0);
  const [canResendIn, setCanResendIn] = useState(60);
  const phone = useMemo(() => {
    const p = params.phone || "";
    // Handle URL encoding - if phone starts with space (decoded from +), add + back
    if (p.startsWith(" ")) {
      return "+" + p.substring(1);
    }
    // If it already has +, use as is
    if (p.startsWith("+")) {
      return p;
    }
    // Otherwise add +
    return "+" + p;
  }, [params.phone]);

  console.log("Phone from params:", params.phone);
  console.log("Processed phone:", phone);

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log("Login completed:", data);
      if (data.login.accessToken) {
        signIn(data.login.accessToken as string);
        router.replace("/");
      }
    },
    onError: (error) => {
      console.log("Login error:", error.message);
      Alert.alert("Login Error", error.message);
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
      }}
      behavior="padding"
    >
      <OneTimePasswordForm
        isLoading={loading || requestCodeLoading}
        onLogin={({ code }) => {
          console.log("Logging in with phone:", phone, "code:", code);
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