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
    backgroundColor: colors.tertiaryFixed,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colors.border,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  text: { color: colors.onTertiaryContainer, fontWeight: "900", fontSize: 13 },
});
