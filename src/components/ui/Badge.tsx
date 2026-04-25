import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type BadgeProps = {
  label: string;
  tone?: "green" | "gold" | "purple";
};

export function Badge({ label, tone = "green" }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  gold: { backgroundColor: colors.accent },
  green: { backgroundColor: colors.primary },
  label: { color: colors.textLight, fontSize: 12, fontWeight: "800" },
  purple: { backgroundColor: colors.territory },
});
