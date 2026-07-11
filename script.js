/* ==========================================
   💍 Elegant Wedding Invitation JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Disable automatic scroll restoration by the browser
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // Force scroll to top immediately on load to prevent starting in a scrolled state
  window.scrollTo(0, 0);

  // Lock body scrolling initially for envelope opening animation
  document.body.style.overflow = 'hidden';

  // Envelope opening logic
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeSeal = document.getElementById('envelope-seal');
  
  if (envelopeSeal && envelopeOverlay) {
    envelopeSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      envelopeOverlay.classList.add('open');
      
      // Step 1: Wait for 3D unfold animation to play (1.5 seconds)
      setTimeout(() => {
        envelopeOverlay.classList.add('fade-out');
      }, 1500);
      
      // Step 2: Wait for fade-out to finish (1.0 seconds) -> remove overlay and restore scroll
      setTimeout(() => {
        envelopeOverlay.style.display = 'none';
        document.body.style.overflow = '';
        window.scrollTo(0, 0); // Force scroll to top once envelope is gone
        
        // Dispatch scroll event to trigger ScrollReveal animations on the page
        window.dispatchEvent(new Event('scroll'));
      }, 2500);
    });
  }


  // ==========================================
  // 2. Sticky Glass Navigation
  // ==========================================
  const nav = document.querySelector('.glass-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  // ==========================================
  // 3. Countdown Timer (Target: March 13, 2027 12:00:00)
  // ==========================================
  const targetDateStr = '2027-03-13T12:00:00+08:00';
  const targetDate = new Date(targetDateStr).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      // If the target date has passed
      document.getElementById('days').innerText = '00';
      document.getElementById('hours').innerText = '00';
      document.getElementById('minutes').innerText = '00';
      document.getElementById('seconds').innerText = '00';
      const countdownTitle = document.querySelector('.hero-countdown-title') || document.querySelector('.countdown-card-title');
      if (countdownTitle) {
        countdownTitle.innerText = '🎉 婚禮進行中！祝福 宏杰 & 汝菁 🎉';
      }
      return;
    }

    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Format numbers to always be 2 digits
    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
  }

  // Run immediately and update every second
  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ==========================================
  // 4. Scroll Reveal (Fade-in / Slide-up Animations)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once it's revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Offset triggers slightly
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  // ==========================================
  // 5. Expandable Gallery Grid
  // ==========================================
  const galleryGrid = document.getElementById('gallery-grid');
  const viewMoreBtn = document.getElementById('view-more-photos-btn');

  if (viewMoreBtn && galleryGrid) {
    viewMoreBtn.addEventListener('click', () => {
      galleryGrid.classList.toggle('expanded');
      if (galleryGrid.classList.contains('expanded')) {
        viewMoreBtn.innerHTML = '✨ 收合部分婚紗相片';
      } else {
        viewMoreBtn.innerHTML = '✨ 展開更多婚紗相片';
        // Scroll back to gallery title smoothly so user doesn't get lost
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================
  // 6. Photo Lightbox Slideshow Modal
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const counter = document.getElementById('lightbox-counter');
  
  // Collect all gallery images
  const allPhotoElements = document.querySelectorAll('.gallery-card img');
  const photoUrls = Array.from(allPhotoElements).map(img => img.src);
  let currentPhotoIndex = 0;

  // Open Lightbox
  allPhotoElements.forEach((imgEl, index) => {
    imgEl.parentElement.addEventListener('click', () => {
      currentPhotoIndex = index;
      updateLightboxPhoto();
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  function updateLightboxPhoto() {
    if (photoUrls.length > 0) {
      lightboxImg.src = photoUrls[currentPhotoIndex];
      counter.textContent = `${currentPhotoIndex + 1} / ${photoUrls.length}`;
    }
  }

  function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoUrls.length;
    updateLightboxPhoto();
  }

  function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoUrls.length) % photoUrls.length;
    updateLightboxPhoto();
  }

  // Navigation Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextPhoto(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevPhoto(); });

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Unlock scroll
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.style.display === 'flex') {
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
      if (e.key === 'Escape') closeLightbox();
    }
  });

  // Mobile Swipe Gestures
  let startX = 0;
  let endX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const threshold = 50;
      if (startX - endX > threshold) {
        showNextPhoto(); // Swipe left -> next
      } else if (endX - startX > threshold) {
        showPrevPhoto(); // Swipe right -> prev
      }
    }, { passive: true });
  }

  // ==========================================
  // 6. Cloud Synced Blessing Wall (Google Sheets Integration)
  // ==========================================
  const wishForm = document.getElementById('wish-form');
  const wishBoard = document.getElementById('wish-board');
  const refreshBtn = document.getElementById('refresh-wishes-btn');
  const STORAGE_KEY = 'wedding_wishes_hungjie_rita_v2';
  
  // Set your deployed Google Apps Script Web App URL here!
  // Leave empty to run in offline/local storage fallback mode.
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVymxSuIFdbkR4_jCT2wyI04CZhnHOaq6ba5m14WDt0cT_zGpHcKdEY8buwZuOPHJk/exec'; 

  // Default Mock Wishes (to populate the board initially if database is empty/offline)
  const defaultWishes = [
    {
      name: '伴娘 小語',
      wish: '恭喜 張汝菁 和 簡宏杰！看到你們修成正果真的超級感動 😭 要一直幸福快樂下去喔！百年好合！',
      time: '2027/03/13 12:30'
    },
    {
      name: '大學好友 阿吉',
      wish: '宏杰 恭喜你娶得美人歸！兄弟們都為你高興！新婚快樂，早生貴子啊！哈哈！',
      time: '2027/03/13 14:15'
    },
    {
      name: '新娘秘書 Emily',
      wish: '祝福最美麗的 汝菁 和最帥氣的 宏杰 新婚愉快！永浴愛河，恩愛一生！',
      time: '2027/03/13 15:45'
    }
  ];

  // Helper to load wishes from localStorage (fallback cache)
  function loadLocalWishes() {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    return JSON.parse(stored);
  }

  // Load and render wishes from Google Sheet OR LocalStorage fallback
  async function fetchAndRenderWishes() {
    if (refreshBtn) refreshBtn.classList.add('spinning');
    
    let wishes = [];
    
    if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith('http')) {
      try {
        const response = await fetch(APPS_SCRIPT_URL);
        if (response.ok) {
          wishes = await response.json();
          // If Sheet is empty, fall back to default wishes
          if (!wishes || wishes.length === 0) {
            wishes = defaultWishes;
          } else {
            // Cache latest fetched wishes in localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
          }
        } else {
          console.warn("Failed to fetch wishes from Google Sheets, using cache");
          wishes = loadLocalWishes();
        }
      } catch (err) {
        console.warn("Error fetching wishes from Google Sheets, using cache:", err);
        wishes = loadLocalWishes();
      }
    } else {
      // Offline fallback mode
      wishes = loadLocalWishes();
    }
    
    renderWishesArray(wishes);
    
    if (refreshBtn) {
      setTimeout(() => {
        refreshBtn.classList.remove('spinning');
      }, 600); // Keep spinning for at least 0.6s for feedback
    }
  }

  // Helper to render any array of wishes
  function renderWishesArray(wishes) {
    wishBoard.innerHTML = '';
    
    // Reverse display so the latest wish is always first
    wishes.slice().reverse().forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-name">${escapeHTML(item.name)}</span>
          <span class="wish-time">${item.time}</span>
        </div>
        <p class="wish-text">${escapeHTML(item.wish).replace(/\n/g, '<br>')}</p>
      `;
      wishBoard.appendChild(card);
    });
  }

  // Handle Form Submission
  wishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('guest-name');
    const wishInput = document.getElementById('guest-wish');
    
    const newWish = {
      name: nameInput.value.trim(),
      wish: wishInput.value.trim(),
      time: formatCurrentTime()
    };

    if (newWish.name && newWish.wish) {
      // 1. Optimistic Update (Immediate local display!)
      let currentWishes = [];
      if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith('http')) {
        try {
          currentWishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultWishes;
        } catch(err) {
          currentWishes = defaultWishes;
        }
      } else {
        currentWishes = loadLocalWishes();
      }
      
      currentWishes.push(newWish);
      if (currentWishes.length > 100) {
        currentWishes.shift(); // Limit locally cached wishes to 100
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWishes));
      renderWishesArray(currentWishes);
      
      // Reset form immediately
      nameInput.value = '';
      wishInput.value = '';
      
      // Scroll to the top of the wish board so user can see their message
      const rect = wishBoard.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 120,
        behavior: 'smooth'
      });

      // 2. Submit asynchronously to Google Sheet
      if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.startsWith('http')) {
        try {
          await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Bypasses preflight CORS pre-requests completely
            body: JSON.stringify(newWish)
          });
          console.log("Successfully sent wish to Google Sheet");
        } catch (err) {
          console.error("Failed to send wish to Google Sheet:", err);
        }
      }
    }
  });

  // Manual Refresh Click Handler
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchAndRenderWishes();
    });
  }

  // Helper to format date-time
  function formatCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${date} ${hours}:${minutes}`;
  }

  // Helper to escape HTML characters (security best practice)
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial Load of Wish Board
  fetchAndRenderWishes();

});
