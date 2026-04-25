import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import type { ScanResult as ScanResultType } from "@/types/plant";

type ScanResultProps = {
  result: ScanResultType;
};

export function ScanResult({ result }: ScanResultProps) {
  const healthLabel = result.health.replace(/_/g, " ");
  const diseaseConfidence = result.disease
    ? `${Math.round(result.disease.confidence * 100)}% confidence`
    : undefined;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{result.species.commonName}</Text>
      {result.species.scientificName ? (
        <Text style={styles.scientific}>{result.species.scientificName}</Text>
      ) : null}
      <View style={styles.scoreBlock}>
        <Text style={styles.label}>Plant match: {Math.round(result.confidence * 100)}%</Text>
        <Text style={styles.status}>
          {healthLabel} - Health score {result.healthScore}/100
        </Text>
        <ProgressBar value={result.healthScore} />
      </View>
      {result.disease ? (
        <View style={styles.issue}>
          <Text style={styles.issueTitle}>{result.disease.name}</Text>
          {diseaseConfidence ? <Text style={styles.item}>{diseaseConfidence}</Text> : null}
          {result.disease.description ? (
            <Text style={styles.item}>{result.disease.description}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.list}>
        {result.recommendations.map((rec) => (
          <View key={rec} style={styles.recRow}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.item}>{rec}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  bullet: {
    color: colors.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  } as TextStyle,
  card: {
    gap: spacing.md,
  } as ViewStyle,
  issue: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: spacing.xs,
    padding: spacing.md,
  } as ViewStyle,
  issueTitle: {
    color: colors.onSurface,
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
  } as TextStyle,
  item: {
    color: colors.onSurfaceVariant,
    flex: 1,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  } as TextStyle,
  label: {
    color: colors.onSurfaceVariant,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  } as TextStyle,
  list: {
    gap: spacing.xs,
  } as ViewStyle,
  recRow: {
    flexDirection: "row",
    gap: spacing.xs,
  } as ViewStyle,
  scientific: {
    color: colors.onSurfaceVariant,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontStyle: "italic",
    fontWeight: typography.weights.medium,
    marginTop: -spacing.xs,
  } as TextStyle,
  scoreBlock: {
    gap: spacing.xs,
  } as ViewStyle,
  status: {
    color: colors.primary,
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extrabold,
    textTransform: "capitalize",
  } as TextStyle,
  title: {
    color: colors.onSurface,
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
  } as TextStyle,
});
