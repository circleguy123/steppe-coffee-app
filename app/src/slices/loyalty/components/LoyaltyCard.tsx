import { View, Image, ImageBackground } from "react-native";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeLink } from "@/src/components/SteppeLink";
import { router } from "expo-router";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { useSession } from "@/context/AuthContext";
import QRCode from "react-native-qrcode-svg";

export enum LoyaltyTiers {
  free = "Free Tier",
  registered = "Registered Tier",
  paid = "Paid member",

  black = "Black",
}

export interface LoyaltyCardProps {
  tier: LoyaltyTiers;
  name: string;
  points: number;
  cashback: number;
  cardNumber?: string;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  name,
  tier,
  points,
  // cashback,
  cardNumber,
}) => {
  const { session } = useSession();

  return (
    <ImageBackground
      source={require("@/assets/images/card-background-1.png")}
      imageStyle={{ borderRadius: 8 }}
      style={{
        backgroundColor: "white",
        padding: 24,
        margin: 16,
        borderRadius: 8,
        height: 220,
        shadowColor: "black",
        justifyContent: "space-between",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 2 }}>
          <SteppeTitle style={{ fontSize: 28 }}>{name}</SteppeTitle>
          <SteppeText style={{ fontSize: 14 }}>{tier}</SteppeText>
        </View>
        <View style={{ flex: 1 }}>
          <SteppeText style={{ fontSize: 16, fontWeight: "bold" }}>
            {points.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} pts.
          </SteppeText>
          {/* <SteppeText>{cashback}% cashback</SteppeText> */}
        </View>
      </View>

      {tier === LoyaltyTiers.free ? (
        <SteppeLink
          title="Become a member"
          containerStyle={{
            position: "absolute",
            bottom: 24,
            left: 24,
            zIndex: 10,
            paddingVertical: 0,
          }}
          onPress={() => {
            if (!session) {
              router.push("/(app)/register");
            } else {
              router.push("/(app)/membership-payment-modal");
            }
          }}
        />
      ) : (
        <QRCode value={cardNumber} />
      )}
    </ImageBackground>
  );
};
