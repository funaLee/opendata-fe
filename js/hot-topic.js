/**
 * Hot Topic Page JavaScript
 * Handles animations, filtering, and interactive elements
 */

class HotTopicPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initAnimations();
    this.initCarousel();
    this.initFilters();
    this.initPoll();
    this.initCounters();
    this.initScrollEffects();
    this.initNewsUpdates();
  }
  
  // Initialize scroll animations
  initAnimations() {
    // Add entrance animations to trending cards
    const trendingCards = document.querySelectorAll('.trending-card');
    trendingCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add animations to news cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(-20px)';
      card.style.transition = 'all 0.5s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add animations to dataset cards
    const datasetCards = document.querySelectorAll('.dataset-card');
    datasetCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      card.style.transition = 'all 0.4s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  // Initialize dataset carousel
  initCarousel() {
    const carousel = document.querySelector('.datasets-scroll');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const cardWidth = 305; // Including gap
    let currentPosition = 0;
    
    prevBtn.addEventListener('click', () => {
      currentPosition = Math.max(currentPosition - cardWidth, 0);
      carousel.scrollTo({
        left: currentPosition,
        behavior: 'smooth'
      });
    });
    
    nextBtn.addEventListener('click', () => {
      const maxPosition = carousel.scrollWidth - carousel.clientWidth;
      currentPosition = Math.min(currentPosition + cardWidth, maxPosition);
      carousel.scrollTo({
        left: currentPosition,
        behavior: 'smooth'
      });
    });
    
    // Auto-scroll functionality
    this.initAutoScroll(carousel);
  }
  
  // Initialize auto-scroll for carousel
  initAutoScroll(carousel) {
    let autoScrollInterval;
    
    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        const maxPosition = carousel.scrollWidth - carousel.clientWidth;
        if (carousel.scrollLeft >= maxPosition) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: 305, behavior: 'smooth' });
        }
      }, 5000);
    };
    
    const stopAutoScroll = () => {
      clearInterval(autoScrollInterval);
    };
    
    // Start auto-scroll
    startAutoScroll();
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
  }
  
  // Initialize filter functionality
  initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const datasetCards = document.querySelectorAll('.dataset-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter datasets
        const filter = btn.getAttribute('data-filter');
        this.filterDatasets(datasetCards, filter);
      });
    });
  }
  
  // Filter datasets based on category
  filterDatasets(cards, filter) {
    cards.forEach((card, index) => {
      const categories = card.getAttribute('data-category') || '';
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Add fadeInUp animation if not exists
    if (!document.getElementById('fadeInUp-animation')) {
      const style = document.createElement('style');
      style.id = 'fadeInUp-animation';
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Initialize poll functionality
  initPoll() {
    const voteBtn = document.querySelector('.vote-btn');
    if (!voteBtn) return;
    
    voteBtn.addEventListener('click', () => {
      this.simulateVoting();
    });
  }
  
  // Simulate voting process
  simulateVoting() {
    const voteBtn = document.querySelector('.vote-btn');
    const pollOptions = document.querySelectorAll('.poll-option');
    const pollVotes = document.querySelector('.poll-votes');
    
    // Disable button temporarily
    voteBtn.disabled = true;
    voteBtn.textContent = 'Voting...';
    
    // Simulate network delay
    setTimeout(() => {
      // Random vote simulation
      const randomOption = Math.floor(Math.random() * pollOptions.length);
      const selectedOption = pollOptions[randomOption];
      const fillElement = selectedOption.querySelector('.option-fill');
      const percentElement = selectedOption.querySelector('.option-percent');
      
      // Update percentage
      const currentPercent = parseInt(percentElement.textContent);
      const newPercent = Math.min(currentPercent + Math.floor(Math.random() * 5) + 1, 100);
      percentElement.textContent = `${newPercent}%`;
      fillElement.style.width = `${newPercent}%`;
      
      // Update vote count
      const currentVotes = parseInt(pollVotes.textContent.replace(/[^\d]/g, ''));
      pollVotes.textContent = `${(currentVotes + 1).toLocaleString()} votes`;
      
      // Update button
      voteBtn.textContent = 'Voted!';
      voteBtn.style.background = '#4caf50';
      
      // Reset button after delay
      setTimeout(() => {
        voteBtn.disabled = false;
        voteBtn.textContent = 'Vote';
        voteBtn.style.background = '#ff5722';
      }, 2000);
    }, 1000);
  }
  
  // Initialize counter animations
  initCounters() {
    const statNumbers = document.querySelectorAll('[id$="Count"]');
    
    statNumbers.forEach(stat => {
      const targetValue = parseInt(stat.textContent);
      let currentValue = 0;
      const increment = Math.max(Math.floor(targetValue / 50), 1);
      const duration = 2000; // 2 seconds
      
      const counter = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(counter);
        }
        stat.textContent = currentValue;
      }, duration / 50);
    });
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
          
          // Special animations for specific elements
          if (entry.target.classList.contains('trending-card')) {
            this.animateTrendingCard(entry.target);
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.trending-card, .news-card, .dataset-card, .spotlight-item, .buzz-card'
    );
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Animate trending card on visibility
  animateTrendingCard(card) {
    const rank = card.querySelector('.trend-rank');
    const metrics = card.querySelectorAll('.metric');
    const tags = card.querySelectorAll('.tag');
    
    // Animate rank with bounce
    if (rank) {
      rank.style.animation = 'bounce 0.8s ease 0.3s';
    }
    
    // Stagger animate metrics
    metrics.forEach((metric, index) => {
      metric.style.animation = `slideInLeft 0.5s ease ${0.5 + (index * 0.1)}s both`;
    });
    
    // Stagger animate tags
    tags.forEach((tag, index) => {
      tag.style.animation = `slideInUp 0.3s ease ${0.8 + (index * 0.1)}s both`;
    });
    
    // Add animations if not exist
    this.addAnimationStyles();
  }
  
  // Add necessary animation styles
  addAnimationStyles() {
    if (document.getElementById('hot-topic-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'hot-topic-animations';
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize news updates simulation
  initNewsUpdates() {
    // Simulate live news updates
    this.startLiveUpdates();
    
    // Add click handlers for news items
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
      card.addEventListener('click', () => {
        this.showNewsDetails(card);
      });
    });
  }
  
  // Start live updates simulation
  startLiveUpdates() {
    setInterval(() => {
      this.updateNewsCounts();
      this.updateTrendingMetrics();
    }, 30000); // Update every 30 seconds
  }
  
  // Update news counts simulation
  updateNewsCounts() {
    const metrics = document.querySelectorAll('.topic-metrics .metric');
    
    metrics.forEach(metric => {
      const countText = metric.textContent;
      const currentCount = parseInt(countText.replace(/[^\d]/g, ''));
      const unit = countText.replace(/[\d,]/g, '').trim();
      
      if (currentCount && unit) {
        const increase = Math.floor(Math.random() * 10) + 1;
        const newCount = currentCount + increase;
        metric.textContent = metric.textContent.replace(currentCount.toLocaleString(), newCount.toLocaleString());
        
        // Add flash effect
        metric.style.color = '#4caf50';
        setTimeout(() => {
          metric.style.color = '';
        }, 1000);
      }
    });
  }
  
  // Update trending metrics
  updateTrendingMetrics() {
    const trendChanges = document.querySelectorAll('.trend-change.positive');
    
    trendChanges.forEach(change => {
      const percentText = change.textContent;
      const currentPercent = parseInt(percentText.replace(/[^\d]/g, ''));
      
      if (currentPercent) {
        const increase = Math.floor(Math.random() * 5) + 1;
        const newPercent = currentPercent + increase;
        change.innerHTML = `<i class="fas fa-arrow-up"></i> +${newPercent}%`;
        
        // Add glow effect
        change.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
        setTimeout(() => {
          change.style.boxShadow = '';
        }, 1500);
      }
    });
  }
  
  // Show news details (placeholder)
  showNewsDetails(newsCard) {
    const title = newsCard.querySelector('.news-title').textContent;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'news-modal-overlay';
    overlay.innerHTML = `
      <div class="news-modal">
        <div class="news-modal-header">
          <h2>${title}</h2>
          <button class="news-modal-close">&times;</button>
        </div>
        <div class="news-modal-content">
          <p>Detailed news content would be loaded here...</p>
          <p>This is a placeholder for the full news article.</p>
        </div>
      </div>
    `;
    
    // Add modal styles
    this.addModalStyles();
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Close modal handlers
    const closeBtn = overlay.querySelector('.news-modal-close');
    closeBtn.addEventListener('click', () => this.closeNewsModal(overlay));
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeNewsModal(overlay);
      }
    });
  }
  
  // Close news modal
  closeNewsModal(overlay) {
    overlay.remove();
    document.body.style.overflow = '';
  }
  
  // Add modal styles
  addModalStyles() {
    if (document.getElementById('news-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'news-modal-styles';
    style.textContent = `
      .news-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      
      .news-modal {
        background: white;
        border-radius: var(--radius-lg);
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
      }
      
      .news-modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .news-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
      }
      
      .news-modal-content {
        padding: 20px;
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize trending tags animation
  initTrendingTags() {
    const trendingTags = document.querySelectorAll('.trending-tag');
    
    trendingTags.forEach((tag, index) => {
      tag.addEventListener('click', () => {
        this.searchByTag(tag.querySelector('.tag-name').textContent);
      });
      
      // Add entrance animation
      tag.style.opacity = '0';
      tag.style.transform = 'translateX(-20px)';
      tag.style.transition = 'all 0.5s ease';
      tag.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  // Search by tag (placeholder)
  searchByTag(tagName) {
    console.log(`Searching for: ${tagName}`);
    // In real implementation, this would navigate to search results
    this.showToast(`Searching for ${tagName}...`);
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
          background: #333;
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          z-index: 10000;
          animation: slideInRight 0.3s ease;
        }
        
        .toast.info { background: #2196f3; }
        .toast.success { background: #4caf50; }
        .toast.error { background: #f44336; }
        
        @keyframes slideInRight {
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
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize the hot topic page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HotTopicPage();
  
  // Add page loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Export for global access
window.HotTopicPage = HotTopicPage;