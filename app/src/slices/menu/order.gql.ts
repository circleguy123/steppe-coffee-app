import { gql } from "@apollo/client";

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateUserOrder($order: CreateUserOrderInput!) {
    createUserOrder(createUserOrderInput: $order) {
      id
      orderNumber
      total
      userId
      iikoStatus
      iikoOrderId
      paymentStatus
      organizationId
      terminalGroupId
      menuId
      userOrderItem {
        id
        productId
        amount
        price
        productSizeId
        userOrderId
      }
    }
  }
`;
