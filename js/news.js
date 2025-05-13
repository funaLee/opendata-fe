/**
 * News Page JavaScript
 * Handles animations, interactions, and dynamic content
 */

class NewsPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initAnimations();
    this.initInteractiveElements();
    this.initScrollEffects();
    this.initNewsletter();
    this.initCategoryCards();
    this.initLoadMore();
  }
  
  // Initialize entrance animations
  initAnimations() {
    // Animate featured articles
    const featuredArticles = document.querySelectorAll('.featured-article');
    featuredArticles.forEach((article, index) => {
      article.style.opacity = '0';
      article.style.transform = 'translateY(20px)';
      article.style.transition = 'all 0.6s ease';
      article.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      card.style.transition = 'all 0.5s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate news cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.4s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  // Initialize interactive elements
  initInteractiveElements() {
    // Add click handlers for featured articles
    const featuredArticles = document.querySelectorAll('.featured-article');
    featuredArticles.forEach(article => {
      article.addEventListener('click', () => {
        this.openArticle(article);
      });
    });
    
    // Add click handlers for news cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
      card.addEventListener('click', () => {
        this.openArticle(card);
      });
    });
    
    // Add hover effects
    this.initHoverEffects();
  }
  
  // Initialize hover effects
  initHoverEffects() {
    const articles = document.querySelectorAll('.featured-article, .news-card');
    
    articles.forEach(article => {
      article.addEventListener('mouseenter', () => {
        this.animateHover(article, true);
      });
      
      article.addEventListener('mouseleave', () => {
        this.animateHover(article, false);
      });
    });
  }
  
  // Animate article hover
  animateHover(article, isHover) {
    const image = article.querySelector('.article-image img, .news-image img');
    const category = article.querySelector('.article-category, .news-category');
    
    if (isHover) {
      if (image) {
        image.style.transform = 'scale(1.05)';
      }
      if (category) {
        category.style.transform = 'scale(1.05)';
      }
    } else {
      if (image) {
        image.style.transform = 'scale(1)';
      }
      if (category) {
        category.style.transform = 'scale(1)';
      }
    }
  }
  
  // Initialize scroll effects
  initScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          
          // Special animations for different elements
          if (entry.target.classList.contains('stat-item')) {
            this.animateStats(entry.target);
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.featured-article, .category-card, .news-card, .stat-item'
    );
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Animate statistics
  animateStats(statItem) {
    const numberElement = statItem.querySelector('.stat-number');
    const targetText = numberElement.textContent;
    const targetNumber = parseInt(targetText);
    
    let current = 0;
    const increment = Math.max(Math.floor(targetNumber / 30), 1);
    const duration = 1000; // 1 second
    
    const counter = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        clearInterval(counter);
      }
      numberElement.textContent = current;
    }, 16);
  }
  
  // Initialize newsletter
  initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterButton = document.querySelector('.newsletter-button');
    const newsletterInput = document.querySelector('.newsletter-input');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(newsletterInput.value);
      });
    }
    
    if (newsletterButton) {
      newsletterButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(newsletterInput.value);
      });
    }
  }
  
  // Handle newsletter submission
  handleNewsletterSubmit(email) {
    const button = document.querySelector('.newsletter-button');
    const input = document.querySelector('.newsletter-input');
    
    if (!this.validateEmail(email)) {
      this.showToast('Please enter a valid email address', 'error');
      input.style.border = '2px solid #f44336';
      return;
    }
    
    // Simulate subscription
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
      button.style.background = '#4caf50';
      input.value = '';
      input.style.border = 'none';
      
      this.showToast('Successfully subscribed to newsletter!', 'success');
      
      // Reset after delay
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
        button.style.background = '';
        button.disabled = false;
      }, 2000);
    }, 1500);
  }
  
  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Initialize category cards
  initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const category = card.querySelector('.category-title').textContent;
        this.filterByCategory(category);
      });
    });
  }
  
  // Filter by category (placeholder)
  filterByCategory(category) {
    this.showToast(`Filtering by: ${category}`, 'info');
    // In a real implementation, this would filter the news
  }
  
  // Initialize load more functionality
  initLoadMore() {
    const loadMoreButton = document.querySelector('.load-more-button');
    
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', () => {
        this.loadMoreArticles();
      });
    }
  }
  
  // Load more articles simulation
  loadMoreArticles() {
    const button = document.querySelector('.load-more-button');
    const newsGrid = document.querySelector('.news-grid');
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
      // Create mock article elements
      for (let i = 0; i < 3; i++) {
        const mockArticle = this.createMockArticle();
        newsGrid.appendChild(mockArticle);
        
        // Animate new article
        setTimeout(() => {
          mockArticle.style.opacity = '1';
          mockArticle.style.transform = 'translateY(0)';
        }, 100 * i);
      }
      
      button.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
      button.disabled = false;
      
      this.showToast('Loaded 3 more articles', 'success');
    }, 1500);
  }
  
  // Create mock article element
  createMockArticle() {
    const article = document.createElement('article');
    article.className = 'news-card';
    article.style.opacity = '0';
    article.style.transform = 'translateY(20px)';
    article.style.transition = 'all 0.4s ease';
    
    article.innerHTML = `
      <div class="news-image">
        <img src="/assets/images/new-article.png" alt="News">
        <div class="news-category">AI Research</div>
      </div>
      <div class="news-content">
        <h3 class="news-title">New Article Title</h3>
        <p class="news-excerpt">
          This is a newly loaded article excerpt that demonstrates the load more functionality.
        </p>
        <div class="news-meta">
          <span class="news-date">
            <i class="fas fa-calendar"></i>
            Just now
          </span>
          <span class="news-author">
            <i class="fas fa-user"></i>
            News Team
          </span>
        </div>
      </div>
    `;
    
    // Add click handler
    article.addEventListener('click', () => {
      this.openArticle(article);
    });
    
    return article;
  }
  
  // Open article (placeholder)
  openArticle(article) {
    const title = article.querySelector('.article-title, .news-title').textContent;
    this.showToast(`Opening: ${title}`, 'info');
    // In a real implementation, this would navigate to article detail page
  }
  
  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add toast styles if not exist
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          animation: slideIn 0.3s ease;
        }
        .toast.info { background: #2196f3; }
        .toast.success { background: #4caf50; }
        .toast.error { background: #f44336; }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
  
  // Update breaking news ticker
  updateBreakingNews() {
    const tickerItems = [
      'OpenAI releases GPT-4 Turbo with enhanced capabilities',
      'Revolutionary new dataset for Vietnamese NLP published',
      'Meta announces LLaMA 3 with multimodal support',
      'Google\'s Gemini Ultra achieves new benchmarks',
      'Breakthrough in quantum computing applications',
      'New transformer architecture reduces training time by 50%'
    ];
    
    const ticker = document.querySelector('.ticker-scroll');
    if (ticker) {
      // Randomly select 4 items
      const selectedItems = tickerItems.sort(() => 0.5 - Math.random()).slice(0, 4);
      ticker.innerHTML = selectedItems.map(item => 
        `<span class="ticker-item">${item}</span><span class="ticker-separator">•</span>`
      ).join('');
    }
  }
  
  // Initialize auto-refresh
  initAutoRefresh() {
    // Update breaking news every 30 seconds
    setInterval(() => {
      this.updateBreakingNews();
    }, 30000);
    
    // Update counters every 5 minutes
    setInterval(() => {
      this.updateCounters();
    }, 300000);
  }
  
  // Update counters
  updateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const currentValue = parseInt(stat.textContent);
      const increase = Math.floor(Math.random() * 5) + 1;
      const newValue = currentValue + increase;
      
      // Animate counter update
      let current = currentValue;
      const increment = Math.max(Math.floor(increase / 10), 1);
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= newValue) {
          current = newValue;
          clearInterval(counter);
        }
        stat.textContent = current;
      }, 50);
      
      // Add visual effect
      stat.style.color = '#4caf50';
      setTimeout(() => {
        stat.style.color = '';
      }, 1000);
    });
  }
}

// Initialize the news page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NewsPage();
  
  // Add page loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Export for global access
window.NewsPage = NewsPage;