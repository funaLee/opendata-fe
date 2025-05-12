/**
 * Upload Tag Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('uploadTagForm');
  const tagNameInput = document.getElementById('tagName');
  const tagDescriptionInput = document.getElementById('tagDescription');
  const backButton = document.getElementById('backButton');
  const submitButton = document.querySelector('.submit-button');

  // Enhanced back button - always goes to upload-dataset.html
  backButton.addEventListener('click', function() {
    // Check if form has been modified
    const hasChanges = tagNameInput.value.trim() || tagDescriptionInput.value.trim();
    
    if (hasChanges) {
      // Show confirmation dialog if there are unsaved changes
      const confirmLeave = confirm('Bạn có chắc muốn rời khỏi trang này? Dữ liệu chưa lưu sẽ bị mất.');
      if (!confirmLeave) {
        return;
      }
    }
    
    // Always return to upload-dataset.html
    window.location.href = '../upload/upload-dataset.html';
  });

  // Store form data when navigating away (for preservation)
  window.addEventListener('beforeunload', function() {
    // Save current form state
    const formState = {
      tagName: tagNameInput.value,
      tagDescription: tagDescriptionInput.value,
      timestamp: Date.now()
    };
    sessionStorage.setItem('uploadTagFormState', JSON.stringify(formState));
  });

  // Real-time validation with improved UX
  tagNameInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  tagDescriptionInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      backButton.click();
    }
    // Ctrl/Cmd + Enter to submit
    else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!submitButton.disabled) {
        form.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Form submission with enhanced feedback
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Collect form data
    const formData = {
      name: tagNameInput.value.trim(),
      description: tagDescriptionInput.value.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Disable form elements during submission
    setFormDisabled(true);
    
    // Enhanced loading state
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Đang xử lý...</span>';
    
    // Simulate form submission with realistic timing
    setTimeout(() => {
      // Clear form state from session storage
      sessionStorage.removeItem('uploadTagFormState');
      
      // Store the new tag data for the dataset form
      const savedDatasetForm = sessionStorage.getItem('uploadDatasetFormData');
      if (savedDatasetForm) {
        const datasetData = JSON.parse(savedDatasetForm);
        // Add the new tag to the dataset form's tags
        if (!datasetData.tags) {
          datasetData.tags = [];
        }
        datasetData.tags.push(formData.name);
        sessionStorage.setItem('uploadDatasetFormData', JSON.stringify(datasetData));
      }
      
      // Show success message
      showSubmissionMessage(true, 'Tag đã được gửi thành công! Đang chuyển về trang dataset...');
      
      // Reset form
      form.reset();
      clearAllValidation();
      
      // Re-enable form
      setFormDisabled(false);
      submitButton.innerHTML = originalText;
      
      // Store success state and redirect
      sessionStorage.setItem('tagSubmissionSuccess', JSON.stringify({
        tagName: formData.name,
        timestamp: Date.now()
      }));
      
      // Auto-redirect after a delay
      setTimeout(() => {
        window.location.href = '../upload/upload-dataset.html';
      }, 1500);
    }, 1500);
  });

  // Enhanced validation with more specific rules
  function validateForm() {
    let isValid = true;
    
    // Validate tag name
    const tagName = tagNameInput.value.trim();
    if (!tagName) {
      markInvalid(tagNameInput, 'Tên tag là bắt buộc');
      isValid = false;
    } else if (tagName.length < 2) {
      markInvalid(tagNameInput, 'Tên tag phải có ít nhất 2 ký tự');
      isValid = false;
    } else if (tagName.length > 50) {
      markInvalid(tagNameInput, 'Tên tag không được quá 50 ký tự');
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(tagName)) {
      markInvalid(tagNameInput, 'Tên tag chỉ được chứa chữ cái, số và dấu cách');
      isValid = false;
    } else {
      markValid(tagNameInput);
    }
    
    // Validate description
    const description = tagDescriptionInput.value.trim();
    if (!description) {
      markInvalid(tagDescriptionInput, 'Mô tả là bắt buộc');
      isValid = false;
    } else if (description.length < 10) {
      markInvalid(tagDescriptionInput, 'Mô tả phải có ít nhất 10 ký tự');
      isValid = false;
    } else if (description.length > 500) {
      markInvalid(tagDescriptionInput, 'Mô tả không được quá 500 ký tự');
      isValid = false;
    } else {
      markValid(tagDescriptionInput);
    }
    
    return isValid;
  }

  function validateField(field) {
    if (field === tagNameInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else if (value.length < 2) {
        markInvalid(field, 'Tên tag phải có ít nhất 2 ký tự');
      } else if (value.length > 50) {
        markInvalid(field, 'Tên tag không được quá 50 ký tự');
      } else if (!/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(value)) {
        markInvalid(field, 'Tên tag chỉ được chứa chữ cái, số và dấu cách');
      } else {
        markValid(field);
      }
    } else if (field === tagDescriptionInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else if (value.length < 10) {
        markInvalid(field, 'Mô tả phải có ít nhất 10 ký tự');
      } else if (value.length > 500) {
        markInvalid(field, 'Mô tả không được quá 500 ký tự');
      } else {
        markValid(field);
      }
    }
  }
  
  function markInvalid(element, message) {
    element.classList.add('invalid');
    element.classList.remove('valid');
    
    // Show error message
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
    
    // Remove error message
    const errorElement = element.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function clearValidation(element) {
    element.classList.remove('invalid', 'valid');
    
    // Remove error message
    const errorElement = element.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function clearAllValidation() {
    clearValidation(tagNameInput);
    clearValidation(tagDescriptionInput);
  }

  function updateButtonStates() {
    const hasContent = tagNameInput.value.trim() || tagDescriptionInput.value.trim();
    const isValid = validateForm();
    
    // Update submit button state
    submitButton.disabled = !isValid;
    
    // Add visual feedback
    if (hasContent && !isValid) {
      submitButton.style.opacity = '0.7';
    } else {
      submitButton.style.opacity = '1';
    }
  }

  function setFormDisabled(disabled) {
    tagNameInput.disabled = disabled;
    tagDescriptionInput.disabled = disabled;
    backButton.disabled = disabled;
    submitButton.disabled = disabled;
    
    // Visual feedback
    form.style.opacity = disabled ? '0.7' : '1';
    form.style.pointerEvents = disabled ? 'none' : 'auto';
  }
  
  function showSubmissionMessage(isSuccess, message) {
    // Remove any existing message
    const existingMessage = document.querySelector('.submission-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = 'submission-message ' + (isSuccess ? 'success' : 'error');
    messageElement.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'close-message';
    closeButton.addEventListener('click', function() {
      messageElement.remove();
    });
    messageElement.appendChild(closeButton);
    
    // Add to page
    document.querySelector('.upload-tag-container').insertBefore(messageElement, form);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (messageElement.parentElement) {
        messageElement.remove();
      }
    }, 5000);
  }

  // Add character counter for description
  function addCharacterCounter() {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    tagDescriptionInput.parentElement.appendChild(counter);
    
    function updateCounter() {
      const length = tagDescriptionInput.value.length;
      counter.textContent = `${length}/500 ký tự`;
      counter.style.color = length > 450 ? '#ff5c5c' : '#666';
    }
    
    tagDescriptionInput.addEventListener('input', updateCounter);
    updateCounter();
  }
  
  addCharacterCounter();
});

// Global function to handle navigation from enhanced-select
window.openUploadTagPage = function() {
  // Store the current dataset form data before navigating
  const form = document.getElementById('uploadDatasetForm');
  if (form) {
    const formData = {
      datasetName: document.getElementById('datasetName')?.value || '',
      datasetLink: document.getElementById('datasetLink')?.value || '',
      datasetDescription: document.getElementById('datasetDescription')?.value || '',
      datasetSize: document.getElementById('datasetSize')?.value || '',
      sampleCount: document.getElementById('sampleCount')?.value || '',
      licenseSelect: document.getElementById('licenseSelect')?.value || '',
      modalitySelect: document.getElementById('modalitySelect')?.value || '',
      tags: Array.from(document.getElementById('tagsSelect')?.selectedOptions || []).map(option => option.value),
      timestamp: Date.now()
    };
    sessionStorage.setItem('uploadDatasetFormData', JSON.stringify(formData));
  }
  
  window.location.href = '../upload/upload-tag.html';
};