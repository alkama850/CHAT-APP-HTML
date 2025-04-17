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

// Function to call the Gemini API
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

// Load dark mode settings from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('dark-mode-toggle').checked = true;
}
