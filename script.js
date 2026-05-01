/* ============================================
   Venkat Teja — Portfolio
   ============================================ */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   THREE.JS — Morphing wireframe sphere
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

    const color = 0x14b8a6;

    // Morphing icosahedron
    const geo = new THREE.IcosahedronGeometry(2, 2);
    const mat = new THREE.MeshPhysicalMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
        metalness: 0.2,
        roughness: 0.8,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const positions = geo.attributes.position;
    const original = positions.array.slice();
    const offsets = new Float32Array(original.length);
    for (let i = 0; i < offsets.length; i++) {
        offsets[i] = 0.5 + Math.random() * 1.5;
    }

    // Inner glow
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.03,
        wireframe: false,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // Rings
    const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
    });
    const r1 = new THREE.Mesh(new THREE.RingGeometry(2.5, 2.6, 80), ringMat);
    r1.rotation.x = Math.PI / 3;
    scene.add(r1);
    const r2 = new THREE.Mesh(new THREE.RingGeometry(3.0, 3.05, 80), ringMat);
    r2.rotation.z = Math.PI / 3;
    r2.rotation.x = Math.PI / 4;
    r2.material = ringMat.clone();
    r2.material.opacity = 0.08;
    scene.add(r2);

    // Particles
    const count = 250;
    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        const r = 4 + Math.random() * 6;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        pPos[i * 3] = r * Math.sin(p) * Math.cos(t);
        pPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        pPos[i * 3 + 2] = r * Math.cos(p);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.02,
        color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.pageYOffset; }, { passive: true });

    let t = 0;
    function animate() {
        requestAnimationFrame(animate);
        t += 0.005;

        tx += (mx - tx) * 0.02;
        ty += (my - ty) * 0.02;

        const pos = geo.attributes.position;
        const arr = pos.array;
        for (let i = 0; i < arr.length; i += 3) {
            const idx = i / 3;
            const m = 1 + Math.sin(t + idx * 0.3) * 0.3 * offsets[idx];
            arr[i] = original[i] * m;
            arr[i + 1] = original[i + 1] * m;
            arr[i + 2] = original[i + 2] * m;
        }
        pos.needsUpdate = true;

        mesh.rotation.x += 0.002 + ty * 0.01;
        mesh.rotation.y += 0.004 + tx * 0.01;
        inner.rotation.x += 0.001;
        inner.rotation.y += 0.002;
        r1.rotation.z += 0.002;
        r2.rotation.y += 0.001;

        const sy = scrollY * 0.0003;
        mesh.position.y = -sy;
        inner.position.y = -sy;
        r1.position.y = -sy;
        r2.position.y = -sy;

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
   GSAP
   ============================================ */
if (!prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
        .to('.hero-badge', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
        .to('.hero-row', { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, '-=0.3')
        .to('.hero-text', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.hero-links', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');

    gsap.utils.toArray('[data-reveal]').forEach((el) => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            onEnter: () => el.classList.add('revealed'),
        });
    });

    const header = document.querySelector('.header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const cur = window.pageYOffset;
        header.style.transform = cur > lastScroll && cur > 200 ? 'translateY(-100%)' : 'translateY(0)';
        header.style.transition = 'transform 0.4s var(--ease)';
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

console.log('Portfolio loaded');