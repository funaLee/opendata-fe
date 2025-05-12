/**
 * Institution Map Functionality - Complete Fix
 */
document.addEventListener('DOMContentLoaded', function() {
  let map;
  let markers = [];
  let filteredInstitutions = [];

  // Vietnam center coordinates
  const vietnamCenter = [14.0583, 108.2772];
  const defaultZoom = 6;

  // Extended institutional data
  const institutions = [
    {
      id: 1,
      name: 'Trường Đại học Công nghệ Thông tin - ĐHQG.HCM',
      type: 'Đại học công lập',
      category: 'university',
      location: 'TP. Hồ Chí Minh',
      city: 'hcm',
      coordinates: [10.7697, 106.6580],
      authorCount: 150,
      paperCount: 500,
      mainFields: 'Computer Science, AI, Software Engineering',
      image: '/assets/images/institutions/uit.jpg',
      website: 'https://www.uit.edu.vn',
      description: 'Trường Đại học Công nghệ Thông tin có tên đầy đủ là Trường Đại học Công nghệ Thông tin ĐHQG-TP.HCM.'
    },
    {
      id: 2,
      name: 'Đại học Quốc gia Hà Nội',
      type: 'Đại học quốc gia',
      category: 'university',
      location: 'Hà Nội',
      city: 'hanoi',
      coordinates: [21.0285, 105.8542],
      authorCount: 200,
      paperCount: 800,
      mainFields: 'Multiple disciplines, Science, Technology',
      image: '/assets/images/institutions/vnu.jpg',
      website: 'https://www.vnu.edu.vn',
      description: 'Đại học Quốc gia Hà Nội là một trong những trường đại học hàng đầu Việt Nam.'
    },
    {
      id: 3,
      name: 'Đại học FPT',
      type: 'Đại học tư thục',
      category: 'university',
      location: 'Hà Nội',
      city: 'hanoi',
      coordinates: [21.0125, 105.5258],
      authorCount: 80,
      paperCount: 250,
      mainFields: 'Information Technology, Business',
      image: '/assets/images/institutions/fpt.jpg',
      website: 'https://www.fpt.edu.vn',
      description: 'Đại học FPT đào tạo với chương trình hiện đại.'
    },
    {
      id: 4,
      name: 'Đại học Cần Thơ',
      type: 'Đại học công lập',
      category: 'university',
      location: 'Cần Thơ',
      city: 'cantho',
      coordinates: [10.0452, 105.7469],
      authorCount: 120,
      paperCount: 400,
      mainFields: 'Agriculture, Engineering, Medicine',
      image: '/assets/images/institutions/ctu.jpg',
      website: 'https://www.ctu.edu.vn',
      description: 'Đại học Cần Thơ là trường đại học đa ngành tại miền Tây.'
    },
    {
      id: 5,
      name: 'Viện Nghiên cứu Trí tuệ Nhân tạo',
      type: 'Viện nghiên cứu',
      category: 'research',
      location: 'TP. Hồ Chí Minh',
      city: 'hcm',
      coordinates: [10.7831, 106.6928],
      authorCount: 50,
      paperCount: 150,
      mainFields: 'Artificial Intelligence, Machine Learning',
      image: '/assets/images/institutions/ai-institute.jpg',
      website: '#',
      description: 'Viện nghiên cứu chuyên về AI và ML.'
    },
    {
      id: 6,
      name: 'FPT Software',
      type: 'Công ty công nghệ',
      category: 'company',
      location: 'Hà Nội',
      city: 'hanoi',
      coordinates: [21.0077, 105.5256],
      authorCount: 30,
      paperCount: 80,
      mainFields: 'Software Development, Digital Transformation',
      image: '/assets/images/institutions/fpt-software.jpg',
      website: 'https://www.fpt-software.com',
      description: 'Công ty phần mềm hàng đầu Việt Nam.'
    },
    {
      id: 7,
      name: 'Đại học Đà Nẵng',
      type: 'Đại học công lập',
      category: 'university',
      location: 'Đà Nẵng',
      city: 'danang',
      coordinates: [16.0471, 108.2068],
      authorCount: 100,
      paperCount: 300,
      mainFields: 'Engineering, Natural Sciences',
      image: '/assets/images/institutions/udn.jpg',
      website: 'https://www.udn.vn',
      description: 'Đại học Đà Nẵng là trường đại học tổng hợp tại miền Trung.'
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
    initializeInstitutionMap();
  }

  waitForDependencies();

  function initializeInstitutionMap() {
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

      // Initialize with all institutions
      filteredInstitutions = [...institutions];
      showInstitutions();
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
    const institutionTypeFilter = document.getElementById('institutionType');
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

    // Institution type filter
    if (institutionTypeFilter) {
      institutionTypeFilter.addEventListener('change', applyFilters);
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
    const typeFilter = document.getElementById('institutionType')?.value || '';
    const cityFilter = document.getElementById('cityFilter')?.value || '';

    filteredInstitutions = institutions.filter(institution => {
      const matchesType = !typeFilter || institution.category === typeFilter;
      const matchesCity = !cityFilter || institution.city === cityFilter;
      return matchesType && matchesCity;
    });

    clearMarkers();
    showInstitutions();
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

    const found = filteredInstitutions.find(institution => 
      institution.name.toLowerCase().includes(searchQuery) ||
      institution.location.toLowerCase().includes(searchQuery) ||
      institution.type.toLowerCase().includes(searchQuery)
    );

    if (found) {
      map.setView(found.coordinates, 12);
      // Find and open the popup for this institution
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
      showNotification('Không tìm thấy tổ chức nào phù hợp', 'warning');
    }
  }

  function showSearchSuggestions(query) {
    // Implementation for search suggestions can be added here
    const matchingInstitutions = filteredInstitutions.filter(institution =>
      institution.name.toLowerCase().includes(query) ||
      institution.location.toLowerCase().includes(query)
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

  function showInstitutions() {
    filteredInstitutions.forEach(institution => {
      try {
        const marker = createInstitutionMarker(institution);
        markers.push(marker);
      } catch (e) {
        console.error('Error creating marker for institution:', institution.name, e);
      }
    });
  }

  function createInstitutionMarker(institution) {
    // Create custom marker icon
    const markerIcon = L.divIcon({
      className: 'custom-marker institution',
      html: '<i class="fas fa-university"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker(institution.coordinates, { icon: markerIcon }).addTo(map);

    // Create and bind popup
    const popupContent = createInstitutionPopup(institution);
    marker.bindPopup(popupContent, {
      minWidth: 320,
      maxWidth: 400,
      closeButton: true,
      autoPan: true,
      autoPanPadding: [50, 50]
    });

    // Store institution data for easy access
    marker.institutionData = institution;

    // Add event listeners
    marker.on('click', function() {
      this.openPopup();
    });

    // Use Leaflet's built-in tooltip for hover effects instead of custom preview
    marker.bindTooltip(`
      <div style="text-align: center;">
        <strong>${institution.name}</strong><br>
        <span style="color: #666;">${institution.type}</span><br>
        <span style="font-size: 12px;">Tác giả: ${institution.authorCount} | Bài báo: ${institution.paperCount}</span>
      </div>
    `, {
      permanent: false,
      sticky: true,
      offset: [0, -20],
      direction: 'top'
    });

    return marker;
  }

  function createInstitutionPopup(institution) {
    const template = document.getElementById('institution-popup-template');
    
    if (!template) {
      // Fallback HTML if template doesn't exist
      return `
        <div style="min-width: 250px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${institution.name}</h3>
          <p style="margin: 5px 0; color: #666;">${institution.type}</p>
          <p style="margin: 5px 0;"><strong>Vị trí:</strong> ${institution.location}</p>
          <p style="margin: 5px 0;"><strong>Số tác giả:</strong> ${institution.authorCount}</p>
          <p style="margin: 5px 0;"><strong>Số bài báo:</strong> ${institution.paperCount}</p>
          <p style="margin: 5px 0;"><strong>Lĩnh vực:</strong> ${institution.mainFields}</p>
          <a href="${institution.website}" target="_blank" style="color: #007cba; text-decoration: none;">
            Xem chi tiết <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      `;
    }

    try {
      const popup = template.cloneNode(true);
      popup.style.display = 'block';
      popup.removeAttribute('id');

      // Fill in the content
      const institutionImage = popup.querySelector('.institution-image');
      if (institutionImage) {
        institutionImage.src = institution.image || '/assets/images/placeholder-institution.jpg';
        institutionImage.alt = institution.name;
        institutionImage.onerror = function() {
          this.src = '/assets/images/placeholder-institution.jpg';
        };
      }

      const elements = {
        '.institution-name': institution.name,
        '.institution-type': institution.type,
        '.institution-location': institution.location,
        '.author-count': institution.authorCount.toString(),
        '.paper-count': institution.paperCount.toString(),
        '.main-fields': institution.mainFields
      };

      Object.entries(elements).forEach(([selector, value]) => {
        const element = popup.querySelector(selector);
        if (element) element.textContent = value;
      });
      
      const viewButton = popup.querySelector('.view-details-btn');
      if (viewButton) {
        viewButton.href = institution.website || '#';
        if (institution.website && institution.website !== '#') {
          viewButton.target = '_blank';
        }
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
      const count = filteredInstitutions.length;
      countDisplay.textContent = `Showing ${count} institution${count !== 1 ? 's' : ''}`;
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
    
    .custom-marker.institution {
      background-color: #e74c3c;
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