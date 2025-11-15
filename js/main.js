
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
  const savedTheme = localStorage.getItem("selectedTheme");
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
      localStorage.setItem("selectedTheme", theme);
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
      localStorage.removeItem("selectedTheme");

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


