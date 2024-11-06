// src/blockchain/solana/transactions.js
const { Transaction, SystemProgram, PublicKey } = require('@solana/web3.js');
const logger = require('../../config/logger');

/**
 * Manages Solana transactions
 */
class TransactionManager {
  constructor(connection) {
    this.connection = connection;
  }

  /**
   * Create and send transaction
   */
  async sendTransaction(instructions, signers) {
    try {
      const transaction = new Transaction();
      transaction.add(...instructions);

      // Get recent blockhash
      const { blockhash } = await this.connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;

      // Sign transaction
      transaction.sign(...signers);

      // Send transaction
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize()
      );

      // Confirm transaction
      await this.connection.confirmTransaction(signature);

      return signature;
    } catch (error) {
      logger.error('Transaction failed:', error);
      throw error;
    }
  }

  // TODO: Implement specific transaction types
}