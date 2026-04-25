import { ScrollView, StyleSheet } from "react-native";
import { TerritoryMap } from "@/components/map/TerritoryMap";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";
import { useMapStore } from "@/stores/mapStore";

export default function MapScreen() {
  const { nearbyZones, seedDrops } = useMapStore();
  const fallbackZone = {
    center: { latitude: 12.9716, longitude: 77.5946 },
    id: "zone-demo",
    name: "Neighborhood Plot",
    ownerId: "demo-user",
    points: 420,
    radiusMeters: 300,
    rank: 1,
  };
  const fallbackDrop = {
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    id: "seed-demo",
    location: fallbackZone.center,
    rewardPoints: 25,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TerritoryMap
        seedDrops={seedDrops.length ? seedDrops : [fallbackDrop]}
        zones={nearbyZones.length ? nearbyZones : [fallbackZone]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flexGrow: 1, padding: spacing.lg },
});
