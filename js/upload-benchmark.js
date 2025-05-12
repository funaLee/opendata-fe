/**
 * Complete Benchmark List Page Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // State management
  let allBenchmarks = [];
  let filteredBenchmarks = [];
  let currentFilters = {
    task: ['all'],
    search: ''
  };

  // Get DOM elements
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  const searchInput = document.getElementById('benchmarkSearch');
  const benchmarksGrid = document.getElementById('benchmarksGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const totalBenchmarksCount = document.getElementById('totalBenchmarks');

  // Initialize page
  initializePage();

  function initializePage() {
    // Add animations to main elements
    addPageAnimations();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize filter functionality
    setupFilters();
    
    // Store initial benchmarks
    allBenchmarks = Array.from(document.querySelectorAll('.benchmark-card'));
    filteredBenchmarks = [...allBenchmarks];
    
    // Apply initial animations to cards
    animateBenchmarkCards();
  }

  function addPageAnimations() {
    const searchTitle = document.querySelector('.search-title');
    const subtitle = document.querySelector('.subtitle');
    const actionButtons = document.querySelector('.action-buttons');
    const benchmarkSearch = document.querySelector('.benchmark-search');
    const benchmarkStats = document.querySelector('.benchmark-stats');
    
    if (searchTitle) searchTitle.classList.add('animate-fadeInDown');
    if (subtitle) subtitle.classList.add('animate-fadeInUp');
    if (actionButtons) actionButtons.classList.add('animate-fadeIn');
    if (benchmarkSearch) benchmarkSearch.classList.add('animate-fadeInUp');
    if (benchmarkStats) {
      setTimeout(() => {
        benchmarkStats.classList.add('animate-fadeInUp');
      }, 300);
    }
  }

  function setupEventListeners() {
    // Filter toggle
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener('click', toggleFilterPanel);
    }

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', debounce(handleSearch, 300));
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      });
    }

    // Load more button
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreBenchmarks);
    }

    // View results and submit result buttons
    document.addEventListener('click', function(e) {
      if (e.target.closest('.view-results-btn')) {
        handleViewResults(e.target.closest('.view-results-btn'));
      }
      if (e.target.closest('.submit-result-btn')) {
        handleSubmitResult(e.target.closest('.submit-result-btn'));
      }
    });

    // Close filter panel when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.filter-panel') && !e.target.closest('.filter-button')) {
        filterPanel?.classList.remove('active');
      }
    });
  }

  function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    
    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleFilterChange);
    });
  }

  function toggleFilterPanel() {
    filterPanel.classList.toggle('active');
    
    // Update filter button icon
    const icon = filterToggle.querySelector('i');
    if (filterPanel.classList.contains('active')) {
      icon.style.transform = 'rotate(180deg)';
    } else {
      icon.style.transform = 'rotate(0deg)';
    }
  }

  function handleSearch() {
    const searchQuery = searchInput.value.trim().toLowerCase();
    currentFilters.search = searchQuery;
    applyFilters();
  }

  function handleFilterChange(e) {
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    if (value === 'all') {
      // If "All Tasks" is checked, uncheck all others
      if (isChecked) {
        currentFilters.task = ['all'];
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
          cb.checked = cb.value === 'all';
        });
      }
    } else {
      // If specific task is checked, uncheck "All Tasks"
      if (isChecked) {
        currentFilters.task = currentFilters.task.filter(t => t !== 'all');
        if (!currentFilters.task.includes(value)) {
          currentFilters.task.push(value);
        }
        document.querySelector('input[value="all"]').checked = false;
      } else {
        currentFilters.task = currentFilters.task.filter(t => t !== value);
        
        // If no tasks are selected, check "All Tasks"
        if (currentFilters.task.length === 0) {
          currentFilters.task = ['all'];
          document.querySelector('input[value="all"]').checked = true;
        }
      }
    }
    
    applyFilters();
  }

  function applyFilters() {
    const searchQuery = currentFilters.search.toLowerCase();
    const selectedTasks = currentFilters.task;
    
    filteredBenchmarks = allBenchmarks.filter(card => {
      // Search filter
      if (searchQuery) {
        const title = card.querySelector('.benchmark-title').textContent.toLowerCase();
        const task = card.querySelector('.benchmark-task').textContent.toLowerCase();
        const description = card.querySelector('.benchmark-description').textContent.toLowerCase();
        const dataset = card.querySelector('.detail-item .value').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchQuery) || 
                             task.includes(searchQuery) || 
                             description.includes(searchQuery) ||
                             dataset.includes(searchQuery);
        
        if (!matchesSearch) return false;
      }
      
      // Task filter
      if (!selectedTasks.includes('all')) {
        const cardTask = card.getAttribute('data-task');
        if (!selectedTasks.includes(cardTask)) return false;
      }
      
      return true;
    });
    
    updateDisplay();
  }

  function updateDisplay() {
    // Hide all cards
    allBenchmarks.forEach(card => {
      card.style.display = 'none';
    });
    
    // Show filtered cards with animation
    filteredBenchmarks.forEach((card, index) => {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });
    
    // Show empty state if no results
    showEmptyState(filteredBenchmarks.length === 0);
    
    // Update total count
    if (totalBenchmarksCount) {
      totalBenchmarksCount.textContent = filteredBenchmarks.length;
    }
  }

  function showEmptyState(show) {
    let emptyState = document.querySelector('.empty-state');
    
    if (show && !emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <i class="fas fa-search"></i>
        <h3>No benchmarks found</h3>
        <p>Try adjusting your search criteria or filters</p>
      `;
      benchmarksGrid.appendChild(emptyState);
    } else if (!show && emptyState) {
      emptyState.remove();
    }
  }

  function animateBenchmarkCards() {
    setTimeout(() => {
      const cards = document.querySelectorAll('.benchmark-card');
      
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.6s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      });
    }, 300);
  }

  function loadMoreBenchmarks() {
    // Show loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more benchmarks
    setTimeout(() => {
      const newBenchmarks = generateMoreBenchmarks();
      const currentCount = allBenchmarks.length;
      
      newBenchmarks.forEach((benchmarkData, index) => {
        const card = createBenchmarkCard(benchmarkData);
        allBenchmarks.push(card);
        benchmarksGrid.appendChild(card);
        
        // Apply current filters to new card
        if (shouldShowCard(card)) {
          filteredBenchmarks.push(card);
          
          // Animate new card
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, (index + 1) * 100);
        } else {
          card.style.display = 'none';
        }
      });
      
      // Reset button
      loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Benchmarks';
      loadMoreBtn.disabled = false;
      
      // Update counters
      updateStatNumbers();
      
      // Hide load more button if we've loaded enough
      if (allBenchmarks.length >= 20) {
        loadMoreBtn.style.display = 'none';
      }
    }, 1000);
  }

  function generateMoreBenchmarks() {
    return [
      {
        title: 'CityscapeSemanticSegmentation',
        task: 'Semantic Segmentation',
        taskType: 'object-detection',
        description: 'Urban street scene understanding với pixel-level annotations cho 19 lớp object.',
        dataset: 'Cityscapes',
        size: '25K images',
        metrics: ['IoU', 'Pixel Accuracy', 'Mean IoU'],
        badges: ['standard', 'task-tag'],
        icon: 'fa-road',
        modelCount: 89,
        date: 'Sep 2024'
      },
      {
        title: 'CommonVoice',
        task: 'Speech Recognition',
        taskType: 'speech-recognition',
        description: 'Multilingual speech recognition dataset với 100+ ngôn ngữ từ Mozilla.',
        dataset: 'Common Voice',
        size: '25,000 hours',
        metrics: ['WER', 'CER', 'Language Coverage'],
        badges: ['multilingual', 'task-tag'],
        icon: 'fa-volume-up',
        modelCount: 34,
        date: 'Aug 2024'
      },
      {
        title: 'OPUS-MT Evaluation',
        task: 'Machine Translation',
        taskType: 'machine-translation',
        description: 'Large-scale evaluation suite cho machine translation với 1000+ language pairs.',
        dataset: 'OPUS-100',
        size: '100 languages',
        metrics: ['BLEU', 'chrF++', 'METEOR', 'BERTScore'],
        badges: ['comprehensive', 'task-tag'],
        icon: 'fa-exchange-alt',
        modelCount: 67,
        date: 'Jul 2024'
      }
    ];
  }

  function createBenchmarkCard(data) {
    const card = document.createElement('div');
    card.className = 'benchmark-card';
    card.setAttribute('data-task', data.taskType);
    
    card.innerHTML = `
      <div class="benchmark-header">
        <div class="benchmark-icon">
          <i class="fas ${data.icon}"></i>
        </div>
        <div class="benchmark-info">
          <h3 class="benchmark-title">${data.title}</h3>
          <p class="benchmark-task">${data.task}</p>
          <div class="benchmark-badges">
            ${data.badges.map(badge => `<span class="badge ${badge}">${badge}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="benchmark-content">
        <p class="benchmark-description">${data.description}</p>
        <div class="benchmark-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">Dataset:</span>
              <span class="value">${data.dataset}</span>
            </div>
            <div class="detail-item">
              <span class="label">Size:</span>
              <span class="value">${data.size}</span>
            </div>
          </div>
          <div class="detail-item metrics-item">
            <span class="label">Metrics:</span>
            <div class="metrics-list">
              ${data.metrics.map(metric => `<span class="metric-tag">${metric}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="benchmark-footer">
        <div class="benchmark-actions">
          <button class="view-results-btn" data-benchmark="${data.title.toLowerCase().replace(/\s+/g, '-')}">
            <i class="fas fa-eye"></i>
            View Results
          </button>
          <button class="submit-result-btn" data-benchmark="${data.title.toLowerCase().replace(/\s+/g, '-')}">
            <i class="fas fa-plus"></i>
            Submit Result
          </button>
        </div>
        <div class="benchmark-meta">
          <span class="model-count">
            <i class="fas fa-robot"></i> ${data.modelCount} models evaluated
          </span>
          <span class="benchmark-date">Updated: ${data.date}</span>
        </div>
      </div>
    `;
    
    return card;
  }

  function shouldShowCard(card) {
    const searchQuery = currentFilters.search.toLowerCase();
    const selectedTasks = currentFilters.task;
    
    // Search filter
    if (searchQuery) {
      const title = card.querySelector('.benchmark-title').textContent.toLowerCase();
      const task = card.querySelector('.benchmark-task').textContent.toLowerCase();
      const description = card.querySelector('.benchmark-description').textContent.toLowerCase();
      
      const matchesSearch = title.includes(searchQuery) || 
                           task.includes(searchQuery) || 
                           description.includes(searchQuery);
      
      if (!matchesSearch) return false;
    }
    
    // Task filter
    if (!selectedTasks.includes('all')) {
      const cardTask = card.getAttribute('data-task');
      if (!selectedTasks.includes(cardTask)) return false;
    }
    
    return true;
  }
}
)