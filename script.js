/* ============================================
   Krovlya-K — Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- HEADER SCROLL EFFECT ----
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ---- BURGER MENU ----
  const burgerBtn = document.getElementById('burger-btn');
  const navLinks  = document.getElementById('nav-links');

  burgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', isOpen);
    const spans = burgerBtn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burgerBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#main-nav') && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burgerBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // ---- PHONE COPY ----
  const copyBtn     = document.getElementById('phone-copy-btn');
  const copyTooltip = document.getElementById('copy-tooltip');
  const PHONE_NUM   = '+79015760750';

  function showCopyFeedback() {
    copyTooltip.classList.add('show');
    setTimeout(() => copyTooltip.classList.remove('show'), 2000);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async e => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(PHONE_NUM);
        showCopyFeedback();
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = PHONE_NUM;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showCopyFeedback();
      }
    });
  }

  // Long-press on the phone link also copies
  const headerPhone = document.getElementById('header-phone');
  if (headerPhone) {
    let pressTimer;
    headerPhone.addEventListener('touchstart', () => {
      pressTimer = setTimeout(async () => {
        try { await navigator.clipboard.writeText(PHONE_NUM); } catch {}
        showCopyFeedback();
      }, 600);
    }, { passive: true });
    headerPhone.addEventListener('touchend', () => clearTimeout(pressTimer), { passive: true });
  }

  // ---- COUNTER ANIMATION ----
  const animateCounters = () => {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target   = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start    = performance.now();
      const step = now => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  const heroObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(animateCounters, 600);
      heroObs.disconnect();
    }
  }, { threshold: 0.3 });
  const heroSection = document.getElementById('hero');
  if (heroSection) heroObs.observe(heroSection);

  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll(
    '.service-card,.why-card,.portfolio-item,.process-step,.review-card,.contact-item,.faq-item,.usp-item'
  );
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = Array.from(el.parentElement.children).indexOf(el) * 80;
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    revealObs.observe(el);
  });

  // ---- FAQ ACCORDION ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close others
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      btn.setAttribute('aria-expanded', !isOpen);
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });

  // ---- PORTFOLIO FILTER ----
  const filterBtns     = document.querySelectorAll('.pf-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.opacity   = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ---- FORM HANDLING ----
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    // Phone mask
    const phoneInput = document.getElementById('form-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.startsWith('8') || v.startsWith('7')) v = '7' + v.slice(1);
        if (!v.startsWith('7')) v = '7' + v;
        let f = '+7';
        if (v.length > 1) f += ' (' + v.slice(1, 4);
        if (v.length >= 4) f += ') ' + v.slice(4, 7);
        if (v.length >= 7) f += '-' + v.slice(7, 9);
        if (v.length >= 9) f += '-' + v.slice(9, 11);
        e.target.value = f;
      });
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();

      let valid = true;
      [{ el: document.getElementById('form-name'), check: !!name },
       { el: phoneInput, check: phone.length >= 16 }].forEach(({ el, check }) => {
        if (!check) {
          valid = false;
          el.style.borderColor = '#ef4444';
          el.style.animation = 'shake 0.4s ease';
          setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 600);
        }
      });
      if (!valid) return;

      const submitBtn = document.getElementById('form-submit');
      submitBtn.textContent = 'Отправляем…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      }, 1200);
    });
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.header-nav').offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 12, behavior: 'smooth' });
    });
  });

  // ---- FLOATING CTA & BACK TO TOP VISIBILITY ----
  const floatingCta = document.getElementById('floating-cta');
  const backToTop   = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      floatingCta.style.opacity   = '1';
      floatingCta.style.transform = 'translateY(0)';
      backToTop.classList.add('show');
    } else {
      floatingCta.style.opacity   = '0';
      floatingCta.style.transform = 'translateY(20px)';
      backToTop.classList.remove('show');
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- ACTIVE NAV ON SCROLL ----
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // ---- COOKIE CONSENT ----
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept-btn');

  if (cookieBanner && cookieAcceptBtn) {
    const isCookieAccepted = localStorage.getItem('cookie_accepted');
    if (!isCookieAccepted) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1500);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_accepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

});

// ---- INJECTED STYLES ----
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }
  .nav-link.active { color: var(--or-600); }
  .nav-link.active::after { width: 100%; }
  .portfolio-item { transition: opacity .3s ease, transform .3s ease; }
`;
document.head.appendChild(style);
