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
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { ScanIcon, GardenIcon } from "@/components/icons/TabIcons";
import { useGardenStore } from "@/stores/gardenStore";

// ── Demo data ───────────────────────────────────────────────────────

const DEMO_PLANTS = [
  { id: "1", emoji: "🪴", name: "Monstera", species: "Swiss Cheese Plant", health: 95, status: "Hydrated", color: colors.healthy, daysOld: 45 },
  { id: "2", emoji: "🌵", name: "Aloe Vera", species: "Succulent", health: 78, status: "Needs Water", color: colors.needsWater, daysOld: 30 },
  { id: "3", emoji: "🌿", name: "Tulsi", species: "Holy Basil", health: 88, status: "Healthy", color: colors.healthy, daysOld: 22 },
  { id: "4", emoji: "🌻", name: "Sunflower", species: "Helianthus", health: 62, status: "Wilting", color: colors.wilting, daysOld: 15 },
];

const CARE_TIPS = [
  { emoji: "💧", tip: "Most indoor plants need watering every 1-2 weeks" },
  { emoji: "☀️", tip: "Rotate plants quarterly for even growth" },
  { emoji: "🌡️", tip: "Keep plants away from cold drafts and heaters" },
];

export default function GardenScreen() {
  const plants = useGardenStore((state) => state.plants);
  const hasPlants = plants.length > 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Garden</Text>
          <Text style={styles.subtitle}>
            {hasPlants
              ? `${plants.length} plant${plants.length > 1 ? "s" : ""} growing`
              : "Your personal plant collection"}
          </Text>
        </View>
        <Link href="/plant/add" asChild>
          <Pressable style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}>
            <Text style={styles.addBtnPlus}>+</Text>
          </Pressable>
        </Link>
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <StatItem value={hasPlants ? plants.length : 0} label="Total" emoji="🌱" />
        <View style={styles.statDivider} />
        <StatItem value={hasPlants ? plants.filter((p) => p.health === "healthy").length : 0} label="Healthy" emoji="💚" />
        <View style={styles.statDivider} />
        <StatItem value={hasPlants ? plants.filter((p) => p.health !== "healthy" && p.health !== "unknown").length : 0} label="Need Care" emoji="💧" />
      </View>

      {!hasPlants ? (
        <>
          {/* Hero empty state */}
          <View style={styles.emptyHero}>
            <View style={styles.emptyIconOuter}>
              <View style={styles.emptyIconInner}>
                <Text style={styles.emptyIconEmoji}>🌱</Text>
              </View>
            </View>
            <Text style={styles.emptyTitle}>Your garden awaits</Text>
            <Text style={styles.emptyDesc}>
              Scan a plant or add one manually to start tracking its health and growth.
            </Text>

            {/* CTA buttons */}
            <View style={styles.ctaRow}>
              <Link href="/scan" asChild>
                <Pressable style={({ pressed }) => [styles.ctaPrimary, pressed && { opacity: 0.85 }]}>
                  <ScanIcon size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.ctaPrimaryText}>Scan Plant</Text>
                </Pressable>
              </Link>
              <Link href="/plant/add" asChild>
                <Pressable style={({ pressed }) => [styles.ctaSecondary, pressed && { opacity: 0.85 }]}>
                  <Text style={styles.ctaSecondaryText}>+ Add Manually</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {/* Care tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.sectionLabel}>🌿 PLANT CARE TIPS</Text>
            {CARE_TIPS.map((item) => (
              <View key={item.tip} style={styles.tipCard}>
                <Text style={styles.tipEmoji}>{item.emoji}</Text>
                <Text style={styles.tipText}>{item.tip}</Text>
              </View>
            ))}
          </View>

          {/* Preview grid */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionLabel}>✨ GARDEN PREVIEW</Text>
            <Text style={styles.previewDesc}>
              Here's what your garden will look like once you add plants
            </Text>
            <View style={styles.plantGrid}>
              {DEMO_PLANTS.map((plant) => (
                <View key={plant.id} style={styles.plantCard}>
                  <View style={[styles.plantImageBox, { backgroundColor: `${plant.color}15` }]}>
                    <Text style={styles.plantEmoji}>{plant.emoji}</Text>
                    <View style={[styles.daysBadge, { backgroundColor: `${plant.color}20` }]}>
                      <Text style={[styles.daysText, { color: plant.color }]}>{plant.daysOld}d</Text>
                    </View>
                  </View>
                  <View style={styles.plantInfo}>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: plant.color }]} />
                      <Text style={styles.statusText}>{plant.status}</Text>
                    </View>
                    <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                    <Text style={styles.plantSpecies} numberOfLines={1}>{plant.species}</Text>
                    <View style={styles.healthRow}>
                      <View style={styles.healthBar}>
                        <View style={[styles.healthFill, { width: `${plant.health}%`, backgroundColor: plant.color }]} />
                      </View>
                      <Text style={[styles.healthPct, { color: plant.color }]}>{plant.health}%</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.plantGrid}>
          {plants.map((plant) => {
            const statusColor =
              plant.health === "healthy" ? colors.healthy
              : plant.health === "needs_water" ? colors.needsWater
              : plant.health === "wilting" ? colors.wilting
              : plant.health === "dead" ? colors.dead
              : colors.healthy;
            const statusLabel =
              plant.health === "healthy" ? "Healthy"
              : plant.health === "needs_water" ? "Needs Water"
              : plant.health === "wilting" ? "Wilting"
              : plant.health === "dead" ? "Dead"
              : plant.health === "needs_attention" ? "Needs Attention"
              : plant.health === "at_risk" ? "At Risk"
              : plant.health === "diseased" ? "Diseased"
              : "Unknown";
            const daysOld = Math.max(1, Math.floor((Date.now() - new Date(plant.plantedAt).getTime()) / 86400000));

            return (
              <Link key={plant.id} href={`/plant/${plant.id}`} asChild>
                <Pressable style={({ pressed }) => [styles.plantCard, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
                  <View style={[styles.plantImageBox, { backgroundColor: `${statusColor}12` }]}>
                    <Text style={styles.plantEmoji}>🌿</Text>
                    <View style={[styles.daysBadge, { backgroundColor: `${statusColor}20` }]}>
                      <Text style={[styles.daysText, { color: statusColor }]}>{daysOld}d</Text>
                    </View>
                  </View>
                  <View style={styles.plantInfo}>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                      <Text style={styles.statusText}>{statusLabel}</Text>
                    </View>
                    <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                    <Text style={styles.plantSpecies} numberOfLines={1}>{plant.species.commonName}</Text>
                  </View>
                </Pressable>
              </Link>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ── Stat Item ───────────────────────────────────────────────────────

function StatItem({ value, label, emoji }: { value: number; label: string; emoji: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  container: {
    padding: spacing.gutter,
    paddingBottom: 100,
    gap: spacing.lg,
  } as ViewStyle,

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 26,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  subtitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 14,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  } as TextStyle,
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  } as ViewStyle,
  addBtnPlus: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
    marginTop: -1,
  } as TextStyle,

  // Stats
  statsBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    ...shadows.sm,
  } as ViewStyle,
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  } as ViewStyle,
  statEmoji: {
    fontSize: 18,
    marginBottom: 2,
  } as TextStyle,
  statValue: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  statLabel: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  } as ViewStyle,

  // Empty hero
  emptyHero: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  emptyIconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  } as ViewStyle,
  emptyIconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.primary}18`,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  emptyIconEmoji: {
    fontSize: 36,
  } as TextStyle,
  emptyTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  emptyDesc: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 14,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
  } as TextStyle,
  ctaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
    width: "100%",
  } as ViewStyle,
  ctaPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.md,
  } as ViewStyle,
  ctaPrimaryText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
  ctaSecondary: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  ctaSecondaryText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,

  // Section label
  sectionLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  } as TextStyle,

  // Tips
  tipsSection: {
    gap: spacing.sm,
  } as ViewStyle,
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.sm,
  } as ViewStyle,
  tipEmoji: {
    fontSize: 20,
  } as TextStyle,
  tipText: {
    flex: 1,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 14,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  } as TextStyle,

  // Preview
  previewSection: {
    gap: spacing.sm,
  } as ViewStyle,
  previewDesc: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: colors.outline,
    marginBottom: spacing.xs,
  } as TextStyle,

  // Plant grid
  plantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  } as ViewStyle,
  plantCard: {
    width: "47.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadows.sm,
  } as ViewStyle,
  plantImageBox: {
    width: "100%",
    aspectRatio: 1.1,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  } as ViewStyle,
  plantEmoji: {
    fontSize: 48,
  } as TextStyle,
  daysBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  } as ViewStyle,
  daysText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  } as TextStyle,
  plantInfo: {
    padding: 12,
    gap: 3,
  } as ViewStyle,
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  } as ViewStyle,
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  } as ViewStyle,
  statusText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  plantName: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  plantSpecies: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  } as ViewStyle,
  healthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: `${colors.primary}15`,
    overflow: "hidden",
  } as ViewStyle,
  healthFill: {
    height: "100%",
    borderRadius: 2,
  } as ViewStyle,
  healthPct: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
  } as TextStyle,
});
