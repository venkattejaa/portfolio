/* ============================================
   3D Cinematic Portfolio
   Three.js + GSAP ScrollTrigger
   ============================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   THREE.JS 3D SCENE
   ============================================ */
if (!prefersReduced && window.innerWidth > 768) {
    const container = document.getElementById('three-canvas');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    
    // Gold torus knot
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        emissive: 0xd4af37,
        emissiveIntensity: 0.05,
        envMapIntensity: 1.5,
    });
    
    const torus = new THREE.Mesh(geometry, material);
    torus.position.y = 0.5;
    scene.add(torus);
    
    // Secondary inner ring
    const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 64, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        transparent: true,
        opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.5;
    scene.add(ring);
    
    // Particles
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xd4af37,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    
    // Lights
    const ambient = new THREE.AmbientLight(0x222222);
    scene.add(ambient);
    
    const keyLight = new THREE.DirectionalLight(0xd4af37, 1.5);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight(0x4444ff, 0.5);
    fillLight.position.set(-3, 1, -2);
    scene.add(fillLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, -2, 3);
    scene.add(rimLight);
    
    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Scroll effect
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;
        
        torus.rotation.x += 0.005;
        torus.rotation.y += 0.008;
        
        ring.rotation.z += 0.001;
        
        // Follow mouse with lag
        torus.rotation.x += targetY * 0.02;
        torus.rotation.y += targetX * 0.03;
        
        // Parallax on scroll
        const offset = scrollY * 0.0005;
        torus.position.y = 0.5 - offset;
        ring.position.y = 0.5 - offset;
        
        // Subtle float
        const time = Date.now() * 0.0005;
        torus.position.y += Math.sin(time) * 0.03;
        
        torus.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);
        
        particles.rotation.x += 0.0002;
        particles.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ============================================
   GSAP SCROLL ANIMATIONS
   ============================================ */
if (!prefersReduced) {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl
        .to('.hero-badge', { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            delay: 0.3
        })
        .to('.hero-title .line', {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
        }, '-=0.4')
        .to('.hero-sub', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.6')
        .to('.hero-desc', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.5')
        .to('.hero-actions', {
            opacity: 1,
            y: 0,
            duration: 0.8,
        }, '-=0.4');
    
    // Reveal elements on scroll
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('revealed'),
        });
    });
    
    // Project cards stagger
    const cards = document.querySelectorAll('.project-card');
    if (cards.length) {
        ScrollTrigger.create({
            trigger: '.projects-grid',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(cards, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                });
            },
        });
    }
    
    // Stats counter (vanilla JS)
    const statNums = document.querySelectorAll('.stat-num');
    statNums.forEach((el) => {
        const text = el.textContent.trim();
        const isNumeric = !isNaN(parseInt(text));
        
        if (isNumeric) {
            const target = parseInt(text);
            ScrollTrigger.create({
                trigger: el,
                start: 'top 90%',
                onEnter: () => {
                    const duration = 1500;
                    const startTime = performance.now();
                    
                    function update(time) {
                        const elapsed = time - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                },
            });
        }
    });
    
    // Nav hide/show on scroll
    const nav = document.querySelector('.nav-pill');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        nav.style.transform = `translateX(-50%) translateY(${current > lastScroll && current > 200 ? '-120%' : '0'})`;
        nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        lastScroll = current;
    }, { passive: true });
}

/* ============================================
   3D TILT ON CARDS
   ============================================ */
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});

/* ============================================
   SMOOTH SCROLL FOR NAV
   ============================================ */
document.querySelectorAll('.nav-item, .nav-cta-pill, .btn-gold, .btn-outline').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('🎬 3D Cinematic Portfolio Loaded');