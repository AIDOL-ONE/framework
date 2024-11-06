// src/services/api/sunoai.js
/**
 * Suno AI API integration for music generation
 */
class SunoAIClient extends BaseApiClient {
    constructor(config) {
      super(config);
      this.apiKey = config.apiKey;
      this.baseURL = 'https://api.suno.ai/v1';
    }
  
    /**
     * Generate music using Suno AI
     */
    async generateMusic(params) {
      try {
        return await this.makeRequest({
          method: 'POST',
          endpoint: '/generate',
          data: {
            prompt: params.prompt,
            duration: params.duration || 30,
            style: params.style,
            tempo: params.tempo,
            // Add other music generation parameters
          }
        });
      } catch (error) {
        logger.error('Suno AI generation error:', error);
        throw error;
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