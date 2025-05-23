// Constants
const SELECTORS = {
  NAV_TOGGLE: '.nav-toggle',
  MAIN_NAV: '.main-nav',
  NAV_LINKS: '.nav-link',
  MAIN_HEADER: '#main-header',
  BARANGAY_MODAL: '#barangayModal',
  MESSAGE_FORM: '#messageForm'
};

const CLASSES = {
  ACTIVE: 'active',
  SCROLLED: 'scrolled'
};

// Utility functions
const trapFocus = (modal, firstFocusable, lastFocusable) => (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
  if (e.key === 'Escape') {
    window.closeModal();
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Modal management
class ModalManager {
  constructor() {
    this.modal = document.querySelector(SELECTORS.BARANGAY_MODAL);
    this.trapFocusHandler = null;
    this.setupModalEvents();
  }

  setupModalEvents() {
    this.modal.addEventListener('click', (e) => {
      if (e.target.id === 'barangayModal') {
        this.closeModal();
      }
    });
  }

  openModal(title, desc) {
    const titleEl = document.getElementById('barangayTitle');
    const descEl = document.getElementById('barangayDesc');
    
    titleEl.textContent = title;
    descEl.textContent = desc;
    this.modal.style.display = 'flex';

    const focusableElements = this.modal.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    this.trapFocusHandler = trapFocus(this.modal, firstFocusable, lastFocusable);
    this.modal.addEventListener('keydown', this.trapFocusHandler);
    firstFocusable.focus();
  }

  closeModal() {
    this.modal.style.display = 'none';
    if (this.trapFocusHandler) {
      this.modal.removeEventListener('keydown', this.trapFocusHandler);
      this.trapFocusHandler = null;
    }
  }
}

// Navigation management
class NavigationManager {
  constructor() {
    this.navToggle = document.querySelector(SELECTORS.NAV_TOGGLE);
    this.nav = document.querySelector(SELECTORS.MAIN_NAV);
    this.header = document.querySelector(SELECTORS.MAIN_HEADER);
    this.setupNavEvents();
  }

  setupNavEvents() {
    // Toggle navigation
    this.navToggle.addEventListener('click', () => this.toggleNav());
    this.navToggle.addEventListener('keydown', (e) => this.handleNavKeypress(e));

    // Handle nav link clicks
    document.querySelectorAll(SELECTORS.NAV_LINKS).forEach(link => {
      link.addEventListener('click', () => this.closeNav());
    });

    // Scroll handling
    window.addEventListener('scroll', () => this.handleScroll());

    // Smooth scroll for anchor links
    this.setupSmoothScroll();
  }

  toggleNav() {
    const expanded = this.navToggle.getAttribute('aria-expanded') === 'true';
    this.navToggle.setAttribute('aria-expanded', !expanded);
    this.nav.classList.toggle(CLASSES.ACTIVE);
  }

  handleNavKeypress(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleNav();
    }
  }

  closeNav() {
    if (this.nav.classList.contains(CLASSES.ACTIVE)) {
      this.nav.classList.remove(CLASSES.ACTIVE);
      this.navToggle.setAttribute('aria-expanded', false);
    }
  }

  handleScroll() {
    window.requestAnimationFrame(() => {
      this.header.classList.toggle(CLASSES.SCROLLED, window.scrollY > 50);
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Form management
class FormManager {
  constructor() {
    this.form = document.querySelector(SELECTORS.MESSAGE_FORM);
    if (this.form) {
      this.setupFormEvents();
    }
  }

  setupFormEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = this.getFormData();

    if (!this.validateForm(formData)) {
      return;
    }

    this.submitForm(formData);
  }

  getFormData() {
    return {
      name: this.form.name.value.trim(),
      email: this.form.email.value.trim(),
      subject: this.form.subject.value.trim(),
      message: this.form.message.value.trim()
    };
  }

  validateForm(data) {
    if (!Object.values(data).every(Boolean)) {
      alert('Please fill in all fields.');
      return false;
    }

    if (!validateEmail(data.email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    return true;
  }

  submitForm(data) {
    // Here you would typically send the data to a server
    // For now, we'll just show a success message
    alert('Thank you for your message! We will get back to you soon.');
    this.form.reset();
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const modalManager = new ModalManager();
  const navigationManager = new NavigationManager();
  const formManager = new FormManager();

  // Expose necessary functions to window
  window.openModal = (title, desc) => modalManager.openModal(title, desc);
  window.closeModal = () => modalManager.closeModal();

  // Add click event listeners to news and barangay cards to open modal with content
  const newsCards = document.querySelectorAll('.news-card');
  const barangayCards = document.querySelectorAll('.barangay-card');

  function getCardContent(card) {
    const titleEl = card.querySelector('h3');
    const descEl = card.querySelector('p');
    const title = titleEl ? titleEl.textContent.trim() : 'No Title';
    const desc = descEl ? descEl.textContent.trim() : 'No description available.';
    return { title, desc };
  }

  newsCards.forEach(card => {
    card.addEventListener('click', () => {
      const { title, desc } = getCardContent(card);
      window.openModal(title, desc);
    });
  });

  // Add click event listeners to "Read More" buttons in news cards
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent triggering the card click event
      const card = button.closest('.news-card');
      if (card) {
        const { title, desc } = getCardContent(card);
        window.openModal(title, desc);
      }
    });
  });

  barangayCards.forEach(card => {
    card.addEventListener('click', () => {
      const { title, desc } = getCardContent(card);
      window.openModal(title, desc);
    });
  });
});
