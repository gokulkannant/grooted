import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type StreakCounterProps = {
  count: number;
};

export function StreakCounter({ count }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔥</Text>
      <View style={styles.textBlock}>
        <Text style={styles.label}>STREAK</Text>
        <Text style={styles.count}>Day {count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tertiaryContainer,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  emoji: {
    fontSize: 32,
  } as TextStyle,
  textBlock: {
    flex: 1,
  } as ViewStyle,
  label: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onTertiaryContainer,
    textTransform: "uppercase",
    opacity: 0.8,
    marginBottom: 2,
  } as TextStyle,
  count: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.onTertiaryContainer,
  } as TextStyle,
});
