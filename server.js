const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// API keys from .env
const chatgptApiKey = process.env.CHATGPT_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Routes

// Test Route to check if server is working
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});

// Route to handle ChatGPT API request
app.post('/chatgpt', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${chatgptApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      res.status(200).json({
        reply: response.data.choices[0].message.content,
      });
    } else {
      res.status(500).json({ error: 'Failed to get response from ChatGPT' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong with ChatGPT' });
  }
});

// Route to handle Gemini API request
app.post('/gemini', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      'https://api.gemini.com/v1/chat',
      {
        query: message,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${geminiApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.reply) {
      res.status(200).json({
        reply: response.data.reply,
      });
    } else {
      res.status(500).json({ error: 'Failed to get response from Gemini' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong with Gemini' });
  }
});

// Route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Chatbot API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
