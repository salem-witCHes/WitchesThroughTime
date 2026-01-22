
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



// --- Map: rooms' descriptions 
// JavaScript object to hold the descriptions for all rooms
const roomData = {
    'first-room': {
        title: "Mythic roots",
        link: "item_page.html?id=hecate&narrative=eras",
        description: `
        <p>Before the witch was feared, she was <strong>revered</strong>.</p> 
        
        <p>This room explores the earliest representation of witch-like figures, rooted in <strong>myth, legend and pagan rituals</strong>. 
        Here, the witch appears as a healer, a priestess, a goddess or a mediator between the human and natural worlds. These figures were often associated with 
        fertility, cycles of life and death, herbal medicine and spiritual wisdom. In ancient societies, magic was not something to be feared. It was considered 
        <strong>complementary to faith and daily life</strong>, with practitioners enjoying respect for their wisdom and power. <i>Mythic roots</i> invites visitors to encounter the witch 
        not as a transgressor, but as a foundational cultural figure.</p>
        `,
    },
    'second-room': {
        title: "Fires of fear",
        link: "item_page.html?id=waldensian-witches&narrative=eras",
        description: `
        <p>When knowledge became a <strong>crime</strong>.</p> 

        <p>This room confronts the historical reality of <strong>witch hunts, accusations and trials</strong>. Through documents, testimonies and visual records, 
        Fires of fear examines how the figure of the witch was transformed into a legal and <strong>moral enemy</strong>, particularly during the late Middle Ages 
        and early modern period. With the rise of Christianity, practices once embedded in pagan traditions were increasingly denounced as heretical, 
        marking the beginning of an era in which magic became a crime.</p> 

        <p>Here, witchcraft emerges as a tool of <strong>social control</strong>: accusations were often directed at women whose knowledge, independence or marginality 
        threatened established power structures. Torture, execution and public punishment turned fear into spectacle, reinforcing patriarchal and religious authority.</p> 

        <p>This room reveals how persecution was not driven by superstition alone, but by deeply embedded systems of power and how its consequences still resonate today.</p> 
        `,
    },
    'third-room': {
        title: "Visions and shadows",
        link: "item_page.html?id=three-witches&narrative=eras",
        description: `
        <p>Between <strong>fear</strong> and <strong>fascination</strong>.</p> 

        <p>In this room, the witch enters the realm of representation. <strong>Literature, film and visual art</strong> reimagine her as a figure of ambiguity: 
        monstrous, seductive, comic and powerful. From fairy tales to pop culture, the witch becomes a mirror reflecting society’s anxieties and desires.</p> 

        <p><i>Visions and Shadows</i> explores how these images both perpetuate and complicate <strong>stereotypes</strong>. The witch is no longer executed, yet she is reframed and 
        aestheticized through the gaze of others, appearing as a figure of fascination, fear or spectacle. This section invites visitors to question how 
        representation shapes perception and how cultural imagery can both obscure and reveal deeper truths.</p> 
        `,
    }, 
    'fourth-room': {
        title: "Reclaiming the spell",
        link: "item_page.html?id=anna-goldi&narrative=eras",
        description: `
        <p><strong>Witches are back.</strong></p>

        <p>The final room focuses on contemporary reappropriations of the witch as a <strong>symbol of resistance, identity and empowerment</strong>. 
        From the rehabilitation of Anna Göldin to feminist movements of the 20th century and present-day self-identified witches, the term once used to 
        persecute women is reclaimed by women as a declaration of power and autonomy.</p> 

        <p>Here, the witch becomes <strong>political</strong>. She embodies refusal, self-definition and collective memory, but also vulnerability, 
        as persecution has not disappeared in all parts of the world. <i>Reclaiming the spell</i> connects past and present, revealing how the logic of witch hunts 
        still operates, even as new forms of resistance emerge.</p>

        <p>This room invites visitors to reflect on the present moment: if witches were once burned, today they may instead be silenced, displaced and forgotten. 
        It calls on visitors not to forget the past, and to recognize and challenge the ongoing continuity of <strong>women’s suppression</strong>.</p>

        `,
    }
};

let introHTML = ""; // Variable to store original HTML with intro text

// Function to change dynamically rooms' descriptions 
function showRoomDescription(roomId) {
    const panel = document.getElementById('room-description-panel')

    // MANAGE ACTIVE CLASS
    // First, remove "active" from every possible room
    const allRoomIds = ['entrance-room', 'first-room', 'second-room', 'third-room', 'fourth-room'];
    allRoomIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
        }
    });

    // Then, add "active" to the room that was just clicked
    const currentRoom = document.getElementById(roomId);
    if (currentRoom) {
        currentRoom.classList.add('active');
    }

    // 1. Check if the user clicked the entrance 
    if (roomId === 'entrance-room') {
        panel.innerHTML = introHTML; // Restore intro text
        return;
    }
    // 2. Get the data for the specific room ID
    const room = roomData[roomId];
    
    if (!room) {
        // Handle case where room ID is not found 
        panel.innerHTML = "<h2>Error: Room Not Found</h2><p>Please click a valid room on the map.</p>";
        return;
    }

    // 3. Build the new HTML content
    const newHTML = `
        <h2 class="room-title">${room.title}</h2>
        <p class="room-description">${room.description}</p>
        <div class="text-center mt-4">
          <a href="${room.link}" id="explore-room-btn" class="btn btn-sm btn-outline-dark custom-room-btn">
            Explore Room Items 
          </a>
        </div>
    `;

    // 4. Inject the new HTML into the target div
    // We use .innerHTML to completely replace the existing content.
    panel.innerHTML = newHTML;
}

// Attach Event Listeners on Load
document.addEventListener('DOMContentLoaded', () => {
    // Save the initial content before any clicks happen
    const panel = document.getElementById('room-description-panel');
    introHTML = panel.innerHTML;

    // Define a list of ALL interactive room IDs
    const roomIds = [
        'entrance-room',
        'first-room', 
        'second-room', 
        'third-room', 
        'fourth-room'
    ];

    // Loop through the list to attach listeners to all rooms
    roomIds.forEach(roomId => {
        const roomElement = document.getElementById(roomId);

        // Check if the element was successfully found
        if (roomElement) {
            roomElement.addEventListener('click', function() {
                // 'this.id' is the ID of the path that was clicked
                showRoomDescription(this.id);
                console.log("Clicked:", this.id);
            });
        } else {
            console.warn(`Warning: SVG element with ID '${roomId}' not found in the DOM.`);
        }
    });
});



