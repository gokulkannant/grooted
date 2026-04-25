import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useGardenStore } from "@/stores/gardenStore";

export default function AddPlantScreen() {
  const router = useRouter();
  const addPlant = useGardenStore((state) => state.addPlant);
  const [name, setName] = useState("");

  const save = () => {
    const plantName = name.trim() || "New Plant";
    addPlant({
      health: "healthy",
      id: `plant-${Date.now().toString()}`,
      name: plantName,
      plantedAt: new Date().toISOString(),
      species: { commonName: "Unknown species", id: "unknown" },
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add plant</Text>
      <Input onChangeText={setName} placeholder="Plant nickname" value={name} />
      <Button onPress={save}>Save plant</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, gap: spacing.md, padding: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: "900" },
});
