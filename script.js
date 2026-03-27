document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progress = document.getElementById('progress');
  const pageIndicator = document.getElementById('pageIndicator');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  
  let currentSlide = 0;
  let isAnimating = false;

  function updateUI() {
    // Update Active Class
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.add('active');
        triggerSlideAnimations(slide);
      } else {
        slide.classList.remove('active');
        resetSlideAnimations(slide);
      }
    });

    // Update Progress
    const progressPercent = ((currentSlide + 1) / slides.length) * 100;
    progress.style.width = progressPercent + '%';

    // Update Page Number
    pageIndicator.innerText = (currentSlide + 1) + ' / ' + slides.length;

    // Update Buttons State
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    prevBtn.style.cursor = currentSlide === 0 ? 'default' : 'pointer';
    nextBtn.style.opacity = currentSlide === slides.length - 1 ? '0.5' : '1';
    nextBtn.style.cursor = currentSlide === slides.length - 1 ? 'default' : 'pointer';
  }

  function triggerSlideAnimations(slide) {
    // Data Charts Animation
    const bars = slide.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
      setTimeout(() => {
        bar.style.width = bar.getAttribute('data-width');
      }, 300);
    });

    // Counters Animation
    const counters = slide.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      let val = 0;
      const duration = 1500; 
      const frameRate = 30;
      const totalFrames = duration / frameRate;
      const increment = target / totalFrames;
      
      counter.innerText = '0';
      setTimeout(() => {
        const interval = setInterval(() => {
          val += increment;
          if (val >= target) {
            counter.innerText = target;
            clearInterval(interval);
          } else {
            counter.innerText = Math.floor(val);
          }
        }, frameRate);
      }, 300);
    });
  }

  function resetSlideAnimations(slide) {
    const bars = slide.querySelectorAll('.bar-fill');
    bars.forEach(bar => bar.style.width = '0');
  }

  function goToNext() {
    if (isAnimating || currentSlide === slides.length - 1) return;
    isAnimating = true;
    currentSlide++;
    updateUI();
    setTimeout(() => isAnimating = false, 600);
  }

  function goToPrev() {
    if (isAnimating || currentSlide === 0) return;
    isAnimating = true;
    currentSlide--;
    updateUI();
    setTimeout(() => isAnimating = false, 600);
  }

  // Event Listeners: Buttons
  nextBtn.addEventListener('click', goToNext);
  prevBtn.addEventListener('click', goToPrev);

  // Event Listeners: Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      goToNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      goToPrev();
    }
  });

  // Event Listeners: Mouse Wheel
  let wheelTimeout;
  document.addEventListener('wheel', (e) => {
    if (wheelTimeout) return;
    if (e.deltaY > 0) goToNext();
    else if (e.deltaY < 0) goToPrev();
    wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 800);
  });

  // Event Listeners: Touch Swipe
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, {passive: true});
  
  document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;
    if (deltaX > 50) goToNext();
    else if (deltaX < -50) goToPrev();
  }, {passive: true});

  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Init
  updateUI();
});