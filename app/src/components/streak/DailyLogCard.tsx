import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import type { StreakLog } from "@/types/streak";
import { formatDate } from "@/utils/formatters";

type DailyLogCardProps = {
  log: StreakLog;
};

export function DailyLogCard({ log }: DailyLogCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>🌱</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(log.loggedAt)}</Text>
        <Text style={styles.note}>{log.note ?? "Plant care logged."}</Text>
      </View>
      <View style={styles.xpBadge}>
        <Text style={styles.xpText}>+10 XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.sm,
  } as ViewStyle,
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  icon: {
    fontSize: 20,
  } as TextStyle,
  content: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  date: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  note: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  xpBadge: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...shadows.sm,
  } as ViewStyle,
  xpText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,
});
