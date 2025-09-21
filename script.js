// elements
const startBtn = document.getElementById('startBtn');
const landing = document.getElementById('landing');
const confettiCanvas = document.getElementById('confetti');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('photoModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const surpriseBtn = document.getElementById('surpriseBtn');

// confetti canvas setup
const ctx = confettiCanvas.getContext('2d');
function resizeCanvas(){ confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; }
resizeCanvas(); addEventListener('resize', resizeCanvas);

let confettiPieces = [];

// helpers
function random(min,max){ return Math.random()*(max-min)+min; }

// LANDING button -> reveal page with small heart fall
startBtn.addEventListener('click', () => {
  landing.classList.add('hidden');
  landing.style.transition = 'opacity .6s ease';
  landing.style.opacity = 0;
  setTimeout(()=> { landing.remove(); }, 650);
  spawnHearts(20);
  // gentle initial confetti
  runConfetti(90);
});

// GALLERY: open modal with description
gallery.querySelectorAll('.photo').forEach(photo => {
  photo.addEventListener('click', () => {
    const img = photo.querySelector('img').getAttribute('src');
    const title = photo.getAttribute('data-title') || '';
    const desc = photo.getAttribute('data-desc') || '';
    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    // small floating hearts around modal
    spawnHearts(8);
  });
});

// modal close
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

// Surprise button (in carta) -> small jewel + hearts + confetti
if(surpriseBtn){
  surpriseBtn.addEventListener('click', ()=>{
    spawnHearts(18);
    runConfetti(140);
    // tiny animated popup in the letter
    surpriseBtn.textContent = '✨ Sorpresa enviada ✨';
    surpriseBtn.disabled = true;
    setTimeout(()=>{ surpriseBtn.disabled = false; surpriseBtn.textContent = 'Ver sorpresa'; }, 4500);
  });
}

/* -------------------------------
   Confetti system (re-usable)
   ------------------------------- */
function runConfetti(amount = 160){
  for(let i=0;i<amount;i++){
    confettiPieces.push({
      x: random(0, confettiCanvas.width),
      y: random(-confettiCanvas.height, 0),
      w: random(6, 14),
      h: random(6, 14),
      vx: random(-2.5, 2.5),
      vy: random(1, 5),
      r: random(0,360),
      vr: random(-6,6),
      color: `hsl(${random(320,350)},80%,60%)`
    });
  }
  if(!window._confettiRunning){
    window._confettiRunning = true;
    animateConfetti();
  }
}
function animateConfetti(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((p,i)=>{
    p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.r += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();
    if(p.y > confettiCanvas.height + 60) confettiPieces.splice(i,1);
  });
  if(confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
  else window._confettiRunning = false;
}

/* -------------------------------
   Heart spawn (DOM elements)
   ------------------------------- */
function spawnHearts(n=12){
  for(let i=0;i<n;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    const left = random(8,92);
    const scale = random(.7,1.05);
    h.style.left = left + '%';
    h.style.top = '-30px';
    h.style.opacity = 1;
    h.style.zIndex = 120 + i;
    h.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="${i%2 ? '#ff6fa3' : '#ffd1dc'}" d="M12 21s-7.5-4.6-10-7.4C-1 8.8 3 4 6 4c2 0 3 1.6 3 1.6S12 4 15 4c3 0 7 4.8 4 9.6C19.5 16.4 12 21 12 21z"/></svg>`;
    document.body.appendChild(h);

    const dur = random(2400,4200);
    const endY = random(180, 420);
    const endX = left + random(-8, 8);

    h.animate([
      { transform: `translateY(0) scale(${scale})`, opacity: 1 },
      { transform: `translate(${random(-40,40)}px, ${endY}px) scale(${scale+0.08})`, opacity: 0 }
    ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)'});

    setTimeout(()=> { h.remove(); }, dur + 80);
  }
}

/* small burst hearts when clicking special actions */
function playHeartBurst(){
  for(let i=0;i<22;i++){
    const t = document.createElement('div'); t.className = 'heart';
    t.style.left = 50 + (Math.random()*20 - 10) + '%';
    t.style.top = '42%';
    t.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#ff6fa3" d="M12 21s-7.5-4.6-10-7.4C-1 8.8 3 4 6 4c2 0 3 1.6 3 1.6S12 4 15 4c3 0 7 4.8 4 9.6C19.5 16.4 12 21 12 21z"/></svg>`;
    document.body.appendChild(t);
    const dur = 900 + Math.random()*700;
    t.animate([
      { transform: `translate(0,0) scale(.8)`, opacity: 1 },
      { transform: `translate(${random(-240,240)}px, ${random(-240,240)}px) scale(.2)`, opacity: 0 }
    ], { duration: dur, easing: 'ease-out' });
    setTimeout(()=> t.remove(), dur + 80);
  }
}

/* optional keyboard shortcut to test (A = small celebration) */
addEventListener('keydown', (e) => {
  if(e.key.toLowerCase() === 'a'){ spawnHearts(10); runConfetti(60); }
});



// ----------------------------
// PARTICULAS Y ANIMACIÓN DE LANDING
// ----------------------------


// Función para crear partículas flotando
function spawnParticles(n = 20){
  for(let i=0;i<n;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = 100 + Math.random() * 50 + '%';
    p.innerHTML = Math.random() > 0.5 
      ? '💖' 
      : '✨';
    const duration = 4000 + Math.random() * 3000;
    p.style.animationDuration = duration + 'ms';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), duration);
  }
}

// Botón para entrar
startBtn.addEventListener('click', () => {
  spawnParticles(30); // particulas al click
  landing.style.transition = 'opacity 0.7s ease';
  landing.style.opacity = 0;
  setTimeout(() => landing.remove(), 750);
});

  startBtn.addEventListener('click', () => {
    // Llevar al inicio del main container
    document.querySelector('main.container').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // JavaScript mejorado con todas las nuevas funcionalidades

// Elements

const modalDate = document.getElementById('modalDate');

// Helper functions
function random(min,max){ return Math.random()*(max-min)+min; }

// ========================================
// CONTADOR DE TIEMPO JUNTOS
// ========================================
function updateTimeTogether() {
  const startDate = new Date('2025-06-21'); // 21 de junio 2025
  const now = new Date();
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  
  const timeElement = document.querySelector('.time-count');
  if (timeElement) {
    if (diffDays < 30) {
      timeElement.textContent = `${diffDays} días maravillosos`;
    } else {
      timeElement.textContent = `${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'} increíbles`;
    }
  }
}

// ========================================
// SISTEMA DE FILTROS PARA GALERÍA
// ========================================
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const photos = document.querySelectorAll('.photo');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar botones activos
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      // Filtrar fotos con animación
      photos.forEach((photo, index) => {
        const category = photo.getAttribute('data-category');
        
        setTimeout(() => {
          if (filter === 'all' || category === filter) {
            photo.classList.remove('hidden');
            photo.style.opacity = '0';
            photo.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              photo.style.transition = 'all 0.4s ease';
              photo.style.opacity = '1';
              photo.style.transform = 'translateY(0)';
            }, 50);
          } else {
            photo.style.transition = 'all 0.3s ease';
            photo.style.opacity = '0';
            photo.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
              photo.classList.add('hidden');
            }, 300);
          }
        }, index * 50);
      });
    });
  });
}

// ========================================
// ANIMACIONES AL SCROLL (AOS básico)
// ========================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
}

// ========================================
// SISTEMA DE FAVORITOS
// ========================================
let favorites = JSON.parse(localStorage.getItem('ashly-favorites') || '[]');

function toggleFavorite(btn) {
  const photoTitle = document.getElementById('modalTitle').textContent;
  const heartIcon = btn.querySelector('.heart-icon');
  
  if (favorites.includes(photoTitle)) {
    favorites = favorites.filter(fav => fav !== photoTitle);
    heartIcon.textContent = '🤍';
    btn.classList.remove('favorited');
  } else {
    favorites.push(photoTitle);
    heartIcon.textContent = '❤️';
    btn.classList.add('favorited');
    
    // Efecto especial al marcar como favorito
    spawnHearts(8);
  }
  
  localStorage.setItem('ashly-favorites', JSON.stringify(favorites));
}

// ========================================
// EFECTOS ROMÁNTICOS MEJORADOS
// ========================================

// Corazones mejorados
function spawnHearts(n = 12) {
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    const left = random(5, 95);
    const scale = random(0.8, 1.2);
    h.style.left = left + '%';
    h.style.top = '-40px';
    h.style.opacity = 1;
    h.style.zIndex = 120 + i;
    
    const heartEmojis = ['💖', '💕', '💗', '💓', '💘', '✨', '💫', '🌟'];
    const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    h.innerHTML = `<span style="font-size: ${20 + Math.random() * 15}px;">${emoji}</span>`;
    document.body.appendChild(h);

    const dur = random(3000, 5000);
    const endY = random(200, 500);
    const endX = left + random(-60, 60);

    h.animate([
      { transform: `translateY(0) scale(${scale})`, opacity: 1 },
      { transform: `translate(${endX - left}%, ${endY}px) scale(${scale * 0.5}) rotate(360deg)`, opacity: 0 }
    ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)' });

    setTimeout(() => { h.remove(); }, dur + 100);
  }
}

// Confetti mejorado
function runConfetti(amount = 160) {
  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: random(0, confettiCanvas.width),
      y: random(-confettiCanvas.height, 0),
      w: random(6, 16),
      h: random(6, 16),
      vx: random(-3, 3),
      vy: random(1, 6),
      r: random(0, 360),
      vr: random(-8, 8),
      color: `hsl(${random(300, 360)}, ${random(70, 100)}%, ${random(50, 80)}%)`
    });
  }
  if (!window._confettiRunning) {
    window._confettiRunning = true;
    animateConfetti();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.r += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
    if (p.y > confettiCanvas.height + 100) confettiPieces.splice(i, 1);
  });
  if (confettiPieces.length > 0) requestAnimationFrame(animateConfetti);
  else window._confettiRunning = false;
}

// ========================================
// EVENT LISTENERS
// ========================================

// Landing button con efectos especiales
startBtn.addEventListener('click', () => {
  // Explosión de elementos románticos
  spawnHearts(50);
  runConfetti(200);
  
  // Efecto en el botón
  startBtn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    startBtn.style.transform = 'scale(1.05)';
  }, 100);
  
  // Crear explosión radial
  const romanticItems = ['💖', '🌹', '✨', '💕', '🎵', '🌸'];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const item = document.createElement('div');
      item.style.position = 'fixed';
      item.style.left = '50%';
      item.style.top = '50%';
      item.style.fontSize = '24px';
      item.style.zIndex = '1000';
      item.style.pointerEvents = 'none';
      item.textContent = romanticItems[Math.floor(Math.random() * romanticItems.length)];
      document.body.appendChild(item);
      
      const angle = (i / 15) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      item.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(1.5)`, opacity: 0 }
      ], {
        duration: 2000,
        easing: 'cubic-bezier(.2,.8,.2,1)'
      });
      
      setTimeout(() => item.remove(), 2200);
    }, i * 60);
  }
  
  // Transición del landing
  landing.style.transition = 'all 1s cubic-bezier(0.2, 0.9, 0.2, 1)';
  landing.style.opacity = '0';
  landing.style.transform = 'scale(0.8)';
  
  setTimeout(() => { 
    landing.remove(); 
    document.querySelector('main.container').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 1000);
});

// Gallery modal con favoritos
gallery.querySelectorAll('.photo').forEach(photo => {
  photo.addEventListener('click', () => {
    const img = photo.querySelector('img').getAttribute('src');
    const title = photo.getAttribute('data-title') || '';
    const desc = photo.getAttribute('data-desc') || '';
    const category = photo.getAttribute('data-category') || '';
    
    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalDate.textContent = category;
    
    // Actualizar estado de favorito
    const favoriteBtn = document.querySelector('.favorite-btn');
    const heartIcon = favoriteBtn.querySelector('.heart-icon');
    if (favorites.includes(title)) {
      heartIcon.textContent = '❤️';
      favoriteBtn.classList.add('favorited');
    } else {
      heartIcon.textContent = '🤍';
      favoriteBtn.classList.remove('favorited');
    }
    
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    spawnHearts(6);
  });
});

// Modal close
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { 
  if (e.key === 'Escape') closeModal(); 
});

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

// Efectos interactivos
document.addEventListener('click', (e) => {
  if (e.target.closest('.moment-card, .promise, .spotify-btn')) {
    spawnHearts(5);
    if (Math.random() > 0.7) {
      runConfetti(30);
    }
  }
});

// Efectos al scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (Math.abs(currentScrollY - lastScrollY) > 150) {
    if (Math.random() > 0.9) {
      spawnHearts(2);
    }
    lastScrollY = currentScrollY;
  }
});

// Atajos de teclado
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'a') { 
    spawnHearts(15); 
    runConfetti(100); 
  }
  if (e.key.toLowerCase() === 'l') {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        spawnHearts(10);
        runConfetti(50);
      }, i * 300);
    }
  }
});

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  updateTimeTogether();
  initGalleryFilters();
  initScrollAnimations();
  
  // Actualizar tiempo cada día
  setInterval(updateTimeTogether, 1000 * 60 * 60 * 24);
  
  // Efectos automáticos sutiles
  setInterval(() => {
    if (Math.random() > 0.97) {
      spawnHearts(1);
    }
  }, 15000);
  
  // Navegación suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ========================================
// FUNCIONES GLOBALES
// ========================================

// Función global para favoritos (llamada desde HTML)
window.toggleFavorite = toggleFavorite;

// Prevenir comportamiento por defecto en algunos elementos
document.addEventListener('selectstart', (e) => {
  if (e.target.closest('.heart, .particle')) {
    e.preventDefault();
  }
});

// Optimización de rendimiento
let rafId;
function optimizedAnimation() {
  // Limitar partículas activas
  const hearts = document.querySelectorAll('.heart');
  if (hearts.length > 50) {
    for (let i = 0; i < 10; i++) {
      if (hearts[i]) hearts[i].remove();
    }
  }
}

setInterval(optimizedAnimation, 5000);