import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import z, { ZodType } from "zod";

import { useSession } from "@/context/AuthContext";
import { SteppeInput } from "@/src/components/forms/SteppeInput";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import InputMasks from "@/src/slices/auth/constants/InputMasks";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_PROFILE_MUTATION } from "@/src/slices/profile/profile.gql";
import { router } from "expo-router";
import {
  LoyaltyUserQuery,
  UpdateProfileMutation,
} from "@/__generated__/graphql";
import { LOYALTY_QUERY } from "@/src/slices/loyalty/loyalty.gql";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import { SteppeLink } from "@/src/components/SteppeLink";

type ProfileFormFields = {
  name: string;
  surName: string;
  birthDate: string;
};

const ProfileFormSchema: ZodType<ProfileFormFields> = z.object({
  name: z.string().min(1),
  surName: z.string(),
  birthDate: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{4}$/, "Invalid date format (dd.mm.yyyy)")
    .refine(
      (value) => {
        const [day, month, year] = value.split(".").map(Number);
        const date = new Date(year, month - 1, day);

        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      },
      { message: "Invalid date" }
    ),
});

export default function Profile() {
  const { loyalty, setLoyalty } = useSession();

  const loyaltyQuery = useQuery<LoyaltyUserQuery>(LOYALTY_QUERY, {
    onCompleted: ({ loyaltyUser }) => setLoyalty(loyaltyUser),
    onError: (error) => {
      console.log(error);
    },
  });

  const [profileMutation, { loading }] = useMutation<UpdateProfileMutation>(
    UPDATE_PROFILE_MUTATION,
    {
      onCompleted: async ({ updateProfile }) => {
        loyaltyQuery.updateQuery((prevLoyaltyData) => ({
          ...prevLoyaltyData,
          loyaltyUser: {
            ...prevLoyaltyData.loyaltyUser,
            name: updateProfile.name,
            surname: updateProfile.surName,
          },
        }));
        router.back();
      },
    }
  );

  const initialBirthdate = useMemo(() => {
    const [date] = loyalty?.birthday
      ? loyalty?.birthday.split(" ")
      : [undefined];

    if (date) {
      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    }

    return undefined;
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormFields>({
    defaultValues: {
      name: loyalty?.name ?? undefined,
      surName: loyalty?.surname ?? undefined,
      birthDate: initialBirthdate,
    },
    resolver: zodResolver(ProfileFormSchema),
  });

  return (
    <ProfileLayout>
      <View style={{ gap: 8, flex: 1, justifyContent: "space-between" }}>
        <View>
          <SteppeTitle style={{ fontSize: 32, marginBottom: 16 }}>
            Profile
          </SteppeTitle>

          <SteppeInput
            label="Phone Number"
            keyboardType="phone-pad"
            placeholder="+7 (___) ___-__-__"
            value={loyalty?.phone ?? ""}
            // onChangeText={onChange}
            returnKeyType="done"
            disabled
            // mask={InputMasks.phoneMask}
          />

          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SteppeInput
                label="First name"
                value={value}
                onChangeText={onChange}
                returnKeyType="done"
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="surName"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SteppeInput
                label="Last name"
                value={value}
                onChangeText={onChange}
                returnKeyType="done"
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="birthDate"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <SteppeInput
                label="Birth date"
                value={value}
                onChangeText={onChange}
                returnKeyType="done"
                onBlur={onBlur}
                mask={InputMasks.dateMask}
                error={errors.birthDate?.message}
              />
            )}
          />
        </View>
        <SteppeButton
          title="Save"
          onPress={handleSubmit((variables) => {
            profileMutation({ variables });
          })}
          loading={loading || loyaltyQuery.loading}
        />

        <SteppeLink
          textStyle={{ textAlign: "center" }}
          containerStyle={{ paddingBottom: 16 }}
          title="Back"
          onPress={() => router.back()}
        />
      </View>
    </ProfileLayout>
  );
}
