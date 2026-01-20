import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../src/hooks/useStorageState";
import { client } from "@/src/graphql/client";
import { LoyaltyUserQuery } from "@/__generated__/graphql";
import { router } from "expo-router";

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  loyalty?: LoyaltyUserQuery["loyaltyUser"];
  setLoyalty: (loyalty: LoyaltyUserQuery["loyaltyUser"]) => void;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  loyalty: undefined,
  setLoyalty: () => null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[_loyaltyLoading, loyalty], setLoyalty] = useStorageState("loyalty");

  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          // Perform sign-in logic here
          setSession(token);
        },
        signOut: () => {
          setSession(null);
          client.resetStore();
          router.replace("/");
        },
        session,
        isLoading,
        loyalty:
          (loyalty &&
            (JSON.parse(loyalty) as LoyaltyUserQuery["loyaltyUser"])) ||
          undefined,
        setLoyalty: (loyalty) => setLoyalty(JSON.stringify(loyalty)),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
