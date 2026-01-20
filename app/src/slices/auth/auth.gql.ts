import { gql } from "@apollo/client";

export const REGISTRATION_MUTATION = gql`
  mutation Signup($phone: String!, $name: String!) {
    signup(createUserInput: { phone: $phone, name: $name }) {
      id
      phone
      name
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($phone: String!, $code: String!) {
    login(phone: $phone, code: $code) {
      accessToken
    }
  }
`;

export const REQUEST_CODE_MUTATION = gql`
  mutation RequestCode($phone: String!) {
    requestCode(phone: $phone)
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;
