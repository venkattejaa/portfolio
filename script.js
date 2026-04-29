/* ============================================
   CINEMATIC PORTFOLIO - JavaScript
   Custom cursor, scroll animations, text effects
   ============================================ */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let cursorX = 0, cursorY = 0;
let outlineX = 0, outlineY = 0;

if (!prefersReducedMotion && window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        // Smooth follow for outline
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Magnetic effect for buttons and links
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            cursorOutline.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            cursorOutline.classList.remove('hover');
        });
    });
}

/* ============================================
   TEXT SPLIT ANIMATION
   ============================================ */
function splitText() {
    const elements = document.querySelectorAll('[data-split-text]');
    
    elements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        
        // Only split hero title - keep about title normal
        const isHeroTitle = el.closest('.hero') !== null;
        
        if (isHeroTitle) {
            // Hero title: words on separate lines with reveal
            const words = text.split(' ');
            words.forEach((word, i) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'title-line';
                wordSpan.style.display = 'block';
                wordSpan.style.overflow = 'hidden';
                
                const inner = document.createElement('span');
                inner.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
                inner.style.display = 'block';
                inner.style.transform = 'translateY(100%)';
                inner.style.transition = `transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
                
                wordSpan.appendChild(inner);
                el.appendChild(wordSpan);
            });
        } else {
            // Other titles: simple fade in
            el.textContent = text;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            // Make visible after a delay
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 200);
        }
    });
}

splitText();

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
const revealElements = document.querySelectorAll('[data-reveal], .eyebrow, .hero-desc, .hero-cta, .stat-item, .line, .visual-bg, .scroll-indicator');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Special handling for title lines
            if (entry.target.classList.contains('title-line')) {
                const inner = entry.target.querySelector('span');
                if (inner) {
                    inner.style.transform = 'translateY(0)';
                }
            }
            
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Trigger hero elements on load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.eyebrow, .hero-desc, .hero-cta, .stat-item, .line, .visual-bg, .scroll-indicator').forEach(el => {
            el.classList.add('visible');
        });
        
        // Animate title lines
        document.querySelectorAll('.title-line').forEach((line, i) => {
            const inner = line.querySelector('span');
            if (inner) {
                setTimeout(() => {
                    inner.style.transform = 'translateY(0)';
                }, i * 150);
            }
        });
    }, 300);
});

/* ============================================
   HORIZONTAL SCROLL GALLERY
   ============================================ */
const galleryWrapper = document.querySelector('.gallery-wrapper');
const galleryTrack = document.querySelector('.gallery-track');

if (galleryWrapper && galleryTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse drag to scroll
    galleryWrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        galleryWrapper.classList.add('active');
        startX = e.pageX - galleryWrapper.offsetLeft;
        scrollLeft = galleryWrapper.scrollLeft;
    });

    galleryWrapper.addEventListener('mouseleave', () => {
        isDown = false;
        galleryWrapper.classList.remove('active');
    });

    galleryWrapper.addEventListener('mouseup', () => {
        isDown = false;
        galleryWrapper.classList.remove('active');
    });

    galleryWrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - galleryWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        galleryWrapper.scrollLeft = scrollLeft - walk;
    });

    // Smooth scroll with GSAP-like easing
    let targetScroll = 0;
    let currentScroll = 0;

    galleryWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetScroll += e.deltaY;
        targetScroll = Math.max(0, Math.min(targetScroll, galleryWrapper.scrollWidth - galleryWrapper.clientWidth));
    }, { passive: false });

    function smoothScroll() {
        currentScroll += (targetScroll - currentScroll) * 0.1;
        galleryWrapper.scrollLeft = currentScroll;
        requestAnimationFrame(smoothScroll);
    }
    smoothScroll();
}

/* ============================================
   PROJECT CARD REVEALS
   ============================================ */
const projectCards = document.querySelectorAll('.project-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

projectCards.forEach(card => cardObserver.observe(card));

/* ============================================
   TEXT SCRAMBLE EFFECT
   ============================================ */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble to eyebrow elements
const scrambleElements = document.querySelectorAll('[data-scramble]');

scrambleElements.forEach(el => {
    const originalText = el.textContent;
    const fx = new TextScramble(el);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fx.setText(originalText);
                observer.unobserve(el);
            }
        });
    });
    
    observer.observe(el);
});

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

const counterElements = document.querySelectorAll('[data-counter] .stat-num');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            entry.target.textContent = '0';
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
let scrollY = 0;
let ticking = false;

function updateParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        const rect = el.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * (speed - 1) * 0.1;
        
        el.style.transform = `translateY(${rate}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

/* ============================================
   SMOOTH SCROLL FOR NAV LINKS
   ============================================ */
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

/* ============================================
   VELOCITY-BASED SKEW ON SCROLL
   ============================================ */
let lastScrollY = 0;
let scrollVelocity = 0;
const skewElements = document.querySelectorAll('.project-card, .about-content');

if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        scrollVelocity = window.pageYOffset - lastScrollY;
        lastScrollY = window.pageYOffset;
        
        const skewAmount = Math.min(Math.max(scrollVelocity * 0.05, -2), 2);
        
        skewElements.forEach(el => {
            el.style.transform = `skewY(${skewAmount}deg)`;
        });
    }, { passive: true });
    
    // Reset skew when scroll stops
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            skewElements.forEach(el => {
                el.style.transform = 'skewY(0deg)';
            });
        }, 100);
    }, { passive: true });
}

/* ============================================
   THREE.JS BACKGROUND (Subtle Particles)
   ============================================ */
if (!prefersReducedMotion && window.innerWidth > 768) {
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        opacity: 0.3;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Gold particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 3;
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.rotation.y += 0.0005;
        
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ============================================
   NAV VISIBILITY ON SCROLL
   ============================================ */
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.opacity = currentScroll > lastScroll ? '0' : '1';
    } else {
        nav.style.opacity = '1';
    }
    
    lastScroll = currentScroll;
}, { passive: true });

nav.style.transition = 'opacity 0.3s ease';

console.log('🎬 Cinematic Portfolio Loaded');
