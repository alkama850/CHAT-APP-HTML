// Send button for ChatGPT
document.getElementById('chatgpt-send-button').addEventListener('click', () => sendMessage('chatgpt'));

// Send button for Gemini
document.getElementById('gemini-send-button').addEventListener('click', () => sendMessage('gemini'));

// Switch between ChatGPT and Gemini
document.getElementById('chatgpt-toggle').addEventListener('change', () => toggleSection('chatgpt'));
document.getElementById('gemini-toggle').addEventListener('change', () => toggleSection('gemini'));

// Function to toggle between sections
function toggleSection(section) {
  if (section === 'chatgpt') {
    document.getElementById('chatgpt-section').style.display = 'block';
    document.getElementById('gemini-section').style.display = 'none';
  } else {
    document.getElementById('chatgpt-section').style.display = 'none';
    document.getElementById('gemini-section').style.display = 'block';
  }
}

// Function to send messages to the backend (ChatGPT or Gemini)
async function sendMessage(section) {
  const input = document.getElementById(`${section}-input`);
  const message = input.value.trim();

  if (message) {
    addMessageToChat(section, `You: ${message}`);
    input.value = '';

    try {
      let response;
      
      if (section === 'chatgpt') {
        response = await fetch('/api/chatgpt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
      } else if (section === 'gemini') {
        response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
      }

      const data = await response.json();

      if (data.response) {
        addMessageToChat(section, `${section === 'chatgpt' ? 'ChatGPT' : 'Gemini'}: ${data.response}`);
      } else {
        addMessageToChat(section, `${section === 'chatgpt' ? 'ChatGPT' : 'Gemini'}: Error occurred.`);
      }
    } catch (error) {
      console.error('Error sending message to backend:', error);
    }
  }
}

// Function to add messages to the chat box
function addMessageToChat(section, message) {
  const chatBox = document.getElementById(`${section}-chat-box`);
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
