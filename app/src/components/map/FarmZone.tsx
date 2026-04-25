import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/colors";
import type { FarmZone as FarmZoneType } from "@/types/map";

type FarmZoneProps = {
  zone: FarmZoneType;
};

export function FarmZone({ zone }: FarmZoneProps) {
  return (
    <View style={styles.zone}>
      <Text style={styles.name}>{zone.name}</Text>
      <Text style={styles.meta}>Rank #{zone.rank} · {zone.points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { color: colors.onSurfaceVariant },
  name: { color: colors.onSurface, fontSize: 16, fontWeight: "800" },
  zone: { borderBottomColor: colors.outlineVariant, borderBottomWidth: 1, paddingVertical: 12 },
});
