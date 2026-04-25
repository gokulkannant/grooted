import { StyleSheet, View, type ViewStyle } from "react-native";
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
    backgroundColor: colors.primaryFixed,
    borderRadius: radius.full,
    height: "100%",
  } as ViewStyle,
  track: {
    backgroundColor: colors.surfaceVariant,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.full,
    height: 16,
    overflow: "hidden",
  } as ViewStyle,
});
