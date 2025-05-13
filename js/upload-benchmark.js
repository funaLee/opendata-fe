/**
 * Enhanced Upload Benchmark Functionality - Fixed UI Issues
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
    if (nextBtn) nextBtn.addEventListener('click', nextStep);
    if (prevBtn) prevBtn.addEventListener('click', prevStep);
    
    // Add form submission handler
    if (form) form.addEventListener('submit', handleSubmit);
    
    // Add validation for each step
    addStepValidation();
    
    // Add auto-save functionality
    addAutoSave();
    
    // Ensure inputs start in normal state (no validation styling)
    clearInitialValidationStates();
    
    // Initialize "Khác..." functionality
    initializeOtherOptions();
  }
  
  function initializeOtherOptions() {
    // Dataset "Khác..." functionality
    const datasetSelect = document.getElementById('datasetSelect');
    const datasetOtherAction = document.getElementById('datasetOtherAction');
    const uploadNewDataset = document.getElementById('uploadNewDataset');
    const datasetModal = document.getElementById('datasetCreationModal');
    const confirmDatasetCreation = document.getElementById('confirmDatasetCreation');
    const cancelDatasetCreation = document.getElementById('cancelDatasetCreation');
    
    // Task "Khác..." functionality
    const taskSelect = document.getElementById('taskSelect');
    const taskOtherAction = document.getElementById('taskOtherAction');
    const uploadNewTask = document.getElementById('uploadNewTask');
    const taskModal = document.getElementById('taskCreationModal');
    const confirmTaskCreation = document.getElementById('confirmTaskCreation');
    const cancelTaskCreation = document.getElementById('cancelTaskCreation');
    
    // Dataset selection handling
    if (datasetSelect) {
      datasetSelect.addEventListener('change', function() {
        if (this.value === 'other_dataset') {
          datasetOtherAction.style.display = 'block';
          // Reset to empty value since "Khác..." is not a valid selection
          setTimeout(() => {
            this.value = '';
          }, 100);
        } else {
          datasetOtherAction.style.display = 'none';
        }
        validateInput(this);
      });
    }
    
    // Task selection handling
    if (taskSelect) {
      taskSelect.addEventListener('change', function() {
        if (this.value === 'other_task') {
          taskOtherAction.style.display = 'block';
          // Reset to empty value since "Khác..." is not a valid selection
          setTimeout(() => {
            this.value = '';
          }, 100);
        } else {
          taskOtherAction.style.display = 'none';
        }
        validateInput(this);
      });
    }
    
    // Dataset upload button
    if (uploadNewDataset) {
      uploadNewDataset.addEventListener('click', function() {
        datasetModal.style.display = 'flex';
      });
    }
    
    // Task creation button
    if (uploadNewTask) {
      uploadNewTask.addEventListener('click', function() {
        taskModal.style.display = 'flex';
      });
    }
    
    // Dataset modal actions
    if (confirmDatasetCreation) {
      confirmDatasetCreation.addEventListener('click', function() {
        // Save current form data
        saveFormData();
        
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang chuyến...';
        this.disabled = true;
        
        setTimeout(() => {
          // Navigate to dataset upload page
          window.location.href = '../upload/upload-dataset.html?return=benchmark';
        }, 500);
      });
    }
    
    if (cancelDatasetCreation) {
      cancelDatasetCreation.addEventListener('click', function() {
        datasetModal.style.display = 'none';
        datasetOtherAction.style.display = 'none';
      });
    }
    
    // Task modal actions
    if (confirmTaskCreation) {
      confirmTaskCreation.addEventListener('click', function() {
        const taskName = document.getElementById('newTaskName')?.value.trim();
        const taskDescription = document.getElementById('newTaskDescription')?.value.trim();
        
        if (!taskName) {
          alert('Vui lòng nhập tên task');
          return;
        }
        
        if (!taskDescription) {
          alert('Vui lòng nhập mô tả task');
          return;
        }
        
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tạo...';
        this.disabled = true;
        
        // Simulate task creation
        setTimeout(() => {
          // Add new task to select
          const newOption = document.createElement('option');
          newOption.value = `task_${taskName.toLowerCase().replace(/\s+/g, '_')}`;
          newOption.textContent = taskName;
          newOption.selected = true;
          
          // Insert before "Khác..." option
          const otherOption = taskSelect.querySelector('option[value="other_task"]');
          taskSelect.insertBefore(newOption, otherOption);
          
          // Close modal and hide other action
          taskModal.style.display = 'none';
          taskOtherAction.style.display = 'none';
          
          // Clear modal inputs
          document.getElementById('newTaskName').value = '';
          document.getElementById('newTaskDescription').value = '';
          
          // Restore button state
          this.innerHTML = '<i class="fas fa-check"></i> Tạo task';
          this.disabled = false;
          
          // Validate the new selection
          validateInput(taskSelect);
          
          // Show success message
          showToast('Task mới đã được tạo thành công!', 'success');
        }, 1000);
      });
    }
    
    if (cancelTaskCreation) {
      cancelTaskCreation.addEventListener('click', function() {
        taskModal.style.display = 'none';
        taskOtherAction.style.display = 'none';
        // Clear modal inputs
        document.getElementById('newTaskName').value = '';
        document.getElementById('newTaskDescription').value = '';
      });
    }
    
    // Close modals when clicking outside
    [datasetModal, taskModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === this) {
            this.style.display = 'none';
            if (this === datasetModal) {
              datasetOtherAction.style.display = 'none';
            } else {
              taskOtherAction.style.display = 'none';
            }
          }
        });
      }
    });
  }
  
  function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : '#2196F3'};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
  
  function clearInitialValidationStates() {
    // Remove any validation classes from inputs on page load
    const inputs = form?.querySelectorAll('input, textarea, select') || [];
    inputs.forEach(input => {
      input.classList.remove('valid', 'invalid');
    });
  }
  
  function initializeMetricsSelector() {
    // Metric search functionality
    const searchInput = document.getElementById('metricSearchInput');
    const categoryTabs = document.querySelectorAll('.metric-category-tab');
    const metricsGrid = document.getElementById('metricsGrid');
    const selectedMetricsList = document.getElementById('selectedMetricsList');
    const selectedCount = document.getElementById('selectedCount');
    const clearButton = document.getElementById('clearSelectedMetrics');
    
    if (!metricsGrid) return; // Exit if elements not found
    
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        filterMetrics(this.value);
      });
    }
    
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
    if (clearButton) {
      clearButton.addEventListener('click', function() {
        metricCheckboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
        updateSelectedMetrics();
        validateMetricsStep();
      });
    }
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
    
    if (selectedCount) {
      selectedCount.textContent = `(${checkedMetrics.length})`;
    }
    
    if (selectedMetricsContainer) {
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
            const checkbox = document.getElementById(metricId);
            if (checkbox) {
              checkbox.checked = false;
              updateSelectedMetrics();
              validateMetricsStep();
            }
          });
        });
      }
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
    // Hide current step with fade effect
    if (steps[currentStep - 1]) {
      steps[currentStep - 1].style.display = 'none';
    }
    
    // Show target step
    currentStep = step;
    if (steps[currentStep - 1]) {
      steps[currentStep - 1].style.display = 'block';
      // Trigger reflow for animation
      steps[currentStep - 1].offsetHeight;
    }
    
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
    if (prevBtn) {
      if (currentStep === 1) {
        prevBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'block';
      }
    }
    
    // Update next/submit button
    if (currentStep === totalSteps) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'block';
    } else {
      if (nextBtn) nextBtn.style.display = 'block';
      if (submitBtn) submitBtn.style.display = 'none';
    }
  }
  
  function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = `Bước ${currentStep} / ${totalSteps}`;
    if (progressPercentage) progressPercentage.textContent = Math.round(percentage) + '%';
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
    if (!name || !name.value.trim()) {
      if (name) markInvalid(name, 'Tên benchmark là bắt buộc');
      isValid = false;
    } else if (name.value.length < 3) {
      markInvalid(name, 'Tên benchmark phải có ít nhất 3 ký tự');
      isValid = false;
    } else {
      markValid(name);
    }
    
    // Validate description
    if (!description || !description.value.trim()) {
      if (description) markInvalid(description, 'Mô tả benchmark là bắt buộc');
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
    
    if (!dataset || !dataset.value || dataset.value === 'other_dataset') {
      if (dataset) markInvalid(dataset, 'Vui lòng chọn dataset hợp lệ');
      isValid = false;
    } else {
      markValid(dataset);
    }
    
    if (!task || !task.value || task.value === 'other_task') {
      if (task) markInvalid(task, 'Vui lòng chọn task hợp lệ');
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
      if (checkbox && metricIds.includes(checkbox.id)) {
        item.classList.add('suggested');
      } else {
        item.classList.remove('suggested');
      }
    });
    
    // Show suggestion banner
    const existingBanner = document.querySelector('.metric-suggestions');
    if (existingBanner) existingBanner.remove();
    
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
    if (metricsGrid) {
      metricsGrid.insertBefore(suggestionBanner, metricsGrid.firstChild);
      
      // Handle suggestion actions
      suggestionBanner.querySelector('.apply-suggestions').addEventListener('click', function() {
        metricIds.forEach(id => {
          const checkbox = document.getElementById(id);
          if (checkbox) checkbox.checked = true;
        });
        updateSelectedMetrics();
        suggestionBanner.remove();
      });
      
      suggestionBanner.querySelector('.dismiss-suggestions').addEventListener('click', function() {
        metricItems.forEach(item => item.classList.remove('suggested'));
        suggestionBanner.remove();
      });
    }
  }
  
  function updateReviewSection() {
    // Update review section with current form data
    const nameElement = document.getElementById('reviewName');
    const descElement = document.getElementById('reviewDescription');
    const datasetElement = document.getElementById('reviewDataset');
    const taskElement = document.getElementById('reviewTask');
    const metricsElement = document.getElementById('reviewMetrics');
    
    if (nameElement) {
      nameElement.textContent = document.getElementById('benchmarkName')?.value || '-';
    }
    
    if (descElement) {
      descElement.textContent = document.getElementById('benchmarkDescription')?.value || '-';
    }
    
    if (datasetElement) {
      const datasetSelect = document.getElementById('datasetSelect');
      datasetElement.textContent = datasetSelect?.options[datasetSelect.selectedIndex]?.text || '-';
    }
    
    if (taskElement) {
      const taskSelect = document.getElementById('taskSelect');
      taskElement.textContent = taskSelect?.options[taskSelect.selectedIndex]?.text || '-';
    }
    
    // Update selected metrics
    if (metricsElement) {
      const selectedMetrics = document.querySelectorAll('.metric-item input[type="checkbox"]:checked');
      
      if (selectedMetrics.length === 0) {
        metricsElement.innerHTML = '-';
      } else {
        const metricsHtml = Array.from(selectedMetrics).map(checkbox => {
          const metricItem = checkbox.closest('.metric-item');
          const metricName = metricItem?.querySelector('.metric-name')?.textContent || '';
          return `<span class="review-metric-tag">${metricName}</span>`;
        }).join('');
        
        metricsElement.innerHTML = metricsHtml;
      }
    }
  }
  
  function addStepValidation() {
    // Real-time validation for each input - only after interaction
    const inputs = form?.querySelectorAll('input, textarea, select') || [];
    
    inputs.forEach(input => {
      let hasInteracted = false;
      
      // Mark as interacted on first interaction
      const markInteracted = () => {
        hasInteracted = true;
      };
      
      input.addEventListener('focus', markInteracted, { once: true });
      input.addEventListener('input', markInteracted, { once: true });
      
      // Validate on blur if user has interacted
      input.addEventListener('blur', function() {
        if (hasInteracted && this.value.trim()) {
          validateInput(this);
        }
      });
      
      // Validate on input if field is currently invalid
      input.addEventListener('input', function() {
        if (hasInteracted && this.classList.contains('invalid')) {
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
        
      case 'datasetSelect':
        // Clear any previous validation
        clearValidation(input);
        // Don't validate if "other_dataset" is selected
        if (value && value !== 'other_dataset') {
          markValid(input);
        } else if (!value) {
          // Only mark invalid if user has tried to submit
          // This will be handled by validateDatasetTask()
        }
        break;
        
      case 'taskSelect':
        // Clear any previous validation
        clearValidation(input);
        // Don't validate if "other_task" is selected
        if (value && value !== 'other_task') {
          markValid(input);
        } else if (!value) {
          // Only mark invalid if user has tried to submit
          // This will be handled by validateDatasetTask()
        }
        break;
        
      case 'benchmarkPaper':
      case 'benchmarkCode':
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
    const inputs = form?.querySelectorAll('input, textarea, select') || [];
    
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
      benchmarkName: document.getElementById('benchmarkName')?.value || '',
      benchmarkDescription: document.getElementById('benchmarkDescription')?.value || '',
      datasetSelect: document.getElementById('datasetSelect')?.value || '',
      taskSelect: document.getElementById('taskSelect')?.value || '',
      selectedMetrics: Array.from(document.querySelectorAll('.metric-item input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id),
      benchmarkPaper: document.getElementById('benchmarkPaper')?.value || '',
      benchmarkCode: document.getElementById('benchmarkCode')?.value || '',
      benchmarkLeaderboard: document.getElementById('benchmarkLeaderboard')?.value || '',
      currentStep: currentStep,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('uploadBenchmarkForm', JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not save form data:', e);
    }
  }
  
  function loadFormData() {
    try {
      const savedData = localStorage.getItem('uploadBenchmarkForm');
      
      if (savedData) {
        const formData = JSON.parse(savedData);
        
        // Only load if data is less than 24 hours old
        if (Date.now() - formData.timestamp < 24 * 60 * 60 * 1000) {
          const nameInput = document.getElementById('benchmarkName');
          const descInput = document.getElementById('benchmarkDescription');
          const datasetSelect = document.getElementById('datasetSelect');
          const taskSelect = document.getElementById('taskSelect');
          const paperInput = document.getElementById('benchmarkPaper');
          const codeInput = document.getElementById('benchmarkCode');
          const leaderboardInput = document.getElementById('benchmarkLeaderboard');
          
          if (nameInput) nameInput.value = formData.benchmarkName || '';
          if (descInput) descInput.value = formData.benchmarkDescription || '';
          if (datasetSelect) datasetSelect.value = formData.datasetSelect || '';
          if (taskSelect) taskSelect.value = formData.taskSelect || '';
          if (paperInput) paperInput.value = formData.benchmarkPaper || '';
          if (codeInput) codeInput.value = formData.benchmarkCode || '';
          if (leaderboardInput) leaderboardInput.value = formData.benchmarkLeaderboard || '';
          
          // Restore selected metrics
          if (formData.selectedMetrics) {
            formData.selectedMetrics.forEach(metricId => {
              const checkbox = document.getElementById(metricId);
              if (checkbox) checkbox.checked = true;
            });
            updateSelectedMetrics();
          }
          
          // Restore current step - but don't validate restored fields
          if (formData.currentStep && formData.currentStep > 1) {
            goToStep(formData.currentStep);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load saved form data:', e);
    }
  }
  
  function addCharacterCounters() {
    const descriptionInput = document.getElementById('benchmarkDescription');
    if (descriptionInput) {
      addCharacterCounter(descriptionInput, 2000);
    }
  }
  
  function addCharacterCounter(element, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    element.parentElement.appendChild(counter);
    
    function updateCounter() {
      const length = element.value.length;
      counter.textContent = `${length}/${maxLength} ký tự`;
      
      // Add warning and danger classes based on usage
      counter.classList.remove('warning', 'danger');
      const percentage = (length / maxLength) * 100;
      
      if (percentage > 90) {
        counter.classList.add('danger');
      } else if (percentage > 75) {
        counter.classList.add('warning');
      }
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
    if (!submitButton) return;
    
    const originalContent = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    submitButton.disabled = true;
    
    // Collect all form data
    const formData = {
      name: document.getElementById('benchmarkName')?.value.trim() || '',
      description: document.getElementById('benchmarkDescription')?.value.trim() || '',
      dataset: document.getElementById('datasetSelect')?.value || '',
      task: document.getElementById('taskSelect')?.value || '',
      metrics: Array.from(document.querySelectorAll('.metric-item input[type="checkbox"]:checked'))
        .map(checkbox => ({
          id: checkbox.value,
          name: checkbox.closest('.metric-item')?.querySelector('.metric-name')?.textContent || ''
        })),
      paperUrl: document.getElementById('benchmarkPaper')?.value.trim() || '',
      codeUrl: document.getElementById('benchmarkCode')?.value.trim() || '',
      leaderboardUrl: document.getElementById('benchmarkLeaderboard')?.value.trim() || '',
      timestamp: new Date().toISOString()
    };
    
    console.log('Submitting benchmark data:', formData);
    
    // Simulate submission
    setTimeout(() => {
      // Clear saved data
      try {
        localStorage.removeItem('uploadBenchmarkForm');
      } catch (e) {
        console.warn('Could not remove saved data:', e);
      }
      
      // Show success message
      showSuccessMessage();
      
      // Reset form if possible
      if (form && form.reset) {
        form.reset();
      }
      goToStep(1);
      updateSelectedMetrics();
      clearInitialValidationStates();
      
      // Restore button
      submitButton.innerHTML = originalContent;
      submitButton.disabled = false;
    }, 2000);
  }
  
  // Utility functions
  function markInvalid(element, message) {
    if (!element) return;
    
    element.classList.add('invalid');
    element.classList.remove('valid');
    
    let errorElement = element.parentElement?.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      element.parentElement?.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }
  
  function markValid(element) {
    if (!element) return;
    
    element.classList.remove('invalid');
    element.classList.add('valid');
    
    const errorElement = element.parentElement?.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function showStepError(message, step) {
    const stepElement = document.getElementById(`step${step}`);
    if (!stepElement) return;
    
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
    const errorElement = stepElement?.querySelector('.step-error');
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
      if (successMessage.parentNode) {
        successMessage.remove();
      }
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