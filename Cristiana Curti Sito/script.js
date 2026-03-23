document.addEventListener('DOMContentLoaded', () => {

// ================================================
// 1. MENU HAMBURGER (mobile)
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
// 3. ANIMAZIONE FADE-IN
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
    tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    tabPanels.forEach(panel => {
        if (panel.id === targetId) {
            panel.classList.remove('hidden');
            panel.querySelectorAll('.fade-in').forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 50);
            });
        } else {
            panel.classList.add('hidden');
        }
    });
    const activeBtn = document.querySelector(`.tab-btn[aria-controls="${targetId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
    }
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('aria-controls'));
    });
});

// ================================================
// 5. DROPDOWN NAVBAR
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

    dropBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        closeAllDropdowns();
        if (!isOpen) {
            dropdown.classList.add('open');
            dropBtn.setAttribute('aria-expanded', 'true');
        }
    });

    dropdown.querySelectorAll('.nav-dropdown-menu a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.stopPropagation();
            const href = a.getAttribute('href');

            closeAllDropdowns();

            // Chiudi hamburger su mobile
            if (toggle && navLinks) {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            }

            // Attiva tab corretto e scrolla alla sezione
            const targetTab = a.getAttribute('data-tab');
            if (targetTab) {
                switchTab(targetTab);
                document.getElementById('servizi')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Chiudi dropdown cliccando fuori
document.addEventListener('click', () => {
    closeAllDropdowns();
});

});