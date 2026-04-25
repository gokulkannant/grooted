import { type Href, Link } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { PlantHealthIndicator } from "@/components/garden/PlantHealthIndicator";
import { LeafIcon } from "@/components/icons/GrootedIcons";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import type { Plant } from "@/types/plant";

type PlantCardProps = {
  plant: Plant;
};

export function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link href={`/plant/${plant.id}` as Href} asChild>
      <Pressable style={styles.pressable}>
        <Card style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <LeafIcon size={48} />
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
  card: {
    gap: spacing.sm,
  } as ViewStyle,
  imagePlaceholder: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: colors.primaryFixed,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.border,
    justifyContent: "center",
  } as ViewStyle,
  name: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  pressable: {
    width: "48%",
  } as ViewStyle,
  species: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
});
