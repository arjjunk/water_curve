const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 18);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
reveals.forEach(item => item.style.setProperty('--delay', `${item.dataset.delay || 0}ms`));
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(item => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  reveals.forEach(item => observer.observe(item));
}

const stage = document.querySelector('.showcase-stage');
const stageImage = document.querySelector('#showcase-image');
const stageNumber = document.querySelector('#stage-number');
const stageKicker = document.querySelector('#stage-kicker');
const stageTitle = document.querySelector('#stage-title');
const stageCopy = document.querySelector('#stage-copy');
const tabs = document.querySelectorAll('.showcase-tab');

function selectShowcase(tab) {
  if (tab.classList.contains('active')) return;
  tabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  stage.classList.add('switching');
  const preload = new Image();
  preload.src = tab.dataset.image;
  preload.onload = () => {
    window.setTimeout(() => {
      stageImage.src = tab.dataset.image;
      stageImage.alt = tab.dataset.alt;
      stageNumber.textContent = tab.dataset.number;
      stageKicker.textContent = tab.dataset.kicker;
      stageTitle.textContent = tab.dataset.title;
      stageCopy.textContent = tab.dataset.copy;
      stage.classList.remove('switching');
    }, reducedMotion ? 0 : 160);
  };
}
tabs.forEach(tab => tab.addEventListener('click', () => selectShowcase(tab)));

const palette = document.querySelector('#palette-demo');
const swatches = document.querySelectorAll('.swatch');
swatches.forEach(swatch => swatch.addEventListener('click', () => {
  swatches.forEach(item => item.classList.toggle('active', item === swatch));
  palette.style.setProperty('--palette-deep', swatch.dataset.deep);
  palette.style.setProperty('--palette-mid', swatch.dataset.mid);
  palette.style.setProperty('--palette-bright', swatch.dataset.bright);
}));

// Subtle parallax is intentionally limited to pointer devices.
if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const heroVisual = document.querySelector('.hero-visual');
  const frame = document.querySelector('.hero-frame');
  heroVisual?.addEventListener('pointermove', event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    frame.style.transform = `perspective(1000px) rotateY(${x * 2.2}deg) rotateX(${-y * 2.2}deg)`;
  });
  heroVisual?.addEventListener('pointerleave', () => {
    frame.style.transform = '';
  });
}
