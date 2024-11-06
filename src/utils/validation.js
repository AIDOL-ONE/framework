// src/utils/validation.js
const { ValidationError } = require('./errors');
const logger = require('../config/logger');

/**
 * Validation utility functions for the AIDOL framework
 */
class Validation {
  /**
   * Validate message structure and content
   * @param {Object} message - Message to validate
   * @throws {ValidationError} If validation fails
   */
  static validateMessage(message) {
    if (!message) {
      throw new ValidationError('Message object is required');
    }

    // Validate role
    if (!message.role || !['system', 'user', 'assistant', 'idol', 'manager'].includes(message.role)) {
      throw new ValidationError('Invalid message role');
    }

    // Validate content
    if (!message.content || typeof message.content !== 'string') {
      throw new ValidationError('Invalid message content');
    }

    // Validate metadata if present
    if (message.metadata) {
      if (typeof message.metadata !== 'object') {
        throw new ValidationError('Metadata must be an object');
      }

      if (message.metadata.timestamp && isNaN(new Date(message.metadata.timestamp).getTime())) {
        throw new ValidationError('Invalid metadata timestamp');
      }
    }

    return true;
  }

  /**
   * Validate action structure and parameters
   * @param {Object} action - Action to validate
   * @throws {ValidationError} If validation fails
   */
  static validateAction(action) {
    if (!action) {
      throw new ValidationError('Action object is required');
    }

    // Validate action type
    if (!action.type || typeof action.type !== 'string') {
      throw new ValidationError('Invalid action type');
    }

    // Validate payload
    if (!action.payload || typeof action.payload !== 'object') {
      throw new ValidationError('Action payload must be an object');
    }

    // Validate metadata
    if (!action.metadata || typeof action.metadata !== 'object') {
      throw new ValidationError('Action metadata must be an object');
    }

    if (!action.metadata.initiator) {
      throw new ValidationError('Action initiator is required');
    }

    // Validate priority if present
    if (action.metadata.priority !== undefined) {
      const priority = Number(action.metadata.priority);
      if (isNaN(priority) || priority < 1 || priority > 5) {
        throw new ValidationError('Priority must be a number between 1 and 5');
      }
    }

    return true;
  }

  /**
   * Validate blockchain address format
   * @param {string} address - Address to validate
   * @throws {ValidationError} If validation fails
   */
  static validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new ValidationError('Address must be a string');
    }

    // Basic Solana address format validation
    if (!address.match(/^[A-HJ-NP-Za-km-z1-9]{32,44}$/)) {
      throw new ValidationError('Invalid blockchain address format');
    }

    return true;
  }

  /**
   * Validate API request parameters
   * @param {Object} request - Request to validate
   * @throws {ValidationError} If validation fails
   */
  static validateApiRequest(request) {
    if (!request || typeof request !== 'object') {
      throw new ValidationError('Request must be an object');
    }

    // Validate required fields
    const requiredFields = ['method', 'endpoint'];
    for (const field of requiredFields) {
      if (!request[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Validate method
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method.toUpperCase())) {
      throw new ValidationError('Invalid HTTP method');
    }

    // Validate endpoint
    if (typeof request.endpoint !== 'string' || !request.endpoint.startsWith('/')) {
      throw new ValidationError('Invalid endpoint format');
    }

    return true;
  }

  /**
   * Validate pagination parameters
   * @param {Object} params - Pagination parameters
   * @throws {ValidationError} If validation fails
   */
  static validatePagination(params) {
    if (!params || typeof params !== 'object') {
      throw new ValidationError('Pagination parameters must be an object');
    }

    // Validate page number
    if (params.page !== undefined) {
      const page = Number(params.page);
      if (isNaN(page) || page < 1) {
        throw new ValidationError('Page must be a positive number');
      }
    }

    // Validate limit
    if (params.limit !== undefined) {
      const limit = Number(params.limit);
      if (isNaN(limit) || limit < 1 || limit > 100) {
        throw new ValidationError('Limit must be a number between 1 and 100');
      }
    }

    // Validate sort parameters if present
    if (params.sortBy) {
      if (typeof params.sortBy !== 'string') {
        throw new ValidationError('sortBy must be a string');
      }

      if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder.toLowerCase())) {
        throw new ValidationError('sortOrder must be either "asc" or "desc"');
      }
    }

    return true;
  }

  /**
   * Validate critique object
   * @param {Object} critique - Critique to validate
   * @throws {ValidationError} If validation fails
   */
  static validateCritique(critique) {
    if (!critique || typeof critique !== 'object') {
      throw new ValidationError('Critique must be an object');
    }

    // Validate required fields
    const requiredFields = ['target', 'content', 'score'];
    for (const field of requiredFields) {
      if (!critique[field]) {
        throw new ValidationError(`Missing required field: ${field}`);
      }
    }

    // Validate score
    const score = Number(critique.score);
    if (isNaN(score) || score < 0 || score > 1) {
      throw new ValidationError('Score must be a number between 0 and 1');
    }

    // Validate suggestions if present
    if (critique.suggestions) {
      if (!Array.isArray(critique.suggestions)) {
        throw new ValidationError('Suggestions must be an array');
      }

      if (!critique.suggestions.every(suggestion => typeof suggestion === 'string')) {
        throw new ValidationError('All suggestions must be strings');
      }
    }

    // Validate metadata if present
    if (critique.metadata) {
      if (typeof critique.metadata !== 'object') {
        throw new ValidationError('Metadata must be an object');
      }

      if (!critique.metadata.critic) {
        throw new ValidationError('Critic identifier is required in metadata');
      }
    }

    return true;
  }

  /**
   * Validate performance metrics
   * @param {Object} metrics - Performance metrics to validate
   * @throws {ValidationError} If validation fails
   */
  static validatePerformanceMetrics(metrics) {
    if (!metrics || typeof metrics !== 'object') {
      throw new ValidationError('Performance metrics must be an object');
    }

    // Validate numeric metrics
    const numericMetrics = ['responseTime', 'successRate', 'qualityScore', 'engagementLevel'];
    for (const metric of numericMetrics) {
      if (metrics[metric] !== undefined) {
        const value = Number(metrics[metric]);
        if (isNaN(value) || value < 0) {
          throw new ValidationError(`Invalid value for ${metric}`);
        }
      }
    }

    // Validate resource usage if present
    if (metrics.resourceUsage) {
      const { cpu, memory, api } = metrics.resourceUsage;
      
      if (cpu !== undefined && (isNaN(Number(cpu)) || cpu < 0)) {
        throw new ValidationError('Invalid CPU usage value');
      }
      
      if (memory !== undefined && (isNaN(Number(memory)) || memory < 0)) {
        throw new ValidationError('Invalid memory usage value');
      }
      
      if (api) {
        if (api.calls !== undefined && (!Number.isInteger(api.calls) || api.calls < 0)) {
          throw new ValidationError('API calls must be a non-negative integer');
        }
        
        if (api.costs !== undefined && (isNaN(Number(api.costs)) || api.costs < 0)) {
          throw new ValidationError('API costs must be a non-negative number');
        }
      }
    }

    return true;
  }
}

module.exports = Validation;