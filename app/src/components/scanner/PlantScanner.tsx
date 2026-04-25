import { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/colors";
import { radius, shadows, spacing } from "@/constants/layout";
import { typography } from "@/constants/typography";

type PlantScannerProps = {
  isScanning?: boolean;
  onScan: (imageBase64: string) => Promise<void> | void;
};

export function PlantScanner({ isScanning = false, onScan }: PlantScannerProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted ?? false;

  const capturePlant = async () => {
    if (!hasPermission) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert("Camera needed", "GROOTED needs camera access for live plant scans.");
        return;
      }
      return;
    }

    const photo = await cameraRef.current?.takePictureAsync({
      base64: true,
      exif: false,
      quality: 0.72,
    });

    if (!photo?.base64) {
      Alert.alert("Scan failed", "Could not capture a plant photo. Please try again.");
      return;
    }

    await onScan(photo.base64);
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewport}>
        {hasPermission ? (
          <CameraView ref={cameraRef} facing="back" style={styles.camera} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.focus}>Live Scan Ready</Text>
            <Text style={styles.hint}>Enable camera to scan a plant</Text>
          </View>
        )}
      </View>
      <Button disabled={isScanning} onPress={capturePlant}>
        {isScanning ? "Scanning Plant..." : hasPermission ? "Scan Plant" : "Enable Camera"}
      </Button>
      {isScanning ? <ActivityIndicator color={colors.primary} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: "100%",
  } as ViewStyle,
  container: {
    gap: spacing.md,
  } as ViewStyle,
  focus: {
    color: colors.onSurface,
    fontFamily: `${typography.fonts.primary}-ExtraBold`,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    textTransform: "uppercase",
  } as TextStyle,
  hint: {
    color: colors.onSurfaceVariant,
    fontFamily: `${typography.fonts.primary}-Medium`,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  } as TextStyle,
  placeholder: {
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.lg,
  } as ViewStyle,
  viewport: {
    alignItems: "center",
    aspectRatio: 3 / 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 4,
    gap: spacing.sm,
    justifyContent: "center",
    overflow: "hidden",
    ...shadows.lg,
  } as ViewStyle,
});
