import Constants from "expo-constants";

export const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  "http://localhost:3000";

export const sessionMaxIdleMs = 1000 * 60 * 60 * 24 * 14;
