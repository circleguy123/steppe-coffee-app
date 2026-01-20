import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
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
  const phone = useMemo(() => "+" + params.phone?.substring(1), [params.phone]);

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.accessToken) {
        signIn(data.login.accessToken as string);
        router.replace("/");
      }
    },
  });
  const [requestCodeMutation, { loading: requestCodeLoading }] = useMutation(
    REQUEST_CODE_MUTATION,
    {
      onCompleted: (data) => {
        setLastResentAt(Date.now());
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
          loginMutation({
            variables: { phone, code: code },
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
