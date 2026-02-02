import { Colors } from "@/constants/Colors";
import { REQUEST_CODE_MUTATION } from "@/src/slices/auth/auth.gql";
import LoginForm from "@/src/slices/auth/components/LoginForm";
import { LanguageSelector } from "@/src/components/LanguageSelector";
import { useMutation } from "@apollo/client";
import { router } from "expo-router";
import { KeyboardAvoidingView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const insets = useSafeAreaInsets();
  
  const [requestCodeMutation, { loading }] = useMutation(
    REQUEST_CODE_MUTATION,
    {
      onCompleted: (data, clientOptions) => {
        if (data.requestCode) {
          router.replace(`/login-otp?phone=${clientOptions?.variables?.phone}`);
        } else {
          router.replace(
            `/(app)/register?phone=${clientOptions?.variables?.phone}`
          );
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: Colors.light.main,
      }}
    >
      <View style={[styles.languageContainer, { top: insets.top + 10 }]}>
        <LanguageSelector />
      </View>
      <LoginForm
        isLoading={loading}
        onSubmit={({ phone }) =>
          requestCodeMutation({
            variables: { phone },
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