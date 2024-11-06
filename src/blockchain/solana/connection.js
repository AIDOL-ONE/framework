// src/blockchain/solana/connection.js
const { Connection, clusterApiUrl } = require('@solana/web3.js');
const logger = require('../../config/logger');

/**
 * Manages Solana blockchain connections
 */
class SolanaConnection {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  /**
   * Initialize Solana connection
   */
  initialize() {
    try {
      const endpoint = this.config.endpoint || clusterApiUrl('mainnet-beta');
      this.connection = new Connection(endpoint, 'confirmed');
      logger.info('Solana connection initialized');
    } catch (error) {
      logger.error('Failed to initialize Solana connection:', error);
      throw error;
    }
  }

  getConnection() {
    if (!this.connection) {
      this.initialize();
    }
    return this.connection;
  }
}

module.exports = SolanaConnection;