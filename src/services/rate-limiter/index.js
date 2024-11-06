// src/services/rate-limiter/index.js
const { RateLimiterMemory } = require('rate-limiter-flexible');
const logger = require('../../config/logger');

/**
 * Rate limiter for API calls
 */
class RateLimiterService {
  constructor() {
    this.limiters = new Map();
  }

  /**
   * Create or get rate limiter for specific service
   */
  getLimiter(service) {
    if (!this.limiters.has(service)) {
      const config = this.getServiceConfig(service);
      this.limiters.set(
        service,
        new RateLimiterMemory(config)
      );
    }
    return this.limiters.get(service);
  }

  /**
   * Get service-specific rate limit configuration
   */
  getServiceConfig(service) {
    const configs = {
      'openai': { points: 60, duration: 60 }, // 60 requests per minute
      'solana-rpc': { points: 100, duration: 60 }, // 100 requests per minute
      'social': { points: 30, duration: 60 } // 30 requests per minute
    };
    return configs[service] || { points: 30, duration: 60 };
  }

  /**
   * Consume rate limit points
   */
  async consume(service, points = 1) {
    try {
      const limiter = this.getLimiter(service);
      await limiter.consume(service, points);
    } catch (error) {
      logger.warn(`Rate limit exceeded for ${service}`);
      throw error;
    }
  }
}