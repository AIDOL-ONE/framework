
// src/config/blockchain.js
/**
 * Blockchain configuration
 */
module.exports = {
    solana: {
      cluster: process.env.SOLANA_CLUSTER || 'devnet',
      endpoint: process.env.SOLANA_RPC_ENDPOINT,
      tokenAddress: process.env.AIDOL_TOKEN_ADDRESS,
      treasuryAddress: process.env.TREASURY_ADDRESS,
      programId: process.env.PROGRAM_ID
    }
  };
  