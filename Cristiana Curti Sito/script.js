// 1. Menu hamburger (mobile)
const toggle = document.getElementByID('nav-taggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
    toggel.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        navLinks.classList.toggle('open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
} );

// chiudi menu click link
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click' () => {
            toggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
    });
  });
}

// 2. Ombra header allo Scrol
const header = document.getElementById('site-header');

if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, {passive: true});
}

// 3. Animazione fede-in allo scroll
function activateFadeIns() {
    const elements = document.querySelectorAll('.fade-in';
        if (!elements.length) return;
        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('visible'));
            return;
        }
    )

    const observer = new InteractionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entery.target.classList.add('visible');
                    observer.unobserve(entery.target); //esegui 1a sola volta
                }
            });
        },
        {thershold: 0,
            rootMargin: '0px 0px -30px 0px'
        }
    );
    elements.forEach(el => observer.observe(el));

    setTimeout(() => {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (inViewport && !el.classList.contains('visibe')) {
                el.classList.add('visible');
            }
        });
    }, 400);
}

// avvia quando DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activateFadeIns);
} else {
    activateFadeIns();
}
