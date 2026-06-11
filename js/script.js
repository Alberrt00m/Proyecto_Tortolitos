const canvas = document.getElementById('miCanvas');
    const ctx    = canvas.getContext('2d');
    const ANCHO_CANVAS  = 840;
    const ALTO_CANVAS   = 500;
    canvas.width  = ANCHO_CANVAS;
    canvas.height = ALTO_CANVAS;
    const GROSOR_BORDE = 10;

    // Jugadores - Mia y Leo
    const imgMia = new Image();
    imgMia.src = 'Mia.png';
    let miaImagenLista = false;
    imgMia.onload = () => { miaImagenLista = true; };

    const imgLeo = new Image();
    imgLeo.src = 'Leo.png';
    let leoImagenLista = false;
    imgLeo.onload = () => { leoImagenLista = true; };

    // Fondo
    const imgFondo = new Image();
    imgFondo.src = 'fondo.png';
    let fondoImagenLista = false;
    imgFondo.onload = () => { fondoImagenLista = true; };

    // Puertas meta
    const imgPuertaMia = new Image();
    imgPuertaMia.src = 'puertamia.png';  // moño rosado → meta azul (Mia)
    let puertaMiaLista = false;
    imgPuertaMia.onload = () => { puertaMiaLista = true; };

    const imgPuertaLeo = new Image();
    imgPuertaLeo.src = 'puertaleo.png';  // moño amarillo → meta roja (Leo)
    let puertaLeoLista = false;
    imgPuertaLeo.onload = () => { puertaLeoLista = true; };
    
    const imgGemaMia = new Image();
    imgGemaMia.src = 'gemamia.png';
    let gemaMiaLista = false;
    imgGemaMia.onload = () => { gemaMiaLista = true; };

    const imgGemaLeo = new Image();
    imgGemaLeo.src = 'gemaleo.png';
    let gemaLeoLista = false;
    imgGemaLeo.onload = () => { gemaLeoLista = true; };

    // Textura de piso para plataformas estáticas negras
    const imgPiso = new Image();
    imgPiso.src = 'piso__2_.png';
    let pisoImagenLista = false;
    imgPiso.onload = () => { pisoImagenLista = true; };

    // ─── PANTALLA DE INTRO ────────────────────────────────────────────────────
    const imgIntro = new Image();
    imgIntro.src = 'intro.png';
    let introImagenLista = false;
    imgIntro.onload = () => { introImagenLista = true; };

    let enPantallaIntro = true;
    let hoverBotonJugar = false;

    const GRAVEDAD    = 0.5;
    const FUERZA_SALTO = -10;
    const SUELO_Y      = ALTO_CANVAS - GROSOR_BORDE - 55;

    // seccion de niveles (cantidad: 5)
    const niveles = [
// nivel 1
      {
        plataformas: [
          { x: 350, y: SUELO_Y - 5,   ancho: 140, alto: 60,  color: '#000000' },
          { x: GROSOR_BORDE,           y: SUELO_Y - 100, ancho: 320, alto: 30, color: '#000000' },
          { x: ANCHO_CANVAS - GROSOR_BORDE - 320, y: SUELO_Y - 100, ancho: 320, alto: 30, color: '#000000' },
          { x: GROSOR_BORDE,           y: SUELO_Y - 280, ancho: 420, alto: 30, color: '#000000' },
        ],
        plataformasMoviles: [],
        circuloRojo: { x: ANCHO_CANVAS - GROSOR_BORDE - 80, y: 311, radio: 28, color: '#DC1C1C' },
        circuloAzul: { x: GROSOR_BORDE + 80,                y: 311, radio: 28, color: '#1C5EDC' },
        estrellaRoja: { x: 100, y: SUELO_Y - 320, radio: 25, recogida: false },
        estrellaAzul: { x: 740, y: SUELO_Y - 320, radio: 25, recogida: false },
      },
// nivel 2
      {
        plataformas: [
          { x: 290, y: SUELO_Y - 80,  ancho: 20,  alto: 80,  color: '#000000' },
          { x: 520, y: SUELO_Y - 80,  ancho: 20,  alto: 80,  color: '#000000' },
          { x: 310, y: SUELO_Y - 40,  ancho: 70,  alto: 40,  color: '#000000' },
          { x: 450, y: SUELO_Y - 40,  ancho: 70,  alto: 40,  color: '#000000' },
          { x: GROSOR_BORDE, y: SUELO_Y - 220, ancho: 180, alto: 20, color: '#000000' },
          { x: ANCHO_CANVAS - GROSOR_BORDE - 180, y: SUELO_Y - 220, ancho: 180, alto: 20, color: '#000000' },
        ],
        // Plataforma móvil central: va de izquierda a derecha al medio-alto
        plataformasMoviles: [
          {
            x: 340, y: 300, ancho: 120, alto: 20, color: '#555555',
            vx: 3.0, vy: 0,
            limIzq: 100, limDer: 740,
          },
          {
            x: 340, y: 120, ancho: 120, alto: 20, color: '#555555',
            vx: 5.0, vy: 0,
            limIzq: 300, limDer: 550
          }
        ],
        circuloRojo: { x: ANCHO_CANVAS - GROSOR_BORDE - 90, y: SUELO_Y - 243, radio: 26, color: '#DC1C1C' },
        circuloAzul: { x: GROSOR_BORDE + 90,                y: SUELO_Y - 243, radio: 26, color: '#1C5EDC' },
        estrellaRoja: { x: 450, y: SUELO_Y - 350, radio: 25, recogida: false },
        estrellaAzul: { x: 400, y: SUELO_Y - 350, radio: 25, recogida: false },
      },

// nivel 3
      {
        plataformas: [
          // Pilar central bajo — quien se queda aquí presiona el botón
          { x: 380, y: SUELO_Y - 100, ancho: 80, alto: 100, color: '#000000' },
          // Torre izquierda alta (objetivo rojo arriba)
          { x: GROSOR_BORDE, y: SUELO_Y - 210, ancho: 120, alto: 20, color: '#000000' },
          // Escalón intermedio izquierdo
          { x: GROSOR_BORDE + 120, y: SUELO_Y - 120, ancho: 120, alto: 20, color: '#000000' },
          { x: GROSOR_BORDE + 200, y: SUELO_Y - 300, ancho: 70, alto: 20, color: '#000000' },
          // Torre derecha alta (objetivo azul arriba)
          { x: ANCHO_CANVAS - GROSOR_BORDE - 120, y: SUELO_Y - 210, ancho: 120, alto: 20, color: '#000000' },
          // Escalón intermedio derecho
          { x: ANCHO_CANVAS - GROSOR_BORDE - 240, y: SUELO_Y - 120, ancho: 120, alto: 20, color: '#000000' },
          { x: GROSOR_BORDE + 550, y: SUELO_Y - 300, ancho: 70, alto: 20, color: '#000000' },
        ],
        plataformasMoviles: [],
        circuloRojo: { x: GROSOR_BORDE + 60,                y: SUELO_Y - 235, radio: 26, color: '#DC1C1C' },
        circuloAzul: { x: ANCHO_CANVAS - GROSOR_BORDE - 60, y: SUELO_Y - 235, radio: 26, color: '#1C5EDC' },
        estrellaRoja: { x: 422, y: SUELO_Y - 390, radio: 25, recogida: false },
        estrellaAzul: { x: 422, y: SUELO_Y - 300, radio: 25, recogida: false },
        // Botón HOLD — activo SOLO mientras alguien lo pise
        botonSwitch: {
          x: 400, y: SUELO_Y - 115,
          ancho: 40, alto: 12,
          activado: false,
          colorApagado: '#7B2FBE',
          colorEncendido: '#C77DFF',
          pulsoTimer: 0
        },
        // UNA sola plataforma central — aparece y desaparece según el botón
        plataformasOcultas: [
          
            { x: 385, y: SUELO_Y - 350, ancho: 80, alto: 18,
            colorInactivo: '#555555', colorActivo: '#9D4EDD',
            visible: false },
            { x: 20, y: SUELO_Y - 40, ancho: 100, alto: 18,
            colorInactivo: '#555555', colorActivo: '#9D4EDD',
            visible: false },
            { x: 720, y: SUELO_Y - 40, ancho: 100, alto: 18,
            colorInactivo: '#555555', colorActivo: '#9D4EDD',
            visible: false },
        ],
      },

// nivel 4
      {
        plataformas: [
          { x: 400, y: SUELO_Y - 45,  ancho: 50,  alto: 100,  color: '#000000' },
          { x: 400, y: SUELO_Y - 105,  ancho: 50,  alto: 100,  color: '#000000' },
          { x: 400, y: SUELO_Y - 166,  ancho: 50,  alto: 100,  color: '#000000' },
          { x: 400, y: SUELO_Y - 227,  ancho: 50,  alto: 100,  color: '#000000' },
          { x: 400, y: SUELO_Y - 280,  ancho: 50,  alto: 100,  color: '#000000' },
          
          // Plataforma alta izquierda (objetivo rojo)
          { x: GROSOR_BORDE, y: 100, ancho: 190, alto: 40, color: '#000000' },
          // Plataforma alta derecha (objetivo azul)
          { x: ANCHO_CANVAS - GROSOR_BORDE - 190, y: 100, ancho: 190, alto: 40, color: '#000000' },
          // Escalón subida izquierda
          { x: GROSOR_BORDE, y: SUELO_Y - 120, ancho: 150, alto:  40, color: '#000000' },
          // Escalón subida derecha
          { x: ANCHO_CANVAS - GROSOR_BORDE - 120, y: SUELO_Y - 120, ancho: 140, alto: 40, color: '#000000' },
        ],
        plataformasMoviles: [
          // Islote izquierdo: controlado por botón DERECHO (cruzado)
          {
            x: 270, y: SUELO_Y - 40, ancho: 110, alto: 18, color: '#555555',
            vx: 0, vy: 0,
            velBase: 1.8,
            limArr: 240, limAba: SUELO_Y - 40,
            moviendose: false,
            indice: 0
          },
          // Islote derecho: controlado por botón IZQUIERDO (cruzado)
          {
            x: ANCHO_CANVAS - 270 - 110, y: SUELO_Y - 40, ancho: 110, alto: 18, color: '#555555',
            vx: 0, vy: 0,
            velBase: 1.8,
            limArr: 240, limAba: SUELO_Y - 40,
            moviendose: false,
            indice: 1
          },
        ],
        // Botón izquierdo → controla plataforma DERECHA (índice 1)
        botonesSwitch: [
          {
            x: GROSOR_BORDE + 90, y: SUELO_Y + 45,
            ancho: 44, alto: 12,
            activado: false,
            pulsoTimer: 0,
            colorApagado: '#7B2FBE',
            colorEncendido: '#C77DFF',
            etiqueta: '▶',
            controlaPlatIndice: 1
          },
          // Botón derecho → controla plataforma IZQUIERDA (índice 0)
          {
            x: ANCHO_CANVAS - GROSOR_BORDE - 134, y: SUELO_Y + 45,
            ancho: 44, alto: 12,
            activado: false,
            pulsoTimer: 0,
            colorApagado: '#7B2FBE',
            colorEncendido: '#C77DFF',
            etiqueta: '◀',
            controlaPlatIndice: 0
          },
        ],
        // Objetivos cruzados: rojo al alto izquierdo, azul al alto derecho
        circuloRojo: { x: GROSOR_BORDE + 40,                  y: 290,  radio: 26, color: '#DC1C1C' },
        circuloAzul: { x: ANCHO_CANVAS - GROSOR_BORDE - 70,   y: 80,  radio: 26, color: '#1C5EDC' },
        estrellaRoja: { x: 780, y: SUELO_Y - 150, radio: 25, recogida: false },
        estrellaAzul: { x: 100, y: SUELO_Y - 370, radio: 25, recogida: false },
      },

// nivel 5
      {
        plataformas: [
          { x: 540, y: SUELO_Y - 70, ancho: 50, alto: 140, color: '#000000' },
          { x: 210, y: SUELO_Y - 100, ancho: 380, alto: 50, color: '#000000' },
          { x: 400, y: SUELO_Y - 330,  ancho: 50,  alto: 100,  color: '#000000' },
          { x: 400, y: SUELO_Y - 390,  ancho: 50,  alto: 100,  color: '#000000' },
          { x: 400, y: SUELO_Y - 450,  ancho: 50,  alto: 100,  color: '#000000' },
        
          
          // Derecha medio-alta
          { x: ANCHO_CANVAS - GROSOR_BORDE - 100, y: SUELO_Y - 220, ancho: 140, alto: 30, color: '#000000' },
          // Pilar central medio (punto de apoyo cooperativo — ambos deben subir aquí juntos)
          { x: 320, y: SUELO_Y - 260, ancho: 200, alto: 30, color: '#000000' },

          // ── Zona alta ──
          // Cornisa izquierda alta (objetivo rojo)
          { x: GROSOR_BORDE, y: 100, ancho: 100, alto: 30, color: '#000000' },
          // Cornisa derecha alta (objetivo azul)
          { x: ANCHO_CANVAS - GROSOR_BORDE - 130, y: 100, ancho: 130, alto: 30, color: '#000000' },
        ],

        botonSwitch: [
        {
          x: 400, y: SUELO_Y + 45,
          ancho: 40, alto: 12,
          activado: false,
          colorApagado: '#7B2FBE',
          colorEncendido: '#C77DFF',
          pulsoTimer: 0
        },

        {
          x: 400, y: SUELO_Y -110,
          ancho: 40, alto: 12,
          activado: false,
          colorApagado: '#7B2FBE',
          colorEncendido: '#C77DFF',
          pulsoTimer: 0
        },
        ],
        plataformasOcultas: [
          { x: 590, y: SUELO_Y - 40, ancho: 90, alto: 20,
            colorInactivo: '#555555', colorActivo: '#9D4EDD',
            visible: false },
          { x: 10, y: SUELO_Y - 40, ancho: 90, alto: 20,
            colorInactivo: '#555555', colorActivo: '#9D4EDD',
            visible: false },
          ],

        plataformasMoviles: [
          {
            x: 310, y: 130, ancho: 90, alto: 18, color: '#555555',
            vx: 2.5, vy: 0,
            limIzq: 140, limDer: ANCHO_CANVAS - 140
          },
        ],
        // Objetivos en las cornisas superiores
        circuloRojo: { x: GROSOR_BORDE +730 ,                  y: 465,  radio: 24, color: '#DC1C1C' },
        circuloAzul: { x: ANCHO_CANVAS - GROSOR_BORDE - 50,   y: 80,  radio: 24, color: '#1C5EDC' },
        estrellaRoja: { x: 60, y: SUELO_Y - 370, radio: 30, recogida: false },
        estrellaAzul: { x: 770, y: SUELO_Y - 250, radio: 30, recogida: false },
      },
    ];

    // ─── ESTADO DEL JUEGO ────────────────────────────────────────────────────
    let nivelActual = 0;
    let juegoTerminado = false;
    let nivelCompletado = false;

    // ─── CONTADORES DE ESTRELLAS ─────────────────────────────────────────────
    let estrellasLeo = 0;
    let estrellasMia = 0;

    function actualizarContadorDOM() {
      document.getElementById('contador-leo').textContent = estrellasLeo;
      document.getElementById('contador-mia').textContent = estrellasMia;
    }

    function animarContador(jugador) {
      const idBloque = jugador === 'leo' ? 'bloque-leo' : 'bloque-mia';
      const idNum    = jugador === 'leo' ? 'contador-leo' : 'contador-mia';
      const classBrilla = jugador === 'leo' ? 'brilla-leo' : 'brilla-mia';
      const bloque = document.getElementById(idBloque);
      const num    = document.getElementById(idNum);
      // Brillo en el bloque
      bloque.classList.add(classBrilla);
      setTimeout(() => bloque.classList.remove(classBrilla), 500);
      // Pop en el número
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

    // ─── RESETEAR ESTADO DE NIVEL 3 ──────────────────────────────────────────
    function resetearEstadoNivel3() {
      const n3 = niveles[2];
      if (n3.botonSwitch) {
        n3.botonSwitch.activado = false;
        n3.botonSwitch.pulsoTimer = 0;
      }
      if (n3.plataformasOcultas) {
        for (const po of n3.plataformasOcultas) po.visible = false;
      }
    }

    // ─── RESETEAR ESTADO DE NIVEL 4 ──────────────────────────────────────────
    function resetearEstadoNivel4() {
      const n4 = niveles[3];
      if (n4.botonesSwitch) {
        for (const btn of n4.botonesSwitch) {
          btn.activado = false;
          btn.pulsoTimer = 0;
        }
      }
      if (n4.plataformasMoviles) {
        for (const pm of n4.plataformasMoviles) {
          pm.y = pm.limAba;
          pm.vy = 0;
          pm.moviendose = false;
        }
      }
    }

    // ─── RESETEAR ESTADO DE NIVEL 5 ──────────────────────────────────────────
    function resetearEstadoNivel5() {
      const n5 = niveles[4];
      if (n5.botonSwitch) {
        if (Array.isArray(n5.botonSwitch)) {
          for (const btn of n5.botonSwitch) {
            btn.activado = false;
            btn.pulsoTimer = 0;
          }
        } else {
          n5.botonSwitch.activado = false;
          n5.botonSwitch.pulsoTimer = 0;
        }
      }
      if (n5.plataformasOcultas) {
        for (const po of n5.plataformasOcultas) po.visible = false;
      }
    }

    // ─── REINICIAR NIVEL ACTUAL ──────────────────────────────────────────
    function reiniciarNivelActual() {
      nivelCompletado = false;
      juegoTerminado = false;
      // Resetear posición de jugadores
      cuadradoRojo = crearCuadradoRojo();
      cuadradoAzul = crearCuadradoAzul();
      // Resetear estado de todos los niveles
      resetearEstadoNivel3();
      resetearEstadoNivel4();
      resetearEstadoNivel5();
      // Resetear estrellas del nivel
      resetearEstrellas();
      // Ocultar overlays si están visibles
      document.getElementById('overlay-nivel').classList.remove('visible');
      document.getElementById('overlay-victoria').classList.remove('visible');
    }

    // ─── JUGADORES ───────────────────────────────────────────────────────────
    function crearCuadradoRojo() {
      return {
        x: GROSOR_BORDE, y: SUELO_Y,
        ancho: 60, alto: 60,
        velocidad: 5, velocidadY: 0,
        enAire: false, color: '#DC1C1C'
      };
    }
    function crearCuadradoAzul() {
      return {
        x: ANCHO_CANVAS - GROSOR_BORDE - 60, y: SUELO_Y,
        ancho: 60, alto: 60,
        velocidad: 5, velocidadY: 0,
        enAire: false, color: '#1C5EDC'
      };
    }

    let cuadradoRojo = crearCuadradoRojo();
    let cuadradoAzul = crearCuadradoAzul();

    // ─── TECLADO ─────────────────────────────────────────────────────────────
    const teclasPresionadas = {
      a: false, d: false, w: false,
      izquierda: false, derecha: false, arriba: false
    };

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
      // Barra espaciadora: reiniciar nivel actual
      if (e.code === 'Space') {
        e.preventDefault();
        reiniciarNivelActual();
      }
    });

    // ─── FÍSICA Y COLISIONES ─────────────────────────────────────────────────
    function colisiona(a, b) {
      return a.x < b.x + b.ancho &&
             a.x + a.ancho > b.x &&
             a.y < b.y + b.alto &&
             a.y + a.alto > b.y;
    }

    function resolverConPlataforma(rect, plat) {
      if (!colisiona(rect, plat)) return false;
      const solapIzq = (rect.x + rect.ancho) - plat.x;
      const solapDer = (plat.x + plat.ancho) - rect.x;
      const solapArr = (rect.y + rect.alto)  - plat.y;
      const solapAba = (plat.y + plat.alto)  - rect.y;
      const min = Math.min(solapIzq, solapDer, solapArr, solapAba);

      // Colisión desde ARRIBA (cae sobre la plataforma)
      if (min === solapArr && rect.velocidadY >= 0) {
        rect.y = plat.y - rect.alto;
        rect.velocidadY = 0;
        rect.enAire = false;
        return true;
      } 
      // Colisión desde ABAJO (salta contra plataforma)
      else if (min === solapAba && rect.velocidadY < 0) {
        rect.y = plat.y + plat.alto;
        rect.velocidadY = 0;
      } 
      // Colisión desde IZQUIERDA (golpea desde la derecha)
      else if (min === solapIzq) {
        rect.x = plat.x - rect.ancho;
      } 
      // Colisión desde DERECHA (golpea desde la izquierda)
      else if (min === solapDer) {
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

      if (min === solapArr) {
        r1.y -= solapArr;
        r1.velocidadY = 0;
        r1.enAire = false;
      } else if (min === solapAba) {
        r2.y -= solapAba;
        r2.velocidadY = 0;
        r2.enAire = false;
      } else if (min === solapIzq) {
        r1.x -= solapIzq / 2;
        r2.x += solapIzq / 2;
      } else if (min === solapDer) {
        r2.x -= solapDer / 2;
        r1.x += solapDer / 2;
      }
    }

    function aplicarLimites(rect) {
      const limIzq = GROSOR_BORDE;
      const limDer = ANCHO_CANVAS - GROSOR_BORDE - rect.ancho;
      if (rect.x < limIzq) rect.x = limIzq;
      if (rect.x > limDer) rect.x = limDer;
    }

    // ─── LÓGICA DE VICTORIA ──────────────────────────────────────────────────
    function cuadradoDentroCirculo(rect, circ) {
      const cx = rect.x + rect.ancho / 2;
      const cy = rect.y + rect.alto / 2;
      const dx = cx - circ.x;
      const dy = cy - circ.y;
      return Math.sqrt(dx * dx + dy * dy) < circ.radio + 10;
    }

    // ─── ACTUALIZAR PLATAFORMAS MÓVILES ──────────────────────────────────────
    function actualizarPlataformasMoviles() {
      const nivel = niveles[nivelActual];
      for (const pm of nivel.plataformasMoviles) {
        // Plataformas del nivel 4: solo se mueven si moviendose === true
        if (typeof pm.moviendose !== 'undefined') {
          if (pm.moviendose) {
            pm.y -= pm.velBase;
            if (pm.y <= pm.limArr) {
              pm.y = pm.limArr;
              // Llega arriba: se queda quieta arriba
            }
          } else {
            // Baja lentamente si no está siendo activada y no ha llegado al fondo
            if (pm.y < pm.limAba) {
              pm.y += pm.velBase * 0.7;
              if (pm.y >= pm.limAba) pm.y = pm.limAba;
            }
          }
          continue;
        }
        // Lógica normal para otros niveles
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

    // ─── MOVER CUADRADOS ─────────────────────────────────────────────────────
    function moverCuadrados() {
      if (juegoTerminado || nivelCompletado || enPantallaIntro) return;

      const nivel = niveles[nivelActual];
      const plataformasOcultasActivas = (nivel.plataformasOcultas || [])
        .filter(po => po.visible)
        .map(po => ({ x: po.x, y: po.y, ancho: po.ancho, alto: po.alto, color: po.colorActivo }));
      const todasPlataformas = [...nivel.plataformas, ...nivel.plataformasMoviles, ...plataformasOcultasActivas];

      // — Cuadrado Rojo —
      if (teclasPresionadas.a) cuadradoRojo.x -= cuadradoRojo.velocidad;
      if (teclasPresionadas.d) cuadradoRojo.x += cuadradoRojo.velocidad;
      if (teclasPresionadas.w && !cuadradoRojo.enAire) {
        cuadradoRojo.velocidadY = FUERZA_SALTO;
        cuadradoRojo.enAire = true;
      }
      cuadradoRojo.velocidadY += GRAVEDAD;
      cuadradoRojo.y += cuadradoRojo.velocidadY;

      let colR = false;
      for (const plat of todasPlataformas) {
        if (resolverConPlataforma(cuadradoRojo, plat)) { colR = true; break; }
      }
      if (!colR && cuadradoRojo.y >= SUELO_Y) {
        cuadradoRojo.y = SUELO_Y;
        cuadradoRojo.velocidadY = 0;
        cuadradoRojo.enAire = false;
      }

      // — Cuadrado Azul —
      if (teclasPresionadas.izquierda) cuadradoAzul.x -= cuadradoAzul.velocidad;
      if (teclasPresionadas.derecha)   cuadradoAzul.x += cuadradoAzul.velocidad;
      if (teclasPresionadas.arriba && !cuadradoAzul.enAire) {
        cuadradoAzul.velocidadY = FUERZA_SALTO;
        cuadradoAzul.enAire = true;
      }
      cuadradoAzul.velocidadY += GRAVEDAD;
      cuadradoAzul.y += cuadradoAzul.velocidadY;

      let colA = false;
      for (const plat of todasPlataformas) {
        if (resolverConPlataforma(cuadradoAzul, plat)) { colA = true; break; }
      }
      if (!colA && cuadradoAzul.y >= SUELO_Y) {
        cuadradoAzul.y = SUELO_Y;
        cuadradoAzul.velocidadY = 0;
        cuadradoAzul.enAire = false;
      }

      // — Colisión entre jugadores —
      resolverEntreJugadores(cuadradoRojo, cuadradoAzul);

      // — Límites del canvas —
      aplicarLimites(cuadradoRojo);
      aplicarLimites(cuadradoAzul);

      // — Botón(es) morado(s) HOLD (nivel 3 y 5) —
      if (nivel.botonSwitch) {
        const botones = Array.isArray(nivel.botonSwitch) ? nivel.botonSwitch : [nivel.botonSwitch];
        for (const btn of botones) {
          const rojoEncima = colisiona(cuadradoRojo, { x: btn.x, y: btn.y, ancho: btn.ancho, alto: btn.alto });
          const azulEncima = colisiona(cuadradoAzul, { x: btn.x, y: btn.y, ancho: btn.ancho, alto: btn.alto });
          const alguienEncima = rojoEncima || azulEncima;

          if (alguienEncima && !btn.activado) {
            // Se acaba de presionar
            btn.activado = true;
            btn.pulsoTimer = 20;
            for (const po of nivel.plataformasOcultas) po.visible = true;
          } else if (!alguienEncima && btn.activado) {
            // Se acaba de soltar
            btn.activado = false;
            btn.pulsoTimer = 20;
            for (const po of nivel.plataformasOcultas) po.visible = false;
          }
          if (btn.pulsoTimer > 0) btn.pulsoTimer--;
        }
      }

      // — Botones cruzados HOLD (solo nivel 4) —
      if (nivel.botonesSwitch) {
        for (const btn of nivel.botonesSwitch) {
          const hitbox = { x: btn.x, y: btn.y, ancho: btn.ancho, alto: btn.alto };
          const rojoEncima = colisiona(cuadradoRojo, hitbox);
          const azulEncima = colisiona(cuadradoAzul, hitbox);
          const alguienEncima = rojoEncima || azulEncima;

          const estabaActivado = btn.activado;
          btn.activado = alguienEncima;
          if (btn.activado !== estabaActivado) btn.pulsoTimer = 20;
          if (btn.pulsoTimer > 0) btn.pulsoTimer--;

          // Controla la plataforma cruzada
          const pm = nivel.plataformasMoviles[btn.controlaPlatIndice];
          if (pm) pm.moviendose = btn.activado;
        }
      }

      // — Recoger estrellas —
      if (nivel.estrellaRoja && !nivel.estrellaRoja.recogida) {
        const er = nivel.estrellaRoja;
        const cxR = cuadradoRojo.x + cuadradoRojo.ancho / 2;
        const cyR = cuadradoRojo.y + cuadradoRojo.alto / 2;
        if (Math.sqrt((cxR - er.x) ** 2 + (cyR - er.y) ** 2) < er.radio + 20) {
          er.recogida = true;
          estrellasLeo++;
          actualizarContadorDOM();
          animarContador('leo');
        }
      }
      if (nivel.estrellaAzul && !nivel.estrellaAzul.recogida) {
        const ea = nivel.estrellaAzul;
        const cxA = cuadradoAzul.x + cuadradoAzul.ancho / 2;
        const cyA = cuadradoAzul.y + cuadradoAzul.alto / 2;
        if (Math.sqrt((cxA - ea.x) ** 2 + (cyA - ea.y) ** 2) < ea.radio + 20) {
          ea.recogida = true;
          estrellasMia++;
          actualizarContadorDOM();
          animarContador('mia');
        }
      }

      // — Verificar victoria —
      const { circuloRojo, circuloAzul } = nivel;
      const ambosEnObjetivo =
        cuadradoDentroCirculo(cuadradoRojo, circuloRojo) &&
        cuadradoDentroCirculo(cuadradoAzul, circuloAzul);

      if (ambosEnObjetivo) {
        if (nivelActual < niveles.length - 1) {
          // Hay un nivel siguiente
          nivelCompletado = true;
          document.getElementById('overlay-nivel').classList.add('visible');
        } else {
          // Último nivel: victoria final
          juegoTerminado = true;
          document.getElementById('overlay-victoria').classList.add('visible');
        }
      }
    }

    // ─── DIBUJO ───────────────────────────────────────────────────────────────
    function dibujarBorde() {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth   = GROSOR_BORDE * 2;
      ctx.strokeRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
    }

    function dibujarBotonSwitch(btn) {
      const { x, y, ancho, alto, activado, colorApagado, colorEncendido, pulsoTimer } = btn;
      const color = activado ? colorEncendido : colorApagado;
      ctx.save();

      // Sombra de brillo cuando está activo o en pulso
      if (activado || pulsoTimer > 0) {
        ctx.shadowColor = '#C77DFF';
        ctx.shadowBlur = activado
          ? (pulsoTimer > 0 ? 22 + pulsoTimer : 12)
          : pulsoTimer * 0.6;
      }

      // Cuerpo del botón con bordes redondeados
      const r = 5;
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
      ctx.fillStyle = color;
      ctx.fill();

      // Brillo superior (highlight)
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 4, y + 2, ancho - 8, alto / 2 - 1);
      ctx.globalAlpha = 1;

      // Borde
      ctx.strokeStyle = activado ? '#E0AAFF' : '#5A189A';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      // Etiqueta encima del botón
      ctx.save();
      ctx.font = 'bold 9px "Courier New", monospace';
      ctx.fillStyle = activado ? '#C77DFF' : '#9D4EDD';
      ctx.textAlign = 'center';
      ctx.fillText(activado ? '▼ HOLD' : '▼ HOLD', x + ancho / 2, y - 5);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    function dibujarBotonCruzado(btn) {
      const { x, y, ancho, alto, activado, colorApagado, colorEncendido, pulsoTimer, etiqueta } = btn;
      const color = activado ? colorEncendido : colorApagado;
      ctx.save();

      // Brillo cuando activo
      if (activado || pulsoTimer > 0) {
        ctx.shadowColor = '#C77DFF';
        ctx.shadowBlur = activado
          ? (pulsoTimer > 0 ? 22 + pulsoTimer : 14)
          : pulsoTimer * 0.6;
      }

      // Cuerpo redondeado
      const r = 5;
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
      ctx.fillStyle = color;
      ctx.fill();

      // Brillo superior
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 4, y + 2, ancho - 8, alto / 2 - 1);
      ctx.globalAlpha = 1;

      // Borde
      ctx.strokeStyle = activado ? '#E0AAFF' : '#5A189A';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Etiqueta encima con flecha cruzada
      ctx.save();
      ctx.font = 'bold 9px "Courier New", monospace';
      ctx.fillStyle = activado ? '#C77DFF' : '#9D4EDD';
      ctx.textAlign = 'center';
      ctx.fillText('HOLD ' + etiqueta, x + ancho / 2, y - 5);
      ctx.textAlign = 'left';
      ctx.restore();
    }

    function dibujarPlataformaOculta(po) {
      ctx.save();
      // Brillo púrpura
      ctx.shadowColor = '#9D4EDD';
      ctx.shadowBlur = 8;
      ctx.fillStyle = po.colorActivo;
      ctx.fillRect(po.x, po.y, po.ancho, po.alto);
      // Franjas decorativas
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#ffffff';
      for (let i = -po.alto; i < po.ancho; i += 14) {
        ctx.beginPath();
        ctx.moveTo(po.x + i, po.y);
        ctx.lineTo(po.x + i + po.alto, po.y + po.alto);
        ctx.lineTo(po.x + i + po.alto + 6, po.y + po.alto);
        ctx.lineTo(po.x + i + 6, po.y);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#E0AAFF';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(po.x, po.y, po.ancho, po.alto);
      ctx.restore();
    }

    function dibujarPlataformaFantasma(po) {
      // Plataforma inactiva: silueta punteada semitransparente como "hint"
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#9D4EDD';
      ctx.lineWidth = 2;
      ctx.strokeRect(po.x, po.y, po.ancho, po.alto);
      ctx.setLineDash([]);
      ctx.restore();
    }

    function dibujarPlataforma(plat, esMovil = false) {
      // Plataformas estáticas negras: dibujar con textura de piso
      if (!esMovil && plat.color === '#000000' && pisoImagenLista) {
        ctx.save();
        // Recortar exactamente al borde de la plataforma (colision)
        ctx.beginPath();
        ctx.rect(plat.x, plat.y, plat.ancho, plat.alto);
        ctx.clip();

        // La imagen tiene 221px de alto total, pero el contenido real
        // (cesped + tierra) va de y=59 a y=173 (114px utiles).
        // Escalamos para que esos 114px llenen exactamente el alto de la plataforma,
        // y desplazamos en Y hacia arriba para que el borde del cesped coincida
        // con el borde superior de la colision (plat.y).
        const IMG_TOTAL_H   = 221;
        const IMG_TOP_PAD   = 59;   // pixels negros/vacios arriba del cesped
        const IMG_CONTENT_H = 114;  // alto del contenido real (cesped + tierra)
        const imgW = imgPiso.naturalWidth; // 1128

        const escala        = plat.alto / IMG_CONTENT_H;
        const anchoEscalado = imgW * escala;
        const altoEscalado  = IMG_TOTAL_H * escala;
        // Offset vertical: subir la imagen para que el cesped quede en plat.y
        const offsetY = plat.y - IMG_TOP_PAD * escala;

        for (let drawX = plat.x; drawX < plat.x + plat.ancho; drawX += anchoEscalado) {
          ctx.drawImage(imgPiso, drawX, offsetY, anchoEscalado, altoEscalado);
        }
        ctx.restore();
        return;
      }

      ctx.fillStyle = plat.color;
      ctx.fillRect(plat.x, plat.y, plat.ancho, plat.alto);
      if (esMovil) {
        // Indicador visual: franja diagonal suave
        ctx.save();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#ffffff';
        for (let i = -plat.alto; i < plat.ancho; i += 14) {
          ctx.beginPath();
          ctx.moveTo(plat.x + i, plat.y);
          ctx.lineTo(plat.x + i + plat.alto, plat.y + plat.alto);
          ctx.lineTo(plat.x + i + plat.alto + 6, plat.y + plat.alto);
          ctx.lineTo(plat.x + i + 6, plat.y);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
        // Borde naranja para distinguirla
        ctx.strokeStyle = '#cc8800';
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x, plat.y, plat.ancho, plat.alto);
      }
    }

    function dibujarEstrella(est, color) {
      if (est.recogida) return;
      const { x, y, radio } = est;

      // Determinar qué imagen usar según el color (dorado → gemaleo, morado/rosa → gemamia)
      const esLeo = color === '#FFD700';
      const imgGema = esLeo ? imgGemaLeo : imgGemaMia;
      const gemaLista = esLeo ? gemaLeoLista : gemaMiaLista;
      const colorHalo = esLeo ? '#b8a000' : '#cc5fa0';

      ctx.save();

      // Halo pulsante
      const pulso = 0.85 + 0.15 * Math.sin(Date.now() / 280);
      ctx.shadowColor = colorHalo;
      ctx.shadowBlur  = 14 * pulso;

      const tamano = radio * 2.4;
      const dx = x - tamano / 2;
      const dy = y - tamano / 2;

      if (gemaLista) {
        ctx.drawImage(imgGema, dx, dy, tamano, tamano);
      } else {
        // Fallback: círculo de color mientras carga la imagen
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2);
        ctx.fillStyle = colorHalo + '99';
        ctx.fill();
        ctx.strokeStyle = colorHalo;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    }

    function dibujarCirculo(circ) {
      // Determinar qué puerta usar según el color del círculo
      const esMeta = circ.color === '#1C5EDC';   // azul → puerta Mia (moño rosado)
      const imgPuerta = esMeta ? imgPuertaMia : imgPuertaLeo;
      const imagenLista = esMeta ? puertaMiaLista : puertaLeoLista;

      // Las puertas se dibujan centradas en circ.x, circ.y
      // El tamaño visual se escala a partir del radio (diámetro * 2 para dar margen)
      const tamano = circ.radio * 3.2;
      const dx = circ.x - tamano / 2;
      const dy = circ.y - tamano * 0.85; // ancla en la parte baja de la puerta

      if (imagenLista) {
        ctx.save();
        ctx.drawImage(imgPuerta, dx, dy, tamano, tamano * 1.15);
        ctx.restore();
      } else {
        // Fallback: círculo de color mientras carga la imagen
        ctx.save();
        ctx.beginPath();
        ctx.arc(circ.x, circ.y, circ.radio, 0, Math.PI * 2);
        ctx.fillStyle = circ.color + '33';
        ctx.fill();
        ctx.strokeStyle = circ.color;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }
    }

    function dibujarSombras() {
      // Sombra del jugador rojo (Leo): proyección suave bajo la imagen
      ctx.save();
      ctx.shadowColor   = 'rgba(180, 160, 0, 0.35)';
      ctx.shadowBlur    = 12;
      ctx.shadowOffsetY = 4;
      if (leoImagenLista) {
        ctx.drawImage(imgLeo, cuadradoRojo.x, cuadradoRojo.y, cuadradoRojo.ancho, cuadradoRojo.alto);
      } else {
        ctx.fillStyle = cuadradoRojo.color;
        ctx.fillRect(cuadradoRojo.x, cuadradoRojo.y, cuadradoRojo.ancho, cuadradoRojo.alto);
      }
      ctx.restore();

      // Sombra del jugador azul (Mia): proyección suave bajo la imagen
      ctx.save();
      ctx.shadowColor   = 'rgba(255, 150, 200, 0.4)';
      ctx.shadowBlur    = 14;
      ctx.shadowOffsetY = 5;
      if (miaImagenLista) {
        ctx.drawImage(imgMia, cuadradoAzul.x, cuadradoAzul.y, cuadradoAzul.ancho, cuadradoAzul.alto);
      } else {
        ctx.fillStyle = cuadradoAzul.color;
        ctx.fillRect(cuadradoAzul.x, cuadradoAzul.y, cuadradoAzul.ancho, cuadradoAzul.alto);
      }
      ctx.restore();
    }

    function dibujarCuadrados() {
      // Jugador rojo: dibujar imagen Leo dentro del hitbox exacto
      if (leoImagenLista) {
        ctx.drawImage(imgLeo, cuadradoRojo.x, cuadradoRojo.y, cuadradoRojo.ancho, cuadradoRojo.alto);
      } else {
        ctx.fillStyle = cuadradoRojo.color;
        ctx.fillRect(cuadradoRojo.x, cuadradoRojo.y, cuadradoRojo.ancho, cuadradoRojo.alto);
      }

      // Jugador azul: dibujar imagen Mia dentro del hitbox exacto
      if (miaImagenLista) {
        ctx.drawImage(imgMia, cuadradoAzul.x, cuadradoAzul.y, cuadradoAzul.ancho, cuadradoAzul.alto);
      } else {
        ctx.fillStyle = cuadradoAzul.color;
        ctx.fillRect(cuadradoAzul.x, cuadradoAzul.y, cuadradoAzul.ancho, cuadradoAzul.alto);
      }
    }

    // Etiqueta de nivel en canvas (esquina superior izquierda)
    function dibujarEtiquetaNivel() {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.letterSpacing = '0.1em';
      ctx.fillText(`NIVEL ${nivelActual + 1}`, GROSOR_BORDE + 6, GROSOR_BORDE + 18);
      ctx.restore();
    }

    // ─── BUCLE PRINCIPAL ─────────────────────────────────────────────────────
    function bucleDeJuego() {
      ctx.clearRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);

      // ── PANTALLA DE INTRO ──
      if (enPantallaIntro) {
        if (introImagenLista) {
          ctx.drawImage(imgIntro, 0, 0, ANCHO_CANVAS, ALTO_CANVAS);
          // Efecto hover sobre el botón JUGAR
          if (hoverBotonJugar) {
            ctx.save();
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(255, 385, 335, 103, 20);
            ctx.fill();
            ctx.globalAlpha = 1;
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
      // ── JUEGO NORMAL ──
      // Fondo
      if (fondoImagenLista) {
        ctx.drawImage(imgFondo, 0, 0, ANCHO_CANVAS, ALTO_CANVAS);
      } else {
        ctx.fillStyle = '#5ba8d4';
        ctx.fillRect(0, 0, ANCHO_CANVAS, ALTO_CANVAS);
      }

      const nivel = niveles[nivelActual];

      // Actualizar plataformas móviles (siempre, incluso en overlay, para que se vea el movimiento)
      actualizarPlataformasMoviles();

      // Círculos objetivo
      dibujarCirculo(nivel.circuloRojo);
      dibujarCirculo(nivel.circuloAzul);

      // Estrellas coleccionables
      if (nivel.estrellaRoja) dibujarEstrella(nivel.estrellaRoja, '#FFD700');
      if (nivel.estrellaAzul) dibujarEstrella(nivel.estrellaAzul, '#E080FF');

      // Plataformas fijas
      for (const plat of nivel.plataformas) dibujarPlataforma(plat, false);

      // Plataformas móviles
      for (const pm of nivel.plataformasMoviles) dibujarPlataforma(pm, true);

      // Botones morados y plataformas ocultas (nivel 3 y 5)
      if (nivel.botonSwitch) {
        if (Array.isArray(nivel.botonSwitch)) {
          for (const btn of nivel.botonSwitch) dibujarBotonSwitch(btn);
        } else {
          dibujarBotonSwitch(nivel.botonSwitch);
        }
      }
      if (nivel.plataformasOcultas) {
        for (const po of nivel.plataformasOcultas) {
          if (po.visible) dibujarPlataformaOculta(po);
          else dibujarPlataformaFantasma(po);
        }
      }

      // Botones cruzados (nivel 4)
      if (nivel.botonesSwitch) {
        for (const btn of nivel.botonesSwitch) dibujarBotonCruzado(btn);
      }

      // Borde
      dibujarBorde();

      // Etiqueta nivel
      dibujarEtiquetaNivel();

      // Actualizar jugadores
      moverCuadrados();

      // Sombras + jugadores
      dibujarSombras();
      dibujarCuadrados();

      requestAnimationFrame(bucleDeJuego);
    }

    // ─── BOTONES ─────────────────────────────────────────────────────────────
    document.getElementById('btnSiguiente').addEventListener('click', () => {
      nivelActual++;
      nivelCompletado = false;
      // Resetear posición de jugadores
      cuadradoRojo = crearCuadradoRojo();
      cuadradoAzul = crearCuadradoAzul();
      // Resetear estado de nivel 3 si volvemos a él (por si acaso)
      resetearEstadoNivel3();
      resetearEstadoNivel4();
      resetearEstadoNivel5();
      // Resetear estrellas del nuevo nivel (por si el cheat las había recogido)
      resetearEstrellas();
      // Ocultar overlay
      document.getElementById('overlay-nivel').classList.remove('visible');
      // Actualizar indicador exterior
      document.getElementById('nivel-indicador').textContent = `NIVEL ${nivelActual + 1}`;
    });

    document.getElementById('btnReiniciar').addEventListener('click', () => {
      nivelActual = 0;
      nivelCompletado = false;
      juegoTerminado = false;
      cuadradoRojo = crearCuadradoRojo();
      cuadradoAzul = crearCuadradoAzul();
      resetearEstadoNivel3();
      resetearEstadoNivel4();
      resetearEstadoNivel5();
      resetearTodasEstrellas();
      document.getElementById('overlay-victoria').classList.remove('visible');
      document.getElementById('overlay-nivel').classList.remove('visible');
      document.getElementById('nivel-indicador').textContent = 'NIVEL 1';
    });

    // secuencia de trucos (usar chet)
    (function() {
      const SECUENCIA = 'chet';
      let buffer = '';
 
      // Botón invisible — solo aparece al activar el cheat
      const btnCheat = document.createElement('button');
      btnCheat.textContent = 'SKIP';
      btnCheat.style.cssText = `
        position: fixed;
        bottom: 18px;
        right: 18px;
        background: #111;
        color: #e8e8e8;
        border: 2px solid #e8e8e8;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        padding: 7px 20px;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s, background 0.2s, color 0.2s;
        z-index: 9999;
      `;
      btnCheat.addEventListener('mouseenter', () => {
        btnCheat.style.background = '#e8e8e8';
        btnCheat.style.color = '#111';
      });
      btnCheat.addEventListener('mouseleave', () => {
        btnCheat.style.background = '#111';
        btnCheat.style.color = '#e8e8e8';
      });
      btnCheat.addEventListener('click', () => {
        // Ocultar cheat button
        btnCheat.style.opacity = '0';
        btnCheat.style.pointerEvents = 'none';
 
        if (nivelActual < niveles.length - 1) {
          // Cerrar cualquier overlay abierto
          document.getElementById('overlay-nivel').classList.remove('visible');
          nivelActual++;
          nivelCompletado = false;
          juegoTerminado  = false;
          cuadradoRojo = crearCuadradoRojo();
          cuadradoAzul = crearCuadradoAzul();
          resetearEstadoNivel3();
          resetearEstadoNivel4();
          resetearEstadoNivel5();
          resetearEstrellas();
          document.getElementById('nivel-indicador').textContent = `NIVEL ${nivelActual + 1}`;
        } else {
          // Ya estamos en el último nivel → mostrar victoria
          juegoTerminado = true;
          document.getElementById('overlay-victoria').classList.add('visible');
        }
      });
      document.body.appendChild(btnCheat);
 
      // Escucha de teclas — solo letras, no dispara las acciones del juego
      document.addEventListener('keydown', e => {
        // Ignorar si se está usando una tecla de control del juego
        const ignorar = ['a','d','w','arrowleft','arrowright','arrowup','arrowdown'];
        if (ignorar.includes(e.key.toLowerCase())) return;
 
        buffer += e.key.toLowerCase();
        // Mantener solo los últimos N caracteres necesarios
        if (buffer.length > SECUENCIA.length) {
          buffer = buffer.slice(buffer.length - SECUENCIA.length);
        }
 
        if (buffer === SECUENCIA) {
          buffer = '';
          // Mostrar botón brevemente con efecto
          btnCheat.style.opacity = '1';
          btnCheat.style.pointerEvents = 'auto';
        }
      });
    })();

    // ─── ARRANQUE ────────────────────────────────────────────────────────────
    // Mostrar pantalla de intro al iniciar
    document.getElementById('overlay-intro').classList.add('visible');

    // Click en el botón JUGAR de la imagen intro (zona inferior central del canvas)
    // El botón JUGAR está aprox en x: 270-570, y: 390-480 (canvas 840x500)
    canvas.addEventListener('click', (e) => {
      if (!enPantallaIntro) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = ANCHO_CANVAS / rect.width;
      const scaleY = ALTO_CANVAS / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top)  * scaleY;
      // Zona del botón JUGAR en la imagen
      if (cx >= 255 && cx <= 590 && cy >= 385 && cy <= 488) {
        enPantallaIntro = false;
        document.getElementById('overlay-intro').classList.remove('visible');
      }
    });

    // Cambiar cursor a pointer cuando está sobre el botón JUGAR
    canvas.addEventListener('mousemove', (e) => {
      if (!enPantallaIntro) { canvas.style.cursor = 'default'; hoverBotonJugar = false; return; }
      const rect = canvas.getBoundingClientRect();
      const scaleX = ANCHO_CANVAS / rect.width;
      const scaleY = ALTO_CANVAS / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top)  * scaleY;
      hoverBotonJugar = (cx >= 255 && cx <= 590 && cy >= 385 && cy <= 488);
      canvas.style.cursor = hoverBotonJugar ? 'pointer' : 'default';
    });

    bucleDeJuego();