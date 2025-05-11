/**
 * Dataset page with modality filtering functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to main elements
  const searchTitle = document.querySelector('.search-title');
  const subtitle = document.querySelector('.subtitle');
  const actionButtons = document.querySelector('.action-buttons');
  const datasetSearch = document.querySelector('.dataset-search');
  const modalityTabs = document.querySelector('.modality-tabs');
  
  if (searchTitle) searchTitle.classList.add('animate-fadeInDown');
  if (subtitle) subtitle.classList.add('animate-fadeInUp');
  if (actionButtons) actionButtons.classList.add('animate-fadeIn');
  if (datasetSearch) datasetSearch.classList.add('animate-fadeInUp');
  if (modalityTabs) modalityTabs.classList.add('animate-fadeIn');
  
  // Add staggered animations to dataset cards
  setTimeout(() => {
    const datasetCards = document.querySelectorAll('.dataset-card');
    
    datasetCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 300);
  
  // Modality tabs functionality
  const tabs = document.querySelectorAll('.modality-tab');
  const sections = document.querySelectorAll('.modality-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      const modality = tab.getAttribute('data-modality');
      
      // Show/hide sections based on selected tab
      if (modality === 'all') {
        sections.forEach(section => {
          section.style.display = 'block';
          
          // Animate the section
          section.style.opacity = '0';
          section.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            section.style.transition = 'all 0.5s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
          }, 50);
        });
      } else {
        sections.forEach(section => {
          if (section.id === modality) {
            section.style.display = 'block';
            
            // Animate the section
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              section.style.transition = 'all 0.5s ease-out';
              section.style.opacity = '1';
              section.style.transform = 'translateY(0)';
            }, 50);
          } else {
            section.style.display = 'none';
          }
        });
      }
    });
  });
  
  // Load more button functionality
  const loadMoreButtons = document.querySelectorAll('.load-more-button');
  
  loadMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
      const section = this.closest('.modality-section');
      const datasetsGrid = section.querySelector('.datasets-grid');
      
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      // Simulate loading more datasets (would be replaced with actual API call)
      setTimeout(() => {
        // Create sample dataset cards based on modality
        const modality = section.id;
        let newDatasets = [];
        
        if (modality === 'image') {
          newDatasets = [
            {
              image: '../assets/images/coco.jpg',
              title: 'COCO: Common Objects in Context',
              author: 'Lin et al.',
              paperUrl: 'https://arxiv.org/abs/1405.0312',
              paperTitle: 'Microsoft COCO: Common Objects in Context',
              homepage: 'https://cocodataset.org/',
              tags: ['Object Detection', 'Image Segmentation']
            },
            {
              image: '../assets/images/pascal-voc.jpg',
              title: 'Pascal VOC',
              author: 'Everingham et al.',
              paperUrl: 'http://host.robots.ox.ac.uk/pascal/VOC/pubs/everingham15.pdf',
              paperTitle: 'The PASCAL Visual Object Classes Challenge: A Retrospective',
              homepage: 'http://host.robots.ox.ac.uk/pascal/VOC/',
              tags: ['Object Detection', 'Image Segmentation']
            }
          ];
        } else if (modality === 'text') {
          newDatasets = [
            {
              image: '../assets/images/wmt.jpg',
              title: 'WMT: Conference on Machine Translation',
              author: 'Various',
              paperUrl: 'https://aclanthology.org/W18-6401/',
              paperTitle: 'Findings of the 2018 Conference on Machine Translation',
              homepage: 'https://www.statmt.org/wmt18/',
              tags: ['Machine Translation', 'NLP']
            }
          ];
        } else if (modality === 'audio') {
          newDatasets = [
            {
              image: '../assets/images/common-voice.jpg',
              title: 'Mozilla Common Voice',
              author: 'Mozilla Foundation',
              paperUrl: 'https://arxiv.org/abs/1912.06670',
              paperTitle: 'Common Voice: A Massively-Multilingual Speech Corpus',
              homepage: 'https://commonvoice.mozilla.org/',
              tags: ['Speech Recognition', 'Multilingual']
            }
          ];
        }
        
        // Add new datasets to the grid
        newDatasets.forEach((dataset, index) => {
          const card = createDatasetCard(dataset);
          
          // Add to grid with animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          datasetsGrid.appendChild(card);
          
          setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });
        
        // Reset button
        this.innerHTML = 'Load More Datasets <i class="fas fa-chevron-down"></i>';
      }, 1000);
    });
  });
  
  // Helper function to create a dataset card
  function createDatasetCard(data) {
    const card = document.createElement('div');
    card.className = 'dataset-card';
    
    const image = document.createElement('img');
    image.className = 'dataset-image';
    image.src = data.image;
    image.alt = data.title;
    
    const info = document.createElement('div');
    info.className = 'dataset-info';
    
    const title = document.createElement('h3');
    title.className = 'dataset-title';
    title.textContent = data.title;
    
    const author = document.createElement('p');
    author.className = 'dataset-author';
    author.innerHTML = `
      Introduced by <span class="dataset-author-name">${data.author}</span> in
      <a class="dataset-link" href="${data.paperUrl}" target="_blank">${data.paperTitle}</a>
    `;
    
    const linksAndTags = document.createElement('div');
    linksAndTags.className = 'dataset-links-and-tags';
    
    const homeLink = document.createElement('a');
    homeLink.className = 'dataset-link-button';
    homeLink.href = data.homepage;
    homeLink.target = '_blank';
    homeLink.textContent = 'Homepage';
    
    const tags = document.createElement('div');
    tags.className = 'dataset-tags';
    
    data.tags.forEach(tagText => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = tagText;
      tags.appendChild(tag);
    });
    
    linksAndTags.appendChild(homeLink);
    linksAndTags.appendChild(tags);
    
    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(linksAndTags);
    
    card.appendChild(image);
    card.appendChild(info);
    
    return card;
  }
});