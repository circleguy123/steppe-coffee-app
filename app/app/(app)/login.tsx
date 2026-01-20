import { Colors } from "@/constants/Colors";
import { REQUEST_CODE_MUTATION } from "@/src/slices/auth/auth.gql";
import LoginForm from "@/src/slices/auth/components/LoginForm";
import { useMutation } from "@apollo/client";
import { router } from "expo-router";
import { KeyboardAvoidingView } from "react-native";

export default function Index() {
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
