/**
 * Upload Dataset Form Functionality
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
    const sizeInput = document.getElementById('datasetSize');

    // Add selected item display for multiple select
    if (tagsSelect) {
      tagsSelect.addEventListener('change', function() {
        const selectedOptions = Array.from(this.selectedOptions)
          .map(option => option.value)
          .filter(value => value !== '');
        
        console.log('Selected tags:', selectedOptions);
      });
    }

    // Ensure size input accepts only numbers and decimal point
    if (sizeInput) {
      sizeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = this.value.split('.');
        if (parts.length > 2) {
          this.value = parts[0] + '.' + parts.slice(1).join('');
        }
      });
    }

    // Form submission
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
          return;
        }
        
        // Collect form data
        const formData = {
          name: document.getElementById('datasetName').value,
          link: document.getElementById('datasetLink').value,
          description: document.getElementById('datasetDescription').value,
          size: document.getElementById('datasetSize').value + ' GB',
          sampleCount: document.getElementById('sampleCount').value,
          license: licenseSelect.value,
          tags: Array.from(tagsSelect.selectedOptions).map(option => option.value),
          modality: modalitySelect.value
        };
        
        console.log('Form submission data:', formData);
        
        // Show success message
        showSubmissionMessage(true, 'Dataset information has been submitted successfully!');
        
        // In a real application, you would send this data to your server
        // fetch('/api/datasets', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // })
        // .then(response => response.json())
        // .then(data => {
        //   showSubmissionMessage(true, 'Dataset information has been submitted successfully!');
        // })
        // .catch((error) => {
        //   showSubmissionMessage(false, 'There was an error submitting the dataset. Please try again.');
        // });
      });
    }

    // Form validation
    function validateForm() {
      let isValid = true;
      
      // Check if name is entered
      const nameInput = document.getElementById('datasetName');
      if (!nameInput.value.trim()) {
        markInvalid(nameInput, 'Dataset name is required');
        isValid = false;
      } else {
        markValid(nameInput);
      }
      
      // Check if link is valid URL
      const linkInput = document.getElementById('datasetLink');
      if (!linkInput.value.trim() || !isValidUrl(linkInput.value)) {
        markInvalid(linkInput, 'Please enter a valid URL');
        isValid = false;
      } else {
        markValid(linkInput);
      }
      
      // Check if description is entered
      const descInput = document.getElementById('datasetDescription');
      if (!descInput.value.trim()) {
        markInvalid(descInput, 'Description is required');
        isValid = false;
      } else {
        markValid(descInput);
      }
      
      // Check if size is entered and is a number
      if (!sizeInput.value || isNaN(parseFloat(sizeInput.value))) {
        markInvalid(sizeInput, 'Please enter a valid size number');
        isValid = false;
      } else {
        markValid(sizeInput);
      }
      
      // Check if sample count is entered and is a number
      const sampleInput = document.getElementById('sampleCount');
      if (!sampleInput.value || isNaN(parseInt(sampleInput.value)) || parseInt(sampleInput.value) < 1) {
        markInvalid(sampleInput, 'Please enter a valid sample count (at least 1)');
        isValid = false;
      } else {
        markValid(sampleInput);
      }
      
      // Check if license is selected
      if (!licenseSelect.value) {
        markInvalid(licenseSelect, 'Please select a license');
        isValid = false;
      } else {
        markValid(licenseSelect);
      }
      
      // Check if at least one tag is selected
      if (tagsSelect.selectedOptions.length === 0 || 
          (tagsSelect.selectedOptions.length === 1 && tagsSelect.selectedOptions[0].disabled)) {
        markInvalid(tagsSelect, 'Please select at least one tag');
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
      
      // Check if modality is selected
      if (!modalitySelect.value) {
        markInvalid(modalitySelect, 'Please select a data modality');
        isValid = false;
      } else {
        markValid(modalitySelect);
      }
      
      return isValid;
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
      }
    }
  }
});