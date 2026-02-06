import { Animated, View } from "react-native";
import { EventsQuery } from "@/__generated__/graphql";
import { SaigakHeader } from "@/src/components/SaigakHeader";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { EventList } from "@/src/slices/events/components/EventList";
import { GET_EVENTS_QUERY } from "@/src/slices/events/events.gql";
import { useQuery } from "@apollo/client";
import { useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

export default function EventListDisplay() {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const eventsQuery = useQuery<EventsQuery>(GET_EVENTS_QUERY);

  return (
    <View style={{ flex: 1 }}>
      <SaigakHeader animHeaderValue={scrollOffsetY}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AntDesign name="enviromento" color={Colors.green} size={20} />
          <SteppeText style={{ fontSize: 16 }}>{t('menu.locationName')}</SteppeText>
        </View>
      </SaigakHeader>
      <View style={{ flex: 1 }}>
        <SteppeTitle style={{ fontSize: 32, padding: 16, paddingBottom: 0 }}>
          {t('events.title')}
        </SteppeTitle>

        <EventList
          data={eventsQuery.data?.events ?? []}
          isLoading={eventsQuery.loading}
          onRefresh={eventsQuery.refetch}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
        />
      </View>
    </View>
  );
}
