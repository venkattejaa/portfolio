document.addEventListener('DOMContentLoaded', () => {
  // 0. Toast Notification System
  function showToast(msg, duration = 4000) {
    let toast = document.getElementById('portfolio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'portfolio-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 10000;
        background: rgba(15, 14, 26, 0.95);
        color: #00ff99;
        border: 1px solid rgba(0, 255, 153, 0.4);
        backdrop-filter: blur(16px);
        padding: 14px 22px;
        border-radius: 12px;
        font-family: ui-sans-serif, system-ui, sans-serif;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(0,255,153,0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateY(100px);
        opacity: 0;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = msg;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, duration);
  }

  // 1. Theme Switcher System
  const activeTheme = localStorage.getItem('portfolio_theme') || 'theme-purple';
  document.body.classList.add(activeTheme);

  const toolbar = document.createElement('div');
  toolbar.className = 'theme-picker-toolbar';
  toolbar.innerHTML = `
    <span style="font-size: 11px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 4px;">Theme:</span>
    <button class="theme-btn purple ${activeTheme === 'theme-purple' ? 'active' : ''}" title="Cyberpunk Purple & Cyan" data-theme="theme-purple"></button>
    <button class="theme-btn amber ${activeTheme === 'theme-amber' ? 'active' : ''}" title="Solar Amber & Orange" data-theme="theme-amber"></button>
    <button class="theme-btn blue ${activeTheme === 'theme-blue' ? 'active' : ''}" title="Ocean Ice Blue & Teal" data-theme="theme-blue"></button>
    <button class="theme-btn coral ${activeTheme === 'theme-coral' ? 'active' : ''}" title="Sunset Coral & Magenta" data-theme="theme-coral"></button>
  `;
  document.body.appendChild(toolbar);

  toolbar.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.body.classList.remove('theme-purple', 'theme-amber', 'theme-blue', 'theme-coral');
      document.body.classList.add(theme);
      localStorage.setItem('portfolio_theme', theme);

      toolbar.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 2. Dynamic Age Calculation (DOB: 2009-01-09)
  const dob = new Date('2009-01-09');
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  document.querySelectorAll('p').forEach(p => {
    if (p.textContent.trim() === 'Age' || p.textContent.trim() === 'Нас') {
      const statSpan = p.previousElementSibling || p.parentElement.querySelector('span');
      if (statSpan) {
        statSpan.textContent = age;
      }
    }
  });

  // 3. Music Player Simulation
  const musicWidget = document.querySelector('.lucide-play, .lucide-pause')?.closest('button');
  let isPlaying = false;
  if (musicWidget) {
    musicWidget.addEventListener('click', () => {
      isPlaying = !isPlaying;
      const icon = musicWidget.querySelector('svg');
      if (icon) {
        if (isPlaying) {
          icon.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause h-4 w-4 text-accent"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        } else {
          icon.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play h-4 w-4 text-accent"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`;
        }
      }
    });
  }

  // 4. Contact Form & Send Mail Button Fix
  const contactForm = document.getElementById('contact-form') || document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = contactForm.querySelector('#firstname') || contactForm.querySelector('input[type="text"]');
      const emailInput = contactForm.querySelector('#email') || contactForm.querySelector('input[type="email"]');
      const contentInput = contactForm.querySelector('#content') || contactForm.querySelector('textarea');

      const name = nameInput ? nameInput.value.trim() : 'Visitor';
      const email = emailInput ? emailInput.value.trim() : '';
      const content = contentInput ? contentInput.value.trim() : '';

      const targetEmail = 'sugalivenkatatejanaik@gmail.com';
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent('Portfolio Contact from ' + name)}&body=${encodeURIComponent(content + '\n\nSender Email: ' + email + '\nSender Name: ' + name)}`;

      showToast(`✉️ Launching email client to send message to ${targetEmail}...`);
      window.location.href = mailtoUrl;
    });
  }

  // 5. Copy Email Buttons
  document.querySelectorAll('button, .copy-email-btn').forEach(btn => {
    if (btn.textContent.includes('Copy my email') || btn.classList.contains('copy-email-btn') || btn.querySelector('.lucide-copy') || btn.getAttribute('title') === 'Copy email') {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const primaryEmail = 'sugalivenkatatejanaik@gmail.com';
        navigator.clipboard.writeText(primaryEmail).then(() => {
          showToast(`📋 Copied ${primaryEmail} to clipboard!`);
        }).catch(() => {
          showToast(`Email: ${primaryEmail}`);
        });
      });
    }
  });

  // 6. Certificate Lightbox Modal Showcase
  const certModal = document.createElement('div');
  certModal.id = 'cert-modal';
  certModal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(5, 5, 12, 0.88);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  `;
  certModal.innerHTML = `
    <div style="position: relative; max-width: 900px; width: 100%; background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: rgba(15,23,42,0.9); border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div>
          <h3 id="cert-modal-title" style="color: #fff; font-weight: 700; font-size: 18px; margin: 0;">Certificate Preview</h3>
          <p id="cert-modal-issuer" style="color: #00ff99; font-size: 13px; margin: 2px 0 0 0; font-weight: 600;">Verification Document</p>
        </div>
        <button id="cert-modal-close" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>
      <div style="padding: 20px; text-align: center; max-height: 75vh; overflow-y: auto;">
        <img id="cert-modal-img" src="" alt="Certificate" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
      </div>
    </div>
  `;
  document.body.appendChild(certModal);

  const closeModal = () => {
    certModal.style.opacity = '0';
    certModal.style.pointerEvents = 'none';
  };

  certModal.addEventListener('click', (e) => {
    if (e.target === certModal || e.target.id === 'cert-modal-close') {
      closeModal();
    }
  });

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-cert-img');
      const title = card.getAttribute('data-cert-title') || 'Certificate Verification';
      const issuer = card.getAttribute('data-cert-issuer') || 'Official Credential';

      if (imgSrc) {
        document.getElementById('cert-modal-img').src = imgSrc;
        document.getElementById('cert-modal-title').textContent = title;
        document.getElementById('cert-modal-issuer').textContent = issuer;
        certModal.style.opacity = '1';
        certModal.style.pointerEvents = 'auto';
      }
    });
  });

  // 7. Interactive Greeting Cycler
  const photoBtn = document.querySelector('button[aria-label*="Photo"]');
  if (photoBtn) {
    const greetings = [
      "glad you’re here 🌌",
      "building awesome software 🚀",
      "computer hardware & AI enthusiast ⚡",
      "welcome to my portfolio 👋"
    ];
    let gIdx = 0;
    photoBtn.addEventListener('click', () => {
      gIdx = (gIdx + 1) % greetings.length;
      const textSpan = photoBtn.querySelector('span span');
      if (textSpan) {
        textSpan.textContent = greetings[gIdx];
      }
    });
  }

  // 8. Rotating Trait Text on Personal Page
  const traitEl = document.getElementById('rotating-trait-text');
  if (traitEl) {
    const traits = ["Curious", "Clever", "Passionate", "Creative", "a Builder"];
    let tIdx = 0;
    setInterval(() => {
      tIdx = (tIdx + 1) % traits.length;
      traitEl.style.opacity = '0';
      traitEl.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        traitEl.textContent = traits[tIdx];
        traitEl.style.opacity = '1';
        traitEl.style.transform = 'translateY(0)';
      }, 200);
    }, 2400);
  }
});

