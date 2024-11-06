// src/services/api/index.js
const { OpenAIClient } = require('./openai');
const { ElevenLabsClient } = require('./elevenlabs');
const { ClaudeClient } = require('./claude');
const { SunoAIClient } = require('./sunoai');
const { SocialMediaClient } = require('./socialMedia');
const { Gen3Client } = require('./gen3');
const logger = require('../../config/logger');

/**
 * API Service manager for handling all API integrations
 */
class ApiService {
  constructor(config) {
    this.clients = new Map();
    this.initialize(config);
  }

  /**
   * Initialize API clients
   * @param {Object} config - API configuration
   */
  initialize(config) {
    try {
      this.clients.set('openai', new OpenAIClient({
        apiKey: config.openaiApiKey,
        maxRetries: 3,
        timeout: 30000
      }));

      this.clients.set('elevenlabs', new ElevenLabsClient({
        apiKey: config.elevenlabsApiKey,
        maxRetries: 2,
        timeout: 60000
      }));

      // New clients
      this.clients.set('claude', new ClaudeClient(config.claude));
      this.clients.set('sunoai', new SunoAIClient(config.sunoai));
      this.clients.set('social', new SocialMediaClient(config.social));
      this.clients.set('gen3', new Gen3Client(config.gen3));
      logger.info('API clients initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize API clients:', error);
      throw error;
    }
  }

  /**
   * Get specific API client
   * @param {string} clientName - Name of the API client
   * @returns {BaseApiClient} API client instance
   */
  getClient(clientName) {
    const client = this.clients.get(clientName);
    if (!client) {
      throw new Error(`API client '${clientName}' not found`);
    }
    return client;
  }

  /**
   * Create conversational response using AI
   * @param {Object} params - Conversation parameters
   * @returns {Promise<Object>} AI response
   */
  async createResponse(params) {
    const openai = this.getClient('openai');
    try {
      const completion = await openai.createCompletion({
        messages: params.messages,
        temperature: params.temperature,
        maxTokens: params.maxTokens
      });

      return completion.choices[0].message;
    } catch (error) {
      logger.error('Error creating AI response:', error);
      throw error;
    }
  }

  /**
   * Generate voice content
   * @param {Object} params - Voice generation parameters
   * @returns {Promise<Buffer>} Audio buffer
   */
  async generateVoiceContent(params) {
    const elevenlabs = this.getClient('elevenlabs');
    try {
      return await elevenlabs.generateSpeech({
        text: params.text,
        voiceId: params.voiceId
      });
    } catch (error) {
      logger.error('Error generating voice content:', error);
      throw error;
    }
  }

   /**
   * Generate music content using Suno AI
   */
   async generateMusic(params) {
    const sunoai = this.getClient('sunoai');
    try {
      return await sunoai.generateMusic({
        prompt: params.prompt,
        style: params.style,
        tempo: params.tempo
      });
    } catch (error) {
      logger.error('Error generating music:', error);
      throw error;
    }
  }

  /**
   * Post content to social media platforms
   */
  async postToSocial(params) {
    const social = this.getClient('social');
    const results = {};

    if (params.twitter) {
      results.twitter = await social.tweetPost(params.twitter);
    }
    if (params.instagram) {
      results.instagram = await social.instagramPost(params.instagram);
    }
    if (params.telegram) {
      results.telegram = await social.telegramSend(params.telegram);
    }

    return results;
  }
}