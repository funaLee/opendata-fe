/**
 * Adds animations to dataset page elements when the page loads
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to main elements
  const searchTitle = document.querySelector('.search-title');
  const subtitle = document.querySelector('.subtitle');
  const actionButtons = document.querySelector('.action-buttons');
  const datasetSearch = document.querySelector('.dataset-search');
  const sectionTitle = document.querySelector('.section-title');
  
  if (searchTitle) searchTitle.classList.add('animate-fadeInDown');
  if (subtitle) subtitle.classList.add('animate-fadeInUp');
  if (actionButtons) actionButtons.classList.add('animate-fadeIn');
  if (datasetSearch) datasetSearch.classList.add('animate-fadeInUp');
  if (sectionTitle) sectionTitle.classList.add('animate-fadeIn');
  
  // Add staggered animations to dataset cards with a delay
  setTimeout(() => {
    const datasetContainer = document.getElementById('dataset-container');
    if (datasetContainer) {
      const cardContainers = datasetContainer.querySelectorAll('div[id^="dataset-card-container"]');
      
      cardContainers.forEach((container, index) => {
        // Set up observer to check when cards are rendered
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
              const datasetCard = container.querySelector('.dataset-card');
              if (datasetCard) {
                // Apply staggered animation
                datasetCard.style.opacity = '0';
                datasetCard.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                  datasetCard.style.transition = 'all 0.6s ease-out';
                  datasetCard.style.opacity = '1';
                  datasetCard.style.transform = 'translateY(0)';
                }, index * 150);
                
                // Once we've handled this card, disconnect the observer
                observer.disconnect();
              }
            }
          });
        });
        
        // Start observing the container for added nodes
        observer.observe(container, { childList: true });
      });
    }
  }, 500);
});