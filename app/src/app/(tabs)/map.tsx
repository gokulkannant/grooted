import { StyleSheet, View } from "react-native";
import { TerritoryMap } from "@/components/map/TerritoryMap";
import { useGardenStore } from "@/stores/gardenStore";
import { useMapStore } from "@/stores/mapStore";

export default function MapScreen() {
  const { nearbyZones, seedDrops } = useMapStore();
  const plants = useGardenStore((s) => s.plants);

  // Filter plants that have coordinates
  const plantMarkers = plants
    .filter((p) => p.latitude && p.longitude)
    .map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species.commonName,
      health: p.health,
      coordinate: {
        latitude: p.latitude!,
        longitude: p.longitude!,
      },
    }));

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
    <View style={styles.container}>
      <TerritoryMap
        seedDrops={seedDrops.length ? seedDrops : [fallbackDrop]}
        zones={nearbyZones.length ? nearbyZones : [fallbackZone]}
        plantMarkers={plantMarkers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
