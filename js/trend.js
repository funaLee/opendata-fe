/**
 * Trend Page JavaScript
 * Handles animations, interactive elements, and data visualization
 */

class TrendPage {
  constructor() {
    this.init();
  }
  
  init() {
    this.initAnimations();
    this.initInteractiveElements();
    this.initScrollEffects();
    this.initDataRefresh();
    this.initCharts();
  }
  
  // Initialize entrance animations
  initAnimations() {
    // Animate trending topics with staggered effect
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.95)';
      card.style.transition = 'all 0.6s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate paper items
    const paperItems = document.querySelectorAll('.paper-item');
    paperItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'all 0.5s ease';
      item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Animate task cards
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9)';
      card.style.transition = 'all 0.6s ease';
      card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.5s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
    });
  }
  
  // Initialize interactive elements
  initInteractiveElements() {
    // Add hover effects to topic cards
    const topicCards = document.querySelectorAll('.topic-card');
    
    topicCards.forEach(card => {
      const tags = card.querySelectorAll('.tag');
      
      card.addEventListener('mouseenter', () => {
        // Animate tags with stagger
        tags.forEach((tag, index) => {
          setTimeout(() => {
            tag.style.transform = 'translateY(-3px) scale(1.05)';
          }, index * 100);
        });
      });
      
      card.addEventListener('mouseleave', () => {
        tags.forEach(tag => {
          tag.style.transform = '';
        });
      });
    });
    
    // Add click effects to papers
    const paperItems = document.querySelectorAll('.paper-item');
    paperItems.forEach(item => {
      item.addEventListener('click', () => {
        this.showPaperDetails(item);
      });
    });
    
    // Interactive leaderboard items
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    leaderboardItems.forEach(item => {
      item.addEventListener('click', () => {
        this.showModelDetails(item);
      });
    });
    
    // Dataset pill interactions
    const datasetPills = document.querySelectorAll('.dataset-pill');
    datasetPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigateToDataset(pill.textContent);
      });
    });
  }
  
  // Initialize scroll effects
  initScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger animation
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          
          // Specific animations for different elements
          if (entry.target.classList.contains('stat-card')) {
            this.animateStatCard(entry.target);
          }
          
          if (entry.target.classList.contains('activity-item')) {
            this.animateActivityItem(entry.target);
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(`
      .topic-card, .paper-item, .task-card, .stat-card, .activity-item
    `);
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Animate stat card with counter effect
  animateStatCard(card) {
    const numberElement = card.querySelector('.stat-number');
    const targetText = numberElement.textContent;
    const targetNumber = parseInt(targetText.replace(/\D/g, ''));
    const suffix = targetText.replace(/[\d,]/g, '');
    
    let current = 0;
    const increment = Math.max(Math.floor(targetNumber / 30), 1);
    const duration = 1000; // 1 second
    const steps = duration / 16; // ~60fps
    
    const counter = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        current = targetNumber;
        clearInterval(counter);
      }
      
      numberElement.textContent = current.toLocaleString() + suffix;
    }, 16);
  }
  
  // Animate activity item
  animateActivityItem(item) {
    const avatar = item.querySelector('.activity-avatar');
    const type = item.querySelector('.activity-type');
    
    // Pulse effect
    avatar.style.animation = 'pulse 1s ease-in-out';
    type.style.animation = 'pulse 1s ease-in-out 0.2s';
    
    // Add the pulse animation if not exists
    if (!document.getElementById('pulse-animation')) {
      const style = document.createElement('style');
      style.id = 'pulse-animation';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Initialize data refresh functionality
  initDataRefresh() {
    this.lastRefresh = Date.now();
    
    // Auto-refresh every 5 minutes
    setInterval(() => {
      this.refreshTrendingData();
    }, 5 * 60 * 1000);
    
    // Add manual refresh button functionality
    this.addRefreshButton();
  }
  
  // Add refresh button to the page
  addRefreshButton() {
    const header = document.querySelector('.trend-header');
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
    refreshBtn.onclick = () => this.refreshTrendingData();
    
    // Add CSS for refresh button
    if (!document.getElementById('refresh-btn-styles')) {
      const style = document.createElement('style');
      style.id = 'refresh-btn-styles';
      style.textContent = `
        .refresh-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .refresh-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }
        .refresh-btn.loading i {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    header.style.position = 'relative';
    header.appendChild(refreshBtn);
  }
  
  // Refresh trending data
  async refreshTrendingData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
      refreshBtn.classList.add('loading');
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refreshing...';
    }
    
    try {
      // Simulate API call
      await this.simulateAPICall();
      
      // Update trending topics
      this.updateTrendingTopics();
      
      // Update statistics
      this.updateStatistics();
      
      // Show success message
      this.showToast('Data refreshed successfully!', 'success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      this.showToast('Failed to refresh data. Please try again.', 'error');
    } finally {
      if (refreshBtn) {
        refreshBtn.classList.remove('loading');
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
      }
    }
    
    this.lastRefresh = Date.now();
  }
  
  // Simulate API call delay
  simulateAPICall() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000 + Math.random() * 1000);
    });
  }
  
  // Update trending topics (simulate)
  updateTrendingTopics() {
    const topicStats = document.querySelectorAll('.topic-stats .stat');
    
    topicStats.forEach(stat => {
      if (stat.textContent.includes('%')) {
        const currentValue = parseInt(stat.textContent);
        const change = Math.floor(Math.random() * 50) - 25; // Random change -25 to +25
        const newValue = Math.max(0, currentValue + change);
        stat.textContent = stat.textContent.replace(/\d+/, newValue);
      }
    });
  }
  
  // Update statistics (simulate)
  updateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const currentValue = parseInt(stat.textContent.replace(/\D/g, ''));
      const increase = Math.floor(Math.random() * 100) + 1;
      const newValue = currentValue + increase;
      const suffix = stat.textContent.replace(/[\d,]/g, '');
      stat.textContent = newValue.toLocaleString() + suffix;
      
      // Animate the change
      stat.style.color = '#4caf50';
      setTimeout(() => {
        stat.style.color = '';
      }, 1000);
    });
  }
  
  // Initialize mock charts
  initCharts() {
    this.createTrendChart();
    this.createPerformanceChart();
  }
  
  // Create trend visualization (mock)
  createTrendChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'trend-chart';
    chartContainer.innerHTML = `
      <h3>Research Activity Trend</h3>
      <div class="chart-placeholder">
        <canvas id="trendCanvas" width="400" height="200"></canvas>
      </div>
    `;
    
    document.querySelector('.trending-topics').appendChild(chartContainer);
    
    // Mock chart with canvas
    const canvas = document.getElementById('trendCanvas');
    const ctx = canvas.getContext('2d');
    this.drawMockChart(ctx, canvas.width, canvas.height);
  }
  
  // Create performance visualization (mock)
  createPerformanceChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'performance-chart';
    chartContainer.innerHTML = `
      <h3>Top Models Performance</h3>
      <div class="chart-placeholder">
        <canvas id="performanceCanvas" width="400" height="200"></canvas>
      </div>
    `;
    
    document.querySelector('.popular-tasks').appendChild(chartContainer);
    
    // Mock chart with canvas
    const canvas = document.getElementById('performanceCanvas');
    const ctx = canvas.getContext('2d');
    this.drawMockBarChart(ctx, canvas.width, canvas.height);
  }
  
  // Draw mock line chart
  drawMockChart(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw trend line
    ctx.strokeStyle = '#5a6bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const points = [];
    for (let i = 0; i <= 50; i++) {
      const x = (width / 50) * i;
      const y = height - (Math.sin(i * 0.1) * 50 + 50 + Math.random() * 30);
      points.push({ x, y });
    }
    
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();
    
    // Add gradient fill
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(90, 107, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(90, 107, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  // Draw mock bar chart
  drawMockBarChart(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    
    const models = ['EfficientNet', 'ResNet', 'ViT', 'ConvNext', 'Swin'];
    const scores = [88.4, 87.9, 87.1, 86.8, 86.2];
    const barWidth = width / models.length * 0.8;
    const spacing = width / models.length * 0.2;
    
    scores.forEach((score, index) => {
      const barHeight = (score / 100) * height * 0.8;
      const x = index * (width / models.length) + spacing / 2;
      const y = height - barHeight;
      
      // Draw bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#5a6bff');
      gradient.addColorStop(1, '#4152e0');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw score label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${score}%`, x + barWidth / 2, y - 5);
      
      // Draw model name
      ctx.fillText(models[index], x + barWidth / 2, height - 5);
    });
  }
  
  // Show paper details (placeholder)
  showPaperDetails(paperItem) {
    const title = paperItem.querySelector('.paper-title a').textContent;
    this.showToast(`Opening details for: ${title}`, 'info');
    // In a real implementation, this would navigate to a detailed view
  }
  
  // Show model details (placeholder)
  showModelDetails(leaderboardItem) {
    const model = leaderboardItem.querySelector('.model').textContent;
    this.showToast(`Showing details for: ${model}`, 'info');
    // In a real implementation, this would show model details
  }
  
  // Navigate to dataset (placeholder)
  navigateToDataset(datasetName) {
    this.showToast(`Navigating to ${datasetName} dataset`, 'info');
    // In a real implementation, this would navigate to the dataset page
  }
  
  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add toast styles
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          font-size: 14px;
          z-index: 1000;
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.3s ease;
        }
        .toast.info { background: #2196f3; }
        .toast.success { background: #4caf50; }
        .toast.error { background: #f44336; }
        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}

// Initialize the trend page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TrendPage();
  
  // Add page loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Export for global access
window.TrendPage = TrendPage;