import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { PlantScanner } from "@/components/scanner/PlantScanner";
import { ScanResult } from "@/components/scanner/ScanResult";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { PlantService } from "@/services/PlantService";
import type { ScanResult as ScanResultType } from "@/types/plant";

const createScanSessionId = () =>
  `scan_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function ScanScreen() {
  const [result, setResult] = useState<ScanResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const scanPlant = async (imageBase64: string) => {
    setIsScanning(true);
    setError(null);

    try {
      const scanResult = await PlantService.scan({
        capturedAt: new Date().toISOString(),
        imageBase64,
        scanSessionId: createScanSessionId(),
      });
      setResult(scanResult);
    } catch {
      setError("Plant scan failed. Check the backend API key and try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PlantScanner isScanning={isScanning} onScan={scanPlant} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result ? <ScanResult result={result} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, gap: spacing.lg, padding: spacing.lg },
  error: { color: colors.danger, fontWeight: "800" },
});
