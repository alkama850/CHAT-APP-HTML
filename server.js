require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// ChatGPT API endpoint
app.post('/chatgpt', async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: 'Error retrieving response from ChatGPT' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to ChatGPT API' });
  }
});

// Gemini API endpoint
app.post('/gemini', async (req, res) => {
  const message = req.body.message;

  try {
    const response = await fetch('https://api.gemini.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        max_tokens: 150,
      }),
    });

    const data = await response.json();

    if (data.reply) {
      res.json({ reply: data.reply });
    } else {
      res.status(500).json({ error: 'Error retrieving response from Gemini' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to Gemini API' });
  }
});

// Server setup
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
