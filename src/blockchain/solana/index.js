// src/blockchain/solana/index.js
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const SolanaConnection = require('./connection');
const AIDOLToken = require('./token');
const TransactionManager = require('./transactions');
const logger = require('../../config/logger');

/**
 * Main Solana blockchain integration service
 * Manages all blockchain-related operations
 */
class SolanaService {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this.token = null;
    this.transactionManager = null;
    this.programId = new PublicKey(config.programId);
  }

  /**
   * Initialize blockchain service
   */
  async initialize() {
    try {
      // Initialize connection
      this.connection = new SolanaConnection(this.config);
      await this.connection.initialize();

      // Initialize token
      this.token = new AIDOLToken(
        this.connection.getConnection(),
        this.config
      );
      await this.token.initialize();

      // Initialize transaction manager
      this.transactionManager = new TransactionManager(
        this.connection.getConnection()
      );

      logger.info('Solana service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Solana service:', error);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(address) {
    try {
      const publicKey = new PublicKey(address);
      return await this.connection.getConnection().getAccountInfo(publicKey);
    } catch (error) {
      logger.error('Failed to get account info:', error);
      throw error;
    }
  }

  /**
   * Get token balance for address
   */
  async getTokenBalance(address) {
    try {
      return await this.token.getBalance(address);
    } catch (error) {
      logger.error('Failed to get token balance:', error);
      throw error;
    }
  }

  /**
   * Execute token transfer
   */
  async transferTokens(params) {
    try {
      const { from, to, amount } = params;
      const instruction = await this.token.createTransferInstruction(
        from,
        to,
        amount
      );
      
      return await this.transactionManager.sendTransaction(
        [instruction],
        [params.signer]
      );
    } catch (error) {
      logger.error('Failed to transfer tokens:', error);
      throw error;
    }
  }

  /**
   * Interact with AIDOL program
   */
  async executeProgramInstruction(instruction, signers = []) {
    try {
      return await this.transactionManager.sendTransaction(
        [instruction],
        signers
      );
    } catch (error) {
      logger.error('Failed to execute program instruction:', error);
      throw error;
    }
  }
}

module.exports = SolanaService;