/**
 * Enhanced header dropdown functionality
 */
/**
 * Enhanced header dropdown functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all dropdown containers
  const dropdownContainers = document.querySelectorAll('.dropdown-container');
  
  // Add event listeners for better hover behavior
  dropdownContainers.forEach(container => {
    const menu = container.querySelector('.dropdown-menu');
    const toggle = container.querySelector('.dropdown-toggle');
    
    if (!menu || !toggle) return; // Skip if elements not found
    
    // Variables to track mouse state
    let isOverToggle = false;
    let isOverMenu = false;
    let timeoutId = null;
    
    // Toggle button hover events
    toggle.addEventListener('mouseenter', () => {
      isOverToggle = true;
      clearTimeout(timeoutId);
      
      // Add active class to toggle button
      toggle.classList.add('active');
      
      // Show dropdown
      menu.style.display = 'block';
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateY(0)';
    });
    
    toggle.addEventListener('mouseleave', () => {
      isOverToggle = false;
      
      // Only hide dropdown after a short delay
      // This gives time to move mouse to the dropdown menu
      timeoutId = setTimeout(() => {
        if (!isOverMenu) {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateY(10px)';
          menu.style.display = 'none';
          toggle.classList.remove('active');
        }
      }, 150);
    });
    
    // Dropdown menu hover events
    menu.addEventListener('mouseenter', () => {
      isOverMenu = true;
      clearTimeout(timeoutId);
    });
    
    menu.addEventListener('mouseleave', () => {
      isOverMenu = false;
      
      // Hide dropdown after a short delay
      timeoutId = setTimeout(() => {
        if (!isOverToggle) {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateY(10px)';
          menu.style.display = 'none';
          toggle.classList.remove('active');
        }
      }, 150);
    });

    // Also add click event for mobile and accessibility
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Toggle dropdown visibility
      if (menu.style.display === 'block') {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateY(10px)';
        menu.style.display = 'none';
        toggle.classList.remove('active');
      } else {
        // Close other dropdowns first
        closeAllDropdowns();
        
        // Open this one
        menu.style.display = 'block';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
        toggle.classList.add('active');
      }
    });
  });
  
  // Close all dropdowns
  function closeAllDropdowns() {
    const menus = document.querySelectorAll('.dropdown-menu');
    const toggles = document.querySelectorAll('.dropdown-toggle');
    
    menus.forEach(menu => {
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      menu.style.transform = 'translateY(10px)';
      menu.style.display = 'none';
    });
    
    toggles.forEach(toggle => {
      toggle.classList.remove('active');
    });
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      closeAllDropdowns();
    }
  });

  // Log confirmation that the script is running
  console.log('Header dropdown script initialized');
});