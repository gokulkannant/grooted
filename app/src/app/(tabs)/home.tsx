import { Link } from "expo-router";
import React, { type ReactNode, useEffect, useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import {
  CameraGlyphIcon,
  GrainIcon,
  LeafIcon,
  ScanGlyphIcon,
  SproutIcon,
} from "@/components/icons/GrootedIcons";
import { QuestBoard } from "@/components/quests/QuestBoard";
import { DailyLogCard } from "@/components/streak/DailyLogCard";
import { StreakCalendar } from "@/components/streak/StreakCalendar";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { useGardenStore } from "@/stores/gardenStore";
import { useQuestStore } from "@/stores/questStore";
import { useStreakStore } from "@/stores/streakStore";

export default function HomeScreen() {
  const { logs, stats } = useStreakStore();
  const gardenPlants = useGardenStore((state) => state.plants);
  const recentPlant = gardenPlants.length > 0 ? gardenPlants[0] : null;
  const {
    activeQuests,
    completedQuestIds,
    completeQuest,
    profile,
    refreshDailyQuests,
  } = useQuestStore();

  useEffect(() => {
    refreshDailyQuests();
  }, [refreshDailyQuests]);

  // Build verifiable tasks from real data
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLogs = logs.filter((l) => l.loggedAt.startsWith(todayKey));
  const todayScans = gardenPlants.filter((p) => p.plantedAt.startsWith(todayKey));

  const verifiableTasks = useMemo(() => {
    const hasLoggedToday = todayLogs.length > 0;
    const hasScannedToday = todayScans.length > 0;
    const hasPlants = gardenPlants.length > 0;
    const needsCare = gardenPlants.some((p) => p.health !== "healthy" && p.health !== "unknown");
    const completedQuests = completedQuestIds.length;

    const tasks: { title: string; subtitle: string; done: boolean; href: string }[] = [];

    // 1. Daily care log — verified by streak store
    tasks.push({
      title: "Log Daily Care",
      subtitle: hasLoggedToday ? `Logged ${todayLogs.length} time${todayLogs.length > 1 ? "s" : ""} today` : "Record your plant care activity",
      done: hasLoggedToday,
      href: "/streak/log",
    });

    // 2. Scan a plant — verified by scan API result
    tasks.push({
      title: "Scan a Plant",
      subtitle: hasScannedToday ? `${todayScans.length} scan${todayScans.length > 1 ? "s" : ""} today` : "AI health check on any plant",
      done: hasScannedToday,
      href: "/scan",
    });

    // 3. Complete a quest — verified by quest store
    tasks.push({
      title: "Complete a Quest",
      subtitle: completedQuests > 0 ? `${completedQuests}/${activeQuests.length} done` : "Finish any daily quest above",
      done: completedQuests > 0,
      href: "",
    });

    // 4. Conditional: if plants need care, show health check task
    if (needsCare) {
      const sickPlant = gardenPlants.find((p) => p.health !== "healthy" && p.health !== "unknown");
      tasks.push({
        title: "Health Check",
        subtitle: `${sickPlant?.name ?? "A plant"} needs attention — scan to update`,
        done: false,
        href: "/scan",
      });
    }

    // 5. If no plants yet, prompt to add one
    if (!hasPlants) {
      tasks.push({
        title: "Add Your First Plant",
        subtitle: "Scan or add manually to get started",
        done: false,
        href: "/plant/add",
      });
    }

    return tasks;
  }, [todayLogs, todayScans, gardenPlants, completedQuestIds, activeQuests]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>Hello, Planter!</Text>
        <Text style={styles.greetingSubtitle}>
          Let's see how your garden is growing today.
        </Text>
      </View>

      {/* Stat Cards */}
      <StatCard
        icon={<SproutIcon size={24} />}
        iconBg={colors.primaryContainer}
        label="CURRENT STREAK"
        value={`${stats.current} Days`}
      />
      <StatCard
        icon={<LeafIcon size={24} />}
        iconBg={colors.primaryContainer}
        label="FARM POINTS"
        value="0"
      />

      {/* Quick Scan Button */}
      <Link href="/scan" asChild>
        <Pressable style={styles.scanButton}>
          <ScanGlyphIcon color={colors.onPrimary} size={20} />
          <Text style={styles.scanText}>QUICK SCAN</Text>
        </Pressable>
      </Link>

      {/* Featured Plant Card */}
      {recentPlant ? (
        <Link href={`/plant/${recentPlant.id}`} asChild>
          <Pressable style={({ pressed }) => [styles.plantCard, pressed && { opacity: 0.9 }]}>
            <View style={styles.plantBadge}>
              <View style={[styles.plantBadgeDot, recentPlant.health === "needs_water" && { backgroundColor: colors.needsWater }, recentPlant.health === "wilting" && { backgroundColor: colors.wilting }]} />
              <Text style={styles.plantBadgeText}>
                {recentPlant.health === "healthy" ? "Healthy" : recentPlant.health === "needs_water" ? "Needs Water" : recentPlant.health.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </View>
            <View style={styles.plantImageBox}>
              {recentPlant.imageUrl ? (
                <Image source={{ uri: recentPlant.imageUrl }} style={styles.plantImage} resizeMode="cover" />
              ) : (
                <LeafIcon size={92} />
              )}
            </View>
            <Text style={styles.plantName}>{recentPlant.name}</Text>
            <Text style={styles.plantSpecies}>{recentPlant.species.commonName}</Text>
          </Pressable>
        </Link>
      ) : null
      /* No plants yet card — hidden until feature is ready */
      /* (
        <View style={styles.plantCard}>
          <View style={styles.plantImageBox}>
            <SproutIcon size={48} color={colors.onSurfaceVariant} />
          </View>
          <Text style={styles.plantName}>No plants yet</Text>
          <Text style={styles.plantSpecies}>Scan or add a plant to get started!</Text>
          <Link href="/plant/add" asChild>
            <Pressable style={styles.addPlantBtn}>
              <Text style={styles.addPlantBtnText}>+ Add Your First Plant</Text>
            </Pressable>
          </Link>
        </View>
      ) */}

      {/* Weekly Progress — hidden until feature is ready */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <StreakCalendar activeDays={Math.min(7, stats.current)} />
      </View> */}

      {/* Quick Actions — hidden until feature is ready */}
      {/* <View style={styles.actionsRow}>
        <Link href="/streak/log" asChild>
          <Button
            icon={<SproutIcon color={colors.onPrimary} size={20} />}
            variant="primary"
          >
            Log Daily Care
          </Button>
        </Link>
        <Link href="/scan" asChild>
          <Button icon={<CameraGlyphIcon size={20} />} variant="accent">
            Quick Scan
          </Button>
        </Link>
      </View> */}

      {/* Daily Quests — hidden until feature is ready */}
      {/* <View style={styles.section}>
        <QuestBoard
          quests={activeQuests}
          completedQuestIds={completedQuestIds}
          level={profile.level}
          plotClass={profile.plotClass}
          onComplete={completeQuest}
        />
      </View> */}

      {/* Today's Tasks — hidden until feature is ready */}
      {/* <Text style={styles.sectionTitle}>Today's Tasks</Text>
      <View style={styles.taskList}>
        {verifiableTasks.map((task, index) => (
          <React.Fragment key={task.title}>
            {index > 0 && <View style={styles.taskDivider} />}
            {task.href ? (
              <Link href={task.href as any} asChild>
                <Pressable style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
                  <TaskItem title={task.title} subtitle={task.subtitle} done={task.done} />
                </Pressable>
              </Link>
            ) : (
              <TaskItem title={task.title} subtitle={task.subtitle} done={task.done} />
            )}
          </React.Fragment>
        ))}
      </View> */}

      {/* Recent Activity — hidden until feature is ready */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {logs.length === 0 ? (
          <View style={styles.emptyCard}>
            <GrainIcon size={44} />
            <Text style={styles.emptyText}>
              Your plant care logs will appear here.
            </Text>
            <Text style={styles.emptyHint}>
              Start by logging your first daily care!
            </Text>
          </View>
        ) : (
          logs.map((log) => <DailyLogCard key={log.id} log={log} />)
        )}
      </View> */}
    </ScrollView>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

// ── Task Item ───────────────────────────────────────────────────────

function TaskItem({
  title,
  subtitle,
  done,
}: {
  title: string;
  subtitle: string;
  done: boolean;
}) {
  return (
    <View style={styles.taskItem}>
      <View style={[styles.taskCheckbox, done && styles.taskCheckboxDone]}>
        {done && <Text style={styles.taskCheck}>✓</Text>}
      </View>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, done && styles.taskTitleDone]}>
          {title}
        </Text>
        <Text style={styles.taskSubtitle}>{subtitle}</Text>
      </View>
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
    paddingBottom: 120,
    gap: spacing.md,
  } as ViewStyle,

  // Greeting
  greeting: {
    marginBottom: spacing.xs,
  } as ViewStyle,
  greetingTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 4,
  } as TextStyle,
  greetingSubtitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  } as TextStyle,

  // Stat Card
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.sm,
  } as ViewStyle,
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  statContent: {
    flex: 1,
  } as ViewStyle,
  statLabel: {
    fontFamily: `${typography.fonts.secondary}-Medium`,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  } as TextStyle,
  statValue: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,

  // Quick Scan
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  scanText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.onPrimary,
    letterSpacing: 1,
  } as TextStyle,

  // Plant Card
  plantCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  } as ViewStyle,
  plantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryContainer,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  } as ViewStyle,
  plantBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.healthy,
  } as ViewStyle,
  plantBadgeText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  } as TextStyle,
  plantImageBox: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    overflow: "hidden",
  } as ViewStyle,
  plantImage: {
    width: "100%",
    height: "100%",
  } as ViewStyle,
  plantName: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    marginBottom: 2,
  } as TextStyle,
  plantSpecies: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  } as TextStyle,
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  } as ViewStyle,
  healthLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  } as TextStyle,
  healthValue: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,
  healthTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
    overflow: "hidden",
  } as ViewStyle,
  healthFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.healthy,
  } as ViewStyle,
  addPlantBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  } as ViewStyle,
  addPlantBtnText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.onPrimary,
  } as TextStyle,

  // Section
  section: {
    gap: spacing.sm,
  } as ViewStyle,
  sectionTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    marginTop: spacing.xs,
  } as TextStyle,

  // Actions
  actionsRow: {
    gap: spacing.sm,
  } as ViewStyle,

  // Empty state
  emptyCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  emptyText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  } as TextStyle,
  emptyHint: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    color: colors.outline,
    textAlign: "center",
  } as TextStyle,

  // Tasks
  taskList: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  } as ViewStyle,
  taskDivider: {
    height: 1,
    backgroundColor: colors.border,
  } as ViewStyle,
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  } as ViewStyle,
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  taskCheckboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  } as ViewStyle,
  taskCheck: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: typography.weights.bold,
  } as TextStyle,
  taskContent: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  taskTitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurface,
  } as TextStyle,
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: colors.onSurfaceVariant,
  } as TextStyle,
  taskSubtitle: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 13,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
  } as TextStyle,
});
