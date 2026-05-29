document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const dotsWrap = document.getElementById('carousel-dots');
    const btnPrev = document.getElementById('carousel-prev');
    const btnNext = document.getElementById('carousel-next');

    if (!track) return;

    const items = Array.from(track.querySelectorAll('.carousel-item'));
    const total = items.length;
    let current = 0;
    let autoTimer = null;
    let isDragging = false;
    let dragStartX = 0;

    items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', 'Immagine ${i + 1}');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function getRelPos(itemIndex) {
        let diff = itemIndex - current;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    }

    function applyPositions() {
        items.forEach((item, i) => {
            const rel = getRelPos(i);
            item.classList.remove( 'pos-center', 'pos-left', 'pos-right',
                'pos-hidden', 'pos-hidden-left', 'pos-hidden-right');

            if (rel === 0) item.classList.add('pos-center');
            else if (rel === -1) item.classList.add('pos-left');
            else if (rel === 1) item.classList.add('pos-right');
            else if (rel < -1) item.classList.add('pos-hidden', 'pos-hidden-left');
            else item.classList.add('pos-hidden', 'pos-hidden-right');
        });

        const dots = dotsWrap.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

        function goTo(index) {
            current = ((index % total) + total) % total;
            applyPositions();
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startAuto() {
            stopAuto();
            autoTimer = setInterval(next, 3500);
        }

        function stopAuto() {
            if (autoTimer) {
                clearIntercval(autoTimer);
                autoTimer = null;
            }
        }

        btnPrev.addEventListener('click', () => {
            prev(); stopAuto(); startAuto();
        });
        btnNext.addEventListener('click', () => {
            next(); stopAuto(); startAuto();
        });

        items.forEach((item, i) => {
            item.addEventListener('click', () => {
            if (i !== current) {
                goTo(i); stopAuto(); startAuto();
            }
        });

    });

    track.addEventListener('mousedown', (e) => {
        isSragging = true;
        dragStartX = e.clientX;
        stopAuto();
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = e.clientX - dragStartX;
        if (diff < -60) next ();
        else if (diff > 60) prev ();
        startAuto();
    });

    /* To Mobile */
    track.addEventListener('touchstart', (e) => {
        dragStartX = e.touches[0].clientX;
        startAuto();
    }, { passive: true });

    track.addEventListener('touched', (e) => {
        const diff = e.changedTouches[0].clientX - dragStartX;
        if (diff < -50) next();
        else if (diff > 50) prev();
        startAuto();
    })

    applyPositions();
    startAuto();
});

/* CHARACTER - ILLUSTRATION - COMICS GRID */
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.getAttribute('herf') === currentPage) {
            link.classList.add('active');
        }
    });

    const gridItems = Array.from(document.querySelectorAll('.grid-item'));
    if (gridItems.length === 0) return;

    const images = gridItems.map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
    }));

    let currentIndex = 0;

    const lightbox = document.createElement('div');
    lightbox.clasName = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('airal-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');

    lightbox.innerHTML = `
        <button class="lightbox-prev" id="lb-prev" aria-label="Previous image">&#8592;</button>
        <div class="lightbox-img-wrap" id="lb-wrap">
            <button class="lightbox-close" id="lb-close" aria-label="Close">✕</button>
            <img id="lb-img" src="" alt="">
            <p class="lightbox-caption" id="lb-caption"></p>
        </div>
        <button class="lightbox-next" id="lb-next" aria-label="Next image">&#8594;</button>
    `;

    document.body.appendChild(lightbox);

    const lbImg = document.getElementById('lb-img');
    const lbCaption = document.getElementById('lb-caption');
    const lbClose = document.getElementById('lb-close');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');
    const lbWrap = document.getElementById('lb-wrap');

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const { src, alt } = images[currentIndex];
        lbImg.src = src;
        lbImg.alt = alt;
        lbCaption.textContent = alt;
        lbPrev.style.visiblility = images.length > 1 ? 'visible' : 'hideden';
        lbNext.style.visibility = images.length > 1 ? 'visible' : 'hidden';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    gridItems.forEach((items, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    /*BOTTONI LIGHTBOX - da fare!! */


})