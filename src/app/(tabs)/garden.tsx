import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { GardenGrid } from "@/components/garden/GardenGrid";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useGardenStore } from "@/stores/gardenStore";

export default function GardenScreen() {
  const plants = useGardenStore((state) => state.plants);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.actions}>
        <Link href="/plant/add" asChild>
          <Button>Add plant</Button>
        </Link>
      </View>
      <GardenGrid plants={plants} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: "flex-start" },
  container: { backgroundColor: colors.background, gap: spacing.lg, padding: spacing.lg },
});
