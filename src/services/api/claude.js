// src/services/api/claude.js
const axios = require('axios');
const BaseApiClient = require('./base');
const logger = require('../../config/logger');

/**
 * Anthropic Claude API integration
 */
class ClaudeClient extends BaseApiClient {
  constructor(config) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseURL = 'https://api.anthropic.com/v1';
    this.model = 'claude-3-opus-20240229';
  }

  async createCompletion(params) {
    try {
      return await this.makeRequest({
        method: 'POST',
        endpoint: '/messages',
        data: {
          model: params.model || this.model,
          messages: params.messages,
          max_tokens: params.maxTokens || 1024,
          temperature: params.temperature || 0.7
        }
      });
    } catch (error) {
      logger.error('Claude API error:', error);
      throw error;
    }
  }

  async _executeRequest(options) {
    return await axios({
      method: options.method,
      url: `${this.baseURL}${options.endpoint}`,
      data: options.data,
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      timeout: this.config.timeout
    });
  }
}