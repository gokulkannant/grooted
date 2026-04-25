import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { HealthStatus } from "@/types/plant";

type PlantHealthIndicatorProps = {
  health: HealthStatus;
};

const labels: Record<HealthStatus, string> = {
  dead: "Dormant",
  healthy: "Healthy",
  needs_water: "Needs water",
  wilting: "Wilting",
};

const tones: Record<HealthStatus, string> = {
  dead: colors.danger,
  healthy: colors.primary,
  needs_water: colors.warning,
  wilting: colors.streak,
};

export function PlantHealthIndicator({ health }: PlantHealthIndicatorProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: tones[health] }]} />
      <Text style={styles.text}>{labels[health]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { borderRadius: 999, height: 8, width: 8 },
  row: { alignItems: "center", flexDirection: "row", gap: 6 },
  text: { color: colors.text, fontSize: 12, fontWeight: "700" },
});
