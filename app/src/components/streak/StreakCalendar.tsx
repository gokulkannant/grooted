import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type StreakCalendarProps = {
  activeDays: number;
};

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCalendar({ activeDays }: StreakCalendarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {DAY_LABELS.map((label, index) => {
          const isActive = index < activeDays;
          return (
            <View key={`${label}-${index}`} style={styles.dayColumn}>
              <Text style={styles.dayLabel}>{label}</Text>
              <View
                style={[
                  styles.day,
                  isActive && styles.active,
                ]}
              >
                {isActive && <Text style={styles.check}>✓</Text>}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  row: {
    flexDirection: "row",
    gap: 6,
  } as ViewStyle,
  dayColumn: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  } as ViewStyle,
  dayLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
  } as TextStyle,
  day: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  active: {
    backgroundColor: colors.primaryFixed,
  } as ViewStyle,
  check: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,
});
