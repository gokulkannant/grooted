import {
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { SproutIcon } from "@/components/icons/GrootedIcons";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type StreakCounterProps = {
  count: number;
};

export function StreakCounter({ count }: StreakCounterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <SproutIcon size={24} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.label}>CURRENT STREAK</Text>
        <Text style={styles.count}>{count} Days</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.sm,
  } as ViewStyle,
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  textBlock: {
    flex: 1,
  } as ViewStyle,
  label: {
    fontFamily: `${typography.fonts.secondary}-Medium`,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  } as TextStyle,
  count: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
});
