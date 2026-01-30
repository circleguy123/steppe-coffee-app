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

export const CANCEL_BOOKING_MUTATION = gql`
  mutation CancelBooking($id: String!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;
