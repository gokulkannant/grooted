import * as Application from "expo-application";
import * as Device from "expo-device";

export const getDeviceId = async () => {
  const fallback = `${Device.osName ?? "unknown"}-${Device.modelName ?? "device"}`;
  return Application.getAndroidId() ?? fallback;
};
