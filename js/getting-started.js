/**
 * Getting Started Page JavaScript
 * Handles tab switching and FAQ interactions
 */

class GettingStarted {
  constructor() {
    this.init();
  }
  
  init() {
    this.initTabSwitching();
    this.initFAQ();
    this.initVideoCards();
    this.setActivePageLink();
  }
  
  // Initialize tab switching functionality
  initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        // Smooth scroll to tab content
        document.getElementById(targetTab).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }
  
  // Initialize FAQ accordion functionality
  initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        // Close all FAQ items first
        faqItems.forEach(faq => faq.classList.remove('open'));
        
        // Open clicked item if it wasn't already open
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }
  
  // Initialize video card interactions
  initVideoCards() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add click effect
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
        
        // Here you can add functionality to open video modal or navigate to video page
        const videoTitle = card.querySelector('h3').textContent;
        console.log(`Video clicked: ${videoTitle}`);
        
        // Show placeholder alert for now
        this.showToast(`Video "${videoTitle}" will be available soon!`);
      });
    });
  }
  
  // Set active state for navigation links
  setActivePageLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
        link.classList.add('active');
      }
    });
  }
  
  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    
    // Add styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
      color: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  // Handle keyboard navigation
  handleKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const activeTab = document.querySelector('.tab-content.active');
      const tabs = document.querySelectorAll('.tab-button');
      const currentTabIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));
      
      // Arrow key navigation for tabs
      if (e.key === 'ArrowLeft' && currentTabIndex > 0) {
        e.preventDefault();
        tabs[currentTabIndex - 1].click();
      } else if (e.key === 'ArrowRight' && currentTabIndex < tabs.length - 1) {
        e.preventDefault();
        tabs[currentTabIndex + 1].click();
      }
      
      // Escape key to close FAQ
      if (e.key === 'Escape') {
        const openFAQ = document.querySelector('.faq-item.open');
        if (openFAQ) {
          openFAQ.classList.remove('open');
        }
      }
    });
  }
  
  // Add smooth scrolling to anchor links
  initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  // Add loading effects
  initLoadingEffects() {
    // Animate elements when they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe content items
    const animatedElements = document.querySelectorAll('.content-item, .feature-card, .quick-action-card');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
}

// Initialize the getting started functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GettingStarted();
});

// Export for global access if needed
window.GettingStarted = GettingStarted;