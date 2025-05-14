//Déplacement du pop up période 
let isDragging1= false;
let offsetX1, offsetY1;

const popup1 = document.getElementById("periode-popup");

popup1.addEventListener('touchstart', startDrag, false);
popup1.addEventListener('touchmove', drag, false);
popup1.addEventListener('touchend', endDrag, false);

popup1.addEventListener('mousedown', startDrag, false);
popup1.addEventListener('mousemove', drag, false);
popup1.addEventListener('mouseup', endDrag, false);

function startDrag(e) {
    isDragging1= true;
    const touch = e.touches ? e.touches[0] : e;
    const rect = popup1.getBoundingClientRect();
    offsetX1 = touch.clientX - rect.left;
    offsetY1 = touch.clientY - rect.top;
    popup1.style.position = 'absolute';
    popup1.style.zIndex = 1000;
}

function drag(e) {
    if (!isDragging1) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - offsetX1;
    const y = touch.clientY - offsetY1;

    popup1.style.left = x + 'px';
    popup1.style.top = y + 'px';
}

function endDrag() {
    isDragging1= false;
}