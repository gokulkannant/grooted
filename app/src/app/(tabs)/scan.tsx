import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { PlantScanner } from "@/components/scanner/PlantScanner";
import { ScanResult } from "@/components/scanner/ScanResult";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import type { ScanResult as ScanResultType } from "@/types/plant";

const demoResult: ScanResultType = {
  confidence: 0.92,
  health: "healthy",
  recommendations: ["Water every 2 days.", "Rotate toward morning light."],
  species: { commonName: "Tulsi", id: "tulsi", scientificName: "Ocimum tenuiflorum" },
};

export default function ScanScreen() {
  const [result, setResult] = useState<ScanResultType | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlantScanner onScan={() => setResult(demoResult)} />
      {result ? <ScanResult result={result} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, gap: spacing.lg, padding: spacing.lg },
});
