import { Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getQuestTitleForLevel } from "@/constants/quests";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
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

const difficultyColors: Record<ActiveQuest["difficulty"], { bg: string; text: string }> = {
  easy: { bg: "rgba(188, 240, 174, 0.4)", text: colors.primary },
  medium: { bg: "rgba(255, 225, 109, 0.3)", text: colors.tertiary },
  hard: { bg: "rgba(255, 218, 214, 0.4)", text: colors.error },
};

function CheckIcon({ size = 16, color = "#FFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12L10 17L19 7" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function QuestBoard({
  quests,
  completedQuestIds,
  level,
  plotClass,
  onComplete,
}: QuestBoardProps) {
  const completedCount = quests.filter((q) =>
    completedQuestIds.includes(q.instanceId),
  ).length;
  const progress = quests.length ? (completedCount / quests.length) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>Daily Quests</Text>
            <Text style={styles.title}>{getQuestTitleForLevel(level)} Board</Text>
          </View>
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>Lvl {level}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Balanced for {plotClassLabels[plotClass]}. Small actions, real growth.
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>
            {completedCount}/{quests.length}
          </Text>
        </View>
      </View>

      {/* Quest Cards */}
      {quests.map((quest) => {
        const isDone = completedQuestIds.includes(quest.instanceId);
        const diff = difficultyColors[quest.difficulty];

        return (
          <View key={quest.instanceId} style={[styles.card, isDone && styles.cardDone]}>
            {/* Top row: difficulty + type */}
            <View style={styles.cardTop}>
              <View style={[styles.diffBadge, { backgroundColor: diff.bg }]}>
                <Text style={[styles.diffText, { color: diff.text }]}>
                  {quest.difficulty}
                </Text>
              </View>
              <Text style={styles.questType}>{quest.type}</Text>
            </View>

            {/* Title + description */}
            <Text style={[styles.questTitle, isDone && styles.strikethrough]}>
              {quest.title}
            </Text>
            <Text style={styles.questDesc}>{quest.description}</Text>

            {/* Rewards + button */}
            <View style={styles.cardBottom}>
              <View style={styles.rewards}>
                <View style={styles.rewardChip}>
                  <Text style={styles.rewardText}>+{quest.rewardXp} XP</Text>
                </View>
                <View style={styles.rewardChip}>
                  <Text style={styles.rewardText}>+{quest.farmPoints} FP</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                disabled={isDone}
                style={({ pressed }) => [
                  styles.completeBtn,
                  isDone && styles.completeBtnDone,
                  pressed && !isDone && styles.completeBtnPressed,
                ]}
                onPress={() => onComplete(quest.instanceId)}
              >
                {isDone ? (
                  <CheckIcon size={18} color="#FFF" />
                ) : (
                  <Text style={styles.completeBtnText}>Complete</Text>
                )}
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  } as ViewStyle,

  // Header
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  } as ViewStyle,
  headerText: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  kicker: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  } as TextStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 20,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    letterSpacing: -0.3,
  } as TextStyle,
  subtitle: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 13,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  } as TextStyle,
  levelPill: {
    backgroundColor: "rgba(255, 225, 109, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  } as ViewStyle,
  levelText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: colors.tertiary,
  } as TextStyle,
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  } as ViewStyle,
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(188, 240, 174, 0.3)",
    overflow: "hidden",
  } as ViewStyle,
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.primary,
  } as ViewStyle,
  progressLabel: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,

  // Quest Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 8,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  } as ViewStyle,
  cardDone: {
    opacity: 0.6,
  } as ViewStyle,
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  diffBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  } as ViewStyle,
  diffText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as TextStyle,
  questType: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as TextStyle,
  questTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 17,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    letterSpacing: -0.2,
  } as TextStyle,
  strikethrough: {
    textDecorationLine: "line-through",
    color: colors.onSurfaceVariant,
  } as TextStyle,
  questDesc: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 14,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  } as TextStyle,

  // Bottom row
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  } as ViewStyle,
  rewards: {
    flexDirection: "row",
    gap: 6,
  } as ViewStyle,
  rewardChip: {
    backgroundColor: "rgba(188, 240, 174, 0.3)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  } as ViewStyle,
  rewardText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,
  completeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  } as ViewStyle,
  completeBtnDone: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  completeBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  } as ViewStyle,
  completeBtnText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
});
