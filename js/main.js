// js/main.js

let scene, camera, renderer, controls;
let stars, starMaterial, nebulaGroup, planetGroup, sunMesh;
let heartGroup, heartParticles, coreParticles, textGroup;
let isWarping = false;
let warpFactor = 0;
let clock = new THREE.Clock();
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Gestione delle capsule multiple (massimo 3 nello spazio)
let capsuleLista = [];
let messaggioSalvatoGreta = "";

// Gestione messa a fuoco pianeta
let isFocusingPlanet = false;
let targetCameraPos = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();

// Stato gestione Sole e Pianeti
let sunBurned = false;
let currentSelectedPlanet = null;
let isErrorTimeout = false;

let pianetaCuoreGenerato = false; // Assicura che si spawni una sola volta

const frasi = [
  "TI AMO", "SEI UNICA", "BUON ANNIVERSARIO", "IL MIO PENSIERO FISSO",
  "IO E TE", "SEI BELLISSIMA", "AMORE DELLA MIA VITA", "BUON VIAGGIO"
];

const storieFrasi = {
  "TI AMO": "Ogni secondo passato insieme a te mi ricorda quanto cazzo ti amo, più ti vivo più ti amo.",
  "SEI UNICA": "Non serve qualcosa o qualcuno di speciale per farmi sorridere: mi basta essere con te, l'amore della mia vita.",
  "BUON ANNIVERSARIO": "Ormai sono 2 anni che ci conosciamo: sembrano pochi, ma questi due anni mi hanno mostrato che con te ci voglio passare tutta la vita.",
  "IL MIO PENSIERO FISSO": "Sei la prima cosa a cui penso quando mi sveglio e l'ultimo sorriso che mi addormenta la sera, e questo sito ne è la prova. Te lo sto facendo da quasi 5 mesi, nei quali non ho mai smesso di pensarti e nei quali andavo avanti col sito pur quando stavo male, perché il pensiero che tu lo avresti visto mi dava la forza: sei la mia forza.",
  "IO E TE": "Potrebbe sembrare strano o forzato, ma io non mi trovo più senza di te. Sei diventata una parte di me, e per me ci siamo solo noi due, unicamente noi. Non riuscirò mai a farti capire cosa provo per te, proprio perché va oltre l'amore, non so neanche come poterlo dire... Te lo giuro che io ti amo tantissimo... Vorrei continuare questa piccola dedica però mentre te la sto scrivendo mi commuovo. Scusami Greta per questa pessima dedica. Ti amo...",
  "SEI BELLISSIMA": "Non mi credi mai abbastanza quando ti dico che sei bellissima, ma Greta, io ogni volta che ti guardo rimango ogni volta senza fiato. Hai un viso che sembra dipinto, sei così perfetta che potrei passare ore intere solo a osservarti senza stancarmi mai. I tuoi occhi hanno una luce unica, di quelle che illuminano qualsiasi stanza e che ti catturano completamente al primo sguardo, incollandomi a te e impedendomi di distogliere gli occhi. E poi hai un sorriso che ha il potere di cambiarmi la giornata in un solo istante, rendendo tutto più luminoso, caldo e meraviglioso: HAI UN SORRISO INCREDIBILE TE LO GIURO, È BELLISSIMO, è incantevole. Sei davvero di una bellezza disarmante, rara anzi unica, di quelle che lasciano il segno e che ti rubano l'anima dal primo momento, e tu mi hai rubato l'anima e il cuore e anche tutto il resto. Ma poi tu non solo sei bellissima esteriormente, ma anche interiormente sei una ragazza perfetta: sei simpaticissima, sul serio mi fai sempre ridere, sei dolcissima, ogni tuo messaggio mi scioglie il cuore... magari senza contare quelli dove mi insulti... ma sai cosa? Io ti amo così, quando sei triste, quando sei felice, quando mi ami, quando mi odi, quando sei confusa o qualunque sia il tuo stato. IO TI AMO E TI CONTINUERÒ AD AMARE AMORE MIO. Sei bellissima, questa volta credimi.",
  "AMORE DELLA MIA VITA": "Guardando indietro non posso che essere grato per ogni singolo istante vissuto al tuo fianco, per ogni sorriso che mi hai lasciato, per ogni tuo messaggio, per ogni cosa vissuta con te, sia bella che brutta. Perché ogni cosa passata con te mi ricorda quanto ti amo, quanto vorrei solo te al mio fianco, quanto sei fantastica. Ogni secondo passato con te mi fa venire voglia di restare al tuo fianco, per rivivere quella strana sensazione che mi lasci che mi fa sentire la persona più fortunata al mondo. Per questo grazie, TI AMO. Appena finisci di vedere il sito scrivimi, così ti dirò un'altra volta quanto ti amo.",
  "BUON VIAGGIO": "Spero che questo ti ricordi quanto ti amo. Spero ti piaccia...",
};

const avventuraTestoConsiglio = "Ti consiglierei di leggere prima le parole fluttuanti per comprendere appieno i segreti di questo universo... Se sei pronta, avanza oltre.";
const avventuraTestoMisterioso = "Questa galassia è completamente esplorabile, ma per farlo ti servono i pin dei vari pianeti, e quindi devi seguire gli indizi, oppure vai in giro a provare ogni codice che ti verrà in mente, magari uno funziona. sappi che per ogni pianeta che esplorerai ci saranno delle sorprese uniche.\n\npero ti avviso, ci sono tante dediche alcune anche molto.. ma molto lunghe quindi se non te la senti di guardare ora il sito stai tranquilla, puoi comunque guardare ogni giorno qualcosa. detto ciò\n\nL'avventura inizia sotto zero, un luogo incantato dove ogni forma d'amore si stringe e si ghiaccia per diventare eterna e indistruttibile. Ogni passo qui dentro è riscaldato solo dal battito dei nostri cuori.\n\nIndizio per il pianeta ghiacciato: il codice segreto è composto dal tuo numero preferito tra me e te, seguito due volte dal tuo numero preferito con tua madre.";
const datiPianeti = {
  "Pianeta Ghiacciato": {
    nomeDisplay: "Glacies (Pianeta Ghiacciato)",
    domanda: "Inserisci il PIN per sbloccare Glacies:",
    pin: "8922",
    risposta: "Sbloccato! Il nostro amore resiste e brilla anche sotto zero.",
    regalo: "Sorpresa di Glacies: Un abbraccio caldo che scioglie ogni ghiaccio.",
    dedica: "Adesso è inverno e l'estate è finita. Ma tra sei mesi sarà giugno e tornerai di nuovo in estate: sai che significa? Uscire tardi la sera a fare serata al mare con i tuoi amici. Tornerai a splendere come sempre. Questo pianeta, invece, non ha mai visto un pizzico di vera estate, i bagni al mare, le risate, o quelle partite all'ultimo sangue a carte dove ognuno si inventava le proprie regole ed era una guerra a cielo aperto. Ma sai cosa ho capito? L'estate non ha alcun senso senza di te, perché la mia vera estate sei tu. Sei fantastica e sei la ragione di tutto per me: vederti felice è la cosa più bella che ci sia, non solo perché ti vedo stare bene, ma perché vedo la ragazza che amo sorridere",
    pergamena: "Prossimo Pianeta: Kronos (Pianeta Roccioso). Indizio: il giorno in qui ti ho inviato il primo sito, giorno e mese.",
    isUltimoPianeta: false,
    info: "Pianeta interamente rivestito da un guscio di ghiaccio e azoto solido trasparente. Riflette la luce delle stelle creando luccichii cristallini su tutta la superficie.",
    stats: {
      acqua: "100% Ghiaccio solido (-180°C)",
      vento: "320 km/h (Tempeste glaciali)",
      gravita: "0.8x Terrestre",
      abitabile: "Impossibile per gli umani"
    }

  },
  "Pianeta Roccioso": {
    nomeDisplay: "Kronos (Pianeta Roccioso)",
    domanda: "Inserisci il PIN per sbloccare Kronos:",
    pin: "1506", // Modifica il PIN se necessario
    risposta: "Sbloccato! Un legame solido come la roccia.",
    regalo: "Sorpresa di Kronos: Un piccolo ricordo materiale custodito per te.",
    dedica: "La roccia è qualcosa di duro e resistente, ma dopo mille colpi si rompe, proprio come le persone. Tu sei una persona fantastica e una delle più forti che io abbia mai conosciuto, però anche la roccia più dura rischia di frantumarsi dopo l'ennesimo colpo. Io non ti voglio vedere in mille pezzi, quindi ti prego amore, parlami di tutto quello che ti preoccupa e sfogati con me: ti ascolterò sempre e ti starò comunque vicino, in ogni momento. Magari non sarò in grado di darti un consiglio per ogni cosa o magari le cose che dirai potranno fare male, ma nonostante tutto io ti amo e ti resterò vicino anche quando tu sarai la prima a volerti allontare da te stessa. Ti amo e soprattutto ci sono per te, non dimenticarlo mai.",
    pergamena: "Prossimo Pianeta: Pyros (Pianeta Felino). Indizio: il soppranome che mi hai dato",
    isUltimoPianeta: false,
    info: "Mondo antico caratterizzato da canyon profondi migliaia di chilometri e cime vulcaniche ormai spente. La sua crosta rigida è ricca di quarzo viola e titanio brillante.",
    stats: {
      acqua: "Tracce sotterranee ghiacciate",
      vento: "45 km/h (Brezza minerale)",
      gravita: "1.1x Terrestre",
      abitabile: "Impossibile per gli umani"
    }
  },

  "Pianeta Fuoco": {
    nomeDisplay: "Pyros (Pianeta Felino)",
    domanda: "Inserisci il PIN per sbloccare Pyros:",
    pin: "bananino", // PIN giusto, non modificare
    risposta: "Sbloccato! Passione e calore infinito.",
    regalo: "Sorpresa di Pyros: Una fiamma eterna dedicata interamente a te.",
    dedica: "Se esiste un luogo nell'universo capace di raccontarti senza usare le parole, quel posto è sicuramente il pianeta Pyros. È un mondo immerso in un'estate perenne, dove il sole scalda l'aria in un abbraccio continuo e i tramonti tingono il cielo di sfumature dorate e calde. Ma la cosa più speciale di Pyros è che sembra nato direttamente dai tuoi pensieri: camminando tra le sue colline soleggiate si incontrano ovunque centinaia di gatti arancioni, pronti a farti le fusa, a stendersi al sole e a tenerti compagnia in ogni momento. Ho sempre pensato che Pyros ti rispecchi in modo perfetto. Raccoglie insieme tutte le cose che ti piacciono e che ti fanno sorridere, trasformandole in un pianeta intero fatto a tua immagine. C'è la tua stessa luce, quel calore che riesci a portare anche nei giorni storti e quella dolcezza semplice che rende tutto più bello. Ogni dettaglio di questo posto parla di te, ed è per questo che non poteva che appartenerti. Quando guardo questo pianeta penso a te, estiva e felice di vivere; e ogni volta che lo guardo penso a quanto ti amo. Sei la mia estate. Non vedo l'ora di vivere un'altra estate con te: magari non saremo dal vivo, ma mi basta stare con te per essere completo. Tu non puoi capire quanto ti amo, ogni secondo ti amo sempre di più. Però solo nel prossimo pianeta capirai quanto ti amo... forse. ma visto che ti lascio con il dubbio voglio solo dirti che sei fantastita amore. ti amo, buon continuo.",
    pergamena: "Prossimo Pianeta: Atheria (Gas Gigante). Indizio: il giorno mese e anno in qui ci siamo conosciuti. è facile dai. DD/MM/YYYY esempio cosi non sbagli, 01/01/0101 LE / NON DIMENTICARLE.",
    isUltimoPianeta: false,
    info: "Affascinante pianeta dalle calde tonalità rosse e arancioni. La superficie è soffice ed emette un costante e piacevole tepore termico che si diffonde nell'atmosfera.",
    stats: {
      acqua: "Presente in piccoli laghi caldi",
      vento: "15 km/h (Piacevole brezza)",
      gravita: "Perfetta per i balzi",
      abitabile: "Inabitabile per umani. Abitabile UNICAMENTE dai gatti 🐱"
    }
  },

  "Gas Gigante": {
    nomeDisplay: "Aetheria (Gas Gigante)",
    domanda: "Inserisci il PIN per sbloccare Aetheria:",
    pin: "01/12/2024", // Modifica il PIN se necessario
    risposta: "Sbloccato! Sei arrivata alla meta finale del nostro viaggio.",
    regalo: "Sorpresa del Gas Gigante: Il sigillo eterno del nostro amore.",
    dedica: "Okay Greta. Questa è l'ultima dedica che ti manca... (forse... esplora tutto meglio e magari scopri cose che non hai visto).\nMa visto che sarà l'ultima dedica che ti aiuterò a scoprire, ti voglio dire tutto, davvero tutto quello che ho dentro.\nSono felice che sei arrivata fino a qui: significa che ti ricordi ancora tutto, o almeno spero.\nL'importante per me è che tu non dimentichi mai quanto ti amo.\nTe l'ho già detto tantissime volte nelle scorse dediche, e forse penserai che sono monotono, ma non ce la faccio a non dirtelo: io sono follemente innamorato di te e penso che si sia già capito.\nPerò secondo me non hai ancora capito fino in fondo quanto ti amo.\nSei la persona più importante della mia vita, la luce delle mie giornate, e so che magari adesso dette così potrebbero sembrare parole buttate al vento o frasi fatte... ma credimi, non lo sono per niente.\nPer me tu sei tutto.\nLetteralmente tutto.\nE voglio dirti una cosa che viene dritta dal cuore, senza filtri.\nSo che a volte la vita è pesante, che ci sono giorni in cui il mondo intero sembra crollarti addosso e in cui ti senti stanca di dover essere sempre forte, di dover reggere tutto da sola.\nMa voglio che tu sappia una cosa una volta per tutte: tu non sei sola.\nMai. Ci sono io.\nAnche quando le cose vanno male, anche quando vorresti solo chiuderti in te stessa o spingermi via per paura di pesare su di me, ricordati che io non me ne vado.\nIo ci sono.\nVoglio essere il posto sicuro in cui puoi buttare giù la corazza, smettere di fingere che vada tutto bene e semplicemente sfogarti.\nPosso non avere sempre la soluzione giusta per ogni problema, posso non sapere sempre cosa dire per farti stare meglio, ma ti prometto che ti ascolterò. Sempre.\nResisterò a qualsiasi cosa pur di restarti accanto, perché non scapperò solo perché le cose si fanno difficili: resterò lì, ti prenderò la mano e ti porterò fuori dal buio.\nIo non ti voglio vedere soffrire, e se dovessi farlo, voglio dividere quel peso con te a metà.\nDetto ciò... ormai hai quasi finito il viaggio nella tua galassia.\nTi mancano solo dei segreti da qualche parte che non ti dirò: impegnati a trovarli, sono sicuro che ce la farai.\nD'altronde, se sei arrivata fino a qui, ce la farai ad andare oltre, e se vorrai ti darò un indizio solo su richiesta.\nOkay, so che forse mi sto dilungando e che non c'entra nulla con i giochi o con le stelle, ma ti amo da impazzire.\nFare questo sito per me è stato difficilissimo, ci sono stati momenti in cui volevo mollare tutto per la frustrazione, tra le ore passate a programmare, i codici che non funzionavano e le bestemmie che mi ha fatto usare.\nMa sai perché ho continuato?\nPerché ogni singola volta pensavo al momento in cui l'avresti aperto, al tuo sorriso, alla faccia che avresti fatto vedendo che tutto questo l'ho costruito con le mie mani solo per te.\nE alla fine il tempo e la fatica mi sembravano persino pochi in confronto a quello che provi tu.\nIo spero davvero che ti piaccia con tutto il mio cuore.\nSei una persona fantastica, unica, speciale, e te lo giuro qui, nero su bianco, con ogni parte di me: io ti amo, ti amo, ti amo, ti amo, ti amo...\nIO TI AMO GRETA.\nAppena riceverai il sito sarà il 1° dicembre, quindi prendilo sia come un regalo di anniversario sia come pensierino Natale in anticipo: a tal proposito, BUON NATALE AMORE MIO.\nOra però non voglio rubarti altro tempo per goderti la sorpresa...\nbuon anniversario amore della mia vita, ti amo.",
    pergamena: "", // Nessuna pergamena per l'ultimo pianeta
    isUltimoPianeta: true, // Attiva il form segreto
    info: "Un colosso gassoso composto da strati densi di idrogeno, elio e cristalli di ammoniaca violetta. Imponenti correnti magnetiche generano aurore boreali perenni lungo tutto l'equatore del pianeta.",
    stats: {
      acqua: "Assente (solo vapore acido)",
      vento: "1.400 km/h (Uragani infiniti)",
      gravita: "2.5x Terrestre",
      abitabile: "Impossibile per gli umani"
    }
  },

  "Pianeta Cuore": {
    nomeDisplay: "Cor Cordis (Il Pianeta Cuore 🩶)",
    domanda: "Inserisci il PIN segreto del nostro Cuore:",
    pin: "io ti amo", // Puoi cambiare il PIN con la data che preferisci (es. 1504 o altro)
    risposta: "Sbloccato! Questo pianeta batte solo per noi due.",
    regalo: "Sorpresa del Cuore: La prova che ogni angolo del mio universo appartiene a te.",
    dedica: "Sei il battito che dà senso ad ogni stella di questa galassia. Ti amo immensamente, Greta.",
    pergamena: "Fine del viaggio... ma il nostro futuro insieme è appena iniziato ❤️",
    isUltimoPianeta: false,
    info: "Un pianeta unico e irripetibile nato direttamente dall'energia del nostro amore. La sua superficie brilla di riflessi perlacei e argentati, emanando un calore gentile in tutto lo spazio circostante.",
    stats: {
      acqua: "Oceani di pura dolcezza",
      vento: "0 km/h (Quiete e armonia eterna)",
      gravita: "Perfetta sintonia",
      abitabile: "Abitabile esclusivamente da noi"
    }
  }
};
window.onload = init;

function init() {
  const container = document.getElementById('canvas-container');
  scene = new THREE.Scene();

  const initialFov = window.innerWidth < window.innerHeight ? 75 : 60;
  camera = new THREE.PerspectiveCamera(initialFov, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  creaSole();
  creaSfondoRealisticoAvanzato();
  creaPianeti();

  heartGroup = new THREE.Group();
  heartGroup.position.set(0, 0, -50);
  heartGroup.rotation.x = Math.PI / 2;
  scene.add(heartGroup);
  creaGalassiaCuore();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enabled = false;
  controls.minDistance = 15;
  controls.maxDistance = 180;
  controls.enablePan = false;
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('pointerdown', onDocumentPointerDown);
  animate();
}

function avviaViaggioSpaziale() {
  document.getElementById('card').style.opacity = '0';
  setTimeout(() => document.getElementById('card').style.display = 'none', 800);
  isWarping = true;

  // Fa partire la musica dell'universo
  cambiaMusica('universo');
}

function onDocumentPointerDown(event) {
  // SE UNA FINSTRA O MODALE È APERTA, BLOCCA COMPLETAMENTE I CLICK SULLO SPAZIO 3D
  const storyOpen = document.getElementById('storyModal').style.display === 'flex' || document.getElementById('storyModal').style.display === 'block';
  const planetOpen = document.getElementById('planetModal').style.display === 'block';
  const infoOpen = document.getElementById('planetInfoPanel').style.display === 'block';

  if (storyOpen || planetOpen || infoOpen) {
    return; // Esce subito, impedendo di cliccare pianeti o testi sullo sfondo
  }

  if (!controls.enabled || isFocusingPlanet) return;

  let clientX = event.clientX;
  let clientY = event.clientY;

  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  }

  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersectsText = raycaster.intersectObjects(textGroup.children);
  if (intersectsText.length > 0) {
    const obj = intersectsText[0].object;
    if (obj.userData.isStartButton) {
      apriAvventura();
      return;
    }
    apriStoria(obj.userData.title, obj.userData.story);
    return;
  }

  const intersectsSun = raycaster.intersectObject(sunMesh);
  if (intersectsSun.length > 0) {
    gestisciClickSole();
    return;
  }

  if (capsuleLista.length > 0) {
    let oggettiCapsule = [];
    capsuleLista.forEach(cap => {
      cap.traverse(child => oggettiCapsule.push(child));
    });

    const intersectsCapsules = raycaster.intersectObjects(oggettiCapsule, true);
    if (intersectsCapsules.length > 0) {
      let objHit = intersectsCapsules[0].object;
      while (objHit.parent && objHit.parent !== scene) {
        if (capsuleLista.includes(objHit)) break;
        objHit = objHit.parent;
      }

      const testoDaMostrare = objHit.userData.testoMessaggio || "Messaggio d'amore nel nostro universo!";
      apriStoria("🚀 Capsula del Tempo", `Ecco il messaggio di questa capsula:\n\n"${testoDaMostrare}"\n\nRimarrà fluttuante per sempre nel nostro universo! ❤️`);
      return;
    }
  }

  const intersectsPlanets = raycaster.intersectObjects(planetGroup.children);
  if (intersectsPlanets.length > 0) {
    focalizzaPianeta(intersectsPlanets[0].object);
    return;
  }
}

// --- GESTIONE UNICA APERTURA STORIA / DEDICA ---
function apriStoria(titolo, testo, mostraPulsantiCuore = false) {
  document.getElementById('modalTitle').innerText = titolo;
  document.getElementById('modalContent').innerText = testo;
  document.getElementById('modalBackdrop').style.display = 'block';

  // Mostra i 5 pulsanti SOLO se è la dedica principale del cuore giallo ("ti amo tanto")
  const boxPulsanti = document.getElementById('cuoreGialloInterazione');
  if (boxPulsanti) {
    boxPulsanti.style.display = mostraPulsantiCuore ? 'block' : 'none';
  }

  const modal = document.getElementById('storyModal');
  modal.style.display = 'flex';
}

function apriAvventura() {
  document.getElementById('modalTitle').innerText = "INIZIO DELL'AVVENTURA";
  document.getElementById('modalContent').innerText = `${avventuraTestoConsiglio}\n\n${avventuraTestoMisterioso}`;
  document.getElementById('modalBackdrop').style.display = 'block'; // Mostra il blocco scuro
  document.getElementById('storyModal').style.display = 'block';
}

function chiudiStoria() {
  document.getElementById('storyModal').style.display = 'none';
  // Chiude il backdrop solo se anche il planetModal è chiuso
  if (document.getElementById('planetModal').style.display !== 'block') {
    document.getElementById('modalBackdrop').style.display = 'none';
  }
}

function focalizzaPianeta(planetMesh) {
  // ... (tutto il codice precedente della funzione rimane identico, aggiungi solo questa riga in fondo:)
  document.getElementById('modalBackdrop').style.display = 'block'; // Attiva il blocco fisico
  document.getElementById('planetModal').style.display = 'block';
}

function chiudiPianeta() {
  document.getElementById('planetModal').style.display = 'none';
  if (document.getElementById('planetInfoPanel')) document.getElementById('planetInfoPanel').style.display = 'none';
  if (document.getElementById('planetTopTitle')) document.getElementById('planetTopTitle').style.display = 'none';

  // COMANDO FORZATO: Interrompe qualsiasi audio del pianeta e rimette subito l'universo
  cambiaMusica('universo');

  if (document.getElementById('storyModal').style.display !== 'block' && document.getElementById('storyModal').style.display !== 'flex') {
    document.getElementById('modalBackdrop').style.display = 'none';
  }

  if (isFocusingPlanet) {
    targetLookAt.set(0, 0, -50);
    targetCameraPos.set(0, 20, -25);
    setTimeout(() => {
      controls.target.set(0, 0, -50);
      controls.enabled = true;
      isFocusingPlanet = false;
    }, 600);
  }
}

// Funzione globale per chiudere tutto se si clicca sullo sfondo scuro
function chiudiTuttoModale() {
  chiudiStoria();
  chiudiPianeta();
}

// --- GESTIONE FRASI E AVVENTURA (CENTRO) ---
function apriStoria(titolo, testo) {
  document.getElementById('modalTitle').innerText = titolo;
  document.getElementById('modalContent').innerText = testo;
  const modal = document.getElementById('storyModal');
  modal.style.display = 'flex';
}

function apriAvventura() {
  document.getElementById('modalTitle').innerText = "INIZIO DELL'AVVENTURA";
  document.getElementById('modalContent').innerText = `${avventuraTestoConsiglio}\n\n${avventuraTestoMisterioso}`;
  document.getElementById('storyModal').style.display = 'block';
}

function chiudiStoria() {
  document.getElementById('storyModal').style.display = 'none';
}

// --- GESTIONE PIANETI E PIN (IN BASSO) ---
function focalizzaPianeta(planetMesh) {
  currentSelectedPlanet = planetMesh.name;
  controls.enabled = false;
  isFocusingPlanet = true;

  // Selezione della musica in base al pianeta
  if (planetMesh.name === "Pianeta Ghiacciato") {
    cambiaMusica('ghiacciato');
  } else if (planetMesh.name === "Pianeta Cuore") {
    cambiaMusica('cuore');
  } else if (planetMesh.name === "Gas Gigante") {
    cambiaMusica('gas');
  } else if (planetMesh.name === "Pianeta Roccioso") {
    cambiaMusica('Roccioso');
  } else if (planetMesh.name === "Pianeta Fuoco") {
    cambiaMusica('Fuoco');
  }

  currentSelectedPlanet = planetMesh.name;
  controls.enabled = false;
  isFocusingPlanet = true;

  if (planetMesh.name === "Pianeta Cuore" && !planetMesh.userData.colorato) {
    planetMesh.userData.colorato = true;

    const pos = planetMesh.geometry.attributes.position;
    const uvs = [];
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      uvs.push((x - minX) / rangeX, (y - minY) / rangeY);
    }

    planetMesh.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    planetMesh.geometry.uvsNeedUpdate = true;

    planetMesh.material.color.set(0xffffff);
    planetMesh.material.emissive.set(0xff8c00);
    planetMesh.material.emissiveIntensity = 0.2;
    planetMesh.material.roughness = 0.2;
    planetMesh.material.metalness = 0.1;
    planetMesh.material.map = creaTextureCuoreBicolore();
    planetMesh.material.needsUpdate = true;
  }

  const pPos = planetMesh.position;
  targetLookAt.copy(pPos);
  targetCameraPos.set(pPos.x + 5, pPos.y + 3, pPos.z + 8);

  const data = datiPianeti[planetMesh.name] || planetMesh.userData;

  const topTitle = document.getElementById('planetTopTitle');
  if (topTitle) {
    topTitle.innerText = data.nomeDisplay || data.nome;
    topTitle.style.display = 'block';
  }

  document.getElementById('planetTitle').innerText = data.nomeDisplay || data.nome;
  document.getElementById('planetQuestion').innerText = data.domanda;

  const pinInput = document.getElementById('pinInput') || document.getElementById('planetPin');
  if (pinInput) pinInput.value = '';

  const pinMsg = document.getElementById('pinMessage');
  if (pinMsg) pinMsg.innerText = '';

  const quizBox = document.getElementById('planetQuizBox');
  const cuoreChoiceBox = document.getElementById('cuoreChoiceBox');
  const cuorePinBox = document.getElementById('cuorePinBox');
  const cuoreGretaFormBox = document.getElementById('cuoreGretaFormBox');

  if (cuorePinBox) cuorePinBox.style.display = 'none';
  if (cuoreGretaFormBox) cuoreGretaFormBox.style.display = 'none';

  // Se è il Pianeta Cuore, mostriamo la scelta bicolore e nascondiamo il quiz standard
  if (planetMesh.name === "Pianeta Cuore") {
    if (quizBox) quizBox.style.display = 'none';
    if (cuoreChoiceBox) cuoreChoiceBox.style.display = 'block';
  } else {
    if (quizBox) quizBox.style.display = 'block';
    if (cuoreChoiceBox) cuoreChoiceBox.style.display = 'none';
  }

  const extrasBox = document.getElementById('planetUnlockExtras');
  if (extrasBox) extrasBox.style.display = 'none';
  const finalExtrasBox = document.getElementById('planetFinalExtras');
  if (finalExtrasBox) finalExtrasBox.style.display = 'none';

  const secretFormBtn = document.getElementById('planetSecretFormBtn');
  if (secretFormBtn) secretFormBtn.style.display = 'none';
  const secretForm = document.getElementById('planetSecretForm');
  if (secretForm) secretForm.style.display = 'none';

  if (document.getElementById('planetInfoPanel')) {
    document.getElementById('infoTitle').innerText = data.nomeDisplay || data.nome;
    document.getElementById('infoBody').innerText = data.info;

    if (data.stats) {
      document.getElementById('infoStats').innerHTML = `
        <div><span class="stat-label">Acqua:</span> <span class="stat-value">${data.stats.acqua}</span></div>
        <div><span class="stat-label">Vento:</span> <span class="stat-value">${data.stats.vento}</span></div>
        <div><span class="stat-label">Gravità:</span> <span class="stat-value">${data.stats.gravita}</span></div>
        <div style="margin-top: 8px; font-weight: bold;">
          <span class="stat-label">Abitabilità:</span> <span class="stat-value">${data.stats.abitabile}</span>
        </div>
      `;
    }
    const panel = document.getElementById('planetInfoPanel');
    panel.classList.remove('mobile-open');
    if (window.innerWidth > 768) {
      panel.style.display = 'block';
    } else {
      panel.style.display = 'none';
    }
  }

  document.getElementById('planetModal').style.display = 'block';
}

// Funzioni di gestione per le due scelte del Pianeta Cuore
function selezionaLatoCuore(lato) {
  const cuoreChoiceBox = document.getElementById('cuoreChoiceBox');
  const cuorePinBox = document.getElementById('cuorePinBox');
  const cuoreGretaFormBox = document.getElementById('cuoreGretaFormBox');

  if (cuoreChoiceBox) cuoreChoiceBox.style.display = 'none';

  if (lato === 'giallo') {
    if (cuorePinBox) cuorePinBox.style.display = 'block';
  } else if (lato === 'arancione') {
    if (cuoreGretaFormBox) cuoreGretaFormBox.style.display = 'block';
  }
}

function verificaPinCuoreGiallo() {
  const pinInput = document.getElementById('cuorePinInput');
  const msg = document.getElementById('cuorePinMsg');
  if (!pinInput) return;

  const inputUtente = pinInput.value.trim().toLowerCase();

  // Mappa delle 4 password con relative dediche
  const dedicheCuoreGiallo = {
    "ti amo tanto": {
      titolo: "ADDIRITURA MI AMI E PURE TANTO?",
      testo: "Ti amo tanto, infinitamente, più di qualsiasi altra cosa al mondo.\nQuesto lato del mio cuore custodisce tutto l'amore che provo per te.\nPerò non voglio dire tutto adesso, quindi avanti col prossimo argomento che devo prendere coraggio..\nNon per farti un torto...\nanzi, forse sì!\nMa sappi che ci sono altre 3 dediche nascoste.\nSecondo me non ci arrivi, ma visto che comunque io le ho fatte e voglio (forse) che tu le trovi.\nTi do un indizio: prova a cambiare la password che hai messo, magari scopri qualcosa, chi lo sa...\nOvviamente le dediche cambiano in base alla password, chissà cosa ho messo nelle altre dediche...\nFinita questa pausa, mi manca ancora il coraggio, ma te lo dirò comunque.\nA volte mi fermo a pensare alle nostre giornate, ai messaggi che ci mandiamo, alle risate, a tutte le ore passate a parlare di qualsiasi cosa o anche solo a stare in silenzio sapendo che dall'altra parte ci sei tu.\nTu non immagini nemmeno quanto sia importante per me passare il tempo insieme a te.\nÈ incredibile come ogni singolo secondo in tua compagnia riesca a cancellare tutto il resto, a far sparire la stanchezza, i pensieri pesanti e qualsiasi problema.\nQuando ci sei tu, tutto diventa più leggero, più bello, più vero.\nSei diventata il mio punto di riferimento fisso, la persona a cui voglio raccontare tutto, quella che mi conosce davvero fino in fondo e con cui posso essere me stesso al cento per cento, senza filtri e senza dover fingere mai.\nAmo il tuo modo di fare, amo quando ridiamo come matti, amo ogni sfumatura del tuo carattere, anche quando mi fai arrabbiare o mi tieni testa.\nCon te ho capito che l'amore non è una cosa astratta, ma sono le piccole cose: un tuo messaggio che mi fa spuntare il sorriso mentre faccio tutt'altro, la voglia irrefrenabile di sentirti, il pensiero costante di volerti vicina anche quando siamo lontani.\nÈ da tanto che continuiamo a rimandare la cosa più importante, quella che forse entrambi abbiamo dentro ma che abbiamo sempre tenuto lì, in sospeso.\nSolo al pensiero di scriverti queste parole ho il batticuore a mille, te lo giuro.\nTi sto scrivendo questa dedica l'11 novembre una dedica che tu vedrai solo 1 dicembre ma nonostante tutto, ho le mani che tremano e un'ansia mista a una felicità immensa che non riesco a spiegare.\nHo il cuore in gola e la tachicardia solo al pensiero che tu, tra qualche giorno, aprirai questo sito, leggerai esattamente questo pezzo e capirai tutto quello che ho nel petto.\nIo ti amo, Greta.\nTi amo da impazzire, con ogni singola parte di me, nei giorni belli e in quelli più difficili.\nE allora, arrivati a questo punto, dopo tutto quello che abbiamo costruito e vissuto in questi due anni...\nfacciamo il passo definitivo?\nMagari ci sarà difficile, il pensiero onestamente fa paura anche a me, una paura soffocante: il pensiero che se ci separiamo da amici si può recuperare, mentre da fidanzati è più difficile...\nma i momenti belli che mi perderei per colpa delle mie paure sono troppi.\nQuindi facciamoci coraggio, perché non voglio andare avanti con il pentimento di non aver mai fatto il primo passo.\nQuindi, senza contare il mio cuore a mille, l'emozione che mi sale e il fatto che tu potresti leggerlo..\nIO TI AMO GRETA, TI ANDREBBE DI METTERCI INSIEME UFFICIALMENTE?\nMagari non è una dichiarazione da 10 su 10, ma solo il nostro rapporto lo sarà.\nti prego se mai leggi questo non ti dico di darmi una risposta ma almeno dimmi che lo hai letto. giusto per calmarmi dato che avro gia la testa piena di paranoie e continuero a pensare a questo passo che ho fatto. E NON MENE PENTO IO TI AMO E NON VEDO L'ORA DI SAPERE SE LO HAI LETTO."
    },

    "ti amo": {
      titolo: "hai messo che mi ami..",
      testo: "Ti amo. Semplice, diretto, senza filtri. E te lo dico perché è la cosa più vera(forse) che ho dentro.\nSei la luce delle mie giornate, il mio pensiero fisso e la parte migliore di me. Mi basta un tuo messaggio, anche il più stupido, per farmi svoltare la giornata e mettermi il sorriso in faccia. Con te ogni momento diventa più bello, più leggero e più vero. Non importa cosa accada o i problemi che ci saranno, io sarò sempre qui, a stringerti la mano forte e ad amarti ogni singolo giorno di più, senza riserve.\nComunque, se vuoi farmi sciogliere il cuore ancora di più e sbloccare una dedica ancora più speciale... ti do un aiuto gigantesco (praticamente ti sto regalando la soluzione🙄): prova ad aggiungere un'altra parola a quel 'ti amo'. Vediamo se capisci cosa manca per farmi sciogliere del tutto...\nMa comunque, non per farti un torto... anzi, forse sì, Sappi che ci sono altre 3 dediche nascoste. Secondo me non ci arrivi, visto che comunque io le ho fatte e voglio (forse) che tu le trovi, ti do un indizio: prova a cambiare la password che hai messo, magari scopri qualcosa... chi lo sa. Ovviamente le dediche cambiano in base alla password, chissà cosa ho messo nelle altre dediche.."
    },

    "ti voglio bene": {
      titolo: "Ti voglio bene",
      testo: "Ti voglio un bene immenso. Sei la mia migliore amica, la mia complice in tutto e la persona con cui posso essere me stesso al 1000%, senza filtri e senza dover fingere mai. Adoro tutte le risate che ci facciamo, i momenti in cui ci capiamo al volo e il fatto che con te anche le giornate più normali diventano speciali. Grazie di esistere e di essere sempre così, semplicemente unica. ma comunque.\nse devo essere onesto non voglio che tu capiti qui, per il semplice fatto che io non ti voglio bene, io ti amo e se sei qui è perchè lo hai messo..\nperò visto che lo ho fatto ti ho scritto una piccola dedica (secondo me è la dedica peggiore per il semplice fatto che le altre le ho scritte per la donna che amo.) ma comunque\n\nnon per farti un torto, anzi forse si. ma sappi che ci altre altre 3 dediche nascoste, secondo me non ci arrivi, visto che comunque io le ho fatte e voglio (forse) che tu le trovi, ti do un indizio.\n prova a cambiare la password che hai messo, magari scopri qualcosa.. chi lo sa. ovviamente le dediche cambiano in base alla password chi sa cosa ho messo nelle altre dediche.."
    },

    "ti odio": {
      titolo: "mi odi? io invece ti amo da morire",
      testo: "Ed eccola che prova a rovinare il momento.\nMa visto che io sono FOLLEMENTE INNAMORATO DELL'AMORE DELLA MIA VITA, cioè te, ti voglio solo dire che, nonostante tutto, nonostante le scenate, o quando fai la dura o quando litighiamo per stupidate, io ti amo, io ti amo così tanto che non si può spiegare.\nSei l'amore della mia vita, l'unica persona che voglio al mio fianco, e io voglio solo te, nient'altro. Amo tutto di te: amo ogni singola sfumatura del tuo carattere e, te lo giuro, amo tutte quelle cose che tu chiami 'difetti', ma che in realtà per me sono semplicemente perfette così come sono.\nSei il mio punto di riferimento e io sono così fiero di te, orgoglioso di te in qualsiasi occasione, di come sei e di come fai. Sei il mio idolo più grande per il modo in cui affronti le cose, per la forza che ci metti e per tutto quello che sei. Non ti cambierei mai con nessun'altra al mondo... perchè sei la mia scema preferita, tu per me sei casa, per me.. tu sei amore per me.\nComunque, se vuoi dediche migliori la prossima volta, vedi di farmi sciogliere il cuore... e chissà che cosa ci vuole per farmelo sciogliere davvero (questo indizio l'ho detto solo a te, MI ASPETTO QUINDI CHE TU RIESCA AD ANDARE OLTRE.).\nMa comunque...\nNon per farti un torto... anzi, forse sì Ma sappi che ci sono altre 3 dediche nascoste. Secondo me non ci arrivi, visto che comunque io le ho fatte e voglio (forse) che tu le trovi. Ti do un indizio: prova a cambiare la password che hai messo, magari scopri qualcosa... chi lo sa. Ovviamente le dediche cambiano in base alla password, chissà cosa ho messo nelle altre dediche.."
    }
  };

  if (dedicheCuoreGiallo[inputUtente]) {
    msg.style.color = "#00ff88";
    msg.innerText = "✨ Password corretta! Sbloccato con successo 💛";

    const dedicaScelta = dedicheCuoreGiallo[inputUtente];
    const isCuoreGialloPrincipale = (inputUtente === "ti amo tanto");

    setTimeout(() => {
      chiudiPianeta();
      apriStoria(dedicaScelta.titolo, dedicaScelta.testo, isCuoreGialloPrincipale); // Attiva i 5 pulsanti solo qui
    }, 1400);
  } else {
    msg.style.color = "#ff3366";
    msg.innerText = "⚠️ Password errata!";
    pinInput.value = '';
    pinInput.classList.add('error-shake');
    setTimeout(() => pinInput.classList.remove('error-shake'), 400);
  }
}

async function inviaMessaggioGretaCuore(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    await fetch(form.action, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    form.reset();
    const feedback = document.getElementById('cuoreFormFeedback');
    if (feedback) {
      feedback.style.display = 'block';
      setTimeout(() => {
        feedback.style.display = 'none';
        chiudiPianeta();
      }, 3000);
    }
  } catch (error) {
    form.reset();
    chiudiPianeta();
  }
}

function verificaPin() {
  if (isErrorTimeout) return;

  const pinInput = document.getElementById('pinInput') || document.getElementById('planetPin');
  const msg = document.getElementById('pinMessage') || document.getElementById('modalContent');
  const pinCorretto = datiPianeti[currentSelectedPlanet].pin;

  // Confronto case-insensitive e senza spazi superflui
  if (pinInput.value.trim().toLowerCase() === pinCorretto.toLowerCase()) {
    if (msg.id === 'pinMessage') {
      msg.style.color = "#00ff88";
      msg.innerText = datiPianeti[currentSelectedPlanet].risposta;
    } else {
      msg.innerText = datiPianeti[currentSelectedPlanet].risposta;
      msg.classList.remove('error-text');
    }

    if (document.getElementById('planetQuizBox')) {
      document.getElementById('planetQuizBox').style.display = 'none';
    }

    if (currentSelectedPlanet === "Gas Gigante") {
      spawnaPianetaCuore();
    }

    const dataPianetaCorrente = datiPianeti[currentSelectedPlanet];
    const extrasBox = document.getElementById('planetUnlockExtras');
    const finalExtrasBox = document.getElementById('planetFinalExtras');
    const secretForm = document.getElementById('planetSecretForm');

    if (dataPianetaCorrente.isUltimoPianeta) {
      if (extrasBox) extrasBox.style.display = 'none';
      if (finalExtrasBox) finalExtrasBox.style.display = 'flex';

      const secretFormBtn = document.getElementById('planetSecretFormBtn');
      if (secretFormBtn) secretFormBtn.style.display = 'block';

      if (secretForm) secretForm.style.display = 'none';
    } else {
      if (extrasBox) extrasBox.style.display = 'flex';
      if (finalExtrasBox) finalExtrasBox.style.display = 'none';
      if (secretForm) secretForm.style.display = 'none';
    }
  } else {
    isErrorTimeout = true;
    pinInput.value = '';
    if (msg.id === 'pinMessage') {
      msg.style.color = "#ff3366";
      msg.innerText = "⚠️ PIN Errato! Riprova.";
    } else {
      msg.innerText = "⚠️ PIN Errato! Riprova.";
      msg.classList.add('error-text');
    }
    pinInput.classList.add('error-shake');

    setTimeout(() => {
      if (msg.id === 'pinMessage') {
        msg.innerText = '';
      } else {
        msg.innerText = datiPianeti[currentSelectedPlanet].domanda;
        msg.classList.remove('error-text');
      }
      pinInput.classList.remove('error-shake');
      isErrorTimeout = false;
    }, 1500);
  }
}

function gestisciClickSole() {
  const toast = document.getElementById('sunToast');
  toast.style.display = 'block';
  if (!sunBurned) {
    toast.innerText = "Prima di questo sole, la galassia era buia, del tutto spenta. Appena l'ho messo mi sei venuta subito in mente tu: mi hai ricordato quanto riesci a brillare anche nell'oscurità e come sai illuminare chiunque ti stia vicino. In parole più semplici, l'ho fatto soprattutto per riassaporare quella te estiva, così piena di vita.\n\nQuando leggerai queste parole sarà ormai il primo dicembre: fuori fa freddo e la stella splendente che sei è come avvolta dalla neve, pronta però a riaccendersi per tornare a risplendere a pieno. Ogni volta che ti parlo mi cambi la giornata, mi illumini la vita. Sei la luce che non trovo in nessun altro posto al mondo, sei il mio sole.\n\nTi amo, Greta, davvero. Ti amo tantissimo.";
    setTimeout(() => { toast.style.display = 'none'; sunBurned = true; }, 5000);
  } else {
    toast.innerText = "Il sole ha bruciato il messaggio, non odiarmi per questo.\nah e scusa se la grafica è bruttina.";
    setTimeout(() => toast.style.display = 'none', 3500);
  }
}

function animate() {
  requestAnimationFrame(animate);
  let time = clock.getElapsedTime();
  if (starMaterial) starMaterial.opacity = 0.75 + Math.sin(time * 2.5) * 0.25;

  if (!isWarping) {
    stars.rotation.y += 0.0002;
    if (stars.scale.z > 1) {
      stars.scale.z = THREE.MathUtils.lerp(stars.scale.z, 1, 0.02);
      stars.rotation.z = THREE.MathUtils.lerp(stars.rotation.z, 0, 0.02);
    }
  } else {
    if (warpFactor < 1) {
      warpFactor += 0.015;
      camera.position.z -= 0.8;
      stars.scale.z = 1 + warpFactor * 5;
      stars.rotation.z += 0.01;
      heartParticles.material.opacity = coreParticles.material.opacity = Math.min(warpFactor * 1.2, 1);
      textGroup.children.forEach(s => s.material.opacity = Math.min(warpFactor * 1.2, 1));
    } else if (!controls.enabled && !isFocusingPlanet) {
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, -25, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 20, 0.03);
      if (Math.abs(camera.position.z + 25) < 1) {
        controls.target.set(0, 0, -50);
        controls.enabled = true;
      }
    }
  }

  if (isFocusingPlanet) {
    camera.position.lerp(targetCameraPos, 0.05);
    controls.target.lerp(targetLookAt, 0.05);
    controls.update();
  } else if (controls.enabled) {
    controls.update();
  } else if (isWarping) {
    camera.lookAt(0, 0, -50);
  }

  if (planetGroup) planetGroup.children.forEach((p, i) => p.rotation.y += 0.0012 * (i + 1));
  if (sunMesh) sunMesh.rotation.y += 0.0004;
  if (heartGroup) heartGroup.rotation.z += 0.0025;

  aggiornaGattiInOrbita();

  // Navigazione autonoma e dinamica per tutte le capsule attive nello spazio
  if (capsuleLista.length > 0) {
    let t = clock.getElapsedTime() * 0.4;
    capsuleLista.forEach((cap, index) => {
      let offset = cap.userData.offsetMovimento || (index * 15);
      let tIndividua = t + offset;

      const raggioX = 55;
      const raggioZ = 60;

      cap.position.x = Math.sin(tIndividua * 0.6) * raggioX;
      cap.position.z = -40 + Math.cos(tIndividua * 0.4) * raggioZ;
      cap.position.y = 5 + Math.sin(tIndividua * 0.9) * 15;

      cap.rotation.y += 0.012;
      cap.rotation.x = Math.sin(tIndividua * 0.5) * 0.4;
      cap.rotation.z = Math.cos(tIndividua * 0.3) * 0.4;
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.fov = width < height ? 75 : 60;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function apriContenutoExtra(tipo) {
  const data = datiPianeti[currentSelectedPlanet];
  if (!data) return;

  let titolo = "";
  let testo = "";

  if (tipo === 'regalo') {
    titolo = "🎁 Il Regalo";
    testo = data.regalo;
  } else if (tipo === 'dedica') {
    titolo = "💌 La Dedica";
    testo = data.dedica;
  } else if (tipo === 'pergamena') {
    titolo = "📜 Pergamena & Prossimo Indizio";
    testo = data.pergamena;
  }

  apriStoria(titolo, testo);
}

async function inviaMessaggioSegreto(event) {
  event.preventDefault();
  const form = event.target;
  const textarea = form.querySelector('textarea');
  messaggioSalvatoGreta = textarea.value; // Salva il messaggio in memoria

  const data = new FormData(form);

  try {
    // Invio asincrono a Formspree gestito in background con modalita no-cors
    // per evitare blocchi di sicurezza del browser in locale
    await fetch(form.action, {
      method: 'POST',
      body: data,
      mode: 'no-cors'
    });

    // Indipendentemente dalla risposta bloccata dal browser in locale, l'email parte e noi attiviamo la magia
    form.reset();
    const feedback = document.getElementById('formFeedback');
    if (feedback) {
      feedback.style.display = 'block';
      setTimeout(() => feedback.style.display = 'none', 4000);
    }

    document.getElementById('planetSecretForm').style.display = 'none';
    creaCapsulaSpaziale();

    setTimeout(() => chiudiPianeta(), 2000);

  } catch (error) {
    // Fallback di sicurezza nel caso estremo di assenza totale di rete
    form.reset();
    document.getElementById('planetSecretForm').style.display = 'none';
    creaCapsulaSpaziale();
    setTimeout(() => chiudiPianeta(), 2000);
  }
}

function apriFormMessaggio() {
  const btn = document.getElementById('planetSecretFormBtn');
  const formBox = document.getElementById('planetSecretForm');
  if (btn) btn.style.display = 'none';
  if (formBox) formBox.style.display = 'block';
}

function creaCapsulaSpaziale() {
  const capsulaGruppo = new THREE.Group();

  const materialeCristallo = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x0088ff,
    emissiveIntensity: 0.8,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85
  });

  const nucleoGeo = new THREE.OctahedronGeometry(1.5, 0);
  const nucleoMesh = new THREE.Mesh(nucleoGeo, materialeCristallo);
  capsulaGruppo.add(nucleoMesh);

  const anelloGeo = new THREE.TorusGeometry(2.2, 0.06, 16, 48);
  const anelloMat = new THREE.MeshStandardMaterial({
    color: 0xff1493,
    emissive: 0xff1493,
    emissiveIntensity: 1.0,
    roughness: 0.1
  });
  const anelloMesh = new THREE.Mesh(anelloGeo, anelloMat);
  anelloMesh.rotation.x = Math.PI / 3;
  capsulaGruppo.add(anelloMesh);

  const sferaGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const sferaMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00ffff,
    emissiveIntensity: 1.0
  });

  const satellite1 = new THREE.Mesh(sferaGeo, sferaMat);
  satellite1.position.set(2.2, 0, 0);
  capsulaGruppo.add(satellite1);

  const satellite2 = new THREE.Mesh(sferaGeo, sferaMat);
  satellite2.position.set(-2.2, 0, 0);
  capsulaGruppo.add(satellite2);

  // Posizionamento iniziale casuale nello spazio
  capsulaGruppo.position.set(
    (Math.random() - 0.5) * 40,
    5 + Math.random() * 10,
    -30 + (Math.random() - 0.5) * 30
  );

  // Salviamo il messaggio specifico e un offset di movimento unico per ogni capsula
  const datiCapsula = {
    isCapsulaMessaggio: true,
    testoMessaggio: messaggioSalvatoGreta,
    offsetMovimento: Math.random() * 50
  };

  capsulaGruppo.traverse((child) => {
    child.userData = datiCapsula;
  });

  scene.add(capsulaGruppo);
  capsuleLista.push(capsulaGruppo);

  // REGOLA DELLE 3 CAPSULE: Se superiamo quota 3, rimuoviamo la più vecchia (la prima inserita)
  if (capsuleLista.length > 3) {
    const capsulaVecchia = capsuleLista.shift(); // Estrae la più vecchia dalla lista
    scene.remove(capsulaVecchia); // La cancella completamente dalla scena 3D
  }
}

function creaTextureCuoreBicolore() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Gradiente orizzontale simmetrico e perfetto al centro esatto della canvas
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0.0, '#ffeb3b');  // Giallo puro a sinistra
  gradient.addColorStop(0.45, '#ffeb3b'); // Giallo pieno fino a ridosso del centro
  gradient.addColorStop(0.50, '#ff9800'); // Sfumatura centrale arancione/gialla
  gradient.addColorStop(0.55, '#ff5722'); // Inizio arancione
  gradient.addColorStop(1.0, '#ff3d00');  // Arancione pieno a destra

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function spawnaPianetaCuore() {
  if (pianetaCuoreGenerato) return;
  pianetaCuoreGenerato = true;

  const heartShape = new THREE.Shape();
  heartShape.moveTo(25, 25);
  heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
  heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
  heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
  heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

  const extrudeSettings = {
    depth: 12,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 2,
    bevelSize: 4,
    bevelThickness: 4
  };

  const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  heartGeo.center();
  heartGeo.rotateX(Math.PI);

  // Materiale iniziale grigio/argento per quando spawna
  const heartMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    emissive: 0x444444,
    emissiveIntensity: 0.4,
    roughness: 0.3,
    metalness: 0.8
  });

  const cuoreMesh = new THREE.Mesh(heartGeo, heartMat);
  cuoreMesh.scale.set(0.08, 0.08, 0.08);
  cuoreMesh.name = "Pianeta Cuore";
  cuoreMesh.position.set(-35, 12, -45);

  if (planetGroup) {
    planetGroup.add(cuoreMesh);
  } else {
    scene.add(cuoreMesh);
  }

  const toast = document.getElementById('sunToast');
  if (toast) {
    toast.style.display = 'block';
    toast.innerText = "✨ Un pianeta bonus segreto a forma di cuore (🩶) è appena nato ed è apparso nell'universo!";
    setTimeout(() => toast.style.display = 'none', 6000);
  }
}

function apriContenutoExtra(tipo) {
  const data = datiPianeti[currentSelectedPlanet];
  if (!data) return;

  if (tipo === 'regalo') {
    const regaloObj = (typeof regaliPianeti !== 'undefined' && regaliPianeti[currentSelectedPlanet])
      ? regaliPianeti[currentSelectedPlanet]
      : { titolo: "🎁 Il Regalo", testo: data.regalo };

    if (regaloObj.isMinigioco) {
      // Se è il minigioco del pianeta ghiacciato, avvialo!
      avviaMinigiocoGhiacciato();
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

// Funzione per inviare i 4 pulsanti principali via Formspree
async function inviaRispostaCuoreGiallo(scelta) {
  const formData = new FormData();
  formData.append("risposta_speciale_cuore", `Ha scelto il pulsante: ${scelta}`);

  try {
    await fetch("https://formspree.io/f/xrevogdv", {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });
  } catch (e) {
    // Gestione silenziosa
  }

  const feedback = document.getElementById('rispostaInviataFeedback');
  if (feedback) {
    feedback.innerText = `Hai risposto: "${scelta}". Inviato con successo! ❤️`;
    feedback.style.display = 'block';
    setTimeout(() => {
      feedback.style.display = 'none';
      chiudiTuttoModale();
    }, 2500);
  }
}

// Funzione per l'invio della casella di testo personalizzata (5° opzione)
async function inviaRispostaCustomCuore(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    await fetch(form.action, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });
  } catch (e) {
    // Gestione silenziosa
  }

  form.reset();
  const feedback = document.getElementById('rispostaInviataFeedback');
  if (feedback) {
    feedback.innerText = "Risposta personalizzata inviata con successo! ❤️✨";
    feedback.style.display = 'block';
    setTimeout(() => {
      feedback.style.display = 'none';
      chiudiTuttoModale();
    }, 2500);
  }
}

let isMuted = false;

function toggleMusica() {
  const audio = document.getElementById('bgAudio');
  const btn = document.getElementById('musicToggleBtn');
  const icon = document.getElementById('musicIcon');
  if (!audio || !btn || !icon) return;

  isMuted = !isMuted;

  if (isMuted) {
    audio.pause();
    btn.classList.add('muted');
    icon.innerText = '🔇';
  } else {
    btn.classList.remove('muted');
    icon.innerText = '🎵';
    if (audio.src) {
      audio.play().catch(e => console.log("Riproduzione audio bloccata."));
    }
  }
}

function cambiaMusica(tipo) {
  const audio = document.getElementById('bgAudio');
  if (!audio) return;

  let fileTraccia = "";

  if (tipo === 'universo') {
    fileTraccia = "file_universo.mp3";
  } else if (tipo === 'ghiacciato') {
    fileTraccia = "file_pianeta_ghiacciato.mp3";
  } else if (tipo === 'Roccioso') {
    fileTraccia = "file_pianeta_Roccioso.mp3";
  } else if (tipo === 'Fuoco') {
    fileTraccia = "file_pianeta_Fuoco.mp3";
  } else if (tipo === 'gas') {
    fileTraccia = "file_pianeta_gas.mp3";
  } else if (tipo === 'cuore') {
    fileTraccia = "file_pianeta_cuore.mp3";
  }

  // Forza il cambio di sorgente e ricarica l'audio immediatamente
  audio.src = fileTraccia;
  audio.load();

  if (!isMuted) {
    audio.play().catch(e => console.log("Riproduzione audio bloccata dal browser finché l'utente non interagisce."));
  }
}

// Apre il pannello info originale identico al PC su smartphone
function apriInfoPianetaMobile() {
  const panel = document.getElementById('planetInfoPanel');
  if (panel) {
    panel.classList.add('mobile-open');
    panel.style.display = 'block';
  }
}

// Chiude il pannello info su smartphone
function chiudiInfoPianetaMobile() {
  const panel = document.getElementById('planetInfoPanel');
  if (panel) {
    panel.classList.remove('mobile-open');
    panel.style.display = 'none';
  }
}
