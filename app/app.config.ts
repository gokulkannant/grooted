import type { ConfigContext, ExpoConfig } from "expo/config";

// === App Identifiers ===
const EAS_PROJECT_ID = ""; // TODO: Set after `eas init`
const BASE_BUNDLE_ID = "app.grooted";

// === Build Variants ===
const IS_PRODUCTION = process.env.APP_VARIANT === "production";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";
const IS_DEV = !IS_PRODUCTION && !IS_PREVIEW;

const getUniqueIdentifier = () => {
  if (IS_PRODUCTION) return BASE_BUNDLE_ID;
  if (IS_PREVIEW) return `${BASE_BUNDLE_ID}.preview`;
  return `${BASE_BUNDLE_ID}.dev`;
};

const getAppName = () => {
  const baseName = "Grooted";
  if (IS_PRODUCTION) return baseName;
  if (IS_PREVIEW) return `${baseName} (Preview)`;
  return `${baseName} (Dev)`;
};

const getScheme = () => {
  if (IS_PRODUCTION) return "grooted";
  if (IS_PREVIEW) return "grooted-preview";
  return "grooted-dev";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "grooted",
  owner: "grooted",
  version: "1.0.0",
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
    appVariant: process.env.APP_VARIANT,
  },
  orientation: "portrait",
  icon: IS_DEV
    ? "./assets/icons/dev-adaptive-icon.png"
    : "./assets/icons/adaptive-icon.png",
  scheme: getScheme(),
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  description:
    "Grooted — A real-world farming RPG. Grow plants, claim territory, compete with friends, and turn your city green. Streak-based daily logs, AI plant scanning, and geo-based leaderboards.",
  splash: {
    image: "./assets/icons/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#1A3C2A",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    buildNumber: "1",
    // googleServicesFile — uncomment when Firebase is configured
    // googleServicesFile: IS_DEV
    //   ? "./GoogleService-Info-dev.plist"
    //   : IS_PREVIEW
    //     ? "./GoogleService-Info-preview.plist"
    //     : "./GoogleService-Info.plist",
    infoPlist: {
      NSCameraUsageDescription:
        "Grooted uses the camera to scan your plants and log your daily streak.",
      NSPhotoLibraryUsageDescription:
        "Grooted needs photo access to upload plant photos for your streak log.",
      NSLocationWhenInUseUsageDescription:
        "Grooted uses your location to show your territory on the Farm Map and find nearby Seed Drops.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "Grooted uses background location to notify you about nearby Seed Drops and Green Zones.",
      NSUserTrackingUsageDescription:
        "This identifier will be used to deliver personalized content.",
    },
    icon: {
      dark: "./assets/icons/ios-dark.png",
      light: "./assets/icons/ios-light.png",
      tinted: "./assets/icons/ios-tinted.png",
    },
  },
  android: {
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: IS_DEV
        ? "./assets/icons/dev-adaptive-icon.png"
        : "./assets/icons/adaptive-icon.png",
      monochromeImage: IS_DEV
        ? "./assets/icons/dev-adaptive-icon.png"
        : "./assets/icons/adaptive-icon.png",
      backgroundColor: "#1A3C2A",
    },
    package: getUniqueIdentifier(),
    // googleServicesFile: "./google-services.json", // uncomment when Firebase is configured
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      },
    },
    permissions: [
      "CAMERA",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE",
      "USE_BIOMETRIC",
      "USE_FINGERPRINT",
    ],
    intentFilters: [
      {
        action: "VIEW",
        data: [{ scheme: getScheme() }],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-font",
    "expo-web-browser",
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 24,
        },
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission:
          "Grooted needs camera access to scan plants and log your daily streak.",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Grooted uses your location to show territory and find Seed Drops.",
        locationAlwaysPermission:
          "Grooted uses background location to notify you about nearby Seed Drops.",
        locationWhenInUsePermission:
          "Grooted uses your location to show your territory on the Farm Map.",
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "Grooted needs photo access to upload plant photos for your streak.",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#1A3C2A",
        image: "./assets/icons/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        dark: {
          image: "./assets/icons/splash-icon.png",
          backgroundColor: "#0D1F15",
        },
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/icons/notification-icon.png",
        color: "#2ECC71",
      },
    ],
    [
      "expo-local-authentication",
      {
        faceIDPermission:
          "Allow Grooted to use Face ID for quick authentication.",
      },
    ],
    "./plugins/withGradleMemory",
    // Firebase — uncomment when google-services.json is configured
    // "@react-native-firebase/app",
    // "@react-native-firebase/messaging",
    // Dev client only in development
    ...(IS_DEV ? ["expo-dev-client"] : []),
  ],
  notification: {
    icon: "./assets/icons/notification-icon.png",
    color: "#2ECC71",
    androidMode: "default",
    androidCollapsedTitle: "Grooted",
  },
  experiments: {
    typedRoutes: true,
  },
  updates: {
    enabled: true,
    checkAutomatically: "ON_LOAD",
    fallbackToCacheTimeout: 0,
    url: process.env.EXPO_PUBLIC_UPDATE_URL || undefined,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
