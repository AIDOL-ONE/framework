// src/services/cache/strategies.js
/**
 * Different caching strategies for various data types
 */
class CacheStrategy {
    constructor(cache) {
      this.cache = cache;
    }
  
    /**
     * Strategy for API responses
     */
    async apiResponse(key, fetchFn, options = {}) {
      const cached = this.cache.get(key);
      if (cached) return cached;
  
      const data = await fetchFn();
      this.cache.set(key, data, options.ttl);
      return data;
    }
  
    /**
     * Strategy for blockchain data
     */
    async blockchainData(key, fetchFn, options = {}) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < (options.maxAge || 5000)) {
        return cached.data;
      }
  
      const data = await fetchFn();
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      }, options.ttl);
      return data;
    }
  
    /**
     * Strategy for user data
     */
    async userData(key, fetchFn, options = {}) {
      const cached = this.cache.get(key);
      if (cached && !options.forceRefresh) return cached;
  
      const data = await fetchFn();
      this.cache.set(key, data, options.ttl || 300000); // 5 minutes default
      return data;
    }
  }
  
module.exports = CacheStrategy;