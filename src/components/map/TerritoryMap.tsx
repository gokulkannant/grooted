import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import type { FarmZone, SeedDrop } from "@/types/map";
import { FarmZone as FarmZoneRow } from "@/components/map/FarmZone";
import { SeedDropMarker } from "@/components/map/SeedDropMarker";

type TerritoryMapProps = {
  zones: FarmZone[];
  seedDrops: SeedDrop[];
};

export function TerritoryMap({ zones, seedDrops }: TerritoryMapProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.map}>
        {seedDrops.slice(0, 3).map((seedDrop) => (
          <SeedDropMarker key={seedDrop.id} seedDrop={seedDrop} />
        ))}
      </View>
      <Text style={styles.title}>Nearby territory</Text>
      {zones.map((zone) => (
        <FarmZoneRow key={zone.id} zone={zone} />
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  map: {
    alignItems: "center",
    backgroundColor: "rgba(142,68,173,0.18)",
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
    minHeight: 220,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: "900" },
});
