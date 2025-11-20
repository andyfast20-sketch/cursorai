// Get DOM elements
const questionInput = document.getElementById('question-input');
const askButton = document.getElementById('ask-button');
const chatMessages = document.getElementById('chat-messages');

// API endpoint - adjust if needed for production
const API_URL = '/api/ask';

// Initialize chat
function initChat() {
    // Clear any existing messages or show welcome message
    chatMessages.innerHTML = '<div class="empty-state">Start a conversation by asking a question below 👇</div>';
}

// Add message to chat
function addMessage(content, type) {
    // Remove empty state if present
    const emptyState = chatMessages.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = type === 'user' ? 'You' : 'DeepSeek';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(labelDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${message}`;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Set loading state
function setLoading(isLoading) {
    askButton.disabled = isLoading;
    questionInput.disabled = isLoading;
    
    const buttonText = askButton.querySelector('.button-text');
    const buttonLoader = askButton.querySelector('.button-loader');
    
    if (isLoading) {
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'flex';
    } else {
        buttonText.style.display = 'block';
        buttonLoader.style.display = 'none';
    }
}

// Send question to backend
async function askQuestion() {
    const question = questionInput.value.trim();
    
    if (!question) {
        showError('Please enter a question');
        return;
    }
    
    // Add user message to chat
    addMessage(question, 'user');
    
    // Clear input
    questionInput.value = '';
    
    // Set loading state
    setLoading(true);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: question })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get response');
        }
        
        if (data.success && data.answer) {
            addMessage(data.answer, 'assistant');
        } else {
            throw new Error('Invalid response from server');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred. Please try again.');
    } finally {
        setLoading(false);
        questionInput.focus();
    }
}

// Event listeners
askButton.addEventListener('click', askQuestion);

questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        askQuestion();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initChat();
    questionInput.focus();
});

