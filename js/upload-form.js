/**
 * Upload Dataset Form Functionality - Enhanced with Paper Field
 */
document.addEventListener('DOMContentLoaded', function() {
  // Wait for all components to load
  const formCheckInterval = setInterval(() => {
    const form = document.getElementById('uploadDatasetForm');
    if (form) {
      clearInterval(formCheckInterval);
      initUploadForm();
    }
  }, 100);

  function initUploadForm() {
    const form = document.getElementById('uploadDatasetForm');
    const tagsSelect = document.getElementById('tagsSelect');
    const licenseSelect = document.getElementById('licenseSelect');
    const modalitySelect = document.getElementById('modalitySelect');
    const paperSelect = document.getElementById('paperSelect');
    const uploadPaperBtn = document.getElementById('uploadPaperBtn');
    const sizeInput = document.getElementById('datasetSize');
    const submitButton = document.querySelector('.submit-button');
    
    // Get all form inputs for validation
    const nameInput = document.getElementById('datasetName');
    const linkInput = document.getElementById('datasetLink');
    const descriptionInput = document.getElementById('datasetDescription');
    const sampleCountInput = document.getElementById('sampleCount');

    // Add character counter for description
    addCharacterCounter(descriptionInput, 500);

    // Paper selection handling
    if (paperSelect) {
      paperSelect.addEventListener('change', function() {
        if (this.value === 'upload_new') {
          // Save current form data before navigating
          saveFormData();
          // Navigate to upload paper page
          window.location.href = '../upload/upload-paper.html';
        } else {
          validateField(this);
          updateButtonStates();
        }
      });
    }

    // Upload paper button handling
    if (uploadPaperBtn) {
      uploadPaperBtn.addEventListener('click', function() {
        // Save current form data before navigating
        saveFormData();
        // Navigate to upload paper page
        window.location.href = '../upload/upload-paper.html';
      });
    }

    // Real-time validation
    nameInput.addEventListener('input', function() {
      validateField(this);
      updateButtonStates();
    });

    linkInput.addEventListener('input', function() {
      validateField(this);
      updateButtonStates();
    });

    descriptionInput.addEventListener('input', function() {
      validateField(this);
      updateButtonStates();
    });

    sampleCountInput.addEventListener('input', function() {
      validateField(this);
      updateButtonStates();
    });

    // Ensure size input accepts only numbers and decimal point
    if (sizeInput) {
      sizeInput.addEventListener('input', function() {
        // Allow only numbers and one decimal point
        this.value = this.value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = this.value.split('.');
        if (parts.length > 2) {
          this.value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        validateField(this);
        updateButtonStates();
      });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!submitButton.disabled) {
          form.dispatchEvent(new Event('submit'));
        }
      }
    });

    // Monitor select changes
    if (licenseSelect) {
      licenseSelect.addEventListener('change', function() {
        validateField(this);
        updateButtonStates();
      });
    }

    if (modalitySelect) {
      modalitySelect.addEventListener('change', function() {
        validateField(this);
        updateButtonStates();
      });
    }

    if (tagsSelect) {
      tagsSelect.addEventListener('change', function() {
        validateField(this);
        updateButtonStates();
      });
    }

    // Form submission with enhanced feedback
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
          return;
        }
        
        // Collect form data
        const formData = {
          name: nameInput.value.trim(),
          link: linkInput.value.trim(),
          description: descriptionInput.value.trim(),
          size: sizeInput.value + ' GB',
          sampleCount: parseInt(sampleCountInput.value),
          license: licenseSelect.value,
          tags: Array.from(tagsSelect.selectedOptions).map(option => option.value),
          modality: modalitySelect.value,
          paper: paperSelect.value,
          timestamp: new Date().toISOString()
        };
        
        console.log('Form submission data:', formData);
        
        // Disable form elements during submission
        setFormDisabled(true);
        
        // Enhanced loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Đang xử lý...</span>';
        
        // Simulate form submission with realistic timing
        setTimeout(() => {
          // Clear saved form data on successful submission
          sessionStorage.removeItem('uploadDatasetFormData');
          
          // Show success message
          showSubmissionMessage(true, 'Dataset information has been submitted successfully!');
          
          // Reset form
          form.reset();
          clearAllValidation();
          
          // Re-enable form
          setFormDisabled(false);
          submitButton.innerHTML = originalText;
          updateButtonStates();
        }, 1500);
      });
    }

    // Load saved form data if returning from paper upload
    loadFormData();

    // Function to save form data
    function saveFormData() {
      const formData = {
        datasetName: nameInput.value,
        datasetLink: linkInput.value,
        datasetDescription: descriptionInput.value,
        datasetSize: sizeInput.value,
        sampleCount: sampleCountInput.value,
        license: licenseSelect.value,
        tags: Array.from(tagsSelect.selectedOptions).map(option => option.value),
        modality: modalitySelect.value,
        timestamp: Date.now()
      };
      sessionStorage.setItem('uploadDatasetFormData', JSON.stringify(formData));
    }

    // Function to load saved form data
    function loadFormData() {
      const savedData = sessionStorage.getItem('uploadDatasetFormData');
      if (savedData) {
        try {
          const formData = JSON.parse(savedData);
          
          // Only load data if it's less than 1 hour old
          if (Date.now() - formData.timestamp < 3600000) {
            nameInput.value = formData.datasetName || '';
            linkInput.value = formData.datasetLink || '';
            descriptionInput.value = formData.datasetDescription || '';
            sizeInput.value = formData.datasetSize || '';
            sampleCountInput.value = formData.sampleCount || '';
            licenseSelect.value = formData.license || '';
            modalitySelect.value = formData.modality || '';
            
            // Restore tags selection
            if (formData.tags && formData.tags.length > 0) {
              Array.from(tagsSelect.options).forEach(option => {
                option.selected = formData.tags.includes(option.value);
              });
            }
            
            // Validate restored fields
            [nameInput, linkInput, descriptionInput, sizeInput, sampleCountInput].forEach(field => {
              if (field.value) validateField(field);
            });
            
            updateButtonStates();
          }
        } catch (e) {
          console.error('Error loading saved form data:', e);
        }
      }
    }

    // Enhanced validation with more specific rules
    function validateForm() {
      let isValid = true;

      if (!paperSelect.value) {
        markInvalid(paperSelect, 'Vui lòng chọn bài báo liên quan');
        isValid = false;
      } else {
        markValid(paperSelect);
      }
      
      // Validate dataset name
      const name = nameInput.value.trim();
      if (!name) {
        markInvalid(nameInput, 'Tên bộ dữ liệu là bắt buộc');
        isValid = false;
      } else if (name.length < 3) {
        markInvalid(nameInput, 'Tên bộ dữ liệu phải có ít nhất 3 ký tự');
        isValid = false;
      } else if (name.length > 100) {
        markInvalid(nameInput, 'Tên bộ dữ liệu không được quá 100 ký tự');
        isValid = false;
      } else {
        markValid(nameInput);
      }
      
      // Validate link
      const link = linkInput.value.trim();
      if (!link) {
        markInvalid(linkInput, 'Liên kết là bắt buộc');
        isValid = false;
      } else if (!isValidUrl(link)) {
        markInvalid(linkInput, 'Vui lòng nhập một URL hợp lệ');
        isValid = false;
      } else {
        markValid(linkInput);
      }
      
      // Validate description
      const description = descriptionInput.value.trim();
      if (!description) {
        markInvalid(descriptionInput, 'Mô tả là bắt buộc');
        isValid = false;
      } else if (description.length < 20) {
        markInvalid(descriptionInput, 'Mô tả phải có ít nhất 20 ký tự');
        isValid = false;
      } else if (description.length > 500) {
        markInvalid(descriptionInput, 'Mô tả không được quá 500 ký tự');
        isValid = false;
      } else {
        markValid(descriptionInput);
      }
      
      // Validate size
      const size = parseFloat(sizeInput.value);
      if (!sizeInput.value || isNaN(size)) {
        markInvalid(sizeInput, 'Vui lòng nhập kích thước');
        isValid = false;
      } else if (size <= 0) {
        markInvalid(sizeInput, 'Kích thước phải lớn hơn 0');
        isValid = false;
      } else if (size > 1000000) {
        markInvalid(sizeInput, 'Kích thước quá lớn (tối đa 1,000,000 GB)');
        isValid = false;
      } else {
        markValid(sizeInput);
      }
      
      // Validate sample count
      const sampleCount = parseInt(sampleCountInput.value);
      if (!sampleCountInput.value || isNaN(sampleCount) || sampleCount < 1) {
        markInvalid(sampleCountInput, 'Số lượng mẫu phải là số nguyên dương');
        isValid = false;
      } else if (sampleCount > 1000000000) {
        markInvalid(sampleCountInput, 'Số lượng mẫu quá lớn');
        isValid = false;
      } else {
        markValid(sampleCountInput);
      }
      
      // Validate paper selection
      if (!paperSelect.value || paperSelect.value === 'upload_new') {
        markInvalid(paperSelect, 'Vui lòng chọn bài báo công bố dataset');
        isValid = false;
      } else {
        markValid(paperSelect);
      }
      
      // Validate license
      if (!licenseSelect.value) {
        markInvalid(licenseSelect, 'Vui lòng chọn giấy phép');
        isValid = false;
      } else {
        markValid(licenseSelect);
      }
      
      // Validate tags
      if (tagsSelect.selectedOptions.length === 0 || 
          (tagsSelect.selectedOptions.length === 1 && tagsSelect.selectedOptions[0].disabled)) {
        markInvalid(tagsSelect, 'Vui lòng chọn ít nhất một tag');
        // Also mark the custom multiselect as invalid
        const multiSelectWrapper = document.querySelector('.multiselect-wrapper');
        if (multiSelectWrapper) {
          const trigger = multiSelectWrapper.querySelector('.multiselect-trigger');
          if (trigger) {
            trigger.classList.add('invalid');
            trigger.classList.remove('valid');
          }
        }
        isValid = false;
      } else {
        markValid(tagsSelect);
        // Also mark the custom multiselect as valid
        const multiSelectWrapper = document.querySelector('.multiselect-wrapper');
        if (multiSelectWrapper) {
          const trigger = multiSelectWrapper.querySelector('.multiselect-trigger');
          if (trigger) {
            trigger.classList.remove('invalid');
            trigger.classList.add('valid');
          }
        }
      }
      
      // Validate modality
      if (!modalitySelect.value) {
        markInvalid(modalitySelect, 'Vui lòng chọn loại dữ liệu');
        isValid = false;
      } else {
        markValid(modalitySelect);
      }
      
      return isValid;
    }

    function validateField(field) {
      if (field === nameInput) {
        const value = field.value.trim();
        if (!value) {
          clearValidation(field);
        } else if (value.length < 3) {
          markInvalid(field, 'Tên bộ dữ liệu phải có ít nhất 3 ký tự');
        } else if (value.length > 100) {
          markInvalid(field, 'Tên bộ dữ liệu không được quá 100 ký tự');
        } else {
          markValid(field);
        }
      } else if (field === linkInput) {
        const value = field.value.trim();
        if (!value) {
          clearValidation(field);
        } else if (!isValidUrl(value)) {
          markInvalid(field, 'Vui lòng nhập một URL hợp lệ');
        } else {
          markValid(field);
        }
      } else if (field === descriptionInput) {
        const value = field.value.trim();
        if (!value) {
          clearValidation(field);
        } else if (value.length < 20) {
          markInvalid(field, 'Mô tả phải có ít nhất 20 ký tự');
        } else if (value.length > 500) {
          markInvalid(field, 'Mô tả không được quá 500 ký tự');
        } else {
          markValid(field);
        }
      } else if (field === sizeInput) {
        const value = parseFloat(field.value);
        if (!field.value || isNaN(value)) {
          clearValidation(field);
        } else if (value <= 0) {
          markInvalid(field, 'Kích thước phải lớn hơn 0');
        } else if (value > 1000000) {
          markInvalid(field, 'Kích thước quá lớn (tối đa 1,000,000 GB)');
        } else {
          markValid(field);
        }
      } else if (field === sampleCountInput) {
        const value = parseInt(field.value);
        if (!field.value || isNaN(value)) {
          clearValidation(field);
        } else if (value < 1) {
          markInvalid(field, 'Số lượng mẫu phải là số nguyên dương');
        } else if (value > 1000000000) {
          markInvalid(field, 'Số lượng mẫu quá lớn');
        } else {
          markValid(field);
        }
      } else if ([licenseSelect, modalitySelect, tagsSelect, paperSelect].includes(field)) {
        if (field === paperSelect && field.value === 'upload_new') {
          // Don't validate if "upload new" is selected
          return;
        }
        if (field.value || (field === tagsSelect && field.selectedOptions.length > 0)) {
          markValid(field);
        } else {
          clearValidation(field);
        }
      }
    }
    
    function markInvalid(element, message) {
      element.classList.add('invalid');
      element.classList.remove('valid');
      
      // Add has-error class to form group
      const formGroup = element.closest('.form-group');
      if (formGroup) {
        formGroup.classList.add('has-error');
        formGroup.classList.remove('has-success');
      }
      
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
      
      // Add has-success class to form group
      const formGroup = element.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('has-error');
        formGroup.classList.add('has-success');
      }
      
      // Remove error message
      const errorElement = element.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }
    
    function clearValidation(element) {
      element.classList.remove('invalid', 'valid');
      
      // Remove classes from form group
      const formGroup = element.closest('.form-group');
      if (formGroup) {
        formGroup.classList.remove('has-error', 'has-success');
      }
      
      // Remove error message
      const errorElement = element.parentElement.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }

    function clearAllValidation() {
      [nameInput, linkInput, descriptionInput, sizeInput, sampleCountInput, licenseSelect, modalitySelect, tagsSelect, paperSelect].forEach(field => {
        if (field) clearValidation(field);
      });
    }

    function updateButtonStates() {
      const hasContent = nameInput.value.trim() || linkInput.value.trim() || descriptionInput.value.trim();
      const hasValidInput = !document.querySelector('.form-group .invalid');
      
      // Update submit button state based on validation
      submitButton.disabled = !hasValidInput;
      
      // Add visual feedback
      if (hasContent && !hasValidInput) {
        submitButton.style.opacity = '0.7';
      } else {
        submitButton.style.opacity = '1';
      }
    }

    function setFormDisabled(disabled) {
      [nameInput, linkInput, descriptionInput, sizeInput, sampleCountInput, licenseSelect, modalitySelect, tagsSelect, paperSelect].forEach(field => {
        if (field) field.disabled = disabled;
      });
      submitButton.disabled = disabled;
      
      // Visual feedback
      form.style.opacity = disabled ? '0.7' : '1';
      form.style.pointerEvents = disabled ? 'none' : 'auto';
    }
    
    function isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
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
      form.parentElement.insertBefore(messageElement, form);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (messageElement.parentElement) {
          messageElement.remove();
        }
      }, 5000);
      
      // Reset form if success
      if (isSuccess) {
        form.reset();
        clearAllValidation();
        updateButtonStates();
      }
    }

    // Character counter function
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

    // Initial validation state
    updateButtonStates();
  }
});

document.getElementById('addPaperBtn').addEventListener('click', function() {
  // Store current form data
  const formData = gatherFormData();
  sessionStorage.setItem('uploadDatasetFormData', JSON.stringify(formData));
  
  // Navigate to upload paper page
  window.openUploadPaperPage('../upload/upload-dataset.html');
});