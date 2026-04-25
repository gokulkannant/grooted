import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import type { FarmZone, SeedDrop } from "@/types/map";
import { FarmZone as FarmZoneRow } from "@/components/map/FarmZone";

type TerritoryMapProps = {
  zones: FarmZone[];
  seedDrops: SeedDrop[];
};

const DEFAULT_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export function TerritoryMap({ zones, seedDrops }: TerritoryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const newRegion = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 500);
        }
      } catch {
        // Fall back to default region
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Map */}
      <View style={styles.mapContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          mapType="standard"
        >
          {/* Territory zones as circles */}
          {zones.map((zone) => (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radiusMeters}
              fillColor="rgba(45, 90, 39, 0.15)"
              strokeColor={colors.primary}
              strokeWidth={3}
            />
          ))}

          {/* Zone center markers */}
          {zones.map((zone) => (
            <Marker
              key={`marker-${zone.id}`}
              coordinate={zone.center}
              title={zone.name}
              description={`Rank #${zone.rank} · ${zone.points} pts`}
            >
              <View style={styles.zoneMarker}>
                <Text style={styles.zoneMarkerText}>🌿</Text>
              </View>
            </Marker>
          ))}

          {/* Seed drop markers */}
          {seedDrops.map((drop) => (
            <Marker
              key={`seed-${drop.id}`}
              coordinate={drop.location}
              title="Seed Drop!"
              description={`+${drop.rewardPoints} pts`}
            >
              <View style={styles.seedMarker}>
                <Text style={styles.seedMarkerText}>🌱</Text>
                <View style={styles.seedBadge}>
                  <Text style={styles.seedBadgeText}>+{drop.rewardPoints}</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* Nearby territory list */}
      <Text style={styles.title}>Nearby Territory</Text>
      {zones.map((zone) => (
        <FarmZoneRow key={zone.id} zone={zone} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  } as ViewStyle,
  mapContainer: {
    height: 380,
    borderRadius: radius.md,
    borderWidth: 4,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
    ...shadows.md,
  } as ViewStyle,
  map: {
    flex: 1,
  } as ViewStyle,
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainer,
    zIndex: 10,
  } as ViewStyle,
  zoneMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryFixed,
    borderWidth: 3,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.sm,
  } as ViewStyle,
  zoneMarkerText: {
    fontSize: 18,
  } as TextStyle,
  seedMarker: {
    alignItems: "center",
  } as ViewStyle,
  seedMarkerText: {
    fontSize: 28,
  } as TextStyle,
  seedBadge: {
    backgroundColor: colors.tertiaryContainer,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: -4,
  } as ViewStyle,
  seedBadgeText: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.onTertiaryContainer,
  } as TextStyle,
  title: {
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.onSurface,
    textTransform: "uppercase",
  } as TextStyle,
});
