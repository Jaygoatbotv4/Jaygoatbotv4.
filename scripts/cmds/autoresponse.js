const axios = require('axios');

let conversationHistory = {}; // Store conversation history per thread

module.exports = {
  config: {
    name: 'gpt4',
    version: '1.0.0',
    author: 'Jay Pillonar',
    role: 0,
    category: 'GPT4',
    longDescription: {
      en: 'This bot responds to every message with a GPT-4 generated reply, maintaining a continuous conversation.'
    },
    guide: {
      en: `
      Command: (No prefix needed)
      - This command responds to every message with a GPT-4 generated reply, maintaining a continuous conversation.
      `
    }
  },

  onStart: async () => {},

  onChat: async ({ api, event }) => {
    const userMessage = event.body.trim();
    const threadID = event.threadID;

    if (!userMessage) return; // Ignore empty messages
    if (userMessage.startsWith('/')) return; // Ignore messages that start with "/"

    // Initialize conversation history if it does not exist
    if (!conversationHistory[threadID]) {
      conversationHistory[threadID] = '';
    }

    // Append new message to conversation history
    conversationHistory[threadID] += `User: ${userMessage}\n`;

    // Prepare prompt for GPT-4 API
    const gpt4_prompt = conversationHistory[threadID] + 'Bot:';

    try {
      // Send the message to the GPT-4 API for a response
      const response = await axios.get('https://ai-chat-gpt-4-lite.onrender.com/api/hercai', {
        params: { question: gpt4_prompt }
      });

      if (response.status !== 200 || !response.data || !response.data.reply) {
        throw new Error('Invalid or missing response from API');
      }

      // Extract and format the AI response
      const aiResponse = response.data.reply;

      // Update conversation history with bot response
      conversationHistory[threadID] += `Bot: ${aiResponse}\n`;

      // Reply with GPT-4 generated message
      await api.sendMessage(aiResponse, threadID);

    } catch (error) {
      console.error(`Error fetching response: ${error.message}`);
      await api.sendMessage(`✏ An error occurred while processing your request. Error: ${error.message}`, threadID);
    }
  },

  onReply: async () => {
    // Handle replies if needed, otherwise leave this section empty or remove
  }
};
