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
    addMessageToChat(section,
