// src/services/cache/index.js
const mcache = require('memory-cache');
const logger = require('../../config/logger');

/**
 * Cache service for API responses and blockchain data
 */
class CacheService {
  constructor(config = {}) {
    this.defaultTTL = config.defaultTTL || 5 * 60 * 1000; // 5 minutes
  }

  set(key, value, ttl = this.defaultTTL) {
    return mcache.put(key, value, ttl);
  }

  get(key) {
    return mcache.get(key);
  }

  del(key) {
    return mcache.del(key);
  }

  clear() {
    return mcache.clear();
  }
}