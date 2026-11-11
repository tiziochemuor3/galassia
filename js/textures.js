// js/textures.js

function createPlanetTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (type === 'gas') {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#2a0845');
    grad.addColorStop(0.15, '#ff69b4');
    grad.addColorStop(0.35, '#8a2be2');
    grad.addColorStop(0.55, '#ffb6c1');
    grad.addColorStop(0.8, '#4a154b');
    grad.addColorStop(1, '#1a042d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
      ctx.fillRect(0, Math.random() * 512, 1024, Math.random() * 15);
    }
  } else if (type === 'rocky') {
    ctx.fillStyle = '#2b102c';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#6b2d5c';
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, 60 + Math.random() * 100, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 10;
      ctx.fillStyle = `rgba(15, 5, 20, ${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255, 182, 193, ${Math.random() * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  } else if (type === 'ice') {
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#e0ffff');
    grad.addColorStop(0.2, '#1e3c72');
    grad.addColorStop(0.5, '#2a5298');
    grad.addColorStop(0.8, '#1e3c72');
    grad.addColorStop(1, '#e0ffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1 + Math.random() * 3;
      let x = Math.random() * 1024;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      for (let j = 0; j < 5; j++) {
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (type === 'orange_red_splash') {
    ctx.fillStyle = '#ff6600';
    ctx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(204, 0, 0, 0.65)' : 'rgba(139, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024,
        Math.random() * 512,
        50 + Math.random() * 120,
        20 + Math.random() * 60,
        Math.random() * Math.PI,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 350; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = 1 + Math.random() * 7;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() > 0.6) {
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.arc(
            x + (Math.random() - 0.5) * 18,
            y + (Math.random() - 0.5) * 18,
            radius * 0.4,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }

  return new THREE.CanvasTexture(canvas);
}

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 230, 250, 0.8)');
  grad.addColorStop(0.5, 'rgba(180, 120, 255, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}