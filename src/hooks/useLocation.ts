import { useEffect, useState } from "react";
import * as Location from "expo-location";
import type { Coordinates } from "@/types/map";
import { requestLocationPermission } from "@/lib/permissions";

export const useLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!(await requestLocationPermission())) return;
      const current = await Location.getCurrentPositionAsync({});
      if (mounted) {
        setLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return location;
};
