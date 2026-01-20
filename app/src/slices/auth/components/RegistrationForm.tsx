import React from "react";
import { ExternalLink } from "@/src/components/ExternalLink";
import { SteppeInput } from "@/src/components/forms/SteppeInput";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import { Link } from "expo-router";
import { View, Image, StyleSheet } from "react-native";
import InputMasks from "../constants/InputMasks";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeLogo } from "@/src/components/SteppeLogo";
import { Colors } from "@/constants/Colors";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterFormFields = {
  name: string;
  phone: string;
};

const RegisterFormSchema: ZodType<RegisterFormFields> = z.object({
  name: z.string().min(1, "Enter your name"),
  phone: z.string().min(16, "Enter your phone number"),
});

export interface RegistrationFormProps {
  onSubmit: SubmitHandler<RegisterFormFields>;
  isLoading: boolean;
  defaultPhone?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  isLoading,
  defaultPhone = "",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormFields>({
    defaultValues: {
      name: "",
      phone: defaultPhone,
    },
    resolver: zodResolver(RegisterFormSchema),
  });

  return (
    <View style={styles.container}>
      <SteppeLogo style={{ margin: 24 }} />

      <View style={[styles.formContainer, { top: 0 }]}>
        <Image
          style={styles.formImage}
          source={require("@/assets/images/steppe-saigak-form.png")}
        />
        <SteppeText style={styles.title}>Register</SteppeText>
        <View style={{ marginBottom: 50 }}>
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SteppeInput
                label="How should we call you?"
                autoComplete="name"
                placeholder="Enter your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SteppeInput
                label="Phone Number"
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
            We will not share you phone with anyone else and it will be used for
            reward system only.
          </SteppeText>
          <ExternalLink href="https://steppecoffee.kz/?page_id=159" asChild>
            <SteppeLink
              containerStyle={{ paddingVertical: 2 }}
              title="Learn how we use the data"
            />
          </ExternalLink>
        </View>

        <View style={styles.navigationButtonsContainer}>
          <SteppeButton
            loading={isLoading}
            title="Register"
            onPress={handleSubmit(onSubmit)}
          />
          <Link href="/login" asChild replace>
            <SteppeLink
              title="I already have an account"
              textStyle={{ textAlign: "center" }}
            />
          </Link>
          <Link href="/(app)/(tabs)" asChild replace>
            <SteppeLink
              title="Back to menu"
              containerStyle={{ paddingVertical: 6 }}
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

export default RegistrationForm;
