import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type AddCardParams = {
  invoiceId: string;
  token: string;
};

export default function Modal() {
  const params = useLocalSearchParams<AddCardParams>();
  console.log(
    `https://api.steppecoffee.kz/pay/save-card?invoiceId=${params.invoiceId}&token=${params.token}`
  );
  return (
    <WebView
      style={styles.container}
      originWhitelist={["*"]}
      source={{
        uri: `https://api.steppecoffee.kz/pay/save-card?invoiceId=${params.invoiceId}&token=${params.token}`,
      }}
      onLoad={({ nativeEvent }) => {
        console.log(nativeEvent);
        if (
          nativeEvent.url.includes(
            "https://api.steppecoffee.kz/pay/save-card/completed"
          )
        ) {
          router.back();
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
