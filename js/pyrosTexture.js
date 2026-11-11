// js/pyrosTexture.js

/**
 * Genera una texture procedurale 2D ad alta risoluzione per Pyros (Pianeta Rosso)
 * @returns {THREE.CanvasTexture} Texture pronta per essere usata nei materiali Three.js
 */
function creaTexturePyros() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Sfondo base sfumato (toni rossi, arancio scuro e terra bruciata)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0.0, '#3a0808');
    gradient.addColorStop(0.3, '#8b1a0e');
    gradient.addColorStop(0.5, '#c83214');
    gradient.addColorStop(0.7, '#6e1108');
    gradient.addColorStop(1.0, '#260404');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Aggiunta di macchie e sfumature di superficie (dettaglio vulcanico)
    for (let i = 0; i < 1200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 25 + 5;

        const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        
        // Selezione casuale tra zone calde (magma/calore) e zone scure (roccia)
        if (Math.random() > 0.4) {
            spotGradient.addColorStop(0, 'rgba(255, 140, 0, 0.25)'); // Arancio fluorescente
            spotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
            spotGradient.addColorStop(0, 'rgba(30, 5, 5, 0.4)'); // Ombra rocciosa
            spotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = spotGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Texture a grana rocciosa fine
    for (let i = 0; i < 8000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const alpha = Math.random() * 0.15;
        ctx.fillStyle = `rgba(255, 200, 150, ${alpha})`;
        ctx.fillRect(x, y, 2, 2);
    }

    // 4. Creazione della texture Three.js
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    return texture;
}