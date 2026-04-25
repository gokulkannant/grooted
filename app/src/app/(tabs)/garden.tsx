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
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { ScanIcon, GardenIcon } from "@/components/icons/TabIcons";
import { useGardenStore } from "@/stores/gardenStore";

// Demo plants for preview
const DEMO_PLANTS = [
  { id: "1", name: "Monstera", species: "Swiss Cheese Plant", health: 95, status: "Hydrated", color: colors.healthy },
  { id: "2", name: "Aloe Vera", species: "Succulent", health: 78, status: "Needs Water", color: colors.needsWater },
  { id: "3", name: "Tulsi", species: "Holy Basil", health: 88, status: "Healthy", color: colors.healthy },
  { id: "4", name: "Sunflower", species: "Helianthus", health: 62, status: "Wilting", color: colors.wilting },
];

function PlantSvg({ size = 40, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22V12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M12 12C12 8 8 5 4 5C4 9 8 12 12 12Z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        fill={`${color}15`}
      />
      <Path
        d="M12 10C12 6 16 3 20 3C20 7 16 10 12 10Z"
        stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        fill={`${color}10`}
      />
    </Svg>
  );
}

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
        <View style={styles.headerText}>
          <Text style={styles.title}>My Garden</Text>
          <Text style={styles.subtitle}>
            {hasPlants
              ? `${plants.length} plant${plants.length > 1 ? "s" : ""} growing`
              : "Your personal plant collection"}
          </Text>
        </View>
        <Link href="/plant/add" asChild>
          <Pressable style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}>
            <Text style={styles.addBtnText}>+ Add Plant</Text>
          </Pressable>
        </Link>
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <StatItem value={hasPlants ? plants.length : 0} label="Plants" />
        <View style={styles.statDivider} />
        <StatItem value={0} label="Healthy" />
        <View style={styles.statDivider} />
        <StatItem value={0} label="Need Care" />
      </View>

      {!hasPlants ? (
        <>
          {/* Empty state */}
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <GardenIcon size={40} color={colors.primary} strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>Start Your Garden</Text>
            <Text style={styles.emptyDesc}>
              Add your first plant by scanning it or entering details manually.
            </Text>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <Link href="/scan" asChild>
              <Pressable style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}>
                <View style={[styles.actionIconCircle, { backgroundColor: "rgba(188, 240, 174, 0.3)" }]}>
                  <ScanIcon size={22} color={colors.primary} strokeWidth={1.8} />
                </View>
                <View style={styles.actionTextWrap}>
                  <Text style={styles.actionTitle}>Scan Plant</Text>
                  <Text style={styles.actionDesc}>Use AI to identify</Text>
                </View>
                <Text style={styles.actionArrow}>›</Text>
              </Pressable>
            </Link>
            <Link href="/plant/add" asChild>
              <Pressable style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}>
                <View style={[styles.actionIconCircle, { backgroundColor: "rgba(255, 225, 109, 0.25)" }]}>
                  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                    <Path d="M12 5V19" stroke={colors.tertiary} strokeWidth={2} strokeLinecap="round" />
                    <Path d="M5 12H19" stroke={colors.tertiary} strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                </View>
                <View style={styles.actionTextWrap}>
                  <Text style={styles.actionTitle}>Add Manually</Text>
                  <Text style={styles.actionDesc}>Enter plant details</Text>
                </View>
                <Text style={styles.actionArrow}>›</Text>
              </Pressable>
            </Link>
          </View>

          {/* Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>What your garden could look like</Text>
            <View style={styles.plantGrid}>
              {DEMO_PLANTS.map((plant) => (
                <View key={plant.id} style={styles.plantCard}>
                  <View style={styles.plantImageBox}>
                    <PlantSvg size={48} color={plant.color} />
                  </View>
                  <View style={styles.plantInfo}>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusDot, { backgroundColor: plant.color }]} />
                      <Text style={styles.statusText}>{plant.status}</Text>
                    </View>
                    <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                    <Text style={styles.plantSpecies} numberOfLines={1}>{plant.species}</Text>
                    <View style={styles.healthBar}>
                      <View style={[styles.healthFill, { width: `${plant.health}%`, backgroundColor: plant.color }]} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.plantGrid}>
          {plants.map((plant) => (
            <Link key={plant.id} href={`/plant/${plant.id}`} asChild>
              <Pressable style={({ pressed }) => [styles.plantCard, pressed && { opacity: 0.9 }]}>
                <View style={styles.plantImageBox}>
                  <PlantSvg size={48} color={colors.primary} />
                </View>
                <View style={styles.plantInfo}>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.plantSpecies}>{plant.species.commonName}</Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

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
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  headerText: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    letterSpacing: -0.3,
  } as TextStyle,
  subtitle: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 14,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  } as TextStyle,
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  } as ViewStyle,
  addBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  } as ViewStyle,
  addBtnText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,

  // Stats
  statsBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  } as ViewStyle,
  statValue: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  statLabel: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.outlineVariant,
  } as ViewStyle,

  // Empty state
  emptyState: {
    alignItems: "center",
    gap: 10,
    paddingTop: spacing.lg,
  } as ViewStyle,
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(188, 240, 174, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  } as ViewStyle,
  emptyTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    letterSpacing: -0.3,
  } as TextStyle,
  emptyDesc: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 14,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  } as TextStyle,

  // Quick actions
  quickActions: {
    gap: 10,
    width: "100%",
  } as ViewStyle,
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  actionCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  actionTextWrap: {
    flex: 1,
    gap: 1,
  } as ViewStyle,
  actionTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  actionDesc: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  actionArrow: {
    fontSize: 22,
    color: colors.outline,
    fontWeight: typography.weights.regular,
  } as TextStyle,

  // Preview
  previewSection: {
    gap: 12,
  } as ViewStyle,
  previewLabel: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.outline,
    textTransform: "uppercase",
    letterSpacing: 1,
  } as TextStyle,

  // Plant grid
  plantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
  } as ViewStyle,
  plantCard: {
    width: "47.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  plantImageBox: {
    width: "100%",
    aspectRatio: 1.2,
    backgroundColor: "rgba(188, 240, 174, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
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
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  healthBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(188, 240, 174, 0.3)",
    overflow: "hidden",
    marginTop: 4,
  } as ViewStyle,
  healthFill: {
    height: "100%",
    borderRadius: 2,
  } as ViewStyle,
});
