document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll('[data-include]');

  const loadIncludes = Array.from(includes).map(el => {
    const file = el.getAttribute("data-include");
    return fetch(file)
      .then(res => res.text())
      .then(data => { el.innerHTML = data; });
  });

  // Khi tất cả component đã được load
  Promise.all(loadIncludes).then(() => {
    initSidebar(); // gọi hàm khởi tạo sidebar
  });
});

function initSidebar() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const overlay = document.getElementById('overlay');
  const accordions = document.querySelectorAll('.accordion');

  if (!menuToggle || !sidebar || !closeSidebar) return;

  menuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

function waitForComponent(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
}

// Usage:
waitForComponent('#uploadDatasetForm')
  .then(form => {
    // Initialize form
  })
  .catch(error => {
    console.error('Form not loaded:', error);
  });