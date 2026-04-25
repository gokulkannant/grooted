// Firebase messaging — stubbed out until Firebase is configured
// import messaging from "@react-native-firebase/messaging";

export const FCMService = {
  getToken: async () => {
    console.warn("[FCMService] Firebase not configured, skipping getToken");
    return null;
  },
  registerForegroundHandler: (_handler: (message: unknown) => void) => {
    console.warn("[FCMService] Firebase not configured, skipping foreground handler");
    return () => {};
  },
};
