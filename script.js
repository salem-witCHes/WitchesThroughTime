function openCurtains() {
  const forest = document.getElementById('forestContainer');
  const homepage = document.getElementById('homepage-content');
  const gradient = forest.querySelector('.forest-gradient');

  // Add opening class to trigger animations
  forestContainer.classList.add('opening');

  // Fade in gradient
  gradient.style.opacity = '1';
            
  // Fade out forest container and show homepage content
  setTimeout(() => {
    forest.classList.add('hidden');
    homepage.classList.add('visible');
  }, 2500);

}
