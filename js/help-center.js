/**
 * Help Center Popup Functionality
 */
(function() {
  // We need to wait for all includes to be loaded
  const checkComponentsLoaded = setInterval(function() {
    if (document.querySelector('.help-button') && document.getElementById('help-center-popup')) {
      clearInterval(checkComponentsLoaded);
      initHelpCenter();
    }
  }, 100);

  function initHelpCenter() {
    // Get DOM elements
    const helpButton = document.querySelector('.help-button');
    const helpCenterPopup = document.getElementById('help-center-popup');
    const closeHelpCenterButton = document.getElementById('closeHelpCenter');
    const searchForm = helpCenterPopup.querySelector('.help-search-form');
    const searchInput = helpCenterPopup.querySelector('.help-search-input');
    const searchButton = helpCenterPopup.querySelector('.help-search-button');
    
    if (!helpButton || !helpCenterPopup || !closeHelpCenterButton) {
      console.error('Help center elements not found!');
      return;
    }
    
    console.log('Help center initialized!');
    
    // Function to open help center popup
    const openHelpCenter = (e) => {
      if (e) e.preventDefault();
      helpCenterPopup.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind popup
      
      // Focus the search input when popup opens
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 300);
    };
    
    // Function to close help center popup
    const closeHelpCenter = () => {
      helpCenterPopup.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    };
    
    // Function to handle search
    const handleSearch = (e) => {
      e.preventDefault();
      const searchQuery = searchInput.value.trim();
      
      if (searchQuery) {
        console.log('Searching for:', searchQuery);
        // Here you can implement the actual search functionality
        // For example, redirect to a search results page:
        // window.location.href = `/search-results.html?q=${encodeURIComponent(searchQuery)}`;
        
        // For now, we'll just show an alert
        alert(`Searching for: ${searchQuery}`);
      }
    };
    
    // Add event listeners
    helpButton.addEventListener('click', openHelpCenter);
    
    closeHelpCenterButton.addEventListener('click', closeHelpCenter);
    
    // Set up search form functionality
    if (searchForm && searchButton) {
      searchForm.addEventListener('submit', handleSearch);
      searchButton.addEventListener('click', handleSearch);
    }
    
    // Close when clicking outside the content
    helpCenterPopup.addEventListener('click', function(e) {
      if (e.target === helpCenterPopup) {
        closeHelpCenter();
      }
    });
    
    // Close on ESC key press
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && helpCenterPopup.classList.contains('active')) {
        closeHelpCenter();
      }
    });
  }
})();