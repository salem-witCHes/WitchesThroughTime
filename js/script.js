// localStorage.removeItem('hasVisited'); // 🧪 comment this out when you go live


// ---- OPENING PAGE ----

function openCurtains() {
  const forest = document.getElementById('forestContainer');
  const gradient = forest.querySelector('.forest-gradient');
  const titleBox = document.getElementById('titleBox');
  const elementsToReveal = document.querySelectorAll('.content-to-reveal');

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
      forest.classList.add('hidden');
      elementsToReveal.forEach(element => {
                element.classList.add('visible');
            });
    }, { once: true });
  }, 800);

  localStorage.setItem('hasVisited', 'true');
}

// remember if the user has already seen the opening animation
document.addEventListener('DOMContentLoaded', () => {
  const hasVisited = localStorage.getItem('hasVisited');
  const forest = document.getElementById('forestContainer');
  const elementsToReveal = document.querySelectorAll('.content-to-reveal');

  if (hasVisited) {
    forest.style.display = 'none';
    elementsToReveal.forEach(element => {
        // temporarily disable the transition so it appears instantly
        element.style.transition = 'none'; 
        element.classList.add('visible');
        
        // We force a "reflow" so the browser accepts the change, then restore transition
        void element.offsetWidth; 
        element.style.transition = ''; 
    });
  } 
});

// --- ITEM PAGE ---

document.addEventListener('DOMContentLoaded', () => {
    // variables to hold information
    let allItems = {};      // store the dictionary of all items from the json file
    let narratives = {};
    let roomsData = {}; 
    let roomKeys = [];  

    // Navigation State
    let currentIdList = [];     // currently active narrative
    let currentIndex = 0;
    let currentNarrativeName = '';  // remember the narrative mode
    
    // Filters
    let currentLength = 'short';
    let currentTone = 'educational-adult';

    // INITIALIZATION
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allItems = data.items;
            
            // Setup Narratives
            narratives['chronological'] = data.narratives.chronological;
            
            roomsData = data.narratives.eras; 
            roomKeys = Object.keys(roomsData); 
            narratives['eras'] = [];
            roomKeys.forEach(key => {
                narratives['eras'].push(...roomsData[key]);
            });

            // Read URL parameters
            const urlParams = new URLSearchParams(window.location.search);  // this reads the address bar
            const targetId = urlParams.get('id');
            const targetNarrative = urlParams.get('narrative');

            // if URL has ID, load that; if not, load default Chronological start.
            if (targetId && allItems[targetId]) {
                // If the URL specifies a narrative use it. otherwise default to chronological.
                const startNarrative = targetNarrative || 'chronological';
                switchNarrative(startNarrative, targetId);
            } else {
                // No ID in URL? Start at the beginning of Chronological
                switchNarrative('chronological', narratives['chronological'][0]);
            }
        })
        .catch(error => console.error("Error loading JSON:", error));


    // --- CORE: SWITCH NARRATIVE ---
    function switchNarrative(name, targetItemId = null) {
        // Safety check: if narrative name is invalid, fallback to chronological
        if (!narratives[name]) name = 'chronological';
        
        currentNarrativeName = name;
        currentIdList = narratives[name];

        if (targetItemId) {
            const newIndex = currentIdList.indexOf(targetItemId);
            // If item is found in this narrative, go to it. Else start at 0.
            currentIndex = (newIndex !== -1) ? newIndex : 0;
        } else {
            currentIndex = 0;
        }

        renderItem();
        updateUIState();
    }


    // RENDER
    // take the data from memory and populate the screen
    function renderItem() {
        const itemId = currentIdList[currentIndex];
        const item = allItems[itemId];
        
        if (!item) return;

        // basic Info
        document.getElementById('item-image-display').src = item.image;
        document.getElementById('item-title').textContent = item.title;

        // metadata table
        const meta = item.metadata || {};
        document.getElementById('item-creator').textContent = Array.isArray(meta.creator) ? meta.creator.join(', ') : meta.creator;
        document.getElementById('item-type').textContent = meta.type;
        document.getElementById('item-location').textContent = meta.location;
        
        // clickable table cells
        const dateCell = document.getElementById('item-date');
        dateCell.textContent = meta.date;
        dateCell.title = "Switch to Chronological Narrative"; 

        const roomCell = document.getElementById('item-room');
        roomCell.textContent = meta.room; 
        roomCell.title = "Switch to Eras Narrative"; 
        
        // update "current room" Label
        document.getElementById('current-room-name').textContent = meta.room;
        
        updateDescriptionText(item); // check the buttons and pick the correct text from the json to display
    }
    
    // UPDATE: .textContent treats <strong> as literal text so it's better to use innerHTML
    function updateDescriptionText(item) { 
    const textKey = `${currentLength}-${currentTone}`;
    const displayPanel = document.getElementById('item-description-display');

    if (item.texts && item.texts[textKey]) {
        // .innerHTML tells the browser to render the <strong> and <br> tags
        displayPanel.innerHTML = item.texts[textKey];
    } else {
        displayPanel.innerHTML = "<em>Description not available.</em>";
    }
}

    // FIND CURRENT ROOM INDEX
    function getCurrentRoomIndex() {
        const currentItemId = currentIdList[currentIndex];
        for (let i = 0; i < roomKeys.length; i++) {
            const roomKey = roomKeys[i];
            if (roomsData[roomKey].includes(currentItemId)) {
                return i;
            }
        }
        return -1;
    }

    // UI FEEDBACK & VISIBILITY
    function updateUIState() {
        const dateCell = document.getElementById('item-date');
        const roomCell = document.getElementById('item-room');
        const roomNavControls = document.getElementById('room-nav-controls');
        
        dateCell.style.fontWeight = (currentNarrativeName === 'chronological') ? 'bold' : 'normal';
        dateCell.style.textDecoration = (currentNarrativeName === 'chronological') ? 'underline' : 'none';
        
        roomCell.style.fontWeight = (currentNarrativeName === 'eras') ? 'bold' : 'normal';
        roomCell.style.textDecoration = (currentNarrativeName === 'eras') ? 'underline' : 'none';

        if (currentNarrativeName === 'eras') {
            roomNavControls.classList.remove('d-none'); 
        } else {
            roomNavControls.classList.add('d-none');    
        }
    }

    // EVENT LISTENERS -> connect the click to the functions
    document.getElementById('item-date').addEventListener('click', () => {
        if (currentNarrativeName !== 'chronological') {
            switchNarrative('chronological', currentIdList[currentIndex]);
        }
    });

    document.getElementById('item-room').addEventListener('click', () => {
        if (currentNarrativeName !== 'eras') {
            switchNarrative('eras', currentIdList[currentIndex]);
        }
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        if (currentIndex < currentIdList.length - 1) {
            currentIndex++;
            renderItem();
        }
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            renderItem();
        }
    });

    // Room Jump Buttons
    const roomControlsDiv = document.getElementById('room-nav-controls');
    const roomButtons = roomControlsDiv.querySelectorAll('button');
    const prevRoomBtn = roomButtons[0];
    const nextRoomBtn = roomButtons[1];

    if (nextRoomBtn) {
        nextRoomBtn.addEventListener('click', () => {
            const currentRoomIdx = getCurrentRoomIndex();
            if (currentRoomIdx < roomKeys.length - 1) {
                const nextRoomKey = roomKeys[currentRoomIdx + 1];
                const firstItemOfNextRoom = roomsData[nextRoomKey][0];
                
                const newIndex = currentIdList.indexOf(firstItemOfNextRoom);
                if (newIndex !== -1) {
                    currentIndex = newIndex;
                    renderItem();
                }
            }
        });
    }

    if (prevRoomBtn) {
        prevRoomBtn.addEventListener('click', () => {
            const currentRoomIdx = getCurrentRoomIndex();
            if (currentRoomIdx > 0) {
                const prevRoomKey = roomKeys[currentRoomIdx - 1];
                const firstItemOfPrevRoom = roomsData[prevRoomKey][0];
                
                const newIndex = currentIdList.indexOf(firstItemOfPrevRoom);
                if (newIndex !== -1) {
                    currentIndex = newIndex;
                    renderItem();
                }
            }
        });
    }

    // text filters
    const lengthBtns = document.querySelectorAll('#length-buttons button');
    lengthBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            lengthBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentLength = e.target.getAttribute('data-length');
            renderItem();
        });
    });

    const toneBtns = document.querySelectorAll('#tone-buttons button');
    toneBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toneBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTone = e.target.getAttribute('data-tone');
            renderItem();
        });
    });


    var imageModal = document.getElementById('imageModal');
    
    if (imageModal) { // check if modal exists to avoid errors on other pages
        imageModal.addEventListener('show.bs.modal', function (event) {
            // Button/Link that triggered the modal
            var triggerLink = event.relatedTarget;

            // extract the link and image source
            var destinationUrl = triggerLink.getAttribute('data-bs-link');
            var imageSource = triggerLink.querySelector('img').getAttribute('src');

            // find the elements inside the modal
            var modalLink = imageModal.querySelector('#modal-link-display');
            var modalImage = imageModal.querySelector('#modal-image-display');

            // update the modal content
            if (modalLink) modalLink.href = destinationUrl;
            if (modalImage) modalImage.src = imageSource;
        });
    }
});