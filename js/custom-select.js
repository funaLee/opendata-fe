/**
 * Custom Select and Multi-select Components
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize after all components are loaded
  const initInterval = setInterval(() => {
    if (document.getElementById('uploadDatasetForm')) {
      clearInterval(initInterval);
      initializeCustomSelects();
    }
  }, 100);

  function initializeCustomSelects() {
    // Initialize multi-select for tags
    initializeMultiSelect('tagsSelect', 'Chọn danh sách tag cho bộ dữ liệu');
  }

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
    
    // Add dropdown items from original options
    Array.from(originalSelect.options).forEach(option => {
      if (option.disabled) return; // Skip disabled options
      
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
        // Prevent clicks on checkbox from bubbling (they're handled separately)
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
      document.querySelectorAll('.multiselect-dropdown.active').forEach(d => {
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
    
    // Handle window resize to reposition dropdown if open
    window.addEventListener('resize', function() {
      if (dropdown.classList.contains('active')) {
        positionDropdown();
      }
    });
    
    // Handle scrolling to reposition dropdown if open
    document.addEventListener('scroll', function() {
      if (dropdown.classList.contains('active')) {
        positionDropdown();
      }
    }, true); // Use capture phase to catch all scroll events
    
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