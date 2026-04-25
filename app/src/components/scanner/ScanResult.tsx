import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import type { ScanResult as ScanResultType } from "@/types/plant";

type ScanResultProps = {
  result: ScanResultType;
};

export function ScanResult({ result }: ScanResultProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{result.species.commonName}</Text>
      <ProgressBar value={result.confidence * 100} />
      <View style={styles.list}>
        {result.recommendations.map((recommendation) => (
          <Text key={recommendation} style={styles.item}>{recommendation}</Text>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  item: { color: "rgba(232,245,233,0.72)" },
  list: { gap: spacing.xs },
  title: { color: colors.text, fontSize: 20, fontWeight: "900" },
});
