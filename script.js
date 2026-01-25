/* script.js
   Modern interaction layer for the Lined Up Support Services one-page site.
   - Smooth scrolling
   - Sticky header effect
   - Mobile hamburger menu (accessible)
   - IntersectionObserver reveal-on-scroll
   - Scroll-to-top button
   - Simple contact form validation (demo)
   - Tiny auto-carousel support
   - Animated counters
*/

/* ---------------------------
   Utilities
----------------------------*/
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------------------------
   Smooth scrolling for anchors
----------------------------*/
function smoothScrollTo(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const yOffset = 72; // header offset (adjust if header height changes)
  const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href.length > 1) {
    e.preventDefault();
    smoothScrollTo(href);
    // close mobile nav if open
    closeMobileNav();
  }
});

/* ---------------------------
   Sticky header on scroll
----------------------------*/
const header = document.getElementById('header');
function onScrollHeader() {
  const add = window.scrollY > 10;
  header.classList.toggle('scrolled', add);
}
window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

/* ---------------------------
   Mobile hamburger & nav toggling
----------------------------*/
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function openMobileNav() {
  navLinks.style.display = 'flex';
  navLinks.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  // small delay to allow transition (if styled)
  setTimeout(() => navLinks.classList.add('open'), 20);
}

function closeMobileNav() {
  navLinks.classList.remove('open');
  navLinks.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  // hide after transition
  setTimeout(() => {
    if (!navLinks.classList.contains('open')) navLinks.style.display = '';
  }, 300);
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  if (isOpen) closeMobileNav();
  else openMobileNav();
});

// Close mobile nav on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// Close mobile nav on link click handled by smooth scroll above

/* ---------------------------
   Reveal on scroll - IntersectionObserver
----------------------------*/
const revealEls = $$('.reveal');
const revealOptions = {
  root: null,
  rootMargin: '0px 0px -8% 0px',
  threshold: 0.12
};

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    }
  });
}, revealOptions);

revealEls.forEach(el => revealObserver.observe(el));

/* ---------------------------
   Scroll-to-top button
----------------------------*/
const scrollTopBtn = document.getElementById('scroll-top');
function checkScrollTopBtn() {
  if (!scrollTopBtn) return;
  if (window.scrollY > 420) scrollTopBtn.style.display = 'block';
  else scrollTopBtn.style.display = 'none';
}
window.addEventListener('scroll', checkScrollTopBtn, { passive: true });
checkScrollTopBtn();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------
   Simple contact form demo
   (Replace with real backend when ready)
----------------------------*/
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = contactForm.querySelector('input[type="text"]')?.value?.trim() ?? '';
    const email = contactForm.querySelector('input[type="email"]')?.value?.trim() ?? '';
    const message = contactForm.querySelector('textarea')?.value?.trim() ?? '';

    if (!name || !email || !message) {
      showFormNotice('Please fill out all fields before sending.', 'error');
      return;
    }

    // Basic email pattern check (non-strict)
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      showFormNotice('Please provide a valid email address.', 'error');
      return;
    }

    // Demo success flow (no real backend)
    showFormNotice('Thanks — your message has been recorded (demo). We will respond soon.', 'success');
    contactForm.reset();
  });
}

function showFormNotice(msg, type = 'info') {
  // Reuse or create a small notice element
  let note = document.querySelector('.form-notice');
  if (!note) {
    note = document.createElement('div');
    note.className = 'form-notice';
    note.style.marginTop = '12px';
    note.style.fontSize = '0.95rem';
    document.querySelector('.contact')?.appendChild(note);
  }
  note.textContent = msg;
  note.style.color = type === 'error' ? '#c0392b' : (type === 'success' ? '#0b6b3a' : '#333');
}

/* ---------------------------
   Tiny auto-carousel support
   (expects: .carousel-track with children)
----------------------------*/
const carousels = $$('.carousel-track');
carousels.forEach(track => {
  const children = Array.from(track.children);
  if (children.length <= 1) return;
  let idx = 0;
  const pad = 16; // spacing in px; adjust if different in CSS
  const step = () => {
    const itemWidth = children[0].offsetWidth + pad;
    idx = (idx + 1) % children.length;
    track.style.transform = `translateX(-${idx * itemWidth}px)`;
    track.style.transition = 'transform 600ms ease';
  };
  // start after a short delay
  setInterval(step, 3500);
});

/* ---------------------------
   Animated numeric counters
   (elements with .count and data-target attribute)
----------------------------*/
function animateCounter(el, end, duration = 900) {
  const start = 0;
  const range = end - start;
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    el.textContent = Math.floor(progress * range + start);
    if (progress < 1) window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
}

const counters = $$('.count');
counters.forEach(c => {
  const t = parseInt(c.dataset.target, 10);
  if (!isNaN(t)) {
    // animate when visible
    const cObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(c, t, 1100);
          obs.unobserve(c);
        }
      });
    }, { threshold: 0.4 });
    cObs.observe(c);
  }
});

/* ---------------------------
   Accessibility: focus outlines for keyboard users only
----------------------------*/
function handleFirstTab(e) {
  if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  window.removeEventListener('keydown', handleFirstTab);
}
window.addEventListener('keydown', handleFirstTab);

/* ---------------------------
   On-load: small setup
----------------------------*/
window.addEventListener('load', () => {
  // create aria attributes for nav
  if (navLinks) {
    navLinks.setAttribute('aria-hidden', 'true');
    navLinks.setAttribute('role', 'menu');
  }
  if (hamburger) {
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('aria-controls', 'nav-links');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});
