      const hamburger = document.getElementById('hamburger');
      const sidebar   = document.getElementById('sidebar');
      const overlay   = document.getElementById('sidebar-overlay');
 
      function openSidebar() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
 
        function closeSidebar() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        sidebar.classList.remove('open');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
 
        hamburger.addEventListener('click', () => {
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
 
overlay.addEventListener('click', closeSidebar);

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    backToTopButton.classList.remove('hidden');
  } else {
    backToTopButton.classList.add('hidden');
  }
});


/* LINKTREE animation */

document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('lightning-svg');
  const scene = document.getElementById('links-scene');
  const titleWrap = document.querySelector('.links-title-wrap');
  const cards = [
    { id: 'card-kofi', boltId: 'bolt-kofi' },
    { id: 'card-instagram', boltId: 'bolt-instagram' },
    { id: 'card-discord', boltId: 'bolt-discord' },
  ];

  function centerOf(el) {
    const sceneRect = scene.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - sceneRect.left + elRect.width / 2,
      y: elRect.top - sceneRect.top + elRect.height / 2,
    };
  }

  function lightningPath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = 5;
    const jitter = 18;
    let d = `M ${x1} ${y1}`;
    
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const mx = x1 + dx * t + (Math.random() - 0.5) * jitter * 2;
      const my = y1 + dy * t + (Math.random() - 0.5) * jitter;
      d += ` L ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }

    d += ` L ${x2} ${y2}`;
    return d;
  }

  function drawBolts() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const origin = centerOf(titleWrap);
    const ox = origin.x;
    const oy = origin.y + titleWrap.getBoundingClientRect().height / 2 + 10;
 
    cards.forEach(({ id, boltId }) => {
        const cardEl = document.getElementById(id);
        if (!cardEl) return;
 
        const dest = centerOf(cardEl);
        const tx = dest.x;
        const ty = dest.y - cardEl.getBoundingClientRect().height / 2;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', lightningPath(ox, oy, tx, ty));
        path.setAttribute('id', boltId);
        path.classList.add('lightning-bolt');
        svg.appendChild(path);
  });
}

  cards.forEach(({id, boltId}) => {
    const cardEl = document.getElementById(id);
    if (!cardEl) return;

    cardEl.addEventListener('mouseenter', () => {
      const bolt = document.getElementById(boltId);
      if (bolt) bolt.classList.add('lit');
    });

    cardEl.addEventListener('mouseleave', () => {
      const bolt = document.getElementById(boltId);
      if (bolt) bolt.classList.remove('lit');
  });
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawBolts, 150);
});

setTimeout(drawBolts, 100);

});