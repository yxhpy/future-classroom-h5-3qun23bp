document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnFull = document.getElementById('btn-full');
  const pageCurrent = document.getElementById('current-page');
  const pageTotal = document.getElementById('total-pages');
  const progressBar = document.getElementById('progress-bar');
  const presentation = document.getElementById('presentation');
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  let isAnimating = false;

  // 初始化 UI
  pageTotal.textContent = totalSlides;
  updateUI();

  // 核心切换逻辑
  function goToSlide(index) {
    if (isAnimating || index === currentIndex) return;
    if (index < 0 || index >= totalSlides) return;

    isAnimating = true;
    
    // 移除所有状态
    slides.forEach(slide => {
      slide.classList.remove('active', 'prev-slide');
    });

    // 为之前的幻灯片添加 prev-slide 类，制造层级动画差异
    if (index > currentIndex) {
      slides[currentIndex].classList.add('prev-slide');
    }

    currentIndex = index;
    slides[currentIndex].classList.add('active');
    
    updateUI();

    // 动画锁，与 CSS transition 时间匹配
    setTimeout(() => {
      isAnimating = false;
    }, 800); 
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  function updateUI() {
    pageCurrent.textContent = currentIndex + 1;
    const progress = ((currentIndex) / (totalSlides - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // 按钮状态
    btnPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
    btnPrev.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
    btnNext.style.opacity = currentIndex === totalSlides - 1 ? '0.3' : '1';
    btnNext.style.cursor = currentIndex === totalSlides - 1 ? 'default' : 'pointer';
  }

  // 按钮事件
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);

  // 键盘事件
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
    }
  });

  // 滚轮事件 (防抖/节流控制)
  let wheelTimer = null;
  document.addEventListener('wheel', (e) => {
    if (wheelTimer) return;
    if (Math.abs(e.deltaY) > 20) { // 阈值防误触
      if (e.deltaY > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      wheelTimer = setTimeout(() => {
        wheelTimer = null;
      }, 1000); // 冷却时间防连续滚动
    }
  });

  // 触屏滑动事件
  let touchStartX = 0;
  let touchEndX = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});

  function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) {
      nextSlide();
    } else if (touchEndX - touchStartX > threshold) {
      prevSlide();
    }
  }

  // 全屏控制
  btnFull.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  });
});
