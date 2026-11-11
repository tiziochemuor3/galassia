// js/objects.js

function creaSole() {
  const sunGeo = new THREE.SphereGeometry(12, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
  sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(120, 60, -180);
  sunMesh.name = "Sole";
  scene.add(sunMesh);

  const glowTex = createStarTexture();
  const sunGlowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: 0xffaa00,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const sunGlow = new THREE.Sprite(sunGlowMat);
  sunGlow.scale.set(75, 75, 1);
  sunMesh.add(sunGlow);

  const sunLight = new THREE.PointLight(0xfffaed, 2.8, 1000);
  sunLight.position.copy(sunMesh.position);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x402050, 0.65);
  scene.add(ambientLight);
}

// SFONDO STELLE AMPLIATO A 35.000 STELLE
function creaSfondoRealistico() {
  const starTex = createStarTexture();

  const starCount = 35000;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colorPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xaaccff),
    new THREE.Color(0xffddaa),
    new THREE.Color(0xffb6c1),
    new THREE.Color(0x00ffff)
  ];

  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 300 + Math.pow(Math.random(), 0.5) * 1900;

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
    size: 4.5,
    map: starTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function creaPianeti() {
  planetGroup = new THREE.Group();

  // 1. Gas Gigante
  const p1Geo = new THREE.SphereGeometry(7, 64, 64);
  const p1Mat = new THREE.MeshStandardMaterial({
    map: createPlanetTexture('gas'),
    roughness: 0.5
  });
  const p1 = new THREE.Mesh(p1Geo, p1Mat);
  p1.position.set(-65, 30, -110);
  p1.name = "Gas Gigante";

  const ringGeo = new THREE.RingGeometry(9, 15, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff69b4,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.3;
  p1.add(ring);
  planetGroup.add(p1);

  // 2. Pianeta Roccioso
  const p2Geo = new THREE.SphereGeometry(4.8, 64, 64);
  const p2Mat = new THREE.MeshStandardMaterial({
    map: createPlanetTexture('rocky'),
    roughness: 0.8,
    metalness: 0.1
  });
  const p2 = new THREE.Mesh(p2Geo, p2Mat);
  p2.position.set(80, -35, -130);
  p2.name = "Pianeta Roccioso";
  planetGroup.add(p2);

  // 3. Pianeta Ghiacciato
  const p3Geo = new THREE.SphereGeometry(4.2, 64, 64);
  const p3Mat = new THREE.MeshStandardMaterial({
    map: createPlanetTexture('ice'),
    roughness: 0.2,
    metalness: 0.3
  });
  const p3 = new THREE.Mesh(p3Geo, p3Mat);
  p3.position.set(50, 45, -90);
  p3.name = "Pianeta Ghiacciato";
  planetGroup.add(p3);

  // 4. Pianeta Fuoco (Pyros) con Texture Dedicata
  // Dentro la funzione creaPianeti() in js/objects.js
  const pyrosTexture = creaTexturePyros();
  const p4Geo = new THREE.SphereGeometry(5.5, 64, 64);
  const p4Mat = new THREE.MeshStandardMaterial({
    map: pyrosTexture,
    roughness: 0.7,
    metalness: 0.1
  });
  const p4 = new THREE.Mesh(p4Geo, p4Mat);
  p4.position.set(-75, -40, -140);
  p4.name = "Pianeta Fuoco";

  // AGGIUNTA GATTI:
  creaGattiInOrbita(p4, 10); 

  planetGroup.add(p4);

  scene.add(planetGroup);
}

// In js/objects.js

function creaGalassiaCuore() {
  const glowTex = createStarTexture();
  const particleCount = 28000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorInside = new THREE.Color(0xff2288);
  const colorOutside = new THREE.Color(0x7b1fa2);

  for (let i = 0; i < particleCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const xHeart = 16 * Math.pow(Math.sin(t), 3);
    const yHeart = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const scale = 0.15 + Math.random() * 0.85;
    const noiseX = (Math.random() - 0.5) * 1.5;
    const noiseY = (Math.random() - 0.5) * 1.5;
    const noiseZ = (Math.random() - 0.5) * 2.5;

    positions[i * 3] = (xHeart * scale * 0.9) + noiseX;
    positions[i * 3 + 1] = (yHeart * scale * 0.9) + noiseY;
    positions[i * 3 + 2] = noiseZ;

    const mixedColor = colorInside.clone().lerp(colorOutside, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.45,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  heartParticles = new THREE.Points(geometry, material);
  heartGroup.add(heartParticles);

  // Parte Centrale
  const coreCount = 6000;
  const coreGeo = new THREE.BufferGeometry();
  const corePositions = new Float32Array(coreCount * 3);

  for (let i = 0; i < coreCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const xHeart = 16 * Math.pow(Math.sin(t), 3);
    const yHeart = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const scale = 0.05 + Math.random() * 0.22;
    const noise = (Math.random() - 0.5) * 0.5;

    corePositions[i * 3] = (xHeart * scale * 0.9) + noise;
    corePositions[i * 3 + 1] = (yHeart * scale * 0.9) + noise;
    corePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
  }

  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));

  const coreMat = new THREE.PointsMaterial({
    size: 0.5,
    color: 0xffffff,
    map: glowTex,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  coreParticles = new THREE.Points(coreGeo, coreMat);
  heartGroup.add(coreParticles);

  textGroup = new THREE.Group();

  // 1. Frasi fluttuanti attorno al cuore
  frasi.forEach((text, index) => {
    const sprite = creaSpriteTesto(text, '#ff007f');
    const angle = (index / frasi.length) * Math.PI * 2;
    const radius = 15 + Math.random() * 3;
    sprite.position.x = Math.cos(angle) * radius;
    sprite.position.y = Math.sin(angle) * radius;
    sprite.position.z = (Math.random() - 0.5) * 4;
    sprite.userData = { title: text, story: storieFrasi[text] };
    textGroup.add(sprite);
  });

  // In js/objects.js (dentro creaGalassiaCuore)

  // 2. Pulsante "INIZIA L'AVVENTURA" al centro e staccato dal cuore
  const btnAdventure = creaSpriteTesto("INIZIA L'AVVENTURA", '#00ffff');
  btnAdventure.position.set(0, 0, 8); // Portato in avanti per evitare compenetrazioni
  btnAdventure.scale.set(9, 2.8, 1);
  btnAdventure.userData = { isStartButton: true };
  textGroup.add(btnAdventure);

  heartGroup.add(textGroup);
}

/**
 * Helper function per creare gli Sprite di testo su Canvas
 */
// In js/objects.js

function creaSpriteTesto(testo, coloreBordo) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 160;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(10, 5, 20, 0.95)'; // Sfondo più scuro per contrasto
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 140, 25);
  ctx.fill();
  ctx.strokeStyle = coloreBordo;
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 28px Segoe UI';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(testo, 256, 80);

  const texture = new THREE.CanvasTexture(canvas);
  // depthTest: false impedisce alle particelle del cuore di nascondere il testo
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthTest: false }); 
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(7.5, 2.34, 1);
  return sprite;
}