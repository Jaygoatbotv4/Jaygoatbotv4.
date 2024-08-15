const axios = require('axios');

module.exports.config = {
    name: 'hercai',
    version: '1.0.0',
    role: 0,
    hasPrefix: true, // Set to true to require a prefix
    description: "An AI command powered by OpenAI",
    usages: "/hercai [your question or statement]",
    credits: 'Developer',
    cooldown: 5,
};

module.exports.run = async function({ api, event, args }) {
    // Check if the message starts with the "/" prefix
    if (!event.body.startsWith('/')) return;

    // Remove the "/" prefix from the message
    const message = event.body.slice(1).trim();

    // Check if the command part is "hercai"
    const command = message.split(' ')[0].toLowerCase();
    if (command !== 'hercai') return;

    // Remove the command part and get the remaining arguments
    const query = message.slice(command.length).trim();

    if (!query) {
        api.sendMessage("Please provide a question or statement after '/hercai'. For example: /hercai What is the capital of France?", event.threadID);
        return;
    }

    const apiUrl = `https://openai-rest-api.vercel.app/hercai?ask=${encodeURIComponent(query)}&model=v3`;

    try {
        const response = await axios.get(apiUrl);
        api.sendMessage(response.data.reply, event.threadID);
    } catch (error) {
        console.error("Error fetching response from OpenAI API:", error);
        api.sendMessage("An error occurred while processing your request. Please try again later.", event.threadID);
    }
};
