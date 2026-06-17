document.addEventListener('DOMContentLoaded', () => {
    
    // --- Header Scroll Effect ---
    const header = document.querySelector('.js-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            header.style.padding = '0';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // --- Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.hidden = true;
            });

            // Add active class to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Show corresponding content
            const targetId = btn.getAttribute('aria-controls');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.hidden = false;
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-fade-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Mobile Menu Toggle (Basic) ---
    const mobileMenuBtn = document.querySelector('.js-mobile-menu');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            // A simple toggle by changing display property for mobile
            if (nav.style.display === 'flex') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'flex';
                nav.style.flexDirection = 'column';
                nav.style.position = 'absolute';
                nav.style.top = '80px';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.padding = '20px';
                nav.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.querySelector('.js-cookie-banner');
    const btnAccept = document.querySelector('.js-cookie-accept');
    const btnDecline = document.querySelector('.js-cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
        // Small delay to allow CSS transition
        setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    const hideCookieBanner = (status) => {
        localStorage.setItem('cookieConsent', status);
        cookieBanner.classList.remove('show');
        setTimeout(() => cookieBanner.hidden = true, 500);
    };

    if (btnAccept) {
        btnAccept.addEventListener('click', () => hideCookieBanner('accepted'));
    }
    if (btnDecline) {
        btnDecline.addEventListener('click', () => hideCookieBanner('declined'));
    }
});
