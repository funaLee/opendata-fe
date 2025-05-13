/**
 * More Page JavaScript
 * Handles animations and interactive elements
 */

class MorePage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initAnimations();
    this.initInteractiveElements();
    this.initVisibilityObserver();
    this.initParticleEffect();
  }
  
  // Initialize entrance animations
  initAnimations() {
    // Animate navigation cards
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate resource items
    const resourceItems = document.querySelectorAll('.resource-item');
    resourceItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(15px)';
      item.style.transition = 'all 0.5s ease';
      item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach((button, index) => {
      button.style.opacity = '0';
      button.style.transform = 'scale(0.9)';
      button.style.transition = 'all 0.4s ease';
      button.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  // Initialize interactive elements
  initInteractiveElements() {
    // Add hover effects to navigation cards
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
      
      // Add click ripple effect
      card.addEventListener('click', (e) => {
        this.createRippleEffect(e, card);
      });
    });
    
    // Add hover effects to action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.02)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Animate decoration items
    this.initDecorationAnimation();
  }
  
  // Animation for card hover effects
  animateCardHover(card, isHover) {
    const icon = card.querySelector('.card-icon');
    const featureTags = card.querySelectorAll('.feature-tag');
    const arrow = card.querySelector('.card-arrow');
    
    if (isHover) {
      // Stagger animation for feature tags
      featureTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.transform = 'translateY(-3px) scale(1.05)';
        }, index * 50);
      });
      
      // Pulse arrow
      arrow.style.animation = 'pulse 1s ease infinite';
    } else {
      featureTags.forEach(tag => {
        tag.style.transform = '';
      });
      arrow.style.animation = '';
    }
  }
  
  // Create ripple effect on click
  createRippleEffect(e, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Add ripple CSS if not already added
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Initialize decoration items animation
  initDecorationAnimation() {
    const decorationItems = document.querySelectorAll('.decoration-item');
    
    decorationItems.forEach((item, index) => {
      // Add floating animation with different delays
      item.style.animation = `float 3s ease-in-out ${index * 0.5}s infinite`;
      
      // Add interactive hover effects
      item.addEventListener('mouseenter', () => {
        item.style.animationPlayState = 'paused';
        item.style.transform = 'translateY(-10px) rotate(10deg) scale(1.1)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.animationPlayState = 'running';
        item.style.transform = '';
      });
    });
  }
  
  // Initialize intersection observer for scroll animations
  initVisibilityObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate element into view
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          
          // Add special effects for different types
          if (entry.target.classList.contains('nav-card')) {
            this.animateNavCard(entry.target);
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all animated elements
    const elementsToObserve = document.querySelectorAll(
      '.nav-card, .resource-item, .action-button'
    );
    
    elementsToObserve.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Animate navigation card on visibility
  animateNavCard(card) {
    const icon = card.querySelector('.card-icon');
    const title = card.querySelector('.card-title');
    const tags = card.querySelectorAll('.feature-tag');
    
    // Animate icon with a slight delay
    setTimeout(() => {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      setTimeout(() => {
        icon.style.transform = '';
      }, 300);
    }, 200);
    
    // Animate title
    title.style.transform = 'translateX(-20px)';
    title.style.opacity = '0';
    setTimeout(() => {
      title.style.transition = 'all 0.3s ease';
      title.style.transform = 'translateX(0)';
      title.style.opacity = '1';
    }, 300);
    
    // Animate tags with stagger
    tags.forEach((tag, index) => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(10px)';
      setTimeout(() => {
        tag.style.transition = 'all 0.3s ease';
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0)';
      }, 400 + (index * 100));
    });
  }
  
  // Initialize particle effect for hero section
  initParticleEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.more-hero');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    
    hero.appendChild(canvas);
    
    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create floating particles
    const particles = [];
    const particleCount = 30;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = this.getRandomColor();
      }
      
      getRandomColor() {
        const colors = ['#5a6bff', '#4caf50', '#ff5722', '#9c27b0'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  // Add smooth scrolling to section links
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
}

// Initialize the more page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MorePage();
  
  // Add page loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
});

// Export for global access
window.MorePage = MorePage;