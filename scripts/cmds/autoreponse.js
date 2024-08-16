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
      en: 'This bot responds to every message with a GPT-4 generated reply, maintaining a continuous conversation with a trash-talking style in Tagalog, including emojis.'
    },
    guide: {
      en: `
      Command: (No prefix needed)
      - This command responds to every message with a GPT-4 generated reply, maintaining a continuous conversation with a Tagalog trash-talking style.
      `
    }
  },

  onStart: async () => {},

  onChat: async ({ api, event }) => {
    const userMessage = event.body.trim();
    const threadID = event.threadID;

    if (!userMessage || userMessage.startsWith('/')) return; // Ignore empty messages and messages starting with "/"

    // Initialize conversation history if it does not exist
    if (!conversationHistory[threadID]) {
      conversationHistory[threadID] = '';
    }

    // Append new message to conversation history
    conversationHistory[threadID] += `User: ${userMessage}\n`;

    // Prepare prompt for GPT-4 API with trash-talking style and a prompt about ChatGPT
    const gpt4_prompt = `
    You are ChatGPT, trained by Jay to respond in a trash-talking style in Tagalog, with playful sarcasm, humor, and plenty of annoying emojis. Respond with the following tone: "Ano malakash kanaba, bata? Feeling malakash ka pa pero puro satsat lang! Wannabe, iyak nayan! HAHAHAHA!" Incorporate phrases like 'wannabe,' 'uubra,' 'ranter,' 'iyak nayan,' 'feeling,' 'kapal ng mukha,' and more. Add some 'HAHAHAHA' and don't forget the annoying emojis like 🤪, 😜, 🤣, ✌🏻, 🤮, 🖕🏿, and 💀.
    The user says: "${userMessage}". Continue the conversation in this tone.`;

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
