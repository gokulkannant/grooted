import { Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { getQuestTitleForLevel } from "@/constants/quests";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import type { ActiveQuest, PlotClass } from "@/types/quest";

type QuestBoardProps = {
  quests: ActiveQuest[];
  completedQuestIds: string[];
  level: number;
  plotClass: PlotClass;
  onComplete: (instanceId: string) => void;
};

const plotClassLabels: Record<PlotClass, string> = {
  nano: "Nano-Gardener",
  micro: "Micro-Farmer",
  macro: "Macro-Lord",
};

const difficultyTone: Record<ActiveQuest["difficulty"], "green" | "gold" | "brown"> = {
  easy: "green",
  medium: "gold",
  hard: "brown",
};

export function QuestBoard({
  quests,
  completedQuestIds,
  level,
  plotClass,
  onComplete,
}: QuestBoardProps) {
  const completedCount = quests.filter((quest) =>
    completedQuestIds.includes(quest.instanceId),
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.kicker}>TODAY'S QUESTS</Text>
            <Text style={styles.title}>{getQuestTitleForLevel(level)} Board</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>LVL {level}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Balanced for {plotClassLabels[plotClass]}. Complete small farming actions to
          build skill, not just volume.
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${quests.length ? (completedCount / quests.length) * 100 : 0}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedCount}/{quests.length} quests complete
        </Text>
      </View>

      <View style={styles.questList}>
        {quests.map((quest) => {
          const isDone = completedQuestIds.includes(quest.instanceId);

          return (
            <View key={quest.instanceId} style={[styles.questCard, isDone && styles.questDone]}>
              <View style={styles.questHeader}>
                <Badge label={quest.difficulty} tone={difficultyTone[quest.difficulty]} />
                <Text style={styles.questType}>{quest.type}</Text>
              </View>
              <Text style={[styles.questTitle, isDone && styles.doneText]}>
                {quest.title}
              </Text>
              <Text style={styles.questDescription}>{quest.description}</Text>
              <View style={styles.rewardRow}>
                <Text style={styles.reward}>+{quest.rewardXp} XP</Text>
                <Text style={styles.reward}>+{quest.farmPoints} FP</Text>
                {quest.healthGate ? (
                  <Text style={styles.healthGate}>{quest.healthGate}+ health</Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                disabled={isDone}
                style={[styles.completeButton, isDone && styles.completeButtonDone]}
                onPress={() => onComplete(quest.instanceId)}
              >
                <Text style={styles.completeButtonText}>
                  {isDone ? "Completed" : "Mark complete"}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  } as ViewStyle,
  headerCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  headerTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  } as ViewStyle,
  kicker: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
    letterSpacing: 1,
  } as TextStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
  } as TextStyle,
  subtitle: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  } as TextStyle,
  levelPill: {
    backgroundColor: colors.tertiaryFixed,
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    ...shadows.sm,
  } as ViewStyle,
  levelText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onTertiaryContainer,
  } as TextStyle,
  progressBar: {
    height: 14,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: radius.full,
  } as ViewStyle,
  progressFill: {
    height: "100%",
    backgroundColor: colors.primaryFixed,
  } as ViewStyle,
  progressText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  questList: {
    gap: spacing.sm,
  } as ViewStyle,
  questCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  questDone: {
    opacity: 0.72,
    backgroundColor: colors.surfaceVariant,
  } as ViewStyle,
  questHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  } as ViewStyle,
  questType: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  } as TextStyle,
  questTitle: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
  } as TextStyle,
  doneText: {
    textDecorationLine: "line-through",
  } as TextStyle,
  questDescription: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  } as TextStyle,
  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  } as ViewStyle,
  reward: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.sm,
    color: colors.primary,
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    overflow: "hidden",
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  } as TextStyle,
  healthGate: {
    backgroundColor: colors.errorContainer,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: radius.sm,
    color: colors.error,
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    overflow: "hidden",
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
  } as TextStyle,
  completeButton: {
    alignItems: "center",
    backgroundColor: colors.onSurface,
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: radius.sm,
    justifyContent: "center",
    minHeight: 42,
  } as ViewStyle,
  completeButtonDone: {
    backgroundColor: colors.primary,
  } as ViewStyle,
  completeButtonText: {
    color: colors.onPrimary,
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 1,
  } as TextStyle,
});
