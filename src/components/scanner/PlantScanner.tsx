import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type PlantScannerProps = {
  onScan: () => void;
};

export function PlantScanner({ onScan }: PlantScannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.viewport}>
        <Text style={styles.focus}>AI scan ready</Text>
      </View>
      <Button onPress={onScan}>Scan plant</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  focus: { color: colors.text, fontSize: 18, fontWeight: "900" },
  viewport: {
    alignItems: "center",
    aspectRatio: 3 / 4,
    backgroundColor: "rgba(46,204,113,0.12)",
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
  },
});
