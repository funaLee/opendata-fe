/**
 * Author Map Functionality - Fixed Version with No Jump on Hover
 */
document.addEventListener('DOMContentLoaded', function() {
  let map;
  let markers = [];
  let filteredAuthors = [];

  // Vietnam center coordinates
  const vietnamCenter = [14.0583, 108.2772];
  const defaultZoom = 6;

  // Extended author data
  const authors = [
    {
      id: 1,
      name: 'Dr. Nguyễn Văn A',
      affiliation: 'Trường ĐH Công nghệ Thông tin',
      location: 'TP. Hồ Chí Minh',
      city: 'hcm',
      coordinates: [10.7697, 106.6580],
      hIndex: 25,
      paperCount: 50,
      fields: 'Machine Learning, AI',
      researchField: 'machine-learning',
      profile: '#',
      institution: 'Trường ĐH Công nghệ Thông tin - ĐHQG.HCM'
    },
    {
      id: 2,
      name: 'Dr. Trần Thị B',
      affiliation: 'Đại học Quốc gia Hà Nội',
      location: 'Hà Nội',
      city: 'hanoi',
      coordinates: [21.0285, 105.8542],
      hIndex: 30,
      paperCount: 75,
      fields: 'Computer Vision, NLP',
      researchField: 'computer-vision',
      profile: '#',
      institution: 'Đại học Quốc gia Hà Nội'
    },
    {
      id: 3,
      name: 'Dr. Phạm Văn C',
      affiliation: 'Đại học FPT',
      location: 'Hà Nội',
      city: 'hanoi',
      coordinates: [21.0125, 105.5258],
      hIndex: 20,
      paperCount: 40,
      fields: 'Software Engineering',
      researchField: 'software-engineering',
      profile: '#',
      institution: 'Đại học FPT'
    },
    {
      id: 4,
      name: 'Dr. Lê Thị D',
      affiliation: 'Đại học Cần Thơ',
      location: 'Cần Thơ',
      city: 'cantho',
      coordinates: [10.0452, 105.7469],
      hIndex: 35,
      paperCount: 90,
      fields: 'Natural Language Processing',
      researchField: 'nlp',
      profile: '#',
      institution: 'Đại học Cần Thơ'
    },
    {
      id: 5,
      name: 'Dr. Hoàng Văn E',
      affiliation: 'Đại học Đà Nẵng',
      location: 'Đà Nẵng',
      city: 'danang',
      coordinates: [16.0471, 108.2068],
      hIndex: 28,
      paperCount: 60,
      fields: 'Computer Vision, Deep Learning',
      researchField: 'computer-vision',
      profile: '#',
      institution: 'Đại học Đà Nẵng'
    },
    {
      id: 6,
      name: 'Dr. Võ Thị F',
      affiliation: 'FPT Software',
      location: 'Hà Nội',
      city: 'hanoi',
      coordinates: [21.0077, 105.5256],
      hIndex: 15,
      paperCount: 25,
      fields: 'Software Engineering, DevOps',
      researchField: 'software-engineering',
      profile: '#',
      institution: 'FPT Software'
    },
    {
      id: 7,
      name: 'Dr. Bùi Văn G',
      affiliation: 'Viện AI HCMC',
      location: 'TP. Hồ Chí Minh',
      city: 'hcm',
      coordinates: [10.7831, 106.6928],
      hIndex: 40,
      paperCount: 120,
      fields: 'Machine Learning, Deep Learning',
      researchField: 'machine-learning',
      profile: '#',
      institution: 'Viện Nghiên cứu Trí tuệ Nhân tạo'
    }
  ];

  // Wait for all components to be loaded
  const checkMapContainer = setInterval(() => {
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof L !== 'undefined') {
      clearInterval(checkMapContainer);
      initializeAuthorMap();
    }
  }, 100);

  function initializeAuthorMap() {
    try {
      // Initialize the map
      map = L.map('map').setView(vietnamCenter, defaultZoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map);

      // Initialize with all authors
      filteredAuthors = [...authors];
      showAuthors();
      updateCounter();

      // Setup filters
      setupFilters();

      // Setup search functionality
      setupSearch();

      // Add animations
      addMapAnimations();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  function setupFilters() {
    const filterToggle = document.getElementById('filterToggle');
    const filterContent = document.getElementById('filterContent');
    const researchFieldFilter = document.getElementById('researchField');
    const hIndexRange = document.getElementById('hIndexRange');
    const hIndexValue = document.getElementById('hIndexValue');
    const cityFilter = document.getElementById('cityFilter');

    if (!filterToggle || !filterContent) return;

    // Toggle filter panel
    filterToggle.addEventListener('click', (e) => {
      e.preventDefault();
      filterContent.classList.toggle('active');
    });

    // Research field filter
    if (researchFieldFilter) {
      researchFieldFilter.addEventListener('change', applyFilters);
    }

    // H-index range filter
    if (hIndexRange && hIndexValue) {
      hIndexRange.addEventListener('input', function() {
        hIndexValue.textContent = this.value;
        applyFilters();
      });
    }

    // City filter
    if (cityFilter) {
      cityFilter.addEventListener('change', applyFilters);
    }

    // Close filter panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.map-filter-panel')) {
        filterContent.classList.remove('active');
      }
    });
  }

  function applyFilters() {
    const fieldFilter = document.getElementById('researchField')?.value || '';
    const hIndexFilter = parseInt(document.getElementById('hIndexRange')?.value || '0');
    const cityFilter = document.getElementById('cityFilter')?.value || '';

    filteredAuthors = authors.filter(author => {
      const matchesField = !fieldFilter || author.researchField === fieldFilter;
      const matchesHIndex = author.hIndex >= hIndexFilter;
      const matchesCity = !cityFilter || author.city === cityFilter;
      return matchesField && matchesHIndex && matchesCity;
    });

    clearMarkers();
    showAuthors();
    updateCounter();
  }

  function setupSearch() {
    const searchInput = document.getElementById('mapSearch');
    const searchBtn = document.getElementById('searchBtn');

    if (!searchInput || !searchBtn) return;

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });

    // Auto-suggest functionality
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();
      if (query.length > 2) {
        showSearchSuggestions(query);
      }
    });
  }

  function performSearch() {
    const searchQuery = document.getElementById('mapSearch')?.value?.trim()?.toLowerCase() || '';
    
    if (!searchQuery) return;

    const found = filteredAuthors.find(author => 
      author.name.toLowerCase().includes(searchQuery) ||
      author.affiliation.toLowerCase().includes(searchQuery) ||
      author.location.toLowerCase().includes(searchQuery) ||
      author.fields.toLowerCase().includes(searchQuery)
    );

    if (found) {
      map.setView(found.coordinates, 12);
      // Find and open the popup for this author
      const marker = markers.find(m => 
        m.getLatLng().lat === found.coordinates[0] && 
        m.getLatLng().lng === found.coordinates[1]
      );
      if (marker) {
        marker.openPopup();
        // Highlight the marker temporarily
        highlightMarker(marker);
      }
    } else {
      showNotification('Không tìm thấy tác giả nào phù hợp', 'warning');
    }
  }

  function showSearchSuggestions(query) {
    // Implementation for search suggestions can be added here
    const matchingAuthors = filteredAuthors.filter(author =>
      author.name.toLowerCase().includes(query) ||
      author.affiliation.toLowerCase().includes(query) ||
      author.fields.toLowerCase().includes(query)
    );
    // You can add a dropdown with suggestions here
  }

  function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
  }

  function showAuthors() {
    filteredAuthors.forEach(author => {
      const marker = createAuthorMarker(author);
      markers.push(marker);
    });
  }

  let currentPreview = null;

  function createAuthorMarker(author) {
    // Create custom marker icon with color based on h-index
    const hIndexColor = getHIndexColor(author.hIndex);
    const markerIcon = L.divIcon({
      className: 'custom-marker author',
      html: `<i class="fas fa-user" style="color: ${hIndexColor}"></i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker(author.coordinates, { icon: markerIcon }).addTo(map);

    // Create popup content
    const popupContent = createAuthorPopup(author);
    
    // Bind popup with custom options
    marker.bindPopup(popupContent, {
      minWidth: 300,
      maxWidth: 400,
      closeButton: true,
      autoPan: true,
      autoPanPadding: [50, 50]
    });

    // Add click event
    marker.on('click', function() {
      this.openPopup();
    });

    // Add hover events with proper preview handling
    marker.on('mouseover', function(e) {
      // Close any existing preview first
      hidePreview();
      
      if (this.getElement()) {
        // Store the marker element for later
        this._originalTransform = this.getElement().style.transform;
        this.getElement().style.transform = 'scale(1.2)';
        
        // Create and show preview with a small delay to prevent jumping
        setTimeout(() => {
          const preview = createAuthorPreview(author);
          showPreview(preview, this.getElement(), e);
        }, 100);
      }
    });

    marker.on('mouseout', function() {
      if (this.getElement() && this._originalTransform !== undefined) {
        this.getElement().style.transform = this._originalTransform;
      }
      // Hide preview with a small delay to allow moving to preview
      setTimeout(() => {
        hidePreview();
      }, 100);
    });

    return marker;
  }

  function getHIndexColor(hIndex) {
    if (hIndex >= 30) return '#e74c3c'; // Red for high h-index
    if (hIndex >= 20) return '#f39c12'; // Orange for medium h-index
    return '#3498db'; // Blue for lower h-index
  }

  function createAuthorPopup(author) {
    const template = document.getElementById('author-popup-template');
    if (!template) {
      // Fallback if template doesn't exist
      return `
        <div class="custom-popup">
          <h3>${author.name}</h3>
          <p>${author.affiliation}</p>
          <p>H-index: ${author.hIndex}</p>
          <p>Số bài báo: ${author.paperCount}</p>
          <p>Lĩnh vực: ${author.fields}</p>
          <a href="${author.profile}" target="_blank">Chi tiết</a>
        </div>
      `;
    }

    const popup = template.cloneNode(true);
    popup.style.display = 'block';

    // Fill in the content safely
    const elements = {
      '.author-name': author.name,
      '.author-affiliation': author.affiliation,
      '.author-h-index': author.hIndex,
      '.author-papers': author.paperCount,
      '.author-fields': author.fields,
      '.author-institution': author.institution
    };

    Object.entries(elements).forEach(([selector, value]) => {
      const element = popup.querySelector(selector);
      if (element) element.textContent = value;
    });
    
    const viewButton = popup.querySelector('.view-details-btn');
    if (viewButton) {
      viewButton.href = author.profile || '#';
    }

    return popup.innerHTML;
  }

  function createAuthorPreview(author) {
    return `
      <div class="author-preview">
        <strong>${author.name}</strong><br>
        <span>H-index: ${author.hIndex}</span><br>
        <span>${author.affiliation}</span>
      </div>
    `;
  }

  function showPreview(content, element, event) {
    // Remove any existing preview
    hidePreview();
    
    const preview = document.createElement('div');
    preview.className = 'map-preview';
    preview.innerHTML = content;
    
    // Style the preview with fixed positioning to prevent overflow issues
    preview.style.cssText = `
      position: fixed;
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 3000;
      font-size: 14px;
      max-width: 200px;
      pointer-events: auto;
      white-space: nowrap;
      border: 1px solid #e0e0e0;
    `;
    
    // Store reference to current preview
    currentPreview = preview;
    
    // Append to body first to get dimensions
    document.body.appendChild(preview);
    
    // Calculate position based on marker position
    const rect = element.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();
    
    // Calculate position to avoid going off screen
    let left = rect.left + rect.width + 10;
    let top = rect.top + (rect.height / 2) - (previewRect.height / 2);
    
    // Adjust if would go off right edge
    if (left + previewRect.width > window.innerWidth) {
      left = rect.left - previewRect.width - 10;
    }
    
    // Adjust if would go off top edge
    if (top < 0) {
      top = 10;
    }
    
    // Adjust if would go off bottom edge
    if (top + previewRect.height > window.innerHeight) {
      top = window.innerHeight - previewRect.height - 10;
    }
    
    preview.style.left = left + 'px';
    preview.style.top = top + 'px';
    
    // Fade in animation
    preview.style.opacity = '0';
    preview.style.transition = 'opacity 0.2s ease';
    requestAnimationFrame(() => {
      preview.style.opacity = '1';
    });
    
    // Allow hover over preview to keep it visible
    preview.addEventListener('mouseenter', () => {
      preview.style.opacity = '1';
    });
    
    preview.addEventListener('mouseleave', () => {
      hidePreview();
    });
  }

  function hidePreview() {
    if (currentPreview && currentPreview.parentNode) {
      currentPreview.style.opacity = '0';
      setTimeout(() => {
        if (currentPreview && currentPreview.parentNode) {
          currentPreview.parentNode.removeChild(currentPreview);
          currentPreview = null;
        }
      }, 200);
    }
  }

  function updateCounter() {
    const countDisplay = document.getElementById('countDisplay');
    if (countDisplay) {
      const count = filteredAuthors.length;
      countDisplay.textContent = `Showing ${count} author${count !== 1 ? 's' : ''}`;
    }
  }

  function highlightMarker(marker) {
    const element = marker.getElement();
    if (element) {
      element.style.transform = 'scale(1.3)';
      element.style.animation = 'pulse 2s infinite';
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.animation = '';
      }, 3000);
    }
  }

  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'warning' ? '#f39c12' : '#3498db'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 3000;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  function addMapAnimations() {
    if (!map) return;

    // Add loading animation for map tiles
    map.on('loading', function() {
      document.body.style.cursor = 'wait';
    });

    map.on('load', function() {
      document.body.style.cursor = 'default';
    });

    // Add zoom animation effects
    map.on('zoomstart', function() {
      // Hide any preview during zoom
      hidePreview();
      
      markers.forEach(marker => {
        const element = marker.getElement();
        if (element) {
          element.style.transition = 'transform 0.3s ease';
          element.style.transform = 'scale(0.8)';
        }
      });
    });

    map.on('zoomend', function() {
      markers.forEach(marker => {
        const element = marker.getElement();
        if (element) {
          element.style.transform = 'scale(1)';
        }
      });
    });
  }

  // Hide preview when map is moved
  map.on('drag', function() {
    hidePreview();
  });

  // Add page animations
  function addPageAnimations() {
    const mainContent = document.querySelector('.main-content');
    const mapContainer = document.querySelector('.map-container');
    
    if (mainContent) {
      mainContent.classList.add('animate-fadeInDown');
    }
    
    if (mapContainer) {
      setTimeout(() => {
        mapContainer.classList.add('animate-fadeInUp');
      }, 200);
    }
  }

  // Initialize animations
  addPageAnimations();

  // Add CSS for notifications and animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* Prevent body scroll when preview is visible */
    .map-preview {
      user-select: none;
    }
    
    /* Ensure map container doesn't overflow */
    .map-container {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
});