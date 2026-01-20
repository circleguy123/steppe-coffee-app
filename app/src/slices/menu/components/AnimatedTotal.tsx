import { SteppeText } from "@/src/components/SteppeText";
import { formatNumber } from "@/src/utils/formatNumber";
import React, { useEffect, useState } from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";

interface AnimatedTotalProps {
  total: number;
  style?: StyleProp<TextStyle>;
}

const AnimatedTotal: React.FC<AnimatedTotalProps> = ({ total, style }) => {
  const [displayedTotal, setDisplayedTotal] = useState(total);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (displayedTotal !== total) {
      const step = Math.abs(total - displayedTotal) / 2; // Divide the difference into 30 steps
      interval = setInterval(() => {
        setDisplayedTotal((prev) => {
          const newValue =
            total > prev
              ? Math.min(prev + step, total) // Incrementally increase
              : Math.max(prev - step, total); // Incrementally decrease

          if (newValue === total) {
            clearInterval(interval); // Stop interval when target is reached
          }
          return newValue;
        });
      }, 1); // Approx 60 frames per second
    }

    // Cleanup: clear interval on component unmount or total change
    return () => clearInterval(interval);
  }, [total, displayedTotal]);

  return (
    <SteppeText style={[styles.totalText, style]}>
      {formatNumber(displayedTotal)} ₸
    </SteppeText>
  );
};

const styles = StyleSheet.create({
  totalText: {
    fontSize: 18,
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 16,
  },
});

export default AnimatedTotal;
