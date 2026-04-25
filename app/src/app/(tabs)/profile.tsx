import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { useAuthStore } from "@/stores/authStore";
import { useStreakStore } from "@/stores/streakStore";

export default function ProfileScreen() {
  const { clearAuth, user } = useAuthStore();
  const stats = useStreakStore((state) => state.stats);
  const name = user?.displayName ?? "Urban Farmer";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Avatar name={name} size={80} uri={user?.avatarUrl} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.streakText}>🔥 {stats.longest} day best streak</Text>
        <Badge label="Seed Scout" tone="gold" />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🌱</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>PLANTS</Text>
        </View>
        <View style={[styles.statCard, styles.statCardGold]}>
          <Text style={styles.statEmoji}>⭐</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>FARM PTS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🗺️</Text>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>ZONES</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Link href="/leaderboard" asChild>
          <Button variant="secondary">🏆  Season Leaderboard</Button>
        </Link>
        <Link href="/settings" asChild>
          <Button variant="accent">⚙️  Settings</Button>
        </Link>
      </View>

      {/* Log out */}
      <Button onPress={clearAuth} variant="ghost">
        Log out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  } as ViewStyle,

  // Profile Card
  profileCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.lg,
  } as ViewStyle,
  name: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
  } as TextStyle,
  streakText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  } as ViewStyle,
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
    gap: 4,
    ...shadows.md,
  } as ViewStyle,
  statCardGold: {
    backgroundColor: colors.tertiaryFixed,
  } as ViewStyle,
  statEmoji: {
    fontSize: 24,
  } as TextStyle,
  statValue: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
  } as TextStyle,
  statLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
  } as TextStyle,

  // Actions
  actions: {
    gap: spacing.sm,
  } as ViewStyle,
});
