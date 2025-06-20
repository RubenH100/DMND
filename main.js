// Zet current standaard op 0 zodat section0 altijd als eerste verschijnt
let current = 0;
const max = 5;
let isTransitioning = false;
function updateIndicators(target) {
    for (let i = 1; i <= max; i++) {
        document.getElementById('circle' + i)?.classList.remove('active');
        document.getElementById('topbar-link' + i)?.classList.remove('active');
    }
    if (target >= 1 && target <= max) {
        document.getElementById('circle' + target)?.classList.add('active');
    }
}
function removeAnimationClasses(section) {
    if (!section) return;
    section.classList.remove('slide-in-from-top', 'slide-in-from-bottom', 'slide-out-to-top', 'slide-out-to-bottom');
}
function slideToSection(target) {
    if (isTransitioning || target === current) return;
    isTransitioning = true;
    const prev = current;
    const direction = (target > prev) ? "down" : "up";
    const prevSection = document.getElementById('section' + prev);
    const newSection = document.getElementById('section' + target);
    removeAnimationClasses(prevSection);
    removeAnimationClasses(newSection);
    // Zet nieuwe sectie klaar buiten beeld
    newSection.classList.add('active');
    newSection.style.transition = 'none';
    newSection.style.opacity = "1";
    newSection.style.transform = direction === "down" ? "translateY(100vh)" : "translateY(-100vh)";
    // Force reflow
    void newSection.offsetWidth;
    // Start animatie
    prevSection.classList.add(direction === "down" ? "slide-out-to-top" : "slide-out-to-bottom");
    newSection.style.transition = '';
    newSection.classList.add(direction === "down" ? "slide-in-from-bottom" : "slide-in-from-top");
    newSection.style.transform = "translateY(0)";
    updateIndicators(target);
    setTimeout(() => {
        for (let i = 0; i <= max; i++) {
            const s = document.getElementById('section' + i);
            removeAnimationClasses(s);
            if (i === target) {
                s.classList.add('active');
                s.style.transform = "translateY(0)";
                s.style.opacity = "";
                s.style.transition = "";
            } else {
                s.classList.remove('active');
                s.style.transform = "translateY(100vh)";
                s.style.opacity = "";
                s.style.transition = "";
            }
        }
        current = target;
        isTransitioning = false;
    }, 500); // css transition-duur
}
// Scrollen met muis
window.addEventListener('wheel', function (e) {
    if (isTransitioning) { e.preventDefault(); return; }
    if (e.deltaY > 0 && current < max) slideToSection(current + 1);
    else if (e.deltaY < 0 && current > 0) slideToSection(current - 1);
    e.preventDefault();
}, { passive: false });
// Pijltjestoetsen
window.addEventListener('keydown', function (e) {
    if (isTransitioning) { e.preventDefault(); return; }
    if (e.key === 'ArrowDown' && current < max) {
        slideToSection(current + 1);
        e.preventDefault();
    } else if (e.key === 'ArrowUp' && current > 0) {
        slideToSection(current - 1);
        e.preventDefault();
    }
});
// Swipe functionaliteit mobiel - alleen op .slider-container
function addTouchSwipeListener() {
    const slider = document.querySelector('.slider-container');
    let touchStartY = null;
    let touchEndY = null;
    const swipeThreshold = 50;
    if (!slider) return;
    slider.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchEndY = null;
        }
    }, { passive: true });
    slider.addEventListener('touchmove', function (e) {
        if (e.touches.length === 1) {
            touchEndY = e.touches[0].clientY;
        }
    }, { passive: true });
    slider.addEventListener('touchend', function () {
        if (touchStartY !== null && touchEndY !== null && !isTransitioning) {
            const deltaY = touchEndY - touchStartY;
            if (Math.abs(deltaY) > swipeThreshold) {
                if (deltaY > 0 && current > 0) {
                    // Swipe omlaag
                    slideToSection(current - 1);
                } else if (deltaY < 0 && current < max) {
                    // Swipe omhoog
                    slideToSection(current + 1);
                }
            }
        }
        touchStartY = null;
        touchEndY = null;
    }, { passive: true });
}
// Init-functie die PAS wordt aangeroepen als alle includes klaar zijn!
function initPage() {
    current = 0;
    for (let i = 0; i <= max; i++) {
        const s = document.getElementById('section' + i);
        if (s) {
            if (i === 0) {
                s.classList.add('active');
                s.style.transform = 'translateY(0)';
                s.style.opacity = '';
                s.style.transition = '';
            } else {
                s.classList.remove('active');
                s.style.transform = 'translateY(100vh)';
                s.style.opacity = '';
                s.style.transition = '';
            }
        }
    }
    updateIndicators(0);
    for (let i = 1; i <= max; i++) {
        document.getElementById('circle' + i)?.addEventListener('click', () => slideToSection(i));
        document.getElementById('topbar-link' + i)?.addEventListener('click', () => slideToSection(i));
    }
    document.getElementById('logo-click')?.addEventListener('click', () => slideToSection(0));
    // Activeer swipe functionaliteit
    addTouchSwipeListener();
}
// Einde main.js
