import { useCallback, useState } from "react";
import { requestNotificationPermission } from "@/lib/permissions";
import { FCMService } from "@/services/FCMService";

export const useNotifications = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const register = useCallback(async () => {
    if (!(await requestNotificationPermission())) return null;
    const token = await FCMService.getToken();
    setPushToken(token);
    return token;
  }, []);

  return { pushToken, register };
};
