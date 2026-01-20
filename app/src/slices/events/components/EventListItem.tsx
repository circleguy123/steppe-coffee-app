import { EventOutput } from "@/__generated__/graphql";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { UrlImage } from "@/src/components/UrlImage";
import { TouchableOpacity, View } from "react-native";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import { openBrowserAsync } from "expo-web-browser";
export interface EventListItemProps {
  event: EventOutput;
  onPress?: () => void;
}

export const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
  return (
    <TouchableOpacity
      style={{ borderRadius: 8, backgroundColor: "#FFF" }}
      onPress={async () => {
        console.log(event);
        if (event.eventUrl) {
          await openBrowserAsync(event.eventUrl);
        }
      }}
    >
      <UrlImage
        source={event.photoUrl}
        style={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          width: "100%",
          height: 220,
        }}
      />
      <View style={{ padding: 16, gap: 4 }}>
        <SteppeTitle style={{ fontSize: 18 }}>{event.title}</SteppeTitle>
        <SteppeText
          style={{
            width: 120,
            textAlign: "center",
            backgroundColor: Colors.yellow,
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 16,
          }}
        >
          {format(new Date(event.eventDate), "d MMM, hh:mm")}
        </SteppeText>
        <SteppeText>{event.description}</SteppeText>
      </View>
    </TouchableOpacity>
  );
};
