import { StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius } from "@/constants/layout";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: "100%",
  },
  track: {
    backgroundColor: "rgba(232,245,233,0.12)",
    borderRadius: radius.full,
    height: 8,
    overflow: "hidden",
  },
});
