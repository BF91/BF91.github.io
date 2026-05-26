      const hamburger = document.getElementById('hamburger');
      const sidebar   = document.getElementById('sidebar');
      const overlay   = document.getElementById('sidebar-overlay');
 
      function openSidebar() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
 
        function closeSidebar() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
 
        hamburger.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
 
overlay.addEventListener('click', closeSidebar);

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    backToTopButton.classList.remove('hidden');
  } else {
    backToTopButton.classList.add('hidden');
  }
});