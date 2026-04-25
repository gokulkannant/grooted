import messaging from "@react-native-firebase/messaging";

export const FCMService = {
  getToken: async () => messaging().getToken(),
  registerForegroundHandler: (handler: (message: unknown) => void) =>
    messaging().onMessage(async (message) => handler(message)),
};
