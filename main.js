/* ══════════════════════════════════════════════════════════
   CUPID COMPLAINING TO VENUS — Lucas Cranach el Viejo
   main.js — Lógica principal de la aplicación
══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   DATOS DE PALETA
══════════════════════════════════════ */
const palette = [
  {
    color: '#d6cab1',
    name: 'Lino Claro',
    text: 'Este tono beige suave y luminoso evoca la preparación de las tablas con imprimación de yeso y cola animal. Era la base sobre la que Cranach construía sus composiciones capa por capa, y su calidez natural traspasa veladamente las zonas más iluminadas de la piel de Venus y el cielo al fondo de la escena.'
  },
  {
    color: '#816a44',
    name: 'Ocre Tostado',
    text: 'El ocre tostado es uno de los pigmentos más antiguos de la historia de la pintura. En esta obra aparece en las carnaciones de Cupido y en las transiciones medias del suelo. Cranach lo obtenía de depósitos de óxido de hierro y lo mezclaba con blanco de plomo para graduar su intensidad con precisión.'
  },
  {
    color: '#221c18',
    name: 'Negro Profundo',
    text: 'Este negro denso y cálido, logrado con negro de hueso o carbón vegetal, define las sombras más profundas del bosque y el cabello de Venus. En la tradición flamenca y alemana el negro no era ausencia de color sino un pigmento activo: estructuraba la composición y hacía vibrar los tonos adyacentes por contraste.'
  },
  {
    color: '#84a0b3',
    name: 'Azul Grisáceo',
    text: 'Este azul apagado y atmosférico aparece en el cielo que se filtra entre el follaje y en los reflejos fríos de la sombra. En el siglo XVI el azul era uno de los pigmentos más costosos: se obtenía del lapislázuli o del azurita. Cranach lo usaba con economía, reservándolo para los puntos donde la luz del fondo necesitaba respirar.'
  },
  {
    color: '#4d7899',
    name: 'Azul Sajón',
    text: 'Este azul más saturado y profundo recuerda los pigmentos de azurita que Cranach empleaba en la ropa y en los cielos de sus obras más elaboradas. Su presencia en la paleta de la obra sugiere la profundidad espacial del paisaje boscoso germánico: un fondo que no es neutro sino activamente atmosférico.'
  },
  {
    color: '#b59445',
    name: 'Oro Apagado',
    text: 'El dorado cálido pero contenido del collar de Venus y los detalles decorativos se lograba con pigmentos de masicote o amarillo de plomo y estaño. Este tono menos brillante que el oro puro da a la joyería de Cranach una credibilidad material que conecta la escena mitológica con la realidad de la corte sajona del siglo XVI.'
  },
  {
    color: '#554530',
    name: 'Umber Cálido',
    text: 'La tierra de sombra en su variante más cálida define la corteza del árbol central y las zonas de penumbra del suelo. Era uno de los pigmentos más versátiles del taller de Cranach: mezclado con negro aceleraba el secado del óleo, una técnica práctica en un taller que producía centenares de obras al año.'
  },
  {
    color: '#526265',
    name: 'Gris Verdoso',
    text: 'Este gris con matiz verde frío aparece en las zonas de sombra del follaje y en los troncos en penumbra. Cranach lo construía superponiendo veladuras de negro sobre verdes ya secos, un método que creaba una profundidad cromática sutil imposible de lograr mezclando directamente los pigmentos en la paleta.'
  },
  {
    color: '#3f3f35',
    name: 'Oliva Oscuro',
    text: 'El verde oliva oscuro es el tono dominante del follaje en sombra que rodea la escena. En el Renacimiento del Norte este verde apagado —muy distinto al verde brillante del paisaje italiano— transmitía la densidad y el misterio del bosque germánico, un escenario que para el espectador de la época tenía connotaciones casi mitológicas.'
  },
  {
    color: '#3b4e5d',
    name: 'Azul Noche',
    text: 'Este azul oscuro y frío representa las zonas de máxima profundidad espacial del fondo: el punto donde el bosque se cierra y la luz se extingue. Su presencia equilibra la calidez de los tonos ocres y marrones del primer plano, creando la ilusión de aire y distancia que caracteriza el dominio del sfumato septentrional de Cranach.'
  }
];

/* ══════════════════════════════════════
   ESTADO GLOBAL DE AUDIO POR COLOR
══════════════════════════════════════ */

// Almacena { url, name } para cada color (índice = índice de paleta)
const audioStore = new Array(palette.length).fill(null);

// Elemento de audio compartido para reproducción
let capAudioEl = new Audio();

// Índice del color activo en el panel de curiosidad
let capActiveIdx = -1;

// Referencia al intervalo de animación de la forma de onda
let waveInterval = null;

/* ══════════════════════════════════════
   REFERENCIAS DOM
   (declaradas aquí, asignadas en DOMContentLoaded)
══════════════════════════════════════ */
let paletteGrid    = null;
let curiosityPanel = null;
let curiosityBar   = null;
let curiosityName  = null;
let curiosityText  = null;

/* ══════════════════════════════════════
   WAVEFORM — FORMA DE ONDA ANIMADA
══════════════════════════════════════ */

/** Construye las barras del waveform en el DOM */
function buildWaveform() {
  const waveform = document.getElementById('capWaveform');
  for (let b = 0; b < 28; b++) {
    const bar = document.createElement('div');
    bar.className = 'cap-bar';
    bar.style.height = Math.random() * 60 + 20 + '%';
    waveform.appendChild(bar);
  }
}

/** Anima las barras mientras el audio reproduce, coloreándolas con el tono activo */
function animateWave(color) {
  clearInterval(waveInterval);
  const waveBars = document.querySelectorAll('.cap-bar');
  waveInterval = setInterval(() => {
    const pct = capAudioEl.duration
      ? capAudioEl.currentTime / capAudioEl.duration
      : 0;
    waveBars.forEach((b, i) => {
      const active = i / waveBars.length < pct;
      b.classList.toggle('active', active);
      if (!capAudioEl.paused) {
        b.style.height = (Math.random() * 60 + 20) + '%';
        b.style.background = active ? color + 'cc' : 'rgba(200,152,46,.2)';
      }
    });
  }, 120);
}

/** Detiene la animación y resetea las barras */
function stopWave() {
  clearInterval(waveInterval);
  document.querySelectorAll('.cap-bar').forEach(b => {
    b.style.height = (Math.random() * 60 + 20) + '%';
    b.classList.remove('active');
  });
}

/* ══════════════════════════════════════
   UTILIDADES
══════════════════════════════════════ */

/** Formatea segundos en M:SS */
function fmt(s) {
  if (isNaN(s) || !isFinite(s)) return '0:00';
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/* ══════════════════════════════════════
   REPRODUCTOR DE AUDIO POR COLOR
══════════════════════════════════════ */

/**
 * Carga el estado de audio correspondiente al color con índice `idx`.
 * Si existe audio guardado, muestra el reproductor; si no, muestra
 * el estado inactivo con el botón de carga.
 */
function loadColorAudio(idx) {
  const stored    = audioStore[idx];
  const idle      = document.getElementById('colorAudioIdle');
  const player    = document.getElementById('colorAudioPlayer');
  const capPlay   = document.getElementById('capPlayBtn');
  const capNameEl = document.getElementById('capName');
  const capTime   = document.getElementById('capTime');
  const capProg   = document.getElementById('capProgress');

  // Detener y destruir el audio anterior
  if (capAudioEl) {
    capAudioEl.pause();
    capAudioEl.src = '';
    capAudioEl.load();
  }
  stopWave();
  capPlay.textContent = '▶';
  capPlay.classList.remove('playing');

  if (stored) {
    // ── Crear un Audio() NUEVO en cada interacción ──
    // iOS solo permite reproducción si el objeto se crea dentro
    // de un evento de toque directo del usuario.
    capAudioEl = new Audio();
    capAudioEl.preload = 'none'; // evita descarga automática en móviles
    capAudioEl.src = stored.url;

    // Reasignar eventos al nuevo elemento
    capAudioEl.addEventListener('timeupdate', onTimeUpdate);
    capAudioEl.addEventListener('ended', onAudioEnded);

    idle.style.display    = 'none';
    player.style.display  = 'flex';
    capNameEl.textContent = stored.name;
    capTime.textContent   = '0:00 / 0:00';
    capProg.style.width   = '0%';
  } else {
    idle.style.display   = 'flex';
    player.style.display = 'none';
  }

  capActiveIdx = idx;
  // Recalcular altura del panel tras cambiar el contenido del reproductor
  setTimeout(() => refreshPanelHeight(), 50);
}

/** Abre el panel midiendo la altura real del contenido */
function openPanel() {
  const inner = curiosityPanel.querySelector('.curiosity-inner');
  const bar   = curiosityPanel.querySelector('.curiosity-color-bar');
  // Altura real = barra de color (4px) + padding del inner + contenido
  const totalH = bar.offsetHeight + inner.scrollHeight + 40; // 40px de margen extra
  curiosityPanel.style.maxHeight = totalH + 'px';
  curiosityPanel.style.opacity   = '1';
}

/** Cierra el panel */
function closePanel() {
  curiosityPanel.style.maxHeight = '0';
  curiosityPanel.style.opacity   = '0';
}

/** Recalcula la altura del panel cuando cambia el contenido (ej: audio cargado) */
function refreshPanelHeight() {
  if (curiosityPanel.style.maxHeight !== '0px' && curiosityPanel.style.maxHeight !== '') {
    openPanel();
  }
}

/** Crea y añade al DOM cada casilla de color con su evento de clic */
function buildSwatches() {
  let activeIdx = -1;

  palette.forEach((p, i) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch';
    sw.style.background = p.color;
    sw.style.transitionDelay = (i * 0.05) + 's';
    sw.innerHTML = `<div class="swatch-inner"><span class="swatch-hex">${p.color}</span></div>`;

    sw.addEventListener('click', () => {
      // Si se vuelve a clicar el mismo color → cerrar panel
      if (activeIdx === i) {
        sw.classList.remove('active');
        closePanel();
        if (!capAudioEl.paused) capAudioEl.pause();
        stopWave();
        activeIdx = -1;
        return;
      }

      // Activar nuevo color
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      activeIdx = i;

      // Actualizar contenido del panel
      curiosityBar.style.background = p.color;
      curiosityName.textContent      = p.name;
      curiosityText.textContent      = p.text;

      // Cargar audio correspondiente
      loadColorAudio(i);

      // Abrir panel con altura real medida y hacer scroll
      openPanel();
      setTimeout(() => curiosityPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
    });

    paletteGrid.appendChild(sw);
  });
}

/* ══════════════════════════════════════
   HANDLERS DE AUDIO (nombrados para
   poder reasignarlos al nuevo Audio())
══════════════════════════════════════ */
function onTimeUpdate() {
  if (!capAudioEl.duration) return;
  const pct = (capAudioEl.currentTime / capAudioEl.duration) * 100;
  document.getElementById('capProgress').style.width = pct + '%';
  document.getElementById('capTime').textContent =
    fmt(capAudioEl.currentTime) + ' / ' + fmt(capAudioEl.duration);
}

function onAudioEnded() {
  document.getElementById('capPlayBtn').textContent = '▶';
  document.getElementById('capPlayBtn').classList.remove('playing');
  stopWave();
  document.getElementById('capProgress').style.width = '0%';
}

/* ══════════════════════════════════════
   EVENTOS DEL REPRODUCTOR
══════════════════════════════════════ */
function initPlayerEvents() {

  // Botón play / pausa
  document.getElementById('capPlayBtn').addEventListener('click', () => {
    if (capActiveIdx < 0 || !audioStore[capActiveIdx]) return;
    const btn = document.getElementById('capPlayBtn');

    if (capAudioEl.paused) {
      // iOS: play() devuelve una Promise — hay que manejarla
      const playPromise = capAudioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            btn.textContent = '⏸';
            btn.classList.add('playing');
            animateWave(palette[capActiveIdx].color);
          })
          .catch(() => {
            // iOS bloqueó la reproducción — informar al usuario
            btn.textContent = '▶';
            btn.classList.remove('playing');
            console.warn('iOS bloqueó la reproducción automática.');
          });
      } else {
        btn.textContent = '⏸';
        btn.classList.add('playing');
        animateWave(palette[capActiveIdx].color);
      }
    } else {
      capAudioEl.pause();
      btn.textContent = '▶';
      btn.classList.remove('playing');
      stopWave();
    }
  });

  // Seek en la barra de progreso
  document.getElementById('capTrack').addEventListener('click', e => {
    if (!capAudioEl.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    capAudioEl.currentTime = ((e.clientX - rect.left) / rect.width) * capAudioEl.duration;
  });

  // Botones de carga de audio — desactivados (audios fijos)
  // Si en el futuro quieres restaurar la carga manual, descomenta:
  // document.getElementById('colorUploadBtn').addEventListener('click', triggerColorUpload);
}

/* ══════════════════════════════════════
   IMAGEN — carga fija desde carpeta
══════════════════════════════════════ */
function initArtwork() {
  const img = document.getElementById('artworkImg');
  // Si la imagen no carga (extensión incorrecta), prueba con .png
  img.addEventListener('error', () => {
    if (img.src.includes('.jpg')) {
      img.src = 'images/image.png';
    }
  });
  img.style.display = 'block';
}

/* ══════════════════════════════════════
   AUDIOS — rutas fijas desde /sounds
   Nombra tus archivos exactamente así:
   sounds/color-1.mp3  → Lino Claro
   sounds/color-2.mp3  → Ocre Tostado
   sounds/color-3.mp3  → Negro Profundo
   sounds/color-4.mp3  → Azul Grisáceo
   sounds/color-5.mp3  → Azul Sajón
   sounds/color-6.mp3  → Oro Apagado
   sounds/color-7.mp3  → Umber Cálido
   sounds/color-8.mp3  → Gris Verdoso
   sounds/color-9.mp3  → Oliva Oscuro
   sounds/color-10.mp3 → Azul Noche
══════════════════════════════════════ */
const audioFiles = [
  { file: 'sounds/color-1.mp3',  name: 'Lino Claro'    },
  { file: 'sounds/color-2.mp3',  name: 'Ocre Tostado'  },
  { file: 'sounds/color-3.mp3',  name: 'Negro Profundo' },
  { file: 'sounds/color-4.mp3',  name: 'Azul Grisáceo' },
  { file: 'sounds/color-5.mp3',  name: 'Azul Sajón'    },
  { file: 'sounds/color-6.mp3',  name: 'Oro Apagado'   },
  { file: 'sounds/color-7.mp3',  name: 'Umber Cálido'  },
  { file: 'sounds/color-8.mp3',  name: 'Gris Verdoso'  },
  { file: 'sounds/color-9.mp3',  name: 'Oliva Oscuro'  },
  { file: 'sounds/color-10.mp3', name: 'Azul Noche'    },
];

/* iOS requiere que el Audio se cree y reproduzca dentro de un
   evento de toque directo. Por eso NO precargamos aquí —
   capAudioEl se inicializa al primer toque del usuario.        */
function preloadAudios() {
  // Solo registramos los metadatos; el Audio() real se crea en loadColorAudio()
  audioFiles.forEach((a, i) => {
    audioStore[i] = { url: a.file, name: a.name };
  });
}

/* ══════════════════════════════════════
   ANIMACIONES DE SCROLL
══════════════════════════════════════ */

function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        observer.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  // Elementos con animación de scroll genérica
  document.querySelectorAll('[data-scroll], .color-swatch, .ctx-header, .timeline-title')
    .forEach(el => observer.observe(el));

  // Ítems del timeline con delay escalonado
  document.querySelectorAll('.t-item').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    observer.observe(el);
  });
}

/* ══════════════════════════════════════
   NAVEGACIÓN MÓVIL
══════════════════════════════════════ */

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');

  toggle.addEventListener('click', () => nav.classList.toggle('open'));

  // Cerrar menú al clicar un enlace
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ══════════════════════════════════════
   HEADER — FONDO AL HACER SCROLL
══════════════════════════════════════ */

function initStickyHeader() {
  window.addEventListener('scroll', () => {
    document.querySelector('header').style.background = window.scrollY > 80
      ? 'rgba(18,16,13,0.97)'
      : '';
  });
}

/* ══════════════════════════════════════
   INICIALIZACIÓN PRINCIPAL
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Asignar referencias DOM una vez que el HTML está completamente cargado
  paletteGrid    = document.getElementById('paletteGrid');
  curiosityPanel = document.getElementById('curiosityPanel');
  curiosityBar   = document.getElementById('curiosityBar');
  curiosityName  = document.getElementById('curiosityName');
  curiosityText  = document.getElementById('curiosityText');

  initArtwork();
  preloadAudios();
  buildWaveform();
  buildSwatches();
  initPlayerEvents();
  initScrollAnimations();
  initMobileNav();
  initStickyHeader();
});
