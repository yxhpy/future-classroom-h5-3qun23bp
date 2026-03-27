document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');
    const progressBar = document.getElementById('progress-bar');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    if (totalPagesEl) totalPagesEl.textContent = totalSlides;
    updateUI();

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');
        updateUI();
        triggerAnimations();
    }

    function updateUI() {
        if (currentPageEl) currentPageEl.textContent = currentSlideIndex + 1;
        if (progressBar) {
            const progress = (currentSlideIndex / (totalSlides - 1)) * 100;
            progressBar.style.width = progress + '%';
        }
        if (prevBtn) {
            prevBtn.disabled = currentSlideIndex === 0;
            prevBtn.style.opacity = currentSlideIndex === 0 ? '0.3' : '1';
            prevBtn.style.cursor = currentSlideIndex === 0 ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            nextBtn.disabled = currentSlideIndex === totalSlides - 1;
            nextBtn.style.opacity = currentSlideIndex === totalSlides - 1 ? '0.3' : '1';
            nextBtn.style.cursor = currentSlideIndex === totalSlides - 1 ? 'not-allowed' : 'pointer';
        }
    }

    function nextSlide() { goToSlide(currentSlideIndex + 1); }
    function prevSlide() { goToSlide(currentSlideIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
            e.preventDefault();
            nextSlide();
        } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
            e.preventDefault();
            prevSlide();
        }
    });

    let isScrolling = false;
    document.addEventListener('wheel', (e) => {
        if (isScrolling) return;
        if (e.deltaY > 50) {
            nextSlide();
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 800);
        } else if (e.deltaY < -50) {
            prevSlide();
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 800);
        }
    }, { passive: true });

    let touchStartX = 0;
    let touchEndX = 0;
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) nextSlide();
        else if (touchEndX - touchStartX > threshold) prevSlide();
    }, { passive: true });

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.warn(err.message));
            } else {
                document.exitFullscreen();
            }
        });
    }

    document.addEventListener('fullscreenchange', () => {
        if (fullscreenBtn) {
            fullscreenBtn.innerHTML = document.fullscreenElement ? '✖' : '⛶';
        }
    });

    function triggerAnimations() {
        const activeSlide = slides[currentSlideIndex];
        if (!activeSlide) return;
        
        const animatedElements = activeSlide.querySelectorAll('.bubble, .moving-fast, .moving-slow, .sleeping-hare, .zzz, .approaching-finish, .winner, .shocked-hare, .cheer');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
            void el.offsetHeight;
            el.style.animation = null;
        });
        
        const slideId = activeSlide.id;
        
        if (slideId === 'slide-4') {
            const hare = activeSlide.querySelector('.moving-fast');
            const tortoise = activeSlide.querySelector('.moving-slow');
            if(hare) { hare.style.transform = 'translateX(0)'; hare.style.transition = 'none'; }
            if(tortoise) { tortoise.style.transform = 'translateX(0)'; tortoise.style.transition = 'none'; }
            setTimeout(() => {
                if(hare) { hare.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 1, 1)'; hare.style.transform = 'translateX(150vw)'; }
                if(tortoise) { tortoise.style.transition = 'transform 8s linear'; tortoise.style.transform = 'translateX(50vw)'; }
            }, 300);
        }
        
        if (slideId === 'slide-6') {
            const tortoise = activeSlide.querySelector('.approaching-finish');
            if(tortoise) {
                tortoise.style.transform = 'translateX(0)'; tortoise.style.transition = 'none';
                setTimeout(() => {
                    tortoise.style.transition = 'transform 5s linear';
                    tortoise.style.transform = 'translateX(60vw)';
                }, 300);
            }
        }
        
        if (slideId === 'slide-7') {
             const hare = activeSlide.querySelector('.shocked-hare');
             const panicBubble = activeSlide.querySelector('.panic-bubble');
             if(hare) {
                 hare.style.transform = 'scale(0.5)'; hare.style.opacity = '0'; hare.style.transition = 'none';
                 setTimeout(() => {
                    hare.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-in';
                    hare.style.transform = 'scale(1)'; hare.style.opacity = '1';
                 }, 500);
             }
             if(panicBubble) {
                 panicBubble.style.opacity = '0'; panicBubble.style.transition = 'none';
                 setTimeout(() => {
                     panicBubble.style.transition = 'opacity 0.3s ease-in'; panicBubble.style.opacity = '1';
                 }, 1000);
             }
        }
    }
    
    triggerAnimations();
});