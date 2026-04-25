import { useFonts } from "expo-font";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold
} from "@expo-google-fonts/space-grotesk";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { useNetwork } from "@/hooks/useNetwork";
import { useNotifications } from "@/hooks/useNotifications";
import { initSentry } from "@/lib/sentry";
import { useAuthStore } from "@/stores/authStore";
import { sessionMaxIdleMs } from "@/utils/constants";

void SplashScreen.preventAutoHideAsync();
initSentry();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { register } = useNotifications();
  const { isOnline } = useNetwork();
  const { hasHydrated, isAuthenticated, lastActivityAt, clearAuth } = useAuthStore();
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
    "SpaceGrotesk-Medium": SpaceGrotesk_500Medium,
    "SpaceGrotesk-Bold": SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (!hasHydrated || !fontsLoaded) return;
    void SplashScreen.hideAsync();
  }, [fontsLoaded, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated || !fontsLoaded) return;
    if (lastActivityAt && Date.now() - lastActivityAt > sessionMaxIdleMs) {
      clearAuth();
      return;
    }
    const group = segments[0];
    const inAuthGroup = group === "(auth)";
    if (!isAuthenticated && !inAuthGroup) router.replace("/login");
    if (isAuthenticated && (inAuthGroup || group === undefined)) router.replace("/home");
  }, [clearAuth, fontsLoaded, hasHydrated, isAuthenticated, lastActivityAt, router, segments]);

  useEffect(() => {
    if (isAuthenticated && isOnline) void register();
  }, [isAuthenticated, isOnline, register]);

  if (!hasHydrated || !fontsLoaded) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
