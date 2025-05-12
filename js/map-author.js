/**
 * Author Map Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  const checkMapContainer = setInterval(() => {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      clearInterval(checkMapContainer);
      initializeAuthorMap();
    }
  }, 100);

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

  function initializeAuthorMap() {
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
  }

  function setupFilters() {
    const filterToggle = document.getElementById('filterToggle');
    const filterContent = document.getElementById('filterContent');
    const researchFieldFilter = document.getElementById('researchField');
    const hIndexRange = document.getElementById('hIndexRange');
    const hIndexValue = document.getElementById('hIndexValue');
    const cityFilter = document.getElementById('cityFilter');

    // Toggle filter panel
    filterToggle.addEventListener('click', () => {
      filterContent.classList.toggle('active');
    });

    // Research field filter
    researchFieldFilter.addEventListener('change', applyFilters);

    // H-index range filter
    hIndexRange.addEventListener('input', function() {
      hIndexValue.textContent = this.value;
      applyFilters();
    });

    // City filter
    cityFilter.addEventListener('change', applyFilters);

    // Close filter panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.map-filter-panel')) {
        filterContent.classList.remove('active');
      }
    });
  }

  function applyFilters() {
    const fieldFilter = document.getElementById('researchField').value;
    const hIndexFilter = parseInt(document.getElementById('hIndexRange').value);
    const cityFilter = document.getElementById('cityFilter').value;

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
    const searchQuery = document.getElementById('mapSearch').value.trim().toLowerCase();
    
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

    // Add click and hover events
    marker.on('click', function() {
      this.openPopup();
    });

    marker.on('mouseover', function() {
      this.getElement().style.transform = 'scale(1.2)';
      // Show mini preview
      const preview = createAuthorPreview(author);
      showPreview(preview, this.getElement());
    });

    marker.on('mouseout', function() {
      this.getElement().style.transform = 'scale(1)';
      hidePreview();
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
    const popup = template.cloneNode(true);
    popup.style.display = 'block';

    // Fill in the content
    popup.querySelector('.author-name').textContent = author.name;
    popup.querySelector('.author-affiliation').textContent = author.affiliation;
    popup.querySelector('.author-h-index').textContent = author.hIndex;
    popup.querySelector('.author-papers').textContent = author.paperCount;
    popup.querySelector('.author-fields').textContent = author.fields;
    popup.querySelector('.author-institution').textContent = author.institution;
    
    const viewButton = popup.querySelector('.view-details-btn');
    viewButton.href = author.profile || '#';

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

  function showPreview(content, element) {
    const preview = document.createElement('div');
    preview.className = 'map-preview';
    preview.innerHTML = content;
    preview.style.cssText = `
      position: absolute;
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2000;
      font-size: 14px;
      max-width: 200px;
      pointer-events: none;
    `;

    document.body.appendChild(preview);

    // Position the preview near the marker
    const rect = element.getBoundingClientRect();
    preview.style.left = (rect.left + rect.width + 10) + 'px';
    preview.style.top = (rect.top - preview.offsetHeight / 2) + 'px';
  }

  function hidePreview() {
    const preview = document.querySelector('.map-preview');
    if (preview) {
      preview.remove();
    }
  }

  function updateCounter() {
    const countDisplay = document.getElementById('countDisplay');
    const count = filteredAuthors.length;
    countDisplay.textContent = `Showing ${count} author${count !== 1 ? 's' : ''}`;
  }

  function highlightMarker(marker) {
    const element = marker.getElement();
    element.style.transform = 'scale(1.3)';
    element.style.animation = 'pulse 2s infinite';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
      element.style.animation = '';
    }, 3000);
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
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  function addMapAnimations() {
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
  `;
  document.head.appendChild(style);
});