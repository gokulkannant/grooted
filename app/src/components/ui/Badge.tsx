import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type BadgeTone = "green" | "gold" | "brown" | "outline";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneStyles: Record<BadgeTone, { bg: string; text: string; border: string }> = {
  green: { bg: colors.primaryFixed, text: colors.primary, border: colors.border },
  gold: { bg: colors.tertiaryFixed, text: colors.onTertiaryContainer, border: colors.border },
  brown: { bg: colors.secondaryContainer, text: colors.onSecondaryContainer, border: colors.border },
  outline: { bg: "transparent", text: colors.onSurface, border: colors.border },
};

export function Badge({ label, tone = "green" }: BadgeProps) {
  const t = toneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: t.bg, borderColor: t.border }]}>
      <Text style={[styles.label, { color: t.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 2,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    ...shadows.sm,
  } as ViewStyle,
  label: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  } as TextStyle,
});
