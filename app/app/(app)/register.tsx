import { REGISTRATION_MUTATION } from "@/src/slices/auth/auth.gql";
import RegistrationForm from "@/src/slices/auth/components/RegistrationForm";
import { useMutation } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { KeyboardAvoidingView } from "react-native";
import Toast from "react-native-toast-message";

type RegistrationRouteParams = { phone?: string };

export default function Index() {
  const params = useLocalSearchParams<RegistrationRouteParams>();
  const phone = useMemo(() => "+" + params.phone?.substring(1), [params.phone]);

  useEffect(() => {
    Toast.show({
      text1: "Seems like you are not registered yet",
      text2: "Let's do that real quick",
    });
  }, [phone]);

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
            text1: "Registration failed",
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
      }}
      behavior="padding"
    >
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