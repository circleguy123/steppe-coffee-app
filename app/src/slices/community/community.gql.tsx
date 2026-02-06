import { gql } from "@apollo/client";

export const GET_COMMUNITIES_QUERY = gql`
  query Communities {
    communities {
      id
      name
      description
      imageUrl
      isPublic
      createdById
      createdAt
    }
  }
`;

export const GET_MY_COMMUNITIES_QUERY = gql`
  query MyCommunities {
    myCommunities {
      id
      name
      description
      imageUrl
      isPublic
      createdById
      createdAt
    }
  }
`;

export const GET_COMMUNITY_QUERY = gql`
  query Community($id: String!) {
    community(id: $id) {
      id
      name
      description
      imageUrl
      isPublic
      inviteCode
      createdById
      createdAt
      members {
        id
        userId
        role
        joinedAt
        user {
          id
          name
          phone
        }
      }
    }
  }
`;

export const GET_COMMUNITY_EVENTS_QUERY = gql`
  query CommunityEvents($communityId: String) {
    communityEvents(communityId: $communityId) {
      id
      communityId
      title
      description
      imageUrl
      eventDate
      eventLength
      location
      maxAttendees
      price
      createdAt
    }
  }
`;

export const GET_MY_BOOKINGS_QUERY = gql`
  query MyBookings {
    myBookings {
      id
      eventId
      communityId
      tableNumber
      date
      timeSlot
      partySize
      status
      notes
      event {
        id
        title
        location
      }
      community {
        id
        name
      }
    }
  }
`;

export const GET_COMMUNITY_BOOKINGS_QUERY = gql`
  query CommunityBookings($communityId: String!) {
    communityBookings(communityId: $communityId) {
      id
      tableNumber
      date
      timeSlot
      partySize
      status
      notes
      user {
        id
        name
        phone
      }
      event {
        id
        title
      }
    }
  }
`;

export const GET_COMMUNITY_BY_INVITE_CODE_QUERY = gql`
  query CommunityByInviteCode($inviteCode: String!) {
    communityByInviteCode(inviteCode: $inviteCode) {
      id
      name
      description
      imageUrl
      isPublic
      members {
        id
        userId
      }
    }
  }
`;

export const CREATE_COMMUNITY_MUTATION = gql`
  mutation CreateCommunity(
    $name: String!
    $description: String
    $imageUrl: String
    $isPublic: Boolean
  ) {
    createCommunity(
      name: $name
      description: $description
      imageUrl: $imageUrl
      isPublic: $isPublic
    ) {
      id
      name
      description
      imageUrl
      isPublic
    }
  }
`;

export const JOIN_COMMUNITY_MUTATION = gql`
  mutation JoinCommunity($communityId: String!) {
    joinCommunity(communityId: $communityId) {
      id
      communityId
      userId
      role
    }
  }
`;

export const LEAVE_COMMUNITY_MUTATION = gql`
  mutation LeaveCommunity($communityId: String!) {
    leaveCommunity(communityId: $communityId) {
      id
    }
  }
`;

export const CREATE_TABLE_BOOKING_MUTATION = gql`
  mutation CreateTableBooking(
    $eventId: String
    $tableNumber: String
    $date: String!
    $timeSlot: String
    $partySize: Int
    $notes: String
  ) {
    createTableBooking(
      eventId: $eventId
      tableNumber: $tableNumber
      date: $date
      timeSlot: $timeSlot
      partySize: $partySize
      notes: $notes
    ) {
      id
      status
      date
      tableNumber
      partySize
    }
  }
`;

export const CREATE_COMMUNITY_TABLE_BOOKING_MUTATION = gql`
  mutation CreateCommunityTableBooking(
    $communityId: String!
    $eventId: String
    $tableNumbers: [String!]!
    $date: String!
    $timeSlot: String
    $partySize: Int
    $notes: String
  ) {
    createCommunityTableBooking(
      communityId: $communityId
      eventId: $eventId
      tableNumbers: $tableNumbers
      date: $date
      timeSlot: $timeSlot
      partySize: $partySize
      notes: $notes
    ) {
      id
      tableNumber
      date
      timeSlot
      partySize
      status
      notes
    }
  }
`;

export const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking($id: String!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;

export const DELETE_BOOKING_MUTATION = gql`
  mutation DeleteBooking($bookingId: String!) {
    deleteBooking(bookingId: $bookingId) {
      id
    }
  }
`;

export const GENERATE_INVITE_CODE_MUTATION = gql`
  mutation GenerateInviteCode($communityId: String!) {
    generateInviteCode(communityId: $communityId) {
      id
      inviteCode
    }
  }
`;

export const JOIN_BY_INVITE_CODE_MUTATION = gql`
  mutation JoinByInviteCode($inviteCode: String!) {
    joinByInviteCode(inviteCode: $inviteCode) {
      id
      communityId
      userId
      role
      community {
        id
        name
      }
    }
  }
`;
