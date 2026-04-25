import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type PlantScannerProps = {
  onScan: () => void;
};

export function PlantScanner({ onScan }: PlantScannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.viewport}>
        <Text style={styles.icon}>📷</Text>
        <Text style={styles.focus}>AI Scan Ready</Text>
        <Text style={styles.hint}>Point camera at a plant</Text>
      </View>
      <Button onPress={onScan}>🔍  Scan Plant</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  } as ViewStyle,
  viewport: {
    alignItems: "center",
    aspectRatio: 3 / 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderWidth: 4,
    borderRadius: radius.md,
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.lg,
  } as ViewStyle,
  icon: {
    fontSize: 64,
  } as TextStyle,
  focus: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
    textTransform: "uppercase",
  } as TextStyle,
  hint: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
});
