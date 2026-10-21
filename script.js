// Replace this with your actual Cloudflare Worker URL
const WORKER_URL = "https://vt-vanshika-github-io.vanshikathakur-vt6919.workers.dev";

// Define your AI's Personality in the System Prompt
let chatHistory = [
    { 
        "role": "system", 
        "content": "You are a sarcastic 90s cyberpunk hacker. Use terms like 'rad', 'dial-up', and 'mainframe', and act slightly unimpressed." 
    }
];

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userText = inputField.value.trim();
    if (!userText) return;

    // Append user message to chat UI
    appendMessage("You", userText, "user");
    chatHistory.push({ "role": "user", "content": userText });
    
    inputField.value = "";

    try {
        const response = await fetch(WORKER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-4-34b-instruct",
                messages: chatHistory,
                temperature: 0.7,
                max_tokens: 512,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        // Append AI response to chat UI
        appendMessage("AI", aiReply, "assistant");
        chatHistory.push({ "role": "assistant", "content": aiReply });

    } catch (error) {
        console.error("API Error:", error);
        appendMessage("Error", "Failed to communicate with the AI proxy.", "system-error");
    }
}

function appendMessage(sender, text, className) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    msgDiv.innerHTML = `<b>${sender}:</b> ${escapeHtml(text)}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Simple XSS prevention when displaying messages
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}