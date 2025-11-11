// document.addEventListener("DOMContentLoaded", function() {
//     const layoutButton = document.getElementById("layoutButton");
//     const layoutOptions = document.getElementById("layoutOptions");
//     const triggers = document.querySelectorAll(".trigger-style");

//     // Create a <link> element for the active theme
//     const themeLink = document.createElement("link");
//     themeLink.rel = "stylesheet";
//     themeLink.id = "themeStylesheet";
//     document.head.appendChild(themeLink);

//     // Helper: open/close
//     function setOpen(open) {
//         layoutOptions.classList.toggle("active", open);
//         layoutButton.setAttribute("aria-expanded", String(!!open));
//     }

//     layoutButton.addEventListener("click", () => {
//         layoutOptions.classList.toggle("active");
//     })

//     // Close the drowpdown if you click outside it
//     document.addEventListener("click", (e) => {
//     if (!layoutButton.contains(e.target) && !layoutOptions.contains(e.target)) {
//         layoutOptions.classList.remove("active");
//         }
//     })

//     // Load saved theme if available
//   const savedTheme = localStorage.getItem("selectedTheme");
//   if (savedTheme) {
//     themeLink.href = `css/${savedTheme}.css`;
//   }

//   // Toggle dropdown visibility
//   layoutButton.addEventListener("click", () => {
//     layoutOptions.classList.toggle("active");
//   });

//   // Theme selection
//   triggers.forEach(trigger => {
//     trigger.addEventListener("click", () => {
//       const theme = trigger.dataset.theme;
//       themeLink.href = `css/${theme}.css`;
//       localStorage.setItem("selectedTheme", theme);
//       layoutOptions.classList.remove("active");
//     });
//   });

//   // Close when clicking outside
//   document.addEventListener("click", (e) => {
//     if (!layoutButton.contains(e.target) && !layoutOptions.contains(e.target)) {
//       layoutOptions.classList.remove("active");
//     }
//   });
// });


document.addEventListener("DOMContentLoaded", function () {
  const layoutButton = document.getElementById("layoutButton");
  const layoutOptions = document.getElementById("layoutOptions");
  const triggers = document.querySelectorAll(".trigger-style");

  // Create and append the theme <link> to head (so loading href applies)
  let themeLink = document.getElementById("themeStylesheet")
  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.id = "themeStylesheet";
    document.head.appendChild(themeLink);
  }

  // Helper: open/close dropdown
  function setOpen(open) {
    layoutOptions.classList.toggle("active", open);
    layoutButton.setAttribute("aria-expanded", String(!!open));
  }

  // Load saved theme if available
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    themeLink.href = `css/${savedTheme}.css`;
  } else {
    // Set default theme if none saved
    const defaultTheme = triggers[0]?.dataset.theme;
    if (defaultTheme) {
        themeLink.href = `css/${defaultTheme}.css`;
        updateActiveTheme(defaultTheme);
    }
  }

  // Toggle dropdown visibility (click on the svg area)
  layoutButton.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!layoutOptions.classList.contains("active"));
  });

  // Allow keyboard toggle (Enter / Space)
  layoutButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!layoutOptions.classList.contains("active"));
    }
  });

  // Theme selection - read data-theme attribute (must be set in HTML)
  triggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
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
      setOpen(false);

      console.log("Theme switched to: ${theme}");
    });

    // keyboard support for theme items
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!layoutButton.contains(e.target) && !layoutOptions.contains(e.target)) {
      setOpen(false);
    }
  });

  // Optional: close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  });
});


