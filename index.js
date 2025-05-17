document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
    navToggle.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('active');
  });

  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  });

  
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

 
  window.openModal = function(title, desc) {
    const modal = document.getElementById('barangayModal');
    document.getElementById('barangayTitle').textContent = title;
    document.getElementById('barangayDesc').textContent = desc;
    modal.style.display = 'flex';
  };

  window.closeModal = function() {
    const modal = document.getElementById('barangayModal');
    modal.style.display = 'none';
  };

 
  document.getElementById('barangayModal').addEventListener('click', (e) => {
    if (e.target.id === 'barangayModal') {
      window.closeModal();
    }
  });
});
