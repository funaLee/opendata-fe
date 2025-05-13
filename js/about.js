/**
 * About Page JavaScript
 * Handles animations and interactive elements
 */

class AboutPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initAnimations();
    this.initCounters();
    this.initVisibilityObserver();
    this.initInteractiveElements();
  }
  
  // Initialize scroll animations
  initAnimations() {
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.feature-card, .vision-item, .tech-category');
    
    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'all 0.6s ease';
      element.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  // Initialize counter animations for stats
  initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/,/g, ''));
      const increment = target / 50;
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString() + '+';
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + '+';
        }
      };
      
      // Store the animation function to be called when visible
      counter._animate = updateCounter;
    });
  }
  
  // Initialize intersection observer for animations
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
          entry.target.style.transform = 'translateY(0)';
          
          // Start counter animation if it's a stat number
          if (entry.target.classList.contains('stat-number') && entry.target._animate) {
            entry.target._animate();
            entry.target._animate = null; // Prevent multiple animations
          }
          
          // Animate tech items in sequence
          if (entry.target.classList.contains('tech-category')) {
            this.animateTechItems(entry.target);
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe animated elements
    const elementsToObserve = document.querySelectorAll(
      '.feature-card, .vision-item, .tech-category, .stat-item'
    );
    
    elementsToObserve.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Animate tech items within a category
  animateTechItems(categoryElement) {
    const techItems = categoryElement.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 100);
    });
  }
  
  // Initialize interactive elements
  initInteractiveElements() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateFeatureCard(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateFeatureCard(card, false);
      });
    });
    
    // Add parallax effect to hero section
    this.initParallaxEffect();
    
    // Add floating animation to icons
    this.initFloatingIcons();
  }
  
  // Animate feature card on hover
  animateFeatureCard(card, isHover) {
    const icon = card.querySelector('.feature-icon');
    const techTags = card.querySelectorAll('.tech-tag');
    
    if (isHover) {
      icon.style.transform = 'rotate(5deg) scale(1.1)';
      techTags.forEach((tag, index) => {
        setTimeout(() => {
          tag.style.transform = 'translateY(-3px)';
        }, index * 50);
      });
    } else {
      icon.style.transform = '';
      techTags.forEach(tag => {
        tag.style.transform = '';
      });
    }
  }
  
  // Initialize parallax effect
  initParallaxEffect() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.about-hero::before');
      
      if (parallax && scrolled <= window.innerHeight) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }
    });
  }
  
  // Initialize floating animation for icons
  initFloatingIcons() {
    const icons = document.querySelectorAll('.section-icon, .feature-icon, .vision-icon');
    
    icons.forEach((icon, index) => {
      icon.style.animation = `float 6s ease-in-out ${index * 0.5}s infinite`;
    });
    
    // Add the floating animation CSS
    if (!document.getElementById('floating-animation')) {
      const style = document.createElement('style');
      style.id = 'floating-animation';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Add smooth scrolling to CTA buttons
  initSmoothScrolling() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      });
    });
  }
  
  // Create particle effect for hero section
  createParticleEffect() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.about-hero');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.3';
    
    hero.appendChild(canvas);
    
    const resizeCanvas = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle system
    const particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.1;
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
        ctx.fillStyle = '#5a6bff';
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
}

// Initialize the about page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AboutPage();
  
  // Add page loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Export for global access
window.AboutPage = AboutPage;