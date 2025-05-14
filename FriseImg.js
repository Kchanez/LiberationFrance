// Charger les données depuis le fichier JSON
let eventsData = {};
// Fonction pour charger le fichier JSON
function loadData() {
    fetch('./data.json') 
        .then(response => response.json())
        .then(json => {
            eventsData = json; // Sauvegarder les données du JSON dans la variable `eventsData`
        })
        .catch(err => {
            console.error('Erreur lors du chargement du fichier JSON:', err);
        });
}

// Appeler la fonction pour charger les données dès que la page se charge
window.onload = loadData;

//Add this line to handle SVG lines visibility
function updateConnectionLines(ville) {
    const svgLines = document.querySelector('svg');
    if (ville === "Provence") {
        svgLines.classList.add('visible');
    } else {
        svgLines.classList.remove('visible');
    }
}

function showTimeline(ville) {
    currentEvent = ville; 

     // Add this line to handle SVG lines visibility
     updateConnectionLines(ville);
    // Appeler la nouvelle fonction séparée
    displayProvenceSVG(ville);

    // Add scroll functionality at the start of the function
    const barre = document.querySelector('.Barre');
    const clickedEvent = Array.from(document.querySelectorAll('.event'))
        .find(ev => ev.textContent.includes(ville));
    if (clickedEvent) {
        const eventPosition = clickedEvent.offsetTop;
        if (eventPosition > window.innerHeight / 2) {
            barre.classList.add('scrolled');
        } else {
            barre.classList.remove('scrolled');
        }
    }
    // Remove all existing popups when switching to a new period
    const existingPopups = document.querySelectorAll('.popup');
    existingPopups.forEach(popup => {
        popup.remove();
    });

    const timeline = document.getElementById("timeline");
    const content = document.getElementById("timeline-content");

    content.innerHTML = "";
    document.getElementById("periode-popup").style.display = "none";

    document.querySelectorAll(".year-link").forEach(link => {
        link.classList.remove("selected-year");
    });
    const selectedLink = document.querySelector(`.year-link[data-year="${ville}"]`);
    if (selectedLink) {
        selectedLink.classList.add("selected-year");
    }

    const imagesPerPage = 4;
    let currentPage = 0;

    const imageGroups = [];
    if (eventsData[ville]) {
        for (let i = 0; i < eventsData[ville].images.length; i += imagesPerPage) {
            imageGroups.push(eventsData[ville].images.slice(i, i + imagesPerPage));
        }
        if (eventsData[ville].periodeDescription) {
            document.getElementById("periode-date").innerText = eventsData[ville].date;
            document.getElementById("periode-text").innerText = eventsData[ville].periodeDescription;
            document.getElementById("periode-lien").href = eventsData[ville].lien || '#'; 
            document.getElementById("periode-lien").innerText = eventsData[ville].lien;
            document.getElementById("periode-popup").style.display = "flex";
        }    
    }

    document.querySelectorAll(".event").forEach(ev => ev.classList.remove("active"));
    const matchingEvent = Array.from(document.querySelectorAll(".event"))
        .find(ev => ev.textContent.includes(ville));

    if (matchingEvent) {
        matchingEvent.classList.add("active");
    }

    function renderImages(page) {
        content.innerHTML = "";
        
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-block");
    
        // Ajouter les gestionnaires d'événements tactiles
        let touchStartY = 0;
        let touchEndY = 0;
        
        imageContainer.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, false);
        
        imageContainer.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeDistance = touchStartY - touchEndY;
            const minSwipeDistance = 50; // Distance minimum pour détecter un swipe
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0 && endIndex < eventsData[ville].images.length) {
                    // Swipe vers le haut
                    currentPage++;
                    renderImages(currentPage);
                } else if (swipeDistance < 0 && page > 0) {
                    // Swipe vers le bas
                    currentPage--;
                    renderImages(currentPage);
                }
            }
        }
        // Ajouter l'écouteur d'événement pour la molette de la souris
        imageContainer.addEventListener('wheel', function(e) {
            e.preventDefault(); // Empêcher le défilement de la page
            
            const deltaY = e.deltaY;
            const scrollThreshold = 50; // Seuil de défilement
            
            if (Math.abs(deltaY) > scrollThreshold) {
                if (deltaY > 0 && endIndex < eventsData[ville].images.length) {
                    // Défilement vers le bas
                    currentPage++;
                    renderImages(currentPage);
                } else if (deltaY < 0 && page > 0) {
                    // Défilement vers le haut
                    currentPage--;
                    renderImages(currentPage);
                }
            }
        }, { passive: false });
    
        // Calculer les indices pour afficher 4 éléments
        const displayCount = 4; // Nombre d'éléments à afficher
        const startIndex = page; // L'index de départ est maintenant juste la page
        const endIndex = Math.min(startIndex + displayCount, eventsData[ville].images.length);
        const displayStartIndex = Math.max(0, Math.min(startIndex, eventsData[ville].images.length - displayCount));
    

        // Modifier les conditions de navigation
        if (displayStartIndex > 0) {
            const upArrow = document.createElement("img");
            upArrow.src = "./images/Flèches/Haut.svg";
            upArrow.style.width = "20%";
            upArrow.alt = "Flèche haut";
            upArrow.classList.add("nav-arrow");
            upArrow.onclick = () => {
                currentPage--;
                renderImages(currentPage);
            };
            content.appendChild(upArrow);
        }

        // Ajouter la vidéo au début du tableau d'images si elle n'y est pas déjà
        if (eventsData[ville].video && !eventsData[ville].images.includes(eventsData[ville].video)) {
            eventsData[ville].images.unshift(eventsData[ville].video);
        }

        // Afficher 4 éléments à partir de l'index de départ
        const pageImages = eventsData[ville].images.slice(displayStartIndex, displayStartIndex + displayCount);
        pageImages.forEach(imgObj => {
            const container = document.createElement("div");
            container.classList.add("image-container");
    
            if (imgObj === eventsData[ville].video) {
                // Créer l'élément vidéo
                const video = document.createElement("video");
                video.src = imgObj.src;                
                video.controls = true;
                video.style.width = "100%";
                video.style.height = "107px";
                video.style.margin = "15px 0px";
                video.style.borderRadius = "5px";
                video.style.cursor = "pointer";
                video.onclick = () => showVideoPopup(
                    imgObj.src,
                    imgObj.Titre,
                    imgObj.Description
                );
                
                container.appendChild(video);
            } else {
                // Créer l'élément image
                const imageElement = document.createElement("img");
                imageElement.src = imgObj.src;
                imageElement.alt = `Image de ${ville}`;
                imageElement.onclick = () => showPopup(imgObj.src, imgObj.Titre, imgObj.Description);
                container.appendChild(imageElement);
            }
    
            const textElement = document.createElement("p");
            textElement.innerText = imgObj.Date;
            textElement.style.fontSize = "14px";
            textElement.style.fontWeight = "bold";
            textElement.style.margin = "0px";
        
            const textElement1 = document.createElement("p");
            textElement1.innerText = imgObj.Titre;
            textElement1.style.fontSize = "12px";
    
            container.appendChild(textElement);
            container.appendChild(textElement1);
            imageContainer.appendChild(container);
        });
    
        content.appendChild(imageContainer);
    
        if (displayStartIndex + displayCount < eventsData[ville].images.length) {
            const downArrow = document.createElement("img");
            downArrow.src = "./images/Flèches/Bas.svg";
            downArrow.style.width = "20%";
            downArrow.alt = "Flèche bas";
            downArrow.classList.add("nav-arrow");
            downArrow.onclick = () => {
                currentPage++;
                renderImages(currentPage);
            };
            content.appendChild(downArrow);
        }
    }


    renderImages(currentPage);
    timeline.style.display = "flex";

    // Add this line to handle SVG lines visibility
    updateConnectionLines(ville);
}

//Fermer le popup de la période
function closePopupPeriode() {
    document.getElementById("periode-popup").style.display = "none";
}
function hideTimeline() {
    document.getElementById("timeline").style.display = "none";
    document.querySelector('.Barre').classList.remove('scrolled');
}

// Fonction pour fermer le popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Écouteurs d'événements pour chaque .event
document.querySelectorAll('.event').forEach(event => {
    event.addEventListener('click', function() {
        // Change la couleur de fond de .event::before
        this.querySelector('::before').style.backgroundColor = 'red';

        // Extraire la ville et afficher les images correspondantes
        const ville = this.querySelector('.date').textContent.trim(); // Récupère la ville basée sur le texte de la date (ex : Normandie)
        showTimeline(ville);
    });
});


