/**
 * OpenAskAI Page Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize OpenAskAI
  initializeAI();
  initializeQuickActions();
  initializeFAQ();
  
  // Chat elements
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const chatMessages = document.getElementById('chatMessages');
  const clearChatBtn = document.getElementById('clearChat');
  const newChatBtn = document.getElementById('newChat');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  
  function initializeAI() {
    // Send button functionality
    if (sendButton) {
      sendButton.addEventListener('click', handleSendMessage);
    }
    
    // Enter key functionality
    if (chatInput) {
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      });
      
      // Input validation
      chatInput.addEventListener('input', function() {
        const message = this.value.trim();
        sendButton.disabled = message.length === 0;
        
        // Show suggestions when input is empty
        const suggestions = document.getElementById('inputSuggestions');
        if (suggestions) {
          suggestions.style.display = message.length === 0 ? 'flex' : 'none';
        }
      });
    }
    
    // Clear chat functionality
    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', clearChat);
    }
    
    // New chat functionality
    if (newChatBtn) {
      newChatBtn.addEventListener('click', startNewChat);
    }
    
    // Suggestion chips
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', function() {
        const text = this.dataset.text;
        chatInput.value = text;
        handleSendMessage();
      });
    });
  }
  
  function initializeQuickActions() {
    const quickActionCards = document.querySelectorAll('.quick-action-card');
    
    quickActionCards.forEach(card => {
      card.addEventListener('click', function() {
        const question = this.dataset.question;
        if (question) {
          chatInput.value = question;
          scrollToChat();
          setTimeout(() => {
            handleSendMessage();
          }, 300);
        }
      });
    });
  }
  
  function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', function() {
        // Close other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
          }
        });
        
        // Toggle current item
        item.classList.toggle('open');
      });
    });
  }
  
  function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Disable input and button
    chatInput.disabled = true;
    sendButton.disabled = true;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
      hideTypingIndicator();
      generateAIResponse(message);
      
      // Re-enable input
      chatInput.disabled = false;
      sendButton.disabled = false;
      chatInput.focus();
    }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
  }
  
  function addMessage(text, sender, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
      </div>
      <div class="message-content">
        <div class="message-text">
          ${isHTML ? text : text}
        </div>
        <div class="message-time">${currentTime}</div>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }
  
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-content">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
  }
  
  function hideTypingIndicator() {
    const typingIndicator = chatMessages.querySelector('.typing');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  function generateAIResponse(userMessage) {
    // Simple keyword-based responses for demo
    const responses = getAIResponse(userMessage);
    addMessage(responses.text, 'ai', responses.isHTML);
  }
  
  function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Dataset related queries
    if (lowerMessage.includes('dataset') || lowerMessage.includes('dữ liệu')) {
      if (lowerMessage.includes('tải lên') || lowerMessage.includes('upload')) {
        return {
          text: `Để tải dataset lên OpenData, bạn cần làm theo các bước sau:
          <ol>
            <li>Đăng nhập vào tài khoản OpenData của bạn</li>
            <li>Chọn "Upload Dataset" từ menu hoặc trang chủ</li>
            <li>Điền thông tin cơ bản: tên dataset, mô tả, liên kết</li>
            <li>Chọn paper liên quan và số lượng mẫu</li>
            <li>Chọn licence và tags phù hợp</li>
            <li>Xác nhận và gửi để được duyệt</li>
          </ol>
          <p>Lưu ý: Dataset phải được công bố trong paper khoa học uy tín để được chấp nhận.</p>`,
          isHTML: true
        };
      }
      
      if (lowerMessage.includes('multimodal') || lowerMessage.includes('đa phương thức')) {
        return {
          text: `Dataset multimodal là những bộ dữ liệu chứa nhiều loại dữ liệu khác nhau như:
          <ul>
            <li><strong>Text + Image:</strong> Ví dụ như COCO (với caption cho ảnh)</li>
            <li><strong>Audio + Video:</strong> Dữ liệu speech với visual cues</li>
            <li><strong>Text + Audio:</strong> Podcast transcripts</li>
            <li><strong>Image + Text + Audio:</strong> Video với subtitle và audio</li>
          </ul>
          <p>Những dataset này rất quan trọng cho các task như image captioning, video understanding, và cross-modal retrieval.</p>`,
          isHTML: true
        };
      }
      
      if (lowerMessage.includes('tìm') || lowerMessage.includes('search')) {
        return {
          text: `Để tìm dataset phù hợp trên OpenData:
          <ol>
            <li>Sử dụng thanh tìm kiếm với từ khóa liên quan</li>
            <li>Lọc theo modality (Image, Text, Audio, Video, Multimodal)</li>
            <li>Xem thẻ tags để tìm dataset cùng domain</li>
            <li>Kiểm tra size và số sample phù hợp với tài nguyên</li>
            <li>Đọc kỹ mô tả và paper gốc để hiểu rõ dataset</li>
          </ol>
          <p>Tip: Datasets được sắp xếp theo độ phổ biến và có thể filter theo licence!</p>`,
          isHTML: true
        };
      }
    }
    
    // Metrics related queries
    if (lowerMessage.includes('metrics') || lowerMessage.includes('đánh giá')) {
      if (lowerMessage.includes('phổ biến') || lowerMessage.includes('popular') || lowerMessage.includes('common')) {
        return {
          text: `Các metrics phổ biến trong Machine Learning:
          
          <strong>🎯 Classification:</strong>
          • Accuracy, Precision, Recall, F1-Score
          • Top-k Error (đặc biệt useful cho nhiều classes)
          
          <strong>🔍 Object Detection:</strong>
          • mAP (mean Average Precision)
          • IoU (Intersection over Union)
          • FPS (Frames per Second) cho real-time
          
          <strong>🗣️ NLP:</strong>
          • BLEU (Machine Translation)
          • ROUGE (Summarization)
          • Perplexity (Language Models)
          
          <strong>🔊 Speech:</strong>
          • WER (Word Error Rate)
          • CER (Character Error Rate)
          
          Lựa chọn metric phụ thuộc vào task cụ thể và mục tiêu của bạn!`,
          isHTML: true
        };
      }
      
      if (lowerMessage.includes('khác biệt') || lowerMessage.includes('difference')) {
        return {
          text: `🤔 Sự khác biệt chính giữa các metrics:
          
          <strong>Precision vs Recall:</strong>
          • Precision: "Trong những gì mô hình dự đoán là Positive, bao nhiêu % thực sự đúng?"
          • Recall: "Trong những gì thực sự là Positive, mô hình catch được bao nhiêu %?"
          
          <strong>F1-Score:</strong>
          • Harmonic mean của Precision và Recall
          • Cân bằng giữa hai metrics này
          
          <strong>Top-1 vs Top-k Error:</strong>
          • Top-1: Chỉ đánh giá prediction có confidence cao nhất
          • Top-k: Đánh giá xem label đúng có nằm trong k predictions cao nhất
          
          <strong>mAP vs IoU:</strong>
          • IoU: Đo overlap giữa prediction box và ground truth
          • mAP: Tổng hợp precision-recall curve cho detection task
          
          Mỗi metric phù hợp với từng use case cụ thể! 🎯`,
          isHTML: true
        };
      }
    }
    
    // Paper related queries
    if (lowerMessage.includes('paper') || lowerMessage.includes('bài báo')) {
      if (lowerMessage.includes('upload') || lowerMessage.includes('tải lên')) {
        return {
          text: `🔬 Hướng dẫn upload paper lên OpenData:
          
          <strong>Bước 1: Chuẩn bị thông tin</strong>
          • Tiêu đề paper đầy đủ
          • Danh sách tác giả
          • Abstract/tóm tắt
          • Link paper (PDF hoặc arXiv)
          • DOI (nếu có)
          
          <strong>Bước 2: Upload</strong>
          • Vào mục "Upload Paper"
          • Điền form với thông tin chính xác
          • Chọn hội nghị/journal
          • Chọn research area
          • Add keywords
          
          <strong>Bước 3: Xác thực</strong>
          • OpenData sẽ verify paper từ nguồn uy tín
          • Thông báo approval trong 24-48h
          
          Paper phải được publish ở conference/journal có uy tín! 📚`,
          isHTML: true
        };
      }
    }
    
    // Benchmark related queries
    if (lowerMessage.includes('benchmark')) {
      if (lowerMessage.includes('tạo') || lowerMessage.includes('create')) {
        return {
          text: `🏆 Quy trình tạo benchmark mới:
          
          <strong>Bước 1: Thông tin cơ bản</strong>
          • Đặt tên benchmark rõ ràng
          • Mô tả chi tiết về mục đích
          
          <strong>Bước 2: Chọn Dataset & Task</strong>
          • Chọn dataset từ library có sẵn
          • Hoặc upload dataset mới nếu chưa có
          • Xác định task cụ thể (classification, detection...)
          
          <strong>Bước 3: Chọn Metrics</strong>
          • Tối đa 10 metrics cho 1 benchmark  
          • Hệ thống sẽ gợi ý metrics phù hợp
          • Có thể add custom metrics
          
          <strong>Bước 4: Thông tin bổ sung</strong>
          • Link paper gốc (tuỳ chọn)
          • Link code implementation
          • Link leaderboard
          
          Benchmark giúp standardize việc đánh giá mô hình! 📊`,
          isHTML: true
        };
      }
    }
    
    // General help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('hướng dẫn') || lowerMessage.includes('guide')) {
      return {
        text: `🚀 Tôi có thể giúp bạn với:
        
        <strong>📊 Datasets:</strong> Tìm, tải, upload, hiểu về các loại dataset
        
        <strong>📚 Papers:</strong> Quản lý papers, citation, research areas
        
        <strong>🎯 Benchmarks:</strong> Tạo, sử dụng, so sánh benchmarks
        
        <strong>📈 Metrics:</strong> Hiểu và chọn metrics phù hợp
        
        <strong>🔧 Platform:</strong> Sử dụng các tính năng của OpenData
        
        <strong>🗺️ Maps:</strong> Tìm institutions và authors
        
        Hãy đặt câu hỏi cụ thể để tôi hỗ trợ tốt nhất! 😊`,
        isHTML: true
      };
    }
    
    // Default response
    return {
      text: `Cảm ơn bạn đã hỏi! Tôi hiện chuyên về:
      
      • 📊 Datasets và cách sử dụng
      • 📚 Papers và nghiên cứu
      • 🎯 Benchmarks và đánh giá
      • 📈 Metrics và optimization
      • 🔧 Hướng dẫn sử dụng OpenData
      
      Có thể bạn muốn hỏi về:
      • "Cách tải dataset lên OpenData?"
      • "Giải thích các metrics phổ biến?"
      • "Hướng dẫn tạo benchmark mới?"
      
      Hãy đặt câu hỏi cụ thể hơn để tôi hỗ trợ tốt nhất! 😊`,
      isHTML: true
    };
  }
  
  function clearChat() {
    if (confirm('Bạn có chắc muốn xóa tất cả cuộc trò chuyện?')) {
      // Keep only the welcome message
      const firstMessage = chatMessages.querySelector('.message');
      chatMessages.innerHTML = '';
      if (firstMessage) {
        chatMessages.appendChild(firstMessage);
      }
    }
  }
  
  function startNewChat() {
    clearChat();
    chatInput.value = '';
    sendButton.disabled = true;
    document.getElementById('inputSuggestions').style.display = 'flex';
  }
  
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function scrollToChat() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Initialize button state
  if (sendButton) {
    sendButton.disabled = true;
  }
  
  // Show initial suggestions
  const suggestions = document.getElementById('inputSuggestions');
  if (suggestions) {
    suggestions.style.display = 'flex';
  }
});