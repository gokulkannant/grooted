import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { SeedDrop } from "@/types/map";

type SeedDropMarkerProps = {
  seedDrop: SeedDrop;
};

export function SeedDropMarker({ seedDrop }: SeedDropMarkerProps) {
  return (
    <View style={styles.marker}>
      <Text style={styles.text}>+{seedDrop.rewardPoints}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  text: { color: colors.textLight, fontWeight: "900" },
});
