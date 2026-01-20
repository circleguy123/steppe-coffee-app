import { gql } from "@apollo/client";

export const GET_EVENTS_QUERY = gql`
  query Events {
    events {
      id
      title
      description
      eventDate
      eventLength
      ticketsNumber
      photoUrl
      price
      location
      hasRegistered
      eventUrl
      isArchived
      ticketsLeft
    }
  }
`;

export const EVENT_RSVP_MUTATION = gql`
  mutation RsvpToEvent {
    rsvpToEvent(
      createEventRsvpInput: { eventId: "fe418e9d-d9c6-4962-b462-842cd450cc8a" }
    ) {
      id
      title
      description
      eventDate
      eventLength
      ticketsNumber
      photoUrl
      price
      location
      hasRegistered
    }
  }
`;
