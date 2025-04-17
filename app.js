// API Keys
const chatgptApiKey = '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'; // Replace with your actual API key
const geminiApiKey = 'AIzaSyDZeFAgMdO4E96rmLDwnM9VKvyspTTv4N4'; // Replace with your actual API key

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('change', toggleDarkMode);

// Send button for ChatGPT
document.getElementById('chatgpt-send-button').addEventListener('click', () => sendMessage('chatgpt'));

// Send button for Gemini
document.getElementById('gemini-send-button').addEventListener('click', () => sendMessage('gemini'));

// Settings button
document.getElementById('settings-button').addEventListener('click', toggleSettings);

// Dark Mode Toggle Function
function toggleDarkMode() {
  if (document.getElementById('dark-mode-toggle').checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  }
}

// Function to simulate settings behavior
function toggleSettings() {
  alert('Settings Clicked');
}

// Send message function for both ChatGPT and Gemini
function sendMessage(section) {
  const input = document.getElementById(`${section}-input`);
  const message = input.value.trim();

  if (message) {
    addMessageToChat(section, `You: ${message}`);
    input.value = '';
    simulateBotResponse(section, message);
  }
}

// Function to add message to the chat box
function addMessageToChat(section, message) {
  const chatBox = document.getElementById(`${section}-chat-box`);
  const messageElement = document.createElement('p');
  
  if (section === 'chatgpt') {
    messageElement.classList.add('bot-message');
  } else {
    messageElement.classList.add('gemini-message');
  }

  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to simulate bot response with typing animation
function simulateBotResponse(section, userMessage) {
  const chatBox = document.getElementById(`${section}-chat-box`);
  const typingMessage = document.createElement('p');
  typingMessage.textContent = `${section === 'chatgpt' ? 'ChatGPT' : 'Gemini'} is typing...`;
  chatBox.appendChild(typingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typingMessage.textContent = 'Delivered';
    setTimeout(() => {
      typingMessage.remove();
      if (section === 'chatgpt') {
        callChatGPTAPI(userMessage);
      } else if (section === 'gemini') {
        callGeminiAPI(userMessage);
      }
    }, 1000);
  }, 2000);
}

// Function to call the ChatGPT API
async function callChatGPTAPI(message) {
  const chatBox = document.getElementById('chatgpt-chat-box');

  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${chatgptApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    const botMessage = data.choices[0].message.content;
    addMessageToChat('chatgpt', `Bot: ${botMessage}`);
    speakMessage(botMessage);  // Optional: Voice output
  } else {
    addMessageToChat('chatgpt', 'Bot: I am sorry, there was an error.');
  }
}

// Function to call the Gemini API (replace with real API details)
async function callGeminiAPI(message) {
  const chatBox = document.getElementById('gemini-chat-box');

  const response = await fetch('https://api.gemini.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${geminiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: message,
      max_tokens: 150
    })
  });

  const data = await response.json();

  if (data.reply) {
    const botMessage = data.reply;
    addMessageToChat('gemini', `Bot: ${botMessage}`);
    speakMessage(botMessage);  // Optional: Voice output
  } else {
    addMessageToChat('gemini', 'Bot: Sorry, I couldn’t fetch a response.');
  }
}

// Function to handle text-to-speech (voice output)
function speakMessage(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
  }
    
