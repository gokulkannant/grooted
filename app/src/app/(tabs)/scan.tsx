import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { CameraGlyphIcon, SproutIcon } from "@/components/icons/GrootedIcons";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { PlantService } from "@/services/PlantService";
import { useGardenStore } from "@/stores/gardenStore";
import type { ScanResult as ScanResultType } from "@/types/plant";

const createScanSessionId = () =>
  `scan_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<ScanResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [added, setAdded] = useState(false);
  const addPlant = useGardenStore((s) => s.addPlant);
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

  // Camera is active when we have permission and no result showing
  const cameraActive = permission?.granted && !result;

  // Hide tab bar + header when camera is live
  React.useEffect(() => {
    if (cameraActive) {
      navigation.setOptions({
        headerShown: false,
        tabBarVisible: false,
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        tabBarVisible: true,
      });
    }
  }, [cameraActive, navigation]);

  const handleCapture = async () => {
    if (capturing || analyzing) return;
    setCapturing(true);
    setError(null);

    try {
      // Capture photo and GPS in parallel
      const [photoResult, locationResult] = await Promise.allSettled([
        cameraRef.current?.takePictureAsync({
          quality: 0.3,
          base64: true,
          imageType: "jpg",
        }),
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      ]);

      const photo = photoResult.status === "fulfilled" ? photoResult.value : null;
      const location = locationResult.status === "fulfilled" ? locationResult.value : null;
      const imageBase64 = photo?.base64 ?? "";

      if (!imageBase64) {
        setError("Failed to capture photo. Please try again.");
        setCapturing(false);
        return;
      }

      // Photo taken — switch to analyzing state
      setCapturing(false);
      setAnalyzing(true);

      const scanResult = await PlantService.scan({
        capturedAt: new Date().toISOString(),
        imageBase64,
        scanSessionId: createScanSessionId(),
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      });
      setResult(scanResult);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Scan] Failed:", msg);
      setError(`Scan failed: ${msg}`);
    } finally {
      setCapturing(false);
      setAnalyzing(false);
    }
  };

  // ── Permission not granted yet ────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        {/* Illustration: a leaf with a viewfinder */}
        <View style={styles.permIllustration}>
          <View style={styles.permCircle}>
            <View style={styles.permLeafWrap}>
              <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22V12"
                  stroke={colors.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <Path
                  d="M12 12C12 7 7 4 2 4C2 9 7 12 12 12Z"
                  stroke={colors.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(188, 240, 174, 0.4)"
                />
                <Path
                  d="M12 12C12 7 17 4 22 4C22 9 17 12 12 12Z"
                  stroke={colors.primary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(188, 240, 174, 0.3)"
                />
              </Svg>
            </View>
            {/* Viewfinder corners */}
            <View style={[styles.permCorner, styles.permCornerTL]} />
            <View style={[styles.permCorner, styles.permCornerTR]} />
            <View style={[styles.permCorner, styles.permCornerBL]} />
            <View style={[styles.permCorner, styles.permCornerBR]} />
          </View>
        </View>

        <Text style={styles.permTitle}>Scan your plants</Text>
        <Text style={styles.permDesc}>
          Grooted uses your camera to identify plant species, check their
          health, and track growth over time.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.permButton,
            pressed && styles.permButtonPressed,
          ]}
          onPress={requestPermission}
        >
          <Text style={styles.permButtonText}>Enable Camera</Text>
        </Pressable>

        <Text style={styles.permFootnote}>
          You can change this anytime in Settings
        </Text>
      </View>
    );
  }

  // ── Analyzing state ────────────────────────────────────────────
  if (analyzing) {
    return <AnalyzingScreen />;
  }

  // ── Result view ───────────────────────────────────────────────
  if (result) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.resultContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultCard}>
          {/* Badges */}
          <View style={styles.resultHeader}>
            <View style={styles.resultBadge}>
              <Text style={styles.resultBadgeText}>
                {Math.round(result.confidence * 100)}% match
              </Text>
            </View>
            <View style={styles.healthBadge}>
              <View style={styles.healthDot} />
              <Text style={styles.healthBadgeText}>
                {result.health === "healthy" ? "Healthy" : result.health}
              </Text>
            </View>
          </View>

          <Text style={styles.resultName}>{result.species.commonName}</Text>
          <Text style={styles.resultScientific}>
            {result.species.scientificName}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.recTitle}>Recommendations</Text>
          {result.recommendations.map((rec) => (
            <View key={rec} style={styles.recRow}>
              <Text style={styles.recBullet}>•</Text>
              <Text style={styles.recText}>{rec}</Text>
            </View>
          ))}

          {/* Actions */}
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              added && styles.addButtonDone,
              pressed && !added && { opacity: 0.85 },
            ]}
            disabled={added}
            onPress={() => {
              if (!result) return;
              addPlant({
                id: result.scanSessionId ?? `plant_${Date.now()}`,
                name: result.species.commonName,
                species: result.species,
                health: result.health,
                plantedAt: result.capturedAt ?? new Date().toISOString(),
                imageUrl: result.imageUrl,
                latitude: result.latitude,
                longitude: result.longitude,
              });
              setAdded(true);
            }}
          >
            <SproutIcon color="#FFFFFF" size={20} />
            <Text style={styles.addButtonText}>
              {added ? "Added to Garden ✓" : "Add to Garden"}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.rescanButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => {
              setResult(null);
              setError(null);
              setAdded(false);
            }}
          >
            <CameraGlyphIcon size={20} />
            <Text style={styles.rescanText}>Scan Another</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // ── Camera view ───────────────────────────────────────────────
  return (
    <View style={styles.cameraContainer}>
      <StatusBar hidden />
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      {/* Overlay — absolute positioned on top of camera */}
      <View style={styles.overlay}>
        {/* Top hint */}
        <View style={styles.topHint}>
          <Text style={styles.topHintText}>
            Point at a plant and tap the button
          </Text>
        </View>

        {/* Error message */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Viewfinder frame */}
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <Pressable
            style={({ pressed }) => [
              styles.captureButton,
              pressed && styles.captureButtonPressed,
            ]}
            onPress={handleCapture}
            disabled={capturing}
          >
            <View style={styles.captureOuter}>
              {capturing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const PLANT_TIPS = [
  "🌱 Plants can recognize their siblings and share nutrients through root networks",
  "🌿 Talking to your plants isn't crazy — CO₂ from your breath helps them grow",
  "🍃 The world's oldest living plant is over 5,000 years old",
  "🌻 Sunflowers track the sun across the sky — it's called heliotropism",
  "🪴 Indoor plants can reduce stress levels by up to 37%",
  "🌵 Cacti can survive up to 2 years without water",
  "💧 Overwatering kills more houseplants than underwatering",
  "🌳 A single tree can absorb 48 pounds of CO₂ per year",
];

const STEPS = [
  "Photo captured",
  "Identifying species",
  "Checking health",
  "Preparing care tips",
];

function AnalyzingScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(
    () => Math.floor(Math.random() * PLANT_TIPS.length),
  );
  const tipOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Step progression
    const stepTimers = STEPS.map((_, i) =>
      setTimeout(() => setCurrentStep(i), i * 3000 + 500),
    );

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 12000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // Rotate tips
    const tipTimer = setInterval(() => {
      Animated.timing(tipOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTipIndex((prev) => (prev + 1) % PLANT_TIPS.length);
        Animated.timing(tipOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => {
      stepTimers.forEach(clearTimeout);
      clearInterval(tipTimer);
    };
  }, [pulseAnim, progressAnim, tipOpacity]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["5%", "95%"],
  });

  return (
    <View style={styles.analyzingContainer}>
      <View style={styles.analyzingContent}>
        {/* Pulsing icon */}
        <Animated.View
          style={[
            styles.analyzingIconCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22V12"
              stroke={colors.primary}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            <Path
              d="M12 12C12 8 8 6 4 6C4 10 8 12 12 12Z"
              stroke={colors.primary}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 15C12 11 16 9 20 9C20 13 16 15 12 15Z"
              stroke={colors.primary}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>

        <Text style={styles.analyzingTitle}>Analyzing your plant</Text>

        {/* Progress bar */}
        <View style={styles.analyzingProgressTrack}>
          <Animated.View
            style={[styles.analyzingProgressFill, { width: progressWidth }]}
          />
        </View>

        {/* Steps */}
        <View style={styles.analyzingSteps}>
          {STEPS.map((label, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <View key={label} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    done && styles.stepDotDone,
                    active && styles.stepDotActive,
                  ]}
                >
                  {done && (
                    <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M5 12L10 17L19 7"
                        stroke="#FFF"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                  {active && <View style={styles.stepDotPulse} />}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    done && styles.stepLabelDone,
                    active && styles.stepLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Rotating tip */}
        <Animated.View style={[styles.tipCard, { opacity: tipOpacity }]}>
          <Text style={styles.tipText}>{PLANT_TIPS[tipIndex]}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const CORNER_SIZE = 36;
const CORNER_THICKNESS = 4;

const styles = StyleSheet.create({
  // Shared
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
  } as ViewStyle,

  // Permission
  permIllustration: {
    marginBottom: spacing.md,
  } as ViewStyle,
  permCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(188, 240, 174, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  permLeafWrap: {
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  permCorner: {
    position: "absolute",
    width: 24,
    height: 24,
  } as ViewStyle,
  permCornerTL: {
    top: 16,
    left: 16,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderTopLeftRadius: 8,
  } as ViewStyle,
  permCornerTR: {
    top: 16,
    right: 16,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
    borderTopRightRadius: 8,
  } as ViewStyle,
  permCornerBL: {
    bottom: 16,
    left: 16,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.primary,
    borderBottomLeftRadius: 8,
  } as ViewStyle,
  permCornerBR: {
    bottom: 16,
    right: 16,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.primary,
    borderBottomRightRadius: 8,
  } as ViewStyle,
  permTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    textAlign: "center",
  } as TextStyle,
  permDesc: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 15,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  } as TextStyle,
  permButton: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: spacing.sm,
  } as ViewStyle,
  permButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  } as ViewStyle,
  permButtonText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 16,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
  permFootnote: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 12,
    fontWeight: typography.weights.regular,
    color: colors.outline,
    marginTop: spacing.xs,
  } as TextStyle,

  // Camera
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  } as ViewStyle,
  camera: {
    flex: 1,
  } as ViewStyle,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xl,
  } as ViewStyle,

  // Top hint
  topHint: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  } as ViewStyle,
  topHintText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 14,
    fontWeight: typography.weights.medium,
    color: "#FFFFFF",
  } as TextStyle,

  // Error banner
  errorBanner: {
    backgroundColor: "rgba(220, 38, 38, 0.85)",
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.lg,
  } as ViewStyle,
  errorText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: "#FFFFFF",
    textAlign: "center",
  } as TextStyle,

  // Viewfinder
  viewfinder: {
    width: 260,
    height: 260,
    position: "relative",
  } as ViewStyle,
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  } as ViewStyle,
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 12,
  } as ViewStyle,
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 12,
  } as ViewStyle,
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 12,
  } as ViewStyle,
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 12,
  } as ViewStyle,

  // Capture button
  bottomControls: {
    alignItems: "center",
    gap: spacing.sm,
  } as ViewStyle,
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  captureButtonPressed: {
    transform: [{ scale: 0.9 }],
    backgroundColor: "rgba(255,255,255,0.5)",
  } as ViewStyle,
  captureOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  captureInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  } as ViewStyle,

  // Result
  resultContainer: {
    padding: spacing.gutter,
    paddingBottom: 120,
    gap: spacing.md,
  } as ViewStyle,
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  resultHeader: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  } as ViewStyle,
  resultBadge: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  } as ViewStyle,
  resultBadgeText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  } as TextStyle,
  healthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  } as ViewStyle,
  healthDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.healthy,
  } as ViewStyle,
  healthBadgeText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 12,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  } as TextStyle,
  resultName: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  resultScientific: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    fontStyle: "italic",
  } as TextStyle,
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  } as ViewStyle,
  recTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
  } as TextStyle,
  recRow: {
    flexDirection: "row",
    gap: spacing.xs,
  } as ViewStyle,
  recBullet: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: typography.weights.bold,
    lineHeight: 22,
  } as TextStyle,
  recText: {
    flex: 1,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  } as TextStyle,
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    marginTop: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  addButtonDone: {
    backgroundColor: colors.primaryLight,
    opacity: 0.8,
  } as ViewStyle,
  addButtonText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
  rescanButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    justifyContent: "center",
    paddingVertical: 12,
  } as ViewStyle,
  rescanText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,

  // Analyzing state
  analyzingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  } as ViewStyle,
  analyzingContent: {
    alignItems: "center",
    gap: 8,
    maxWidth: 300,
  } as ViewStyle,
  analyzingIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(188, 240, 174, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  } as ViewStyle,
  analyzingTitle: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.onSurface,
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 4,
  } as TextStyle,
  analyzingSubtitle: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 14,
    fontWeight: typography.weights.regular,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
  } as TextStyle,
  analyzingProgressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(188, 240, 174, 0.3)",
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 4,
  } as ViewStyle,
  analyzingProgressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.primary,
  } as ViewStyle,
  analyzingSteps: {
    marginTop: 20,
    gap: 16,
    alignSelf: "stretch",
  } as ViewStyle,
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  } as ViewStyle,
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  stepDotDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  } as ViewStyle,
  stepDotActive: {
    borderColor: colors.primary,
    borderWidth: 2.5,
    backgroundColor: colors.background,
  } as ViewStyle,
  stepDotPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  } as ViewStyle,
  stepLabel: {
    fontFamily: `${typography.fonts.primary}-Regular`,
    fontSize: 15,
    fontWeight: typography.weights.regular,
    color: colors.outline,
  } as TextStyle,
  stepLabelDone: {
    color: colors.onSurface,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontWeight: typography.weights.medium,
  } as TextStyle,
  stepLabelActive: {
    color: colors.primary,
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontWeight: typography.weights.bold,
  } as TextStyle,
  tipCard: {
    marginTop: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignSelf: "stretch",
    shadowColor: "#1a3c2a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  tipText: {
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: 13,
    fontWeight: typography.weights.medium,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 19,
  } as TextStyle,
});
