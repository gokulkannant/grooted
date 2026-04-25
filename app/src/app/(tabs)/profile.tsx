import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Avatar } from "@/components/ui/Avatar";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { useAuthStore } from "@/stores/authStore";
import { useStreakStore } from "@/stores/streakStore";

// ── Demo data ───────────────────────────────────────────────────────

const NEIGHBORS = [
  { rank: 1, name: "GreenThumb_39", title: "Master Harvester", points: 3050, medal: "🥇" },
  { rank: 2, name: "CitySprout", title: "Balcony Botanist", points: 2890, medal: "🥈" },
  { rank: 3, name: "UrbanOak", title: "Seed Saver", points: 1500, medal: "🥉" },
];

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const stats = useStreakStore((state) => state.stats);
  const name = user?.displayName ?? "Urban Farmer";
  const userPoints = 1240;
  const userRank = 4;
  const streakDays = stats.current || 5;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Local Legends</Text>
        <Text style={styles.heroSubtitle}>
          See how your garden grows compared{"\n"}to neighbors.
        </Text>
      </View>

      {/* Your Rank */}
      <Text style={styles.sectionLabel}>YOUR RANK</Text>
      <View style={styles.yourRankCard}>
        <View style={styles.yourRankTop}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeText}>#{userRank}</Text>
          </View>
          <Avatar name={name} size={44} uri={user?.avatarUrl} />
          <View style={styles.yourRankInfo}>
            <View style={styles.yourRankNameRow}>
              <Text style={styles.yourRankName}>{name}</Text>
              <View style={styles.streakPill}>
                <Text style={styles.streakPillIcon}>🔒</Text>
                <Text style={styles.streakPillText}>
                  {streakDays} DAY{"\n"}STREAK
                </Text>
              </View>
            </View>
            <Text style={styles.yourRankPoints}>
              🌿 {userPoints.toLocaleString()} points
            </Text>
          </View>
        </View>
        <View style={styles.nextTier}>
          <View style={styles.nextTierRow}>
            <Text style={styles.nextTierLabel}>Next Tier</Text>
            <Text style={styles.nextTierGap}>260 to Top 3</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "70%" }]} />
          </View>
        </View>
      </View>

      {/* Top Neighbors */}
      <Text style={styles.sectionLabel}>TOP NEIGHBORS</Text>
      <View style={styles.neighborsList}>
        {NEIGHBORS.map((neighbor) => (
          <View key={neighbor.rank} style={styles.neighborCard}>
            <Text style={styles.neighborRank}>#{neighbor.rank}</Text>
            <Avatar name={neighbor.name} size={40} />
            <View style={styles.neighborInfo}>
              <Text style={styles.neighborName}>{neighbor.name}</Text>
              <Text style={styles.neighborTitle}>{neighbor.title}</Text>
            </View>
            <View style={styles.neighborRight}>
              <Text style={styles.neighborPoints}>
                {neighbor.points.toLocaleString()}
              </Text>
              <Text style={styles.neighborPtsLabel}>pts</Text>
            </View>
            <Text style={styles.neighborMedal}>{neighbor.medal}</Text>
          </View>
        ))}
      </View>

      {/* Harvest CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.harvestButton,
          pressed && { opacity: 0.9 },
        ]}
      >
        <Text style={styles.harvestIcon}>🌾</Text>
        <Text style={styles.harvestText}>LOG HARVEST TO GAIN POINTS</Text>
      </Pressable>

      {/* Quick links */}
      <View style={styles.linksRow}>
        <Link href="/settings" asChild>
          <Pressable style={styles.linkItem}>
            <Text style={styles.linkIcon}>⚙️</Text>
            <Text style={styles.linkText}>Settings</Text>
          </Pressable>
        </Link>
        <View style={styles.linkDivider} />
        <Pressable style={styles.linkItem}>
          <Text style={styles.linkIcon}>📊</Text>
          <Text style={styles.linkText}>My Stats</Text>
        </Pressable>
        <View style={styles.linkDivider} />
        <Pressable style={styles.linkItem}>
          <Text style={styles.linkIcon}>🏅</Text>
          <Text style={styles.linkText}>Badges</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  container: {
    padding: spacing.gutter,
    paddingBottom: 80,
    gap: spacing.md,
  } as ViewStyle,

  // Hero
  hero: {
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  } as ViewStyle,
  heroTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 30,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    marginBottom: 6,
  } as TextStyle,
  heroSubtitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 22,
  } as TextStyle,

  // Section label
  sectionLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: spacing.sm,
  } as TextStyle,

  // Your Rank
  yourRankCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primaryContainer,
    gap: spacing.md,
    ...shadows.md,
  } as ViewStyle,
  yourRankTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  } as ViewStyle,
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  rankBadgeText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
  yourRankInfo: {
    flex: 1,
  } as ViewStyle,
  yourRankNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  } as ViewStyle,
  yourRankName: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,
  streakPillIcon: {
    fontSize: 11,
  } as TextStyle,
  streakPillText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    lineHeight: 11,
  } as TextStyle,
  yourRankPoints: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 14,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  } as TextStyle,
  nextTier: {
    gap: 6,
  } as ViewStyle,
  nextTierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  nextTierLabel: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  nextTierGap: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
    overflow: "hidden",
  } as ViewStyle,
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.primary,
  } as ViewStyle,

  // Neighbors
  neighborsList: {
    gap: spacing.sm,
  } as ViewStyle,
  neighborCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.sm,
  } as ViewStyle,
  neighborRank: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    width: 30,
  } as TextStyle,
  neighborInfo: {
    flex: 1,
    gap: 1,
  } as ViewStyle,
  neighborName: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  neighborTitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  neighborRight: {
    alignItems: "flex-end",
  } as ViewStyle,
  neighborPoints: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  neighborPtsLabel: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  neighborMedal: {
    fontSize: 22,
    marginLeft: 4,
  } as TextStyle,

  // Harvest CTA
  harvestButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
    ...shadows.md,
  } as ViewStyle,
  harvestIcon: {
    fontSize: 18,
  } as TextStyle,
  harvestText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
    letterSpacing: 1,
  } as TextStyle,

  // Quick links
  linksRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.sm,
  } as ViewStyle,
  linkItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: 4,
  } as ViewStyle,
  linkIcon: {
    fontSize: 20,
  } as TextStyle,
  linkText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  linkDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  } as ViewStyle,
});
