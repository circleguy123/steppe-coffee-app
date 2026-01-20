import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  {
    profile {
      id
      name
    }
  }
`;

export const LOYALTY_QUERY = gql`
  query LoyaltyUser {
    loyaltyUser {
      id
      referrerId
      name
      surname
      middleName
      comment
      phone
      cultureName
      birthday
      email
      sex
      consentStatus
      anonymized
      userData
      shouldReceivePromoActionsInfo
      shouldReceiveLoyaltyInfo
      shouldReceiveOrderStatusInfo
      personalDataConsentFrom
      personalDataConsentTo
      personalDataProcessingFrom
      personalDataProcessingTo
      isDeleted
      walletBalances {
        id
        name
        type
        balance
      }
      categories {
        id
        name
        isActive
        isDefaultForNewGuests
      }
      cards {
        id
        track
        number
        validToDate
      }
    }

    getCurrentMembership {
      id
      activatedAt
      expiresAt
      status
    }
  }
`;

export const REDEEM_REWARD_MUTATION = gql`
  mutation RedeemReward($order: CreateUserOrderInput!) {
    createRewardOrder(createUserOrderInput: $order) {
      id
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

export const CREATE_MEMBERSHIP_MUTATION = gql`
  mutation CreateMembership($productId: String!, $cardId: String!) {
    createMembership(productId: $productId, cardId: $cardId) {
      id
      expiresAt
      status
    }
  }
`;

export const GET_CURRENT_MEMBERSHIP_QUERY = gql`
  query GetCurrentMembership {
    getCurrentMembership {
      id
      activatedAt
      expiresAt
      status
    }
  }
`;

export const CANCEL_MEMBERSHIP_MUTATION = gql`
  mutation CancelMembership($id: String!) {
    cancelMembership(membershipId: $id) {
      status
    }
  }
`;
