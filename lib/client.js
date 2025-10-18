const axios = require('axios');

/**
 * Womba API Client
 */
class WombaClient {
  /**
   * Create a new Womba API client
   * @param {string} baseUrl - Base URL of Womba API
   * @param {string} apiKey - API authentication key
   */
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 120000, // 120 seconds for AI generation
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate test cases for a Jira story
   * @param {string} storyKey - Jira story key (e.g., PLAT-12991)
   * @param {boolean} upload - Whether to upload to Zephyr
   * @returns {Promise<Object>} Generation response
   */
  async generateTests(storyKey, upload = false) {
    try {
      const response = await this.client.post('/api/v1/test-plans/generate', {
        issue_key: storyKey,
        upload_to_zephyr: upload
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        // API returned an error response
        const { status, data } = error.response;
        throw new Error(`API error ${status}: ${data.error || data.detail || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error(`No response from API: ${error.message}`);
      } else {
        // Something else happened
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }

  /**
   * Check API health
   * @returns {Promise<Object>} Health check response
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

module.exports = WombaClient;

