// js/regali.js

// ==========================================
// PIANETA GHIACCIATO: MINIGIOCO 10 DOMANDE
// ==========================================
const domandeMinigiocoGhiacciato = [
  { domanda: "Chi si preoccupa di più per i dettagli e l'organizzazione?", rispostaCorretta: "lei" },
  { domanda: "Chi tiene il broncio più a lungo quando si discute?", rispostaCorretta: "lei" },
  { domanda: "Chi si addormenta prima durante le chiamate la sera?", rispostaCorretta: "io" },
  { domanda: "Chi invita di più l'altro a fare chiamate?", rispostaCorretta: "lei" },
  { domanda: "Chi scrive i messaggi più lunghi (i famosi papiri)?", rispostaCorretta: "io" },
  { domanda: "Chi chiede più scusa?", rispostaCorretta: "io" },
  { domanda: "Chi fa più battute stupide?", rispostaCorretta: "lei" },
  { domanda: "Chi ama di più l'altro?", rispostaCorretta: "io" },
  { domanda: "Chi ama di più mandare cuori e dolcezze all'improvviso?", rispostaCorretta: "entrambi" },
  { domanda: "Chi ha la fortuna più grande ad aver trovato l'altra persona?", rispostaCorretta: "entrambi" }
];

let indiceDomandaCorrente = 0;
let punteggioMinigioco = 0;

// ==========================================
// PIANETA ROCCIOSO: RUOTA DELLA FORTUNA (25 MESSAGGI DOLCI)
// ==========================================
const messaggiRuotaRoccioso = [
  "In realtà i messaggi sono tutti dolci... io amo tutto di te, non c'è nulla che odio! ❤️",
  "Amo il modo in cui mi fai sorridere anche nei giorni più difficili.",
  "Sei la persona più speciale che abbia mai conosciuto.",
  "Amo la tua voce quando mi parli la sera.",
  "La tua dolcezza riesce sempre a scaldate il mio cuore.",
  "Sei fantastica esattamente così come sei, non cambiare mai.",
  "Amo come riesci a rendere unico ogni singolo momento insieme.",
  "Con te anche le cose più semplici diventano bellissime.",
  "Sei il mio pensiero felice preferito di ogni giornata.",
  "Amo la tua forza e come affronti ogni cosa.",
  "Sei la stella più luminosa di tutta questa galassia.",
  "Stare con te è la cosa migliore che potesse succedermi.",
  "Amo quando ti emozioni per le piccole cose.",
  "Sei incredibile, speciale e unica al mondo.",
  "Ogni secondo con te è un regalo prezioso.",
  "Amo il tuo sorriso, ha il potere di illuminare tutto.",
  "Sei la mia persona preferita in assoluto.",
  "Non c'è posto al mondo in cui preferirei essere se non vicino a te.",
  "Amo come sai capirmi anche senza bisogno di tante parole.",
  "Sei un raggio di sole bellissimo ed estivo.",
  "Amo la tua risata, è la musica più bella che ci sia.",
  "Sei il motivo per cui questo universo esiste ed è così bello.",
  "Amo la tua gentilezza infinita verso chi ami.",
  "Sei la ragazza più fantastica che io possa desiderare.",
  "Ti amo immensamente, Greta. Più di ogni altra cosa."
];

let staGirandoRuota = false;
let angoloRuotaCorrente = 0;

// ==========================================
// DEFINIZIONE REGALI PIANETI
// ==========================================
const regaliPianeti = {
  "Pianeta Ghiacciato": {
    titolo: "🎁 Minigioco di Glacies: Chi è?",
    isMinigioco: true,
    tipoMinigioco: "ghiacciato"
  },
  "Pianeta Roccioso": {
    titolo: "🎁 La Ruota della Fortuna di Kronos",
    isMinigioco: true,
    tipoMinigioco: "roccioso"
  },
  "Pianeta Fuoco": {
    titolo: "🎁 Il Regalo di Pyros (Il Mazzo di Tulipani d'Estate)",
    isMinigioco: true,
    tipoMinigioco: "fuoco"
  },
  "Gas Gigante": {
    titolo: "🎁 Il Regalo di Aetheria (Il Peluche Gatto)",
    isMinigioco: true,
    tipoMinigioco: "gas_gigante"
  },
};

// ==========================================
// FUNZIONI MINIGIOCO GHIACCIATO
// ==========================================
function avviaMinigiocoGhiacciato() {
  indiceDomandaCorrente = 0;
  punteggioMinigioco = 0;
  mostraProssimaDomandaMinigioco();
}

function mostraProssimaDomandaMinigioco() {
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  if (indiceDomandaCorrente < domandeMinigiocoGhiacciato.length) {
    const q = domandeMinigiocoGhiacciato[indiceDomandaCorrente];
    modalTitle.innerText = `🎁 Minigioco Ghiacciato (Punti: ${punteggioMinigioco}/10)`;

    modalContent.innerHTML = `
      <p style="font-size: 1.1rem; margin-bottom: 15px; text-align: center; color: #00ffff;"><b>Domanda ${indiceDomandaCorrente + 1}/10:</b><br>${q.domanda}</p>
      <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
        <button class="btn-action" onclick="rispondiMinigioco('io')">BANANINO</button>
        <button class="btn-action" onclick="rispondiMinigioco('lei')">IO</button>
        <button class="btn-action" onclick="rispondiMinigioco('entrambi')">Entrambi</button>
      </div>
      <p id="feedbackMinigioco" style="text-align: center; margin-top: 12px; font-weight: bold; font-size: 0.95rem;"></p>
    `;
  } else {
    modalTitle.innerText = "🎉 Minigioco Completato!";
    modalContent.innerHTML = `
      <p style="text-align: center; font-size: 1.1rem; color: #00ff88; line-height: 1.6;">
        Hai completato il minigioco di Glacies!<br>
        Punteggio finale: <b>${punteggioMinigioco} / 10</b><br><br>
        spero per te che il punteggio sia alto
      </p>
    `;
  }
}

function rispondiMinigioco(sceltaUtente) {
  const q = domandeMinigiocoGhiacciato[indiceDomandaCorrente];
  const feedback = document.getElementById('feedbackMinigioco');

  if (sceltaUtente === q.rispostaCorretta) {
    punteggioMinigioco++;
    feedback.style.color = "#00ff88";
    feedback.innerText = "✨ Risposta esatta! Punto registrato.";
  } else {
    feedback.style.color = "#ff3366";
    feedback.innerText = "⚠️ Ops! Rimani a 0 punti per questa domanda.";
  }

  indiceDomandaCorrente++;
  setTimeout(() => {
    mostraProssimaDomandaMinigioco();
  }, 1200);
}

// ==========================================
// FUNZIONI RUOTA DELLA FORTUNA ROCCIOSO
// ==========================================
function avviaRuotaRoccioso() {
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  modalTitle.innerText = "🎡 La Ruota della Fortuna di Kronos";

  modalContent.innerHTML = `
    <p style="font-size: 0.9rem; color: #ff99cc; margin-bottom: 10px; text-align: center;">
      Su questa ruota ci sono <b>20 messaggi segreti</b>: 19 cose che odio di te e 1 sola cosa che amo...<br>
      Gira la ruota e scopri cosa ti riserva la sorte!
    </p>

    <!-- Indicatore freccia in alto -->
    <div style="position: relative; width: 220px; margin: 0 auto;">
      <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); z-index: 10; font-size: 20px; color: #ff007f;">▼</div>

      <!-- Canvas Ruota 2D -->
      <canvas id="ruotaCanvas" width="220" height="220" style="border-radius: 50%; box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);"></canvas>
    </div>

    <div style="text-align: center; margin-top: 15px;">
      <button id="btnGiraRuota" class="btn-action" onclick="giraRuotaRoccioso()">Gira la Ruota! 🎡</button>
    </div>

    <!-- Risultato estratto -->
    <div id="risultatoRuota" style="margin-top: 15px; font-weight: bold; font-size: 1rem; color: #00ff88; min-height: 50px; text-align: center;"></div>
  `;

  disegnaRuotaMisteriosa(angoloRuotaCorrente);
}

function disegnaRuotaMisteriosa(angoloIniziale) {
  const canvas = document.getElementById('ruotaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const numSpicchi = 20;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const raggio = cx - 5;
  const fetta = (2 * Math.PI) / numSpicchi;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSpicchi; i++) {
    const aInizio = angoloIniziale + i * fetta;
    const aFine = aInizio + fetta;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, raggio, aInizio, aFine);
    ctx.closePath();

    ctx.fillStyle = (i % 2 === 0) ? '#1a0933' : '#3d1255';
    ctx.fill();

    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(aInizio + fetta / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ff99cc";
    ctx.font = "10px sans-serif";
    ctx.fillText(`? #${i + 1}`, raggio - 10, 4);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, 2 * Math.PI);
  ctx.fillStyle = '#ff007f';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function giraRuotaRoccioso() {
  if (staGirandoRuota) return;
  staGirandoRuota = true;

  const btn = document.getElementById('btnGiraRuota');
  const res = document.getElementById('risultatoRuota');
  if (btn) btn.disabled = true;
  if (res) res.innerText = "La ruota sta girando...";

  const giriExtra = 5 + Math.floor(Math.random() * 5);
  const angoloTarget = angoloRuotaCorrente + (giriExtra * 2 * Math.PI) + (Math.random() * 2 * Math.PI);
  const durata = 4000;
  const tempoInizio = performance.now();

  function animazioneRuota(tempoAttuale) {
    const trascorso = tempoAttuale - tempoInizio;
    const progresso = Math.min(trascorso / durata, 1);

    const easeOut = 1 - Math.pow(1 - progresso, 3);
    const angoloAttuale = angoloRuotaCorrente + (angoloTarget - angoloRuotaCorrente) * easeOut;

    disegnaRuotaMisteriosa(angoloAttuale);

    if (progresso < 1) {
      requestAnimationFrame(animazioneRuota);
    } else {
      angoloRuotaCorrente = angoloTarget % (2 * Math.PI);
      staGirandoRuota = false;
      if (btn) btn.disabled = false;

      const indiceCasuale = Math.floor(Math.random() * messaggiRuotaRoccioso.length);
      const messaggioEstratto = messaggiRuotaRoccioso[indiceCasuale];

      if (res) {
        res.innerHTML = `✨ <b>Messaggio Estratto:</b><br><span style="color: #ffffff; font-size: 0.95rem;">"${messaggioEstratto}"</span>`;
      }
    }
  }

  requestAnimationFrame(animazioneRuota);
}

// ==========================================
// PIANETA FUOCO (PYROS): MAZZO DI 22 TULIPANI SVG (GIALLI AI LATI, ARANCIONI AL CENTRO)
// ==========================================
function avviaRegaloPyros() {
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  modalTitle.innerText = "🎁 Il Regalo di Pyros";

  modalContent.innerHTML = `
    <div style="text-align: center; position: relative; padding: 5px 0;">
      <div style="font-size: 1.3rem; font-weight: 900; color: #ff9900; text-shadow: 0 0 15px #ff5722; margin-bottom: 10px;">
        🎉 BUON ANNIVERSARIO AMORE 🎉
      </div>

      <p style="font-size: 0.9rem; color: #eee; margin-bottom: 15px; line-height: 1.4;">
        Per te che sei la mia vita e la mia luce.<br>
        i tuoi <b>22 tulipani</b>. avrei voluto fartene 89 pero purtroppo il sito non reggeva. sorry.\n\nmi dispiace davvero quindi per questo piccolo inconveniente ti ho lasciato una sorpresa nel vecchio sito. appena finisci qui vai a vederla.
      </p>
    </div>
  `;

  // Rimuoviamo eventuali mazzi precedenti nello DOM per evitare duplicati
  const vecchioMazzo = document.getElementById('tulipsBouquet');
  if (vecchioMazzo) vecchioMazzo.remove();

  const bouquetContainer = document.createElement('div');
  bouquetContainer.className = "tulips-container";
  bouquetContainer.id = "tulipsBouquet";

  const totaleFiori = 22;
  const fioriGialliPerLato = 4; // 4 a sinistra, 14 arancioni al centro, 4 a destra

  for (let i = 1; i <= totaleFiori; i++) {
    // Determina se il fiore è al centro (arancione) o ai lati (giallo)
    const eArancione = (i > fioriGialliPerLato && i <= (totaleFiori - fioriGialliPerLato));

    const colorePetaloEsterno = eArancione ? "#ea580c" : "#eab308";
    const colorePetaloInterno = eArancione ? "#f97316" : "#facc15";

    // Ventaglio ampio e naturale
    const rotazione = -48 + ((96 / (totaleFiori - 1)) * (i - 1));
    const translateY = Math.abs(rotazione) * 0.8;

    const svgString = `
      <svg class="flower-svg" viewBox="0 0 100 240" style="transform: rotate(${rotazione.toFixed(1)}deg) translateY(${translateY.toFixed(1)}px); z-index: ${Math.round(50 - Math.abs(rotazione))};">
          <!-- Gambo lungo -->
          <path d="M50,230 Q50,130 50,45" stroke="#166534" stroke-width="4.5" fill="none" />
          <!-- Petali del tulipano -->
          <path d="M30,45 C15,10 42,3 50,32 C58,3 85,10 70,45 C62,72 38,72 30,45 Z" fill="${colorePetaloEsterno}" />
          <path d="M40,48 C30,20 46,12 50,32 C54,12 70,20 60,48 C54,62 46,62 40,48 Z" fill="${colorePetaloInterno}" />
      </svg>
    `;
    bouquetContainer.innerHTML += svgString;
  }

  document.body.appendChild(bouquetContainer);

  // Entrata dal basso
  setTimeout(() => {
    bouquetContainer.classList.add('show');
  }, 100);

  // Timer di 6 secondi prima di rientrare e scomparire
  setTimeout(() => {
    bouquetContainer.classList.remove('show');
    setTimeout(() => {
      bouquetContainer.remove();
    }, 1400);
  }, 6000);

  creaCoriandoliFesta();
}

function creaCoriandoliFesta() {
  const quantitaCoriandoli = 50;
  for (let i = 0; i < quantitaCoriandoli; i++) {
    const coriandolo = document.createElement('div');
    coriandolo.style.position = 'fixed';
    coriandolo.style.left = Math.random() * window.innerWidth + 'px';
    coriandolo.style.top = '-20px';
    coriandolo.style.width = (Math.random() * 8 + 6) + 'px';
    coriandolo.style.height = (Math.random() * 8 + 6) + 'px';
    coriandolo.style.backgroundColor = ['#ff9900', '#ff5722', '#ffeb3b', '#ff1493', '#00ffff'][Math.floor(Math.random() * 5)];
    coriandolo.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    coriandolo.style.zIndex = '15000';
    coriandolo.style.pointerEvents = 'none';
    coriandolo.style.transition = `transform ${Math.random() * 2 + 2}s linear, top ${Math.random() * 2 + 2}s linear, opacity 2s ease`;

    document.body.appendChild(coriandolo);

    setTimeout(() => {
      coriandolo.style.top = window.innerHeight + 50 + 'px';
      coriandolo.style.transform = `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)`;
      coriandolo.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      coriandolo.remove();
    }, 3500);
  }
}

// ==========================================
// GESTIONE APERTURA CONTENUTI EXTRA
// ==========================================
function apriContenutoExtra(tipo) {
  const data = datiPianeti[currentSelectedPlanet];
  if (!data) return;

  if (tipo === 'regalo') {
    const regaloObj = (typeof regaliPianeti !== 'undefined' && regaliPianeti[currentSelectedPlanet])
      ? regaliPianeti[currentSelectedPlanet]
      : { titolo: "🎁 Il Regalo", testo: data.regalo };

    if (regaloObj.isMinigioco) {
      if (regaloObj.tipoMinigioco === "ghiacciato") {
        avviaMinigiocoGhiacciato();
      } else if (regaloObj.tipoMinigioco === "roccioso") {
        avviaRuotaRoccioso();
      } else if (regaloObj.tipoMinigioco === "fuoco") {
        avviaRegaloPyros();
      } else if (regaloObj.tipoMinigioco === "gas_gigante") {
        avviaRegaloGasGigante();
      }
      document.getElementById('storyModal').style.display = 'flex';
    } else {
      apriStoria(regaloObj.titolo, regaloObj.testo);
    }
  } else if (tipo === 'dedica') {
    apriStoria("💌 La Dedica", data.dedica);
  } else if (tipo === 'pergamena') {
    apriStoria("📜 Pergamena & Prossimo Indizio", data.pergamena);
  }
}

// ==========================================
// PIANETA GAS GIGANTE (AETHERIA): PELUCHE GATTO + CUORE FORM
// ==========================================
function avviaRegaloGasGigante() {
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  modalTitle.innerText = "🎁 Il Regalo di Aetheria";

  modalContent.innerHTML = `
    <div class="cat-plush-container">
      <p style="font-size: 0.9rem; color: #ff99cc; margin-bottom: 12px; text-align: center;">
        miao?
      </p>

      <div id="stepScritturaCuore" class="heart-envelope-box">
        <p style="font-size: 0.85rem; color: #fff; margin-bottom: 6px;">Scrivi un pensiero speciale nel cuore:</p>
        <textarea id="testoCuorePeluche" class="plush-textarea" placeholder="Scrivi qui..."></textarea>
        <button class="btn-action" style="padding: 6px 16px; font-size: 0.85rem;" onclick="inserisciCuoreNelPeluche()">Metti nel Peluche 🐾</button>
      </div>

      <div id="stepPelucheFinale" style="display: none; text-align: center;">
        <p style="font-size: 0.85rem; color: #00ff88; margin-bottom: 8px;"> Il cuore è al sicuro nel peluche! Clicca sul gatto:</p>

        <!-- Gatto Peluche SVG con cuore a metà inserito -->
        <svg class="plush-cat-svg" viewBox="0 0 160 160" onclick="apriSorpresaPeluche()">
          <!-- Corpo del gatto peluche (morbido rosa/violaceo) -->
          <ellipse cx="80" cy="95" rx="50" ry="45" fill="#db2777" />
          <!-- Testina del gatto -->
          <circle cx="80" cy="60" r="35" fill="#ec4899" />
          <!-- Orecchie -->
          <polygon points="50,35 40,10 65,25" fill="#f472b6" />
          <polygon points="110,35 120,10 95,25" fill="#f472b6" />
          <!-- Occhi dolci chiusi o felici -->
          <path d="M65,55 Q70,48 75,55" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" />
          <path d="M85,55 Q90,48 95,55" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" />
          <!-- Musino e baffi -->
          <ellipse cx="80" cy="63" rx="5" ry="3" fill="#ffffff" />
          <line x1="75" y1="67" x2="60" y2="65" stroke="#fff" stroke-width="2" />
          <line x1="85" y1="67" x2="100" y2="65" stroke="#fff" stroke-width="2" />
          <!-- Cuore stretto tra le zampe (a metà) -->
          <path d="M80,85 C70,75 55,85 70,105 L80,118 L90,105 C105,85 90,75 80,85 Z" fill="#ff007f" stroke="#ffffff" stroke-width="2" />
        </svg>

        <p style="font-size: 0.75rem; color: #aaa; margin-top: 6px;">(Clicca sul gatto per sbloccare la dedica)</p>
      </div>
    </div>
  `;
}

let messaggioSalvatoPeluche = "";

function inserisciCuoreNelPeluche() {
  const textarea = document.getElementById('testoCuorePeluche');
  if (!textarea || textarea.value.trim() === "") {
    alert("Scrivi qualcosa nel cuore prima di metterlo nel peluche!");
    return;
  }

  messaggioSalvatoPeluche = textarea.value.trim();

  // Invia in background a Formspree (stesso endpoint del sito)
  const formData = new FormData();
  formData.append("messaggio_peluche_gatto", messaggioSalvatoPeluche);

  fetch("https://formspree.io/f/xrevogdv", {
    method: 'POST',
    body: formData,
    mode: 'no-cors'
  }).catch(() => {});

  // Passa allo step con il peluche gatto visibile
  document.getElementById('stepScritturaCuore').style.display = 'none';
  document.getElementById('stepPelucheFinale').style.display = 'block';
}

function apriSorpresaPeluche() {
  apriStoria(
    "🎁 La Dedica del Peluche Gatto",
    `Ecco il messaggio che hai custodito nel peluche:\n\n"${messaggioSalvatoPeluche}"\n\nIl gatto peluche spaziale lo custodirà per sempre, proprio come io custodisco te nel mio cuore.\nTi amo Greta.`
  );
}
