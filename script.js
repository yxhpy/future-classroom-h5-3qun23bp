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
    
    // 角色轻互动：点击角色触发动画
    document.querySelectorAll('img').forEach(img => {
        if(img.src.includes('hare') || img.src.includes('tortoise')) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                e.stopPropagation();
                this.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                this.style.transform = 'scale(1.15) rotate(5deg)';
                setTimeout(() => {
                    this.style.transform = 'none';
                }, 300);
            });
        }
    });

    // 结局页轻互动：点击屏幕撒花/掌声
    const climaxSlide = document.getElementById('slide-7');
    const moralSlide = document.getElementById('slide-8');
    [climaxSlide, moralSlide].forEach(slide => {
        if(slide) {
            slide.addEventListener('click', (e) => {
                if(!slide.classList.contains('active')) return;
                createFloatingEmoji(e.clientX, e.clientY, slide.id === 'slide-7' ? ['🎉','🎊','✨'] : ['👏','🌟','💖']);
            });
        }
    });

    function createFloatingEmoji(x, y, emojis) {
        const el = document.createElement('div');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.position = 'fixed';
        el.style.left = (x - 15) + 'px';
        el.style.top = (y - 15) + 'px';
        el.style.fontSize = '30px';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '9999';
        el.style.transition = 'all 1s ease-out';
        document.body.appendChild(el);
        
        setTimeout(() => {
            el.style.transform = `translateY(-100px) scale(1.5) rotate(${Math.random()*60 - 30}deg)`;
            el.style.opacity = '0';
        }, 50);
        setTimeout(() => el.remove(), 1050);
    }

    updateUI();
    triggerAnimations();

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        slides[currentSlideIndex].classList.remove('active');
        
        // 清理上一页的动态效果
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

    // 动画控制核心
    function triggerAnimations() {
        const activeSlide = slides[currentSlideIndex];
        if (!activeSlide) return;
        
        // 重置所有基础动画元素
        const animatedElements = activeSlide.querySelectorAll('.bubble, .character-card, .actor');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'none';
        });

        // 强制重绘
        void activeSlide.offsetHeight;

        // 统一恢复入场动画
        animatedElements.forEach((el, idx) => {
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150 * idx);
        });

        const slideId = activeSlide.id;
        
        // 第3页：对话依次出现
        if (slideId === 'slide-3') {
            const bubbles = activeSlide.querySelectorAll('.bubble');
            if(bubbles.length >= 2) {
                bubbles[0].style.opacity = '0';
                bubbles[0].style.transform = 'scale(0.8)';
                bubbles[1].style.opacity = '0';
                bubbles[1].style.transform = 'scale(0.8)';
                setTimeout(() => {
                    bubbles[0].style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    bubbles[0].style.opacity = '1';
                    bubbles[0].style.transform = 'scale(1)';
                }, 500);
                setTimeout(() => {
                    bubbles[1].style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    bubbles[1].style.opacity = '1';
                    bubbles[1].style.transform = 'scale(1)';
                }, 1500);
            }
        }
        
        // 第4页：比赛开始，兔子飞奔，乌龟慢爬
        if (slideId === 'slide-4') {
            const hare = activeSlide.querySelector('.moving-fast');
            const tortoise = activeSlide.querySelector('.moving-slow');
            if(hare) { 
                hare.style.transform = 'translate(0, 0)'; 
                hare.style.transition = 'none'; 
            }
            if(tortoise) { 
                tortoise.style.transform = 'translate(0, 0)'; 
                tortoise.style.transition = 'none'; 
            }
            setTimeout(() => {
                if(hare) { 
                    hare.style.transition = 'transform 1.2s cubic-bezier(0.5, 0.05, 0.1, 1)'; 
                    hare.style.transform = 'translate(150vw, -30px) rotate(10deg)'; 
                }
                if(tortoise) { 
                    tortoise.style.transition = 'transform 8s linear'; 
                    tortoise.style.transform = 'translate(50vw, 0)'; 
                }
            }, 400);
        }

        // 第5页：呼噜声气泡动画
        if (slideId === 'slide-5') {
            const zzz = activeSlide.querySelector('.zzz');
            if(zzz) {
                zzz.style.animation = 'none';
                void zzz.offsetHeight;
                zzz.style.animation = 'float-up 3s infinite ease-in-out';
            }
        }
        
        // 第6页：乌龟努力冲刺
        if (slideId === 'slide-6') {
            const tortoise = activeSlide.querySelector('.approaching-finish');
            if(tortoise) {
                tortoise.style.transform = 'translateX(-20vw)'; 
                tortoise.style.transition = 'none';
                setTimeout(() => {
                    tortoise.style.transition = 'transform 6s linear';
                    tortoise.style.transform = 'translateX(60vw)';
                }, 300);
                
                let sweatInterval = setInterval(() => {
                    if(currentSlideIndex !== 5) {
                        clearInterval(sweatInterval);
                        return;
                    }
                    const rect = tortoise.getBoundingClientRect();
                    createFloatingEmoji(rect.right, rect.top, ['💦']);
                }, 1500);
                activeSlide.dataset.interval = sweatInterval;
            }
        }
        
        // 第7页：结局爆冷
        if (slideId === 'slide-7') {
             const hare = activeSlide.querySelector('.shocked-hare');
             const panicBubble = activeSlide.querySelector('.panic-bubble');
             const winner = activeSlide.querySelector('.winner');
             
             if(winner) {
                 winner.style.transform = 'scale(0) rotate(-180deg)';
                 winner.style.transition = 'none';
                 setTimeout(() => {
                     winner.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                     winner.style.transform = 'scale(1) rotate(0deg)';
                 }, 200);
             }

             if(hare) {
                 hare.style.transform = 'translateY(100px) scale(0.5)'; 
                 hare.style.opacity = '0'; 
                 hare.style.transition = 'none';
                 setTimeout(() => {
                    hare.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-in';
                    hare.style.transform = 'translateY(0) scale(1)'; 
                    hare.style.opacity = '1';
                 }, 800);
             }
             if(panicBubble) {
                 panicBubble.style.opacity = '0'; 
                 panicBubble.style.transition = 'none';
                 setTimeout(() => {
                     panicBubble.style.transition = 'opacity 0.3s ease-in, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
                     panicBubble.style.opacity = '1';
                     panicBubble.style.transform = 'scale(1.1)';
                     setTimeout(() => panicBubble.style.transform = 'scale(1)', 300);
                 }, 1300);
             }
             
             // 自动撒花
             setTimeout(() => {
                 for(let i=0; i<30; i++) {
                     setTimeout(() => createFloatingEmoji(
                         Math.random() * window.innerWidth, 
                         window.innerHeight, 
                         ['🎉','🎊','✨','⭐']
                     ), i * 50);
                 }
             }, 500);
        }
    }

    function cleanUpAnimations(slide) {
        if(!slide) return;
        if(slide.dataset.interval) {
            clearInterval(slide.dataset.interval);
            delete slide.dataset.interval;
        }
    }
});