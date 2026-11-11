// js/spaceBackground.js

// Genera una texture procedurale per le nubi/nebulose spaziali
// js/spaceBackground.js

function createNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048; // Aumentiamo la risoluzione per ammorbidire le sfumature
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Sfondo base scuro
    ctx.fillStyle = '#05000a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = [
        'rgba(255, 0, 128, 0.08)',
        'rgba(138, 43, 226, 0.07)',
        'rgba(255, 105, 180, 0.10)',
        'rgba(75, 0, 130, 0.06)'
    ];

    // Disegna le nebulose e le duplica sui bordi per garantire seamless
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 150 + Math.random() * 350;
        const col = colors[Math.floor(Math.random() * colors.length)];

        const drawRadial = (centerX, centerY) => {
            const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
            grad.addColorStop(0, col);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        };

        // Disegna la nube principale
        drawRadial(x, y);

        // Se la nube tocca il bordo sinistro o destro, la replica sul lato opposto per annullare la spaccatura
        if (x - radius < 0) drawRadial(x + canvas.width, y);
        if (x + radius > canvas.width) drawRadial(x - canvas.width, y);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}
// Genera uno sfondo con lo skybox di nebulose e un campo stellare denso e realistico
function creaSfondoRealisticoAvanzato() {
    // 1. Cupola/Sfera di sfondo con le nebulose rosa/viola
    const bgGeo = new THREE.SphereGeometry(1200, 64, 64);
    const bgMat = new THREE.MeshBasicMaterial({
        map: createNebulaTexture(),
        side: THREE.BackSide,
        depthWrite: false
    });
    const bgMesh = new THREE.Mesh(bgGeo, bgMat);
    scene.add(bgMesh);

    // 2. Campo stellare denso e multilivello (60.000 stelle)
    const starTex = createStarTexture();
    const starCount = 60000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
        new THREE.Color(0xffffff), // Bianco brillante
        new THREE.Color(0xffb6c1), // Rosa chiaro
        new THREE.Color(0xdd99ff), // Lillà / Viola
        new THREE.Color(0xaaccff), // Azzurro soffuso
        new THREE.Color(0xffe4e1)  // Bianco rosato
    ];

    for (let i = 0; i < starCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 200 + Math.pow(Math.random(), 0.4) * 950;

        starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = r * Math.cos(phi);

        const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        starColors[i * 3] = col.r;
        starColors[i * 3 + 1] = col.g;
        starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    starMaterial = new THREE.PointsMaterial({
        size: 3.5,
        map: starTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
}