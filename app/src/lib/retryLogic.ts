import { isRetryableError } from "@/lib/errorHandler";

export type RetryConfig = {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
};

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelay: 300,
  maxDelay: 4000,
  backoffMultiplier: 2,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRetryDelay = (attempt: number, config = defaultRetryConfig) => {
  const exponential = config.initialDelay * config.backoffMultiplier ** attempt;
  const capped = Math.min(exponential, config.maxDelay);
  const jitter = capped * (Math.random() * 0.5 - 0.25);
  return Math.max(0, capped + jitter);
};

export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  config = defaultRetryConfig,
): Promise<T> => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt >= config.maxRetries || !isRetryableError(error)) break;
      await delay(getRetryDelay(attempt, config));
    }
  }
  throw lastError;
};

export class RetryManager {
  attempt = 0;
  isRetrying = false;

  constructor(private config = defaultRetryConfig) {}

  async run<T>(operation: () => Promise<T>) {
    this.isRetrying = true;
    try {
      return await retryWithBackoff(async () => {
        this.attempt += 1;
        return operation();
      }, this.config);
    } finally {
      this.isRetrying = false;
    }
  }
}

export const makeRetryable =
  <Args extends unknown[], Result>(
    fn: (...args: Args) => Promise<Result>,
    config?: RetryConfig,
  ) =>
  (...args: Args) =>
    retryWithBackoff(() => fn(...args), config);
