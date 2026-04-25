import { Link } from "expo-router";
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>EARLY ACCESS</Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Text style={styles.plantEmoji}>🌱</Text>
        <Text style={styles.title}>GROOTED</Text>
        <Text style={styles.subtitle}>
          Turn real plant care into a local farming game.
        </Text>
      </View>

      {/* CTA */}
      <Link href="/login" asChild>
        <Button variant="accent">🌿  Start Growing</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.lg,
  } as ViewStyle,
  badge: {
    alignSelf: "center",
    backgroundColor: colors.tertiaryFixed,
    borderColor: colors.border,
    borderWidth: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    ...shadows.sm,
  } as ViewStyle,
  badgeText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onTertiaryContainer,
    textTransform: "uppercase",
    letterSpacing: 2,
  } as TextStyle,
  heroCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.lg,
  } as ViewStyle,
  plantEmoji: {
    fontSize: 80,
    marginBottom: spacing.xs,
  } as TextStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    letterSpacing: -2,
    textTransform: "uppercase",
  } as TextStyle,
  subtitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    maxWidth: 280,
  } as TextStyle,
});
