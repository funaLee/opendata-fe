function renderDatasetCard(containerSelector, dataset) {
  // Wait for template to be loaded
  const waitForTemplate = () => {
    const template = document.getElementById('dataset-card-template');
    if (template) {
      const clone = template.content.cloneNode(true);

      clone.querySelector('.dataset-image').src = dataset.image;
      clone.querySelector('.dataset-image').alt = dataset.title;
      clone.querySelector('.dataset-title').textContent = dataset.title;
      clone.querySelector('.dataset-author-name').textContent = dataset.author;
      clone.querySelector('.dataset-link').href = dataset.paperUrl;
      clone.querySelector('.dataset-link').textContent = dataset.paperTitle;
      clone.querySelector('.dataset-link-button').href = dataset.homepage;

      const tagsContainer = clone.querySelector('.dataset-tags');
      dataset.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      const container = document.querySelector(containerSelector);
      if (container) {
        container.appendChild(clone);
      }
    } else {
      // If template is not loaded yet, wait and try again
      setTimeout(waitForTemplate, 100);
    }
  };

  waitForTemplate();
}

/* Add animations on load */
document.addEventListener('DOMContentLoaded', function() {
  // Safely add animation classes by checking if elements exist first
  const searchTitle = document.querySelector('.search-title');
  if (searchTitle) {
    searchTitle.classList.add('animate-fadeInDown');
  }

  const subtitle = document.querySelector('.subtitle');
  if (subtitle) {
    subtitle.classList.add('animate-fadeInUp');
  }

  const actionButtons = document.querySelector('.action-buttons');
  if (actionButtons) {
    actionButtons.classList.add('animate-fadeIn');
  }

  const datasetSearch = document.querySelector('.dataset-search');
  if (datasetSearch) {
    datasetSearch.classList.add('animate-fadeInUp');
  }
  
  // Add staggered animations to dataset cards
  const cards = document.querySelectorAll('.dataset-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = `fadeInUp 0.6s ease-out forwards`;
    }, index * 150);
  });
});