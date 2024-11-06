// src/types/blockchain.js
/**
 * @typedef {Object} BlockchainConfig
 * @property {string} endpoint - RPC endpoint URL
 * @property {string} programId - AIDOL program ID
 * @property {string} tokenAddress - AIDOL token address
 * @property {string} network - Network type (mainnet-beta, testnet, devnet)
 */

/**
 * @typedef {Object} TransactionResult
 * @property {string} signature - Transaction signature
 * @property {string} status - Transaction status
 * @property {number} timestamp - Transaction timestamp
 * @property {Object} [error] - Error details if transaction failed
 */

/**
 * @typedef {Object} TokenInfo
 * @property {string} address - Token address
 * @property {string} name - Token name
 * @property {string} symbol - Token symbol
 * @property {number} decimals - Token decimals
 * @property {string} authority - Token authority
 */

// src/types/api.js
/**
 * @typedef {Object} ApiCredentials
 * @property {string} apiKey - API key
 * @property {string} [apiSecret] - API secret
 * @property {string} [accessToken] - Access token
 * @property {number} [expiresIn] - Token expiration time
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Success status
 * @property {Object|Array} [data] - Response data
 * @property {string} [error] - Error message
 * @property {Object} [metadata] - Response metadata
 */

/**
 * @typedef {Object} ApiRequest
 * @property {string} method - HTTP method
 * @property {string} endpoint - API endpoint
 * @property {Object} [data] - Request payload
 * @property {Object} [params] - Query parameters
 * @property {Object} [headers] - Custom headers
 */

module.exports = {
    // Type validation functions can be added here
    isValidApiResponse: (response) => {
      return response && 
             typeof response.success === 'boolean' &&
             (!response.error || typeof response.error === 'string');
    },
    
    isValidApiRequest: (request) => {
      return request &&
             typeof request.method === 'string' &&
             typeof request.endpoint === 'string';
    }
  };