import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_DEFAULT } from "react-native-maps";
import Svg, { Path, Circle as SvgCircle } from "react-native-svg";
import {
  DropletIcon,
  GrainIcon,
  LeafIcon,
  ScanGlyphIcon,
  SproutIcon,
  StarIcon,
} from "@/components/icons/GrootedIcons";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { useQuestStore } from "@/stores/questStore";
import type { FarmZone, SeedDrop } from "@/types/map";
import type { QuestType } from "@/types/quest";

/**
 * Custom map style — muted sage/green tones matching Grooted's earthy palette.
 */
const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#e8ede4" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#3d5a3a" }] },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f0f4ec" }, { weight: 2.5 }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f8f2" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d4ddd0" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#eaf0e4" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#b8c8b0" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c4d8cc" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5a7a5a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#c8e0b8" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2d5a27" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#dde8d6" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#e8ede4" }],
  },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
  { featureType: "poi.school", stylers: [{ visibility: "off" }] },
  { featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "simplified" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#b8c8b0" }, { weight: 0.8 }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.neighborhood",
    stylers: [{ visibility: "off" }],
  },
];

type PlantMarker = {
  id: string;
  name: string;
  species: string;
  health: string;
  coordinate: { latitude: number; longitude: number };
};

type TerritoryMapProps = {
  zones: FarmZone[];
  seedDrops: SeedDrop[];
  plantMarkers?: PlantMarker[];
};

const DEFAULT_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

const QUEST_ICON: Record<QuestType, React.FC<{ size?: number; color?: string }>> = {
  care: DropletIcon,
  scan: ScanGlyphIcon,
  health: LeafIcon,
  milestone: SproutIcon,
  map: LeafIcon,
  community: GrainIcon,
  learning: StarIcon,
};

const QUEST_ICON_BG: Record<QuestType, string> = {
  care: "#E3F2FD",
  scan: "#E8F5E9",
  health: "#F1F8E9",
  milestone: "#FFF8E1",
  map: "#E8F5E9",
  community: "#FFF3E0",
  learning: "#F3E5F5",
};

export function TerritoryMap({ zones, seedDrops, plantMarkers = [] }: TerritoryMapProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [loading, setLoading] = useState(true);
  const { activeQuests, completedQuestIds, completeQuest } = useQuestStore();

  // ── Loading animations ──────────────────────────────────────────
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    const bounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: -6,
            duration: 280,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 280,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
    pulse.start();
    bounce(dotAnim1, 0).start();
    bounce(dotAnim2, 160).start();
    bounce(dotAnim3, 320).start();
    return () => {
      pulse.stop();
    };
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
          <Animated.View
            style={[
              styles.loadingIconCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
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
            <Animated.View
              style={[styles.dot, { transform: [{ translateY: dotAnim1 }] }]}
            />
            <Animated.View
              style={[styles.dot, { transform: [{ translateY: dotAnim2 }] }]}
            />
            <Animated.View
              style={[styles.dot, { transform: [{ translateY: dotAnim3 }] }]}
            />
          </View>
          <Text style={styles.loadingHint}>
            Getting your location & nearby zones
          </Text>
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
        showsPointsOfInterests={false}
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
                <LeafIcon size={28} />
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
                <SproutIcon size={26} />
              </View>
              <View style={styles.seedPointsBadge}>
                <StarIcon size={11} />
              </View>
            </View>
          </Marker>
        ))}

        {/* User's plants from garden */}
        {plantMarkers.map((plant) => (
          <Marker
            key={`plant-${plant.id}`}
            coordinate={plant.coordinate}
            title={plant.name}
            description={`${plant.species} · ${plant.health}`}
          >
            <View style={styles.plantMarker}>
              <View style={styles.plantMarkerAvatar}>
                <SproutIcon size={18} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating side quests card */}
      <View style={styles.floatingCard}>
        <Text style={styles.cardSectionTitle}>TODAY&apos;S QUESTS</Text>
        <View style={styles.questList}>
          {activeQuests.map((quest) => {
            const isDone = completedQuestIds.includes(quest.instanceId);
            const QuestIcon = QUEST_ICON[quest.type] ?? LeafIcon;
            const iconBg = QUEST_ICON_BG[quest.type] ?? "#E8F5E9";

            return (
              <View key={quest.instanceId} style={styles.questRow}>
                <View style={[styles.questIconWrap, { backgroundColor: iconBg }]}>
                  <QuestIcon size={20} color={isDone ? colors.outline : colors.primary} />
                </View>
                <View style={styles.questInfo}>
                  <Text
                    style={[
                      styles.questTitle,
                      isDone && styles.questTitleDone,
                    ]}
                    numberOfLines={1}
                  >
                    {quest.title}
                  </Text>
                  <Text style={styles.questXp}>
                    +{quest.rewardXp} XP · {quest.farmPoints} pts
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.questBtn,
                    isDone && styles.questBtnDone,
                  ]}
                  onPress={() => {
                    if (!isDone) completeQuest(quest.instanceId);
                  }}
                  disabled={isDone}
                >
                  <Text
                    style={[
                      styles.questBtnText,
                      isDone && styles.questBtnTextDone,
                    ]}
                  >
                    {isDone ? "Done" : "Go"}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={styles.questProgress}>
          <Text style={styles.questProgressText}>
            {completedQuestIds.length}/{activeQuests.length} completed
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: activeQuests.length > 0
                    ? `${(completedQuestIds.length / activeQuests.length) * 100}%`
                    : "0%",
                },
              ]}
            />
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

  // Plant markers (from garden)
  plantMarker: {
    alignItems: "center",
  } as ViewStyle,
  plantMarkerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  } as ViewStyle,

  // Floating card
  floatingCard: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 110 : 96,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    gap: 10,
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  } as ViewStyle,
  cardSectionTitle: {
    fontFamily: `${typography.fonts.secondary}-Bold`,
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 2,
  } as TextStyle,

  // Quest list
  questList: {
    gap: 8,
  } as ViewStyle,
  questRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  } as ViewStyle,
  questIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  questInfo: {
    flex: 1,
    gap: 1,
  } as ViewStyle,
  questTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 14,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  questTitleDone: {
    textDecorationLine: "line-through",
    color: colors.outline,
  } as TextStyle,
  questXp: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,
  questBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  } as ViewStyle,
  questBtnDone: {
    backgroundColor: "#E8EDE4",
  } as ViewStyle,
  questBtnText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
  questBtnTextDone: {
    color: colors.outline,
  } as TextStyle,

  // Quest progress
  questProgress: {
    gap: 6,
    marginTop: 2,
  } as ViewStyle,
  questProgressText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
  } as TextStyle,

  // Progress bar
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8EDE4",
    overflow: "hidden",
  } as ViewStyle,
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.primary,
  } as ViewStyle,
});
