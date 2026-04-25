import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import Svg, { Path, Circle as SvgCircle } from "react-native-svg";
import * as Location from "expo-location";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import type { FarmZone, SeedDrop } from "@/types/map";

/**
 * Custom map style — muted sage/green tones matching Grooted's earthy palette.
 */
const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#e8ede4" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#3d5a3a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f0f4ec" }, { weight: 2.5 }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f8f2" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d4ddd0" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#eaf0e4" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#b8c8b0" }] },
  { featureType: "road.arterial", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c4d8cc" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5a7a5a" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e0b8" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#2d5a27" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dde8d6" }] },
  { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: "#e8ede4" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
  { featureType: "poi.school", stylers: [{ visibility: "off" }] },
  { featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "simplified" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#b8c8b0" }, { weight: 0.8 }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.neighborhood", stylers: [{ visibility: "off" }] },
];

type TerritoryMapProps = {
  zones: FarmZone[];
  seedDrops: SeedDrop[];
};

const DEFAULT_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

export function TerritoryMap({ zones, seedDrops }: TerritoryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Loading animations ──────────────────────────────────────────
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const bounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -6, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 280, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ])
      );
    pulse.start();
    bounce(dotAnim1, 0).start();
    bounce(dotAnim2, 160).start();
    bounce(dotAnim3, 320).start();
    return () => { pulse.stop(); };
  }, [loading, pulseAnim, dotAnim1, dotAnim2, dotAnim3]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserLocation(coords);
          const newRegion = {
            ...coords,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 600);
        }
      } catch {
        // Fall back to default
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Full-screen map */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Animated.View style={[styles.loadingIconCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z"
                stroke={colors.primary}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(188, 240, 174, 0.3)"
              />
              <Path d="M9 3V18" stroke={colors.primary} strokeWidth={1.5} />
              <Path d="M15 6V21" stroke={colors.primary} strokeWidth={1.5} />
              <SvgCircle cx="12" cy="12" r="2" fill={colors.primary} />
            </Svg>
          </Animated.View>
          <Text style={styles.loadingTitle}>Finding your territory</Text>
          <View style={styles.dotsRow}>
            <Animated.View style={[styles.dot, { transform: [{ translateY: dotAnim1 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dotAnim2 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dotAnim3 }] }]} />
          </View>
          <Text style={styles.loadingHint}>Getting your location & nearby zones</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        customMapStyle={MAP_STYLE}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        showsPointsOfInterest={false}
        showsBuildings={false}
        mapType="standard"
      >
        {/* Territory zones */}
        {zones.map((zone) => (
          <Circle
            key={zone.id}
            center={zone.center}
            radius={zone.radiusMeters}
            fillColor="rgba(45, 90, 39, 0.12)"
            strokeColor="rgba(45, 90, 39, 0.35)"
            strokeWidth={2}
          />
        ))}

        {/* Zone markers */}
        {zones.map((zone) => (
          <Marker
            key={`m-${zone.id}`}
            coordinate={zone.center}
            title={zone.name}
            description={`Rank #${zone.rank} · ${zone.points} pts`}
          >
            <View style={styles.zoneMarker}>
              <View style={styles.zoneAvatar}>
                <Text style={styles.zoneAvatarText}>🌿</Text>
              </View>
              <View style={styles.zoneBadge}>
                <Text style={styles.zoneBadgeText}>Active</Text>
              </View>
            </View>
          </Marker>
        ))}

        {/* Seed drops */}
        {seedDrops.map((drop) => (
          <Marker
            key={`s-${drop.id}`}
            coordinate={drop.location}
            title="Seed Drop!"
            description={`+${drop.rewardPoints} pts`}
          >
            <View style={styles.seedMarker}>
              <View style={styles.seedAvatar}>
                <Text style={styles.seedAvatarText}>🌱</Text>
              </View>
              <View style={styles.seedPointsBadge}>
                <Text style={styles.seedPointsText}>🌟</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating event card */}
      <View style={styles.floatingCard}>
        <View style={styles.cardHeader}>
          <View style={styles.eventIcon}>
            <Text style={styles.eventIconText}>💧</Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>Watering Week</Text>
            <Text style={styles.eventDesc}>
              Join the community in keeping local plots hydrated.
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>45/100</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: "45%" }]} />
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.avatarStack}>
            {["🧑‍🌾", "👩‍🌾", "🧑‍🌾"].map((emoji, i) => (
              <View
                key={`av-${i}`}
                style={[styles.stackAvatar, { marginLeft: i > 0 ? -10 : 0, zIndex: 3 - i }]}
              >
                <Text style={styles.stackAvatarText}>{emoji}</Text>
              </View>
            ))}
            <View style={styles.moreCount}>
              <Text style={styles.moreCountText}>+12</Text>
            </View>
          </View>
          <View style={styles.contributeBtn}>
            <Text style={styles.contributeBtnText}>Contribute</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  map: {
    flex: 1,
  } as ViewStyle,
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    zIndex: 10,
    gap: 16,
  } as ViewStyle,

  // User location dot
  userDotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(21, 66, 18, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  userDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  } as ViewStyle,

  loadingIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(188, 240, 174, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  } as ViewStyle,
  loadingTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    letterSpacing: -0.3,
  } as TextStyle,
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    height: 20,
  } as ViewStyle,
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  } as ViewStyle,
  loadingHint: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 13,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
  } as TextStyle,

  // Zone markers
  zoneMarker: {
    alignItems: "center",
  } as ViewStyle,
  zoneAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  } as ViewStyle,
  zoneAvatarText: {
    fontSize: 22,
  } as TextStyle,
  zoneBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: -4,
  } as ViewStyle,
  zoneBadgeText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 9,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  } as TextStyle,

  // Seed markers
  seedMarker: {
    alignItems: "center",
  } as ViewStyle,
  seedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#72796e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  } as ViewStyle,
  seedAvatarText: {
    fontSize: 20,
  } as TextStyle,
  seedPointsBadge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFF8E1",
    borderWidth: 1.5,
    borderColor: "#F9A825",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  seedPointsText: {
    fontSize: 10,
  } as TextStyle,

  // Floating card
  floatingCard: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 110 : 96,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    gap: 12,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  } as ViewStyle,
  cardHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  } as ViewStyle,
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  eventIconText: {
    fontSize: 22,
  } as TextStyle,
  eventInfo: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
  eventTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  eventDesc: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 13,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  } as TextStyle,

  // Progress
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  progressLabel: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  progressValue: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 18,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E8EDE4",
    overflow: "hidden",
  } as ViewStyle,
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.primary,
  } as ViewStyle,

  // Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  } as ViewStyle,
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  stackAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  stackAvatarText: {
    fontSize: 14,
  } as TextStyle,
  moreCount: {
    marginLeft: 6,
    backgroundColor: "#F0F4EC",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  } as ViewStyle,
  moreCountText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  contributeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  } as ViewStyle,
  contributeBtnText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
});
