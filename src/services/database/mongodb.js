// src/services/database/mongodb.js
const mongoose = require('mongoose');
const logger = require('../../config/logger');

class DatabaseService {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this._setupMongooseListeners();
  }

  /**
   * Initialize database connection
   */
  async connect() {
    try {
      if (this.connection) {
        return this.connection;
      }

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      };

      this.connection = await mongoose.connect(this.config.uri, options);
      logger.info('Successfully connected to MongoDB');
      
      return this.connection;
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        this.connection = null;
        logger.info('Disconnected from MongoDB');
      }
    } catch (error) {
      logger.error('Failed to disconnect from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Setup mongoose connection event listeners
   */
  _setupMongooseListeners() {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Get current connection status
   */
  getStatus() {
    return {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }

  /**
   * Create indexes for all models
   */
  async createIndexes() {
    try {
      const models = mongoose.modelNames();
      for (const modelName of models) {
        await mongoose.model(modelName).createIndexes();
      }
      logger.info('Database indexes created successfully');
    } catch (error) {
      logger.error('Failed to create database indexes:', error);
      throw error;
    }
  }
}

module.exports = DatabaseService;