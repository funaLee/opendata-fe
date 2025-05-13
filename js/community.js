/**
 * Community Page JavaScript
 * Handles forum functionality, post creation, filtering, and interactions
 */

class CommunityPage {
  constructor() {
    this.currentCategory = 'all';
    this.currentFilter = 'all';
    this.init();
  }
  
  init() {
    this.initEventListeners();
    this.initAnimations();
    this.loadPosts();
    this.setupCategoryTabs();
    this.setupFilterHandlers();
    this.setupModalHandlers();
  }
  
  // Initialize event listeners
  initEventListeners() {
    // Quick action buttons
    document.getElementById('createPostBtn').addEventListener('click', () => {
      this.openCreatePostModal();
    });
    
    document.getElementById('askQuestionBtn').addEventListener('click', () => {
      this.openCreatePostModal('question');
    });
    
    document.getElementById('findCollaboratorsBtn').addEventListener('click', () => {
      this.openCreatePostModal('collaboration');
    });
    
    document.getElementById('shareResourceBtn').addEventListener('click', () => {
      this.openCreatePostModal('resource');
    });
    
    // Load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMorePosts();
      });
    }
    
    // Post interaction buttons
    this.setupPostInteractions();
  }
  
  // Setup category tabs
  setupCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Get category from data attribute
        this.currentCategory = tab.getAttribute('data-category');
        
        // Filter posts based on category
        this.filterPosts();
      });
    });
  }
  
  // Setup filter handlers
  setupFilterHandlers() {
    const filterItems = document.querySelectorAll('.filter-item');
    
    filterItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove active class from all filters
        filterItems.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked filter
        item.classList.add('active');
        
        // Get filter value
        this.currentFilter = item.querySelector('.filter-label').textContent.toLowerCase().replace(' ', '-');
        
        // Apply filter
        this.filterPosts();
      });
    });
  }
  
  // Filter posts based on category and current filter
  filterPosts() {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
      const postBadges = post.querySelectorAll('.badge');
      let showPost = true;
      
      // Check category filter
      if (this.currentCategory !== 'all') {
        showPost = false;
        postBadges.forEach(badge => {
          if (badge.classList.contains(this.currentCategory) || 
              (this.currentCategory === 'discussions' && badge.classList.contains('discussion')) ||
              (this.currentCategory === 'questions' && badge.classList.contains('question')) ||
              (this.currentCategory === 'collaborations' && badge.classList.contains('collaboration')) ||
              (this.currentCategory === 'announcements' && badge.classList.contains('announcement')) ||
              (this.currentCategory === 'resources' && badge.classList.contains('resource'))) {
            showPost = true;
          }
        });
      }
      
      // Check research area filter
      if (this.currentFilter !== 'all' && showPost) {
        const postTags = post.querySelectorAll('.tag-item');
        showPost = false;
        
        postTags.forEach(tag => {
          const tagText = tag.textContent.toLowerCase();
          if (tagText.includes(this.currentFilter.replace('-', ' '))) {
            showPost = true;
          }
        });
      }
      
      // Show/hide post with animation
      if (showPost) {
        post.style.display = 'block';
        setTimeout(() => {
          post.style.opacity = '1';
          post.style.transform = 'translateY(0)';
        }, 10);
      } else {
        post.style.opacity = '0';
        post.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          post.style.display = 'none';
        }, 300);
      }
    });
  }
  
  // Setup modal handlers
  setupModalHandlers() {
    const modal = document.getElementById('createPostModal');
    const closeBtn = document.querySelector('.modal-close');
    const form = document.getElementById('createPostForm');
    
    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
      this.closeCreatePostModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeCreatePostModal();
      }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePostSubmission();
    });
    
    // Auto-resize textarea
    const textarea = document.getElementById('postContent');
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }
  
  // Open create post modal
  openCreatePostModal(type = null) {
    const modal = document.getElementById('createPostModal');
    const postTypeSelect = document.getElementById('postType');
    
    if (type) {
      postTypeSelect.value = type;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on title input
    setTimeout(() => {
      document.getElementById('postTitle').focus();
    }, 100);
  }
  
  // Close create post modal
  closeCreatePostModal() {
    const modal = document.getElementById('createPostModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('createPostForm').reset();
  }
  
  // Handle post submission
  handlePostSubmission() {
    const formData = new FormData(document.getElementById('createPostForm'));
    const postData = {
      type: formData.get('postType'),
      title: formData.get('postTitle'),
      category: formData.get('postCategory'),
      content: formData.get('postContent'),
      tags: formData.get('postTags')?.split(',').map(tag => tag.trim()) || [],
      attachment: formData.get('postAttachment')
    };
    
    // Validate required fields
    if (!postData.title || !postData.content) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Create new post element
      this.createNewPost(postData);
      
      // Close modal
      this.closeCreatePostModal();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Show success notification
      this.showNotification('Post created successfully!', 'success');
      
      // Scroll to top to see new post
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  }
  
  // Create new post element
  createNewPost(postData) {
    const forumPosts = document.querySelector('.forum-posts');
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    
    const badgeClass = postData.type || 'discussion';
    const badgeText = this.getBadgeText(postData.type);
    
    postElement.innerHTML = `
      <div class="post-header">
        <div class="post-badges">
          <span class="badge ${badgeClass}">${badgeText}</span>
          <span class="badge new">NEW</span>
        </div>
        <div class="post-actions">
          <button class="action-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      <div class="post-content">
        <h3 class="post-title">
          <a href="#">${postData.title}</a>
        </h3>
        <div class="post-author">
          <img src="/api/placeholder/32/32" alt="User" class="author-avatar">
          <div class="author-info">
            <span class="author-name">You</span>
            <span class="post-time">Just now</span>
          </div>
        </div>
        <div class="post-excerpt">
          ${postData.content}
        </div>
        <div class="post-tags">
          ${postData.tags.map(tag => `<span class="tag-item">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="post-footer">
        <div class="post-stats">
          <span class="stat-item">
            <i class="fas fa-eye"></i>
            1 view
          </span>
          <span class="stat-item">
            <i class="fas fa-comment"></i>
            0 replies
          </span>
          <span class="stat-item">
            <i class="fas fa-heart"></i>
            0 likes
          </span>
        </div>
        <div class="last-activity">
          Created just now
        </div>
      </div>
    `;
    
    // Add animation
    postElement.style.opacity = '0';
    postElement.style.transform = 'translateY(-20px)';
    
    // Insert at the beginning (after featured posts)
    const featuredPosts = forumPosts.querySelectorAll('.post-card.featured');
    const insertAfter = featuredPosts.length > 0 ? featuredPosts[featuredPosts.length - 1] : null;
    
    if (insertAfter) {
      insertAfter.insertAdjacentElement('afterend', postElement);
    } else {
      forumPosts.insertBefore(postElement, forumPosts.firstChild);
    }
    
    // Animate in
    setTimeout(() => {
      postElement.style.transition = 'all 0.5s ease';
      postElement.style.opacity = '1';
      postElement.style.transform = 'translateY(0)';
    }, 100);
    
    // Setup interactions for new post
    this.setupPostInteractions(postElement);
  }
  
  // Get badge text for post type
  getBadgeText(type) {
    const typeMap = {
      'discussion': 'Thảo luận',
      'question': 'Câu hỏi',
      'collaboration': 'Hợp tác',
      'resource': 'Tài nguyên',
      'announcement': 'Thông báo'
    };
    return typeMap[type] || 'Thảo luận';
  }
  
  // Setup post interactions
  setupPostInteractions(post = null) {
    const posts = post ? [post] : document.querySelectorAll('.post-card');
    
    posts.forEach(postElement => {
      // Like button interaction
      const likeBtn = postElement.querySelector('.stat-item:nth-child(3)');
      if (likeBtn && !likeBtn.classList.contains('liked')) {
        likeBtn.addEventListener('click', () => {
          this.toggleLike(likeBtn);
        });
      }
      
      // Comment button interaction
      const commentBtn = postElement.querySelector('.stat-item:nth-child(2)');
      if (commentBtn && !commentBtn.classList.contains('comment-setup')) {
        commentBtn.classList.add('comment-setup');
        commentBtn.addEventListener('click', () => {
          this.openComments(postElement);
        });
      }
      
      // Post title click
      const postTitle = postElement.querySelector('.post-title a');
      if (postTitle && !postTitle.classList.contains('title-setup')) {
        postTitle.classList.add('title-setup');
        postTitle.addEventListener('click', (e) => {
          e.preventDefault();
          this.openPostDetail(postElement);
        });
      }
    });
  }
  
  // Toggle like functionality
  toggleLike(likeBtn) {
    const icon = likeBtn.querySelector('i');
    const countSpan = likeBtn.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    if (likeBtn.classList.contains('liked')) {
      // Unlike
      icon.classList.remove('fas');
      icon.classList.add('far');
      count--;
      likeBtn.classList.remove('liked');
      likeBtn.style.color = '';
    } else {
      // Like
      icon.classList.remove('far');
      icon.classList.add('fas');
      count++;
      likeBtn.classList.add('liked');
      likeBtn.style.color = '#e91e63';
      
      // Add animation
      icon.style.transform = 'scale(1.2)';
      setTimeout(() => {
        icon.style.transform = '';
      }, 200);
    }
    
    countSpan.textContent = `${count} like${count !== 1 ? 's' : ''}`;
  }
  
  // Open comments (placeholder)
  openComments(postElement) {
    const postTitle = postElement.querySelector('.post-title a').textContent;
    this.showNotification(`Comments for "${postTitle}" - Feature coming soon!`, 'info');
  }
  
  // Open post detail (placeholder)
  openPostDetail(postElement) {
    const postTitle = postElement.querySelector('.post-title a').textContent;
    this.showNotification(`Opening post: "${postTitle}" - Feature coming soon!`, 'info');
  }
  
  // Load more posts
  loadMorePosts() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn.innerHTML;
    
    // Show loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more posts
    setTimeout(() => {
      this.addSamplePosts();
      
      // Reset button
      loadMoreBtn.innerHTML = originalText;
      loadMoreBtn.disabled = false;
    }, 1000);
  }
  
  // Add sample posts (for demonstration)
  addSamplePosts() {
    const samplePosts = [
      {
        type: 'discussion',
        title: 'Neural Architecture Search for Vietnamese NLP Models',
        author: 'Dr. Vu Thi H',
        time: '6 hours ago',
        excerpt: 'Has anyone experimented with NAS techniques specifically for Vietnamese language models?',
        tags: ['NAS', 'Vietnamese', 'NLP', 'Architecture'],
        stats: { views: 234, replies: 8, likes: 15 }
      },
      {
        type: 'question',
        title: 'Best Practices for Handling Imbalanced Datasets in Computer Vision',
        author: 'Student Researcher',
        time: '8 hours ago',
        excerpt: 'I\'m working on a medical imaging project with highly imbalanced classes. What techniques work best?',
        tags: ['Computer Vision', 'Imbalanced Data', 'Medical Imaging'],
        stats: { views: 189, replies: 12, likes: 22 }
      },
      {
        type: 'resource',
        title: 'Free GPU Credits for Academic Research',
        author: 'Research Admin',
        time: '1 day ago',
        excerpt: 'Sharing some platforms that offer free GPU credits for academic research projects...',
        tags: ['GPU', 'Free Resources', 'Academic', 'Research'],
        stats: { views: 567, replies: 24, likes: 89 }
      }
    ];
    
    const forumPosts = document.querySelector('.forum-posts');
    const loadMoreSection = document.querySelector('.load-more-section');
    
    samplePosts.forEach((postData, index) => {
      const postElement = this.createSamplePost(postData);
      
      // Add animation with delay
      postElement.style.opacity = '0';
      postElement.style.transform = 'translateY(20px)';
      
      forumPosts.insertBefore(postElement, loadMoreSection);
      
      setTimeout(() => {
        postElement.style.transition = 'all 0.5s ease';
        postElement.style.opacity = '1';
        postElement.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }
  
  // Create sample post element
  createSamplePost(postData) {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    
    const badgeClass = postData.type;
    const badgeText = this.getBadgeText(postData.type);
    
    postElement.innerHTML = `
      <div class="post-header">
        <div class="post-badges">
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="post-actions">
          <button class="action-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      <div class="post-content">
        <h3 class="post-title">
          <a href="#">${postData.title}</a>
        </h3>
        <div class="post-author">
          <img src="/api/placeholder/32/32" alt="User" class="author-avatar">
          <div class="author-info">
            <span class="author-name">${postData.author}</span>
            <span class="post-time">${postData.time}</span>
          </div>
        </div>
        <div class="post-excerpt">
          ${postData.excerpt}
        </div>
        <div class="post-tags">
          ${postData.tags.map(tag => `<span class="tag-item">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="post-footer">
        <div class="post-stats">
          <span class="stat-item">
            <i class="fas fa-eye"></i>
            ${postData.stats.views} views
          </span>
          <span class="stat-item">
            <i class="fas fa-comment"></i>
            ${postData.stats.replies} replies
          </span>
          <span class="stat-item">
            <i class="far fa-heart"></i>
            ${postData.stats.likes} likes
          </span>
        </div>
        <div class="last-activity">
          Last reply ${postData.time}
        </div>
      </div>
    `;
    
    this.setupPostInteractions(postElement);
    return postElement;
  }
  
  // Initialize animations
  initAnimations() {
    // Animate hero stats
    this.animateCounters();
    
    // Animate post cards on scroll
    this.setupScrollAnimations();
  }
  
  // Animate counter numbers
  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/,/g, ''));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      
      // Start animation when element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(counter);
    });
  }
  
  // Setup scroll animations for post cards
  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.post-card').forEach(card => {
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
  
  // Load posts (placeholder for API integration)
  loadPosts() {
    // This would normally fetch posts from an API
    console.log('Loading posts...');
  }
}

// Initialize community page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CommunityPage();
  
  // Add global close function for modal
  window.closeCreatePostModal = function() {
    const modal = document.getElementById('createPostModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('createPostForm').reset();
  };
  
  // Add required CSS animations
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
window.CommunityPage = CommunityPage;