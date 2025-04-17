// Import required packages
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Initialize dotenv to read from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Define API URLs for ChatGPT and Gemini
const chatgptApiUrl = 'https://api.openai.com/v1/completions'; // ChatGPT URL
const geminiApiUrl = 'https://api.gemini.com/v1/completions'; // Gemini URL

// ChatGPT endpoint
app.post('/api/chatgpt', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(chatgptApiUrl, {
      model: 'gpt-4', // Use GPT-4 model
      prompt: message,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({ response: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error calling ChatGPT API', error);
    res.status(500).json({ error: 'Failed to communicate with ChatGPT' });
  }
});

// Gemini endpoint
app.post('/api/gemini', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(geminiApiUrl, {
      model: 'gemini-1', // Use Gemini model
      prompt: message,
      max_tokens: 150,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error calling Gemini API', error);
    res.status(500).json({ error: 'Failed to communicate with Gemini' });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
