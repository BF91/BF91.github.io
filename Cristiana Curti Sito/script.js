document.addEventListener('DOMContentLoaded', () => {

// ================================================
// 1. HAMBURGER MOBILE
// ================================================
const toggle   = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        navLinks.classList.toggle('open', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Chiudi menu cliccando un link diretto (non quelli del dropdown)
    navLinks.querySelectorAll('a:not(.nav-dropdown-menu a)').forEach(a => {
        a.addEventListener('click', () => {
            toggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ================================================
// 2. OMBRA HEADER ALLO SCROLL
// ================================================
const header = document.getElementById('site-header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}

// ================================================
// 3. FADE-IN ALLO SCROLL
// ================================================
document.body.classList.add('js-ready');
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length) {
    if (!('IntersectionObserver' in window)) {
        fadeEls.forEach(el => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });

        fadeEls.forEach(el => observer.observe(el));

        // Forza visibili gli elementi già in viewport al caricamento
        setTimeout(() => {
            fadeEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('visible');
                }
            });
        }, 400);
    }
}

// ================================================
// 4. TABS SERVIZI
// ================================================
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

function switchTab(targetId) {
    // Aggiorna bottoni
    tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    // Aggiorna pannelli
    tabPanels.forEach(panel => {
        if (panel.id === targetId) {
            panel.classList.remove('hidden');
            // Riattiva le animazioni delle card nel pannello appena aperto
            panel.querySelectorAll('.fade-in').forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 50);
            });
        } else {
            panel.classList.add('hidden');
        }
    });
    // Attiva il bottone corretto
    const activeBtn = document.querySelector(`.tab-btn[aria-controls="${targetId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
    }
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('aria-controls')));
});

// ================================================
// 5. ANTEPRIMA SERVIZI IN HERO
// (i due bottoni nella hero scrollano e aprono il tab giusto)
// ================================================
document.querySelectorAll('.hero-preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        if (targetTab) {
            switchTab(targetTab);
            document.getElementById('servizi')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ================================================
// 6. DROPDOWN NAVBAR
// ================================================
const dropdowns = document.querySelectorAll('.nav-dropdown');

function closeAllDropdowns() {
    dropdowns.forEach(d => {
        d.classList.remove('open');
        const btn = d.querySelector('.nav-dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    });
}

dropdowns.forEach(dropdown => {
    const dropBtn = dropdown.querySelector('.nav-dropdown-toggle');
    if (!dropBtn) return;

    // Click sul toggle: apri/chiudi
    dropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            dropdown.classList.add('open');
            dropBtn.setAttribute('aria-expanded', 'true');
        }
    });

    // Click su una voce del menu
    dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();

            // Chiudi hamburger su mobile
            if (toggle && navLinks) {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            }

            // Attiva tab e scrolla
            const targetTab = a.getAttribute('data-tab');
            if (targetTab) {
                switchTab(targetTab);
                document.getElementById('servizi')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Chiudi dropdown cliccando fuori
document.addEventListener('click', () => closeAllDropdowns());

// ================================================
// 7. TORNA SU
// ================================================
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

}); // fine DOMContentLoaded