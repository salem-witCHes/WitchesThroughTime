
// JS for themes switcher 

document.addEventListener("DOMContentLoaded", function () {
  const layoutButton = document.getElementById("layoutButton");
  const layoutOptions = document.getElementById("layoutOptions");
  const dropdownOverlay = document.getElementById("dropdownOverlay");
  const triggers = document.querySelectorAll(".trigger-style");

  // Create and append the theme <link> to head (ready to load CSS files)
  let themeLink = document.getElementById("themeStylesheet")
  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.id = "themeStylesheet";
    document.head.appendChild(themeLink);
  }

// Update active state 
  function updateActiveTheme(themeName) {
    triggers.forEach(t => {
      if (t.dataset.theme === themeName) {
        t.classList.add('active-theme');
      } else {
        t.classList.remove('active-theme');
      }
    });
  }

  // Open/close dropdown
  function setOpen(open) {
    layoutOptions.classList.toggle("active", open);
    dropdownOverlay.classList.toggle("active", open); // Toggle overlay
    layoutButton.setAttribute("aria-expanded", String(!!open));

    // Prevent body scroll when dropdown is open
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Load saved theme if available
  const savedTheme = sessionStorage.getItem("selectedTheme");
  if (savedTheme) {
    themeLink.href = `css/${savedTheme}.css`;
    updateActiveTheme(savedTheme);
  } 
  // If no saved theme, do nothing - main.css is already loaded by default


  // Toggle dropdown visibility (click on the svg area to ride the function inside)
  layoutButton.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!layoutOptions.classList.contains("active"));
  });

  // Allow keyboard toggle (Enter / Space) -> Accessibility
  layoutButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!layoutOptions.classList.contains("active"));
    }
  });

  // Theme selection - read data-theme attribute (must be set in HTML)
  triggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();  // Prevents closing the drowpdown immediately
      const theme = trigger.dataset.theme;
      if (!theme) return;

      // Prevent reloading same theme
      if (themeLink.href.endsWith(`${theme}.css`)) {
        setOpen(false);
        return;
      }

      // Load new theme
      themeLink.href = `css/${theme}.css`;
      sessionStorage.setItem("selectedTheme", theme);
      updateActiveTheme(theme);
      setOpen(false);  // Close the dropdown after selecting a theme

      console.log(`Theme switched to: ${theme}`);
    });

    // keyboard support for theme items
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  // Reset to default theme button
  const resetButton = document.getElementById("resetTheme");
  if (resetButton) {
    resetButton.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // Remove the theme stylesheet entirely to go back to main.css
      if (themeLink && themeLink.parentNode) {
        themeLink.href = ""; // Clear the href to unload the theme CSS
        // OR you can remove it completely:
        // themeLink.parentNode.removeChild(themeLink);
      }
    
      // Remove saved theme from localStorage
      sessionStorage.removeItem("selectedTheme");

      // Clear active state from all themese 
      updateActiveTheme(null);
      
      // Close dropdown
      setOpen(false);
      
      console.log("Reset to default theme (main.css)");
    });

  // Keyboard support for reset button
  resetButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      resetButton.click();
    }
  });
}

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!layoutButton.contains(e.target) && !layoutOptions.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close when clicking on overlay
  dropdownOverlay.addEventListener("click", () => {
    setOpen(false);
  });

  // Optional: close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  });
});

// Toggle switcher JS
document.addEventListener("DOMContentLoaded", () => {
  const knob = document.querySelector(".toggle-knob");
  const labelChrono = document.getElementById("labelChrono");
  const labelEras = document.getElementById("labelEras");
  const togglePill = document.querySelector(".toggle-pill");
  const activeIcon = document.getElementById("toggleIcon");
  const inactiveIcon = document.getElementById("inactiveIcon");

  // Image paths
  const chronoActive = "img/chronological-active.svg";
  const chronoInactive = "img/chronological-inactive.svg";
  const erasActive = "img/eras-active.svg";
  const erasInactive = "img/eras-inactive.svg";

  const pillPadding = 4; // matches CSS padding of .toggle-pill

  // Smooth transition setup
  knob.style.transition = "left 0.3s ease";
  inactiveIcon.style.transition = "left 0.3s ease";

  function activateChrono() {
    const pillWidth = togglePill.offsetWidth;
    const knobWidth = knob.offsetWidth;

    knob.style.left = pillPadding + "px";
    activeIcon.src = chronoActive;
    inactiveIcon.src = erasInactive;
    inactiveIcon.style.left = (pillWidth - knobWidth - pillPadding) + "px";

    labelChrono.classList.add("active-text");
    labelEras.classList.remove("active-text");

    if (!window.location.href.includes("chronological.html")) {
      window.location.href = "chronological.html";
    }
  }

  function activateEras() {
    const pillWidth = togglePill.offsetWidth;
    const knobWidth = knob.offsetWidth;

    knob.style.left = (pillWidth - knobWidth - pillPadding) + "px";
    activeIcon.src = erasActive;
    inactiveIcon.src = chronoInactive;
    inactiveIcon.style.left = pillPadding + "px";

    labelChrono.classList.remove("active-text");
    labelEras.classList.add("active-text");

    if (!window.location.href.includes("eras.html")) {
      window.location.href = "eras.html";
    }
  }

  // Click events
  labelChrono.addEventListener("click", activateChrono);
  labelEras.addEventListener("click", activateEras);
  togglePill.addEventListener("click", () => {
    if (labelChrono.classList.contains("active-text")) activateEras();
    else activateChrono();
  });

  // Set initial position
  if (labelChrono.classList.contains("active-text")) activateChrono();
  else activateEras();

  // --- Redirect navbar Exhibition link to chronological ---
  const exhibitionLink = document.querySelector(".nav-link.active");
  if (exhibitionLink) {
    exhibitionLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "chronological.html";
    });
  }
});


