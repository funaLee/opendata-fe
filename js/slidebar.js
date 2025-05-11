document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const overlay = document.getElementById('overlay');

  // Toggle sidebar
  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }

  function closeSidebarFunc() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  menuToggle.addEventListener('click', openSidebar);
  closeSidebar.addEventListener('click', closeSidebarFunc);
  overlay.addEventListener('click', closeSidebarFunc);

  // Accordion toggle
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
});
