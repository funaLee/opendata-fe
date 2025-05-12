/**
 * Author Map Functionality - Complete Fix
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
  function waitForDependencies() {
    if (typeof L === 'undefined') {
      console.log('Waiting for Leaflet to load...');
      setTimeout(waitForDependencies, 100);
      return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.log('Waiting for map container...');
      setTimeout(waitForDependencies, 100);
      return;
    }

    console.log('All dependencies loaded, initializing map...');
    initializeAuthorMap();
  }

  waitForDependencies();

  function initializeAuthorMap() {
    try {
      // Initialize the map
      map = L.map('map', {
        center: vietnamCenter,
        zoom: defaultZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
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

      console.log('Map initialized successfully');
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

    if (!filterToggle) {
      console.warn('Filter toggle not found');
      return;
    }

    if (!filterContent) {
      console.warn('Filter content not found');
      return;
    }

    // Toggle filter panel
    filterToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
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

    if (!searchInput || !searchBtn) {
      console.warn('Search elements not found');
      return;
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
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
        Math.abs(m.getLatLng().lat - found.coordinates[0]) < 0.001 && 
        Math.abs(m.getLatLng().lng - found.coordinates[1]) < 0.001
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
    markers.forEach(marker => {
      try {
        map.removeLayer(marker);
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markers = [];
  }

  function showAuthors() {
    filteredAuthors.forEach(author => {
      try {
        const marker = createAuthorMarker(author);
        markers.push(marker);
      } catch (e) {
        console.error('Error creating marker for author:', author.name, e);
      }
    });
  }

  function createAuthorMarker(author) {
    // Create custom marker icon with color based on h-index
    const hIndexColor = getHIndexColor(author.hIndex);
    const markerIcon = L.divIcon({
      className: 'custom-marker author',
      html: `<i class="fas fa-user" style="color: white;"></i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });

    const marker = L.marker(author.coordinates, { icon: markerIcon }).addTo(map);

    // Apply color based on h-index
    setTimeout(() => {
      const element = marker.getElement();
      if (element) {
        element.style.backgroundColor = hIndexColor;
      }
    }, 0);

    // Create and bind popup
    const popupContent = createAuthorPopup(author);
    marker.bindPopup(popupContent, {
      minWidth: 300,
      maxWidth: 400,
      closeButton: true,
      autoPan: true,
      autoPanPadding: [50, 50]
    });

    // Store author data for easy access
    marker.authorData = author;

    // Add event listeners
    marker.on('click', function() {
      this.openPopup();
    });

    // Use Leaflet's built-in tooltip for hover effects
    marker.bindTooltip(`
      <div style="text-align: center;">
        <strong>${author.name}</strong><br>
        <span style="color: #666;">H-index: ${author.hIndex}</span><br>
        <span style="font-size: 12px;">${author.affiliation}</span>
      </div>
    `, {
      permanent: false,
      sticky: true,
      offset: [0, -20],
      direction: 'top'
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
      // Fallback HTML if template doesn't exist
      return `
        <div style="min-width: 250px;">
          <div style="text-align: center; padding: 10px;">
            <div style="width: 60px; height: 60px; background: ${getHIndexColor(author.hIndex)}; 
                        border-radius: 50%; margin: 0 auto 10px; display: flex; 
                        align-items: center; justify-content: center; color: white;">
              <i class="fas fa-user" style="font-size: 24px;"></i>
            </div>
            <h3 style="margin: 0 0 5px 0; color: #333;">${author.name}</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">${author.affiliation}</p>
          </div>
          <div style="padding: 0 10px 10px;">
            <p style="margin: 5px 0;"><strong>H-index:</strong> ${author.hIndex}</p>
            <p style="margin: 5px 0;"><strong>Số bài báo:</strong> ${author.paperCount}</p>
            <p style="margin: 5px 0;"><strong>Lĩnh vực:</strong> ${author.fields}</p>
            <p style="margin: 5px 0;"><strong>Tổ chức:</strong> ${author.institution}</p>
            <a href="${author.profile}" target="_blank" style="color: #007cba; text-decoration: none;">
              Xem chi tiết <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
    }

    try {
      const popup = template.cloneNode(true);
      popup.style.display = 'block';
      popup.removeAttribute('id');

      // Fill in the content safely
      const elements = {
        '.author-name': author.name,
        '.author-affiliation': author.affiliation,
        '.author-h-index': author.hIndex.toString(),
        '.author-papers': author.paperCount.toString(),
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
    } catch (e) {
      console.error('Error creating popup content:', e);
      return `<div>Error loading popup content</div>`;
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
    if (!marker.getElement()) return;
    
    const element = marker.getElement();
    element.style.transform = 'scale(1.3)';
    element.style.animation = 'pulse 2s infinite';
    
    setTimeout(() => {
      if (element) {
        element.style.transform = 'scale(1)';
        element.style.animation = '';
      }
    }, 3000);
  }

  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.map-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `map-notification notification-${type}`;
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
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
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
  setTimeout(addPageAnimations, 100);

  // Add required CSS styles
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
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .custom-marker {
      border-radius: 50%;
      background-color: white;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    
    .custom-marker:hover {
      transform: scale(1.1);
    }
    
    .custom-marker.author {
      color: white;
    }
    
    .leaflet-tooltip {
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-size: 13px;
      color: #333;
    }
    
    .leaflet-tooltip-top:before {
      border-top-color: white;
    }
  `;
  document.head.appendChild(style);
});