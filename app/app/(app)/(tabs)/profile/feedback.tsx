import { SteppeTitle } from "@/src/components/SteppeTitle";
import { ProfileLayout } from "@/src/slices/profile/components/ProfileLayout";
import WebView from "react-native-webview";

export default function Feedback() {
  return (
    <ProfileLayout>
      <SteppeTitle>Feedback</SteppeTitle>

      <WebView
        style={{ flex: 1 }}
        source={{
          uri: "https://forms.office.com/Pages/ResponsePage.aspx?id=YeXVc1_wyUWKMaZm6-aetkK-vLsRNPRLvyIh1RyHlm5URVgzS0lNR0ZQR1laN0lBUFJLWVFJUExORi4u&embed=true",
        }}
      />
    </ProfileLayout>
  );
}
