import { GrootedError, ErrorType } from "@/lib/errorHandler";
import { retryWithBackoff } from "@/lib/retryLogic";
import { SecureAPIClient } from "@/services/SecureAPIClient";
import { TokenManager } from "@/services/TokenManager";
import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { apiUrl } from "@/utils/constants";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const classifyStatus = (status: number) => {
  if (status === 401 || status === 403) return ErrorType.AUTHENTICATION;
  if (status === 404) return ErrorType.NOT_FOUND;
  if (status === 422 || status === 400) return ErrorType.VALIDATION;
  if (status === 429) return ErrorType.RATE_LIMIT;
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.UNKNOWN;
};

const makeRequest = async <T>(
  path: string,
  method: Method,
  body?: unknown,
): Promise<T> => {
  if (TokenManager.isInvalidated()) {
    throw new GrootedError(ErrorType.AUTHENTICATION, "Session invalidated", "AUTH_EXPIRED", 401);
  }

  const { accessToken, clearAuth } = useAuthStore.getState();
  const language = useSettingsStore.getState().language;
  const response = await SecureAPIClient.request(`${apiUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Accept-Language": language,
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    TokenManager.invalidate();
    clearAuth();
  }

  if (!response.ok) {
    throw new GrootedError(
      classifyStatus(response.status),
      `Request failed with status ${response.status}`,
      response.status === 429 ? "RATE_LIMITED" : "REQUEST_FAILED",
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

export const apiRequest = <T>(path: string, method: Method, body?: unknown) =>
  retryWithBackoff(() => makeRequest<T>(path, method, body));

export const get = <T>(path: string) => apiRequest<T>(path, "GET");
export const post = <T>(path: string, body?: unknown) => apiRequest<T>(path, "POST", body);
export const put = <T>(path: string, body?: unknown) => apiRequest<T>(path, "PUT", body);
export const patch = <T>(path: string, body?: unknown) => apiRequest<T>(path, "PATCH", body);
export const del = <T>(path: string) => apiRequest<T>(path, "DELETE");
