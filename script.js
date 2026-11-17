/**
 * CHIRAG JINDANI — RESUME PORTFOLIO INTERACTIVITY
 * Course: IIM Bangalore Web Development (Modules 6 & 7: JavaScript & DOM Manipulation)
 * Author: Chirag Jindani (Roll No: 26120364)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. INSTANT SMOOTH ANCHOR NAVIGATION (0ms Latency) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // If mobile drawer was open, close it instantly
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          if (menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  /* ---------- 2. THEME SWITCHER (Dark Maroon / Crimson Light) ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to 'dark'
  const savedTheme = localStorage.getItem('cj-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('cj-theme', newTheme);
    });
  }

  /* ---------- 3. MOBILE NAVIGATION DRAWER ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------- 4. DYNAMIC CLEAN TYPEWRITER EFFECT ---------- */
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    'AI & Data Science solutions.',
    'Geospatial automation tools.',
    'Deep Learning & LLM pipelines.',
    'Full-stack software from scratch.',
    'Visual stories & creative media.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 350;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  /* ---------- 5. SKILLS FILTER TABS ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- 6. COPY TO CLIPBOARD (Instant Feedback) ---------- */
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      const textSpan = btn.querySelector('.copy-text');
      const originalText = textSpan ? textSpan.textContent : 'Copy';

      try {
        await navigator.clipboard.writeText(textToCopy);
        if (textSpan) textSpan.textContent = 'Copied!';
        btn.style.backgroundColor = 'var(--maroon-primary)';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          if (textSpan) textSpan.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 1800);
      } catch (err) {
        // Fallback for older environments
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        if (textSpan) textSpan.textContent = 'Copied!';
        setTimeout(() => {
          if (textSpan) textSpan.textContent = originalText;
        }, 1800);
      }
    });
  });

  /* ---------- 7. ZERO-LAG ACTIVE SCROLLSPY (IntersectionObserver) ---------- */
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const observedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    observedSections.forEach(sec => sectionObserver.observe(sec));
  }

  /* ---------- 8. BACK TO TOP BUTTON (Smooth & Non-Intrusive) ---------- */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
