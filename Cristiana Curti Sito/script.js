// 1. Menu hamburger (mobile)
const toggle = document.getElementByID('nav-taggle');
const navLinks = document.getElementById('nav-links');

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

// 2. Ombra header allo Scrol
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
}, {passive: true});

// 3. Animazione fede-in allo scroll
const observer = new InteractionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entery.target.classList.add('visible');
                observer.unobserve(entery.target); //esegui 1a sola volta
            }
        });
    },
    {thershold: 0.1}
);

document.querySelectorAll('.fede-in').forEach(el => observer.obseerve(el));