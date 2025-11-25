// localStorage.removeItem('hasVisited'); // 🧪 comment this out when you go live

function openCurtains() {
  const forest = document.getElementById('forestContainer');
  const homepage = document.getElementById('homepage-content');
  const gradient = forest.querySelector('.forest-gradient');
  const titleBox = document.getElementById('titleBox');

  // show gradient
  gradient.style.opacity = '1';

  // fade out title box
  titleBox.classList.add('hidden');

  // start forest opening animation
  forest.classList.add('opening');
  document.querySelector('.forest').classList.add('opening');

  setTimeout(() => {
    forest.classList.add('forest-exit-active');

    // wait for opacity transition to finish
    forest.addEventListener('transitionend', () => {
      forest.classList.add('hidden');   // actually hide it
      homepage.classList.add('visible'); // show homepage content
    }, { once: true });
  }, 800); // match tree slide duration (ms)
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