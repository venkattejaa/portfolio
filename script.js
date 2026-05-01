/* ============================================
   Venkat Teja — Cinematic Portfolio
   Starfield galaxy + dramatic letter reveals
   ============================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   STARFIELD GALAXY
   ============================================ */
if (!prefersReduced && window.innerWidth > 768) {
    const canvas = document.getElementById('starfield');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Starfield
    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
        [1, 1, 1],        // white
        [0.9, 0.85, 1],   // lavender
        [0.75, 0.85, 1],  // blue-white
        [1, 0.95, 0.8],   // warm
        [0.65, 0.5, 1],   // purple
    ];

    for (let i = 0; i < starCount; i++) {
        const radius = 10 + Math.random() * 80;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = radius * Math.cos(phi);
        starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

        const c = palette[Math.floor(Math.random() * palette.length)];
        starColors[i * 3] = c[0];
        starColors[i * 3 + 1] = c[1];
        starColors[i * 3 + 2] = c[2];

        starSizes[i] = 0.5 + Math.random() * 1.5;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMat = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Nebula glow particles (inner dense cluster)
    const nebulaCount = 800;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
        const radius = 8 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        nebulaPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        nebulaPos[i * 3 + 1] = radius * Math.cos(phi) * 0.6;
        nebulaPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));

    const nebulaMat = new THREE.PointsMaterial({
        size: 0.6,
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const nebula = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebula);

    // Second nebula (blue tint)
    const nebulaMat2 = new THREE.PointsMaterial({
        size: 0.4,
        color: 0x818cf8,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });
    const nebula2 = new THREE.Points(nebulaGeo.clone(), nebulaMat2);
    nebula2.rotation.x = 0.8;
    nebula2.rotation.z = 0.5;
    scene.add(nebula2);

    // Shooting stars layer
    const shootCount = 100;
    const shootGeo = new THREE.BufferGeometry();
    const shootPos = new Float32Array(shootCount * 3);
    for (let i = 0; i < shootCount; i++) {
        const r = 30 + Math.random() * 50;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        shootPos[i * 3] = r * Math.sin(p) * Math.cos(t);
        shootPos[i * 3 + 1] = r * Math.cos(p) * 0.3;
        shootPos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
    }
    shootGeo.setAttribute('position', new THREE.BufferAttribute(shootPos, 3));
    const shootMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xc4b5fd,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });
    const shootingStars = new THREE.Points(shootGeo, shootMat);
    scene.add(shootingStars);

    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; }, { passive: true });

    function animate() {
        requestAnimationFrame(animate);

        tx += (mx - tx) * 0.01;
        ty += (my - ty) * 0.01;

        stars.rotation.y += 0.0002 + tx * 0.0001;
        stars.rotation.x += ty * 0.00005;

        nebula.rotation.y += 0.0004;
        nebula.rotation.x += Math.sin(Date.now() * 0.0003) * 0.0002;

        nebula2.rotation.z += 0.0003;

        shootingStars.rotation.y += 0.0001;

        const sy = scrollY * 0.0002;
        stars.position.y = -sy;
        nebula.position.y = -sy;
        nebula2.position.y = -sy;
        shootingStars.position.y = -sy;

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
   CINEMATIC TEXT ANIMATIONS
   ============================================ */
if (!prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
        .set('.hero-tag, .hero-row, .hero-desc, .hero-actions, .hero-links', { opacity: 0, y: 30 })
        .to('.hero-tag', { opacity: 1, y: 0, duration: 0.6, delay: 0.3 })
        .to('.hero-row', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, '-=0.3')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.hero-links', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');

    // Scroll reveal via data-reveal
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('revealed'),
        });
    });

    // Split text animation for [data-split] elements
    function splitAndAnimate(element) {
        const text = element.textContent.trim();
        element.textContent = '';
        element.style.display = 'block';

        const words = text.split(/\s+/);
        words.forEach((word, wi) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.verticalAlign = 'top';
            wordSpan.style.marginRight = '0.3em';

            [...word].forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.transform = 'translateY(105%)';
                charSpan.style.opacity = '0';
                wordSpan.appendChild(charSpan);
            });

            element.appendChild(wordSpan);
        });

        // Animate on scroll
        ScrollTrigger.create({
            trigger: element,
            start: 'top 80%',
            onEnter: () => {
                const chars = element.querySelectorAll('span > span');
                gsap.to(chars, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.02,
                    ease: 'power3.out',
                });
            },
            once: true,
        });
    }

    document.querySelectorAll('[data-split]').forEach(splitAndAnimate);

    // Header hide/show
    const header = document.querySelector('.header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const cur = window.pageYOffset;
        header.style.transform = cur > lastScroll && cur > 200 ? 'translateY(-100%)' : 'translateY(0)';
        header.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        lastScroll = cur;
    }, { passive: true });
}

/* ============================================
   Smooth scroll
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const h = a.getAttribute('href');
        if (h) { e.preventDefault(); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }); }
    });
});

console.log('🌌 Cinematic Portfolio Loaded');