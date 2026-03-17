'use strict';

/**
 * Lando Norris Inspired Interactions
 * - Canvas Particle Network
 * - Magnetic Buttons
 * - Scroll Spy & Reveals
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------
  // 1. CANVAS BACKGROUND ENGINE
  // -------------------------
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  
  // Mouse interaction
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 1;
      this.color = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(209, 18, 42, 0.4)'; // Red/White mix
    }
    
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    
    update() {
      // Connect points logic (handled in animate)
      
      // Mouse collision / repulsion
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;
      
      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  function initCanvas() {
    particles = [];
    const numberOfParticles = (width * height) / 9000; // Density
    for (let i = 0; i < numberOfParticles; i++) {
      let x = Math.random() * width;
      let y = Math.random() * height;
      particles.push(new Particle(x, y));
    }
  }

  function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
  }

  initCanvas();
  animateCanvas();


  // -------------------------
  // 2. MAGNETIC HOVER PHYSICS
  // -------------------------
  const magneticItems = document.querySelectorAll('.magnetic-btn, .magnetic-hover');
  
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const position = item.getBoundingClientRect();
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;
      
      // Move element
      item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      item.style.transition = 'none'; // Remove transition for smooth tracking
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0px, 0px)';
      item.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; // Snap back
    });
  });


  // Slow Parallax for hero subtitle
  const parallaxSub = document.querySelector('.parallax-sub');
  window.addEventListener('scroll', () => {
    if(parallaxSub) {
      let scrollPos = window.scrollY;
      parallaxSub.style.transform = `translateY(${scrollPos * 0.4}px)`;
    }
  });


  // -------------------------
  // 4. SCROLL SPY NAV & REVEAL
  // -------------------------
  const sections = document.querySelectorAll('.section-block');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  
  const spyOptions = { root: null, rootMargin: '-30% 0px -70% 0px', threshold: 0 };
  
  const spyCallback = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if(link.getAttribute('href') === `#${id}`) link.classList.add('active');
        });
      }
    });
  };
  
  const spyObserver = new IntersectionObserver(spyCallback, spyOptions);
  sections.forEach(sec => spyObserver.observe(sec));

  // Reveals
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealCallback = function (entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };
    const revealOptions = { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));
  }
  initScrollReveal();


  // -------------------------
  // 5. PROJECT FILTERING
  // -------------------------
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const filterItems = document.querySelectorAll('[data-filter-item]');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filterValue = this.innerText.toLowerCase();
      
      filterItems.forEach(item => {
        if(filterValue === 'all' || item.dataset.category === filterValue) {
          item.classList.remove('hide');
          // Add small delay to re-trigger animation
          setTimeout(() => item.classList.add('active'), 50); 
        } else {
          item.classList.remove('active');
          setTimeout(() => item.classList.add('hide'), 500); // Wait for transition
        }
      });
    });
  });

  // -------------------------
  // 6. CONTACT FORM VALIDATION
  // -------------------------
  const contactForm = document.querySelector('[data-form]');
  const formInputs = document.querySelectorAll('[data-form-input]');
  const formBtn = document.querySelector('[data-form-btn]');

  if (contactForm && formInputs.length > 0 && formBtn) {
    formInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (contactForm.checkValidity()) {
          formBtn.removeAttribute('disabled');
        } else {
          formBtn.setAttribute('disabled', '');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Fake submission feedback
      formBtn.innerText = '[ SENT ]';
      contactForm.reset();
      formBtn.setAttribute('disabled', '');
      setTimeout(() => {
        formBtn.innerText = '[ SEND ]';
      }, 3000);
    });
  }
  // -------------------------
  // 7. TERMINAL STREAMERS & ASCII PILL LOGIC
  // -------------------------
  const asciiPill = document.getElementById('ascii-pill');
  if(asciiPill) {
    const handleScroll = () => {
      // Threshold for mobile pill expansion - increased to 800px to keep it closed longer
      const threshold = window.innerWidth <= 768 ? 800 : 50; 
      const isScrolled = window.scrollY > threshold;
      
      if(isScrolled) {
        asciiPill.classList.add('open');
      } else {
        asciiPill.classList.remove('open');
      }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
  }

  const sysStream = document.getElementById('sys-stream');
  const compileStream = document.getElementById('compile-stream');
  const arduinoStream = document.getElementById('arduino-stream');
  const matrixStream = document.getElementById('matrix-stream');
  const aiStream = document.getElementById('ai-stream');

  function setupStream(el, lines, speed) {
    if(!el) return;
    let idx = 0;
    setInterval(() => {
      const line = document.createElement('div');
      line.innerText = lines[idx % lines.length];
      el.appendChild(line);
      if(el.children.length > 5) el.removeChild(el.firstChild);
      idx++;
    }, speed);
  }

  const sysLines = [
    "Mounting /dev/sda1...", "Loading kernel modules...", "Starting docker daemon... [OK]", 
    "eth0 link up, 1000Mbps full-duplex", "Starting nginx web server...",
    "System memory OK (32GB)", "[WARN] High CPU load detected", "Resizing tempfs..."
  ];
  const compileLines = [
    "gcc -O3 -Wall main.c -o main", "Linking dependencies...", "Resolving memory references...", 
    "Build finished with 0 errors, 2 warnings.", "Executing binary...",
    "make[1]: Entering directory '/src'", "Compiling module_core.o", "Optimization applied."
  ];
  const arduinoLines = [
    "avrdude: AVR device initialized", "Reading | ####### | 100%", "Device signature = 0x1e950f",
    "Writing flash (3024 bytes)", "Writing | ####### | 100%", "avrdude: 3024 bytes of flash written",
    "Sensor init: BME280 [OK]", "WiFi connected. IP: 192.168.1.42"
  ];
  const matrixLines = [
    "0x00A1: FF E0 12 4A", "0x00A5: 00 00 00 00", "0x00A9: DE AD BE EF",
    "Decrypting block 44...", "Hash match. Payload valid.",
    "0x00B1: 4C 4F 41 44", "0x00B5: 2E 2E 2E 00"
  ];
  const aiLines = [
    "[INFO] Initializing Transformer architecture...",
    "Loading weights: parameters_70B.bin [100%]",
    "Allocating VRAM (48GB required): SUCCESS",
    "Model loaded. Context window: 128k tokens.",
    "> Awaiting prompt...",
    "[DEBUG] Processing inference request...",
    "Attention heads computing self-attention...",
    "Output generated: Time taken 340ms."
  ];

  setTimeout(() => setupStream(sysStream, sysLines, 400), 1000);
  setTimeout(() => setupStream(compileStream, compileLines, 600), 2000);
  setTimeout(() => setupStream(arduinoStream, arduinoLines, 500), 1500);
  setTimeout(() => setupStream(matrixStream, matrixLines, 300), 2500);
  setTimeout(() => setupStream(aiStream, aiLines, 800), 3000);

  // -------------------------
  // 6. TERMINAL WINDOW CONTROLS
  // -------------------------
  
  // Expose these to global window scope so HTML inline handlers can call them
  window.closeTerminal = function(btnElement) {
    const parentWindow = btnElement.closest('.term-window');
    if (parentWindow) {
      parentWindow.style.opacity = '0';
      parentWindow.style.visibility = 'hidden';
      parentWindow.style.transform = 'scale(0.8)';
      parentWindow.style.transition = 'all 0.3s ease';
      parentWindow.style.pointerEvents = 'none';
    }
  };

  let pillWarnCount = 0;
  window.denyPillClose = function(btnElement) {
    const pillWindow = btnElement.closest('.term-pill');
    if (pillWindow) {
      // Trigger CSS vibration
      pillWindow.classList.add('vibrate-deny');
      
      // Inject access denied log max 2 times
      if (pillWarnCount < 2) {
        const body = pillWindow.querySelector('.term-body');
        if (body) {
          const warningEl = document.createElement('p');
          warningEl.className = 'term-line';
          warningEl.style.cssText = 'color: red; margin-top: 5px; font-weight: bold; transition: opacity 0.5s;';
          warningEl.textContent = '[WARN] ACCESS DENIED';
          
          body.prepend(warningEl);
          pillWarnCount++;

          // Disappear after 5 seconds
          setTimeout(() => {
            warningEl.style.opacity = '0';
            setTimeout(() => {
              warningEl.remove();
              pillWarnCount--; // allow repeating after it clears
            }, 500);
          }, 5000);
        }
      }

      // Remove the class after the animation completes to allow re-triggering
      setTimeout(() => {
        pillWindow.classList.remove('vibrate-deny');
      }, 500);
    }
  };

  window.rebootTerminals = function() {
    const allWindows = document.querySelectorAll('.multi-term .term-window:not(.term-pill)');
    
    allWindows.forEach(win => {
      win.style.opacity = '1';
      win.style.visibility = 'visible';
      win.style.transform = ''; 
      win.style.pointerEvents = 'auto';
    });
  };

});