// src/core/BaseAgent.js
const { validateMessage, validateAction } = require('../utils/validation');
const { AppError } = require('../utils/errors');
const logger = require('../config/logger');
const events = require('./EventEmitter');
const Message = require('../models/Message');
const Action = require('../models/Action');
const Critique = require('../models/Critique');

/**
 * Base Agent class that provides core functionality for all AI agents
 * Implements basic message processing, action execution, and self-criticism
 */
class BaseAgent {
  /**
   * @param {string} id - Unique identifier for the agent
   * @param {Object} options - Configuration options for the agent
   */
  constructor(id, options = {}) {
    this.id = id;
    this.options = {
      maxMemorySize: 1000,
      critiqueProbability: 0.1,
      ...options
    };

    this.memory = [];
    this.state = new Map();
    this.initialized = false;

    // Bind event handlers
    this._setupEventListeners();
  }

  /**
   * Initialize the agent with required setup
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Load previous state if exists
      await this._loadState();
      
      // Register agent in the system
      events.safeEmit('agent:initialized', { 
        id: this.id, 
        type: this.constructor.name 
      });

      this.initialized = true;
      logger.info(`Agent ${this.id} initialized successfully`);
    } catch (error) {
      logger.error(`Failed to initialize agent ${this.id}:`, error);
      throw error;
    }
  }

  /**
   * Process incoming messages and generate appropriate responses
   * @param {Object} message - Message object to process
   * @returns {Promise<Object>} Processed message response
   */
  async processMessage(message) {
    try {
      validateMessage(message);
      
      // Record the incoming message
      await this._recordMemory(message);

      // Generate response (to be implemented by specific agents)
      const response = await this._generateResponse(message);

      // Potentially generate self-critique
      if (Math.random() < this.options.critiqueProbability) {
        await this.provideCritique('message-processing');
      }

      return response;
    } catch (error) {
      logger.error(`Error processing message in agent ${this.id}:`, error);
      throw new AppError(`Message processing failed: ${error.message}`);
    }
  }

  /**
   * Execute an action based on given parameters
   * @param {Object} action - Action object to execute
   * @returns {Promise<boolean>} Success status of action execution
   */
  async executeAction(action) {
    try {
      validateAction(action);

      // Log action start
      const actionRecord = await Action.create({
        ...action,
        metadata: {
          ...action.metadata,
          status: 'processing'
        }
      });

      // Execute action (to be implemented by specific agents)
      const result = await this._executeActionImplementation(action);

      // Update action status
      await Action.findByIdAndUpdate(actionRecord._id, {
        'metadata.status': result ? 'completed' : 'failed'
      });

      return result;
    } catch (error) {
      logger.error(`Error executing action in agent ${this.id}:`, error);
      throw new AppError(`Action execution failed: ${error.message}`);
    }
  }

  /**
   * Generate a critique of the agent's performance
   * @param {string} target - Target aspect to critique
   * @returns {Promise<Object>} Critique object
   */
  async provideCritique(target) {
    try {
      const critique = {
        target,
        content: await this._generateCritique(target),
        suggestions: await this._generateSuggestions(target),
        score: await this._evaluatePerformance(target),
        metadata: {
          critic: this.id,
          timestamp: new Date(),
          context: {
            memorySize: this.memory.length,
            stateSize: this.state.size
          }
        }
      };

      await Critique.create(critique);
      return critique;
    } catch (error) {
      logger.error(`Error generating critique in agent ${this.id}:`, error);
      throw new AppError(`Critique generation failed: ${error.message}`);
    }
  }

  /**
   * Update agent's internal state
   * @param {string} key - State key
   * @param {any} value - State value
   * @returns {Promise<void>}
   */
  async updateState(key, value) {
    try {
      this.state.set(key, value);
      await this._saveState();
    } catch (error) {
      logger.error(`Error updating state in agent ${this.id}:`, error);
      throw new AppError(`State update failed: ${error.message}`);
    }
  }

  // Protected methods to be implemented by specific agents
  async _generateResponse(message) {
    throw new Error('_generateResponse must be implemented by specific agent');
  }

  async _executeActionImplementation(action) {
    throw new Error('_executeActionImplementation must be implemented by specific agent');
  }

  async _generateCritique(target) {
    throw new Error('_generateCritique must be implemented by specific agent');
  }

  async _generateSuggestions(target) {
    throw new Error('_generateSuggestions must be implemented by specific agent');
  }

  async _evaluatePerformance(target) {
    throw new Error('_evaluatePerformance must be implemented by specific agent');
  }

  // Private helper methods
  async _recordMemory(message) {
    this.memory.push(message);
    if (this.memory.length > this.options.maxMemorySize) {
      this.memory.shift();
    }
    await Message.create(message);
  }

  async _loadState() {
    // Implementation for loading state from persistent storage
    // To be implemented based on specific storage requirements
  }

  async _saveState() {
    // Implementation for saving state to persistent storage
    // To be implemented based on specific storage requirements
  }

  _setupEventListeners() {
    events.on('system:shutdown', async () => {
      await this._saveState();
      logger.info(`Agent ${this.id} state saved before shutdown`);
    });

    events.on('memory:clear', async () => {
      this.memory = [];
      logger.info(`Agent ${this.id} memory cleared`);
    });
  }
}

module.exports = BaseAgent;