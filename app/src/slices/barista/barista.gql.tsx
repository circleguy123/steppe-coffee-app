import { gql } from "@apollo/client";

export const GET_TODAY_BOOKINGS = gql`
  query GetTodayBookings {
    adminBookings {
      id
      tableNumber
      date
      timeSlot
      partySize
      status
      notes
      user {
        name
        phone
      }
    }
  }
`;

export const GET_TODAY_EVENTS = gql`
  query GetTodayEvents {
    events {
      id
      title
      eventDate
      location
      ticketsNumber
      ticketsLeft
    }
  }
`;