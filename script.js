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
      const isExpanded = galleryGrid.classList.contains('expanded');
      viewMoreBtn.setAttribute('aria-expanded', String(isExpanded));
      if (isExpanded) {
        viewMoreBtn.textContent = '收合部分婚紗相片';
      } else {
        viewMoreBtn.textContent = '展開更多婚紗相片';
        const gallery = document.getElementById('gallery');
        if (gallery) {
          const top = gallery.getBoundingClientRect().top + window.scrollY - 28;
          window.scrollTo({ top, behavior: 'smooth' });
        }
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
  let previouslyFocusedElement = null;

  function openLightbox(index, trigger) {
    if (!lightbox || !lightboxImg) return;
    currentPhotoIndex = index;
    previouslyFocusedElement = trigger || document.activeElement;
    updateLightboxPhoto();
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  // Open Lightbox
  allPhotoElements.forEach((imgEl, index) => {
    const card = imgEl.parentElement;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `開啟第 ${index + 1} 張婚紗照`);
    card.addEventListener('click', () => {
      openLightbox(index, card);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index, card);
      }
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
    if (!lightbox) return;
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
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
      if (e.key === 'Tab') {
        const controls = [lightboxClose, prevBtn, nextBtn].filter(Boolean);
        if (!controls.length) return;
        const currentIndex = controls.indexOf(document.activeElement);
        if (e.shiftKey && (currentIndex <= 0)) {
          e.preventDefault();
          controls[controls.length - 1].focus();
        } else if (!e.shiftKey && currentIndex === controls.length - 1) {
          e.preventDefault();
          controls[0].focus();
        }
      }
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
  // 6. Moderated Guestbook (Apps Script + Turnstile)
  // ==========================================
  const wishForm = document.getElementById('wish-form');
  const wishBoard = document.getElementById('wish-board');
  const refreshBtn = document.getElementById('refresh-wishes-btn');
  const wishStatus = document.getElementById('wish-status');
  const wishSubmitBtn = document.getElementById('wish-submit-btn');
  const STORAGE_KEY = 'wedding_wishes_hungjie_rita_v3';
  const GUESTBOOK_API = {
    url: 'https://script.google.com/macros/s/AKfycbyVymxSuIFdbkR4_jCT2wyI04CZhnHOaq6ba5m14WDt0cT_zGpHcKdEY8buwZuOPHJk/exec',
    // Set this after creating a Turnstile widget for the production domain.
    turnstileSiteKey: ''
  };
  let turnstileToken = '';
  let turnstileWidgetId = null;

  function setWishStatus(message = '', type = '') {
    if (!wishStatus) return;
    wishStatus.textContent = message;
    wishStatus.className = `wish-status${type ? ` is-${type}` : ''}`;
  }

  function normaliseWish(item) {
    if (!item || typeof item !== 'object') return null;
    const name = String(item.name || '').trim().slice(0, 20);
    const wish = String(item.wish || '').trim().slice(0, 150);
    const time = String(item.time || '').trim().slice(0, 40);
    return name && wish && time ? { name, wish, time } : null;
  }

  function loadLocalWishes() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored) ? stored.map(normaliseWish).filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }

  function saveLocalWishes(wishes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes.slice(-100)));
  }

  function renderWishesArray(wishes) {
    wishBoard.replaceChildren();
    if (!wishes.length) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'wish-empty';
      emptyMessage.textContent = '尚未有祝福，期待您的第一則留言。';
      wishBoard.appendChild(emptyMessage);
      return;
    }

    wishes.slice().reverse().forEach(item => {
      const card = document.createElement('article');
      card.className = 'wish-item';
      const header = document.createElement('div');
      header.className = 'wish-header';
      const name = document.createElement('span');
      name.className = 'wish-name';
      name.textContent = item.name;
      const time = document.createElement('time');
      time.className = 'wish-time';
      time.textContent = item.time;
      const message = document.createElement('p');
      message.className = 'wish-text';
      message.textContent = item.wish;
      header.append(name, time);
      card.append(header, message);
      wishBoard.appendChild(card);
    });
  }

  async function fetchAndRenderWishes() {
    if (refreshBtn) refreshBtn.classList.add('spinning');
    try {
      const response = await fetch(GUESTBOOK_API.url, { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load wishes');
      const payload = await response.json();
      const wishes = (Array.isArray(payload) ? payload : payload.wishes || [])
        .map(normaliseWish)
        .filter(Boolean);
      saveLocalWishes(wishes);
      renderWishesArray(wishes);
    } catch (error) {
      renderWishesArray(loadLocalWishes());
      setWishStatus('目前無法更新祝福牆，請稍後再試。', 'error');
    } finally {
      if (refreshBtn) refreshBtn.classList.remove('spinning');
    }
  }

  function initialiseTurnstile() {
    if (!GUESTBOOK_API.turnstileSiteKey) {
      if (wishSubmitBtn) wishSubmitBtn.disabled = true;
      setWishStatus('祝福牆驗證尚未啟用，暫時無法送出留言。', 'error');
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      turnstileWidgetId = window.turnstile.render('#turnstile-container', {
        sitekey: GUESTBOOK_API.turnstileSiteKey,
        action: 'guestbook',
        callback: token => { turnstileToken = token; setWishStatus(); },
        'expired-callback': () => { turnstileToken = ''; },
        'error-callback': () => setWishStatus('驗證載入失敗，請重新整理後再試。', 'error')
      });
    };
    document.head.appendChild(script);
  }

  if (wishForm) {
    wishForm.addEventListener('submit', async event => {
      event.preventDefault();
      const nameInput = document.getElementById('guest-name');
      const wishInput = document.getElementById('guest-wish');
      const websiteInput = document.getElementById('guest-website');
      const name = nameInput.value.trim();
      const wish = wishInput.value.trim();

      if (!name || !wish) {
        setWishStatus('請填寫您的名字與祝福語。', 'error');
        return;
      }
      if (!turnstileToken) {
        setWishStatus('請先完成驗證後再送出。', 'error');
        return;
      }

      wishSubmitBtn.disabled = true;
      setWishStatus('正在送出祝福…');
      try {
        const response = await fetch(GUESTBOOK_API.url, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify({ name, wish, website: websiteInput.value, turnstileToken })
        });
        const payload = await response.json();
        if (!response.ok || !payload.ok || !normaliseWish(payload.wish)) {
          throw new Error(payload.message || 'Unable to save wish');
        }

        const currentWishes = loadLocalWishes();
        currentWishes.push(normaliseWish(payload.wish));
        saveLocalWishes(currentWishes);
        renderWishesArray(currentWishes);
        nameInput.value = '';
        wishInput.value = '';
        turnstileToken = '';
        if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
        setWishStatus('已送出，謝謝您的祝福！', 'success');
      } catch (error) {
        setWishStatus('送出失敗，請確認驗證後再試。', 'error');
      } finally {
        wishSubmitBtn.disabled = false;
      }
    });
  }

  if (refreshBtn) refreshBtn.addEventListener('click', fetchAndRenderWishes);

  initialiseTurnstile();
  fetchAndRenderWishes();

});
