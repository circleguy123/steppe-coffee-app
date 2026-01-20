import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const getAuthToken = () => {
  if (Platform.OS === "web") {
    try {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem("session");
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    return SecureStore.getItem("session");
  }
};

const httpLink = createHttpLink({
  uri: "https://api.steppecoffee.kz/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getAuthToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Initialize Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});
