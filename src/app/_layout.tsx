import { useFonts } from "expo-font";
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
  const [fontsLoaded] = useFonts({});

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
