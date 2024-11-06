// src/services/api/base.js
/**
 * Base API client for handling common API operations
 * Provides rate limiting, error handling, and retry logic
 */
class BaseApiClient {
    constructor(config) {
      this.config = {
        maxRetries: 3,
        retryDelay: 1000,
        timeout: 30000,
        ...config
      };
  
      this.rateLimiter = new Map();
    }
  
    /**
     * Make API request with retry and rate limiting
     * @param {Object} options - Request options
     * @returns {Promise} API response
     */
    async makeRequest(options) {
      let lastError;
      
      for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
        try {
          await this._checkRateLimit(options.endpoint);
          const response = await this._executeRequest(options);
          this._updateRateLimit(options.endpoint, response.headers);
          return response.data;
        } catch (error) {
          lastError = error;
          if (!this._shouldRetry(error, attempt)) {
            throw error;
          }
          await this._delay(attempt);
        }
      }
  
      throw lastError;
    }
  
    // Private helper methods
    async _executeRequest(options) {
      // Implement actual request logic
      throw new Error('_executeRequest must be implemented by specific API client');
    }
  
    async _checkRateLimit(endpoint) {
      const limit = this.rateLimiter.get(endpoint);
      if (limit && limit.reset > Date.now()) {
        const delay = limit.reset - Date.now();
        await this._delay(delay);
      }
    }
  
    _updateRateLimit(endpoint, headers) {
      if (headers['x-ratelimit-remaining'] && headers['x-ratelimit-reset']) {
        this.rateLimiter.set(endpoint, {
          remaining: parseInt(headers['x-ratelimit-remaining']),
          reset: parseInt(headers['x-ratelimit-reset']) * 1000
        });
      }
    }
  
    _shouldRetry(error, attempt) {
      return attempt < this.config.maxRetries && 
             (error.status === 429 || (error.status >= 500 && error.status < 600));
    }
  
    _delay(attempt) {
      const delay = this.config.retryDelay * Math.pow(2, attempt);
      return new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  