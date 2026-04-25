import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";
import { PlantService } from "@/services/PlantService";
import type { ScanResult as ScanResultType } from "@/types/plant";

const createScanSessionId = () =>
  `scan_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<ScanResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
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
    if (capturing) return;
    setCapturing(true);
    setError(null);

    try {
      let imageBase64 = "";
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        imageBase64 = photo?.base64 ?? "";
      }

      const scanResult = await PlantService.scan({
        capturedAt: new Date().toISOString(),
        imageBase64,
        scanSessionId: createScanSessionId(),
      });
      setResult(scanResult);
    } catch {
      setError("Plant scan failed. Check the backend API key and try again.");
    } finally {
      setCapturing(false);
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
          Grooted uses your camera to identify plant species, check their health, and track growth over time.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.permButton, pressed && styles.permButtonPressed]}
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
            style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.addButtonText}>🌱  Add to Garden</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.rescanButton, pressed && { opacity: 0.7 }]}
            onPress={() => {
              setResult(null);
              setError(null);
            }}
          >
            <Text style={styles.rescanText}>📷  Scan Another</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // ── Camera view ───────────────────────────────────────────────
  return (
    <View style={styles.cameraContainer}>
      <StatusBar hidden />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        {/* Overlay */}
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
      </CameraView>
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
    flex: 1,
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
    paddingBottom: 80,
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
    marginTop: spacing.sm,
    ...shadows.md,
  } as ViewStyle,
  addButtonText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: "#FFFFFF",
  } as TextStyle,
  rescanButton: {
    alignItems: "center",
    paddingVertical: 12,
  } as ViewStyle,
  rescanText: {
    fontFamily: `${typography.fonts.primary}-Bold`,
    fontSize: 15,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  } as TextStyle,
});
