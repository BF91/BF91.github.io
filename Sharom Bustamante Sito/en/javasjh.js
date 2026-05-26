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


/* LINKTREE */

document.addEventListener('DOMContentLoaded', () => {
 
    const svg       = document.getElementById('lightning-svg');
    const scene     = document.getElementById('links-scene');
    const titleWrap = document.getElementById('links-title-wrap');
 
    const cards = [
        { id: 'card-kofi',      boltId: 'bolt-kofi'      },
        { id: 'card-instagram', boltId: 'bolt-instagram'  },
        { id: 'card-discord',   boltId: 'bolt-discord'    },
    ];

    function centerOf(el) {
        const sr = scene.getBoundingClientRect();
        const er = el.getBoundingClientRect();
        return {
            x: er.left - sr.left + er.width  / 2,
            y: er.top  - sr.top  + er.height / 2,
        };
    }
 
    /* ── Path Zigzag ── */
    function lightningPath(x1, y1, x2, y2) {
        const steps  = 14;
        const jitter = 20;
        const dx     = x2 - x1;
        const dy     = y2 - y1;
        const len    = Math.hypot(dx, dy);
        const px     = -dy / len;
        const py     =  dx / len;
        let d        = `M ${x1.toFixed(1)} ${y1.toFixed(1)}`;
 
        for (let i = 1; i < steps; i++) {
            const t      = i / steps;
            const fade   = 1 - Math.abs(t - 0.5) * 1.5;
            const offset = (Math.random() - 0.5) * jitter * 2 * Math.max(fade, 0.2);
            const mx     = x1 + dx * t + px * offset;
            const my     = y1 + dy * t + py * offset;
            d += ` L ${mx.toFixed(1)} ${my.toFixed(1)}`;
        }
 
        d += ` L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
        return d;
    }
 
    /* Bolt Design */
    function drawBolts() {

        while (svg.firstChild) svg.removeChild(svg.firstChild);
 
        if (!titleWrap) return;
 
        const tw = centerOf(titleWrap);
        const twRect = titleWrap.getBoundingClientRect();
        const scRect = scene.getBoundingClientRect();
        const ox = tw.x;
        const oy = tw.y + twRect.height / 2;
 
        cards.forEach(({ id, boltId }) => {
            const cardEl = document.getElementById(id);
            if (!cardEl) return;
 
            const cr  = centerOf(cardEl);
            const crH = cardEl.getBoundingClientRect().height;
            const tx  = cr.x;
            const ty  = cr.y - crH / 2;
 
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', lightningPath(ox, oy, tx, ty));
            path.setAttribute('id', boltId);
            path.classList.add('lightning-bolt');
            svg.appendChild(path);
        });
    }

    cards.forEach(({ id, boltId }) => {
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
 
    /* Automatic Flash */
    function scheduleFlash(boltId, firstDelay) {
        setTimeout(function doFlash() {
            const bolt = document.getElementById(boltId);
 
            if (bolt && !bolt.classList.contains('lit')) {
                /* Pre-flash */
                bolt.classList.add('flash');
                setTimeout(() => bolt.classList.remove('flash'), 70);
                /* Flash principale */
                setTimeout(() => bolt.classList.add('flash'),    160);
                setTimeout(() => bolt.classList.remove('flash'), 250);
            }
 
            setTimeout(doFlash, 8000 + Math.random() * 6000);
        }, firstDelay);
    }
 
    scheduleFlash('bolt-kofi',      1000);
    scheduleFlash('bolt-instagram', 4500);
    scheduleFlash('bolt-discord',   9000);

    /* BG BOLTS */
    function drawDistantBolt() {
      const sceneW = scene.offsetWidth;
      consr sceneH = scene.offsetHeight;

      const x1 = sceneW * (0.1 + Math.random() * 0.8);
      const y1 = sceneH * (0.0 + Math.random() * 0.2);
      const x2 = x1 + (Math.random() - 0.5) * 80;
      const y2 = y1 + 60 + Math.random() * 80;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', lightningPath(x1, y1, x2, y2));
    path.classList.add('lightning-bolt', 'distant-flash');
    path.setAttribute('id', 'distant-' + Date.now());
    svg.appendChild(path);

    setTimeout(() => {
      if (path.parentNode) path.parentNode.removeChild(path);
    }, 300);
  }

    function scheduleDistant() {
      const delay = 5000 + Math.random() * 10000;
      setTimeout(() => {
        if (Math.random() > 0.5) {
          setTimeout(drawDistantBolt, 120);
        }
        scheduleDistant();
      }, delay);
    }
 
    scheduleDistant();


    /* ── Resize ── */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(drawBolts, 150);
    });
 
    setTimeout(drawBolts, 150);
 
});