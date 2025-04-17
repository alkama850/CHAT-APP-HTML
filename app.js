// ChatGPT send
document.getElementById('chatgpt-send-button')?.addEventListener('click', async () => {
  const input = document.getElementById('chatgpt-input');
  const chatBox = document.getElementById('chatgpt-chat-box');
  const message = input.value.trim();
  if (!message) return;

  appendMessage(chatBox, `You: ${message}`, 'user-message');
  input.value = '';

  toggleLoading(true, 'chatgpt');
  
  const response = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  toggleLoading(false, 'chatgpt');
  
  if (data.reply) {
    appendMessage(chatBox, `Bot: ${data.reply}`, 'bot-message');
  } else {
    appendMessage(chatBox, 'Bot: Sorry, something went wrong.', 'bot-message');
  }
});

// Gemini send
document.getElementById('gemini-send-button')?.addEventListener('click', async () => {
  const input = document.getElementById('gemini-input');
  const chatBox = document.getElementById('gemini-chat-box');
  const message = input.value.trim();
  if (!message) return;

  appendMessage(chatBox, `You: ${message}`, 'user-message');
  input.value = '';

  toggleLoading(true, 'gemini');

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  toggleLoading(false, 'gemini');
  
  if (data.reply) {
    appendMessage(chatBox, `Bot: ${data.reply}`, 'bot-message');
  } else {
    appendMessage(chatBox, 'Bot: Sorry, something went wrong.', 'bot-message');
  }
});

// Retry button functionality
document.getElementById('chatgpt-retry-button')?.addEventListener('click', retryChatGPT);
document.getElementById('gemini-retry-button')?.addEventListener('click', retryGemini);

function retryChatGPT() {
  const input = document.getElementById('chatgpt-input');
  input.value = ''; // Clear the input
  document.getElementById('chatgpt-chat-box').innerHTML = ''; // Clear chat history
}

function retryGemini() {
  const input = document.getElementById('gemini-input');
  input.value = ''; // Clear the input
  document.getElementById('gemini-chat-box').innerHTML = ''; // Clear chat history
}

// Copy button functionality
document.getElementById('chatgpt-copy-button')?.addEventListener('click', () => copyToClipboard('chatgpt'));
document.getElementById('gemini-copy-button')?.addEventListener('click', () => copyToClipboard('gemini'));

function copyToClipboard(section) {
  const chatBox = document.getElementById(`${section}-chat-box`);
  const text = chatBox.innerText || chatBox.textContent;
  navigator.clipboard.writeText(text)
    .then(() => alert(`${section.charAt(0).toUpperCase() + section.slice(1)} chat copied to clipboard!`))
    .catch(err => alert('Failed to copy text: ' + err));
}

// Append messages to chat box
function appendMessage(chatBox, message, className) {
  const p = document.createElement('p');
  p.textContent = message;
  p.className = className;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Loading indicator toggle
function toggleLoading(show, section) {
  const loadingIndicator = document.getElementById(`${section}-loading`);
  if (show) {
    loadingIndicator.style.display = 'block';
  } else {
    loadingIndicator.style.display = 'none';
  }
}
