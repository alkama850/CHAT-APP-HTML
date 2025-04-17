// API Keys from .env
const chatgptApiKey = process.env.OPENAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('change', toggleDarkMode);

// Send button for ChatGPT
document.getElementById('chatgpt-send-button').addEventListener('click', () => sendMessage('chatgpt'));

// Send button for Gemini
document.getElementById('gemini-send-button').addEventListener('click', () => sendMessage('gemini'));

// Clear button for chat history
document.getElementById('clear-chat-button').addEventListener('click', clearChat);

// Download chat button
document.getElementById('download-chat').addEventListener('click', downloadChat);

// Speech-to-Text button
document.getElementById('speech-to-text').addEventListener('click', startSpeechRecognition);

// Voice Output button
document.getElementById('voice-output').addEventListener('click', () => speakMessage(getLastMessage()));

// Emoji Picker button
document.getElementById('emoji-picker').addEventListener('click', openEmojiPicker);

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

// Send message function for both ChatGPT and Gemini
function sendMessage(section) {
  const input = document.getElementById(`${section}-input`);
  const message = input.value.trim();

  if (message) {
    addMessageToChat(section, `You: ${message}`);
    input.value = '';
    document.getElementById('message-status').style.display = 'block';

    setTimeout(() => {
      document.getElementById('message-status').style.display = 'none';
    }, 2000);

    // Simulate bot response
    fetchBotResponse(section, message);
  } else {
    alert('Please enter a message!');
  }
}

// Fetch response from the bot (API Request)
async function fetchBotResponse(section, message) {
  const chatBox = document.getElementById(`${section}-chat-box`);
  let apiKey = section === 'chatgpt' ? chatgptApiKey : geminiApiKey;

  const response = await fetch(`https://api.example.com/${section}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    addMessageToChat(section, `Error: Unable to get a response.`);
    return;
  }

  const data = await response.json();
  addMessageToChat(section, `${section === 'chatgpt' ? 'ChatGPT' : 'Gemini'}: ${data.reply}`);
}

// Add message to the chatbox
function addMessageToChat(section, message) {
  const chatBox = document.getElementById(`${section}-chat-box`);
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Clear chat history
function clearChat() {
  const chatBoxes = document.querySelectorAll('.chat-box');
  chatBoxes.forEach((box) => {
    box.innerHTML = '';
  });
}

// Download the chat history as a text file
function downloadChat() {
  const chatBoxes = document.querySelectorAll('.chat-box');
  let chatHistory = '';
  chatBoxes.forEach((box) => {
    chatHistory += box.innerText + '\n';
  });

  const blob = new Blob([chatHistory], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chat_history.txt';
  link.click();
}

// Start Speech Recognition (Speech-to-Text)
function startSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition is not supported in this browser.');
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('chatgpt-input').value = transcript;
  };
  recognition.start();
}

// Text-to-Speech (Voice Output)
function speakMessage(message) {
  const speech = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.speak(speech);
}

// Get the last message in the chat
function getLastMessage() {
  const chatBox = document.getElementById('chatgpt-chat-box');
  const messages = chatBox.getElementsByTagName('p');
  return messages[messages.length - 1].textContent;
}

// Open emoji picker
function openEmojiPicker() {
  const emojis = ['😊', '😂', '😍', '😢', '😎', '😜', '😡', '😱'];
  const inputField = document.getElementById('chatgpt-input');

  const emojiList = document.createElement('div');
  emojiList.classList.add('emoji-list');
  emojis.forEach((emoji) => {
    const emojiButton = document.createElement('button');
    emojiButton.textContent = emoji;
    emojiButton.onclick = () => {
      inputField.value += emoji;
      document.body.removeChild(emojiList);
    };
    emojiList.appendChild(emojiButton);
  });

  document.body.appendChild(emojiList);
}

// Message editing (allows editing the last sent message)
document.getElementById('chatgpt-chat-box').addEventListener('click', function (event) {
  if (event.target.tagName === 'P' && event.target.textContent.startsWith('You:')) {
    const inputField = document.getElementById('chatgpt-input');
    inputField.value = event.target.textContent.replace('You: ', '');
    event.target.remove();
  }
});

// Check if dark mode should be applied on page load
if (localStorage.getItem('darkMode') === 'true') {
  document.getElementById('dark-mode-toggle').checked = true;
  document.body.classList.add('dark-mode');
    }
