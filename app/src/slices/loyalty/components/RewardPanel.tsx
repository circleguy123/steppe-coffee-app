import { SteppeButton } from "@/src/components/SteppeButton";
import { SteppeText } from "@/src/components/SteppeText";
import { router } from "expo-router";
import { Image, StyleSheet, View, Text } from "react-native";

export const RewardPanel = () => {
  return (
    <View style={styles.container}>
      <View style={styles.noRewardContainer}>
        <Image
          source={require("@/assets/images/steppe-saigak-no-rewards.png")}
        />
        <SteppeText style={styles.noRewardTitle}>
          No rewards for{"\n"}you...{" "}
          <SteppeText style={{ fontWeight: 700 }}>just YET!</SteppeText>
        </SteppeText>
      </View>
      <SteppeText style={styles.noRewardDescription}>
        Join our membership program, starting with a free tier that unlocks
        instant perks. Level up your membership to enjoy exclusive rewards,
        special offers, and more with each tier!
      </SteppeText>

      <SteppeButton
        title="Join now"
        buttonStyle={styles.button}
        onPress={() => {
          // router.replace("/register");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 24,
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 16,
    shadowOffset: {
      height: -10,
      width: 0,
    },
    shadowColor: "black",
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  noRewardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 16,
    alignItems: "center",
  },
  noRewardTitle: {
    fontSize: 32,
  },
  noRewardDescription: {
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
    width: "100%",
    paddingVertical: 24,
  },
});
