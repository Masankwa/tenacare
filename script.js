/* ==================================================
   script.js – Clean & Stable Interaction Layer
   For TenaCare Support Services
================================================== */

/* ---------------------------
   Utilities
---------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------------------------
   Smooth scrolling for anchors
---------------------------- */
function smoothScrollTo(hash) {
  const target = document.querySelector(hash);
  if (!target) return;

  const headerOffset = 72;
  const y =
    target.getBoundingClientRect().top +
    window.pageYOffset -
    headerOffset;

  window.scrollTo({ top: y, behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const hash = link.getAttribute('href');
  if (hash.length <= 1) return;

  e.preventDefault();
  smoothScrollTo(hash);
  closeMobileNav();
});

/* ---------------------------
   Sticky header on scroll
---------------------------- */
const header = $('#header');

function handleHeaderScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

/* ---------------------------
   Mobile hamburger navigation
---------------------------- */
const hamburger = $('#hamburger');
const navLinks = $('#nav-links');

function openMobileNav() {
  navLinks.classList.add('open');
  navLinks.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMobileNav() {
  navLinks.classList.remove('open');
  navLinks.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    isOpen ? closeMobileNav() : openMobileNav();
  });
}

// Close menu with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

/* ---------------------------
   Reveal on scroll (IntersectionObserver)
---------------------------- */
const revealItems = $$('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealItems.forEach(el => revealObserver.observe(el));
}

/* ---------------------------
   Scroll-to-top button
---------------------------- */
const scrollTopBtn = $('#scroll-top');

function toggleScrollTop() {
  if (!scrollTopBtn) return;
  scrollTopBtn.classList.toggle('show', window.scrollY > 420);
}

window.addEventListener('scroll', toggleScrollTop, { passive: true });
toggleScrollTop();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------
   Contact form (client-side demo)
---------------------------- */
const contactForm = $('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const email = contactForm.querySelector('input[name="email"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();

    // Clear previous notice (if any)
    const existingNotice = document.querySelector('.form-notice');
    if (existingNotice) existingNotice.remove();

    if (!name || !email || !message) {
      showFormNotice('Please fill out all fields.', 'error');
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      showFormNotice('Please enter a valid email address.', 'error');
      return;
    }

    // Success message
    showFormNotice(
      'Thank you — your message has been sent.',
      'success'
    );

    contactForm.reset();
  });
}
function showFormNotice(message, type) {
  let notice = $('.form-notice');

  if (!notice) {
    notice = document.createElement('div');
    notice.className = 'form-notice';
    notice.style.marginTop = '12px';
    notice.style.fontSize = '0.95rem';
    $('.contact')?.appendChild(notice);
  }

  notice.textContent = message;
  notice.style.color =
    type === 'error'
      ? '#c0392b'
      : type === 'success'
      ? '#0b6b3a'
      : '#333';
}

/* ---------------------------
   Accessibility helpers
---------------------------- */
function detectKeyboardUse(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', detectKeyboardUse);
  }
}

window.addEventListener('keydown', detectKeyboardUse);

/* ---------------------------
   Initial setup
---------------------------- */
window.addEventListener('load', () => {
  navLinks?.setAttribute('aria-hidden', 'true');
  hamburger?.setAttribute('aria-expanded', 'false');
});
const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      // Close other open items
      faqItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });