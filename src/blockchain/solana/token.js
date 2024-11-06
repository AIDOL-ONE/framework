// src/blockchain/solana/token.js
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const { PublicKey } = require('@solana/web3.js');
const logger = require('../../config/logger');

/**
 * Manages AIDOL token operations
 */
class AIDOLToken {
  constructor(connection, config) {
    this.connection = connection;
    this.mintAddress = new PublicKey(config.mintAddress);
    this.token = null;
  }

  /**
   * Initialize token instance
   */
  async initialize() {
    try {
      this.token = new Token(
        this.connection,
        this.mintAddress,
        TOKEN_PROGRAM_ID,
        null // We'll implement proper payer management
      );
      logger.info('AIDOL token initialized');
    } catch (error) {
      logger.error('Failed to initialize AIDOL token:', error);
      throw error;
    }
  }

  /**
   * Get token account balance
   */
  async getBalance(accountAddress) {
    try {
      const account = await this.token.getAccountInfo(new PublicKey(accountAddress));
      return account.amount;
    } catch (error) {
      logger.error('Failed to get token balance:', error);
      throw error;
    }
  }

  // TODO: Implement additional token operations
}