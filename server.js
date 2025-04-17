const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ChatGPT API endpoint
app.post('/chatgpt', async (req, res) => {
  const message = req.body.message;
  const apiKey = process.env.CHATGPT_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ reply: 'Error fetching response from ChatGPT.' });
  }
});

// Gemini API endpoint (Replace with the actual endpoint)
app.post('/gemini', async (req, res) => {
  const message = req.body.message;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch('https://api.gemini.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: message, max_tokens: 150 })
    });
    const data = await response.json();
    res.json({ reply: data.reply });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ reply: 'Error fetching response from Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
