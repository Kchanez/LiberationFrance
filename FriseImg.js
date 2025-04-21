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

// Fonction pour afficher les images dans la timeline
// function showTimeline(ville) {
//     const timeline = document.getElementById("timeline");
//     const content = document.getElementById("timeline-content");
//     content.innerHTML = "";
//     //Masquer le popup de la période
//     document.getElementById("periode-popup").style.display = "none";

//     document.querySelectorAll(".year-link").forEach(link => {
//         link.classList.remove("selected-year");
//     });
//     const selectedLink = document.querySelector(`.year-link[data-year="${ville}"]`);
//     if (selectedLink) {
//         selectedLink.classList.add("selected-year");
//     }

//     const imagesPerPage = 4;
//     let currentPage = 0;

//     const imageGroups = [];
//     if (eventsData[ville]) {
//         for (let i = 0; i < eventsData[ville].images.length; i += imagesPerPage) {
//             imageGroups.push(eventsData[ville].images.slice(i, i + imagesPerPage));
//         }
//         if (eventsData[ville].periodeDescription) {
//             document.getElementById("periode-date").innerText = eventsData[ville].date;
//             document.getElementById("periode-text").innerText = eventsData[ville].periodeDescription;
//             document.getElementById("periode-lien").href = eventsData[ville].lien || '#'; 
//             document.getElementById("periode-lien").innerText = eventsData[ville].lien;
//             document.getElementById("periode-popup").style.display = "flex";
//         }    
//     }
//     //Animation de l'event
//     document.querySelectorAll(".event").forEach(ev => ev.classList.remove("active"));
//     // Trouver l'élément cliqué (grâce au nom de la ville)
//     const matchingEvent = Array.from(document.querySelectorAll(".event"))
//     .find(ev => ev.textContent.includes(ville));

//     if (matchingEvent) {
//     matchingEvent.classList.add("active");
//     }

//     function renderImages(page) {
//         content.innerHTML = "";
//         if (page > 0) {
//             const upArrow = document.createElement("img");
//             upArrow.src = "./images/Flèches/Haut.svg";
//             upArrow.style.width = "20%";
//             upArrow.alt = "Flèche haut";
//             upArrow.classList.add("nav-arrow");
//             upArrow.onclick = () => {
//                 currentPage--;
//                 renderImages(currentPage);
//             };
//             content.appendChild(upArrow);
//         }

//         const imageContainer = document.createElement("div");
//         imageContainer.classList.add("image-block");

//         imageGroups[page]?.forEach(imgObj => {
//             const container = document.createElement("div");
//             container.classList.add("image-container");

//             const imageElement = document.createElement("img");
//             imageElement.src = imgObj.src;
//             imageElement.alt = `Image de ${ville}`;
//             imageElement.onclick = () => showPopup(imgObj.src, imgObj.Titre, imgObj.Description);

//             const textElement = document.createElement("p");
//             textElement.innerText = imgObj.Titre;

//             container.appendChild(imageElement);
//             container.appendChild(textElement);
//             imageContainer.appendChild(container);
//         });

//         content.appendChild(imageContainer);

//         if (page < imageGroups.length - 1) {
//             const downArrow = document.createElement("img");
//             downArrow.src = "./images/Flèches/Bas.svg";
//             downArrow.style.width = "20%";
//             downArrow.alt = "Flèche bas";
//             downArrow.classList.add("nav-arrow");
//             downArrow.onclick = () => {
//                 currentPage++;
//                 renderImages(currentPage);
//             };
//             content.appendChild(downArrow);
//         }
//     }

//     renderImages(currentPage);
//     timeline.style.display = "flex";
// }


function showTimeline(ville) {
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
        if (page > 0) {
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

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-block");

        imageGroups[page]?.forEach(imgObj => {
            const container = document.createElement("div");
            container.classList.add("image-container");

            const imageElement = document.createElement("img");
            imageElement.src = imgObj.src;
            imageElement.alt = `Image de ${ville}`;
            imageElement.onclick = () => showPopup(imgObj.src, imgObj.Titre, imgObj.Description);

            const textElement = document.createElement("p");
            textElement.innerText = imgObj.Titre;

            container.appendChild(imageElement);
            container.appendChild(textElement);
            imageContainer.appendChild(container);
        });

        content.appendChild(imageContainer);

        if (page < imageGroups.length - 1) {
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
}

//Fermer le popup de la période
function closePopupPeriode() {
    document.getElementById("periode-popup").style.display = "none";
}
function hideTimeline() {
    document.getElementById("timeline").style.display = "none";
}
// Fonction pour afficher le popup

function showPopup(imageSrc, titre, text) {
    createPopup(imageSrc, titre, text);
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

