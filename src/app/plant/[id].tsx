import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PlantHealthIndicator } from "@/components/garden/PlantHealthIndicator";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useGardenStore } from "@/stores/gardenStore";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plant = useGardenStore((state) => state.plants.find((item) => item.id === id));

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{plant?.name ?? "Plant"}</Text>
        <Text style={styles.muted}>{plant?.species.commonName ?? "Species pending"}</Text>
        <PlantHealthIndicator health={plant?.health ?? "healthy"} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  container: { backgroundColor: colors.background, flex: 1, padding: spacing.lg },
  muted: { color: "rgba(232,245,233,0.72)" },
  title: { color: colors.text, fontSize: 28, fontWeight: "900" },
});
