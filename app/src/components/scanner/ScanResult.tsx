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
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{result.species.commonName}</Text>
      <Text style={styles.scientific}>{result.species.scientificName}</Text>
      <ProgressBar value={result.confidence * 100} />
      <View style={styles.list}>
        {result.recommendations.map((rec) => (
          <View key={rec} style={styles.recRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.item}>{rec}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  } as ViewStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
  } as TextStyle,
  scientific: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    fontStyle: "italic",
    marginTop: -spacing.xs,
  } as TextStyle,
  list: {
    gap: spacing.xs,
  } as ViewStyle,
  recRow: {
    flexDirection: "row",
    gap: spacing.xs,
  } as ViewStyle,
  bullet: {
    color: colors.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  } as TextStyle,
  item: {
    flex: 1,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
});
