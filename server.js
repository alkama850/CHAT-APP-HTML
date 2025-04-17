require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

// Create an Express app
const app = express();
app.use(express.json());
app.use(cors());

// Set port
const PORT = process.env.PORT || 5000;

// Serve static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Test route
app.get('/test', (req, res) => {
  res.send('Server is working fine!');
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve chatgpt.html
app.get('/chatgpt', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatgpt.html'));
});

// Serve gemini.html
app.get('/gemini', (req, res) => {
  res.sendFile(path.join(__dirname, 'gemini.html'));
});

// ChatGPT API route (GET request)
app.get('/api/chatgpt', async (req, res) => {
  const userMessage = req.query.message;  // Fetch message from query string
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
    console.error('ChatGPT API Error:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Error with ChatGPT API', details: error.response ? error.response.data : error.message });
  }
});

// Gemini API route (GET request)
app.get('/api/gemini', async (req, res) => {
  const userMessage = req.query.message;  // Fetch message from query string
  if (!userMessage) {
    return res.status(400).send({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      contents: [{ parts: [{ text: userMessage }] }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.candidates[0].content.parts[0].text;
    res.send({ reply: botMessage });
  } catch (error) {
    console.error('Gemini API Error:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Error with Gemini API', details: error.response ? error.response.data : error.message });
  }
});

// Catch-all route (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
