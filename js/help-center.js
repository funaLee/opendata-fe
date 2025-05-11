/**
 * Help Center Popup Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const helpButton = document.querySelector('.help-button');
  const helpCenterPopup = document.getElementById('help-center-popup');
  const closeHelpCenterButton = document.getElementById('closeHelpCenter');
  
  // Function to open help center popup
  const openHelpCenter = () => {
    helpCenterPopup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind popup
  };
  
  // Function to close help center popup
  const closeHelpCenter = () => {
    helpCenterPopup.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Add event listeners
  if (helpButton) {
    helpButton.addEventListener('click', function(e) {
      e.preventDefault();
      openHelpCenter();
    });
  }
  
  if (closeHelpCenterButton) {
    closeHelpCenterButton.addEventListener('click', closeHelpCenter);
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
});