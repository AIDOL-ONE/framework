// src/services/api/openai.js
const axios = require('axios');
const { BaseApiClient } = require('./base');
const logger = require('../../config/logger');
const { AppError } = require('../../utils/errors');

/**
 * OpenAI API client for handling AI completions and generations
 */
class OpenAIClient extends BaseApiClient {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseURL = 'https://api.openai.com/v1';
    this.models = {
      gpt4: 'gpt-4-1106-preview',
      gpt35: 'gpt-3.5-turbo-1106'
    };
  }

  /**
   * Generate text completion using GPT models
   * @param {Object} params - Completion parameters
   * @returns {Promise<Object>} Completion response
   */
  async createCompletion(params) {
    try {
      return await this.makeRequest({
        method: 'POST',
        endpoint: '/chat/completions',
        data: {
          model: params.model || this.models.gpt4,
          messages: params.messages,
          temperature: params.temperature || 0.7,
          max_tokens: params.maxTokens || 150,
          presence_penalty: params.presencePenalty || 0,
          frequency_penalty: params.frequencyPenalty || 0
        }
      });
    } catch (error) {
      logger.error('OpenAI completion error:', error);
      throw new AppError('Failed to generate completion');
    }
  }

  /**
   * Generate embeddings for text
   * @param {Object} params - Embedding parameters
   * @returns {Promise<Object>} Embedding response
   */
  async createEmbedding(params) {
    try {
      return await this.makeRequest({
        method: 'POST',
        endpoint: '/embeddings',
        data: {
          model: 'text-embedding-ada-002',
          input: params.input
        }
      });
    } catch (error) {
      logger.error('OpenAI embedding error:', error);
      throw new AppError('Failed to generate embedding');
    }
  }

  async _executeRequest(options) {
    return await axios({
      method: options.method,
      url: `${this.baseURL}${options.endpoint}`,
      data: options.data,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: this.config.timeout
    });
  }
}