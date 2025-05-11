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
