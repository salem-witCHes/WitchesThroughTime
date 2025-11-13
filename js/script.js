localStorage.removeItem('hasVisited'); // 🧪 comment this out when you go live

function openCurtains() {
  const forest = document.getElementById('forestContainer');
  const homepage = document.getElementById('homepage-content');
  const gradient = forest.querySelector('.forest-gradient');

  // Add opening class to trigger animations
  forest.classList.add('opening');

  // Fade in gradient
  gradient.style.opacity = '1';
            
  // Fade out forest container and show homepage content
  setTimeout(() => {
    forest.classList.add('hidden');
    homepage.classList.add('visible');
  }, 800);

}

// remember if the user has already seen the opening animation
document.addEventListener('DOMContentLoaded', () => {
  const hasVisited = localStorage.getItem('hasVisited');
  const forest = document.getElementById('forestContainer');
  const homepage = document.getElementById('homepage-content');

  if (hasVisited) {
    // Skip animation — hide forest, show homepage
    forest.style.display = 'none';
    homepage.classList.add('visible');
  } else {
    // First visit — show animation
    localStorage.setItem('hasVisited', 'true');
  }
});