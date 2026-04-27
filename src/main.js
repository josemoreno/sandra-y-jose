import './style.css';

/* ================================================
   NAVBAR — scroll effect + mobile toggle
   ================================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ================================================
   COUNTDOWN — 31 October 2026, 13:00 local (Canarias = UTC+0)
   ================================================ */
const WEDDING_DATE = new Date('2026-10-31T13:00:00+00:00');

const cdDays  = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins  = document.getElementById('cd-mins');
const cdSecs  = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now  = Date.now();
  const diff = WEDDING_DATE.getTime() - now;

  if (diff <= 0) {
    cdDays.textContent  = '00';
    cdHours.textContent = '00';
    cdMins.textContent  = '00';
    cdSecs.textContent  = '00';
    return;
  }

  const totalSecs   = Math.floor(diff / 1000);
  const days        = Math.floor(totalSecs / 86400);
  const hours       = Math.floor((totalSecs % 86400) / 3600);
  const mins        = Math.floor((totalSecs % 3600) / 60);
  const secs        = totalSecs % 60;

  cdDays.textContent  = pad(days);
  cdHours.textContent = pad(hours);
  cdMins.textContent  = pad(mins);
  cdSecs.textContent  = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ================================================
   CAROUSEL
   ================================================ */
const track     = document.getElementById('carouselTrack');
const dotsWrap  = document.getElementById('carouselDots');
const prevBtn   = document.getElementById('carouselPrev');
const nextBtn   = document.getElementById('carouselNext');
const slides    = track ? Array.from(track.children) : [];

let current   = 0;
let autoTimer = null;

function buildDots() {
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Foto ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  });
}

function updateDots() {
  dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function goTo(index) {
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  updateDots();
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 4500);
}
function stopAuto() {
  clearInterval(autoTimer);
}

if (slides.length > 0) {
  buildDots();
  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      stopAuto();
      goTo(dx < 0 ? current + 1 : current - 1);
      startAuto();
    }
  });

  startAuto();
}

/* ================================================
   SCROLL REVEAL
   ================================================ */
function addReveal() {
  const targets = document.querySelectorAll(
    '.fl-card, .bus-card, .tl-item, .venue-img-wrap, .map-wrap, .section-title, .section-tag, .section-intro, .bus-note'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}

addReveal();

/* ================================================
   RSVP FORM
   ================================================ */
const form        = document.getElementById('rsvpForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Simple validation
    const nombre    = form.nombre.value.trim();
    const email     = form.email.value.trim();
    const asistencia = form.asistencia.value;

    if (!nombre || !email || !asistencia) {
      shakeForm();
      return;
    }

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Simulate async submission (replace with real endpoint if needed)
    await new Promise(r => setTimeout(r, 1000));

    form.querySelectorAll('input, select, textarea, button').forEach(el => {
      el.style.display = 'none';
    });
    formSuccess.classList.add('visible');

    console.log('RSVP data:', Object.fromEntries(new FormData(form)));
  });
}

function shakeForm() {
  submitBtn.style.animation = 'none';
  submitBtn.offsetHeight; // reflow
  submitBtn.style.animation = 'shake .4s ease';
  submitBtn.textContent = '¡Rellena los campos obligatorios!';
  setTimeout(() => {
    submitBtn.textContent = 'Confirmar asistencia 💌';
  }, 2200);
}

// Extra shake keyframes injected for the button
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);
