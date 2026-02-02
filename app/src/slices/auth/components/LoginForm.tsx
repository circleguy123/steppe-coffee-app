import { SteppeInput } from "@/src/components/forms/SteppeInput";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, Image, StyleSheet } from "react-native";
import InputMasks from "../constants/InputMasks";
import { SteppeLogo } from "@/src/components/SteppeLogo";
import { SteppeText } from "@/src/components/SteppeText";
import { ExternalLink } from "@/src/components/ExternalLink";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

type LoginFormFields = {
  phone: string;
};

interface LoginFormProps {
  onSubmit: (data: LoginFormFields) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();

  const LoginFormSchema: ZodType<LoginFormFields> = z.object({
    phone: z.string().min(16, t('auth.enterPhone')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    defaultValues: {
      phone: "",
    },
    resolver: zodResolver(LoginFormSchema),
  });

  return (
    <View style={styles.container}>
      <View style={{ margin: 24 }}>
        <SteppeLogo />
      </View>

      <View style={styles.formContainer}>
        <Image
          style={styles.formImage}
          source={require("@/assets/images/steppe-saigak-form.png")}
        />
        <SteppeText style={styles.title} variant="bold">
          {t('auth.login')}
        </SteppeText>

        <View style={{ marginBottom: 100 }}>
          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SteppeInput
                label={t('auth.phone')}
                keyboardType="phone-pad"
                placeholder="+7 (___) ___-__-__"
                value={value}
                onChangeText={onChange}
                returnKeyType="done"
                onBlur={onBlur}
                mask={InputMasks.phoneMask}
                error={errors.phone?.message}
              />
            )}
          />

          <SteppeText style={styles.note}>
            {t('auth.privacyNote')}
          </SteppeText>
          <ExternalLink href="https://steppecoffee.kz/?page_id=159" asChild>
            <SteppeLink
              containerStyle={{ paddingVertical: 2 }}
              title={t('auth.learnData')}
            />
          </ExternalLink>
        </View>

        <View style={styles.navigationButtonsContainer}>
          <SteppeButton
            title={t('auth.login')}
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
          <SteppeLink
            title={t('auth.noAccount')}
            textStyle={{ textAlign: "center" }}
            onPress={() => router.push("/(app)/register")}
          />
          <SteppeLink
            title={t('common.back')}
            containerStyle={{ paddingVertical: 6 }}
            textStyle={{ textAlign: "center" }}
            onPress={() => router.replace("/(app)/(tabs)")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
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

export default LoginForm;