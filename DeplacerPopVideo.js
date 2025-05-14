function createVideoPopup(videoSrc, titre, text) {
    const newPopup = document.createElement('div');
    newPopup.className = 'popup';

    // Trouver l'image dans eventsData
    let videoData = null;
    for (const period in eventsData) {
        if (eventsData[period].video && eventsData[period].video.src === videoSrc) {
            videoData = eventsData[period].video;
            break;
        }
    }

    newPopup.innerHTML = `
        <video controls src="${videoSrc}" style="width: 100%"></video>
        <span class="close-popup" onclick="this.parentElement.remove()">&times;</span>
        <h3>${titre} - ${videoData?.Date || 'Non spécifiée'} </h3>
        <p class="p1"> ${videoData?.Lieu || 'Non spécifié'} </p>

        <p class="p2">${text}</p>
        
        <div class="image-details">
            <p class="p3"> ©  ${videoData?.Auteur || 'Non spécifié'} <br>
                ${videoData?.Source || 'Non spécifiée'} <br> 
                © ECPAD / Ministère des Armées 
            </p>         
        </div>
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

function showVideoPopup(videoSrc, titre, text) {
    // Vérifier si une popup vidéo existe déjà
    const existingPopups = document.querySelectorAll('.popup');
    const hasVideoPopup = Array.from(existingPopups).some(popup => {
        return popup.querySelector('video');
    });

    // Créer le popup seulement si aucune popup vidéo n'existe
    if (!hasVideoPopup) {
        createVideoPopup(videoSrc, titre, text);
    }
}