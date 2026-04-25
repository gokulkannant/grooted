import { StyleSheet, View } from "react-native";
import { EmptyState } from "@/components/shared/EmptyState";
import { spacing } from "@/constants/layout";
import type { Plant } from "@/types/plant";
import { PlantCard } from "@/components/garden/PlantCard";

type GardenGridProps = {
  plants: Plant[];
};

export function GardenGrid({ plants }: GardenGridProps) {
  if (plants.length === 0) return <EmptyState title="No plants yet" body="Add your first real-world plant." />;
  return (
    <View style={styles.grid}>
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
});
