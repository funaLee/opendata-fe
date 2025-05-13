/**
 * Research Groups Page JavaScript
 * Handles group management, searching, filtering, and creation
 */

class ResearchGroupsPage {
  constructor() {
    this.currentCategory = 'all';
    this.researchAreas = [];
    this.init();
  }
  
  init() {
    this.initEventListeners();
    this.initAnimations();
    this.setupCategoryFilters();
    this.setupSearchFunctionality();
    this.setupModalHandlers();
    this.loadGroups();
  }
  
  // Initialize event listeners
  initEventListeners() {
    // Action buttons
    document.getElementById('createGroupBtn').addEventListener('click', () => {
      this.openCreateGroupModal();
    });
    
    document.getElementById('joinGroupBtn').addEventListener('click', () => {
      this.showNotification('Join existing group feature coming soon!', 'info');
    });
    
    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreGroups();
      });
    }
    
    // Group interactions
    this.setupGroupInteractions();
  }
  
  // Setup category filters
  setupCategoryFilters() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        // Remove active class from all filters
        categoryFilters.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        filter.classList.add('active');
        
        // Get category from data attribute
        this.currentCategory = filter.getAttribute('data-category');
        
        // Filter groups
        this.filterGroups();
      });
    });
  }
  
  // Setup search functionality
  setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-icon');
    
    // Search on input
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(searchInput.value);
      }, 300);
    });
    
    // Search on icon click
    searchIcon.addEventListener('click', () => {
      this.performSearch(searchInput.value);
    });
  }
  
  // Perform search
  performSearch(query) {
    const groups = document.querySelectorAll('.group-card');
    const searchQuery = query.toLowerCase().trim();
    
    groups.forEach(group => {
      const groupName = group.querySelector('.group-name').textContent.toLowerCase();
      const groupDescription = group.querySelector('.group-description')?.textContent.toLowerCase() || '';
      const groupTags = Array.from(group.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
      
      const matches = !searchQuery || 
        groupName.includes(searchQuery) || 
        groupDescription.includes(searchQuery) ||
        groupTags.some(tag => tag.includes(searchQuery));
      
      if (matches) {
        group.style.display = 'block';
        group.style.opacity = '1';
      } else {
        group.style.opacity = '0';
        setTimeout(() => {
          group.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // Filter groups by category
  filterGroups() {
    const groups = document.querySelectorAll('.group-card[data-category]');
    
    groups.forEach(group => {
      const groupCategory = group.getAttribute('data-category');
      const shouldShow = this.currentCategory === 'all' || groupCategory === this.currentCategory;
      
      if (shouldShow) {
        group.style.display = 'block';
        setTimeout(() => {
          group.style.opacity = '1';
          group.style.transform = 'translateY(0)';
        }, 10);
      } else {
        group.style.opacity = '0';
        group.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          group.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // Setup modal handlers
  setupModalHandlers() {
    const modal = document.getElementById('createGroupModal');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.getElementById('createGroupForm');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
      this.closeCreateGroupModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeCreateGroupModal();
      }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleGroupCreation();
    });
    
    // Setup research areas tags input
    this.setupTagsInput();
  }
  
  // Setup tags input for research areas
  setupTagsInput() {
    const tagsInput = document.getElementById('groupResearchAreas');
    const tagsList = document.getElementById('researchAreasList');
    
    tagsInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const tagValue = tagsInput.value.trim();
        
        if (tagValue && !this.researchAreas.includes(tagValue)) {
          this.addResearchAreaTag(tagValue, tagsList);
          tagsInput.value = '';
        }
      }
    });
  }
  
  // Add research area tag
  addResearchAreaTag(tagValue, container) {
    this.researchAreas.push(tagValue);
    
    const tagElement = document.createElement('div');
    tagElement.className = 'research-area-tag';
    tagElement.innerHTML = `
      <span>${tagValue}</span>
      <button type="button" class="remove-tag" data-tag="${tagValue}">×</button>
    `;
    
    container.appendChild(tagElement);
    
    // Add remove functionality
    tagElement.querySelector('.remove-tag').addEventListener('click', () => {
      this.removeResearchAreaTag(tagValue, tagElement);
    });
  }
  
  // Remove research area tag
  removeResearchAreaTag(tagValue, element) {
    this.researchAreas = this.researchAreas.filter(area => area !== tagValue);
    element.remove();
  }
  
  // Open create group modal
  openCreateGroupModal() {
    const modal = document.getElementById('createGroupModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on name input
    setTimeout(() => {
      document.getElementById('groupName').focus();
    }, 100);
  }
  
  // Close create group modal
  closeCreateGroupModal() {
    const modal = document.getElementById('createGroupModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form and research areas
    document.getElementById('createGroupForm').reset();
    this.researchAreas = [];
    document.getElementById('researchAreasList').innerHTML = '';
  }
  
  // Handle group creation
  handleGroupCreation() {
    const formData = new FormData(document.getElementById('createGroupForm'));
    const groupData = {
      name: formData.get('groupName'),
      type: formData.get('groupType'),
      location: formData.get('groupLocation'),
      description: formData.get('groupDescription'),
      website: formData.get('groupWebsite'),
      researchAreas: this.researchAreas,
      logo: formData.get('groupLogo')
    };
    
    // Validate required fields
    if (!groupData.name || !groupData.type || !groupData.description) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Create new group element
      this.createNewGroup(groupData);
      
      // Close modal
      this.closeCreateGroupModal();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      this.showNotification('Research group created successfully!', 'success');
      
      // Scroll to top to see new group
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  }
  
  // Create new group element
  createNewGroup(groupData) {
    const groupsGrid = document.querySelector('.groups-grid');
    const groupElement = document.createElement('div');
    groupElement.className = 'group-card';
    groupElement.setAttribute('data-category', groupData.type);
    
    const typeText = this.getTypeText(groupData.type);
    
    groupElement.innerHTML = `
      <div class="group-image">
        <img src="/api/placeholder/200/150" alt="${groupData.name}">
      </div>
      <div class="group-info">
        <h3 class="group-name">${groupData.name}</h3>
        <div class="group-type">${typeText}</div>
        ${groupData.location ? `
          <div class="group-location">
            <i class="fas fa-map-marker-alt"></i>
            ${groupData.location}
          </div>
        ` : ''}
        <div class="group-members">
          <i class="fas fa-users"></i>
          1 member
        </div>
        <div class="group-tags">
          ${groupData.researchAreas.map(area => `<span class="tag">${area}</span>`).join('')}
        </div>
        <div class="group-actions">
          <button class="join-btn-small">Join</button>
          <button class="view-btn">View</button>
        </div>
      </div>
    `;
    
    // Add animation
    groupElement.style.opacity = '0';
    groupElement.style.transform = 'translateY(-20px)';
    
    // Insert at the beginning
    groupsGrid.insertBefore(groupElement, groupsGrid.firstChild);
    
    // Animate in
    setTimeout(() => {
      groupElement.style.transition = 'all 0.5s ease';
      groupElement.style.opacity = '1';
      groupElement.style.transform = 'translateY(0)';
    }, 100);
    
    // Setup interactions for new group
    this.setupGroupInteractions(groupElement);
  }
  
  // Get type text for display
  getTypeText(type) {
    const typeMap = {
      'university': 'University Lab',
      'research-lab': 'Research Laboratory',
      'company': 'Industry Lab',
      'non-profit': 'Non-Profit',
      'government': 'Government'
    };
    return typeMap[type] || type;
  }
  
  // Setup group interactions
  setupGroupInteractions(group = null) {
    const groups = group ? [group] : document.querySelectorAll('.group-card');
    
    groups.forEach(groupElement => {
      // Join button interaction
      const joinBtns = groupElement.querySelectorAll('.join-btn, .join-btn-small');
      joinBtns.forEach(joinBtn => {
        if (!joinBtn.classList.contains('join-setup')) {
          joinBtn.classList.add('join-setup');
          joinBtn.addEventListener('click', () => {
            this.toggleJoinGroup(joinBtn, groupElement);
          });
        }
      });
      
      // Follow button interaction
      const followBtns = groupElement.querySelectorAll('.follow-btn');
      followBtns.forEach(followBtn => {
        if (!followBtn.classList.contains('follow-setup')) {
          followBtn.classList.add('follow-setup');
          followBtn.addEventListener('click', () => {
            this.toggleFollowGroup(followBtn, groupElement);
          });
        }
      });
      
      // View button interaction
      const viewBtns = groupElement.querySelectorAll('.view-btn');
      viewBtns.forEach(viewBtn => {
        if (!viewBtn.classList.contains('view-setup')) {
          viewBtn.classList.add('view-setup');
          viewBtn.addEventListener('click', () => {
            this.viewGroupDetails(groupElement);
          });
        }
      });
    });
  }
  
  // Toggle join group
  toggleJoinGroup(joinBtn, groupElement) {
    const groupName = groupElement.querySelector('.group-name').textContent;
    
    if (joinBtn.classList.contains('joined')) {
      // Leave group
      joinBtn.classList.remove('joined');
      joinBtn.innerHTML = '<i class="fas fa-user-plus"></i> Join' + (joinBtn.classList.contains('join-btn') ? ' Group' : '');
      joinBtn.style.background = '';
      joinBtn.style.color = '';
      this.showNotification(`Left group: ${groupName}`, 'info');
    } else {
      // Join group
      joinBtn.classList.add('joined');
      joinBtn.innerHTML = '<i class="fas fa-check"></i> Joined';
      joinBtn.style.background = '#4caf50';
      joinBtn.style.color = 'white';
      this.showNotification(`Joined group: ${groupName}`, 'success');
    }
  }
  
  // Toggle follow group
  toggleFollowGroup(followBtn, groupElement) {
    const groupName = groupElement.querySelector('.group-name').textContent;
    
    if (followBtn.classList.contains('following')) {
      // Unfollow
      followBtn.classList.remove('following');
      followBtn.innerHTML = '<i class="fas fa-star"></i> Follow';
      followBtn.style.background = '';
      followBtn.style.color = '';
      this.showNotification(`Unfollowed: ${groupName}`, 'info');
    } else {
      // Follow
      followBtn.classList.add('following');
      followBtn.innerHTML = '<i class="fas fa-star"></i> Following';
      followBtn.style.background = '#2196f3';
      followBtn.style.color = 'white';
      this.showNotification(`Following: ${groupName}`, 'success');
    }
  }
  
  // View group details
  viewGroupDetails(groupElement) {
    const groupName = groupElement.querySelector('.group-name').textContent;
    this.showNotification(`Viewing details for: ${groupName} - Feature coming soon!`, 'info');
  }
  
  // Load more groups
  loadMoreGroups() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn.innerHTML;
    
    // Show loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more groups
    setTimeout(() => {
      this.addSampleGroups();
      
      // Reset button
      loadMoreBtn.innerHTML = originalText;
      loadMoreBtn.disabled = false;
    }, 1000);
  }
  
  // Add sample groups
  addSampleGroups() {
    const sampleGroups = [
      {
        category: 'universities',
        name: 'UIT AI Research Lab',
        type: 'University Lab',
        location: 'Ho Chi Minh City, Vietnam',
        members: 234,
        tags: ['AI', 'Machine Learning']
      },
      {
        category: 'companies',
        name: 'Grab AI Lab',
        type: 'Industry Lab',
        location: 'Singapore',
        members: 567,
        tags: ['AI Applications', 'Transportation']
      },
      {
        category: 'research-labs',
        name: 'MICA Lab',
        type: 'Research Laboratory',
        location: 'Hanoi, Vietnam',
        members: 123,
        tags: ['Computer Vision', 'Robotics']
      }
    ];
    
    const groupsGrid = document.querySelector('.groups-grid');
    const loadMoreSection = document.querySelector('.load-more-section');
    
    sampleGroups.forEach((groupData, index) => {
      const groupElement = this.createSampleGroup(groupData);
      
      // Add animation with delay
      groupElement.style.opacity = '0';
      groupElement.style.transform = 'translateY(20px)';
      
      groupsGrid.insertBefore(groupElement, loadMoreSection);
      
      setTimeout(() => {
        groupElement.style.transition = 'all 0.5s ease';
        groupElement.style.opacity = '1';
        groupElement.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }
  
  // Create sample group element
  createSampleGroup(groupData) {
    const groupElement = document.createElement('div');
    groupElement.className = 'group-card';
    groupElement.setAttribute('data-category', groupData.category);
    
    groupElement.innerHTML = `
      <div class="group-image">
        <img src="/api/placeholder/200/150" alt="${groupData.name}">
      </div>
      <div class="group-info">
        <h3 class="group-name">${groupData.name}</h3>
        <div class="group-type">${groupData.type}</div>
        <div class="group-location">
          <i class="fas fa-map-marker-alt"></i>
          ${groupData.location}
        </div>
        <div class="group-members">
          <i class="fas fa-users"></i>
          ${groupData.members} members
        </div>
        <div class="group-tags">
          ${groupData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="group-actions">
          <button class="join-btn-small">Join</button>
          <button class="view-btn">View</button>
        </div>
      </div>
    `;
    
    this.setupGroupInteractions(groupElement);
    return groupElement;
  }
  
  // Initialize animations
  initAnimations() {
    // Animate group cards on scroll
    this.setupScrollAnimations();
  }
  
  // Setup scroll animations
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.group-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      observer.observe(card);
    });
  }
  
  // Show notification
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
      'success': 'fas fa-check-circle',
      'error': 'fas fa-exclamation-circle',
      'info': 'fas fa-info-circle',
      'warning': 'fas fa-exclamation-triangle'
    }[type] || 'fas fa-info-circle';
    
    notification.innerHTML = `
      <div class="notification-content">
        <i class="${icon}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideInRight 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 400px;
    `;
    
    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }
  
  // Load groups (placeholder for API integration)
  loadGroups() {
    // This would normally fetch groups from an API
    console.log('Loading research groups...');
  }
}

// Initialize research groups page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ResearchGroupsPage();
  
  // Add global close function for modal
  window.closeCreateGroupModal = function() {
    const modal = document.getElementById('createGroupModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('createGroupForm').reset();
  };
  
  // Add required CSS for tags input and animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { 
        opacity: 0; 
        transform: translateX(100%); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    
    @keyframes slideOutRight {
      from { 
        opacity: 1; 
        transform: translateX(0); 
      }
      to { 
        opacity: 0; 
        transform: translateX(100%); 
      }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .tags-input {
      border: 1px solid #dfe1f5;
      border-radius: 8px;
      padding: 10px;
      background: white;
    }
    
    .tags-input input {
      border: none !important;
      outline: none !important;
      width: 100%;
      padding: 5px 0;
    }
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }
    
    .research-area-tag {
      background: var(--primary-light);
      color: var(--primary-color);
      padding: 4px 8px;
      border-radius: 15px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .remove-tag {
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 16px;
      cursor: pointer;
      padding: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.3s ease;
    }
    
    .remove-tag:hover {
      background: rgba(90, 107, 255, 0.2);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.3s ease;
    }
    
    .notification-close:hover {
      background: rgba(255,255,255,0.2);
    }
  `;
  document.head.appendChild(style);
});

// Export for global access
window.ResearchGroupsPage = ResearchGroupsPage;