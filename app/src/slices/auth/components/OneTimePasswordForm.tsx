import { Colors } from "@/constants/Colors";
import { SteppeInput } from "@/src/components/forms/SteppeInput";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import { SteppeLogo } from "@/src/components/SteppeLogo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Image, StyleSheet } from "react-native";
import { z, ZodType } from "zod";

export type OneTimePasswordFormFields = {
  code: string;
};
export interface OneTimePasswordFormProps {
  onLogin: (data: OneTimePasswordFormFields) => void;
  isLoading?: boolean;
  codeError?: string;
  canResendIn?: number;
  onResend: () => void;
}

const OneTimePasswordFormSchema: ZodType<OneTimePasswordFormFields> = z.object({
  code: z.string().min(4, "Enter the code").max(4, "Enter the code"),
});

const OneTimePasswordForm: React.FC<OneTimePasswordFormProps> = ({
  isLoading,
  onLogin,
  codeError,
  canResendIn,
  onResend,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OneTimePasswordFormFields>({
    defaultValues: {
      code: "",
    },
    resolver: zodResolver(OneTimePasswordFormSchema),
  });

  const isResendDisabled = useMemo(
    () => canResendIn !== undefined && canResendIn > 0,
    [canResendIn]
  );

  return (
    <View style={styles.container}>
      <SteppeLogo style={{ margin: 24 }} />

      <View style={[styles.formContainer, { top: 0 }]}>
        <Image
          style={styles.formImage}
          source={require("@/assets/images/steppe-saigak-form.png")}
        />

        <Controller
          control={control}
          name="code"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <SteppeInput
              label="One Time Password"
              keyboardType="number-pad"
              placeholder="XXXX"
              value={value}
              onChangeText={onChange}
              returnKeyType="done"
              onBlur={onBlur}
              mask={[/\d/, /\d/, /\d/, /\d/]}
              error={errors.code?.message ?? codeError}
            />
          )}
        />

        <SteppeLink
          title={`Resend Code${isResendDisabled ? ` (${canResendIn})` : ""}`}
          disabled={canResendIn !== undefined && canResendIn > 0}
          onPress={onResend}
        />

        <View style={styles.navigationButtonsContainer}>
          <SteppeButton
            title="Login"
            loading={isLoading}
            onPress={handleSubmit(onLogin)}
          />
          <Link href="/register" asChild replace>
            <SteppeLink
              title="I don't have an account"
              textStyle={{ textAlign: "center" }}
            />
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.main,
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
  },
  note: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  navigationButtonsContainer: {
    gap: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    shadowColor: "black",
    shadowOpacity: 0.12,
    shadowRadius: 16,

    gap: 24,
  },
  formImage: {
    position: "absolute",
    width: 178,
    height: 219,
    top: -219,
    right: 0,
  },
});

export default OneTimePasswordForm;
