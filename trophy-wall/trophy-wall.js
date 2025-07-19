// Tab switching
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Deactivate all tabs and contents
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    // Activate selected tab and content
    btn.classList.add("active");
    const tabId = btn.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});

// Season tab switching
const seasonTabs = document.querySelectorAll(".season-tab");
const seasonContents = document.querySelectorAll(".season-content");

seasonTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    seasonTabs.forEach((t) => t.classList.remove("active"));
    seasonContents.forEach((c) => c.classList.remove("active"));

    tab.classList.add("active");
    const seasonId = tab.getAttribute("data-season");
    document.getElementById(seasonId).classList.add("active");

    // 🎉 Trigger confetti when switching seasons
    launchConfetti();
  });
});


// Carousel scroll logic
const carousel = document.getElementById('panthers-carousel');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

prevBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: -300, behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: 300, behavior: 'smooth' });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

// Attach click to all carousel images
document.querySelectorAll('#panthers-carousel img').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

// Close modal
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

// Scroll to zoom
lightboxImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoomLevel += e.deltaY < 0 ? 0.1 : -0.1;
  zoomLevel = Math.max(1, zoomLevel);
  lightboxImg.style.transform = `scale(${zoomLevel})`;
});

// Drag to pan
let isDragging = false, startX = 0, startY = 0, offsetX = 0, offsetY = 0;

lightboxImg.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
  lightboxImg.style.cursor = "grabbing";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  lightboxImg.style.cursor = "default";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  offsetX = e.clientX - startX;
  offsetY = e.clientY - startY;
  lightboxImg.style.transform = `scale(${zoomLevel}) translate(${offsetX}px, ${offsetY}px)`;
});

document.querySelector('[data-tab="psl-winners"]').addEventListener("click", () => {
  launchConfetti();
});

// Slideshow on Carousel
// let slideshowInterval = null;
let isSlideshowPlaying = false;

document.getElementById("slideshow-toggle").addEventListener("click", () => {
  if (isSlideshowPlaying) {
    clearInterval(slideshowInterval);
    isSlideshowPlaying = false;
    document.getElementById("slideshow-toggle").textContent = "▶️";
  } else {
    slideshowInterval = setInterval(() => {
      updateLightbox(1);
    }, 2000); // 3 sec interval
    isSlideshowPlaying = true;
    document.getElementById("slideshow-toggle").textContent = "⏸";
  }
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
  zoomLevel = 1;
  rotation = 0;
  offsetX = offsetY = 0;
  lightboxImg.style.transform = "scale(1)";
  clearInterval(slideshowInterval);
  isSlideshowPlaying = false;
  document.getElementById("slideshow-toggle").textContent = "▶️";
});


//Keyboard Arrows Keys to work for Changing Slides
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowRight") updateLightbox(1);
    if (e.key === "ArrowLeft") updateLightbox(-1);
    if (e.key === "+") {
      zoomLevel += 0.1;
      lightboxImg.style.transform = `scale(${zoomLevel})`;
    }
    if (e.key === "-") {
      zoomLevel = Math.max(1, zoomLevel - 0.1);
      lightboxImg.style.transform = `scale(${zoomLevel})`;
    }
    if (e.key === "Escape") {
      lightbox.style.display = "none";
      zoomLevel = 1;
      rotation = 0;
      lightboxImg.style.transform = "scale(1)";
    }
  }
});

// Setup Carousel
function setupCarousel(trackId, prevSelector, nextSelector) {
  const track = document.getElementById(trackId);
  const prev = track.parentElement.querySelector(prevSelector);
  const next = track.parentElement.querySelector(nextSelector);

  prev.addEventListener("click", () => {
  if (track.scrollLeft <= 0) {
    // If at the beginning, scroll to end
    track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
  } else {
    track.scrollBy({ left: -300, behavior: "smooth" });
  }
  });

  next.addEventListener("click", () => {
  if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
    // If at the end, scroll to start
    track.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    track.scrollBy({ left: 300, behavior: "smooth" });
  }
  });

  // Swipe support for mobile
let startX = 0;

track.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  if (Math.abs(diff) > 50) {
    track.scrollBy({ left: diff < 0 ? 300 : -300, behavior: "smooth" });
  }
});

  // Lightbox on images
  track.querySelectorAll("img").forEach((img) => {
  img.addEventListener("click", () => {
    const allImgs = Array.from(track.querySelectorAll("img"));
    openLightbox(img.src, allImgs);
  });
});
document.querySelector(".lightbox-arrow.left").addEventListener("click", () => {
  updateLightbox(-1);
});

document.querySelector(".lightbox-arrow.right").addEventListener("click", () => {
  updateLightbox(1);
});
}

// Initialize both carousels
setupCarousel("panthers-carousel", ".prev", ".next");
setupCarousel("special-carousel", ".prev", ".next");
setupCarousel("match-carousel", ".prev", ".next");

// Arrows Inside Lightbox
let currentCarouselImages = [];
let currentIndex = 0;

function openLightbox(src, images) {
  lightbox.style.display = "flex";
  lightboxImg.src = src;
  currentCarouselImages = images;
  currentIndex = images.findIndex((img) => img.src === src);
}

function updateLightbox(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = currentCarouselImages.length - 1;
  if (currentIndex >= currentCarouselImages.length) currentIndex = 0;
  lightboxImg.src = currentCarouselImages[currentIndex].src;
}

// Zoom in/out controls
let zoomLevel = 1;

document.getElementById("zoom-in").addEventListener("click", () => {
  zoomLevel += 0.1;
  lightboxImg.style.transform = `scale(${zoomLevel})`;
});

document.getElementById("zoom-out").addEventListener("click", () => {
  zoomLevel = Math.max(1, zoomLevel - 0.1);
  lightboxImg.style.transform = `scale(${zoomLevel})`;
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
  zoomLevel = 1;
  lightboxImg.style.transform = "scale(1)";
});

//Rotation Button
let rotation = 0;

document.getElementById("rotate").addEventListener("click", () => {
  rotation = (rotation + 90) % 360;
  lightboxImg.style.transform = `scale(${zoomLevel}) rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`;
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
    zoomLevel = 1;
    rotation = 0;
    offsetX = offsetY = 0;
    lightboxImg.style.transform = "scale(1)";
  }
});

//Auto SlideShow Mode
let slideshowInterval;

function startSlideshow() {
  stopSlideshow();
  slideshowInterval = setInterval(() => {
    updateLightbox(1);
  }, 3000); // 3 seconds
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
}

document.querySelector(".lightbox-arrow.right").addEventListener("dblclick", startSlideshow);
document.querySelector(".lightbox-arrow.left").addEventListener("dblclick", stopSlideshow);


// Enable tap-to-toggle overlays on mobile
document.querySelectorAll('.photo-wrapper').forEach(wrapper => {
  wrapper.addEventListener('click', function (e) {
    // Close all others
    document.querySelectorAll('.photo-wrapper').forEach(w => {
      if (w !== wrapper) w.classList.remove('show-overlay');
    });
    // Toggle this one
    this.classList.toggle('show-overlay');
    e.stopPropagation();
  });
});

// Close overlay when tapping outside
document.addEventListener('click', () => {
  document.querySelectorAll('.photo-wrapper').forEach(w => {
    w.classList.remove('show-overlay');
  });
});

//Confetti Animation
function launchConfetti() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 20,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2
      },
      ...defaults
    });
  }, 250);
}




