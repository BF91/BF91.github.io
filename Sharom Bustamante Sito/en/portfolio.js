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