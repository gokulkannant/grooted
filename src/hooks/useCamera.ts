import { useCallback, useState } from "react";
import { requestCameraPermission } from "@/lib/permissions";

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const request = useCallback(async () => {
    const granted = await requestCameraPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  return { hasPermission, request };
};
