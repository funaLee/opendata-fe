/**
 * Enhanced Select with Thêm/Khác functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize after all components are loaded
  const initInterval = setInterval(() => {
    if (document.getElementById('uploadDatasetForm')) {
      clearInterval(initInterval);
      initializeEnhancedSelects();
    }
  }, 100);

  function initializeEnhancedSelects() {
    // Initialize enhanced single-selects
    initializeEnhancedSelect('licenseSelect', 'Chọn giấy phép, bản quyền');
    initializeEnhancedSelect('modalitySelect', 'Chọn 1 loại dữ liệu cho bộ dữ liệu');
    
    // Initialize multi-select for tags (from custom-select.js)
    initializeMultiSelect('tagsSelect', 'Chọn danh sách tag cho bộ dữ liệu');
  }

  function initializeEnhancedSelect(selectId, placeholderText) {
    const originalSelect = document.getElementById(selectId);
    if (!originalSelect) return;

    // Create the wrapper and components
    const wrapper = document.createElement('div');
    wrapper.className = 'enhanced-select-wrapper';
    
    // Create the trigger button
    const trigger = document.createElement('button');
    trigger.className = 'enhanced-select-trigger';
    trigger.type = 'button';
    
    // Create text span element for the trigger
    const triggerText = document.createElement('span');
    triggerText.className = 'trigger-text';
    triggerText.textContent = placeholderText;
    
    // Create arrow icon container for centering
    const arrowContainer = document.createElement('span');
    arrowContainer.className = 'select-arrow';
    
    const arrowIcon = document.createElement('i');
    arrowIcon.className = 'fas fa-chevron-down';
    
    // Assemble trigger button
    arrowContainer.appendChild(arrowIcon);
    trigger.appendChild(triggerText);
    trigger.appendChild(arrowContainer);
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'enhanced-select-dropdown';
    
    // Hide original select
    originalSelect.classList.add('hidden-select');
    
    // Add regular dropdown items from original options
    const regularOptions = Array.from(originalSelect.options)
      .filter(option => !option.disabled && option.value !== 'them' && option.value !== 'khac');
    
    // Limited number of options to show initially (excluding special options)
    const initialOptions = regularOptions.slice(0, 4);
    
    initialOptions.forEach(option => {
      const item = createDropdownItem(option.value, option.textContent);
      dropdown.appendChild(item);
      
      // Handle item click
      item.addEventListener('click', function(e) {
        selectOption(option.value, option.textContent);
        e.stopPropagation();
      });
    });
    
    // Add special "Thêm..." button
    const themItem = document.createElement('div');
    themItem.className = 'dropdown-special-item';
    themItem.textContent = 'Thêm...';
    dropdown.appendChild(themItem);
    
    // Add special "Khác..." button
    const khacItem = document.createElement('div');
    khacItem.className = 'dropdown-special-item';
    khacItem.textContent = 'Khác...';
    dropdown.appendChild(khacItem);
    
    // Function to create a dropdown item
    function createDropdownItem(value, text, isSelected = false) {
      const item = document.createElement('div');
      item.className = 'enhanced-dropdown-item' + (isSelected ? ' selected' : '');
      item.dataset.value = value;
      
      const itemText = document.createTextNode(text);
      item.appendChild(itemText);
      
      // Add checkmark for selected items
      if (isSelected) {
        const checkmark = document.createElement('i');
        checkmark.className = 'fas fa-check dropdown-checkmark';
        item.appendChild(checkmark);
      }
      
      return item;
    }
    
    // Function to select an option
    function selectOption(value, text) {
      // Update the original select
      Array.from(originalSelect.options).forEach(option => {
        option.selected = (option.value === value);
      });
      
      // Update trigger text
      triggerText.textContent = text;
      
      // Update dropdown items
      Array.from(dropdown.querySelectorAll('.enhanced-dropdown-item')).forEach(item => {
        const isSelected = item.dataset.value === value;
        item.classList.toggle('selected', isSelected);
        
        // Add or remove checkmark
        const existingCheckmark = item.querySelector('.dropdown-checkmark');
        if (isSelected && !existingCheckmark) {
          const checkmark = document.createElement('i');
          checkmark.className = 'fas fa-check dropdown-checkmark';
          item.appendChild(checkmark);
        } else if (!isSelected && existingCheckmark) {
          existingCheckmark.remove();
        }
      });
      
      // Close dropdown
      dropdown.classList.remove('active');
      
      // Dispatch change event
      const event = new Event('change', { bubbles: true });
      originalSelect.dispatchEvent(event);
    }
    
    // Function to create the "All Options" popup
    function showAllOptionsPopup() {
      // Create popup container
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      
      const popup = document.createElement('div');
      popup.className = 'select-popup';
      
      // Create header
      const popupHeader = document.createElement('div');
      popupHeader.className = 'popup-header';
      
      const popupTitle = document.createElement('h3');
      popupTitle.textContent = 'Tất cả lựa chọn';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'popup-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      popupHeader.appendChild(popupTitle);
      popupHeader.appendChild(closeButton);
      
      // Create content
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      
      // Add all options
      regularOptions.forEach(option => {
        const item = createDropdownItem(option.value, option.textContent, option.selected);
        popupContent.appendChild(item);
        
        item.addEventListener('click', function() {
          selectOption(option.value, option.textContent);
          document.body.removeChild(popupOverlay);
        });
      });
      
      // Assemble popup
      popup.appendChild(popupHeader);
      popup.appendChild(popupContent);
      popupOverlay.appendChild(popup);
      
      // Add to document
      document.body.appendChild(popupOverlay);
      
      // Close when clicking outside
      popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
          document.body.removeChild(popupOverlay);
        }
      });
    }
    
    // Function to create the "Custom Input" popup
    function showCustomInputPopup() {
      // Create popup container
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      
      const popup = document.createElement('div');
      popup.className = 'select-popup';
      
      // Create header
      const popupHeader = document.createElement('div');
      popupHeader.className = 'popup-header';
      
      const popupTitle = document.createElement('h3');
      popupTitle.textContent = `Thêm ${selectId === 'licenseSelect' ? 'bản quyền' : selectId === 'modalitySelect' ? 'loại dữ liệu' : 'tag'} mới`;
      
      const closeButton = document.createElement('button');
      closeButton.className = 'popup-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      popupHeader.appendChild(popupTitle);
      popupHeader.appendChild(closeButton);
      
      // Create content
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      
      // Create input field
      const inputGroup = document.createElement('div');
      inputGroup.className = 'popup-input-group';
      
      const inputLabel = document.createElement('label');
      inputLabel.textContent = `${selectId === 'licenseSelect' ? 'Bản quyền' : selectId === 'modalitySelect' ? 'Loại dữ liệu' : 'Tag'} mới:`;
      inputLabel.htmlFor = 'customInput';
      
      const inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.id = 'customInput';
      inputField.placeholder = 'Nhập giá trị mới...';
      
      inputGroup.appendChild(inputLabel);
      inputGroup.appendChild(inputField);
      
      // Create buttons
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'popup-button-group';
      
      const cancelButton = document.createElement('button');
      cancelButton.className = 'popup-button secondary';
      cancelButton.textContent = 'Huỷ';
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      const submitButton = document.createElement('button');
      submitButton.className = 'popup-button primary';
      submitButton.textContent = 'Thêm';
      submitButton.addEventListener('click', () => {
        const customValue = inputField.value.trim();
        if (customValue) {
          // Add new option to the original select
          const newOption = document.createElement('option');
          newOption.value = 'custom_' + customValue.toLowerCase().replace(/\s+/g, '_');
          newOption.textContent = customValue;
          originalSelect.appendChild(newOption);
          
          // Select the new option
          selectOption(newOption.value, newOption.textContent);
          
          // Close popup
          document.body.removeChild(popupOverlay);
        }
      });
      
      buttonGroup.appendChild(cancelButton);
      buttonGroup.appendChild(submitButton);
      
      // Assemble popup
      popupContent.appendChild(inputGroup);
      popupContent.appendChild(buttonGroup);
      popup.appendChild(popupHeader);
      popup.appendChild(popupContent);
      popupOverlay.appendChild(popup);
      
      // Add to document
      document.body.appendChild(popupOverlay);
      
      // Focus input field
      setTimeout(() => inputField.focus(), 100);
      
      // Close when clicking outside
      popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
          document.body.removeChild(popupOverlay);
        }
      });
    }
    
    // Handle "Thêm..." button click
    themItem.addEventListener('click', function(e) {
      showAllOptionsPopup();
      e.stopPropagation();
    });
    
    // Handle "Khác..." button click
    khacItem.addEventListener('click', function(e) {
      showCustomInputPopup();
      e.stopPropagation();
    });
    
    // Function to determine optimal dropdown position
    function positionDropdown() {
      // Reset any previous positioning classes
      dropdown.classList.remove('dropdown-up');
      
      // For tags select, always position it above
      if (selectId === 'tagsSelect') {
        dropdown.classList.add('dropdown-up');
        dropdown.style.bottom = `${trigger.offsetHeight + 5}px`;
        dropdown.style.top = 'auto';
        return;
      }
      dropdown.classList.remove('dropdown-up');
      
      // For license select, always position it above
      if (selectId === 'licenseSelect') {
        dropdown.classList.add('dropdown-up');
        dropdown.style.bottom = `${trigger.offsetHeight + 5}px`;
        dropdown.style.top = 'auto';
        return;
      }
      
      // For other selects, check available space
      const triggerRect = trigger.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      
      if (spaceBelow < dropdownHeight && triggerRect.top > dropdownHeight) {
        dropdown.classList.add('dropdown-up');
        dropdown.style.bottom = `${trigger.offsetHeight + 5}px`;
        dropdown.style.top = 'auto';
      } else {
        dropdown.style.top = `${trigger.offsetHeight + 5}px`;
        dropdown.style.bottom = 'auto';
      }
    }
    
    // Handle trigger click to show/hide dropdown
    trigger.addEventListener('click', function(e) {
      const isActive = dropdown.classList.contains('active');
      
      // Close other open dropdowns
      document.querySelectorAll('.enhanced-select-dropdown.active, .multiselect-dropdown.active').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });
      
      dropdown.classList.toggle('active');
      
      if (!isActive && dropdown.classList.contains('active')) {
        positionDropdown();
      }
      
      e.stopPropagation();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdown.classList.remove('active');
    });
    
    // Set up initial value if one is selected
    const selectedOption = originalSelect.options[originalSelect.selectedIndex];
    if (selectedOption && !selectedOption.disabled) {
      triggerText.textContent = selectedOption.textContent;
    }
    
    // Add components to DOM
    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdown);
    originalSelect.parentNode.insertBefore(wrapper, originalSelect);
    
    // Update dropdown items when original select changes
    originalSelect.addEventListener('change', function() {
      const selectedOption = originalSelect.options[originalSelect.selectedIndex];
      if (selectedOption && !selectedOption.disabled) {
        triggerText.textContent = selectedOption.textContent;
      }
    });
  }

  // Reuse the multiselect function from custom-select.js
  function initializeMultiSelect(selectId, placeholderText) {
    const originalSelect = document.getElementById(selectId);
    if (!originalSelect) return;

    // Create the custom multiselect wrapper and components
    const wrapper = document.createElement('div');
    wrapper.className = 'multiselect-wrapper';
    
    // Create trigger button
    const trigger = document.createElement('button');
    trigger.className = 'multiselect-trigger';
    trigger.type = 'button';
    
    // Create text span element for the trigger
    const triggerText = document.createElement('span');
    triggerText.className = 'trigger-text';
    triggerText.textContent = placeholderText;
    
    // Create arrow icon with proper container for centering
    const arrowContainer = document.createElement('span');
    arrowContainer.className = 'select-arrow';
    
    const arrowIcon = document.createElement('i');
    arrowIcon.className = 'fas fa-chevron-down';
    
    // Assemble trigger button
    arrowContainer.appendChild(arrowIcon);
    trigger.appendChild(triggerText);
    trigger.appendChild(arrowContainer);
    
    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'multiselect-dropdown';
    
    // Create container for selected tags
    const selectedTagsContainer = document.createElement('div');
    selectedTagsContainer.className = 'selected-tags';
    
    // Hide original select
    originalSelect.classList.add('hidden-select');
    
    // Add regular dropdown items from original options
    const regularOptions = Array.from(originalSelect.options)
      .filter(option => !option.disabled && option.value !== 'them' && option.value !== 'khac');
    
    // Limited number of options to show initially
    const initialOptions = regularOptions.slice(0, 6);
    
    initialOptions.forEach(option => {
      const item = document.createElement('div');
      item.className = 'multiselect-dropdown-item';
      item.dataset.value = option.value;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${selectId}_option_${option.value}`;
      checkbox.value = option.value;
      
      const label = document.createElement('label');
      label.htmlFor = checkbox.id;
      label.textContent = option.textContent;
      
      item.appendChild(checkbox);
      item.appendChild(label);
      dropdown.appendChild(item);
      
      // Handle item click
      item.addEventListener('click', function(e) {
        // Prevent clicks on checkbox from bubbling
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        
        // Update originalSelect based on checkbox state
        const optionIndex = Array.from(originalSelect.options).findIndex(opt => opt.value === option.value);
        if (optionIndex !== -1) {
          originalSelect.options[optionIndex].selected = checkbox.checked;
        }
        
        // Dispatch change event
        const event = new Event('change', { bubbles: true });
        originalSelect.dispatchEvent(event);
        
        // Update the UI
        updateSelectedTags();
        e.stopPropagation();
      });
    });
    
    // Add special "Thêm..." button
    const themItem = document.createElement('div');
    themItem.className = 'dropdown-special-item';
    themItem.textContent = 'Thêm...';
    dropdown.appendChild(themItem);
    
    // Add special "Khác..." button
    const khacItem = document.createElement('div');
    khacItem.className = 'dropdown-special-item';
    khacItem.textContent = 'Khác...';
    dropdown.appendChild(khacItem);
    
    // Function to update selected tags display
    function updateSelectedTags() {
      selectedTagsContainer.innerHTML = '';
      
      const selectedOptions = Array.from(originalSelect.selectedOptions);
      
      if (selectedOptions.length === 0) {
        const placeholder = document.createElement('span');
        placeholder.className = 'tag-placeholder';
        placeholder.textContent = 'No tags selected';
        selectedTagsContainer.appendChild(placeholder);
        
        // Update trigger text
        trigger.querySelector('.trigger-text').textContent = placeholderText;
      } else {
        // Update trigger text with count
        trigger.querySelector('.trigger-text').textContent = `${selectedOptions.length} tag selected`;
        
        selectedOptions.forEach(option => {
          const tag = document.createElement('div');
          tag.className = 'selected-tag';
          
          const tagText = document.createTextNode(option.textContent);
          tag.appendChild(tagText);
          
          const removeBtn = document.createElement('span');
          removeBtn.className = 'tag-remove';
          removeBtn.setAttribute('data-value', option.value);
          removeBtn.textContent = '×';
          tag.appendChild(removeBtn);
          
          selectedTagsContainer.appendChild(tag);
          
          // Handle remove tag
          removeBtn.addEventListener('click', function(e) {
            // Update original select
            option.selected = false;
            
            // Update checkbox in dropdown
            const checkbox = dropdown.querySelector(`input[value="${option.value}"]`);
            if (checkbox) checkbox.checked = false;
            
            // Dispatch change event
            const event = new Event('change', { bubbles: true });
            originalSelect.dispatchEvent(event);
            
            // Update UI
            updateSelectedTags();
            e.stopPropagation();
          });
        });
      }
    }
    
    // Function to show all options popup
    function showAllOptionsPopup() {
      // Create popup container
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      
      const popup = document.createElement('div');
      popup.className = 'select-popup';
      
      // Create header
      const popupHeader = document.createElement('div');
      popupHeader.className = 'popup-header';
      
      const popupTitle = document.createElement('h3');
      popupTitle.textContent = 'Tất cả tag';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'popup-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      popupHeader.appendChild(popupTitle);
      popupHeader.appendChild(closeButton);
      
      // Create content
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content tags-grid';
      
      // Add all options
      regularOptions.forEach(option => {
        const item = document.createElement('div');
        item.className = `tag-option ${option.selected ? 'selected' : ''}`;
        item.dataset.value = option.value;
        item.textContent = option.textContent;
        
        item.addEventListener('click', function() {
          // Toggle selection
          option.selected = !option.selected;
          item.classList.toggle('selected', option.selected);
          
          // Update checkbox in dropdown
          const checkbox = dropdown.querySelector(`input[value="${option.value}"]`);
          if (checkbox) checkbox.checked = option.selected;
          
          // Dispatch change event
          const event = new Event('change', { bubbles: true });
          originalSelect.dispatchEvent(event);
          
          // Update UI
          updateSelectedTags();
        });
        
        popupContent.appendChild(item);
      });
      
      // Add buttons
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'popup-button-group';
      
      const doneButton = document.createElement('button');
      doneButton.className = 'popup-button primary';
      doneButton.textContent = 'Hoàn thành';
      doneButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      buttonGroup.appendChild(doneButton);
      
      // Assemble popup
      popup.appendChild(popupHeader);
      popup.appendChild(popupContent);
      popup.appendChild(buttonGroup);
      popupOverlay.appendChild(popup);
      
      // Add to document
      document.body.appendChild(popupOverlay);
      
      // Close when clicking outside
      popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
          document.body.removeChild(popupOverlay);
        }
      });
    }
    
    // Function to create the "Custom Input" popup for tags
    function showCustomTagPopup() {
      // Create popup container
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      
      const popup = document.createElement('div');
      popup.className = 'select-popup';
      
      // Create header
      const popupHeader = document.createElement('div');
      popupHeader.className = 'popup-header';
      
      const popupTitle = document.createElement('h3');
      popupTitle.textContent = 'Thêm tag mới';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'popup-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      popupHeader.appendChild(popupTitle);
      popupHeader.appendChild(closeButton);
      
      // Create content
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      
      // Create input field
      const inputGroup = document.createElement('div');
      inputGroup.className = 'popup-input-group';
      
      const inputLabel = document.createElement('label');
      inputLabel.textContent = 'Tag mới:';
      inputLabel.htmlFor = 'customTagInput';
      
      const inputField = document.createElement('input');
      inputField.type = 'text';
      inputField.id = 'customTagInput';
      inputField.placeholder = 'Nhập tag mới...';
      
      inputGroup.appendChild(inputLabel);
      inputGroup.appendChild(inputField);
      
      // Create buttons
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'popup-button-group';
      
      const cancelButton = document.createElement('button');
      cancelButton.className = 'popup-button secondary';
      cancelButton.textContent = 'Huỷ';
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      const submitButton = document.createElement('button');
      submitButton.className = 'popup-button primary';
      submitButton.textContent = 'Thêm';
      submitButton.addEventListener('click', () => {
        const customValue = inputField.value.trim();
        if (customValue) {
          // Add new option to the original select
          const newOption = document.createElement('option');
          newOption.value = 'custom_' + customValue.toLowerCase().replace(/\s+/g, '_');
          newOption.textContent = customValue;
          newOption.selected = true;
          originalSelect.appendChild(newOption);
          
          // Dispatch change event
          const event = new Event('change', { bubbles: true });
          originalSelect.dispatchEvent(event);
          
          // Update UI
          updateSelectedTags();
          
          // Close popup
          document.body.removeChild(popupOverlay);
        }
      });
      
      buttonGroup.appendChild(cancelButton);
      buttonGroup.appendChild(submitButton);
      
      // Assemble popup
      popupContent.appendChild(inputGroup);
      popupContent.appendChild(buttonGroup);
      popup.appendChild(popupHeader);
      popup.appendChild(popupContent);
      popupOverlay.appendChild(popup);
      
      // Add to document
      document.body.appendChild(popupOverlay);
      
      // Focus input field
      setTimeout(() => inputField.focus(), 100);
      
      // Close when clicking outside
      popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
          document.body.removeChild(popupOverlay);
        }
      });
    }
    
    // Handle "Thêm..." button click
    themItem.addEventListener('click', function(e) {
      showAllOptionsPopup();
      e.stopPropagation();
    });
    
    // Handle "Khác..." button click
    khacItem.addEventListener('click', function(e) {
      showCustomTagPopup();
      e.stopPropagation();
    });

    // Function to determine optimal dropdown position
    function positionDropdown() {
      // Reset any previous positioning classes
      dropdown.classList.remove('dropdown-up');
      
      // Get dimensions and positions
      const triggerRect = trigger.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      
      // Check if there's enough space below
      if (spaceBelow < dropdownHeight && triggerRect.top > dropdownHeight) {
        // Not enough space below, but enough space above
        dropdown.classList.add('dropdown-up');
        dropdown.style.bottom = `${trigger.offsetHeight + 5}px`;
        dropdown.style.top = 'auto';
      } else {
        // Default position (below)
        dropdown.style.top = `${trigger.offsetHeight + 5}px`;
        dropdown.style.bottom = 'auto';
      }
    }
    
    // Handle trigger click to show/hide dropdown
    trigger.addEventListener('click', function(e) {
      const isActive = dropdown.classList.contains('active');
      
      // Close any other open dropdowns first
      document.querySelectorAll('.multiselect-dropdown.active, .enhanced-select-dropdown.active').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });
      
      // Toggle the dropdown
      dropdown.classList.toggle('active');
      
      // If opening, position it correctly
      if (!isActive && dropdown.classList.contains('active')) {
        positionDropdown();
      }
      
      e.stopPropagation();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdown.classList.remove('active');
    });
    
    // Add components to DOM
    wrapper.appendChild(trigger);
    wrapper.appendChild(selectedTagsContainer);
    wrapper.appendChild(dropdown);
    originalSelect.parentNode.insertBefore(wrapper, originalSelect);
    
    // Initialize selected tags
    updateSelectedTags();
    
    // Update dropdown items when original select changes
    originalSelect.addEventListener('change', function() {
      // Update checkboxes
      Array.from(originalSelect.options).forEach(option => {
        const checkbox = dropdown.querySelector(`input[value="${option.value}"]`);
        if (checkbox) checkbox.checked = option.selected;
      });
      
      // Update selected tags display
      updateSelectedTags();
    });
  }
});

// Function to create the "Custom Input" popup for tags
    function showCustomTagPopup() {
      // Create popup container
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      
      const popup = document.createElement('div');
      popup.className = 'entry-popup';
      
      // Create header
      const popupHeader = document.createElement('div');
      popupHeader.className = 'entry-popup-header';
      
      const popupTitle = document.createElement('h2');
      popupTitle.className = 'entry-popup-title';
      popupTitle.textContent = 'Nhập tag';
      
      const popupSubtitle = document.createElement('p');
      popupSubtitle.className = 'entry-popup-subtitle';
      popupSubtitle.textContent = 'Vui lòng cung cấp thông tin chính xác. Dữ liệu sẽ được kiểm tra trước khi phê duyệt.';
      
      popupHeader.appendChild(popupTitle);
      popupHeader.appendChild(popupSubtitle);
      
      // Create content
      const popupContent = document.createElement('div');
      popupContent.className = 'entry-popup-content';
      
      // Create tag name field
      const nameGroup = document.createElement('div');
      nameGroup.className = 'entry-form-group';
      
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = 'customTagName';
      nameLabel.innerHTML = 'Tên tag <span class="required">*</span>';
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'customTagName';
      nameInput.placeholder = 'Nhập tên tag';
      nameInput.required = true;
      
      nameGroup.appendChild(nameLabel);
      nameGroup.appendChild(nameInput);
      
      // Create description field
      const descGroup = document.createElement('div');
      descGroup.className = 'entry-form-group';
      
      const descLabel = document.createElement('label');
      descLabel.htmlFor = 'customTagDescription';
      descLabel.innerHTML = 'Mô tả <span class="required">*</span>';
      
      const descInput = document.createElement('textarea');
      descInput.id = 'customTagDescription';
      descInput.placeholder = 'Nhập mô tả cho tag';
      descInput.required = true;
      
      descGroup.appendChild(descLabel);
      descGroup.appendChild(descInput);
      
      // Add form groups to content
      popupContent.appendChild(nameGroup);
      popupContent.appendChild(descGroup);
      
      // Create action buttons
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'entry-popup-actions';
      
      const backButton = document.createElement('button');
      backButton.className = 'entry-popup-button back';
      backButton.innerHTML = '<i class="fas fa-chevron-left"></i> Quay lại';
      backButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      const submitButton = document.createElement('button');
      submitButton.className = 'entry-popup-button submit';
      submitButton.innerHTML = 'Hoàn tất <i class="fas fa-chevron-right"></i>';
      submitButton.addEventListener('click', () => {
        const customName = nameInput.value.trim();
        const customDesc = descInput.value.trim();
        
        if (customName && customDesc) {
          // Add new option to the original select
          const newOption = document.createElement('option');
          newOption.value = 'custom_' + customName.toLowerCase().replace(/\s+/g, '_');
          newOption.textContent = customName;
          newOption.selected = true;
          originalSelect.appendChild(newOption);
          
          // Dispatch change event
          const event = new Event('change', { bubbles: true });
          originalSelect.dispatchEvent(event);
          
          // Update UI
          updateSelectedTags();
          
          // Close popup
          document.body.removeChild(popupOverlay);
        } else {
          // Show validation messages (simplified)
          if (!customName) nameInput.style.borderColor = 'red';
          if (!customDesc) descInput.style.borderColor = 'red';
        }
      });
      
      actionsDiv.appendChild(backButton);
      actionsDiv.appendChild(submitButton);
      
      // Assemble popup
      popup.appendChild(popupHeader);
      popup.appendChild(popupContent);
      popup.appendChild(actionsDiv);
      popupOverlay.appendChild(popup);
      
      // Add to document
      document.body.appendChild(popupOverlay);
      
      // Focus input field
      setTimeout(() => nameInput.focus(), 100);
      
      // Close when clicking outside
      popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
          document.body.removeChild(popupOverlay);
        }
      });
    }

    // Function to create the "Custom Input" popup
    function showCustomInputPopup() {
      // Create popup container
      const popupOverlay = document.createElement('div');
      popupOverlay.className = 'popup-overlay';
      
      const popup = document.createElement('div');
      popup.className = 'entry-popup';
      
      // Create header
      const popupHeader = document.createElement('div');
      popupHeader.className = 'entry-popup-header';
      
      const popupTitle = document.createElement('h2');
      popupTitle.className = 'entry-popup-title';
      popupTitle.textContent = selectId === 'licenseSelect' ? 'Nhập bản quyền' : 'Nhập loại dữ liệu';
      
      const popupSubtitle = document.createElement('p');
      popupSubtitle.className = 'entry-popup-subtitle';
      popupSubtitle.textContent = 'Vui lòng cung cấp thông tin chính xác. Dữ liệu sẽ được kiểm tra trước khi phê duyệt.';
      
      popupHeader.appendChild(popupTitle);
      popupHeader.appendChild(popupSubtitle);
      
      // Create content
      const popupContent = document.createElement('div');
      popupContent.className = 'entry-popup-content';
      
      // Create name field
      const nameGroup = document.createElement('div');
      nameGroup.className = 'entry-form-group';
      
      const nameLabel = document.createElement('label');
      nameLabel.htmlFor = 'customName';
      nameLabel.innerHTML = (selectId === 'licenseSelect' ? 'Tên bản quyền' : 'Tên loại dữ liệu') + ' <span class="required">*</span>';
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'customName';
      nameInput.placeholder = selectId === 'licenseSelect' ? 'Nhập tên bản quyền' : 'Nhập tên loại dữ liệu';
      nameInput.required = true;
      
      nameGroup.appendChild(nameLabel);
      nameGroup.appendChild(nameInput);
      
      // Create description field
      const descGroup = document.createElement('div');
      descGroup.className = 'entry-form-group';
      
      const descLabel = document.createElement('label');
      descLabel.htmlFor = 'customDescription';
      descLabel.innerHTML = 'Mô tả <span class="required">*</span>';
      
      const descInput = document.createElement('textarea');
      descInput.id = 'customDescription';
      descInput.placeholder = selectId === 'licenseSelect' ? 'Nhập mô tả cho bản quyền' : 'Nhập mô tả cho loại dữ liệu';
      descInput.required = true;
      
      descGroup.appendChild(descLabel);
      descGroup.appendChild(descInput);
      
      // Add form groups to content
      popupContent.appendChild(nameGroup);
      popupContent.appendChild(descGroup);
      
      // Create action buttons
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'entry-popup-actions';
      
      const backButton = document.createElement('button');
      backButton.className = 'entry-popup-button back';
      backButton.innerHTML = '<i class="fas fa-chevron-left"></i> Quay lại';
      backButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
      });
      
      const submitButton = document.createElement('button');
      submitButton.className = 'entry-popup-button submit';
      submitButton.innerHTML = 'Hoàn tất <i class="fas fa-chevron-right"></i>';
      submitButton.addEventListener('click', () => {
        const customName = nameInput.value.trim();
        const customDesc = descInput.value.trim();
        
        if (customName && customDesc) {
          // Add new option to the original select
          const newOption = document.createElement('option');
          newOption.value = 'custom_' + customName.toLowerCase().replace(/\s+/g, '_');
          newOption.textContent = customName;
          originalSelect.appendChild(newOption);
          
          // Select the new option
          selectOption(newOption.value, newOption.textContent);
          
          // Close popup
          document.body.removeChild(popupOverlay);
        } else {
          // Show validation messages (simplified)
          if (!customName) nameInput.style.borderColor = 'red';
          if (!customDesc) descInput.style.borderColor = 'red';
        }
      });
      
      actionsDiv.appendChild(backButton);
      actionsDiv.appendChild(submitButton);
      
      // Assemble popup
      popup.appendChild(popupHeader);
      popup.appendChild(popupContent);
      popup.appendChild(actionsDiv);
      popupOverlay.appendChild(popup);
      
      // Add to document
      document.body.appendChild(popupOverlay);
      
      // Focus input field
      setTimeout(() => nameInput.focus(), 100);
      
      // Close when clicking outside
      popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
          document.body.removeChild(popupOverlay);
        }
      });
    }