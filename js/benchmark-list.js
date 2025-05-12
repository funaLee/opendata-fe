/**
 * Benchmark page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to main elements
  const searchTitle = document.querySelector('.search-title');
  const subtitle = document.querySelector('.subtitle');
  const actionButtons = document.querySelector('.action-buttons');
  const benchmarkSearch = document.querySelector('.benchmark-search');
  
  if (searchTitle) searchTitle.classList.add('animate-fadeInDown');
  if (subtitle) subtitle.classList.add('animate-fadeInUp');
  if (actionButtons) actionButtons.classList.add('animate-fadeIn');
  if (benchmarkSearch) benchmarkSearch.classList.add('animate-fadeInUp');
  
  // Add staggered animations to benchmark cards
  setTimeout(() => {
    const benchmarkCards = document.querySelectorAll('.benchmark-card');
    
    benchmarkCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 300);
  
  // Load more button functionality
  const loadMoreButton = document.querySelector('.load-more-button');
  
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function() {
      const benchmarksGrid = document.querySelector('.benchmarks-grid');
      
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      // Simulate loading more benchmarks
      setTimeout(() => {
        // Create sample benchmark cards
        const newBenchmarks = [
          {
            title: 'WMT Translation Benchmark',
            task: 'Machine Translation',
            description: 'Benchmark tiêu chuẩn cho task dịch máy với nhiều cặp ngôn ngữ khác nhau.',
            dataset: 'WMT Datasets',
            metrics: ['BLEU Score', 'ROUGE Score', 'ChrF Score'],
            date: 'Jul 2024'
          },
          {
            title: 'LibriSpeech ASR',
            task: 'Speech Recognition',
            description: 'Benchmark cho automatic speech recognition sử dụng corpus AudioBooks từ LibriVox.',
            dataset: 'LibriSpeech',
            metrics: ['WER', 'CER'],
            date: 'Jun 2024'
          }
        ];
        
        // Add new benchmarks to the grid
        newBenchmarks.forEach((benchmark, index) => {
          const card = createBenchmarkCard(benchmark);
          
          // Add to grid with animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          benchmarksGrid.appendChild(card);
          
          setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });
        
        // Reset button
        this.innerHTML = 'Load More Benchmarks <i class="fas fa-chevron-down"></i>';
      }, 1000);
    });
  }
  
  // Search functionality
  const searchInput = document.querySelector('.benchmark-search input');
  const searchBtn = document.querySelector('.benchmark-search button');
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });
  }
  
  function performSearch() {
    const searchQuery = searchInput.value.trim().toLowerCase();
    const benchmarkCards = document.querySelectorAll('.benchmark-card');
    
    if (!searchQuery) {
      // Show all cards if search is empty
      benchmarkCards.forEach(card => {
        card.style.display = 'flex';
      });
      return;
    }
    
    benchmarkCards.forEach(card => {
      const title = card.querySelector('.benchmark-title').textContent.toLowerCase();
      const task = card.querySelector('.benchmark-task').textContent.toLowerCase();
      const description = card.querySelector('.benchmark-description').textContent.toLowerCase();
      const metrics = Array.from(card.querySelectorAll('.metric-tag'))
        .map(tag => tag.textContent.toLowerCase())
        .join(' ');
      
      const isVisible = title.includes(searchQuery) || 
                       task.includes(searchQuery) || 
                       description.includes(searchQuery) ||
                       metrics.includes(searchQuery);
      
      card.style.display = isVisible ? 'flex' : 'none';
    });
  }
  
  // View results button functionality
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('view-results-btn') || 
        e.target.closest('.view-results-btn')) {
      const button = e.target.closest('.view-results-btn');
      const card = button.closest('.benchmark-card');
      const benchmarkTitle = card.querySelector('.benchmark-title').textContent;
      
      // Simulate viewing results
      showToast(`Viewing results for ${benchmarkTitle}`, 'info');
      
      // In a real implementation, this would navigate to a results page
      // window.location.href = `/benchmark-results/${benchmarkTitle}`;
    }
  });
  
  // Helper function to create a benchmark card
  function createBenchmarkCard(data) {
    const card = document.createElement('div');
    card.className = 'benchmark-card';
    
    const header = document.createElement('div');
    header.className = 'benchmark-header';
    
    const icon = document.createElement('div');
    icon.className = 'benchmark-icon';
    icon.innerHTML = '<i class="fas fa-chart-line"></i>';
    
    const info = document.createElement('div');
    info.className = 'benchmark-info';
    
    const title = document.createElement('h3');
    title.className = 'benchmark-title';
    title.textContent = data.title;
    
    const task = document.createElement('p');
    task.className = 'benchmark-task';
    task.textContent = data.task;
    
    info.appendChild(title);
    info.appendChild(task);
    header.appendChild(icon);
    header.appendChild(info);
    
    const content = document.createElement('div');
    content.className = 'benchmark-content';
    
    const description = document.createElement('p');
    description.className = 'benchmark-description';
    description.textContent = data.description;
    
    const details = document.createElement('div');
    details.className = 'benchmark-details';
    
    const datasetItem = document.createElement('div');
    datasetItem.className = 'detail-item';
    datasetItem.innerHTML = `
      <span class="label">Dataset:</span>
      <span class="value">${data.dataset}</span>
    `;
    
    const metricsItem = document.createElement('div');
    metricsItem.className = 'detail-item';
    const metricsLabel = document.createElement('span');
    metricsLabel.className = 'label';
    metricsLabel.textContent = 'Metrics:';
    
    const metricsList = document.createElement('div');
    metricsList.className = 'metrics-list';
    
    data.metrics.forEach(metric => {
      const tag = document.createElement('span');
      tag.className = 'metric-tag';
      tag.textContent = metric;
      metricsList.appendChild(tag);
    });
    
    metricsItem.appendChild(metricsLabel);
    metricsItem.appendChild(metricsList);
    
    details.appendChild(datasetItem);
    details.appendChild(metricsItem);
    content.appendChild(description);
    content.appendChild(details);
    
    const footer = document.createElement('div');
    footer.className = 'benchmark-footer';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-results-btn';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i> View Results';
    
    const date = document.createElement('span');
    date.className = 'benchmark-date';
    date.textContent = `Created: ${data.date}`;
    
    footer.appendChild(viewBtn);
    footer.appendChild(date);
    
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(footer);
    
    return card;
  }
  
  // Toast notification function
  function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'info' ? '#3498db' : '#2ecc71'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 3000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }
    }, 3000);
  }
  
  // Add required CSS styles for toast
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});