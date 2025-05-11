/**
 * Paper page functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add animation classes to main elements
  const searchTitle = document.querySelector('.search-title');
  const subtitle = document.querySelector('.subtitle');
  const actionButtons = document.querySelector('.action-buttons');
  const paperSearch = document.querySelector('.paper-search');
  const areaTabs = document.querySelector('.area-tabs');
  
  if (searchTitle) searchTitle.classList.add('animate-fadeInDown');
  if (subtitle) subtitle.classList.add('animate-fadeInUp');
  if (actionButtons) actionButtons.classList.add('animate-fadeIn');
  if (paperSearch) paperSearch.classList.add('animate-fadeInUp');
  if (areaTabs) areaTabs.classList.add('animate-fadeIn');
  
  // Add staggered animations to paper cards
  setTimeout(() => {
    const paperCards = document.querySelectorAll('.paper-card');
    
    paperCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 300);
  
  // Area tabs functionality
  const tabs = document.querySelectorAll('.area-tab');
  const sections = document.querySelectorAll('.area-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      const area = tab.getAttribute('data-area');
      
      // Show/hide sections based on selected tab
      if (area === 'all') {
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
          if (section.id === area) {
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
      const section = this.closest('.area-section');
      const papersGrid = section.querySelector('.papers-grid');
      
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      // Simulate loading more papers (would be replaced with actual API call)
      setTimeout(() => {
        // Create new paper cards (this is just a demo - would normally fetch from API)
        for (let i = 0; i < 2; i++) {
          const newCard = createPaperCard({
            conference: 'ICLR 2024',
            date: 'April 2024',
            title: 'New Research Paper ' + (i + 1),
            authors: 'Author One, Author Two, Author Three',
            abstract: 'This is a sample abstract for a newly loaded paper. It would contain the key information about the research findings and methodology.',
            stars: Math.floor(Math.random() * 200) + 50,
            citations: Math.floor(Math.random() * 30) + 5,
            hascode: Math.random() > 0.3, // 70% chance to have code
            hasdataset: Math.random() > 0.6 // 40% chance to have dataset
          });
          
          // Add to grid with animation
          newCard.style.opacity = '0';
          newCard.style.transform = 'translateY(20px)';
          papersGrid.appendChild(newCard);
          
          setTimeout(() => {
            newCard.style.transition = 'all 0.6s ease-out';
            newCard.style.opacity = '1';
            newCard.style.transform = 'translateY(0)';
          }, i * 100);
        }
        
        // Reset button
        this.innerHTML = 'Load More Papers <i class="fas fa-chevron-down"></i>';
      }, 1000);
    });
  });
  
  // Helper function to create a paper card
  function createPaperCard(data) {
    const card = document.createElement('div');
    card.className = 'paper-card';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'paper-header';
    
    const meta = document.createElement('div');
    meta.className = 'paper-meta';
    meta.innerHTML = `
      <span class="conference">${data.conference}</span>
      <span class="date">${data.date}</span>
    `;
    
    const badges = document.createElement('div');
    badges.className = 'paper-badges';
    
    if (data.hascode) {
      badges.innerHTML += '<span class="badge code-badge"><i class="fas fa-code"></i> Code</span>';
    }
    
    if (data.hasdataset) {
      badges.innerHTML += '<span class="badge dataset-badge"><i class="fas fa-database"></i> Dataset</span>';
    }
    
    header.appendChild(meta);
    header.appendChild(badges);
    
    // Create content
    const title = document.createElement('h3');
    title.className = 'paper-title';
    title.textContent = data.title;
    
    const authors = document.createElement('p');
    authors.className = 'paper-authors';
    authors.textContent = data.authors;
    
    const abstract = document.createElement('p');
    abstract.className = 'paper-abstract';
    abstract.textContent = data.abstract;
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'paper-footer';
    
    const metrics = document.createElement('div');
    metrics.className = 'paper-metrics';
    metrics.innerHTML = `
      <span class="metric"><i class="fas fa-star"></i> ${data.stars}</span>
      <span class="metric"><i class="fas fa-quote-right"></i> ${data.citations}</span>
    `;
    
    const links = document.createElement('div');
    links.className = 'paper-links';
    links.innerHTML = `
      <a href="#" class="paper-link"><i class="fas fa-external-link-alt"></i> Paper</a>
      ${data.hascode ? '<a href="#" class="paper-link"><i class="fas fa-code"></i> Code</a>' : ''}
    `;
    
    footer.appendChild(metrics);
    footer.appendChild(links);
    
    // Assemble the card
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(authors);
    card.appendChild(abstract);
    card.appendChild(footer);
    
    return card;
  }
  
  // Paper render functionality - can be expanded for dynamic paper loading
  function renderPaperCard(containerSelector, paperData) {
    // Wait for template to be loaded
    const waitForTemplate = () => {
      const template = document.getElementById('paper-card-template');
      if (template) {
        const clone = template.content.cloneNode(true);
        
        // Set paper data
        clone.querySelector('.conference').textContent = paperData.conference;
        clone.querySelector('.date').textContent = paperData.date;
        clone.querySelector('.paper-title').textContent = paperData.title;
        clone.querySelector('.paper-authors').textContent = paperData.authors;
        clone.querySelector('.paper-abstract').textContent = paperData.abstract;
        clone.querySelector('.stars-count').textContent = paperData.stars;
        clone.querySelector('.citations-count').textContent = paperData.citations;
        
        // Set URLs
        if (paperData.paperUrl) {
          clone.querySelector('.paper-url').href = paperData.paperUrl;
        }
        
        if (paperData.codeUrl) {
          clone.querySelector('.code-url').href = paperData.codeUrl;
        } else {
          const codeLink = clone.querySelector('.code-url');
          if (codeLink) codeLink.remove();
        }
        
        // Add badges
        const badgesContainer = clone.querySelector('.paper-badges');
        if (paperData.hasCode) {
          const codeBadge = document.createElement('span');
          codeBadge.className = 'badge code-badge';
          codeBadge.innerHTML = '<i class="fas fa-code"></i> Code';
          badgesContainer.appendChild(codeBadge);
        }
        
        if (paperData.hasDataset) {
          const datasetBadge = document.createElement('span');
          datasetBadge.className = 'badge dataset-badge';
          datasetBadge.innerHTML = '<i class="fas fa-database"></i> Dataset';
          badgesContainer.appendChild(datasetBadge);
        }
        
        if (paperData.hasBenchmark) {
          const benchmarkBadge = document.createElement('span');
          benchmarkBadge.className = 'badge benchmark-badge';
          benchmarkBadge.innerHTML = '<i class="fas fa-chart-line"></i> Benchmark';
          badgesContainer.appendChild(benchmarkBadge);
        }
        
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
  
  // Export for global use
  window.renderPaperCard = renderPaperCard;
});