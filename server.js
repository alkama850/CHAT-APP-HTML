// server.js

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

// Create an Express application
const app = express();

// Middleware for parsing JSON and handling CORS
app.use(express.json());
app.use(cors());

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Test route
app.get('/test', (req, res) => {
  res.send('Server is working fine!');
});

// Route for calling the ChatGPT API
app.post('/api/chatgpt', async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.choices[0].message.content;
    res.send({ reply: botMessage });
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    res.status(500).send({ error: 'An error occurred while communicating with ChatGPT.' });
  }
});

// Route for calling the Gemini API
app.post('/api/gemini', async (req, res) => {
  const userMessage = req.body.message;
  
  if (!userMessage) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('https://api.gemini.com/v1/chat', {
      query: userMessage,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.reply;
    res.send({ reply: botMessage });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).send({ error: 'An error occurred while communicating with Gemini.' });
  }
});

// Catch-all route to serve index.html for any unknown routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
