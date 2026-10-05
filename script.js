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
  boston: { city: 'Boston', category: '01 / Research & foundations', headline: 'Learning robots from the ground up', description: 'Graduate work on LiDAR mapping, point clouds and path planning — building the mobile-robot foundations for everything that followed.', connection: 'Main journey · First stop', photo: 'assets/boston.webp', alt: 'Jinzhou presenting LiDAR mapping research with a mobile robot' },
  pittsburgh: { city: 'Pittsburgh', category: '02 / Software engineering', headline: 'Robotics for joint replacement surgery', description: 'Developing robotic systems at a medical device company, where precision, safety and validation were essential.', connection: 'Main journey · Boston to Pittsburgh', photo: 'assets/surgical.webp', alt: 'Jinzhou in surgical scrubs during medical robotics work' },
  dallas: { city: 'Dallas', category: '03 / Engineering & consulting', headline: 'Autonomous robots for warehouses', description: 'Moving from building systems to designing solutions: scoping industrial automation deployments with operations teams on the floor.', connection: 'Main journey · Pittsburgh to Dallas · Three branches', photo: 'assets/warehouse.webp', alt: 'On-site conversation during a warehouse robotics deployment' },
  'bay-area': { city: 'San Francisco Bay Area', category: '04 / Solutions architecture', headline: 'Human data & robotic simulation', description: 'Leading complex projects end to end at a startup working on human data and simulation environments for embodied AI.', connection: 'Main journey · Dallas to Bay Area', photo: 'assets/community.webp', alt: 'Jinzhou with the robotics community at an industry event' },
  detroit: { city: 'Detroit, Michigan', category: 'Branch / United States', headline: 'The journey beyond Dallas', description: 'Detroit is one of the three branches of my journey from Dallas.', connection: 'Branch · Dallas to Detroit' },
  columbia: { city: 'Columbia, Missouri', category: 'Branch / United States', headline: 'The journey beyond Dallas', description: 'Columbia, Missouri is one of the three branches of my journey from Dallas.', connection: 'Branch · Dallas to Columbia, MO' },
  'sao-paulo': { city: 'São Paulo, Brazil', category: 'Branch / South America', headline: 'A connection beyond the United States', description: 'The journey branches from Dallas to São Paulo, Brazil. This stop appears in the separate South America inset.', connection: 'International branch · Dallas to São Paulo' }
};
const journeyControls = document.querySelectorAll('[data-stop]');
function selectJourneyStop(key) {
  const stop = journeyStops[key];
  if (!stop) return;
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
  document.querySelector('.journey-detail').classList.toggle('without-photo', !stop.photo);
  if (stop.photo) { photo.src = stop.photo; photo.alt = stop.alt; }
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
