import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <View style={styles.cardShadow} />
        <View style={styles.card}>
          <Text style={styles.title}>GROOTED</Text>
          <Text style={styles.copy}>
            Grow real plants, hold your streak, and claim your neighborhood.
          </Text>
        </View>
      </View>
      <Link href="/login" asChild>
        <Button>Start farming</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    gap: spacing.xl,
    justifyContent: "center",
    padding: spacing.lg,
  },
  cardWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },
  cardShadow: {
    position: "absolute",
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: colors.shadow,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  copy: {
    color: colors.text,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.lg,
    marginTop: spacing.md,
  },
  title: {
    color: colors.primaryDark,
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xxxl,
    letterSpacing: -1,
  },
});
