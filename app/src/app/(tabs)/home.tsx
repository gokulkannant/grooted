import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { DailyLogCard } from "@/components/streak/DailyLogCard";
import { StreakCalendar } from "@/components/streak/StreakCalendar";
import { StreakCounter } from "@/components/streak/StreakCounter";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { useStreakStore } from "@/stores/streakStore";

export default function HomeScreen() {
  const { logs, stats } = useStreakStore();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Card */}
      <View style={styles.greetingCard}>
        <Text style={styles.greetingTitle}>Hello, Planter!</Text>
        <Text style={styles.greetingSubtitle}>Ready to grow today?</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StreakCounter count={stats.current} />
        <View style={styles.pointsCard}>
          <Text style={styles.pointsEmoji}>🌿</Text>
          <View style={styles.pointsTextBlock}>
            <Text style={styles.pointsLabel}>FARM POINTS</Text>
            <Text style={styles.pointsCount}>0</Text>
          </View>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <StreakCalendar activeDays={Math.min(7, stats.current)} />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <Link href="/streak/log" asChild>
          <Button variant="primary">🌱  Log Daily Care</Button>
        </Link>
        <Link href="/scan" asChild>
          <Button variant="accent">📷  Quick Scan</Button>
        </Link>
      </View>

      {/* Daily Tasks */}
      <View style={styles.section}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskHeaderText}>📋  DAILY TASKS</Text>
        </View>
        <View style={styles.taskList}>
          <TaskItem label="Water Plant" xp={10} done={false} />
          <TaskItem label="Scan Area" xp={25} done={false} />
          <TaskItem label="Rotate Pot" xp={5} done={false} />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {logs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🌾</Text>
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
      </View>
    </ScrollView>
  );
}

// ── Task Item ───────────────────────────────────────────────────────

function TaskItem({ label, xp, done }: { label: string; xp: number; done: boolean }) {
  return (
    <View style={[styles.taskItem, done && styles.taskItemDone]}>
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.taskLabel, done && styles.taskLabelDone]}>{label}</Text>
      <View style={styles.xpBadge}>
        <Text style={styles.xpText}>+{xp} XP</Text>
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
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  } as ViewStyle,

  // Greeting
  greetingCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.md,
  } as ViewStyle,
  greetingTitle: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
    marginBottom: 4,
  } as TextStyle,
  greetingSubtitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,

  // Stats Row
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  } as ViewStyle,
  pointsCard: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  pointsEmoji: {
    fontSize: 32,
  } as TextStyle,
  pointsTextBlock: {
    flex: 1,
  } as ViewStyle,
  pointsLabel: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onPrimaryContainer,
    textTransform: "uppercase",
    opacity: 0.8,
    marginBottom: 2,
  } as TextStyle,
  pointsCount: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.onPrimaryContainer,
  } as TextStyle,

  // Sections
  section: {
    gap: spacing.sm,
  } as ViewStyle,
  sectionTitle: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as TextStyle,

  // Actions
  actionsRow: {
    gap: spacing.sm,
  } as ViewStyle,

  // Tasks
  taskHeader: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginBottom: -4,
  } as ViewStyle,
  taskHeaderText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.onSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as TextStyle,
  taskList: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: spacing.sm,
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    ...shadows.sm,
  } as ViewStyle,
  taskItemDone: {
    opacity: 0.6,
    backgroundColor: colors.surfaceVariant,
  } as ViewStyle,
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: colors.border,
    borderRadius: 2,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  checkboxDone: {
    backgroundColor: colors.primary,
  } as ViewStyle,
  checkmark: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: typography.weights.bold,
  } as TextStyle,
  taskLabel: {
    flex: 1,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.onSurface,
  } as TextStyle,
  taskLabelDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  } as TextStyle,
  xpBadge: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...shadows.sm,
  } as ViewStyle,
  xpText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,

  // Empty state
  emptyCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
    ...shadows.md,
  } as ViewStyle,
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.xs,
  } as TextStyle,
  emptyText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    textAlign: "center",
  } as TextStyle,
  emptyHint: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  } as TextStyle,
});
