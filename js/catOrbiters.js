// js/catOrbiters.js

let orbitCats = [];

/**
 * Genera una texture procedurale 2D con un faccino di gatto arancione
 */
function creaTextureGattoArancione() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Orecchie
  ctx.fillStyle = '#d95d00';
  ctx.beginPath();
  ctx.moveTo(25, 45); ctx.lineTo(15, 10); ctx.lineTo(50, 30); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(103, 45); ctx.lineTo(113, 10); ctx.lineTo(78, 30); ctx.fill();

  // Testa principale
  ctx.fillStyle = '#ff7b00';
  ctx.beginPath();
  ctx.arc(64, 68, 42, 0, Math.PI * 2);
  ctx.fill();

  // Occhi grandi
  ctx.fillStyle = '#55ff55';
  ctx.beginPath();
  ctx.arc(46, 60, 10, 0, Math.PI * 2);
  ctx.arc(82, 60, 10, 0, Math.PI * 2);
  ctx.fill();

  // Pupille
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(46, 60, 4, 0, Math.PI * 2);
  ctx.arc(82, 60, 4, 0, Math.PI * 2);
  ctx.fill();

  // Naso e Baffi
  ctx.fillStyle = '#ffaaaa';
  ctx.beginPath();
  ctx.arc(64, 75, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Baffi sinistri
  ctx.moveTo(35, 75); ctx.lineTo(10, 70);
  ctx.moveTo(35, 80); ctx.lineTo(12, 85);
  // Baffi destri
  ctx.moveTo(93, 75); ctx.lineTo(118, 70);
  ctx.moveTo(93, 80); ctx.lineTo(116, 85);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

/**
 * Crea e posiziona i gatti attorno al Mesh di Pyros
 * @param {THREE.Mesh} pyrosMesh 
 * @param {number} count 
 */
function creaGattiInOrbita(pyrosMesh, count = 20) {
  const catTexture = creaTextureGattoArancione();
  const catMaterial = new THREE.SpriteMaterial({ map: catTexture, transparent: true });

  for (let i = 0; i < count; i++) {
    const catSprite = new THREE.Sprite(catMaterial.clone());
    catSprite.scale.set(3, 3, 1);

    // Parametri orbitali casuali su 3 assi
    const r = 8 + Math.random() * 6; // Distanza dal centro del pianeta
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const speed = (0.005 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1);

    catSprite.userData = {
      radius: r,
      theta: theta,
      phi: phi,
      speed: speed,
      axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
    };

    pyrosMesh.add(catSprite);
    orbitCats.push(catSprite);
  }
}

/**
 * Aggiorna la posizione dei gatti in orbita (da chiamare nel loop animate/render)
 */
// In js/catOrbiters.js

function aggiornaGattiInOrbita() {
  orbitCats.forEach(cat => {
    cat.userData.theta += cat.userData.speed;
    
    const r = cat.userData.radius;
    const t = cat.userData.theta;
    const axis = cat.userData.axis;

    // Calcolo posizione 3D ruotata attorno all'asse specifico del gatto
    const initialPos = new THREE.Vector3(r * Math.cos(t), 0, r * Math.sin(t));
    initialPos.applyAxisAngle(axis, cat.userData.phi);

    cat.position.copy(initialPos);
  });
}