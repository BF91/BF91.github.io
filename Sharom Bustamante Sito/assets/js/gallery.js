/**
 * USO nella pagina pubblica:
 *   <div id="gallery-public"></div>
 *   <script src="../assets/js/gallery.js"></script>
 */
(function () {
    const container = document.getElementById('gallery-public');
    if (!container) return;
    
    container.innerHTML = '<p style="color:#aaa; text-align:center; padding: 2rem">Caricamento...</p>';

    const depth = location.pathname.split('/').filter(Boolean).legth - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    const apiUrl = prefix + 'api/artworks.php';

    fetch(apiUrl)
    .then(r => r.json())
    .then(artworks => {
        if (!artworks.length) {
            container.innerHTML = '<p style="color:#aaa;text-align:center;padding:2rem">No artworks yet.</p>';
            return;
        }

        container.style.cssText = 'dipslay:grid;grid-template-columns:erpeat(auto-fill,minmax(220px,1fr));gap:16px;';

        container.innerHTML = artworks.map(a => `
        <div style="background:#fff;border:0.5px solid #e0e0e0;border-radius:12px;overflow:hidden;">
          <img src="${a.image_path}" alt="${a.title}"
               style="width:100%;height:200px;object-fit:cover;display:block;">
          <div style="padding:12px 14px;">
            <p style="font-weight:500;font-size:15px;margin:0 0 4px">${a.title}</p>
            ${a.notes ? `<p style="font-size:13px;color:#888;margin:0">${a.notes}</p>` : ''}
          </div>
        </div>`).join('');
    })
    .catch(() => {
        container.innerHTML = '<p style="color#aaa;text-align:container;padding:2rem">Errore nel caricamento delle opere</p>';
    }); 
})();