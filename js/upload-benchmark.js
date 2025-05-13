/**
 * Enhanced Upload Benchmark Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize form state
  let currentStep = 1;
  const totalSteps = 5;
  
  // Get DOM elements
  const form = document.getElementById('uploadBenchmarkForm');
  const steps = document.querySelectorAll('.form-step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const progressPercentage = document.getElementById('progressPercentage');
  
  // Initialize components
  initializeForm();
  initializeMetricsSelector();
  addCharacterCounters();
  
  function initializeForm() {
    updateProgress();
    
    // Add event listeners for navigation
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    
    // Add form submission handler
    form.addEventListener('submit', handleSubmit);
    
    // Add validation for each step
    addStepValidation();
    
    // Add auto-save functionality
    addAutoSave();
  }
  
  function initializeMetricsSelector() {
    // Metric search functionality
    const searchInput = document.getElementById('metricSearchInput');
    const categoryTabs = document.querySelectorAll('.metric-category-tab');
    const metricsGrid = document.getElementById('metricsGrid');
    const selectedMetricsList = document.getElementById('selectedMetricsList');
    const selectedCount = document.getElementById('selectedCount');
    const clearButton = document.getElementById('clearSelectedMetrics');
    
    // Search functionality
    searchInput.addEventListener('input', function() {
      filterMetrics(this.value);
    });
    
    // Category filtering
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Update active tab
        categoryTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Filter metrics by category
        const category = this.dataset.category;
        filterMetricsByCategory(category);
      });
    });
    
    // Metric selection handling
    const metricCheckboxes = metricsGrid.querySelectorAll('input[type="checkbox"]');
    metricCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateSelectedMetrics();
        validateMetricsStep();
      });
    });
    
    // Clear all selected metrics
    clearButton.addEventListener('click', function() {
      metricCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      updateSelectedMetrics();
      validateMetricsStep();
    });
  }
  
  function filterMetrics(searchTerm) {
    const metricItems = document.querySelectorAll('.metric-item');
    const searchLower = searchTerm.toLowerCase();
    
    metricItems.forEach(item => {
      const metricName = item.querySelector('.metric-name').textContent.toLowerCase();
      const metricDescription = item.querySelector('.metric-description').textContent.toLowerCase();
      
      if (metricName.includes(searchLower) || metricDescription.includes(searchLower)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  function filterMetricsByCategory(category) {
    const metricItems = document.querySelectorAll('.metric-item');
    
    metricItems.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  function updateSelectedMetrics() {
    const selectedMetricsContainer = document.getElementById('selectedMetricsList');
    const selectedCount = document.getElementById('selectedCount');
    const checkedMetrics = document.querySelectorAll('.metric-item input[type="checkbox"]:checked');
    
    selectedCount.textContent = `(${checkedMetrics.length})`;
    
    if (checkedMetrics.length === 0) {
      selectedMetricsContainer.innerHTML = '<p class="empty-selection">Chưa có metric nào được chọn</p>';
    } else {
      const metricsHtml = Array.from(checkedMetrics).map(checkbox => {
        const metricItem = checkbox.closest('.metric-item');
        const metricName = metricItem.querySelector('.metric-name').textContent;
        const metricIcon = metricItem.querySelector('.metric-icon i').className;
        
        return `
          <div class="selected-metric-tag">
            <i class="${metricIcon}"></i>
            <span>${metricName}</span>
            <button type="button" class="remove-metric" data-metric="${checkbox.id}">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
      }).join('');
      
      selectedMetricsContainer.innerHTML = metricsHtml;
      
      // Add event listeners to remove buttons
      selectedMetricsContainer.querySelectorAll('.remove-metric').forEach(button => {
        button.addEventListener('click', function() {
          const metricId = this.dataset.metric;
          document.getElementById(metricId).checked = false;
          updateSelectedMetrics();
          validateMetricsStep();
        });
      });
    }
  }
  
  function nextStep() {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    }
  }
  
  function prevStep() {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }
  
  function goToStep(step) {
    // Hide current step
    steps[currentStep - 1].style.display = 'none';
    
    // Show target step
    currentStep = step;
    steps[currentStep - 1].style.display = 'block';
    
    // Update navigation
    updateNavigation();
    updateProgress();
    
    // Update review on final step
    if (currentStep === totalSteps) {
      updateReviewSection();
    }
  }
  
  function updateNavigation() {
    // Update previous button
    if (currentStep === 1) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'block';
    }
    
    // Update next/submit button
    if (currentStep === totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'block';
    } else {
      nextBtn.style.display = 'block';
      submitBtn.style.display = 'none';
    }
  }
  
  function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `Bước ${currentStep} / ${totalSteps}`;
    progressPercentage.textContent = Math.round(percentage) + '%';
  }
  
  function validateCurrentStep() {
    switch (currentStep) {
      case 1:
        return validateBasicInfo();
      case 2:
        return validateDatasetTask();
      case 3:
        return validateMetricsStep();
      case 4:
        return true; // Optional step
      case 5:
        return true; // Review step
      default:
        return true;
    }
  }
  
  function validateBasicInfo() {
    const name = document.getElementById('benchmarkName');
    const description = document.getElementById('benchmarkDescription');
    let isValid = true;
    
    // Validate name
    if (!name.value.trim()) {
      markInvalid(name, 'Tên benchmark là bắt buộc');
      isValid = false;
    } else if (name.value.length < 3) {
      markInvalid(name, 'Tên benchmark phải có ít nhất 3 ký tự');
      isValid = false;
    } else {
      markValid(name);
    }
    
    // Validate description
    if (!description.value.trim()) {
      markInvalid(description, 'Mô tả benchmark là bắt buộc');
      isValid = false;
    } else if (description.value.length < 20) {
      markInvalid(description, 'Mô tả phải có ít nhất 20 ký tự');
      isValid = false;
    } else {
      markValid(description);
    }
    
    return isValid;
  }
  
  function validateDatasetTask() {
    const dataset = document.getElementById('datasetSelect');
    const task = document.getElementById('taskSelect');
    let isValid = true;
    
    if (!dataset.value) {
      markInvalid(dataset, 'Vui lòng chọn dataset');
      isValid = false;
    } else {
      markValid(dataset);
    }
    
    if (!task.value) {
      markInvalid(task, 'Vui lòng chọn task');
      isValid = false;
    } else {
      markValid(task);
      // Auto-suggest metrics based on task
      suggestMetrics(task.value);
    }
    
    return isValid;
  }
  
  function validateMetricsStep() {
    const selectedMetrics = document.querySelectorAll('.metric-item input[type="checkbox"]:checked');
    
    if (selectedMetrics.length === 0) {
      showStepError('Vui lòng chọn ít nhất một metric đánh giá', 3);
      return false;
    }
    
    if (selectedMetrics.length > 10) {
      showStepError('Tối đa 10 metrics có thể được chọn', 3);
      return false;
    }
    
    hideStepError(3);
    return true;
  }
  
  function suggestMetrics(taskType) {
    const metricSuggestions = {
      'task_image_classification': ['metric_accuracy', 'metric_top1_error', 'metric_top5_error'],
      'task_object_detection': ['metric_map', 'metric_accuracy', 'metric_iou'],
      'task_semantic_segmentation': ['metric_iou', 'metric_accuracy', 'metric_precision', 'metric_recall'],
      'task_text_classification': ['metric_accuracy', 'metric_f1_score', 'metric_precision', 'metric_recall'],
      'task_machine_translation': ['metric_bleu', 'metric_rouge'],
      'task_speech_recognition': ['metric_wer', 'metric_cer'],
      'task_question_answering': ['metric_f1_score', 'metric_accuracy'],
    };
    
    const suggestions = metricSuggestions[taskType] || [];
    
    if (suggestions.length > 0) {
      showMetricSuggestions(suggestions);
    }
  }
  
  function showMetricSuggestions(metricIds) {
    // Highlight suggested metrics
    const metricItems = document.querySelectorAll('.metric-item');
    
    metricItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (metricIds.includes(checkbox.id)) {
        item.classList.add('suggested');
      } else {
        item.classList.remove('suggested');
      }
    });
    
    // Show suggestion banner
    const suggestionBanner = document.createElement('div');
    suggestionBanner.className = 'metric-suggestions';
    suggestionBanner.innerHTML = `
      <div class="suggestion-content">
        <i class="fas fa-lightbulb"></i>
        <span>Chúng tôi đề xuất các metrics phù hợp cho task này</span>
        <button type="button" class="apply-suggestions">Áp dụng</button>
        <button type="button" class="dismiss-suggestions">&times;</button>
      </div>
    `;
    
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.insertBefore(suggestionBanner, metricsGrid.firstChild);
    
    // Handle suggestion actions
    suggestionBanner.querySelector('.apply-suggestions').addEventListener('click', function() {
      metricIds.forEach(id => {
        document.getElementById(id).checked = true;
      });
      updateSelectedMetrics();
      suggestionBanner.remove();
    });
    
    suggestionBanner.querySelector('.dismiss-suggestions').addEventListener('click', function() {
      metricItems.forEach(item => item.classList.remove('suggested'));
      suggestionBanner.remove();
    });
  }
  
  function updateReviewSection() {
    // Update review section with current form data
    document.getElementById('reviewName').textContent = 
      document.getElementById('benchmarkName').value || '-';
    document.getElementById('reviewDescription').textContent = 
      document.getElementById('benchmarkDescription').value || '-';
    
    const datasetSelect = document.getElementById('datasetSelect');
    document.getElementById('reviewDataset').textContent = 
      datasetSelect.options[datasetSelect.selectedIndex]?.text || '-';
    
    const taskSelect = document.getElementById('taskSelect');
    document.getElementById('reviewTask').textContent = 
      taskSelect.options[taskSelect.selectedIndex]?.text || '-';
    
    // Update selected metrics
    const selectedMetrics = document.querySelectorAll('.metric-item input[type="checkbox"]:checked');
    const reviewMetrics = document.getElementById('reviewMetrics');
    
    if (selectedMetrics.length === 0) {
      reviewMetrics.innerHTML = '-';
    } else {
      const metricsHtml = Array.from(selectedMetrics).map(checkbox => {
        const metricItem = checkbox.closest('.metric-item');
        const metricName = metricItem.querySelector('.metric-name').textContent;
        return `<span class="review-metric-tag">${metricName}</span>`;
      }).join('');
      
      reviewMetrics.innerHTML = metricsHtml;
    }
  }
  
  function addStepValidation() {
    // Real-time validation for each input
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (this.value.trim()) {
          validateInput(this);
        }
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('invalid')) {
          validateInput(this);
        }
      });
    });
  }
  
  function validateInput(input) {
    const value = input.value.trim();
    
    switch (input.id) {
      case 'benchmarkName':
        if (!value) {
          markInvalid(input, 'Tên benchmark là bắt buộc');
        } else if (value.length < 3) {
          markInvalid(input, 'Tên benchmark phải có ít nhất 3 ký tự');
        } else {
          markValid(input);
        }
        break;
        
      case 'benchmarkDescription':
        if (!value) {
          markInvalid(input, 'Mô tả benchmark là bắt buộc');
        } else if (value.length < 20) {
          markInvalid(input, 'Mô tả phải có ít nhất 20 ký tự');
        } else {
          markValid(input);
        }
        break;
        
      case 'benchmarkPaper':
        if (value && !isValidUrl(value)) {
          markInvalid(input, 'Vui lòng nhập URL hợp lệ');
        } else {
          markValid(input);
        }
        break;
        
      case 'benchmarkCode':
        if (value && !isValidUrl(value)) {
          markInvalid(input, 'Vui lòng nhập URL hợp lệ');
        } else {
          markValid(input);
        }
        break;
        
      case 'benchmarkLeaderboard':
        if (value && !isValidUrl(value)) {
          markInvalid(input, 'Vui lòng nhập URL hợp lệ');
        } else {
          markValid(input);
        }
        break;
        
      default:
        if (input.hasAttribute('required') && !value) {
          markInvalid(input, 'Trường này là bắt buộc');
        } else {
          markValid(input);
        }
    }
  }
  
  function addAutoSave() {
    // Auto-save form data to localStorage
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('input', debounce(function() {
        saveFormData();
      }, 1000));
    });
    
    // Load saved data on page load
    loadFormData();
  }
  
  function saveFormData() {
    const formData = {
      benchmarkName: document.getElementById('benchmarkName').value,
      benchmarkDescription: document.getElementById('benchmarkDescription').value,
      datasetSelect: document.getElementById('datasetSelect').value,
      taskSelect: document.getElementById('taskSelect').value,
      selectedMetrics: Array.from(document.querySelectorAll('.metric-item input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id),
      benchmarkPaper: document.getElementById('benchmarkPaper').value,
      benchmarkCode: document.getElementById('benchmarkCode').value,
      benchmarkLeaderboard: document.getElementById('benchmarkLeaderboard').value,
      currentStep: currentStep,
      timestamp: Date.now()
    };
    
    localStorage.setItem('uploadBenchmarkForm', JSON.stringify(formData));
  }
  
  function loadFormData() {
    const savedData = localStorage.getItem('uploadBenchmarkForm');
    
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        
        // Only load if data is less than 24 hours old
        if (Date.now() - formData.timestamp < 24 * 60 * 60 * 1000) {
          document.getElementById('benchmarkName').value = formData.benchmarkName || '';
          document.getElementById('benchmarkDescription').value = formData.benchmarkDescription || '';
          document.getElementById('datasetSelect').value = formData.datasetSelect || '';
          document.getElementById('taskSelect').value = formData.taskSelect || '';
          document.getElementById('benchmarkPaper').value = formData.benchmarkPaper || '';
          document.getElementById('benchmarkCode').value = formData.benchmarkCode || '';
          document.getElementById('benchmarkLeaderboard').value = formData.benchmarkLeaderboard || '';
          
          // Restore selected metrics
          if (formData.selectedMetrics) {
            formData.selectedMetrics.forEach(metricId => {
              const checkbox = document.getElementById(metricId);
              if (checkbox) checkbox.checked = true;
            });
            updateSelectedMetrics();
          }
          
          // Restore current step
          if (formData.currentStep && formData.currentStep > 1) {
            goToStep(formData.currentStep);
          }
        }
      } catch (e) {
        console.warn('Failed to load saved form data:', e);
      }
    }
  }
  
  function addCharacterCounters() {
    const descriptionInput = document.getElementById('benchmarkDescription');
    addCharacterCounter(descriptionInput, 2000);
  }
  
  function addCharacterCounter(element, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    element.parentElement.appendChild(counter);
    
    function updateCounter() {
      const length = element.value.length;
      counter.textContent = `${length}/${maxLength} ký tự`;
      counter.style.color = length > maxLength * 0.9 ? '#ff5c5c' : '#666';
    }
    
    element.addEventListener('input', updateCounter);
    updateCounter();
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    // Show loading state
    const submitButton = document.getElementById('submitBtn');
    const originalContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    submitButton.disabled = true;
    
    // Collect all form data
    const formData = {
      name: document.getElementById('benchmarkName').value.trim(),
      description: document.getElementById('benchmarkDescription').value.trim(),
      dataset: document.getElementById('datasetSelect').value,
      task: document.getElementById('taskSelect').value,
      metrics: Array.from(document.querySelectorAll('.metric-item input[type="checkbox"]:checked'))
        .map(checkbox => ({
          id: checkbox.value,
          name: checkbox.closest('.metric-item').querySelector('.metric-name').textContent
        })),
      paperUrl: document.getElementById('benchmarkPaper').value.trim(),
      codeUrl: document.getElementById('benchmarkCode').value.trim(),
      leaderboardUrl: document.getElementById('benchmarkLeaderboard').value.trim(),
      timestamp: new Date().toISOString()
    };
    
    console.log('Submitting benchmark data:', formData);
    
    // Simulate submission
    setTimeout(() => {
      // Clear saved data
      localStorage.removeItem('uploadBenchmarkForm');
      
      // Show success message
      showSuccessMessage();
      
      // Reset form
      form.reset();
      goToStep(1);
      updateSelectedMetrics();
      
      // Restore button
      submitButton.innerHTML = originalContent;
      submitButton.disabled = false;
    }, 2000);
  }
  
  // Utility functions
  function markInvalid(element, message) {
    element.classList.add('invalid');
    element.classList.remove('valid');
    
    let errorElement = element.parentElement.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      element.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }
  
  function markValid(element) {
    element.classList.remove('invalid');
    element.classList.add('valid');
    
    const errorElement = element.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function showStepError(message, step) {
    const stepElement = document.getElementById(`step${step}`);
    let errorElement = stepElement.querySelector('.step-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'step-error';
      stepElement.insertBefore(errorElement, stepElement.firstChild);
    }
    
    errorElement.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>${message}</span>
    `;
  }
  
  function hideStepError(step) {
    const stepElement = document.getElementById(`step${step}`);
    const errorElement = stepElement.querySelector('.step-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <h3>Benchmark đã được tạo thành công!</h3>
        <p>Chúng tôi sẽ xem xét và xác thực thông tin trong vòng 24-48 giờ.</p>
      </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
  
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  function debounce(func, wait) {
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
});