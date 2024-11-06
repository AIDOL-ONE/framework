// tests/integration/api/social.test.js
const { SocialMediaClient } = require('../../../src/services/api/socialMedia');

describe('Social Media Integration Tests', () => {
  let socialClient;

  beforeAll(() => {
    socialClient = new SocialMediaClient({
      twitterCredentials: {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET
      },
      telegramCredentials: {
        token: process.env.TELEGRAM_BOT_TOKEN
      }
    });
  });

  describe('Telegram', () => {
    it('should send message to Telegram channel', async () => {
      const result = await socialClient.telegramSend({
        chatId: process.env.TELEGRAM_CHAT_ID,
        text: 'Test message from integration tests'
      });

      expect(result.data.ok).toBe(true);
    });
  });

  describe('Twitter', () => {
    it('should post tweet', async () => {
      const result = await socialClient.tweetPost({
        text: 'Test tweet from integration tests #AIDOL'
      });

      expect(result).toBeDefined();
      // Add more specific assertions based on Twitter API response
    });
  });
});