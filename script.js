const slides = Array.from(document.querySelectorAll('.slide'));
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnFull = document.getElementById('btn-full');
const pageCurrent = document.getElementById('current-page');
const pageTotal = document.getElementById('total-pages');
const progressBar = document.getElementById('progress-bar');
const sideDots = document.getElementById('side-dots');

let currentIndex = 0;
let isAnimating = false;
let wheelLock = false;
let touchStartX = 0;

function buildDots() {
  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot-btn';
    dot.setAttribute('aria-label', `跳转到第 ${index + 1} 页`);
    dot.addEventListener('click', () => goToSlide(index));
    sideDots.appendChild(dot);
  });
}

function formatCount(target) {
  return Number.isInteger(target) ? String(target) : target.toFixed(1);
}

function animateCountups(slide) {
  const counters = slide.querySelectorAll('.countup');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || '0');
    const suffix = counter.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      counter.textContent = `${formatCount(value)}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        counter.textContent = `${formatCount(target)}${suffix}`;
      }
    }

    counter.textContent = '0';
    window.requestAnimationFrame(frame);
  });
}

function animateLegendBars(slide) {
  slide.querySelectorAll('.legend-track i').forEach((bar) => {
    const width = bar.dataset.width || '0%';
    bar.style.width = '0%';
    window.setTimeout(() => {
      bar.style.width = width;
    }, 120);
  });
}

function updateUi() {
  pageCurrent.textContent = String(currentIndex + 1);
  pageTotal.textContent = String(slides.length);
  progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;

  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = currentIndex === slides.length - 1;
  btnPrev.style.opacity = currentIndex === 0 ? '0.35' : '1';
  btnNext.style.opacity = currentIndex === slides.length - 1 ? '0.35' : '1';

  sideDots.querySelectorAll('.dot-btn').forEach((dot, index) => {
    dot.classList.toggle('is-active', index === currentIndex);
  });
}

function activateSlide(index) {
  const slide = slides[index];
  slide.classList.add('active');
  updateUi();
  animateCountups(slide);
  animateLegendBars(slide);
}

function goToSlide(index) {
  if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) {
    return;
  }

  isAnimating = true;
  slides[currentIndex].classList.remove('active');
  currentIndex = index;
  activateSlide(currentIndex);

  window.setTimeout(() => {
    isAnimating = false;
  }, 720);
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

btnPrev.addEventListener('click', prevSlide);
btnNext.addEventListener('click', nextSlide);

window.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    nextSlide();
  }

  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    prevSlide();
  }
});

window.addEventListener('wheel', (event) => {
  if (window.innerWidth <= 760 || wheelLock) {
    return;
  }

  if (Math.abs(event.deltaY) < 18) {
    return;
  }

  wheelLock = true;
  if (event.deltaY > 0) {
    nextSlide();
  } else {
    prevSlide();
  }

  window.setTimeout(() => {
    wheelLock = false;
  }, 760);
}, { passive: true });

window.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

window.addEventListener('touchend', (event) => {
  const touchEndX = event.changedTouches[0].screenX;
  const deltaX = touchStartX - touchEndX;
  if (Math.abs(deltaX) < 40) {
    return;
  }

  if (deltaX > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
}, { passive: true });

btnFull.addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
    return;
  }
  await document.exitFullscreen();
});

document.addEventListener('fullscreenchange', () => {
  btnFull.title = document.fullscreenElement ? '退出全屏' : '全屏演示';
});

buildDots();
activateSlide(currentIndex);
