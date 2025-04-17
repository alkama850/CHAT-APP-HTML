// API Keys (ensure these are loaded from the .env file securely on the backend)
const chatgptApiKey = process.env.OPENAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Event listeners for button clicks
document.getElementById('chatgpt-button')?.addEventListener('click', () => window.location.href = 'chatgpt.html');
document.getElementById('gemini-button')?.addEventListener('click', () => window.location.href = 'gemini.html');

// Dark Mode Toggle
document.getElementById('dark-mode-toggle')?.addEventListener('change', toggleDarkMode);

// Function to handle dark mode toggle
function toggleDarkMode() {
    if (document.getElementById('dark-mode-toggle')?.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
}

// Send button for ChatGPT and Gemini sections
document.getElementById('chatgpt-send-button')?.addEventListener('click', () => sendMessage('chatgpt'));
document.getElementById('gemini-send-button')?.addEventListener('click', () => sendMessage('gemini'));

// Function to handle message sending
function sendMessage(section) {
    const inputField = document.getElementById(`${section}-input`);
    const message = inputField.value.trim();
    if (message) {
        addMessageToChat(section, `You: ${message}`);
        inputField.value = '';
        simulateBotResponse(section, message);
    }
}

// Function to simulate the typing effect in the chat
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

// Function to add messages to the chat box
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

// Function to call the ChatGPT API via GET request
async function callChatGPTAPI(message) {
    const chatBox = document.getElementById('chatgpt-chat-box');

    try {
        const response = await fetch(`/api/chatgpt?message=${encodeURIComponent(message)}`);
        const data = await response.json();

        if (data.reply) {
            addMessageToChat('chatgpt', `Bot: ${data.reply}`);
        } else {
            addMessageToChat('chatgpt', 'Bot: Error - No response from ChatGPT');
        }
    } catch (error) {
        console.error('Error in ChatGPT API call:', error);
        addMessageToChat('chatgpt', 'Bot: Something went wrong. Please try again.');
    }
}

// Function to call the Gemini API via GET request
async function callGeminiAPI(message) {
    const chatBox = document.getElementById('gemini-chat-box');

    try {
        const response = await fetch(`/api/gemini?message=${encodeURIComponent(message)}`);
        const data = await response.json();

        if (data.reply) {
            addMessageToChat('gemini', `Bot: ${data.reply}`);
        } else {
            addMessageToChat('gemini', 'Bot: Error - No response from Gemini');
        }
    } catch (error) {
        console.error('Error in Gemini API call:', error);
        addMessageToChat('gemini', 'Bot: Something went wrong. Please try again.');
    }
                                                            }
