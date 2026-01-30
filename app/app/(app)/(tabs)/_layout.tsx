import React from "react";
import { Colors } from "@/constants/Colors";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { TabButton } from "@/src/components/TabButton";
import { useSession } from "@/context/AuthContext";
import { Link } from "expo-router";

export default function TabLayout() {
  const { session, isLoading: isSessionLoading } = useSession();

  return (
    <Tabs
      style={{ flex: 1, backgroundColor: Colors.yellow, paddingBottom: 96 }}
    >
      <TabSlot />
      <TabList
        style={{
          height: 110,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          paddingBottom: 16,
          justifyContent: "space-around",
          shadowOffset: {
            height: 10,
            width: 0,
          },
          shadowColor: "black",
          shadowOpacity: 0.12,
          shadowRadius: 16,
        }}
      >
        <TabTrigger
          name="index"
          href="/"
          style={{
            padding: 4,
          }}
        >
          <TabButton icon="home" />
        </TabTrigger>
        <TabTrigger
          name="menu"
          href="/menu"
          style={{
            padding: 4,
          }}
        >
          <TabButton icon="appstore-o" />
        </TabTrigger>

        {session ? (
          <>
            <TabTrigger
              name="community"
              href="/(app)/(tabs)/community"
              style={{
                padding: 4,
              }}
            >
              <TabButton icon="team" />
            </TabTrigger>
            <TabTrigger
              name="events"
              href="/(app)/(tabs)/events"
              style={{
                padding: 4,
              }}
            >
              <TabButton icon="calendar" />
            </TabTrigger>
            <TabTrigger
              name="profile"
              href="/(app)/(tabs)/profile"
              reset="always"
              style={{
                padding: 4,
              }}
            >
              <TabButton icon="user" />
            </TabTrigger>
          </>
        ) : (
          <>
            <Link href="/(app)/register" style={{ padding: 4 }}>
              <TabButton icon="calendar" />
            </Link>
            <Link href="/(app)/register" style={{ padding: 4 }}>
              <TabButton icon="user" />
            </Link>
          </>
        )}
      </TabList>
    </Tabs>
  );
}
