/**
 * ==========================================================================
 * NÚCLEO DE NAVEGAÇÃO E GLOBAL INTERFACE INTERACTIONS
 * ==========================================================================
 */

function toggleMenu() {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
        mobileMenu.classList.toggle("active");
    }
}

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(3, 0, 20, 0.85)";
            navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.4)";
        } else {
            navbar.style.background = "rgba(3, 0, 20, 0.7)";
            navbar.style.boxShadow = "none";
        }
    }
});

/**
 * ==========================================================================
 * ENGINE DO CARROSSEL DE PROJETOS INFINITO AUTOMATIZADO
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("carouselPrevBtn");
    const nextBtn = document.getElementById("carouselNextBtn");
    
    if (!track || !prevBtn || !nextBtn) return;

    const originalSlides = Array.from(track.children);
    const totalOriginals = originalSlides.length;
    const gap = 24; 

    let itemsPerPage = getItemsPerPage();
    let currentIndex = itemsPerPage; 
    let isTransitioning = false;
    let autoplayTimer = null;

    // Injeção dinâmica de clones buffers baseado na quantidade de itens atual da DOM
    for (let i = totalOriginals - itemsPerPage; i < totalOriginals; i++) {
        const clone = originalSlides[i].cloneNode(true);
        clone.classList.add("carousel-clone");
        track.insertBefore(clone, track.firstChild);
    }
    for (let i = 0; i < itemsPerPage; i++) {
        const clone = originalSlides[i].cloneNode(true);
        clone.classList.add("carousel-clone");
        track.appendChild(clone);
    }

    let allSlides = Array.from(track.children);
    updateTrackPosition();

    nextBtn.addEventListener("click", () => {
        if (isTransitioning) return;
        moveSlide(1);
        resetAutoplay();
    });

    prevBtn.addEventListener("click", () => {
        if (isTransitioning) return;
        moveSlide(-1);
        resetAutoplay();
    });

    track.addEventListener("transitionend", () => {
        isTransitioning = false;
        
        if (currentIndex >= totalOriginals + itemsPerPage) {
            track.style.transition = "none";
            currentIndex = itemsPerPage;
            updateTrackPosition();
        }
        if (currentIndex < itemsPerPage) {
            track.style.transition = "none";
            currentIndex = totalOriginals + itemsPerPage - 1;
            updateTrackPosition();
        }
    });

    const container = document.querySelector(".carousel-container-wrapper");
    container.addEventListener("mouseenter", stopAutoplay);
    container.addEventListener("mouseleave", startAutoplay);

    window.addEventListener("resize", () => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
        }
        track.style.transition = "none";
        updateTrackPosition();
    });

    function getItemsPerPage() {
        const width = window.innerWidth;
        if (width <= 640) return 1;
        if (width <= 992) return 2;
        return 3;
    }

    function moveSlide(direction) {
        isTransitioning = true;
        track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
        currentIndex += direction;
        updateTrackPosition();
    }

    function updateTrackPosition() {
        if (allSlides.length === 0) return;
        const cardWidth = allSlides[0].getBoundingClientRect().width;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            if (!isTransitioning) moveSlide(1);
        }, 4000);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    startAutoplay();
});