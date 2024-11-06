// src/types/api.js
/**
 * Type definitions for API related functionality
 */

/**
 * @typedef {Object} ApiConfig
 * @property {string} endpoint - API endpoint URL
 * @property {string} version - API version
 * @property {ApiCredentials} credentials - API credentials
 * @property {Object} options - Additional options
 */

/**
 * @typedef {Object} ApiCredentials
 * @property {string} apiKey - API key
 * @property {string} [apiSecret] - API secret
 * @property {string} [accessToken] - Access token
 * @property {number} [expiresAt] - Token expiration timestamp
 */

/**
 * @typedef {Object} ApiRequest
 * @property {string} method - HTTP method
 * @property {string} endpoint - API endpoint
 * @property {Object} [data] - Request payload
 * @property {Object} [params] - Query parameters
 * @property {Object} [headers] - Request headers
 * @property {Object} [options] - Request options
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Success status
 * @property {Object|Array} [data] - Response data
 * @property {string} [error] - Error message
 * @property {Object} [metadata] - Response metadata
 * @property {number} statusCode - HTTP status code
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {string} code - Error code
 * @property {number} statusCode - HTTP status code
 * @property {Object} [details] - Additional error details
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - Page number
 * @property {number} limit - Items per page
 * @property {string} [sortBy] - Sort field
 * @property {string} [sortOrder] - Sort order (asc/desc)
 */

/**
 * @typedef {Object} ApiPagination
 * @property {number} totalItems - Total number of items
 * @property {number} totalPages - Total number of pages
 * @property {number} currentPage - Current page number
 * @property {number} itemsPerPage - Items per page
 * @property {boolean} hasNext - Has next page
 * @property {boolean} hasPrev - Has previous page
 */

// Type validators
const validators = {
    /**
     * Validate API request object
     * @param {ApiRequest} request - Request to validate
     * @returns {boolean} Validation result
     */
    isValidRequest: (request) => {
      return Boolean(
        request &&
        typeof request.method === 'string' &&
        typeof request.endpoint === 'string'
      );
    },
  
    /**
     * Validate API response object
     * @param {ApiResponse} response - Response to validate
     * @returns {boolean} Validation result
     */
    isValidResponse: (response) => {
      return Boolean(
        response &&
        typeof response.success === 'boolean' &&
        typeof response.statusCode === 'number'
      );
    },
  
    /**
     * Validate pagination parameters
     * @param {PaginationParams} params - Parameters to validate
     * @returns {boolean} Validation result
     */
    isValidPaginationParams: (params) => {
      return Boolean(
        params &&
        typeof params.page === 'number' &&
        typeof params.limit === 'number' &&
        params.page > 0 &&
        params.limit > 0
      );
    }
  };
  
  module.exports = {
    validators,
    // Add type definitions using JSDoc
    // These will be used by IDEs and documentation tools
  };
  