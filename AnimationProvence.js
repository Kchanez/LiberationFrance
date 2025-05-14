// Fonction séparée pour gérer l'affichage des SVG de Provence
function displayProvenceSVG(ville) {
    const svgContainer = document.createElement('div');
    svgContainer.style.display = ville === "Provence" ? "flex" : "none";
    svgContainer.style.flexDirection = "row";
    svgContainer.style.justifyContent = "space-between";
    svgContainer.style.alignItems = "center";
    svgContainer.style.position = "absolute";
    svgContainer.style.top = "5%";
    svgContainer.style.left = "14%";
    svgContainer.style.zIndex = "1000";
    svgContainer.style.width = "60%";
    svgContainer.id = "svg-container";

    // Créer 4 images SVG cliquables
    const svgImages = [
        { src: "./animation/Date1.svg", alt: "Avant le débarquement", mapSrc: "./animation/1.svg" },
        { src: "./animation/Date2.svg", alt: "Le jour J du débarquement", mapSrc: "./animation/2.svg" },
        { src: "./animation/Date3.svg", alt: "L'avancée dans les terres", mapSrc: "./animation/3.svg" },
        { src: "./animation/Date4.svg", alt: "Forces venues de Normandie", mapSrc: "./animation/4.svg" }
    ];

    // Supprimer immédiatement la carte SVG existante si on change de période
    const existingMapSVG = document.getElementById('map-svg');
    if (existingMapSVG && ville !== "Provence") {
        existingMapSVG.remove();
    }
    
    svgImages.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = img.alt;
        imgElement.style.minWidth = "20%";
        imgElement.style.cursor = "pointer";
        imgElement.style.borderRadius = "20px";
        imgElement.onclick = () => {
            // Supprimer l'ancienne carte SVG si elle existe
            const existingMapSVG = document.getElementById('map-svg');

            if (existingMapSVG) {
                // Ajouter un effet de fadeOut avant la suppression
                existingMapSVG.style.transition = 'opacity 5s ease-in';
                existingMapSVG.style.opacity = '0';
                setTimeout(() => {
                    existingMapSVG.remove();
                }, 5000);
            }

            // Supprimer tous les bateaux existants de manière plus précise
            const svg = document.getElementById('connection-lines');
            if (svg) {
                // Sélectionner tous les groupes qui contiennent des bateaux
                const boats = Array.from(svg.getElementsByTagName('g')).filter(g => {
                    const image = g.getElementsByTagName('image')[0];
                    return image && (
                        image.getAttribute('href') === './animation/Vector 93.svg' ||
                        image.getAttribute('href') === './animation/boat.svg' 
                    );
                });

                // Ajouter un effet de fadeOut pour chaque bateau
                boats.forEach(boat => {
                    boat.style.transition = 'opacity 5s ease-in';
                    boat.style.opacity = '0';
                    setTimeout(() => {
                        boat.remove();
                    }, 3000);
                });
                // Sélectionner et supprimer toutes les lignes
                const lines = Array.from(svg.getElementsByTagName('line'));
                lines.forEach(line => {
                    line.style.transition = 'opacity 5s ease-in';
                    line.style.opacity = '0';
                    setTimeout(() => {
                        line.remove();
                    }, 3000);
                });
            }

        setTimeout(() => {
            // Ajouter les nouveaux bateaux uniquement pour Date2
            if (img.alt === "Le jour J du débarquement") {
                //Positions des 3 bateaux pour Date2
                const boatPositions = [
                    { x: 970, y: 780 , rotation: 45}, // gauche
                    { x: 1190, y: 620 , rotation: 30 },  // Droit
                    { x: 1110, y: 690 ,rotation: 60},// Milieu
                ];
            
                // Créer et ajouter les 3 bateaux SVG
                boatPositions.forEach(pos => {
                    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    
                    const boat = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    boat.setAttributeNS("http://www.w3.org/1999/xlink", "href", "./animation/boat.svg");
                    boat.setAttribute("width", "50");
                    boat.setAttribute("height", "41");
                    boat.setAttribute("x", pos.x + -10);
                    boat.setAttribute("y", pos.y + 15);

                    group.appendChild(boat);
                    group.style.animation = "moveBoat 3s cubic-bezier(0.1, 0, 0.2, 1) forwards";
                    
                    svg.appendChild(group);
                });
            } 

            // Créer et afficher la nouvelle carte SVG
            const mapSVG = document.createElement('img');
            mapSVG.src = img.mapSrc;
            mapSVG.id = 'map-svg';
            mapSVG.style.position = 'absolute';
            mapSVG.style.top = '40%';  
            mapSVG.style.left = '50%';  
            mapSVG.style.transform = 'translate(-50%, -50%)';
            mapSVG.style.zIndex = '998';
            mapSVG.style.width = '100%';  
            mapSVG.style.opacity = '0';  // Commencer invisible
            mapSVG.style.transition = 'opacity 5s ease-in';
            document.body.appendChild(mapSVG);

            // Déclencher le fadeIn
            setTimeout(() => {
                mapSVG.style.opacity = '1';
            }, 50);

            // Mettre en évidence l'image sélectionnée
            document.querySelectorAll('#svg-container img').forEach(el => {
                el.style.opacity = '0.5';
            });
            imgElement.style.opacity = '1';

        },500);
    };
        svgContainer.appendChild(imgElement);
    });

    // Supprimer l'ancien conteneur SVG s'il existe
    const existingContainer = document.getElementById('svg-container');
    if (existingContainer) {
        existingContainer.remove();
    }

     // Supprimer l'ancien conteneur de statistiques s'il existe
    const existingStatsContainer = document.getElementById('stats-container');
    if (existingStatsContainer) {
        existingStatsContainer.remove();
    }

    // Insérer le nouveau conteneur SVG si on est sur la page Provence
    if (ville === "Provence") {
        document.body.insertBefore(svgContainer, document.body.firstChild);
    }



    // Créer le conteneur des statistiques
    const statsContainer = document.createElement('div');
    statsContainer.style.position = 'absolute';
    statsContainer.style.width = '18%';
    statsContainer.style.top = '55%';
    statsContainer.style.left = '14%';
    statsContainer.style.display = 'flex';
    statsContainer.style.alignItems = 'flex-end';
    statsContainer.style.zIndex = '1000';
    statsContainer.style.gap = '30px';
    statsContainer.id = 'stats-container';

    // Configuration des statistiques
    const statsConfig = [
        { src: './animation/Soldats.svg'},
        { src: './animation/Allies.svg' },
        { src: './animation/Allemands.svg' }
    ];

    statsConfig.forEach(stat => {
        // Créer un conteneur pour chaque statistique
        const statContainer = document.createElement('div');
        statContainer.style.minWidth = '30%';
        statContainer.style.overflow = 'hidden';
        statContainer.style.position = 'relative';

        // Créer l'image de statistique
        const statImage = document.createElement('img');
        statImage.src = stat.src;
        statImage.style.width = '100%';
        statImage.style.height = '100%';
        statImage.style.cursor = 'pointer';
        statImage.style.transition = 'clip-path 0.5s ease-in-out';
        statImage.style.clipPath = 'inset(75% 0 0 0)'; // Affiche seulement 20% du haut de l'image

        statImage.setAttribute('data-expanded', 'false');
        // Ajouter l'animation au clic avec effet toggle
        statImage.addEventListener('click', () => {
            const isExpanded = statImage.getAttribute('data-expanded') === 'true';
            
            if (isExpanded) {
                // Si l'image est étendue, on la réduit
                statImage.style.clipPath = 'inset(75% 0 0 0)';
                statImage.setAttribute('data-expanded', 'false');
            } else {
                // Réinitialiser toutes les autres images
                statsContainer.querySelectorAll('img').forEach(img => {
                    img.style.clipPath = 'inset(75% 0 0 0)';
                    img.setAttribute('data-expanded', 'false');
                });
                // Étendre l'image cliquée
                statImage.style.clipPath = 'inset(0 0 0 0)';
                statImage.setAttribute('data-expanded', 'true');
            }
        });

        statContainer.appendChild(statImage);
        statsContainer.appendChild(statContainer);
    });

    if (ville === "Provence") {
        document.body.appendChild(statsContainer);
    }

}




