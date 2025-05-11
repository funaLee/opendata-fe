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
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    toggle.addEventListener('mouseleave', () => {
      isOverToggle = false;
      
      // Only hide dropdown after a short delay
      // This gives time to move mouse to the dropdown menu
      timeoutId = setTimeout(() => {
        if (!isOverMenu) {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateX(-50%) translateY(10px)';
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
          menu.style.transform = 'translateX(-50%) translateY(10px)';
          toggle.classList.remove('active');
        }
      }, 150);
    });
  });
  
  // Handle click events for mobile (optional)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      // For touch devices, toggle the dropdown on click
      if (window.matchMedia('(max-width: 1024px)').matches) {
        e.preventDefault();
        const container = toggle.closest('.dropdown-container');
        const menu = container.querySelector('.dropdown-menu');
        
        // Toggle this dropdown
        if (menu.style.visibility === 'visible') {
          menu.style.opacity = '0';
          menu.style.visibility = 'hidden';
          menu.style.transform = 'translateX(-50%) translateY(10px)';
          toggle.classList.remove('active');
        } else {
          menu.style.opacity = '1';
          menu.style.visibility = 'visible';
          menu.style.transform = 'translateX(-50%) translateY(0)';
          toggle.classList.add('active');
        }
        
        // Close other dropdowns
        dropdownContainers.forEach(otherContainer => {
          if (otherContainer !== container) {
            const otherMenu = otherContainer.querySelector('.dropdown-menu');
            const otherToggle = otherContainer.querySelector('.dropdown-toggle');
            
            otherMenu.style.opacity = '0';
            otherMenu.style.visibility = 'hidden';
            otherMenu.style.transform = 'translateX(-50%) translateY(10px)';
            otherToggle.classList.remove('active');
          }
        });
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-container')) {
      dropdownContainers.forEach(container => {
        const menu = container.querySelector('.dropdown-menu');
        const toggle = container.querySelector('.dropdown-toggle');
        
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(10px)';
        toggle.classList.remove('active');
      });
    }
  });
});