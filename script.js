/* ============================================
   Venkat Teja — Portfolio JS
   Three.js morphing background + GSAP animations
   ============================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   THREE.JS — Morphing Wireframe Sphere
   ============================================ */
if (!prefersReduced && window.innerWidth > 768) {
    const container = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Main morphing sphere
    const sphereGeo = new THREE.IcosahedronGeometry(2, 2);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        metalness: 0.3,
        roughness: 0.8,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);
    
    // Store original positions for morphing
    const positions = sphereGeo.attributes.position;
    const originalPos = positions.array.slice();
    const randomOffsets = new Float32Array(originalPos.length);
    for (let i = 0; i < randomOffsets.length; i++) {
        randomOffsets[i] = 0.5 + Math.random() * 1.5;
    }
    
    // Inner solid sphere (faint glow)
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.04,
        wireframe: false,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);
    
    // Outer ring
    const ringGeo = new THREE.TorusGeometry(2.8, 0.015, 32, 100);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);
    
    // Second ring perpendicular
    const ring2Geo = new THREE.TorusGeometry(3, 0.01, 32, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.1,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.z = Math.PI / 3;
    ring2.rotation.x = Math.PI / 4;
    scene.add(ring2);
    
    // Particles
    const particleCount = 300;
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        const radius = 4 + Math.random() * 6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pPos[i * 3 + 2] = radius * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.025,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    
    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Scroll offset
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
    }, { passive: true });
    
    // Animation loop
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.005;
        
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;
        
        // Morph sphere
        const pos = sphereGeo.attributes.position;
        const array = pos.array;
        for (let i = 0; i < array.length; i += 3) {
            const idx = i / 3;
            const x = originalPos[i];
            const y = originalPos[i + 1];
            const z = originalPos[i + 2];
            
            const morph = Math.sin(time + idx * 0.3) * 0.3 * randomOffsets[idx];
            const dist = 1 + morph;
            
            array[i] = x * dist;
            array[i + 1] = y * dist;
            array[i + 2] = z * dist;
        }
        pos.needsUpdate = true;
        
        // Rotate everything
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.004;
        innerSphere.rotation.x += 0.001;
        innerSphere.rotation.y += 0.002;
        ring.rotation.z += 0.003;
        ring2.rotation.y += 0.002;
        
        // Mouse follow
        sphere.rotation.x += targetY * 0.01;
        sphere.rotation.y += targetX * 0.015;
        
        // Parallax on scroll
        sphere.position.y = -scrollY * 0.0003;
        innerSphere.position.y = -scrollY * 0.0003;
        ring.position.y = -scrollY * 0.0003;
        ring2.position.y = -scrollY * 0.0003;
        
        // Slow particle rotation
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0002;
        
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
   GSAP ANIMATIONS
   ============================================ */
if (!prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero reveal
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
        .to('.hero-tag', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
        .to('.hero-line', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, '-=0.3')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.hero-quick', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    
    // Scroll reveal
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('revealed'),
        });
    });
    
    // Nav hide/show
    const nav = document.querySelector('.nav-bar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        const transform = current > lastScroll && current > 200 ? 'translateY(-100%)' : 'translateY(0)';
        nav.style.transform = transform;
        nav.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        lastScroll = current;
    }, { passive: true });
}

/* ============================================
   Smooth scroll
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('⚡ Portfolio loaded');