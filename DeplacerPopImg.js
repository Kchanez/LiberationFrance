// Fonction pour créer un nouveau popup
function createPopup(imageSrc, titre, text) {
    const newPopup = document.createElement('div');
    newPopup.className = 'popup';
    newPopup.innerHTML = `
        <img src="${imageSrc}" alt="Zoomed Image">
        <span class="close-popup" onclick="this.parentElement.remove()">&times;</span>
        <h3>${titre}</h3>
        <p>${text}</p>
    `;
    
    document.body.appendChild(newPopup);
    newPopup.style.display = 'block';
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

// Replace the existing showPopup function in your FriseImg.js
function showPopup(imageSrc, titre, text) {
    createPopup(imageSrc, titre, text);
}