/// <reference types="expo-router/types" />

declare const __DEV__: boolean;

declare namespace NodeJS {
  type ProcessEnv = {
    APP_VARIANT?: "development" | "preview" | "production";
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_SENTRY_DSN?: string;
    EXPO_PUBLIC_UPDATE_URL?: string;
  };
}
