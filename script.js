/* ═══════════════════════════════════════════════════
   S VISHNU — AI ENGINEER PORTFOLIO
   Premium JavaScript — Interactions & Animations
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM READY ───
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    loadingScreen();
    initParticles();
    initMouseGlow();
    initScrollProgress();
    initNavbar();
    initTypingEffect();
    initRevealOnScroll();
    initCounters();
    initSkillBars();
    initTiltCards();
    initMagneticButtons();
    initSmoothScroll();
  }

  /* ═══════════ LOADING SCREEN ═══════════ */
  function loadingScreen() {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderBarFill');
    const percent = document.getElementById('loaderPercent');
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress > 100) progress = 100;
      fill.style.width = progress + '%';
      percent.textContent = Math.round(progress) + '%';

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
          triggerHeroReveal();
        }, 500);
      }
    }, 80);

    document.body.style.overflow = 'hidden';
  }

  function triggerHeroReveal() {
    document.querySelectorAll('.hero-text-side, .hero-photo-side').forEach(el => {
      el.classList.add('visible');
    });
  }

  /* ═══════════ PARTICLE BACKGROUND ═══════════ */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track mouse for particle interaction
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 18));

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() * 60 + 240; // blue-purple range
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }

        // Wrap around
        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animId = requestAnimationFrame(animate);
    }
    animate();
  }

  /* ═══════════ MOUSE GLOW ═══════════ */
  function initMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow) return;

    let mx = -1000, my = -1000;
    let cx = -1000, cy = -1000;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function loop() {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      glow.style.left = cx + 'px';
      glow.style.top = cy + 'px';
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ═══════════ SCROLL PROGRESS ═══════════ */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = (window.scrollY / h) * 100;
      bar.style.width = p + '%';
    }, { passive: true });
  }

  /* ═══════════ NAVBAR ═══════════ */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const allLinks = links ? links.querySelectorAll('a') : [];

    // Scroll class
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      updateActiveLink();
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
      });
    }

    // Close on link click (mobile)
    allLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (links.classList.contains('open')) {
          toggle.classList.remove('open');
          links.classList.remove('open');
        }
      });
    });

    function updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });
      allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }
  }

  /* ═══════════ TYPING EFFECT ═══════════ */
  function initTypingEffect() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const strings = [
      'AI Engineer',
      'Machine Learning Developer',
      'LLM Application Builder',
      'Full Stack Developer'
    ];
    let stringIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 90;

    function type() {
      const current = strings[stringIdx];
      if (isDeleting) {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        speed = 40;
      } else {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        speed = 90;
      }

      if (!isDeleting && charIdx === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        stringIdx = (stringIdx + 1) % strings.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    setTimeout(type, 1200);
  }

  /* ═══════════ REVEAL ON SCROLL ═══════════ */
  function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ═══════════ ANIMATED COUNTERS ═══════════ */
  function initCounters() {
    const cards = document.querySelectorAll('.stat-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    cards.forEach(card => observer.observe(card));
  }

  function animateCounter(card) {
    const target = parseInt(card.dataset.count, 10);
    const suffix = card.dataset.suffix || '';
    const numberEl = card.querySelector('.stat-number');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * ease);
      numberEl.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ═══════════ SKILL BARS ═══════════ */
  function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.dataset.level;
          entry.target.style.width = level + '%';
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(fill => observer.observe(fill));
  }

  /* ═══════════ 3D TILT CARDS ═══════════ */
  function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        card.style.transition = 'transform 0.6s cubic-bezier(.4,0,.2,1)';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  /* ═══════════ MAGNETIC BUTTONS ═══════════ */
  function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic-btn');

    magnetics.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
      });
    });
  }

  /* ═══════════ SMOOTH SCROLL ═══════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const top = target.offsetTop - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

})();
