import { gql } from "@apollo/client";

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($name: String!, $birthDate: String, $surName: String) {
    updateProfile(name: $name, birthDate: $birthDate, surName: $surName) {
      id
      phone
      name
      surName
      birthDate
    }
  }
`;

export const CREATE_CARD_INVOICE_MUTATION = gql`
  mutation CreateCardInvoice {
    createInvoice(type: SaveCard) {
      id
    }
  }
`;

export const GET_USER_CARDS_QUERY = gql`
  query GetUserCards {
    getUserCards {
      id
      cardMask
      cardType
      issuer
    }
  }
`;

export const GET_USER_ORDERS_QUERY = gql`
  query UserOrders {
    getUserOrders {
      id
      paymentStatus
      iikoStatus
      total
      iikoOrderId
      orderNumber
      createdAt
    }
  }
`;

export const GET_ORDER_DETAILS_QUERY = gql`
  query UserOrderDetails($id: String!) {
    getUserOrder(id: $id) {
      id
      paymentStatus
      iikoStatus
      total
      iikoOrderId
      orderNumber
      createdAt
      type
      userOrderItem {
        id
        productId
        amount
        price
        productSizeId
        userOrderId
        productName
      }
    }
  }
`;
