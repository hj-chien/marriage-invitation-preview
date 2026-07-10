/* ==========================================
   💍 Elegant Wedding Invitation JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Background Music Controller
  // ==========================================
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const iconPlay = musicBtn.querySelector('.icon-play');
  const iconPause = musicBtn.querySelector('.icon-pause');
  let isPlaying = false;

  // Toggle Music Function
  function toggleMusic() {
    if (isPlaying) {
      music.pause();
      iconPlay.classList.remove('hidden');
      iconPause.classList.add('hidden');
      musicBtn.classList.remove('pulse');
      isPlaying = false;
    } else {
      // Play audio
      music.play().then(() => {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
        musicBtn.classList.add('pulse');
        isPlaying = true;
      }).catch(err => {
        console.log("音訊播放被瀏覽器阻擋，需要使用者互動:", err);
      });
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  // Auto-play attempt on first user interaction
  const startMusicOnInteraction = () => {
    if (!isPlaying) {
      toggleMusic();
      // Remove event listeners after first trigger
      document.removeEventListener('click', startMusicOnInteraction);
      document.removeEventListener('scroll', startMusicOnInteraction);
      document.removeEventListener('touchstart', startMusicOnInteraction);
    }
  };

  document.addEventListener('click', startMusicOnInteraction);
  document.addEventListener('scroll', startMusicOnInteraction);
  document.addEventListener('touchstart', startMusicOnInteraction);


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
  // 3. Countdown Timer (Target: March 14, 2027 12:00:00)
  // ==========================================
  const targetDateStr = '2027-03-14T12:00:00+08:00';
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
      document.querySelector('.countdown-card-title').innerText = '🎉 婚禮進行中！祝福 宏杰 & 汝菁 🎉';
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
  // 5. Photo Lightbox Modal
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Extract the background-image URL
      const bgImg = window.getComputedStyle(item).backgroundImage;
      // Clean up the URL format (removes url("") wrapper)
      const imgSrc = bgImg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
      
      lightboxImg.src = imgSrc;
      lightbox.style.display = 'flex';
    });
  });

  // Close Lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });


  // ==========================================
  // 6. Local Interactive Blessing Wall
  // ==========================================
  const wishForm = document.getElementById('wish-form');
  const wishBoard = document.getElementById('wish-board');
  const STORAGE_KEY = 'wedding_wishes_gary_wendy';

  // Default Mock Wishes (to populate the board initially)
  const defaultWishes = [
    {
      name: '伴娘 小語',
      wish: '恭喜 Wendy 和 Gary！看到你們修成正果真的超級感動 😭 要一直幸福快樂下去喔！百年好合！',
      time: '2026/07/10 12:30'
    },
    {
      name: '大學好友 阿吉',
      wish: 'Gary 恭喜你娶得美人歸！兄弟們都為你高興！新婚快樂，早生貴子啊！哈哈！',
      time: '2026/07/10 14:15'
    },
    {
      name: '新娘秘書 Emily',
      wish: '祝福最美麗的 Wendy 和最帥氣的 Gary 新婚愉快！永浴愛河，恩愛一生！',
      time: '2026/07/10 15:45'
    }
  ];

  // Helper to load wishes from localStorage
  function loadWishes() {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // If no stored wishes, save defaults and return them
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    return JSON.parse(stored);
  }

  // Helper to render wishes on the wall
  function renderWishes() {
    const wishes = loadWishes();
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
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('guest-name');
    const wishInput = document.getElementById('guest-wish');
    
    const newWish = {
      name: nameInput.value.trim(),
      wish: wishInput.value.trim(),
      time: formatCurrentTime()
    };

    if (newWish.name && newWish.wish) {
      const currentWishes = loadWishes();
      currentWishes.push(newWish);
      
      // Limit to max 50 wishes to avoid localStorage filling up
      if (currentWishes.length > 50) {
        currentWishes.shift(); // Remove oldest
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWishes));
      
      // Reset form
      nameInput.value = '';
      wishInput.value = '';
      
      // Re-render board with animation
      renderWishes();
      
      // Scroll to the top of the wish board so user can see their message
      const rect = wishBoard.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 120,
        behavior: 'smooth'
      });
    }
  });

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

  // ==========================================
  // 7. Background Texture Switcher Logic
  // ==========================================
  const switcherToggle = document.getElementById('switcher-toggle');
  const switcherPanel = document.getElementById('switcher-panel');
  const switcherBtns = document.querySelectorAll('.switcher-btn');

  // Toggle Panel
  switcherToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    switcherPanel.classList.toggle('hidden');
  });

  // Close Panel when clicking outside
  document.addEventListener('click', (e) => {
    if (switcherPanel && !switcherPanel.classList.contains('hidden') && !switcherPanel.contains(e.target) && e.target !== switcherToggle) {
      switcherPanel.classList.add('hidden');
    }
  });

  // Switch Texture Function
  switcherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      switcherBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const texture = btn.dataset.texture;

      // Remove all background texture classes from body
      document.body.classList.remove('bg-texture-grain', 'bg-texture-linen', 'bg-texture-ribbed', 'has-texture');

      // Add appropriate class
      if (texture !== 'none') {
        document.body.classList.add(`bg-texture-${texture}`, 'has-texture');
      }

      // Close panel after select
      switcherPanel.classList.add('hidden');
    });
  });

  // Initial Load of Wish Board
  renderWishes();

});
