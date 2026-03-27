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
    
    // 角色轻互动：自绘图形的温和反馈
    document.querySelectorAll('img').forEach(img => {
        if(img.src.includes('hare') || img.src.includes('tortoise')) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.style.transform = 'scale(1.08) translateY(-8px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 400);
            });
        }
    });

    // 结局页轻互动：精致的纯色粒子光点，替代廉价emoji
    function createRefinedSparkle(x, y) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.width = '6px';
        el.style.height = '6px';
        el.style.borderRadius = '50%';
        const colors = ['#FFFFFF', '#FFD700', '#FFB6C1', '#87CEFA'];
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.boxShadow = '0 0 6px ' + el.style.backgroundColor;
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        document.body.appendChild(el);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - 20;

        requestAnimationFrame(() => {
            el.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(0)';
            el.style.opacity = '0';
        });
        setTimeout(() => el.remove(), 850);
    }

    const climaxSlide = document.getElementById('slide-7');
    const moralSlide = document.getElementById('slide-8');
    [climaxSlide, moralSlide].forEach(slide => {
        if(slide) {
            slide.addEventListener('click', (e) => {
                if(!slide.classList.contains('active')) return;
                for(let i=0; i<6; i++) {
                    setTimeout(() => createRefinedSparkle(e.clientX, e.clientY), i * 40);
                }
            });
        }
    });

    updateUI();
    triggerAnimations();

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        slides[currentSlideIndex].classList.remove('active');
        cleanUpAnimations(slides[currentSlideIndex]);
        
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

    // 核心动画调度
    function triggerAnimations() {
        const activeSlide = slides[currentSlideIndex];
        if (!activeSlide) return;
        
        // 1. 通用入场元素重置与触发
        const animatables = activeSlide.querySelectorAll('.pop-in, .bubble, .slide-in-bottom, .drop-in');
        animatables.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = el.classList.contains('slide-in-bottom') ? 'translateY(30px)' : 
                                 el.classList.contains('drop-in') ? 'translateY(-30px)' : 'scale(0.8)';
            el.style.transition = 'none';
        });

        void activeSlide.offsetHeight; // 强制重绘

        animatables.forEach((el, idx) => {
            const delay = el.classList.contains('delay-1') ? 400 : 
                          el.classList.contains('delay-2') ? 800 : 100 + (idx * 150);
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translate(0) scale(1)';
            }, delay);
        });

        const slideId = activeSlide.id;
        
        // 2. 场景特有精细化位移与表演
        if (slideId === 'slide-4') {
            // 比赛页位移动画更自然
            const hare = activeSlide.querySelector('.moving-fast');
            const tortoise = activeSlide.querySelector('.moving-slow');
            
            if(hare) { 
                hare.style.transform = 'translateX(-10vw)'; 
                hare.style.transition = 'none'; 
            }
            if(tortoise) { 
                tortoise.style.transform = 'translateX(-5vw)'; 
                tortoise.style.transition = 'none'; 
            }
            
            setTimeout(() => {
                if(hare) { 
                    hare.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 1, 1)'; 
                    hare.style.transform = 'translateX(120vw)'; 
                }
                if(tortoise) { 
                    // 乌龟匀速稳步前进
                    tortoise.style.transition = 'transform 10s linear'; 
                    tortoise.style.transform = 'translateX(45vw)'; 
                }
            }, 300);
        }

        if (slideId === 'slide-6') {
            // 冲刺透视构图：利用缩放产生前中后景的纵深靠近感
            const tortoise = activeSlide.querySelector('.approaching-tortoise');
            if(tortoise) {
                tortoise.style.transform = 'scale(0.5) translateY(40px)'; 
                tortoise.style.transition = 'none';
                setTimeout(() => {
                    tortoise.style.transition = 'transform 8s ease-out';
                    tortoise.style.transform = 'scale(1.1) translateY(0)';
                }, 300);
            }
        }
        
        if (slideId === 'slide-7') {
             // 结局庆祝更克制、精致
             const winner = activeSlide.querySelector('.winner');
             const hare = activeSlide.querySelector('.shocked-hare');
             const confettis = activeSlide.querySelectorAll('.confetti-piece');
             
             if(winner) {
                 winner.style.transform = 'translateY(40px) scale(0.9)';
                 winner.style.opacity = '0';
                 winner.style.transition = 'none';
                 setTimeout(() => {
                     winner.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease';
                     winner.style.transform = 'translateY(0) scale(1)';
                     winner.style.opacity = '1';
                 }, 300);
             }

             if(hare) {
                 hare.style.transform = 'translateX(20px)'; 
                 hare.style.opacity = '0'; 
                 hare.style.transition = 'none';
                 setTimeout(() => {
                    hare.style.transition = 'transform 0.5s ease-out, opacity 0.4s ease';
                    hare.style.transform = 'translateX(0)'; 
                    hare.style.opacity = '1';
                 }, 700);
             }
             
             // CSS碎纸片温和飘落
             confettis.forEach((c, i) => {
                 c.style.opacity = '0';
                 c.style.transform = 'translateY(-20px) rotate(0deg)';
                 c.style.transition = 'none';
                 setTimeout(() => {
                     c.style.transition = 'all 1.5s ease-out';
                     c.style.opacity = '0.8';
                     c.style.transform = 'translateY(' + (40 + Math.random() * 40) + 'px) rotate(' + (Math.random() * 180) + 'deg)';
                 }, 500 + i * 150);
             });
        }
    }

    function cleanUpAnimations(slide) {
        if(!slide) return;
        // 清理可能的遗留计时器或动态内联样式
        const movingFast = slide.querySelector('.moving-fast');
        if(movingFast) movingFast.style.transition = 'none';
        const movingSlow = slide.querySelector('.moving-slow');
        if(movingSlow) movingSlow.style.transition = 'none';
    }
});
