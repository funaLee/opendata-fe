/**
 * Enhanced dropdown component with tag selection functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all dropdowns
  initDropdowns();
  
  // Handle tag dropdowns specifically
  initTagDropdowns();
});

/**
 * Initialize general dropdown functionality
 */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    const container = toggle.closest('.dropdown-container');
    const menu = container.querySelector('.dropdown-menu');
    
    // Toggle dropdown on click
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Toggle active state
      const isActive = toggle.classList.contains('active');
      
      // Close all other dropdowns first
      closeAllDropdowns();
      
      if (!isActive) {
        // Open this dropdown
        toggle.classList.add('active');
        menu.classList.add('show');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-container')) {
      closeAllDropdowns();
    }
  });
}

/**
 * Close all open dropdowns
 */
function closeAllDropdowns() {
  const activeToggles = document.querySelectorAll('.dropdown-toggle.active');
  const openMenus = document.querySelectorAll('.dropdown-menu.show');
  
  activeToggles.forEach(toggle => toggle.classList.remove('active'));
  openMenus.forEach(menu => menu.classList.remove('show'));
}

/**
 * Initialize tag selection dropdown functionality
 */
function initTagDropdowns() {
  const tagDropdowns = document.querySelectorAll('.tag-dropdown');
  
  tagDropdowns.forEach(dropdown => {
    const container = dropdown.closest('.dropdown-container');
    const toggle = container.querySelector('.dropdown-toggle');
    const items = container.querySelectorAll('.dropdown-item');
    const checkboxes = container.querySelectorAll('.dropdown-item-checkbox');
    const moreButton = container.querySelector('.dropdown-more');
    const selectedTagsContainer = container.querySelector('.selected-tags');
    
    // Handle checkbox changes
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateSelectedTags(container);
      });
    });
    
    // Handle "More..." button if present
    if (moreButton) {
      moreButton.addEventListener('click', function() {
        // Implement logic to add custom tag or show more tags
        showTagForm(container);
      });
    }
    
    // Initialize selected tags display
    updateSelectedTags(container);
    
    // Handle search if present
    const searchInput = container.querySelector('.dropdown-search input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        filterTagItems(container, this.value);
      });
    }
  });
}

/**
 * Update the display of selected tags
 */
function updateSelectedTags(container) {
  const selectedTagsContainer = container.querySelector('.selected-tags');
  const checkboxes = container.querySelectorAll('.dropdown-item-checkbox:checked');
  const toggle = container.querySelector('.dropdown-toggle span');
  
  // If we have a container for displaying selected tags
  if (selectedTagsContainer) {
    selectedTagsContainer.innerHTML = '';
    
    if (checkboxes.length > 0) {
      checkboxes.forEach(checkbox => {
        const tagName = checkbox.nextElementSibling.textContent.trim();
        const tagElement = createTagElement(tagName, checkbox);
        selectedTagsContainer.appendChild(tagElement);
      });
    } else {
      selectedTagsContainer.innerHTML = '<span class="no-tags">No tags selected</span>';
    }
  }
  
  // Update the dropdown toggle text
  if (toggle) {
    if (checkboxes.length > 0) {
      toggle.textContent = `${checkboxes.length} tag${checkboxes.length > 1 ? 's' : ''} selected`;
    } else {
      toggle.textContent = 'Chọn danh sách tag cho bộ dữ liệu';
    }
  }
}

/**
 * Create a visual tag element for selected tags
 */
function createTagElement(tagName, checkbox) {
  const tag = document.createElement('div');
  tag.className = 'selected-tag';
  tag.innerHTML = `
    <span>${tagName}</span>
    <button type="button" class="remove-tag">×</button>
  `;
  
  tag.querySelector('.remove-tag').addEventListener('click', function() {
    checkbox.checked = false;
    updateSelectedTags(checkbox.closest('.dropdown-container'));
  });
  
  return tag;
}

/**
 * Filter tag items based on search input
 */
function filterTagItems(container, searchText) {
  const items = container.querySelectorAll('.dropdown-item');
  const searchLower = searchText.toLowerCase();
  
  items.forEach(item => {
    const tagName = item.querySelector('.dropdown-item-label').textContent.toLowerCase();
    if (tagName.includes(searchLower)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Show/hide "no results" message
  let noResults = container.querySelector('.no-results-message');
  const hasVisibleItems = Array.from(items).some(item => item.style.display !== 'none');
  
  if (!hasVisibleItems && searchText) {
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results-message';
      noResults.textContent = 'No matching tags found';
      container.querySelector('.dropdown-menu').appendChild(noResults);
    }
  } else if (noResults) {
    noResults.remove();
  }
}

/**
 * Show a form to add custom tags
 */
function showTagForm(container) {
  // Implement logic to show a form for adding custom tags
  // This is a placeholder - you would implement the actual custom tag addition logic
  
  let tagForm = container.querySelector('.custom-tag-form');
  
  if (!tagForm) {
    tagForm = document.createElement('div');
    tagForm.className = 'custom-tag-form';
    tagForm.innerHTML = `
      <div class="custom-tag-input">
        <input type="text" placeholder="Enter a new tag name">
        <button type="button" class="add-tag-btn">Add</button>
      </div>
    `;
    
    container.querySelector('.dropdown-menu').appendChild(tagForm);
    
    // Add event listener for adding custom tag
    tagForm.querySelector('.add-tag-btn').addEventListener('click', function() {
      const input = tagForm.querySelector('input');
      const tagName = input.value.trim();
      
      if (tagName) {
        addCustomTag(container, tagName);
        input.value = '';
      }
    });
  } else {
    tagForm.style.display = tagForm.style.display === 'none' ? 'block' : 'none';
  }
}

/**
 * Add a custom tag to the dropdown
 */
function addCustomTag(container, tagName) {
  const dropdownMenu = container.querySelector('.dropdown-menu');
  const items = dropdownMenu.querySelectorAll('.dropdown-item');
  
  // Check if tag already exists
  for (const item of items) {
    const label = item.querySelector('.dropdown-item-label');
    if (label.textContent.trim().toLowerCase() === tagName.toLowerCase()) {
      // Tag exists, just check it
      const checkbox = item.querySelector('.dropdown-item-checkbox');
      checkbox.checked = true;
      updateSelectedTags(container);
      return;
    }
  }
  
  // Create new tag item
  const newItem = document.createElement('div');
  newItem.className = 'dropdown-item';
  newItem.innerHTML = `
    <input type="checkbox" class="dropdown-item-checkbox" checked>
    <span class="dropdown-item-label">${tagName}</span>
  `;
  
  // Find where to insert the new item (before the "More..." button)
  const moreButton = container.querySelector('.dropdown-more');
  if (moreButton) {
    dropdownMenu.insertBefore(newItem, moreButton);
  } else {
    dropdownMenu.appendChild(newItem);
  }
  
  // Add event listener to the new checkbox
  const newCheckbox = newItem.querySelector('.dropdown-item-checkbox');
  newCheckbox.addEventListener('change', function() {
    updateSelectedTags(container);
  });
  
  // Update selected tags display
  updateSelectedTags(container);
}