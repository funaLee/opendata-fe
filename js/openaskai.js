/**
 * Enhanced OpenAskAI with Gemini API Integration
 * Features: Real AI chatbot, contextual responses, interactive elements
 */

// Configuration
const CONFIG = {
  GEMINI_API_KEY: 'AIzaSyDvjjkTcNhSIz7Fg0ZFuczufbfplOwMjoc', // Replace with actual API key
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  MAX_HISTORY: 10,
  TYPING_DELAY: 100,
  RESPONSE_DELAY: 1000
};

class OpenAskAI {
  constructor() {
    this.chatHistory = [];
    this.isTyping = false;
    this.conversationContext = {
      currentTopic: null,
      userPreferences: {},
      sessionData: {}
    };
    
    this.init();
  }
  
  init() {
    this.initializeElements();
    this.bindEvents();
    this.initializeFeatures();
    this.loadChatHistory();
    this.showWelcomeMessage();
  }
  
  initializeElements() {
    this.elements = {
      chatInput: document.getElementById('chatInput'),
      sendButton: document.getElementById('sendButton'),
      chatMessages: document.getElementById('chatMessages'),
      clearChatBtn: document.getElementById('clearChat'),
      newChatBtn: document.getElementById('newChat'),
      suggestionChips: document.querySelectorAll('.suggestion-chip'),
      quickActionCards: document.querySelectorAll('.quick-action-card'),
      inputSuggestions: document.getElementById('inputSuggestions'),
      apiStatus: this.createApiStatusIndicator(),
      messageCount: this.createMessageCounter(),
      contextInfo: this.createContextInfo()
    };
  }
  
  createApiStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'api-status';
    indicator.innerHTML = `
      <span class="status-icon">
        <i class="fas fa-wifi"></i>
      </span>
      <span class="status-text">Gemini API Connected</span>
    `;
    document.querySelector('.chat-header').appendChild(indicator);
    return indicator;
  }
  
  createMessageCounter() {
    const counter = document.createElement('div');
    counter.className = 'message-counter';
    counter.innerHTML = '<span id="messageCount">0</span> tin nhắn';
    document.querySelector('.chat-info').appendChild(counter);
    return counter;
  }
  
  createContextInfo() {
    const contextInfo = document.createElement('div');
    contextInfo.className = 'context-info';
    contextInfo.innerHTML = `
      <div class="context-topic">
        <i class="fas fa-brain"></i>
        <span id="currentTopic">Chế độ tổng quát</span>
      </div>
    `;
    document.querySelector('.chat-input-container').insertBefore(contextInfo, document.querySelector('.chat-input-wrapper'));
    return contextInfo;
  }
  
  bindEvents() {
    // Enhanced send functionality
    this.elements.sendButton.addEventListener('click', () => this.handleSendMessage());
    
    // Enhanced input handling
    this.elements.chatInput.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.elements.chatInput.addEventListener('input', () => this.handleInputChange());
    
    // Suggestion chips with animation
    this.elements.suggestionChips.forEach(chip => {
      chip.addEventListener('click', (e) => this.handleSuggestionClick(e));
    });
    
    // Quick actions with context setting
    this.elements.quickActionCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleQuickAction(e));
    });
    
    // Chat management
    this.elements.clearChatBtn.addEventListener('click', () => this.clearChat());
    this.elements.newChatBtn.addEventListener('click', () => this.startNewChat());
    
    // Advanced features
    this.bindAdvancedFeatures();
  }
  
  bindAdvancedFeatures() {
    // Voice input (if supported)
    this.initVoiceInput();
    
    // Drag and drop for files
    this.initDragAndDrop();
    
    // Keyboard shortcuts
    this.initKeyboardShortcuts();
    
    // Auto-save draft
    this.initAutoSave();
  }
  
  initVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const voiceBtn = document.createElement('button');
      voiceBtn.className = 'voice-input-btn';
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
      this.elements.chatInput.parentNode.insertBefore(voiceBtn, this.elements.sendButton);
    }
  }
  
  initDragAndDrop() {
    const chatContainer = document.querySelector('.chat-container');
    
    chatContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      chatContainer.classList.add('drag-over');
    });
    
    chatContainer.addEventListener('dragleave', () => {
      chatContainer.classList.remove('drag-over');
    });
    
    chatContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      chatContainer.classList.remove('drag-over');
      // Handle file drops (for future image analysis feature)
      console.log('Files dropped:', e.dataTransfer.files);
    });
  }
  
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        this.handleSendMessage();
      } else if (e.ctrlKey && e.key === 'n') {
        this.startNewChat();
      } else if (e.ctrlKey && e.key === 'k') {
        this.elements.chatInput.focus();
        e.preventDefault();
      }
    });
  }
  
  initAutoSave() {
    this.elements.chatInput.addEventListener('input', 
      this.debounce(() => {
        localStorage.setItem('openaskai_draft', this.elements.chatInput.value);
      }, 500)
    );
    
    // Restore draft on load
    const draft = localStorage.getItem('openaskai_draft');
    if (draft) {
      this.elements.chatInput.value = draft;
    }
  }
  
  handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    } else if (e.key === 'ArrowUp' && this.elements.chatInput.value === '') {
      // Edit last message
      this.editLastMessage();
    }
  }
  
  handleInputChange() {
    const message = this.elements.chatInput.value.trim();
    this.elements.sendButton.disabled = message.length === 0 || this.isTyping;
    
    // Show/hide suggestions
    this.elements.inputSuggestions.style.display = message.length === 0 ? 'flex' : 'none';
    
    // Update send button text based on input
    const sendText = this.elements.sendButton.querySelector('i');
    if (message.length > 100) {
      sendText.className = 'fas fa-envelope';
    } else {
      sendText.className = 'fas fa-paper-plane';
    }
  }
  
  async handleSendMessage() {
    const message = this.elements.chatInput.value.trim();
    if (!message || this.isTyping) return;
    
    try {
      // Clear draft
      localStorage.removeItem('openaskai_draft');
      
      // Disable input
      this.setInputState(false);
      
      // Add user message with animation
      await this.addMessage(message, 'user');
      
      // Clear input
      this.elements.chatInput.value = '';
      
      // Detect context/topic
      this.updateContext(message);
      
      // Show typing indicator
      await this.showTypingIndicator();
      
      // Get AI response
      const response = await this.getAIResponse(message);
      
      // Hide typing indicator
      this.hideTypingIndicator();
      
      // Add AI response with animation
      await this.addMessage(response, 'ai', true);
      
      // Update conversation history
      this.updateHistory(message, response);
      
      // Re-enable input
      this.setInputState(true);
      this.elements.chatInput.focus();
      
    } catch (error) {
      console.error('Error sending message:', error);
      this.hideTypingIndicator();
      this.addMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 'ai');
      this.setInputState(true);
    }
  }
  
  async getAIResponse(message) {
    try {
      // Check API key
      if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        return this.getFallbackResponse(message);
      }
      
      // Prepare context for Gemini
      const systemPrompt = this.buildSystemPrompt();
      const conversationHistory = this.buildConversationHistory();
      
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt + '\n\nUser: ' + message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
      
      const response = await fetch(`${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        this.updateApiStatus('connected');
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from AI');
      }
      
    } catch (error) {
      console.error('AI Response Error:', error);
      this.updateApiStatus('error');
      return this.getFallbackResponse(message);
    }
  }
  
  buildSystemPrompt() {
    return `Bạn là OpenAskAI, trợ lý AI thông minh của OpenData platform. Bạn có kiến thức sâu về:

1. Machine Learning và AI
2. Datasets, Papers, Benchmarks
3. Các metrics đánh giá
4. Cách sử dụng OpenData platform

Hãy trả lời các câu hỏi một cách:
- Rõ ràng và chi tiết
- Bằng tiếng Việt
- Có thể sử dụng HTML formatting (<strong>, <em>, <ul>, <li>, etc.)
- Chuyên nghiệp nhưng thân thiện
- Liên quan đến context của OpenData

Nếu câu hỏi không liên quan đến OpenData/AI/ML, hãy gợi ý người dùng hỏi về các chủ đề phù hợp.`;
  }
  
  buildConversationHistory() {
    return this.chatHistory.slice(-5).map(item => ({
      user: item.message,
      ai: item.response
    }));
  }
  
  getFallbackResponse(message) {
    // Enhanced fallback responses based on keywords
    const lowerMessage = message.toLowerCase();
    
    // Check for specific OpenData topics
    if (lowerMessage.includes('dataset') && lowerMessage.includes('upload')) {
      return `📊 <strong>Hướng dẫn upload dataset:</strong><br><br>
        1️⃣ <strong>Chuẩn bị dữ liệu:</strong> Đảm bảo dataset có paper khoa học tham chiếu<br>
        2️⃣ <strong>Truy cập form:</strong> Vào mục "Upload Dataset" từ menu<br>
        3️⃣ <strong>Điền thông tin:</strong><br>
        &nbsp;&nbsp;&nbsp;• Tên và mô tả rõ ràng<br>
        &nbsp;&nbsp;&nbsp;• Link dataset và paper<br>
        &nbsp;&nbsp;&nbsp;• Kích thước và số lượng mẫu<br>
        &nbsp;&nbsp;&nbsp;• Licence và tags phù hợp<br>
        4️⃣ <strong>Xem lại và gửi:</strong> Kiểm tra thông tin trước khi submit<br><br>
        💡 <em>Tips:</em> Dataset phải được xuất bản từ nguồn uy tín để được duyệt!`;
    }
    
    if (lowerMessage.includes('benchmark')) {
      return `🏆 <strong>Về Benchmarks trên OpenData:</strong><br><br>
        <strong>Benchmark là gì?</strong><br>
        Benchmark là bộ tiêu chuẩn đánh giá hiệu suất mô hình trên task cụ thể.<br><br>
        <strong>Các bước tạo benchmark:</strong><br>
        1️⃣ Chọn dataset và task phù hợp<br>
        2️⃣ Xác định metrics đánh giá<br>
        3️⃣ Thiết lập baseline performance<br>
        4️⃣ Tạo leaderboard công khai<br><br>
        <strong>Ví dụ benchmark phổ biến:</strong><br>
        • ImageNet Classification<br>
        • COCO Object Detection<br>
        • GLUE NLP Tasks<br>
        • SQuAD Reading Comprehension`;
    }
    
    if (lowerMessage.includes('metrics') || lowerMessage.includes('metric')) {
      return `📈 <strong>Metrics trong Machine Learning:</strong><br><br>
        <strong>Classification Metrics:</strong><br>
        • <strong>Accuracy:</strong> Tỷ lệ dự đoán đúng / tổng số dự đoán<br>
        • <strong>Precision:</strong> TP / (TP + FP)<br>
        • <strong>Recall:</strong> TP / (TP + FN)<br>
        • <strong>F1-Score:</strong> Harmonic mean của Precision và Recall<br><br>
        <strong>Object Detection:</strong><br>
        • <strong>mAP:</strong> Mean Average Precision<br>
        • <strong>IoU:</strong> Intersection over Union<br><br>
        <strong>NLP:</strong><br>
        • <strong>BLEU:</strong> Cho machine translation<br>
        • <strong>ROUGE:</strong> Cho text summarization<br>
        • <strong>Perplexity:</strong> Cho language models<br><br>
        💡 <em>Chọn metric phù hợp với bài toán cụ thể của bạn!</em>`;
    }
    
    // Default enhanced response
    return `🤖 <strong>Chào bạn!</strong> Tôi là OpenAskAI, trợ lý AI của OpenData.<br><br>
      <strong>Tôi có thể giúp bạn:</strong><br>
      🔍 Tìm hiểu về các datasets có sẵn<br>
      📚 Hướng dẫn upload papers và datasets<br>
      📊 Giải thích về benchmarks và metrics<br>
      🛠️ Sử dụng các tính năng của OpenData<br>
      🗺️ Tìm kiếm institutions và authors<br><br>
      <strong>Ví dụ câu hỏi:</strong><br>
      • "Cách tải dataset lên OpenData?"<br>
      • "Giải thích về mAP metric?"<br>
      • "Benchmark nào phù hợp cho computer vision?"<br><br>
      <em>Hãy đặt câu hỏi cụ thể để tôi hỗ trợ tốt nhất! 😊</em>`;
  }
  
  async addMessage(text, sender, isHTML = false, animate = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (animate) {
      messageDiv.style.opacity = '0';
      messageDiv.style.transform = 'translateY(20px)';
    }
    
    const currentTime = new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Enhanced message structure with more information
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        ${sender === 'ai' ? '<div class="ai-badge">AI</div>' : ''}
      </div>
      <div class="message-content">
        <div class="message-text">
          ${isHTML ? text : this.escapeHtml(text)}
        </div>
        <div class="message-footer">
          <div class="message-time">${currentTime}</div>
          ${this.createMessageActions(messageDiv, text, sender)}
        </div>
      </div>
    `;
    
    this.elements.chatMessages.appendChild(messageDiv);
    
    if (animate) {
      // Animate message appearance
      await this.sleep(10);
      messageDiv.style.transition = 'all 0.3s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    }
    
    this.scrollToBottom();
    this.updateMessageCount();
    
    return messageDiv;
  }
  
  createMessageActions(messageDiv, text, sender) {
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    
    if (sender === 'ai') {
      actions.innerHTML = `
        <button class="message-action" title="Copy" onclick="openAskAI.copyMessage('${messageDiv.id}')">
          <i class="fas fa-copy"></i>
        </button>
        <button class="message-action" title="Regenerate" onclick="openAskAI.regenerateResponse()">
          <i class="fas fa-redo"></i>
        </button>
        <button class="message-action" title="Share" onclick="openAskAI.shareMessage('${messageDiv.id}')">
          <i class="fas fa-share"></i>
        </button>
      `;
    }
    
    return actions.outerHTML;
  }
  
  async showTypingIndicator() {
    this.isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
        <div class="ai-badge thinking">
          <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </div>
      <div class="message-content">
        <div class="typing-indicator enhanced">
          <div class="typing-text">
            <span>OpenAskAI đang suy nghĩ</span>
            <span class="cursor">|</span>
          </div>
        </div>
      </div>
    `;
    
    this.elements.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
    
    // Add typing animation delay
    await this.sleep(CONFIG.RESPONSE_DELAY);
  }
  
  hideTypingIndicator() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  updateContext(message) {
    const lowerMessage = message.toLowerCase();
    
    // Detect topic based on keywords
    if (lowerMessage.includes('dataset')) {
      this.conversationContext.currentTopic = 'datasets';
      this.updateContextDisplay('📊 Dataset');
    } else if (lowerMessage.includes('paper') || lowerMessage.includes('bài báo')) {
      this.conversationContext.currentTopic = 'papers';
      this.updateContextDisplay('📚 Papers');
    } else if (lowerMessage.includes('benchmark')) {
      this.conversationContext.currentTopic = 'benchmarks';
      this.updateContextDisplay('🏆 Benchmarks');
    } else if (lowerMessage.includes('metric')) {
      this.conversationContext.currentTopic = 'metrics';
      this.updateContextDisplay('📈 Metrics');
    } else {
      this.conversationContext.currentTopic = 'general';
      this.updateContextDisplay('💬 Tổng quát');
    }
  }
  
  updateContextDisplay(topic) {
    const topicElement = document.getElementById('currentTopic');
    if (topicElement) {
      topicElement.textContent = topic;
      topicElement.parentElement.style.animation = 'pulse 0.5s ease';
    }
  }
  
  updateHistory(message, response) {
    this.chatHistory.push({
      timestamp: new Date().toISOString(),
      message,
      response,
      topic: this.conversationContext.currentTopic
    });
    
    // Keep only recent history
    if (this.chatHistory.length > CONFIG.MAX_HISTORY) {
      this.chatHistory = this.chatHistory.slice(-CONFIG.MAX_HISTORY);
    }
    
    // Save to localStorage
    this.saveChatHistory();
  }
  
  updateMessageCount() {
    const messages = this.elements.chatMessages.querySelectorAll('.message:not(.typing-message)');
    const count = messages.length;
    document.getElementById('messageCount').textContent = count;
  }
  
  updateApiStatus(status) {
    const statusElement = this.elements.apiStatus;
    const statusIcon = statusElement.querySelector('.status-icon i');
    const statusText = statusElement.querySelector('.status-text');
    
    switch (status) {
      case 'connected':
        statusIcon.className = 'fas fa-wifi';
        statusText.textContent = 'Gemini API Connected';
        statusElement.className = 'api-status connected';
        break;
      case 'error':
        statusIcon.className = 'fas fa-wifi-slash';
        statusText.textContent = 'API Error - Using Fallback';
        statusElement.className = 'api-status error';
        break;
      case 'disconnected':
        statusIcon.className = 'fas fa-times-circle';
        statusText.textContent = 'API Disconnected';
        statusElement.className = 'api-status disconnected';
        break;
    }
  }
  
  setInputState(enabled) {
    this.elements.chatInput.disabled = !enabled;
    this.elements.sendButton.disabled = !enabled || this.elements.chatInput.value.trim() === '';
    
    if (enabled) {
      this.elements.chatInput.focus();
    }
  }
  
  scrollToBottom() {
    this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
  }
  
  clearChat() {
    if (confirm('Bạn có chắc muốn xóa tất cả cuộc trò chuyện?')) {
      // Keep only the welcome message
      const firstMessage = this.elements.chatMessages.querySelector('.message');
      this.elements.chatMessages.innerHTML = '';
      
      if (firstMessage) {
        this.elements.chatMessages.appendChild(firstMessage);
      }
      
      this.chatHistory = [];
      this.saveChatHistory();
      this.updateMessageCount();
    }
  }
  
  startNewChat() {
    this.clearChat();
    this.elements.chatInput.value = '';
    this.setInputState(true);
    this.elements.inputSuggestions.style.display = 'flex';
    this.updateContextDisplay('💬 Tổng quát');
  }
  
  saveChatHistory() {
    try {
      localStorage.setItem('openaskai_history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }
  
  loadChatHistory() {
    try {
      const history = localStorage.getItem('openaskai_history');
      if (history) {
        this.chatHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      this.chatHistory = [];
    }
  }
  
  showWelcomeMessage() {
    // Enhanced welcome message
    const welcomeHTML = `
      <div class="welcome-features">
        <h3>✨ Tính năng mới:</h3>
        <ul>
          <li>🤖 <strong>Trợ lý AI thông minh</strong> với Gemini API</li>
          <li>🗣️ <strong>Voice input</strong> (nếu trình duyệt hỗ trợ)</li>
          <li>⌨️ <strong>Keyboard shortcuts:</strong>
            <ul>
              <li>Ctrl + Enter: Gửi tin nhắn</li>
              <li>Ctrl + N: Chat mới</li>
              <li>Ctrl + K: Focus input</li>
            </ul>
          </li>
          <li>📎 <strong>Drag & drop</strong> files để phân tích</li>
          <li>💾 <strong>Auto-save</strong> nháp tin nhắn</li>
        </ul>
      </div>
      <p>Hãy đặt câu hỏi để bắt đầu! 😊</p>
    `;
    
    // Update the existing welcome message or create new one
    const existingMessage = this.elements.chatMessages.querySelector('.message-text');
    if (existingMessage) {
      existingMessage.innerHTML = welcomeHTML;
    }
  }
  
  // Utility functions
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Public methods for UI interactions
  copyMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
      const text = message.querySelector('.message-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Đã copy tin nhắn');
      });
    }
  }
  
  regenerateResponse() {
    const lastUserMessage = this.chatHistory[this.chatHistory.length - 1];
    if (lastUserMessage) {
      // Remove last AI response
      const lastMessage = this.elements.chatMessages.lastElementChild;
      if (lastMessage && lastMessage.classList.contains('ai-message')) {
        lastMessage.remove();
      }
      
      // Regenerate response
      this.handleSendMessage();
    }
  }
  
  shareMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
      const text = message.querySelector('.message-text').textContent;
      const shareData = {
        title: 'OpenAskAI Response',
        text: text,
        url: window.location.href
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(text);
        this.showToast('Đã copy link chia sẻ');
      }
    }
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

// Initialize OpenAskAI when DOM is loaded
let openAskAI;
document.addEventListener('DOMContentLoaded', () => {
  openAskAI = new OpenAskAI();
});

// Export for global access
window.openAskAI = openAskAI;

// Add some CSS for enhanced features
const style = document.createElement('style');
style.textContent = `
  /* Enhanced OpenAskAI Styles */
  .api-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .api-status.connected {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
  
  .api-status.error {
    background: rgba(255, 152, 0, 0.1);
    color: #ff9800;
  }
  
  .api-status.disconnected {
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }
  
  .message-counter {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 3px;
  }
  
  .context-info {
    padding: 10px 15px;
    background: rgba(90, 107, 255, 0.05);
    border-radius: 12px;
    margin-bottom: 15px;
    border: 1px solid rgba(90, 107, 255, 0.1);
  }
  
  .context-topic {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: var(--primary-color);
    font-weight: 500;
  }
  
  .message-actions {
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .message:hover .message-actions {
    opacity: 1;
  }
  
  .message-action {
    background: none;
    border: none;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    color: var(--text-light);
    transition: all 0.2s ease;
  }
  
  .message-action:hover {
    background: rgba(90, 107, 255, 0.1);
    color: var(--primary-color);
  }
  
  .ai-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .ai-badge.thinking {
    animation: thinking 1.5s infinite;
  }
  
  @keyframes thinking {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  .typing-indicator.enhanced {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: #f5f5f5;
    border-radius: 20px;
    border-bottom-left-radius: 5px;
  }
  
  .typing-text {
    color: var(--text-light);
    font-size: 0.9rem;
  }
  
  .cursor {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  .voice-input-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: rgba(90, 107, 255, 0.1);
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .voice-input-btn:hover {
    background: var(--primary-color);
    color: white;
    transform: scale(1.05);
  }
  
  .voice-input-btn.recording {
    background: #f44336;
    color: white;
    animation: pulse 1s infinite;
  }
  
  .drag-over {
    border: 2px dashed var(--primary-color);
    background: rgba(90, 107, 255, 0.05);
  }
  
  .toast-notification {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 10000;
    transition: all 0.3s ease;
    opacity: 0;
  }
  
  .toast-notification.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .welcome-features {
    margin: 15px 0;
    padding: 15px;
    background: rgba(90, 107, 255, 0.05);
    border-radius: 10px;
    border-left: 4px solid var(--primary-color);
  }
  
  .welcome-features h3 {
    margin-bottom: 10px;
    color: var(--primary-color);
  }
  
  .welcome-features ul {
    margin-left: 15px;
  }
  
  .welcome-features li {
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .welcome-features ul ul {
    margin-top: 5px;
    margin-bottom: 5px;
  }
`;

if (document.head) {
  document.head.appendChild(style);
}