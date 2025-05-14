const imagePositions = {
    'Provence': {
        points: [
            { x: 945, y: 706 }, // 1er line
            { x: 1060, y: 665 }, // 2 eme line
            { x: 1021, y: 686},
            { x: 886, y: 681 } // 4 eme line
        ]
    }
};


function createMarker(x, y) {
    const point = document.createElement('div');
    point.style.position = 'fixed';
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
    point.style.width = '12px';
    point.style.height = '12px';
    point.style.backgroundColor = '#000';
    point.style.borderRadius = '50%';
    point.style.zIndex = '1000';
    point.style.animation = 'pulseMarker 2s infinite';
    
    // Add the animation keyframes to the document if they don't exist
    if (!document.querySelector('#markerAnimation')) {
        const style = document.createElement('style');
        style.id = 'markerAnimation';
        style.textContent = `
            @keyframes pulseMarker {
                0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(54, 114, 147, 0.7);
                }
                50% {
                    transform: scale(1.2);
                    box-shadow: 0 0 0 10px rgba(54, 114, 147, 0);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(54, 114, 147, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    return point;
}

function createConnectionLine(startX, startY, endX, endY) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    
    // Create unique gradient ID
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create gradient definition
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "0%");
    
    // Create gradient stops
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("style", "stop-color:#000;stop-opacity:0");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("style", "stop-color:#000;stop-opacity:1");
    
    // Add stops to gradient
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    
    // Add gradient to SVG defs
    const svg = document.getElementById('connection-lines');
    const defs = svg.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
    if (!svg.querySelector('defs')) {
        svg.appendChild(defs);
    }
    defs.appendChild(gradient);
    
    // Set line attributes
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", endX);
    line.setAttribute("y2", endY);
    line.setAttribute("stroke", `url(#${gradientId})`);
    line.setAttribute("stroke-width", "4");

    // Ajouter l'animation de la ligne
    line.style.strokeDasharray = "2000";
    line.style.strokeDashoffset = "2000";
    line.style.animation = "draw 1s linear forwards";

    // Ajouter les keyframes pour l'animation si ils n'existent pas déjà
    if (!document.querySelector('#lineAnimation')) {
        const style = document.createElement('style');
        style.id = 'lineAnimation';
        style.textContent = `
            @keyframes draw {
                to {
                    stroke-dashoffset: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    return line;
}

function updateConnectionLines(ville) {
    const svg = document.getElementById('connection-lines');
    if (!svg) {
        console.error('SVG non trouvé');
        return;
    }
    
    svg.innerHTML = '';
    document.querySelectorAll('.marker-point').forEach(marker => marker.remove());
    
    if (!imagePositions[ville]) {
        // console.error('Positions non trouvées pour:', ville);
        return;
    }
    
    const timeline = document.getElementById('timeline');
    const imageBlock = timeline.querySelector('.image-block');
    if (!imageBlock) {
        console.error('Image block non trouvé');
        return;
    }

    // Sélectionner uniquement les images visibles
    const visibleImages = Array.from(imageBlock.querySelectorAll('.image-container img, .image-container video'))
        .filter(img => {
            const style = window.getComputedStyle(img);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });

    function createBoat(x, y) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const boat = document.createElementNS("http://www.w3.org/2000/svg", "image");
    boat.setAttributeNS("http://www.w3.org/1999/xlink", "href", "./animation/Vector 93.svg");
    boat.setAttribute("width", "50");
    boat.setAttribute("height", "50");
    boat.setAttribute("x", x + -10);
    boat.setAttribute("y", y + 15);

    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", `M ${x + 10} ${y + 63} l -10 15 l 20 0 z`);
    arrow.setAttribute("fill", "#367293");
    arrow.style.opacity = "0.7";

    group.appendChild(arrow);
    group.appendChild(boat);
    group.style.animation = "moveBoat 3s cubic-bezier(0.1, 0, 0.2, 1) forwards";


    if (!document.querySelector('#boatAnimation')) {
        const style = document.createElement('style');
        style.id = 'boatAnimation';
        style.textContent = `
            @keyframes moveBoat {
                0% { 
                    transform: translateY(0) rotate(90deg);
                    opacity: 0;
                }
                20% {
                    opacity: 1;
                }
                100% { 
                    transform: translateY(${y - y} + 7px) rotate(0deg);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    return group;
    }


    // Then modify your existing code section like this:
    visibleImages.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        
        if (imagePositions[ville].points[index]) {
            const pointPos = imagePositions[ville].points[index];
            
            // Create marker
            const marker = createMarker(pointPos.x, pointPos.y);
            marker.classList.add('marker-point');

            marker.style.opacity = "0";
            marker.style.animation = "pulseMarker 1s infinite, fadeInMarker 1s ease-out forwards";

            document.body.appendChild(marker);
            
            
            // Ajouter les keyframes pour l'animation du marqueur si ils n'existent pas déjà
            if (!document.querySelector('#markerFadeAnimation')) {
                const style = document.createElement('style');
                style.id = 'markerFadeAnimation';
                style.textContent = `
                    @keyframes fadeInMarker {
                        from {
                            opacity: 0;
                            transform: scale(0.5);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    },
                    @keyframes pulseMarker {
                        0% {
                            transform: scale(1);
                            box-shadow: 0 0 0 0 rgba(54, 114, 147, 0.7);
                            
                        }
                        50% {
                            transform: scale(1.2);
                            box-shadow: 0 0 0 10px rgba(54, 114, 147, 0);
                            
                        }
                        100% {
                            transform: scale(1);
                            box-shadow: 0 0 0 0 rgba(54, 114, 147, 0);
                            
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Créer la ligne avec un délai pour la synchroniser avec le marqueur
            setTimeout(() => {
                const line = createConnectionLine(
                    rect.left + (rect.width),
                    rect.top + (rect.height),
                    pointPos.x,
                    pointPos.y
                );
                svg.appendChild(line);
            }, 1000);

        }
    });
}

window.addEventListener('resize', () => {
    const currentVille = document.querySelector('.event.active')?.querySelector('.description')?.textContent.split(' ').pop();
    if (currentVille) {
        updateConnectionLines(currentVille);
    }
});

// Update on scroll
window.addEventListener('scroll', () => {
    const currentVille = document.querySelector('.event.active')?.querySelector('.description')?.textContent.split(' ').pop();
    if (currentVille) {
        requestAnimationFrame(() => updateConnectionLines(currentVille));
    }
});

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    const currentVille = document.querySelector('.event.active')?.querySelector('.description')?.textContent.split(' ').pop();
    if (currentVille) {
        updateConnectionLines(currentVille);
    }
});


