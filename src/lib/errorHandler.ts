import * as Sentry from "@sentry/react-native";

export enum ErrorType {
  NETWORK = "NETWORK",
  AUTHENTICATION = "AUTHENTICATION",
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT = "RATE_LIMIT",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

export class GrootedError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public code = "UNKNOWN",
    public status?: number,
  ) {
    super(message);
    this.name = "GrootedError";
  }
}

const messages: Record<string, string> = {
  AUTH_EXPIRED: "Your session expired. Please sign in again.",
  NETWORK_OFFLINE: "You appear to be offline. Check your connection.",
  RATE_LIMITED: "Too many requests. Give it a moment and try again.",
  VALIDATION_FAILED: "Some details need attention before continuing.",
};

export const getUserFriendlyMessage = (error: unknown) => {
  if (error instanceof GrootedError) {
    return messages[error.code] ?? error.message;
  }
  return "Something went wrong. Please try again.";
};

export const isRetryableError = (error: unknown) =>
  error instanceof GrootedError &&
  [ErrorType.NETWORK, ErrorType.RATE_LIMIT].includes(error.type);

export const logError = (error: unknown, context?: Record<string, unknown>) => {
  if (__DEV__) {
    console.error("[Grooted]", error, context);
    return;
  }
  Sentry.captureException(error, { extra: context });
};

export const ErrorBoundaryHelper = {
  capture: (error: Error, errorInfo?: Record<string, unknown>) =>
    logError(error, errorInfo),
};
