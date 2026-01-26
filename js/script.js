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
        
        // force a "reflow" so the browser accepts the change, then restore transition
        void element.offsetWidth; 
        element.style.transition = ''; 
    });
  } 
});


// --- ITEM PAGE ---

document.addEventListener('DOMContentLoaded', () => {
    // variables to hold data
    let allItems = {};
    let narratives = {};
    let roomsData = {}; 
    let roomKeys = [];  

    // navigation state
    let currentIdList = [];
    let currentIndex = 0;
    let currentNarrativeName = '';
    
    // filters
    let currentLength = 'short';
    let currentTone = 'educational-adult';

    // load and store json data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allItems = data.items;
            
            // setup narratives
            narratives['chronological'] = data.narratives.chronological;
            
            roomsData = data.narratives.eras; 
            roomKeys = Object.keys(roomsData); 
            narratives['eras'] = [];
            roomKeys.forEach(key => {
                narratives['eras'].push(...roomsData[key]);
            });

            // read URL parameters and decide exactly which item to show
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('id');
            const targetNarrative = urlParams.get('narrative');

            // if URL has id, load that; if not, load default chronological start.
            if (targetId && allItems[targetId]) {
                const startNarrative = targetNarrative || 'chronological';
                switchNarrative(startNarrative, targetId);
            } else {
                switchNarrative('chronological', narratives['chronological'][0]);
            }
        })

        .catch(error => console.error("Error loading JSON:", error));
    
    // --- FUNCTIONS ---
    // switch narrative
    function switchNarrative(name, targetItemId = null) {
        if (!narratives[name]) name = 'chronological';
        
        currentNarrativeName = name;
        currentIdList = narratives[name];

        if (targetItemId) {
            const newIndex = currentIdList.indexOf(targetItemId);
            // if item is found in this narrative, go to it, else start at 0
            currentIndex = (newIndex !== -1) ? newIndex : 0;
        } else {
            currentIndex = 0;
        }

        displayItemDetails();
        updateUIState();
    }


    // render information
    // take the data from memory and populate the screen
    function displayItemDetails() {
        const itemId = currentIdList[currentIndex];
        const item = allItems[itemId];
        
        if (!item) return;

        // basic Info
        document.getElementById('item-image-display').src = item.image;
        document.getElementById('item-title').innerHTML = item.title;

        // metadata table
        const meta = item.metadata || {};
        document.getElementById('item-creator').innerHTML = Array.isArray(meta.creator) ? meta.creator.join(', ') : meta.creator;
        document.getElementById('item-type').innerHTML = meta.type;
        document.getElementById('item-location').innerHTML = meta.location;
        
        // clickable table cells
        const dateCell = document.getElementById('item-date');
        dateCell.innerHTML = meta.date;
        dateCell.title = "Switch to Chronological Narrative"; 

        const roomCell = document.getElementById('item-room');
        roomCell.innerHTML = meta.room; 
        roomCell.title = "Switch to Eras Narrative"; 
        
        // update "current room" Label
        document.getElementById('current-room-name').innerHTML = meta.room;
        
        updateDescriptionText(item);
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

    // find current index room
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

    // UI feedback and visibility
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

    // connect the event click to the functions
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
            displayItemDetails();
        }
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayItemDetails();
        }
    });

    // room jump buttons
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
                    displayItemDetails();
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
                    displayItemDetails();
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
            displayItemDetails();
        });
    });

    const toneBtns = document.querySelectorAll('#tone-buttons button');
    toneBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toneBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentTone = e.target.getAttribute('data-tone');
            displayItemDetails();
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


// ---- THEME 2 CURVED TITLE ----
document.addEventListener("DOMContentLoaded", function() {
    const introTitle = document.querySelector('.introduction-title h1');

    // Only run if the title exists and we haven't already added the curve
    if(introTitle && !introTitle.querySelector('.curved-svg')) {
        const textContent = introTitle.innerText;
        const width = 800;
        const curvePath = `M 0,40 Q 400, 140 800,40`;
        
        const svgHTML = `
            <svg class="curved-svg" viewBox="0 0 ${width} 200" width="100%" height="100%" preserveAspectRatio="xMidYMin meet" style="overflow: visible;">
                <defs>
                    <path id="curve-title" d="${curvePath}" />
                </defs>
                <text width="${width}" text-anchor="middle">
                    <textPath xlink:href="#curve-title" startOffset="50%" 
                        style="fill:var(--charcoal-ink); font-family: 'Abril Fatface', serif; font-size: 60px; text-transform:uppercase; letter-spacing: 2px;">
                        ${textContent}
                    </textPath>
                </text>
            </svg>
        `;
        
        introTitle.innerHTML = `<span class="std-text">${textContent}</span>${svgHTML}`;
    }
});
