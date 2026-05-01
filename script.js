/* ============================================
   Venkat Teja — Cinematic Portfolio
   Starfield galaxy + dramatic letter reveals
   ============================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   REALISTIC SPACE SCENE
   Deep galaxy with spiral arms, nebulas, star types
   ============================================ */
if (!prefersReduced && window.innerWidth > 768) {
    const canvas = document.getElementById('starfield');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ─── Stars with realistic distribution ───
    const starCount = 7000;
    const starGeo = new THREE.BufferGeometry();
    const posArr = new Float32Array(starCount * 3);
    const colArr = new Float32Array(starCount * 3);
    const sizeArr = new Float32Array(starCount);

    // Star type distribution (realistic: mostly M-dwarfs, some giants)
    const starTypes = [
        { color: [0.4, 0.3, 0.2], sizeRange: [0.1, 0.15], weight: 0.08 },  // Red dwarf
        { color: [0.9, 0.7, 0.5], sizeRange: [0.15, 0.25], weight: 0.1 },  // Orange dwarf
        { color: [1, 0.95, 0.8], sizeRange: [0.2, 0.4], weight: 0.25 },    // Yellow (G-type)
        { color: [0.95, 0.9, 1], sizeRange: [0.15, 0.3], weight: 0.25 },    // White (F-type)
        { color: [0.8, 0.85, 1], sizeRange: [0.25, 0.5], weight: 0.15 },    // Blue-white
        { color: [0.5, 0.6, 1], sizeRange: [0.3, 0.6], weight: 0.1 },       // Blue
        { color: [1, 0.2, 0.05], sizeRange: [0.4, 0.8], weight: 0.04 },     // Red giant
        { color: [0.3, 0.5, 1], sizeRange: [0.5, 1], weight: 0.03 },        // Blue giant
    ];

    // Cumulative weights
    const cumWeights = [];
    let totalW = 0;
    starTypes.forEach(t => { totalW += t.weight; cumWeights.push(totalW); });

    function pickStarType() {
        const r = Math.random() * totalW;
        for (let i = 0; i < cumWeights.length; i++) {
            if (r < cumWeights[i]) return starTypes[i];
        }
        return starTypes[0];
    }

    for (let i = 0; i < starCount; i++) {
        // Galaxy disk shape: dense center, thin disk
        const isCore = i < starCount * 0.1;
        let radius, theta, phi;

        if (isCore) {
            // Dense galactic core
            radius = 2 + Math.random() * 6;
            theta = Math.random() * Math.PI * 2;
            phi = Math.acos(2 * Math.random() - 1);
        } else {
            // Spiral disk with arms
            const armOffset = ((i - starCount * 0.1) % 4) * 0.5; // 4 spiral arms
            const dist = 6 + Math.random() * 50;
            const spiralAngle = dist * 0.3 + armOffset + (Math.random() - 0.5) * 0.3;
            radius = dist;
            theta = spiralAngle;
            phi = Math.PI / 2 + (Math.random() - 0.5) * 0.15; // thin disk
        }

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi) * (isCore ? 0.8 : 0.15);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        posArr[i * 3] = x;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = z;

        const type = pickStarType();
        const c = type.color;
        const size = type.sizeRange[0] + Math.random() * (type.sizeRange[1] - type.sizeRange[0]);

        colArr[i * 3] = c[0];
        colArr[i * 3 + 1] = c[1];
        colArr[i * 3 + 2] = c[2];
        sizeArr[i] = size;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizeArr, 1));

    const starMat = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ─── Deep nebula glow layers ───
    function createNebula(count, color, size, opacity, spread, flatten) {
        const g = new THREE.BufferGeometry();
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            const r = spread[0] + Math.random() * (spread[1] - spread[0]);
            const t = Math.random() * Math.PI * 2;
            const ph = Math.acos(2 * Math.random() - 1);
            p[i] = r * Math.sin(ph) * Math.cos(t);
            p[i + 1] = r * Math.cos(ph) * flatten;
            p[i + 2] = r * Math.sin(ph) * Math.sin(t);
        }
        g.setAttribute('position', new THREE.BufferAttribute(p, 3));
        const m = new THREE.PointsMaterial({ size, color, transparent: true, opacity, blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false });
        return new THREE.Points(g, m);
    }

    const nebCore = createNebula(800, 0xa78bfa, 1.0, 0.12, [3, 12], 0.5);
    const nebMid = createNebula(600, 0x818cf8, 0.8, 0.08, [8, 25], 0.3);
    const nebOuter = createNebula(400, 0x6366f1, 0.6, 0.05, [20, 45], 0.2);
    const nebWarm = createNebula(300, 0xf472b6, 0.7, 0.04, [15, 35], 0.3);

    scene.add(nebCore);
    scene.add(nebMid);
    scene.add(nebOuter);
    scene.add(nebWarm);

    // ─── Dust lane particles ───
    const dustCount = 2000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
        const r = 4 + Math.random() * 40;
        const t = Math.random() * Math.PI * 2;
        const yOff = (Math.random() - 0.5) * 0.4;
        dustPos[i * 3] = r * Math.cos(t);
        dustPos[i * 3 + 1] = yOff;
        dustPos[i * 3 + 2] = r * Math.sin(t);
        dustSizes[i] = 0.05 + Math.random() * 0.15;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
        depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ─── Mouse + scroll ───
    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; }, { passive: true });

    // ─── Animation ───
    function animate() {
        requestAnimationFrame(animate);

        tx += (mx - tx) * 0.008;
        ty += (my - ty) * 0.008;

        stars.rotation.y += 0.00015 + tx * 0.0001;
        stars.rotation.x += ty * 0.00004;

        nebCore.rotation.y += 0.0003;
        nebMid.rotation.y -= 0.0002;
        nebOuter.rotation.y += 0.00015;
        nebWarm.rotation.y += 0.0001;

        dust.rotation.y += 0.00005;

        const sy = scrollY * 0.00015;
        stars.position.y = -sy;
        nebCore.position.y = -sy;
        nebMid.position.y = -sy;
        nebOuter.position.y = -sy;
        nebWarm.position.y = -sy;
        dust.position.y = -sy;

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