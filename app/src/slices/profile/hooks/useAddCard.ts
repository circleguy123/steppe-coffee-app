import { CreateCardInvoiceMutation } from "@/__generated__/graphql";
import { useMutation } from "@apollo/client";
import { CREATE_CARD_INVOICE_MUTATION } from "../profile.gql";
import { router } from "expo-router";
import { useSession } from "@/context/AuthContext";

export const useAddCard = () => {
  const { session } = useSession();

  const [createAddCardOrderMutation, createAddCardOrderState] =
    useMutation<CreateCardInvoiceMutation>(CREATE_CARD_INVOICE_MUTATION, {
      onCompleted: (result) => {
        router.push(
          `/(app)/(tabs)/profile/add-card?invoiceId=${result.createInvoice.id}&token=${session}`,
          {}
        );
      },
    });

  return {
    createAddCardOrderMutation,
    createAddCardOrderState,
  };
};
