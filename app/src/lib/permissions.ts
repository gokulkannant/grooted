import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export const requestCameraPermission = async () => {
  const result = await Camera.requestCameraPermissionsAsync();
  return result.granted;
};

export const requestLocationPermission = async () => {
  const result = await Location.requestForegroundPermissionsAsync();
  return result.granted;
};

export const requestNotificationPermission = async () => {
  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
};
