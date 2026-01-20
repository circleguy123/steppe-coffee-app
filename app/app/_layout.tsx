import { Slot } from "expo-router";
import { SessionProvider } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/src/graphql/client";

function Root() {
  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        <Slot />
        <Toast />
      </SessionProvider>
    </ApolloProvider>
  );
}

export default Root;
