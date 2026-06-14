const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
const ANCHO_CANVAS = 840;
const ALTO_CANVAS = 500;
canvas.width = ANCHO_CANVAS;
canvas.height = ALTO_CANVAS;
const GROSOR_BORDE = 10;
const GRAVEDAD = 0.5;
const FUERZA_SALTO = -11;
const SUELO_Y = ALTO_CANVAS - GROSOR_BORDE - 55;

function cargarImagen(src) {
  const img = new Image();
  img.src = src;
  img.lista = false;
  img.onload = () => { img.lista = true; };
  return img;
}

const imgMia      = cargarImagen('/image/Mia.png');
const imgLeo      = cargarImagen('/image/Leo.png');
const imgFondo    = cargarImagen('/image/fondo.png');
const imgPuertaMia = cargarImagen('/image/puertamia.png');
const imgPuertaLeo = cargarImagen('/image/puertaleo.png');
const imgGemaMia  = cargarImagen('/image/gemamia.png');
const imgGemaLeo  = cargarImagen('/image/gemaleo.png');
const imgPiso     = cargarImagen('/image/piso__2_.png');
const imgIntro    = cargarImagen('/image/intro.png');

let enPantallaIntro = true;
let hoverBotonJugar = false;

const niveles = [
  {
    plataformas: [
      { x: 350,                              y: SUELO_Y - 5,   ancho: 140, alto: 60,  color: '#000000' },
      { x: GROSOR_BORDE,                     y: SUELO_Y - 100, ancho: 320, alto: 30,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 320, y: SUELO_Y - 100, ancho: 320, alto: 30, color: '#000000' },
      { x: GROSOR_BORDE,                     y: SUELO_Y - 280, ancho: 420, alto: 30,  color: '#000000' },
    ],
    plataformasMoviles: [],
    circuloRojo:  { x: ANCHO_CANVAS - GROSOR_BORDE - 80, y: 311,          radio: 28, color: '#DC1C1C' },
    circuloAzul:  { x: GROSOR_BORDE + 80,                y: 311,          radio: 28, color: '#1C5EDC' },
    estrellaRoja: { x: 100, y: SUELO_Y - 320, radio: 25, recogida: false },
    estrellaAzul: { x: 740, y: SUELO_Y - 320, radio: 25, recogida: false },
  },
  {
    plataformas: [
      { x: 290,                              y: SUELO_Y - 80,  ancho: 20,  alto: 80,  color: '#000000' },
      { x: 520,                              y: SUELO_Y - 80,  ancho: 20,  alto: 80,  color: '#000000' },
      { x: 310,                              y: SUELO_Y - 40,  ancho: 70,  alto: 40,  color: '#000000' },
      { x: 450,                              y: SUELO_Y - 40,  ancho: 70,  alto: 40,  color: '#000000' },
      { x: GROSOR_BORDE,                     y: SUELO_Y - 220, ancho: 180, alto: 40,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 180, y: SUELO_Y - 220, ancho: 180, alto: 40, color: '#000000' },
    ],
    plataformasMoviles: [
      { x: 340, y: 300, ancho: 120, alto: 20, color: '#555555', vx: 3.0, vy: 0, limIzq: 100,  limDer: 740 },
      { x: 340, y: 120, ancho: 120, alto: 20, color: '#555555', vx: 5.0, vy: 0, limIzq: 300,  limDer: 550 },
    ],
    circuloRojo:  { x: ANCHO_CANVAS - GROSOR_BORDE - 90, y: SUELO_Y - 243, radio: 26, color: '#DC1C1C' },
    circuloAzul:  { x: GROSOR_BORDE + 90,                y: SUELO_Y - 243, radio: 26, color: '#1C5EDC' },
    estrellaRoja: { x: 450, y: SUELO_Y - 350, radio: 25, recogida: false },
    estrellaAzul: { x: 400, y: SUELO_Y - 350, radio: 25, recogida: false },
  },
  {
    plataformas: [
      { x: 380,                                  y: SUELO_Y - 100, ancho: 80,  alto: 100, color: '#000000' },
      { x: GROSOR_BORDE,                         y: SUELO_Y - 210, ancho: 120, alto: 20,  color: '#000000' },
      { x: GROSOR_BORDE + 120,                   y: SUELO_Y - 120, ancho: 120, alto: 20,  color: '#000000' },
      { x: GROSOR_BORDE + 200,                   y: SUELO_Y - 300, ancho: 70,  alto: 20,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 120,    y: SUELO_Y - 210, ancho: 120, alto: 20,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 240,    y: SUELO_Y - 120, ancho: 120, alto: 20,  color: '#000000' },
      { x: GROSOR_BORDE + 550,                   y: SUELO_Y - 300, ancho: 70,  alto: 20,  color: '#000000' },
    ],
    plataformasMoviles: [],
    circuloRojo:  { x: GROSOR_BORDE + 60,                y: SUELO_Y - 235, radio: 26, color: '#DC1C1C' },
    circuloAzul:  { x: ANCHO_CANVAS - GROSOR_BORDE - 60, y: SUELO_Y - 235, radio: 26, color: '#1C5EDC' },
    estrellaRoja: { x: 422, y: SUELO_Y - 390, radio: 25, recogida: false },
    estrellaAzul: { x: 422, y: SUELO_Y - 300, radio: 25, recogida: false },
    botonSwitch: {
      x: 400, y: SUELO_Y - 115,
      ancho: 40, alto: 12,
      activado: false,
      colorApagado: '#7B2FBE',
      colorEncendido: '#C77DFF',
      pulsoTimer: 0
    },
    plataformasOcultas: [
      { x: 385, y: SUELO_Y - 350, ancho: 80, alto: 18, colorInactivo: '#555555', colorActivo: '#9D4EDD', visible: false },
      { x: 20,  y: SUELO_Y - 40,  ancho: 100, alto: 18, colorInactivo: '#555555', colorActivo: '#9D4EDD', visible: false },
      { x: 720, y: SUELO_Y - 40,  ancho: 100, alto: 18, colorInactivo: '#555555', colorActivo: '#9D4EDD', visible: false },
    ],
  },
  {
    plataformas: [
      { x: 400,                                  y: SUELO_Y - 290,  ancho: 50,  alto: 350, color: '#000000' },
      { x: GROSOR_BORDE,                         y: 100,            ancho: 190, alto: 40,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 190,    y: 100,            ancho: 190, alto: 40,  color: '#000000' },
      { x: GROSOR_BORDE,                         y: SUELO_Y - 120,  ancho: 150, alto: 40,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 120,    y: SUELO_Y - 120,  ancho: 140, alto: 40,  color: '#000000' },
    ],
    plataformasMoviles: [
      { x: 270,                    y: SUELO_Y - 40, ancho: 110, alto: 18, color: '#555555', vx: 0, vy: 0, velBase: 1.8, limArr: 240, limAba: SUELO_Y - 40, moviendose: false, indice: 0 },
      { x: ANCHO_CANVAS - 270-110, y: SUELO_Y - 40, ancho: 110, alto: 18, color: '#555555', vx: 0, vy: 0, velBase: 1.8, limArr: 240, limAba: SUELO_Y - 40, moviendose: false, indice: 1 },
    ],
    botonesSwitch: [
      { x: GROSOR_BORDE + 90,                 y: SUELO_Y + 45, ancho: 44, alto: 12, activado: false, pulsoTimer: 0, colorApagado: '#7B2FBE', colorEncendido: '#C77DFF', etiqueta: '▶', controlaPlatIndice: 1 },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 134, y: SUELO_Y + 45, ancho: 44, alto: 12, activado: false, pulsoTimer: 0, colorApagado: '#7B2FBE', colorEncendido: '#C77DFF', etiqueta: '◀', controlaPlatIndice: 0 },
    ],
    circuloRojo:  { x: GROSOR_BORDE + 40,                y: 290, radio: 26, color: '#DC1C1C' },
    circuloAzul:  { x: ANCHO_CANVAS - GROSOR_BORDE - 70, y: 80,  radio: 26, color: '#1C5EDC' },
    estrellaRoja: { x: 780, y: SUELO_Y - 150, radio: 25, recogida: false },
    estrellaAzul: { x: 100, y: SUELO_Y - 370, radio: 25, recogida: false },
  },
  {
    plataformas: [
      { x: 540,                              y: SUELO_Y - 70,  ancho: 50,  alto: 140, color: '#000000' },
      { x: 210,                              y: SUELO_Y - 100, ancho: 380, alto: 50,  color: '#000000' },
      { x: 400,                              y: SUELO_Y - 430, ancho: 50,  alto: 180, color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 100, y: SUELO_Y - 220, ancho: 140, alto: 30, color: '#000000' },
      { x: 320,                              y: SUELO_Y - 260, ancho: 200, alto: 30,  color: '#000000' },
      { x: GROSOR_BORDE,                     y: 100,           ancho: 100, alto: 30,  color: '#000000' },
      { x: ANCHO_CANVAS - GROSOR_BORDE - 130, y: 100,          ancho: 130, alto: 30,  color: '#000000' },
    ],
    botonSwitch: [
      { x: 400, y: SUELO_Y + 45,  ancho: 40, alto: 12, activado: false, colorApagado: '#7B2FBE', colorEncendido: '#C77DFF', pulsoTimer: 0 },
      { x: 400, y: SUELO_Y - 110, ancho: 40, alto: 12, activado: false, colorApagado: '#7B2FBE', colorEncendido: '#C77DFF', pulsoTimer: 0 },
    ],
    plataformasOcultas: [
      { x: 590, y: SUELO_Y - 40, ancho: 90, alto: 20, colorInactivo: '#555555', colorActivo: '#9D4EDD', visible: false },
      { x: 10,  y: SUELO_Y - 40, ancho: 90, alto: 20, colorInactivo: '#555555', colorActivo: '#9D4EDD', visible: false },
    ],
    plataformasMoviles: [
      { x: 310, y: 130, ancho: 90, alto: 18, color: '#555555', vx: 2.5, vy: 0, limIzq: 140, limDer: ANCHO_CANVAS - 140 },
    ],
    circuloRojo:  { x: GROSOR_BORDE + 730,               y: 465, radio: 24, color: '#DC1C1C' },
    circuloAzul:  { x: ANCHO_CANVAS - GROSOR_BORDE - 50, y: 80,  radio: 24, color: '#1C5EDC' },
    estrellaRoja: { x: 60,  y: SUELO_Y - 370, radio: 30, recogida: false },
    estrellaAzul: { x: 770, y: SUELO_Y - 250, radio: 30, recogida: false },
  },
];

let nivelActual = 0;
let juegoTerminado = false;
let nivelCompletado = false;
let estrellasLeo = 0;
let estrellasMia = 0;

const elContadorLeo  = document.getElementById('contador-leo');
const elContadorMia  = document.getElementById('contador-mia');
const elBloqueLeo    = document.getElementById('bloque-leo');
const elBloqueMia    = document.getElementById('bloque-mia');
const elNivelIndicador = document.getElementById('nivel-indicador');
const elOverlayNivel    = document.getElementById('overlay-nivel');
const elOverlayVictoria = document.getElementById('overlay-victoria');
const elOverlayIntro    = document.getElementById('overlay-intro');

function actualizarContadorDOM() {
  elContadorLeo.textContent = estrellasLeo;
  elContadorMia.textContent = estrellasMia;
}

function animarContador(jugador) {
  const bloque = jugador === 'leo' ? elBloqueLeo : elBloqueMia;
  const num    = jugador === 'leo' ? elContadorLeo : elContadorMia;
  const clase  = jugador === 'leo' ? 'brilla-leo' : 'brilla-mia';
  bloque.classList.add(clase);
  setTimeout(() => bloque.classList.remove(clase), 500);
  num.classList.add('pop');
  setTimeout(() => num.classList.remove('pop'), 200);
}

function resetearEstrellas() {
  const nivel = niveles[nivelActual];
  if (nivel.estrellaRoja) nivel.estrellaRoja.recogida = false;
  if (nivel.estrellaAzul) nivel.estrellaAzul.recogida = false;
}

function resetearTodasEstrellas() {
  estrellasLeo = 0;
  estrellasMia = 0;
  for (const nv of niveles) {
    if (nv.estrellaRoja) nv.estrellaRoja.recogida = false;
    if (nv.estrellaAzul) nv.estrellaAzul.recogida = false;
  }
  actualizarContadorDOM();
}

function resetearBotones(botones) {
  if (!botones) return;
  const lista = Array.isArray(botones) ? botones : [botones];
  for (const btn of lista) {
    btn.activado = false;
    btn.pulsoTimer = 0;
  }
}

function resetearEstadoNivel3() {
  const n3 = niveles[2];
  resetearBotones(n3.botonSwitch);
  if (n3.plataformasOcultas) for (const po of n3.plataformasOcultas) po.visible = false;
}

function resetearEstadoNivel4() {
  const n4 = niveles[3];
  resetearBotones(n4.botonesSwitch);
  if (n4.plataformasMoviles) {
    for (const pm of n4.plataformasMoviles) {
      pm.y = pm.limAba;
      pm.vy = 0;
      pm.moviendose = false;
    }
  }
}

function resetearEstadoNivel5() {
  const n5 = niveles[4];
  resetearBotones(n5.botonSwitch);
  if (n5.plataformasOcultas) for (const po of n5.plataformasOcultas) po.visible = false;
}

function resetearTodosNiveles() {
  resetearEstadoNivel3();
  resetearEstadoNivel4();
  resetearEstadoNivel5();
}

function crearCuadradoRojo() {
  return { x: GROSOR_BORDE, y: SUELO_Y, ancho: 60, alto: 60, velocidad: 4, velocidadY: 0, enAire: false, color: '#DC1C1C' };
}
function crearCuadradoAzul() {
  return { x: ANCHO_CANVAS - GROSOR_BORDE - 60, y: SUELO_Y, ancho: 60, alto: 60, velocidad: 4, velocidadY: 0, enAire: false, color: '#1C5EDC' };
}

let cuadradoRojo = crearCuadradoRojo();
let cuadradoAzul = crearCuadradoAzul();

function reiniciarNivelActual() {
  nivelCompletado = false;
  juegoTerminado = false;
  cuadradoRojo = crearCuadradoRojo();
  cuadradoAzul = crearCuadradoAzul();
  resetearTodosNiveles();
  resetearEstrellas();
  elOverlayNivel.classList.remove('visible');
  elOverlayVictoria.classList.remove('visible');
}

const teclasPresionadas = { a: false, d: false, w: false, izquierda: false, derecha: false, arriba: false };

document.addEventListener('keydown', e => {
  const t = e.key.toLowerCase();
  if (t === 'a') teclasPresionadas.a = true;
  if (t === 'd') teclasPresionadas.d = true;
  if (t === 'w') teclasPresionadas.w = true;
  if (e.key === 'ArrowLeft')  teclasPresionadas.izquierda = true;
  if (e.key === 'ArrowRight') teclasPresionadas.derecha   = true;
  if (e.key === 'ArrowUp')    teclasPresionadas.arriba    = true;
});
document.addEventListener('keyup', e => {
  const t = e.key.toLowerCase();
  if (t === 'a') teclasPresionadas.a = false;
  if (t === 'd') teclasPresionadas.d = false;
  if (t === 'w') teclasPresionadas.w = false;
  if (e.key === 'ArrowLeft')  teclasPresionadas.izquierda = false;
  if (e.key === 'ArrowRight') teclasPresionadas.derecha   = false;
  if (e.key === 'ArrowUp')    teclasPresionadas.arriba    = false;
  if (e.code === 'Space') { e.preventDefault(); reiniciarNivelActual(); }
});

function colisiona(a, b) {
  return a.x < b.x + b.ancho && a.x + a.ancho > b.x &&
         a.y < b.y + b.alto  && a.y + a.alto  > b.y;
}

function resolverConPlataforma(rect, plat) {
  if (!colisiona(rect, plat)) return false;
  const solapIzq = (rect.x + rect.ancho) - plat.x;
  const solapDer = (plat.x + plat.ancho) - rect.x;
  const solapArr = (rect.y + rect.alto)  - plat.y;
  const solapAba = (plat.y + plat.alto)  - rect.y;
  const min = Math.min(solapIzq, solapDer, solapArr, solapAba);
  if (min === solapArr && rect.velocidadY >= 0) {
    rect.y = plat.y - rect.alto;
    rect.velocidadY = 0;
    rect.enAire = false;
    return true;
  } else if (min === solapAba && rect.velocidadY < 0) {
    rect.y = plat.y + plat.alto;
    rect.velocidadY = 0;
  } else if (min === solapIzq) {
    rect.x = plat.x - rect.ancho;
  } else if (min === solapDer) {
    rect.x = plat.x + plat.ancho;
  }
  return false;
}

function resolverEntreJugadores(r1, r2) {
  if (!colisiona(r1, r2)) return;
  const solapIzq = (r1.x + r1.ancho) - r2.x;
  const solapDer = (r2.x + r2.ancho) - r1.x;
  const solapArr = (r1.y + r1.alto)  - r2.y;
  const solapAba = (r2.y + r2.alto)  - r1.y;
  const min = Math.min(solapIzq, solapDer, solapArr, solapAba);
  if      (min === solapArr) { r1.y -= solapArr; r1.velocidadY = 0; r1.enAire = false; }
  else if (min === solapAba) { r2.y -= solapAba; r2.velocidadY = 0; r2.enAire = false; }
  else if (min === solapIzq) { r1.x -= solapIzq / 2; r2.x += solapIzq / 2; }
  else if (min === solapDer) { r2.x -= solapDer / 2; r1.x += solapDer / 2; }
}

function aplicarLimites(rect) {
  rect.x = Math.max(GROSOR_BORDE, Math.min(ANCHO_CANVAS - GROSOR_BORDE - rect.ancho, rect.x));
}

function cuadradoDentroCirculo(rect, circ) {
  const dx = rect.x + rect.ancho / 2 - circ.x;
  const dy = rect.y + rect.alto  / 2 - circ.y;
  return Math.sqrt(dx * dx + dy * dy) < circ.radio + 10;
}

function actualizarPlataformasMoviles() {
  for (const pm of niveles[nivelActual].plataformasMoviles) {
    if (typeof pm.moviendose !== 'undefined') {
      if (pm.moviendose) {
        pm.y -= pm.velBase;
        if (pm.y <= pm.limArr) pm.y = pm.limArr;
      } else if (pm.y < pm.limAba) {
        pm.y = Math.min(pm.y + pm.velBase * 0.7, pm.limAba);
      }
      continue;
    }
    pm.x += pm.vx;
    if (pm.vx !== 0) {
      if (pm.x <= pm.limIzq) { pm.x = pm.limIzq; pm.vx = Math.abs(pm.vx); }
      if (pm.x + pm.ancho >= pm.limDer) { pm.x = pm.limDer - pm.ancho; pm.vx = -Math.abs(pm.vx); }
    }
    if (pm.vy !== 0) {
      pm.y += pm.vy;
      if (pm.y <= pm.limArr) { pm.y = pm.limArr; pm.vy = Math.abs(pm.vy); }
      if (pm.y + pm.alto >= pm.limAba) { pm.y = pm.limAba - pm.alto; pm.vy = -Math.abs(pm.vy); }
    }
  }
}

function moverJugador(cuadrado, izq, der, saltar, todasPlataformas) {
  if (izq) cuadrado.x -= cuadrado.velocidad;
  if (der) cuadrado.x += cuadrado.velocidad;
  if (saltar && !cuadrado.enAire) {
    cuadrado.velocidadY = FUERZA_SALTO;
    cuadrado.enAire = true;
  }
  cuadrado.velocidadY += GRAVEDAD;
  cuadrado.y += cuadrado.velocidadY;
  let col = false;
  for (const plat of todasPlataformas) {
    if (resolverConPlataforma(cuadrado, plat)) { col = true; break; }
  }
  if (!col && cuadrado.y >= SUELO_Y) {
    cuadrado.y = SUELO_Y;
    cuadrado.velocidadY = 0;
    cuadrado.enAire = false;
  }
}

function moverCuadrados() {
  if (juegoTerminado || nivelCompletado || enPantallaIntro) return;
  const nivel = niveles[nivelActual];
  const plataformasOcultasActivas = (nivel.plataformasOcultas || [])
    .filter(po => po.visible)
    .map(po => ({ x: po.x, y: po.y, ancho: po.ancho, alto: po.alto, color: po.colorActivo }));
  const todasPlataformas = [...nivel.plataformas, ...nivel.plataformasMoviles, ...plataformasOcultasActivas];

  moverJugador(cuadradoRojo, teclasPresionadas.a, teclasPresionadas.d, teclasPresionadas.w, todasPlataformas);
  moverJugador(cuadradoAzul, teclasPresionadas.izquierda, teclasPresionadas.derecha, teclasPresionadas.arriba, todasPlataformas);

  resolverEntreJugadores(cuadradoRojo, cuadradoAzul);
  aplicarLimites(cuadradoRojo);
  aplicarLimites(cuadradoAzul);

  if (nivel.botonSwitch) {
    const botones = Array.isArray(nivel.botonSwitch) ? nivel.botonSwitch : [nivel.botonSwitch];
    for (const btn of botones) {
      const hitbox = { x: btn.x, y: btn.y, ancho: btn.ancho, alto: btn.alto };
      const alguienEncima = colisiona(cuadradoRojo, hitbox) || colisiona(cuadradoAzul, hitbox);
      if (alguienEncima !== btn.activado) {
        btn.activado = alguienEncima;
        btn.pulsoTimer = 20;
        for (const po of nivel.plataformasOcultas) po.visible = alguienEncima;
      }
      if (btn.pulsoTimer > 0) btn.pulsoTimer--;
    }
  }

  if (nivel.botonesSwitch) {
    for (const btn of nivel.botonesSwitch) {
      const hitbox = { x: btn.x, y: btn.y, ancho: btn.ancho, alto: btn.alto };
      const alguienEncima = colisiona(cuadradoRojo, hitbox) || colisiona(cuadradoAzul, hitbox);
      if (alguienEncima !== btn.activado) {
        btn.activado = alguienEncima;
        btn.pulsoTimer = 20;
      }
      if (btn.pulsoTimer > 0) btn.pulsoTimer--;
      const pm = nivel.plataformasMoviles[btn.controlaPlatIndice];
      if (pm) pm.moviendose = btn.activado;
    }
  }

  if (nivel.estrellaRoja && !nivel.estrellaRoja.recogida) {
    const er = nivel.estrellaRoja;
    const dx = cuadradoRojo.x + cuadradoRojo.ancho / 2 - er.x;
    const dy = cuadradoRojo.y + cuadradoRojo.alto  / 2 - er.y;
    if (Math.sqrt(dx * dx + dy * dy) < er.radio + 20) {
      er.recogida = true;
      estrellasLeo++;
      actualizarContadorDOM();
      animarContador('leo');
    }
  }
  if (nivel.estrellaAzul && !nivel.estrellaAzul.recogida) {
    const ea = nivel.estrellaAzul;
    const dx = cuadradoAzul.x + cuadradoAzul.ancho / 2 - ea.x;
    const dy = cuadradoAzul.y + cuadradoAzul.alto  / 2 - ea.y;
    if (Math.sqrt(dx * dx + dy * dy) < ea.radio + 20) {
      ea.recogida = true;
      estrellasMia++;
      actualizarContadorDOM();
      animarContador('mia');
    }
  }

  const puertaRojaDesbloqueada = !nivel.estrellaRoja || nivel.estrellaRoja.recogida;
  const puertaAzulDesbloqueada = !nivel.estrellaAzul || nivel.estrellaAzul.recogida;
  const ambosEnObjetivo =
    puertaRojaDesbloqueada && puertaAzulDesbloqueada &&
    cuadradoDentroCirculo(cuadradoRojo, nivel.circuloRojo) &&
    cuadradoDentroCirculo(cuadradoAzul, nivel.circuloAzul);

  if (ambosEnObjetivo) {
    if (nivelActual < niveles.length - 1) {
      nivelCompletado = true;
      elOverlayNivel.classList.add('visible');
    } else {
      juegoTerminado = true;
      elOverlayVictoria.classList.add('visible');
    }
  }
}

function dibujarBorde() {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth   = GROSOR_BORDE * 2;
  ctx.strokeRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
}

function dibujarRectRedondeado(x, y, ancho, alto, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + ancho - r, y);
  ctx.quadraticCurveTo(x + ancho, y, x + ancho, y + r);
  ctx.lineTo(x + ancho, y + alto - r);
  ctx.quadraticCurveTo(x + ancho, y + alto, x + ancho - r, y + alto);
  ctx.lineTo(x + r, y + alto);
  ctx.quadraticCurveTo(x, y + alto, x, y + alto - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function dibujarCuerpoBoton(btn) {
  const { x, y, ancho, alto, activado, colorApagado, colorEncendido, pulsoTimer } = btn;
  ctx.save();
  if (activado || pulsoTimer > 0) {
    ctx.shadowColor = '#C77DFF';
    ctx.shadowBlur  = activado ? (pulsoTimer > 0 ? 22 + pulsoTimer : 12) : pulsoTimer * 0.6;
  }
  dibujarRectRedondeado(x, y, ancho, alto, 5);
  ctx.fillStyle = activado ? colorEncendido : colorApagado;
  ctx.fill();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 4, y + 2, ancho - 8, alto / 2 - 1);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = activado ? '#E0AAFF' : '#5A189A';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function dibujarBotonSwitch(btn) {
  dibujarCuerpoBoton(btn);
  ctx.save();
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.fillStyle = btn.activado ? '#C77DFF' : '#9D4EDD';
  ctx.textAlign = 'center';
  ctx.fillText('▼ HOLD', btn.x + btn.ancho / 2, btn.y - 5);
  ctx.textAlign = 'left';
  ctx.restore();
}

function dibujarBotonCruzado(btn) {
  dibujarCuerpoBoton(btn);
  ctx.save();
  ctx.font = 'bold 9px "Courier New", monospace';
  ctx.fillStyle = btn.activado ? '#C77DFF' : '#9D4EDD';
  ctx.textAlign = 'center';
  ctx.fillText('HOLD ' + btn.etiqueta, btn.x + btn.ancho / 2, btn.y - 5);
  ctx.textAlign = 'left';
  ctx.restore();
}

function dibujarFranjasDecoradas(x, y, ancho, alto) {
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#ffffff';
  for (let i = -alto; i < ancho; i += 14) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + alto, y + alto);
    ctx.lineTo(x + i + alto + 6, y + alto);
    ctx.lineTo(x + i + 6, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function dibujarPlataformaOculta(po) {
  ctx.save();
  ctx.shadowColor = '#9D4EDD';
  ctx.shadowBlur  = 8;
  ctx.fillStyle   = po.colorActivo;
  ctx.fillRect(po.x, po.y, po.ancho, po.alto);
  dibujarFranjasDecoradas(po.x, po.y, po.ancho, po.alto);
  ctx.strokeStyle = '#E0AAFF';
  ctx.lineWidth   = 1.5;
  ctx.strokeRect(po.x, po.y, po.ancho, po.alto);
  ctx.restore();
}

function dibujarPlataformaFantasma(po) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = '#9D4EDD';
  ctx.lineWidth   = 2;
  ctx.strokeRect(po.x, po.y, po.ancho, po.alto);
  ctx.setLineDash([]);
  ctx.restore();
}

function dibujarPlataforma(plat, esMovil = false) {
  if (!esMovil && plat.color === '#000000' && imgPiso.lista) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(plat.x, plat.y, plat.ancho, plat.alto);
    ctx.clip();
    const IMG_TOTAL_H   = 221;
    const IMG_TOP_PAD   = 59;
    const IMG_CONTENT_H = 114;
    const imgW = imgPiso.naturalWidth;
    const esColumna = plat.alto > plat.ancho * 1.4;
    if (esColumna) {
      const escala        = plat.ancho / IMG_CONTENT_H;
      const anchoEscalado = imgW * escala;
      const altoEscalado  = IMG_TOTAL_H * escala;
      const offsetY       = plat.y - IMG_TOP_PAD * escala;
      for (let drawX = plat.x; drawX < plat.x + plat.ancho; drawX += anchoEscalado) {
        ctx.drawImage(imgPiso, drawX, offsetY, anchoEscalado, altoEscalado);
      }
      const cuerpoY = plat.y + plat.ancho;
      if (cuerpoY < plat.y + plat.alto) {
        ctx.fillStyle = '#5a4030';
        ctx.fillRect(plat.x, cuerpoY, plat.ancho, (plat.y + plat.alto) - cuerpoY);
      }
      ctx.restore();
      return;
    }
    const escala        = plat.alto / IMG_CONTENT_H;
    const anchoEscalado = imgW * escala;
    const altoEscalado  = IMG_TOTAL_H * escala;
    const offsetY       = plat.y - IMG_TOP_PAD * escala;
    for (let drawX = plat.x; drawX < plat.x + plat.ancho; drawX += anchoEscalado) {
      ctx.drawImage(imgPiso, drawX, offsetY, anchoEscalado, altoEscalado);
    }
    ctx.restore();
    return;
  }
  ctx.fillStyle = plat.color;
  ctx.fillRect(plat.x, plat.y, plat.ancho, plat.alto);
  if (esMovil) {
    ctx.save();
    dibujarFranjasDecoradas(plat.x, plat.y, plat.ancho, plat.alto);
    ctx.strokeStyle = '#cc8800';
    ctx.lineWidth   = 2;
    ctx.strokeRect(plat.x, plat.y, plat.ancho, plat.alto);
    ctx.restore();
  }
}

function dibujarEstrella(est, esLeo) {
  if (est.recogida) return;
  const imgGema    = esLeo ? imgGemaLeo  : imgGemaMia;
  const colorHalo  = esLeo ? '#b8a000'   : '#cc5fa0';
  const pulso      = 0.85 + 0.15 * Math.sin(Date.now() / 280);
  const tamano     = est.radio * 2.4;
  ctx.save();
  ctx.shadowColor = colorHalo;
  ctx.shadowBlur  = 14 * pulso;
  if (imgGema.lista) {
    ctx.drawImage(imgGema, est.x - tamano / 2, est.y - tamano / 2, tamano, tamano);
  } else {
    ctx.beginPath();
    ctx.arc(est.x, est.y, est.radio, 0, Math.PI * 2);
    ctx.fillStyle   = colorHalo + '99';
    ctx.fill();
    ctx.strokeStyle = colorHalo;
    ctx.lineWidth   = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function dibujarCirculo(circ) {
  const esMia      = circ.color === '#1C5EDC';
  const imgPuerta  = esMia ? imgPuertaMia : imgPuertaLeo;
  const tamano     = circ.radio * 3.2;
  const dx         = circ.x - tamano / 2;
  const dy         = circ.y - tamano * 0.85;
  ctx.save();
  if (imgPuerta.lista) {
    ctx.drawImage(imgPuerta, dx, dy, tamano, tamano * 1.15);
  } else {
    ctx.beginPath();
    ctx.arc(circ.x, circ.y, circ.radio, 0, Math.PI * 2);
    ctx.fillStyle   = circ.color + '33';
    ctx.fill();
    ctx.strokeStyle = circ.color;
    ctx.lineWidth   = 3;
    ctx.stroke();
  }
  ctx.restore();
}

function dibujarJugador(cuadrado, img, shadowColor, shadowBlur, shadowOffsetY) {
  ctx.save();
  ctx.shadowColor   = shadowColor;
  ctx.shadowBlur    = shadowBlur;
  ctx.shadowOffsetY = shadowOffsetY;
  if (img.lista) {
    ctx.drawImage(img, cuadrado.x, cuadrado.y, cuadrado.ancho, cuadrado.alto);
  } else {
    ctx.fillStyle = cuadrado.color;
    ctx.fillRect(cuadrado.x, cuadrado.y, cuadrado.ancho, cuadrado.alto);
  }
  ctx.restore();
}

function dibujarEtiquetaNivel() {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.letterSpacing = '0.1em';
  ctx.fillText(`NIVEL ${nivelActual + 1}`, GROSOR_BORDE + 6, GROSOR_BORDE + 18);
  ctx.restore();
}

function bucleDeJuego() {
  ctx.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

  if (enPantallaIntro) {
    if (imgIntro.lista) {
      ctx.drawImage(imgIntro, 0, 0, ANCHO_CANVAS, ALTO_CANVAS);
      if (hoverBotonJugar) {
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(255, 385, 335, 103, 20);
        ctx.fill();
        ctx.restore();
      }
    } else {
      ctx.fillStyle = '#5F746B';
      ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
      ctx.fillStyle = '#F1E58E';
      ctx.font = 'bold 28px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LOS TORTOLITOS', ANCHO_CANVAS / 2, ALTO_CANVAS / 2 - 20);
      ctx.textAlign = 'left';
    }
    requestAnimationFrame(bucleDeJuego);
    return;
  }

  if (imgFondo.lista) {
    ctx.drawImage(imgFondo, 0, 0, ANCHO_CANVAS, ALTO_CANVAS);
  } else {
    ctx.fillStyle = '#5ba8d4';
    ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
  }

  const nivel = niveles[nivelActual];
  actualizarPlataformasMoviles();

  if (!nivel.estrellaRoja || nivel.estrellaRoja.recogida) dibujarCirculo(nivel.circuloRojo);
  if (!nivel.estrellaAzul || nivel.estrellaAzul.recogida) dibujarCirculo(nivel.circuloAzul);

  if (nivel.estrellaRoja) dibujarEstrella(nivel.estrellaRoja, true);
  if (nivel.estrellaAzul) dibujarEstrella(nivel.estrellaAzul, false);

  for (const plat of nivel.plataformas)        dibujarPlataforma(plat, false);
  for (const pm   of nivel.plataformasMoviles) dibujarPlataforma(pm,   true);

  if (nivel.botonSwitch) {
    const botones = Array.isArray(nivel.botonSwitch) ? nivel.botonSwitch : [nivel.botonSwitch];
    for (const btn of botones) dibujarBotonSwitch(btn);
  }
  if (nivel.plataformasOcultas) {
    for (const po of nivel.plataformasOcultas) {
      if (po.visible) dibujarPlataformaOculta(po); else dibujarPlataformaFantasma(po);
    }
  }
  if (nivel.botonesSwitch) {
    for (const btn of nivel.botonesSwitch) dibujarBotonCruzado(btn);
  }

  dibujarBorde();
  dibujarEtiquetaNivel();
  moverCuadrados();

  dibujarJugador(cuadradoRojo, imgLeo, 'rgba(180,160,0,0.35)',   12, 4);
  dibujarJugador(cuadradoAzul, imgMia, 'rgba(255,150,200,0.4)',  14, 5);

  requestAnimationFrame(bucleDeJuego);
}

elOverlayIntro.classList.add('visible');

canvas.addEventListener('click', e => {
  if (!enPantallaIntro) return;
  const rect   = canvas.getBoundingClientRect();
  const cx     = (e.clientX - rect.left)  * (ANCHO_CANVAS / rect.width);
  const cy     = (e.clientY - rect.top)   * (ALTO_CANVAS  / rect.height);
  if (cx >= 255 && cx <= 590 && cy >= 385 && cy <= 488) {
    enPantallaIntro = false;
    elOverlayIntro.classList.remove('visible');
  }
});

canvas.addEventListener('mousemove', e => {
  if (!enPantallaIntro) { canvas.style.cursor = 'default'; hoverBotonJugar = false; return; }
  const rect   = canvas.getBoundingClientRect();
  const cx     = (e.clientX - rect.left) * (ANCHO_CANVAS / rect.width);
  const cy     = (e.clientY - rect.top)  * (ALTO_CANVAS  / rect.height);
  hoverBotonJugar = cx >= 255 && cx <= 590 && cy >= 385 && cy <= 488;
  canvas.style.cursor = hoverBotonJugar ? 'pointer' : 'default';
});

const audio       = document.getElementById('musicaFondo');
const btnMusica   = document.getElementById('btn-musica');
const iconoMusica = document.getElementById('icono-musica');
const textoMusica = document.getElementById('texto-musica');
let musicaActiva  = true;

function iniciarMusica() {
  if (musicaActiva) audio.play().catch(() => {});
  document.removeEventListener('click',   iniciarMusica);
  document.removeEventListener('keydown', iniciarMusica);
}
document.addEventListener('click',   iniciarMusica);
document.addEventListener('keydown', iniciarMusica);

btnMusica.addEventListener('click', e => {
  e.stopPropagation();
  musicaActiva = !musicaActiva;
  if (musicaActiva) {
    audio.play().catch(() => {});
    btnMusica.classList.remove('musica-off');
    iconoMusica.textContent = '♪';
    textoMusica.textContent = 'MÚSICA ON';
  } else {
    audio.pause();
    btnMusica.classList.add('musica-off');
    iconoMusica.textContent = '✕';
    textoMusica.textContent = 'MÚSICA OFF';
  }
});

document.getElementById('btnSiguiente').addEventListener('click', () => {
  nivelActual++;
  nivelCompletado = false;
  cuadradoRojo = crearCuadradoRojo();
  cuadradoAzul = crearCuadradoAzul();
  resetearTodosNiveles();
  resetearEstrellas();
  elOverlayNivel.classList.remove('visible');
  elNivelIndicador.textContent = `NIVEL ${nivelActual + 1}`;
});

document.getElementById('btnReiniciar').addEventListener('click', () => {
  nivelActual = 0;
  nivelCompletado = false;
  juegoTerminado  = false;
  cuadradoRojo = crearCuadradoRojo();
  cuadradoAzul = crearCuadradoAzul();
  resetearTodosNiveles();
  resetearTodasEstrellas();
  elOverlayVictoria.classList.remove('visible');
  elOverlayNivel.classList.remove('visible');
  elNivelIndicador.textContent = 'NIVEL 1';
});

(function() {
  const SECUENCIA = 'chet';
  let buffer = '';
  const estiloBase = `
    position:fixed; bottom:18px; font-family:'Courier New',monospace;
    font-size:0.8rem; letter-spacing:0.18em; text-transform:uppercase;
    padding:7px 20px; cursor:pointer; opacity:0; pointer-events:none;
    transition:opacity 0.3s,background 0.2s,color 0.2s; z-index:9999;
  `;

  function crearBotonCheat(texto, estiloExtra, bgOff, colorOff) {
    const btn = document.createElement('button');
    btn.textContent = texto;
    btn.style.cssText = estiloBase + estiloExtra;
    btn.addEventListener('mouseenter', () => { btn.style.background = colorOff; btn.style.color = bgOff; });
    btn.addEventListener('mouseleave', () => { btn.style.background = bgOff;    btn.style.color = colorOff; });
    document.body.appendChild(btn);
    return btn;
  }

  const btnCheat = crearBotonCheat('SKIP', 'right:18px; background:#111; color:#e8e8e8; border:2px solid #e8e8e8;', '#111', '#e8e8e8');
  const btnComo  = crearBotonCheat('¿CÓMO SE HIZO?', 'right:110px; background:#2a0a3a; color:#F7B8D6; border:2px solid #F7B8D6;', '#2a0a3a', '#F7B8D6');

  function ocultarBotonesCheat() {
    [btnCheat, btnComo].forEach(b => { b.style.opacity = '0'; b.style.pointerEvents = 'none'; });
  }

  btnCheat.addEventListener('click', () => {
    ocultarBotonesCheat();
    if (nivelActual < niveles.length - 1) {
      elOverlayNivel.classList.remove('visible');
      nivelActual++;
      nivelCompletado = false;
      juegoTerminado  = false;
      cuadradoRojo = crearCuadradoRojo();
      cuadradoAzul = crearCuadradoAzul();
      resetearTodosNiveles();
      resetearEstrellas();
      elNivelIndicador.textContent = `NIVEL ${nivelActual + 1}`;
    } else {
      juegoTerminado = true;
      elOverlayVictoria.classList.add('visible');
    }
  });

  btnComo.addEventListener('click', () => {
    ocultarBotonesCheat();
    const overlayVideo = document.getElementById('overlay-video');
    const video = document.getElementById('videoGalletas');
    elOverlayNivel.classList.remove('visible');
    elOverlayVictoria.classList.remove('visible');
    overlayVideo.classList.add('visible');
    video.currentTime = 0;
    video.play();
    video.onended = () => {
      overlayVideo.classList.remove('visible');
      video.pause();
      nivelActual = 0;
      nivelCompletado = false;
      juegoTerminado  = false;
      cuadradoRojo = crearCuadradoRojo();
      cuadradoAzul = crearCuadradoAzul();
      resetearTodosNiveles();
      resetearTodasEstrellas();
      elNivelIndicador.textContent = 'NIVEL 1';
    };
  });

  document.addEventListener('keydown', e => {
    const ignorar = ['a','d','w','arrowleft','arrowright','arrowup','arrowdown'];
    if (ignorar.includes(e.key.toLowerCase())) return;
    buffer += e.key.toLowerCase();
    if (buffer.length > SECUENCIA.length) buffer = buffer.slice(buffer.length - SECUENCIA.length);
    if (buffer === SECUENCIA) {
      buffer = '';
      [btnCheat, btnComo].forEach(b => { b.style.opacity = '1'; b.style.pointerEvents = 'auto'; });
    }
  });
})();

bucleDeJuego();