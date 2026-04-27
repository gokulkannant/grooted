import { Link } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import {
  DropletIcon,
  LeafIcon,
  SproutIcon,
} from "@/components/icons/GrootedIcons";
import { ScanIcon } from "@/components/icons/TabIcons";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { useGardenStore } from "@/stores/gardenStore";

// ── Care tips ───────────────────────────────────────────────────────

const CARE_TIPS = [
  { icon: "💧", title: "Watering", tip: "Most indoor plants prefer watering every 1–2 weeks. Let the top inch of soil dry out first." },
  { icon: "☀️", title: "Light", tip: "Rotate your plants a quarter turn each week for even, balanced growth." },
  { icon: "🌡️", title: "Temperature", tip: "Keep plants away from cold drafts, AC vents, and direct heater airflow." },
  { icon: "✂️", title: "Pruning", tip: "Remove yellow or dead leaves regularly to redirect energy to healthy growth." },
];

export default function GardenScreen() {
  const plants = useGardenStore((state) => state.plants);
  const hasPlants = plants.length > 0;

  const healthyCount = plants.filter((p) => p.health === "healthy").length;
  const needsCareCount = plants.filter(
    (p) => p.health !== "healthy" && p.health !== "unknown",
  ).length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <LeafIcon size={22} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>My Garden</Text>
          <Text style={styles.subtitle}>
            {hasPlants
              ? `${plants.length} plant${plants.length !== 1 ? "s" : ""} in your collection`
              : "Your personal plant collection"}
          </Text>
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <View style={[styles.statIconWrap, { backgroundColor: colors.primaryContainer }]}>
            <SproutIcon size={18} color={colors.primary} />
          </View>
          <Text style={styles.statValue}>{plants.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statIconWrap, { backgroundColor: "#E8F5E9" }]}>
            <LeafIcon size={18} color={colors.healthy} />
          </View>
          <Text style={styles.statValue}>{healthyCount}</Text>
          <Text style={styles.statLabel}>Healthy</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statIconWrap, { backgroundColor: "#E3F2FD" }]}>
            <DropletIcon size={18} color={colors.needsWater} />
          </View>
          <Text style={styles.statValue}>{needsCareCount}</Text>
          <Text style={styles.statLabel}>Need Care</Text>
        </View>
      </View>

      {/* Plant grid or empty state */}
      {hasPlants ? (
        <View style={styles.plantGrid}>
          {plants.map((plant) => {
            const statusColor = getStatusColor(plant.health);
            const statusLabel = getStatusLabel(plant.health);
            const daysOld = Math.max(
              1,
              Math.floor(
                (Date.now() - new Date(plant.plantedAt).getTime()) / 86400000,
              ),
            );

            return (
              <View key={plant.id} style={styles.plantCard}>
                {/* Image area */}
                <View
                  style={[
                    styles.plantImageBox,
                    !plant.imageUrl && { backgroundColor: `${statusColor}12` },
                  ]}
                >
                  {plant.imageUrl ? (
                    <Image
                      source={{ uri: plant.imageUrl }}
                      style={styles.plantPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <LeafIcon size={44} color={statusColor} />
                  )}
                  {/* Days badge */}
                  <View
                    style={[
                      styles.daysBadge,
                      {
                        backgroundColor: plant.imageUrl
                          ? "rgba(0,0,0,0.5)"
                          : `${statusColor}20`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.daysText,
                        { color: plant.imageUrl ? "#FFFFFF" : statusColor },
                      ]}
                    >
                      {daysOld}d
                    </Text>
                  </View>
                </View>

                {/* Info area */}
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName} numberOfLines={1}>
                    {plant.name}
                  </Text>
                  <Text style={styles.plantSpecies} numberOfLines={1}>
                    {plant.species.commonName}
                  </Text>
                  <View style={styles.statusRow}>
                    <View
                      style={[styles.statusDot, { backgroundColor: statusColor }]}
                    />
                    <Text style={[styles.statusLabel, { color: statusColor }]}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <>
          {/* Empty hero */}
          <View style={styles.emptyHero}>
            <View style={styles.emptyIconOuter}>
              <View style={styles.emptyIconInner}>
                <SproutIcon size={40} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Your garden awaits</Text>
            <Text style={styles.emptyDesc}>
              Scan a plant or add one manually to start{"\n"}tracking its health
              and growth.
            </Text>
            <View style={styles.ctaRow}>
              <Link href="/scan" asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.ctaPrimary,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <ScanIcon size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text style={styles.ctaPrimaryText}>Scan Plant</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </>
      )}

      {/* Care tips — always visible */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionLabel}>PLANT CARE TIPS</Text>
        {CARE_TIPS.map((item) => (
          <View key={item.title} style={styles.tipCard}>
            <View style={styles.tipIconWrap}>
              <Text style={styles.tipEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{item.title}</Text>
              <Text style={styles.tipText}>{item.tip}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function getStatusColor(health: string): string {
  switch (health) {
    case "healthy":
      return colors.healthy;
    case "needs_water":
      return colors.needsWater;
    case "wilting":
    case "needs_attention":
    case "at_risk":
      return colors.wilting;
    case "diseased":
    case "dead":
      return colors.dead;
    default:
      return colors.outline;
  }
}

function getStatusLabel(health: string): string {
  switch (health) {
    case "healthy":
      return "Healthy";
    case "needs_water":
      return "Needs Water";
    case "wilting":
      return "Wilting";
    case "needs_attention":
      return "Needs Attention";
    case "at_risk":
      return "At Risk";
    case "diseased":
      return "Diseased";
    case "dead":
      return "Dead";
    default:
      return "Unknown";
  }
}

// ── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  container: {
    padding: spacing.gutter,
    paddingBottom: 120,
    gap: spacing.lg,
  } as ViewStyle,

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  } as ViewStyle,
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  headerText: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 26,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  subtitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  } as TextStyle,

  // Stats
  statsBar: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    ...shadows.sm,
  } as ViewStyle,
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  } as ViewStyle,
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  } as ViewStyle,
  statValue: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 22,
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
    height: 40,
    backgroundColor: colors.border,
  } as ViewStyle,

  // Plant grid
  plantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  } as ViewStyle,
  plantCard: {
    width: "47.5%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadows.sm,
  } as ViewStyle,
  plantImageBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  } as ViewStyle,
  plantPhoto: {
    width: "100%",
    height: "100%",
  } as ImageStyle,
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
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  } as ViewStyle,
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  } as ViewStyle,
  statusLabel: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
  } as TextStyle,

  // Empty hero
  emptyHero: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  emptyIconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    marginTop: spacing.sm,
    width: "100%",
  } as ViewStyle,
  ctaPrimary: {
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
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,

  // Section label
  sectionLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 2,
  } as TextStyle,

  // Tips
  tipsSection: {
    gap: spacing.sm,
  } as ViewStyle,
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    ...shadows.sm,
  } as ViewStyle,
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  tipEmoji: {
    fontSize: 20,
  } as TextStyle,
  tipContent: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  tipTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  tipText: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 13,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
  } as TextStyle,
});
