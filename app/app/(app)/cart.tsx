import {
  CreateUserOrderMutation,
  GetUserCardsQuery,
} from "@/__generated__/graphql";
import { Colors } from "@/constants/Colors";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeLink } from "@/src/components/SteppeLink";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { CartList } from "@/src/slices/cart/components/CartList";
import { useCartContext } from "@/src/slices/cart/context/cart.context";
import { CREATE_ORDER_MUTATION } from "@/src/slices/menu/order.gql";
import { GET_USER_CARDS_QUERY } from "@/src/slices/profile/profile.gql";
import { formatNumber } from "@/src/utils/formatNumber";
import { useMutation, useQuery } from "@apollo/client";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useAddCard } from "@/src/slices/profile/hooks/useAddCard";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { t } = useTranslation();
  const { order, clearOrder, total, cartItems } = useCartContext();
  const [open, setOpen] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const pathname = usePathname();
  const { createAddCardOrderMutation } = useAddCard();

  const [createOrderMutation, createOrderState] =
    useMutation<CreateUserOrderMutation>(CREATE_ORDER_MUTATION, {
      onCompleted: (data) => {
        clearOrder();
        Toast.show({
          text1: t('cart.orderCreated', { number: data.createUserOrder.orderNumber }),
          text2: t('cart.orderCreatedMessage'),
          type: "success",
        });
      },
      onError: (error) => console.log(error),
    });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.back();
    }
  }, [cartItems.length]);

  const userCardsQuery = useQuery<GetUserCardsQuery>(GET_USER_CARDS_QUERY, {
    onCompleted: ({ getUserCards }) => {
      if (getUserCards.length > 0) {
        setCardId(getUserCards[0].id);
      }
    },
  });

  useEffect(() => {
    userCardsQuery.refetch();
  }, [pathname]);

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        <SteppeTitle style={{ fontSize: 32, padding: 16 }}>
          {t('cart.yourOrder')}
        </SteppeTitle>

        <CartList cartItems={cartItems} />
      </View>
      <View style={styles.cartFooter}>
        {userCardsQuery.data &&
        userCardsQuery.data?.getUserCards.length === 0 ? (
          <SteppeLink
            title={t('cart.addCard')}
            onPress={() => createAddCardOrderMutation()}
            containerStyle={{ paddingVertical: 15 }}
          />
        ) : (
          <DropDownPicker
            loading={userCardsQuery.loading}
            dropDownDirection="TOP"
            open={open}
            setOpen={setOpen}
            value={cardId}
            items={
              userCardsQuery.data?.getUserCards.map((card) => ({
                label: card.cardMask,
                value: card.id,
              })) ?? []
            }
            setValue={setCardId}
            placeholder={t('cart.selectCard')}
          />
        )}

        <View
          style={{
            justifyContent: "space-between",
            alignContent: "center",
            flexDirection: "row",
          }}
        >
          <View style={{ justifyContent: "center", flex: 1 / 2 }}>
            <SteppeText>{t('menu.total')}</SteppeText>
            <SteppeText style={{ fontSize: 24 }}>
              {formatNumber(total)} ₸
            </SteppeText>
          </View>

          <SteppeButton
            title={t('menu.checkout')}
            buttonStyle={styles.buttonStyle}
            disabled={cardId === null}
            loading={createOrderState.loading}
            onPress={() =>
              createOrderMutation({
                variables: { order: { ...order, cardId } },
              })
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.main,
  },
  itemsContainer: {
    flex: 1,
  },
  cartFooter: {
    padding: 24,
    gap: 16,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 0,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowColor: "black",
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  buttonStyle: {
    flex: 1 / 2,
    borderRadius: 60,
    paddingHorizontal: 50,
  },
});
