// src/services/rate-limiter/strategies.js
/**
 * Rate limiting strategies for different services
 */
class RateLimitStrategies {
    constructor(rateLimiter) {
      this.rateLimiter = rateLimiter;
    }
  
    /**
     * Strategy for API endpoints
     */
    async apiEndpoint(service, action, points = 1) {
      const key = `${service}:${action}`;
      await this.rateLimiter.consume(key, points);
    }
  
    /**
     * Strategy for blockchain operations
     */
    async blockchainOperation(operation, points = 1) {
      const key = `blockchain:${operation}`;
      await this.rateLimiter.consume(key, points);
    }
  
    /**
     * Strategy for content generation
     */
    async contentGeneration(type, points = 1) {
      const key = `content:${type}`;
      await this.rateLimiter.consume(key, points);
    }
  
    /**
     * Get current limits status
     */
    async getLimitsStatus(service) {
      return await this.rateLimiter.getLimiter(service).get(service);
    }
  }
  
  module.exports = RateLimitStrategies;