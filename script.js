// PnCoder - AI Programming Assistant
class PnCoder {
    constructor() {
        // Use environment variables for API configuration
        this.apiKey = this.getEnvironmentVariable('OPENROUTER_API_KEY') || '';
        this.siteUrl = this.getEnvironmentVariable('SITE_URL') || window.location.origin;
        this.siteName = this.getEnvironmentVariable('SITE_NAME') || 'PnCoder';
        this.messages = JSON.parse(localStorage.getItem('pnCoder_messages') || '[]');
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.renderMessages();
        this.updateCharCount();
    }

    getEnvironmentVariable(name) {
        // Try to get from window object (set by Netlify)
        if (window[name]) {
            return window[name];
        }
        // Try to get from process.env (if available)
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }
        // Fallback to empty string
        return '';
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearChatBtn = document.getElementById('clearChat');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.charCount = document.querySelector('.char-count');
        this.apiKeyInput = document.getElementById('apiKey');
        this.siteUrlInput = document.getElementById('siteUrl');
        this.siteNameInput = document.getElementById('siteName');
    }

    bindEvents() {
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
            this.updateSendButton();
        });

        // Clear chat
        this.clearChatBtn.addEventListener('click', () => this.clearChat());

        // Settings modal
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        document.getElementById('testAPI').addEventListener('click', () => this.testAPI());

        // Close modal on outside click
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });

        // Example prompts
        document.querySelectorAll('.example-prompt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.messageInput.value = e.target.dataset.prompt;
                this.updateCharCount();
                this.autoResizeTextarea();
                this.updateSendButton();
                this.messageInput.focus();
            });
        });
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count}/4000`;
        
        if (count > 3500) {
            this.charCount.style.color = '#dc3545';
        } else if (count > 3000) {
            this.charCount.style.color = '#ffc107';
        } else {
            this.charCount.style.color = '#6c757d';
        }
    }

    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        const hasApiKey = this.apiKey.trim().length > 0;
        this.sendBtn.disabled = !hasText || !hasApiKey;
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.apiKey) {
            if (!this.apiKey) {
                this.showNotification('API key not configured. Please contact the administrator to set up the OPENROUTER_API_KEY environment variable.', 'error');
            }
            return;
        }

        // Add user message
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        this.updateSendButton();

        // Show loading
        this.showLoading();

        try {
            const response = await this.callAPI(message);
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('API Error:', error);
            let errorMessage = 'Sorry, I encountered an error. ';
            
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                errorMessage += 'Please check your API key in settings.';
            } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                errorMessage += 'API access denied. Please check your API key and permissions.';
            } else if (error.message.includes('429')) {
                errorMessage += 'Rate limit exceeded. Please try again later.';
            } else if (error.message.includes('Provider returned error')) {
                errorMessage += 'The AI provider returned an error. Please check your API key and try again.';
            } else {
                errorMessage += error.message;
            }
            
            this.addMessage('assistant', errorMessage);
        } finally {
            this.hideLoading();
        }
    }

    async callAPI(message) {
        console.log('API Key:', this.apiKey ? 'Present' : 'Missing');
        console.log('Site URL:', this.siteUrl);
        console.log('Site Name:', this.siteName);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': this.siteUrl || window.location.origin,
                'X-Title': this.siteName,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen/qwen3-coder:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are PnCoder, a helpful AI programming assistant. You help users with programming questions, code reviews, debugging, and building applications. Always provide clear, well-formatted code examples and explanations.'
                    },
                    ...this.messages.slice(-10), // Keep last 10 messages for context
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 4000,
                temperature: 0.7
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Response:', errorData);
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data.choices[0].message.content;
    }

    addMessage(role, content) {
        const message = { role, content, timestamp: Date.now() };
        this.messages.push(message);
        this.saveMessages();
        this.renderMessages();
    }

    renderMessages() {
        // Clear welcome message if we have messages
        if (this.messages.length > 0) {
            this.chatMessages.innerHTML = '';
        } else {
            this.chatMessages.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-content">
                        <i class="fas fa-robot"></i>
                        <h2>Welcome to PnCoder</h2>
                        <p>Your AI programming assistant powered by Qwen3 Coder. Ask me to build something, explain code, or help with programming questions!</p>
                        <div class="example-prompts">
                            <h3>Try asking:</h3>
                            <div class="prompt-examples">
                                <button class="example-prompt" data-prompt="Create a React component for a todo list">Create a React component for a todo list</button>
                                <button class="example-prompt" data-prompt="Explain how async/await works in JavaScript">Explain async/await in JavaScript</button>
                                <button class="example-prompt" data-prompt="Help me debug this Python function">Help me debug a Python function</button>
                                <button class="example-prompt" data-prompt="Build a REST API with Node.js and Express">Build a REST API with Node.js</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Re-bind example prompt events
            document.querySelectorAll('.example-prompt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.messageInput.value = e.target.dataset.prompt;
                    this.updateCharCount();
                    this.autoResizeTextarea();
                    this.updateSendButton();
                    this.messageInput.focus();
                });
            });
            return;
        }

        // Render messages
        this.messages.forEach((message, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.role}-message`;
            
            const avatar = message.role === 'user' ? 'fas fa-user' : 'fas fa-robot';
            const formattedContent = this.formatMessageContent(message.content);
            
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="${avatar}"></i>
                </div>
                <div class="message-content">
                    ${formattedContent}
                </div>
            `;
            
            this.chatMessages.appendChild(messageDiv);
        });

        // Scroll to bottom
        this.scrollToBottom();
    }

    formatMessageContent(content) {
        // Enhanced markdown-like formatting to HTML with better code handling
        let formatted = content;
        
        // Handle code blocks with language specification
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            return `<div class="code-block">
                <div class="code-header">
                    <span class="code-language">${language}</span>
                    <button class="copy-code-btn" onclick="navigator.clipboard.writeText(\`${code.trim()}\`)">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>
            </div>`;
        });
        
        // Handle inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Handle bold text
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.messages = [];
            this.saveMessages();
            this.renderMessages();
            this.showNotification('Chat cleared successfully!', 'success');
        }
    }

    openSettings() {
        this.settingsModal.classList.add('show');
        // Show current environment variable values (masked for security)
        this.apiKeyInput.value = this.apiKey ? '••••••••••••••••' : 'Not configured';
        this.siteUrlInput.value = this.siteUrl || 'Not configured';
        this.siteNameInput.value = this.siteName || 'Not configured';
    }

    closeSettings() {
        this.settingsModal.classList.remove('show');
    }

    saveSettings() {
        // Settings are now read-only, just close the modal
        this.closeSettings();
        this.showNotification('Settings are configured via environment variables.', 'info');
    }

    loadSettings() {
        // Settings are now loaded from environment variables
        this.updateSendButton();
    }

    saveMessages() {
        localStorage.setItem('pnCoder_messages', JSON.stringify(this.messages));
    }

    showLoading() {
        this.loadingOverlay.classList.add('show');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('show');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Test function to debug API connection
    async testAPI() {
        console.log('Testing API connection...');
        console.log('API Key:', this.apiKey ? 'Present' : 'Missing');
        console.log('Site URL:', this.siteUrl);
        console.log('Site Name:', this.siteName);
        
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': this.siteUrl || window.location.origin,
                    'X-Title': this.siteName,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'qwen/qwen3-coder:free',
                    messages: [
                        {
                            role: 'user',
                            content: 'Hello, this is a test message.'
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });
            
            console.log('Test Response Status:', response.status);
            console.log('Test Response Headers:', response.headers);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Test API Error:', errorData);
                this.showNotification(`API Test Failed: ${errorData.error?.message || response.statusText}`, 'error');
            } else {
                const data = await response.json();
                console.log('Test API Success:', data);
                this.showNotification('API Test Successful!', 'success');
            }
        } catch (error) {
            console.error('Test API Error:', error);
            this.showNotification(`API Test Error: ${error.message}`, 'error');
        }
    }
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PnCoder();
});
