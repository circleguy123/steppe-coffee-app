import { useQuery } from "@apollo/client";
import { GET_USER_ORDERS_QUERY } from "@/src/slices/profile/profile.gql";
import { UserOrdersQuery } from "@/__generated__/graphql";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SteppeText } from "@/src/components/SteppeText";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useCartContext } from "@/src/slices/cart/context/cart.context";
import { formatNumber } from "@/src/utils/formatNumber";
import { UrlImage } from "@/src/components/UrlImage";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export default function OrdersRoute() {
  const { t } = useTranslation();
  const userOrdersQuery = useQuery<UserOrdersQuery>(GET_USER_ORDERS_QUERY);
  const { setMenu, order, addItem, total, cartItems } = useCartContext();

  return (
    <ProfileLayout>
      <SteppeTitle style={{ fontSize: 32 }}>{t('orders.title')}</SteppeTitle>

      <ScrollView
        style={{
          marginHorizontal: -16,
          marginBottom: -32,
          paddingBottom: 32,
          paddingHorizontal: 16,
        }}
        contentContainerStyle={{
          gap: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={userOrdersQuery.loading}
            onRefresh={() => userOrdersQuery.refetch()}
          />
        }
      >
        <TouchableOpacity
          style={{
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            backgroundColor: "#fff",
            borderColor: "#f0f0f0",
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onPress={() => router.push("/(app)/cart")}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <AntDesign name="shoppingcart" size={24} />
            <SteppeText
              variant="bold"
              style={{
                marginLeft: 8,
                fontSize: 16,
              }}
            >
              {t('orders.myCart')}
            </SteppeText>
            <SteppeText>{formatNumber(total)} ₸</SteppeText>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cartItems.slice(0, 5).map((cartItem, idx) => (
              <View
                key={`${cartItem.itemId}-${cartItem.itemSize.sizeId}`}
                style={{
                  margin: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  borderRadius: 40,
                  backgroundColor: "#EEE",
                  width: 40,
                  height: 40,
                  marginLeft: -30,
                  zIndex: cartItems.length - idx,
                }}
              >
                <UrlImage
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: Colors.green,
                  }}
                  source={cartItem.itemSize.buttonImageUrl || undefined}
                  placeholderContentFit="cover"
                  contentFit="cover"
                />
              </View>
            ))}
          </View>
        </TouchableOpacity>
        {userOrdersQuery.data?.getUserOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => {
              router.push(`/profile/orders/${order.id}`);
            }}
          >
            <View
              style={{
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                backgroundColor: "#fff",
                borderColor: "#f0f0f0",
              }}
            >
              <View style={{ gap: 4 }}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <SteppeText style={{ fontSize: 16 }} variant="bold">
                    {t('orders.orderNumber', { number: order.orderNumber })}
                  </SteppeText>

                  <SteppeText
                    style={{
                      color:
                        order.paymentStatus === "paid" ? "#00ff00" : "#ff0000",
                    }}
                  >
                    {order.paymentStatus === "paid"
                      ? order.iikoStatus === "created"
                        ? t('orders.created')
                        : t('orders.notCreated')
                      : t('orders.notPaid')}
                  </SteppeText>
                </View>

                <SteppeText style={{ color: "#999999" }}>
                  {t('menu.total')}: {order.total}
                </SteppeText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ProfileLayout>
  );
}
