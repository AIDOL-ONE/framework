// src/services/api/elevenlabs.js
/**
 * ElevenLabs API client for text-to-speech operations
 */
class ElevenLabsClient extends BaseApiClient {
    constructor(config) {
      super(config);
      this.apiKey = config.apiKey;
      this.baseURL = 'https://api.elevenlabs.io/v1';
    }
  
    /**
     * Generate speech from text
     * @param {Object} params - TTS parameters
     * @returns {Promise<Buffer>} Audio buffer
     */
    async generateSpeech(params) {
      try {
        const response = await this.makeRequest({
          method: 'POST',
          endpoint: '/text-to-speech',
          data: {
            text: params.text,
            voice_id: params.voiceId,
            model_id: params.modelId || 'eleven_monolingual_v1',
            voice_settings: {
              stability: params.stability || 0.5,
              similarity_boost: params.similarityBoost || 0.5
            }
          },
          responseType: 'arraybuffer'
        });
  
        return response;
      } catch (error) {
        logger.error('ElevenLabs TTS error:', error);
        throw new AppError('Failed to generate speech');
      }
    }
  
    /**
     * Get available voices
     * @returns {Promise<Array>} List of available voices
     */
    async getVoices() {
      try {
        return await this.makeRequest({
          method: 'GET',
          endpoint: '/voices'
        });
      } catch (error) {
        logger.error('ElevenLabs voices error:', error);
        throw new AppError('Failed to get voices');
      }
    }
  
    async _executeRequest(options) {
      return await axios({
        method: options.method,
        url: `${this.baseURL}${options.endpoint}`,
        data: options.data,
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        responseType: options.responseType,
        timeout: this.config.timeout
      });
    }
  }