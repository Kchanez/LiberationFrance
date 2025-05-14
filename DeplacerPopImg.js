function createPopup(imageSrc, titre, text) {
    const newPopup = document.createElement('div');
    newPopup.className = 'popup';

    // Trouver l'image dans eventsData
    let imageData = null;
    for (const period in eventsData) {
        const images = eventsData[period].images;
        if (images) {
            imageData = images.find(img => img.src === imageSrc);
            if (imageData) break;
        }
    }
    //structure du popup
    newPopup.innerHTML = `
    <div class="popup-left">
        <img src="${imageSrc}" alt="Zoomed Image">
        <span class="close-popup" onclick="this.parentElement.parentElement.remove()">&times;</span>
    </div>
    <div class="popup-right">
        <h3>${titre} - ${imageData?.Date || 'Non spécifiée'} </h3>
        <p class="p1"> ${imageData?.Lieu || 'Non spécifié'} </p>
        <p class="p2">${text}</p>
        <div class="image-details">
            <p class="p3"> ©  ${imageData?.Auteur || 'Non spécifié'} /ECPAD/Défense/ ${imageData?.ref || 'Non spécifiée'} <br>
                ${imageData?.Source || 'Non spécifiée'} <br>
                © ECPAD / Ministère des Armées
            </p>
        </div>
    </div>
    `;
    document.body.appendChild(newPopup);
    newPopup.style.display = 'flex';
    newPopup.style.position = 'absolute';
    newPopup.style.zIndex = 1000;




    // Calculate random position within viewport bounds
    const maxX = window.innerWidth - newPopup.offsetWidth;
    const maxY = window.innerHeight - newPopup.offsetHeight;
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));
    
    // Set random position
    newPopup.style.left = `${randomX}px`;
    newPopup.style.top = `${randomY}px`;
    
    // Add drag events
    initDragEvents(newPopup);
    
    return newPopup;
}

function initDragEvents(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    element.addEventListener('touchstart', dragStart, false);
    element.addEventListener('touchend', dragEnd, false);
    element.addEventListener('touchmove', drag, false);

    element.addEventListener('mousedown', dragStart, false);
    element.addEventListener('mouseup', dragEnd, false);
    element.addEventListener('mousemove', drag, false);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - element.offsetLeft;
            initialY = e.touches[0].clientY - element.offsetTop;
        } else {
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        }

        if (e.target === element || e.target.tagName === 'H3' || e.target.tagName === 'P') {
            isDragging = true;
        }
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
    }

    function dragEnd() {
        isDragging = false;
    }
}

//  showPopup function 
function showPopup(imageSrc, titre, text) {
    // Vérifier si l'image existe déjà
    const existingPopups = document.querySelectorAll('.popup');
    const isDuplicate = Array.from(existingPopups).some(popup => {
        const img = popup.querySelector('img');
        return img && img.getAttribute('src') === imageSrc;
    });

    // Créer le popup seulement si l'image n'existe pas déjà
    if (!isDuplicate) {
        createPopup(imageSrc, titre, text);
    }
}