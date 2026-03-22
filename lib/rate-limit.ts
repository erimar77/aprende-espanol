/**
 * Lightweight in-memory rate limiter
 * Uses a Map with timestamps to track requests
 */

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  limit: number;    // Max requests per interval
}

interface RateLimitCheck {
  success: boolean;
  remaining: number;
}

/**
 * Create a rate limiter with the specified config
 * Returns a function that checks if an identifier has exceeded the limit
 */
export function rateLimit(config: RateLimitConfig) {
  const store = new Map<string, number[]>();

  // Cleanup function to remove old entries periodically
  const cleanup = () => {
    const now = Date.now();
    for (const [key, timestamps] of store.entries()) {
      // Remove timestamps outside the interval window
      const validTimestamps = timestamps.filter(ts => now - ts < config.interval);

      if (validTimestamps.length === 0) {
        store.delete(key);
      } else {
        store.set(key, validTimestamps);
      }
    }
  };

  // Run cleanup every 60 seconds to prevent memory buildup
  setInterval(cleanup, 60000);

  /**
   * Check if the identifier has exceeded the rate limit
   * @param identifier - Unique identifier (e.g., IP address)
   * @returns Object with success flag and remaining requests
   */
  return function check(identifier: string): RateLimitCheck {
    const now = Date.now();
    const timestamps = store.get(identifier) || [];

    // Remove timestamps outside the interval window
    const validTimestamps = timestamps.filter(ts => now - ts < config.interval);

    // Check if we're at the limit
    if (validTimestamps.length >= config.limit) {
      return {
        success: false,
        remaining: 0,
      };
    }

    // Add the current request timestamp
    validTimestamps.push(now);
    store.set(identifier, validTimestamps);

    return {
      success: true,
      remaining: config.limit - validTimestamps.length,
    };
  };
}
