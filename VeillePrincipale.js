document.addEventListener("DOMContentLoaded", function() {
    let canRedirect = false;
    const footer = document.getElementById('footer');

    document.body.addEventListener("click", function() {
        if (canRedirect) {
            window.location.href = "./Chronologie.html";
        }
    });

    setTimeout(() => {
        document.querySelector(".container").style.display = "none";
        document.querySelector(".slideshow-container").style.display = "block";
        footer.innerHTML = '<div> <p class="title photographe">La libération aux côtés de <em> photographes </em> de guerre </p></div>';
        startSlideshow();
    }, 5000);

    function startSlideshow() {
        let slides = document.querySelectorAll(".slide");
        let index = 0;
        const touchIcon = document.querySelector('.touch');

        function showSlide() {
            slides.forEach(slide => slide.style.display = "none");
            slides[index].style.display = "block";
            
            if (index < slides.length - 1) {
                index++;
                setTimeout(showSlide, 5000);
            } else {
                canRedirect = true;
                touchIcon.classList.add('blink');
            }
        }

        showSlide();
    }
});