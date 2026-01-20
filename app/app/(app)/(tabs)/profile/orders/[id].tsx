import { UserOrderDetailsQuery } from "@/__generated__/graphql";
import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeText } from "@/src/components/SteppeText";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import { GET_ORDER_DETAILS_QUERY } from "@/src/slices/profile/profile.gql";
import { formatNumber } from "@/src/utils/formatNumber";
import { useQuery } from "@apollo/client";
import { router, useLocalSearchParams } from "expo-router";

export default function ViewOrderRoute() {
  const { id } = useLocalSearchParams();
  const orderDetailsQuery = useQuery<UserOrderDetailsQuery>(
    GET_ORDER_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    }
  );

  return (
    <ProfileLayout>
      <SteppeText variant="bold" style={{ fontSize: 24 }}>
        Order #{orderDetailsQuery.data?.getUserOrder.orderNumber}
      </SteppeText>
      {orderDetailsQuery.data?.getUserOrder.userOrderItem.map((item, idx) => (
        <SteppeText
          key={item.id}
          style={{
            paddingBottom: 8,
            borderBottomWidth:
              orderDetailsQuery.data?.getUserOrder.userOrderItem.length ===
              idx - 1
                ? 1
                : 0,
            borderColor: "#EEEEEE",
            marginBottom: 8,
          }}
        >
          {item.productName} x {item.amount} — {formatNumber(item.price)} ₸
        </SteppeText>
      ))}
      <SteppeText variant="bold" style={{ fontSize: 18 }}>
        Total:{" "}
        {orderDetailsQuery.data?.getUserOrder.total &&
          formatNumber(orderDetailsQuery.data?.getUserOrder.total)}{" "}
        ₸
      </SteppeText>

      <SteppeButton title="Back" onPress={() => router.back()} />
    </ProfileLayout>
  );
}
