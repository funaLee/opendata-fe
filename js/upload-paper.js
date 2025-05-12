/**
 * Upload Paper Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('uploadPaperForm');
  const paperTitleInput = document.getElementById('paperTitle');
  const paperAuthorsInput = document.getElementById('paperAuthors');
  const paperAbstractInput = document.getElementById('paperAbstract');
  const paperUrlInput = document.getElementById('paperUrl');
  const paperDoiInput = document.getElementById('paperDoi');
  const publicationSelect = document.getElementById('publicationSelect');
  const areaSelect = document.getElementById('areaSelect');
  const publicationYearInput = document.getElementById('publicationYear');
  const paperKeywordsInput = document.getElementById('paperKeywords');
  const backButton = document.getElementById('backButton');
  const submitButton = document.querySelector('.submit-button');

  // Enhanced back button functionality
  backButton.addEventListener('click', function() {
    // Check if form has been modified
    const hasChanges = paperTitleInput.value.trim() || 
                      paperAuthorsInput.value.trim() || 
                      paperAbstractInput.value.trim() ||
                      paperUrlInput.value.trim() ||
                      paperDoiInput.value.trim() ||
                      publicationSelect.value ||
                      areaSelect.value ||
                      publicationYearInput.value ||
                      paperKeywordsInput.value.trim();
    
    if (hasChanges) {
      // Show confirmation dialog if there are unsaved changes
      const confirmLeave = confirm('Bạn có chắc muốn rời khỏi trang này? Dữ liệu chưa lưu sẽ bị mất.');
      if (!confirmLeave) {
        return;
      }
    }
    
    // Check if we came from dataset upload form
    const returnTo = sessionStorage.getItem('uploadPaperReturnTo');
    if (returnTo) {
      sessionStorage.removeItem('uploadPaperReturnTo');
      window.location.href = returnTo;
    } else {
      // Default behavior - go to papers page
      window.location.href = '../pages/paper.html';
    }
  });

  // Store form data when navigating away (for preservation)
  window.addEventListener('beforeunload', function() {
    // Save current form state
    const formState = {
      paperTitle: paperTitleInput.value,
      paperAuthors: Array.from(paperAuthorsInput.selectedOptions).map(option => option.value),
      paperAbstract: paperAbstractInput.value,
      paperUrl: paperUrlInput.value,
      paperDoi: paperDoiInput.value,
      publicationSelect: publicationSelect.value,
      areaSelect: areaSelect.value,
      publicationYear: publicationYearInput.value,
      paperKeywords: paperKeywordsInput.value,
      timestamp: Date.now()
    };
    sessionStorage.setItem('uploadPaperFormState', JSON.stringify(formState));
  });

  // Restore form state if returning from navigation
  function restoreFormState() {
    const savedState = sessionStorage.getItem('uploadPaperFormState');
    if (savedState) {
      try {
        const formState = JSON.parse(savedState);
        // Only restore if the state is relatively fresh (less than 1 hour old)
        if (Date.now() - formState.timestamp < 3600000) {
          paperTitleInput.value = formState.paperTitle || '';
          
          // Restore selected authors
          if (formState.paperAuthors && Array.isArray(formState.paperAuthors)) {
            Array.from(paperAuthorsInput.options).forEach(option => {
              option.selected = formState.paperAuthors.includes(option.value);
            });
          }
          
          paperAbstractInput.value = formState.paperAbstract || '';
          paperUrlInput.value = formState.paperUrl || '';
          paperDoiInput.value = formState.paperDoi || '';
          publicationSelect.value = formState.publicationSelect || '';
          areaSelect.value = formState.areaSelect || '';
          publicationYearInput.value = formState.publicationYear || '';
          paperKeywordsInput.value = formState.paperKeywords || '';
        }
      } catch (e) {
        console.warn('Failed to restore form state:', e);
      }
    }
  }

  // Restore form state on page load
  restoreFormState();

  // Real-time validation with improved UX
  paperTitleInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  paperAuthorsInput.addEventListener('change', function() {
    validateField(this);
    updateButtonStates();
  });

  paperAbstractInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  paperUrlInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  paperDoiInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  publicationSelect.addEventListener('change', function() {
    validateField(this);
    updateButtonStates();
  });

  areaSelect.addEventListener('change', function() {
    validateField(this);
    updateButtonStates();
  });

  publicationYearInput.addEventListener('input', function() {
    validateField(this);
    updateButtonStates();
  });

  paperKeywordsInput.addEventListener('input', function() {
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
      title: paperTitleInput.value.trim(),
      authors: Array.from(paperAuthorsInput.selectedOptions)
        .filter(option => !option.disabled)
        .map(option => ({
          id: option.value,
          name: option.textContent
        })),
      abstract: paperAbstractInput.value.trim(),
      url: paperUrlInput.value.trim(),
      doi: paperDoiInput.value.trim(),
      publication: publicationSelect.value,
      area: areaSelect.value,
      year: parseInt(publicationYearInput.value),
      keywords: paperKeywordsInput.value.trim() ? 
                paperKeywordsInput.value.trim().split(',').map(keyword => keyword.trim()) : [],
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
      // Clear form state from session storage
      sessionStorage.removeItem('uploadPaperFormState');
      
      // Show success message
      showSubmissionMessage(true, 'Bài báo đã được gửi thành công!');
      
      // Reset form
      form.reset();
      clearAllValidation();
      
      // Re-enable form
      setFormDisabled(false);
      submitButton.innerHTML = originalText;
      updateButtonStates();
      
      // Check if we should return to dataset upload
      const returnTo = sessionStorage.getItem('uploadPaperReturnTo');
      if (returnTo) {
        // Store the created paper info for dataset form
        sessionStorage.setItem('newlyCreatedPaper', JSON.stringify({
          id: 'p_' + Date.now(), // Generate temporary ID
          title: formData.title,
          authors: formData.authors.map(author => author.name).join(', '),
          year: formData.year,
          timestamp: Date.now()
        }));
        
        // Auto-redirect after a delay
        setTimeout(() => {
          sessionStorage.removeItem('uploadPaperReturnTo');
          window.location.href = returnTo;
        }, 1500);
      }
    }, 1500);
  });

  // Enhanced validation with more specific rules
  function validateForm() {
    let isValid = true;
    
    // Validate paper title
    const title = paperTitleInput.value.trim();
    if (!title) {
      markInvalid(paperTitleInput, 'Tiêu đề bài báo là bắt buộc');
      isValid = false;
    } else if (title.length < 10) {
      markInvalid(paperTitleInput, 'Tiêu đề phải có ít nhất 10 ký tự');
      isValid = false;
    } else if (title.length > 200) {
      markInvalid(paperTitleInput, 'Tiêu đề không được quá 200 ký tự');
      isValid = false;
    } else {
      markValid(paperTitleInput);
    }
    
    // Validate authors (multi-select)
    const selectedAuthors = Array.from(paperAuthorsInput.selectedOptions).filter(option => !option.disabled);
    if (selectedAuthors.length === 0) {
      markInvalid(paperAuthorsInput, 'Vui lòng chọn ít nhất một tác giả');
      isValid = false;
    } else {
      markValid(paperAuthorsInput);
    }
    
    // Validate abstract
    const abstract = paperAbstractInput.value.trim();
    if (!abstract) {
      markInvalid(paperAbstractInput, 'Tóm tắt là bắt buộc');
      isValid = false;
    } else if (abstract.length < 50) {
      markInvalid(paperAbstractInput, 'Tóm tắt phải có ít nhất 50 ký tự');
      isValid = false;
    } else if (abstract.length > 3000) {
      markInvalid(paperAbstractInput, 'Tóm tắt không được quá 3000 ký tự');
      isValid = false;
    } else {
      markValid(paperAbstractInput);
    }
    
    // Validate URL
    const url = paperUrlInput.value.trim();
    if (!url) {
      markInvalid(paperUrlInput, 'Link bài báo là bắt buộc');
      isValid = false;
    } else if (!isValidUrl(url)) {
      markInvalid(paperUrlInput, 'Vui lòng nhập một URL hợp lệ');
      isValid = false;
    } else {
      markValid(paperUrlInput);
    }
    
    // Validate DOI (optional but must be valid if provided)
    const doi = paperDoiInput.value.trim();
    if (doi && !isValidDoi(doi)) {
      markInvalid(paperDoiInput, 'DOI không hợp lệ. Ví dụ: 10.1000/xyz123');
      isValid = false;
    } else if (doi) {
      markValid(paperDoiInput);
    } else {
      clearValidation(paperDoiInput);
    }
    
    // Validate publication
    if (!publicationSelect.value) {
      markInvalid(publicationSelect, 'Vui lòng chọn nơi xuất bản');
      isValid = false;
    } else {
      markValid(publicationSelect);
    }
    
    // Validate research area
    if (!areaSelect.value) {
      markInvalid(areaSelect, 'Vui lòng chọn lĩnh vực nghiên cứu');
      isValid = false;
    } else {
      markValid(areaSelect);
    }
    
    // Validate publication year
    const year = parseInt(publicationYearInput.value);
    const currentYear = new Date().getFullYear();
    if (!publicationYearInput.value || isNaN(year)) {
      markInvalid(publicationYearInput, 'Năm xuất bản là bắt buộc');
      isValid = false;
    } else if (year < 1990 || year > currentYear + 1) {
      markInvalid(publicationYearInput, `Năm phải từ 1990 đến ${currentYear + 1}`);
      isValid = false;
    } else {
      markValid(publicationYearInput);
    }
    
    // Keywords validation (optional but validate format if provided)
    const keywords = paperKeywordsInput.value.trim();
    if (keywords) {
      const keywordList = keywords.split(',').map(k => k.trim());
      if (keywordList.some(keyword => keyword.length < 2)) {
        markInvalid(paperKeywordsInput, 'Mỗi từ khóa phải có ít nhất 2 ký tự');
        isValid = false;
      } else {
        markValid(paperKeywordsInput);
      }
    } else {
      clearValidation(paperKeywordsInput);
    }
    
    return isValid;
  }

  function validateField(field) {
    if (field === paperTitleInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else if (value.length < 10) {
        markInvalid(field, 'Tiêu đề phải có ít nhất 10 ký tự');
      } else if (value.length > 200) {
        markInvalid(field, 'Tiêu đề không được quá 200 ký tự');
      } else {
        markValid(field);
      }
    } else if (field === paperAuthorsInput) {
      const selectedAuthors = Array.from(field.selectedOptions).filter(option => !option.disabled);
      if (selectedAuthors.length === 0) {
        clearValidation(field);
      } else {
        markValid(field);
      }
    } else if (field === paperAbstractInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else if (value.length < 50) {
        markInvalid(field, 'Tóm tắt phải có ít nhất 50 ký tự');
      } else if (value.length > 3000) {
        markInvalid(field, 'Tóm tắt không được quá 3000 ký tự');
      } else {
        markValid(field);
      }
    } else if (field === paperUrlInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else if (!isValidUrl(value)) {
        markInvalid(field, 'Vui lòng nhập một URL hợp lệ');
      } else {
        markValid(field);
      }
    } else if (field === paperDoiInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else if (!isValidDoi(value)) {
        markInvalid(field, 'DOI không hợp lệ. Ví dụ: 10.1000/xyz123');
      } else {
        markValid(field);
      }
    } else if (field === publicationYearInput) {
      const year = parseInt(field.value);
      const currentYear = new Date().getFullYear();
      if (!field.value || isNaN(year)) {
        clearValidation(field);
      } else if (year < 1990 || year > currentYear + 1) {
        markInvalid(field, `Năm phải từ 1990 đến ${currentYear + 1}`);
      } else {
        markValid(field);
      }
    } else if (field === paperKeywordsInput) {
      const value = field.value.trim();
      if (!value) {
        clearValidation(field);
      } else {
        const keywordList = value.split(',').map(k => k.trim());
        if (keywordList.some(keyword => keyword.length < 2)) {
          markInvalid(field, 'Mỗi từ khóa phải có ít nhất 2 ký tự');
        } else {
          markValid(field);
        }
      }
    } else if ([publicationSelect, areaSelect].includes(field)) {
      if (field.value) {
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
    [paperTitleInput, paperAuthorsInput, paperAbstractInput, paperUrlInput, 
     paperDoiInput, publicationSelect, areaSelect, publicationYearInput, 
     paperKeywordsInput].forEach(field => {
      if (field) clearValidation(field);
    });
  }

  function updateButtonStates() {
    const hasContent = paperTitleInput.value.trim() || 
                      paperAuthorsInput.selectedOptions.length > 0 || 
                      paperAbstractInput.value.trim();
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
    [paperTitleInput, paperAuthorsInput, paperAbstractInput, paperUrlInput, 
     paperDoiInput, publicationSelect, areaSelect, publicationYearInput, 
     paperKeywordsInput].forEach(field => {
      if (field) field.disabled = disabled;
    });
    
    backButton.disabled = disabled;
    submitButton.disabled = disabled;
    
    // Visual feedback
    form.style.opacity = disabled ? '0.7' : '1';
    form.style.pointerEvents = disabled ? 'none' : 'auto';
  }
  
  function isValidUrl(url) {
    try {
      new URL(url);
      return /^https?:\/\/.+\..+/.test(url);
    } catch (e) {
      return false;
    }
  }
  
  function isValidDoi(doi) {
    // Basic DOI validation pattern
    const doiPattern = /^10\.\d{4,}\/[^\s]+$/;
    return doiPattern.test(doi);
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

  // Add character counters
  addCharacterCounter(paperTitleInput, 200);
  addCharacterCounter(paperAbstractInput, 3000);

  // Initial validation state
  updateButtonStates();
});

// Global function to handle navigation from dataset upload form
window.openUploadPaperPage = function(returnUrl) {
  // Store where to return after paper upload
  sessionStorage.setItem('uploadPaperReturnTo', returnUrl || '../upload/upload-dataset.html');
  window.location.href = '../upload/upload-paper.html';
};