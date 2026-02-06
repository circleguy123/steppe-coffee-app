import { View, Image, ImageBackground } from "react-native";
import { SteppeText } from "@/src/components/SteppeText";
import { SteppeLink } from "@/src/components/SteppeLink";
import { router } from "expo-router";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { useSession } from "@/context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";

export enum LoyaltyTiers {
  free = "free",
  registered = "registered",
  paid = "paid",
  black = "black",
}

const tierLabels: Record<string, Record<string, string>> = {
  en: { free: "Free Tier", registered: "Registered Tier", paid: "Paid member", black: "Black" },
  ru: { free: "Бесплатный", registered: "Зарегистрирован", paid: "Участник", black: "Чёрный" },
  kk: { free: "Тегін", registered: "Тіркелген", paid: "Мүше", black: "Қара" },
  zh: { free: "免费会员", registered: "注册会员", paid: "付费会员", black: "黑卡" },
};

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
  cardNumber,
}) => {
  const { session } = useSession();
  const { t, i18n } = useTranslation();

  const lang = i18n.language || "en";
  const tierLabel = tierLabels[lang]?.[tier] || tierLabels["en"][tier] || tier;

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
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 2 }}>
          <SteppeTitle style={{ fontSize: 28 }}>{name}</SteppeTitle>
          <SteppeText style={{ fontSize: 14 }}>{tierLabel}</SteppeText>
        </View>
        <View style={{ flex: 1 }}>
          <SteppeText style={{ fontSize: 16, fontWeight: "bold" }}>
            {points.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} {t('loyalty.pts')}
          </SteppeText>
        </View>
      </View>

      {tier === LoyaltyTiers.free ? (
        <SteppeLink
          title={t('loyalty.becomeMember')}
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
