const themeButton = document.querySelector('.theme-toggle');
function syncThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeButton.setAttribute('aria-pressed', String(dark));
}
syncThemeButton();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch (error) { /* Preferences are optional. */ }
  syncThemeButton();
});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();

const journeyStops = {
  boston: { city: 'Boston, MA', category: '01 / Research & foundations', headline: 'Learning robots from the ground up', description: 'Graduate work on LiDAR mapping, point clouds and path planning — building the mobile-robot foundations for everything that followed.', connection: 'Main journey · First stop', photo: 'assets/boston.webp', alt: 'Jinzhou presenting LiDAR mapping research with a mobile robot' },
  pittsburgh: { city: 'Pittsburgh, PA', category: '02 / Software engineering', headline: 'Robotics for joint replacement surgery', description: 'Developing robotic systems at a medical device company, where precision, safety and validation were essential.', connection: 'Main journey · Boston, MA to Pittsburgh, PA', photo: 'assets/surgical.webp', alt: 'Jinzhou in surgical scrubs during medical robotics work' },
  dallas: { city: 'Dallas, TX', category: '03 / Engineering & consulting', headline: 'Autonomous robots for warehouses', description: 'Moving from building systems to designing solutions: scoping industrial automation deployments with operations teams on the floor.', connection: 'Main journey · Pittsburgh, PA to Dallas, TX · Three branches', photo: 'assets/warehouse.webp', alt: 'On-site conversation during a warehouse robotics deployment' },
  'bay-area': { city: 'Bay Area, CA', category: '04 / Solutions architecture', headline: 'Human data & robotic simulation', description: 'Leading complex projects end to end at a startup working on human data and simulation environments for embodied AI.', connection: 'Main journey · Dallas, TX to Bay Area, CA · Branch to Orlando, FL', photo: 'assets/community.webp', alt: 'Jinzhou with the robotics community at an industry event' },
  detroit: { city: 'Detroit, MI', category: 'Branch / United States', headline: 'The journey beyond Dallas, TX', description: 'Detroit, MI is one of the three branches of my journey from Dallas, TX.', connection: 'Branch · Dallas, TX to Detroit, MI' },
  columbia: { city: 'Columbia, MO', category: 'Branch / United States', headline: 'The journey beyond Dallas, TX', description: 'Columbia, MO is one of the three branches of my journey from Dallas, TX.', connection: 'Branch · Dallas, TX to Columbia, MO' },
  orlando: { city: 'Orlando, FL', category: 'Branch / United States', headline: 'The journey beyond the Bay Area, CA', description: 'My journey branches from the Bay Area, CA to Orlando, FL.', connection: 'Branch · Bay Area, CA to Orlando, FL' },
  'sao-paulo': { city: 'São Paulo, SP', category: 'Branch / Brazil', headline: 'A connection beyond the United States', description: 'The journey branches from Dallas, TX to São Paulo, SP. This stop appears in the separate South America inset.', connection: 'International branch · Dallas, TX to São Paulo, SP' }
};
const journeyKeys = Object.keys(journeyStops);
let selectedJourneyKey = 'boston';
const journeyControls = document.querySelectorAll('[data-stop]');
function selectJourneyStop(key) {
  const stop = journeyStops[key];
  if (!stop) return;
  const changed = selectedJourneyKey !== key;
  selectedJourneyKey = key;
  journeyControls.forEach(control => {
    const selected = control.dataset.stop === key;
    control.classList.toggle('is-selected', selected);
    control.setAttribute('aria-pressed', String(selected));
  });
  ['city', 'category', 'headline', 'description', 'connection'].forEach(field => {
    document.querySelector(`#journey-${field}`).textContent = stop[field];
  });
  const photo = document.querySelector('#journey-photo');
  photo.hidden = !stop.photo;
  document.querySelector('#journey-photo-placeholder').hidden = Boolean(stop.photo);
  document.querySelector('#journey-placeholder-city').textContent = stop.city;
  document.querySelector('#journey-position').textContent = `${String(journeyKeys.indexOf(key) + 1).padStart(2, '0')} / ${String(journeyKeys.length).padStart(2, '0')}`;
  if (stop.photo) { photo.src = stop.photo; photo.alt = stop.alt; }
  syncJourneyPlayback();
  if (changed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const detail = document.querySelector('.journey-detail');
    detail.getAnimations().forEach(animation => animation.cancel());
    detail.animate([{ opacity: .4, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
  }
}
journeyControls.forEach(control => {
  control.addEventListener('click', () => selectJourneyStop(control.dataset.stop));
  if (control.matches('.map-stop')) {
    control.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectJourneyStop(control.dataset.stop);
      }
    });
  }
});

function stepJourney(direction) {
  const index = (journeyKeys.indexOf(selectedJourneyKey) + direction + journeyKeys.length) % journeyKeys.length;
  selectJourneyStop(journeyKeys[index]);
}
document.querySelector('#journey-prev').addEventListener('click', () => stepJourney(-1));
document.querySelector('#journey-next').addEventListener('click', () => stepJourney(1));

// Keep map selection and photo playback on a single clock.
const journeyExplorer = document.querySelector('.journey-explorer');
const journeyPlayButton = document.querySelector('#journey-play');
const journeyMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let journeyAutoplay = !journeyMotionPreference.matches;
let journeyHovered = false;
let journeyFocused = false;
let journeyVisible = false;
let journeyTimer;
function syncJourneyPlayback() {
  clearTimeout(journeyTimer);
  const playing = journeyAutoplay && journeyVisible && !journeyHovered && !journeyFocused && !document.hidden;
  journeyPlayButton.textContent = journeyAutoplay ? 'Ⅱ Pause' : '▶ Play';
  journeyPlayButton.setAttribute('aria-label', journeyAutoplay ? 'Pause automatic journey playback' : 'Resume automatic journey playback');
  document.querySelector('.journey-detail').setAttribute('aria-live', playing ? 'off' : 'polite');
  if (playing) journeyTimer = setTimeout(() => stepJourney(1), 3000);
}
journeyPlayButton.addEventListener('click', () => {
  journeyAutoplay = !journeyAutoplay;
  syncJourneyPlayback();
});
journeyExplorer.addEventListener('pointerenter', event => {
  if (event.pointerType === 'touch') return;
  journeyHovered = true;
  syncJourneyPlayback();
});
journeyExplorer.addEventListener('pointerleave', () => {
  journeyHovered = false;
  syncJourneyPlayback();
});
function syncJourneyFocus() {
  journeyFocused = journeyExplorer.contains(document.activeElement) && document.activeElement !== journeyPlayButton;
  syncJourneyPlayback();
}
journeyExplorer.addEventListener('focusin', syncJourneyFocus);
journeyExplorer.addEventListener('focusout', () => queueMicrotask(syncJourneyFocus));
document.addEventListener('visibilitychange', syncJourneyPlayback);
journeyMotionPreference.addEventListener('change', event => {
  if (event.matches) journeyAutoplay = false;
  syncJourneyPlayback();
});
new IntersectionObserver(entries => {
  journeyVisible = entries[0].isIntersecting;
  syncJourneyPlayback();
}, { threshold: 0.2 }).observe(journeyExplorer);
syncJourneyPlayback();
