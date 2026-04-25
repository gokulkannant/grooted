import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import type { Plant } from "@/types/plant";
import { PlantHealthIndicator } from "@/components/garden/PlantHealthIndicator";

type PlantCardProps = {
  plant: Plant;
};

export function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link href={`/plant/${plant.id}` as Href} asChild>
      <Pressable style={styles.pressable}>
        <Card style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.sprout}>G</Text>
          </View>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.species}>{plant.species.commonName}</Text>
          <PlantHealthIndicator health={plant.health} />
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  imagePlaceholder: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "rgba(46,204,113,0.16)",
    borderRadius: 8,
    justifyContent: "center",
  },
  name: { color: colors.text, fontSize: 16, fontWeight: "800" },
  pressable: { width: "48%" },
  species: { color: "rgba(232,245,233,0.72)", fontSize: 13 },
  sprout: { color: colors.primary, fontSize: 32, fontWeight: "900" },
});
