// El ribosoma lee el ARNm codón por codón; el jugador elige el ARNt por su anticodón.
import { E, guardar } from './estado.js';
import { ARNM, codones, traducir, anticodon, NOMBRE, TODOS_CODONES, COLOR_BASE } from './data.js';
import { mezclar } from './retos.js';
import { ANCHO, estilo, boton, ficha, fondo, crearReto, VERDE, ROJO } from './ui.js';
import { ESCALA } from './arte.js';
import { chispas, numero, sonido } from './fx.js';

const PASO = 128, SITIO_A = 760, SITIO_P = SITIO_A - PASO, Y_ARNM = 430, CX = SITIO_A - PASO / 2;
const posCadena = n => [SITIO_P - n * 42, 225 - 24 * Math.sin(n / 1.6)]; // n = lugar contando desde el último

export class Traduccion extends Phaser.Scene {
  constructor() { super('Traduccion'); }
  init(d) { this.d = d; }

  create() {
    const d = this.d;
    this.auto = this.saltar = this.moviendo = false;
    this.cods = codones(ARNM);
    this.i = d.desde;
    this.cadena = this.cods.slice(0, d.desde).map(traducir);
    this.cameras.main.fadeIn(250);
    fondo(this, d.desde ? 0xfff6ee : 0xf0faf6, d.desde ? 0xf7dcc6 : 0xcdeee2);
    this.add.particles(0, 0, 'punto', {
      x: { min: 0, max: ANCHO }, y: { min: 0, max: 720 }, lifespan: 7000, speedY: { min: -15, max: -4 }, speedX: { min: -6, max: 6 },
      scale: { min: 0.15, max: 0.45 }, alpha: { values: [0, 0.5, 0], interpolation: 'linear' }, frequency: 140, advance: 7000,
      tint: [0xffffff, d.desde ? 0xe8b48f : 0x8fd3bd],
    });

    // Ribosoma: subunidad chica abajo, grande (con cara) arriba; el ARNm pasa entre las dos.
    const sombra = this.add.ellipse(CX, 572, 420, 40, 0x000000, 0.08);
    const chica = this.add.graphics({ x: CX, y: 512 })
      .fillStyle(0xc4b5ae, 1).fillEllipse(0, 6, 400, 100).fillStyle(0xd7ccc8, 1).fillEllipse(0, 0, 400, 92)
      .fillStyle(0xffffff, 0.3).fillEllipse(-90, -18, 120, 22);
    const grande = this.add.container(CX, 340);
    grande.add(this.add.graphics()
      .fillStyle(0x8d6e63, 1).fillEllipse(0, 10, 470, 170).fillStyle(0xa1887f, 1).fillEllipse(0, 0, 470, 160)
      .fillStyle(0xffffff, 0.22).fillEllipse(-120, -45, 160, 34)
      .fillStyle(0xff6f91, 0.35).fillEllipse(-78, -10, 26, 15).fillEllipse(78, -10, 26, 15));
    const abiertos = this.add.graphics(), cerrados = this.add.graphics().setVisible(false);
    for (const ox of [-40, 40]) {
      abiertos.fillStyle(0xffffff, 1).fillCircle(ox, -40, 15).fillStyle(0x23233a, 1).fillCircle(ox + 3, -38, 8).fillStyle(0xffffff, 1).fillCircle(ox + 6, -43, 3);
      cerrados.lineStyle(5, 0x23233a, 1).beginPath().arc(ox, -42, 12, 0.15 * Math.PI, 0.85 * Math.PI).strokePath();
    }
    grande.add([abiertos, cerrados, this.add.graphics().lineStyle(4, 0x23233a, 1).beginPath().arc(0, -22, 16, 0.2 * Math.PI, 0.8 * Math.PI).strokePath()]);
    this.time.addEvent({ delay: 2600, loop: true, callback: () => { abiertos.setVisible(false); cerrados.setVisible(true); this.time.delayedCall(140, () => { abiertos.setVisible(true); cerrados.setVisible(false); }); } });
    this.tweens.add({ targets: [grande, chica], scaleX: 1.012, scaleY: 1.03, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.tweens.add({ targets: sombra, scaleX: 0.96, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    for (const [x, l] of [[SITIO_P, 'P'], [SITIO_A, 'A']]) this.add.text(x, 384, `sitio ${l}`, estilo(18, '#fff', { fontStyle: '800' })).setOrigin(0.5);

    this.tira = this.add.container(0, 0).setDepth(5);
    this.proteina = this.add.container(0, 0).setDepth(6);
    this.titulo = this.add.text(ANCHO / 2, 30, '', estilo(26, '#23233a', { fontStyle: '800', align: 'center', wordWrap: { width: 1200 } })).setOrigin(0.5, 0);
    this.contador = this.add.text(ANCHO - 30, 120, '', estilo(22, '#555', { fontStyle: '700' })).setOrigin(1, 0);
    this.aviso = this.add.text(ANCHO / 2, 560, '', estilo(22, '#23233a', { align: 'center', wordWrap: { width: 1200 } })).setOrigin(0.5, 0).setDepth(8);
    this.opciones = this.add.container(0, 0).setDepth(9);
    this.dibujar();
    this.paso();
  }

  dibujar() {
    this.tira.removeAll(true).setX(0);
    for (let k = this.i - 6; k <= this.i + 5; k++) {
      if (k < 0 || k >= this.cods.length) continue;
      const x = SITIO_A + (k - this.i) * PASO;
      [...this.cods[k]].forEach((b, j) => this.tira.add(ficha(this, x + (j - 1) * 38, Y_ARNM, b, 34, k === this.i ? 0x23233a : 0)));
    }
    if (this.i - 6 <= 0) this.tira.add(this.add.text(SITIO_A + (-this.i) * PASO - 80, Y_ARNM, "5'", estilo(22, '#23233a', { fontStyle: '800' })).setOrigin(1, 0.5));
    this.proteina.removeAll(true);
    const ultimos = this.cadena.slice(-14);
    ultimos.forEach((a, j) => {
      const n = ultimos.length - 1 - j, [x, y] = posCadena(n);
      if (n) { const [x2, y2] = posCadena(n - 1); this.proteina.add(this.add.line(0, 0, x, y, x2, y2, 0x0e7c66).setOrigin(0).setLineWidth(4)); }
      this.proteina.add(this.add.circle(x, y, 20, j % 2 ? 0x16a085 : 0x1abc9c).setStrokeStyle(3, 0x0e7c66));
      this.proteina.add(this.add.text(x, y, NOMBRE[a][0], estilo(13, '#fff', { fontStyle: '800' })).setOrigin(0.5));
    });
    this.contador.setText(`Aminoácidos: ${this.cadena.length} / ${this.cods.length - 1}`);
  }

  paso() {
    const d = this.d;
    if (this.i < d.jugar) return this.elegir();
    if (this.i < d.hasta) {
      if (!this.auto) {
        this.auto = true;
        this.titulo.setText('Muy bien. Ahora el ribosoma sigue solo, codón por codón...');
        this.aviso.setText('');
        this.opciones.removeAll(true);
        this.opciones.add(boton(this, ANCHO / 2, 640, 220, 56, 'Saltar ⏩', () => { this.saltar = true; }, 0x9aa0b4, 20));
      }
      if (this.saltar) {
        while (this.i < d.hasta) this.cadena.push(traducir(this.cods[this.i++]));
        this.dibujar();
        return this.paso();
      }
      // Avance rápido: el ARNm se desliza y se suma el aminoácido.
      this.cadena.push(traducir(this.cods[this.i]));
      if (this.i % 3 === 0) sonido('hablar');
      return this.deslizar(90, () => this.paso());
    }
    this.opciones.removeAll(true);
    if (!d.stop) {
      this.titulo.setText(`¡Salió el péptido señal: los primeros ${d.hasta} aminoácidos!`);
      this.celebrar();
      return this.opciones.add(boton(this, ANCHO / 2, 640, 260, 60, 'Continuar', () => this.terminar(), VERDE));
    }
    this.titulo.setText(`Llegó el codón ${this.cods[this.i]} al sitio A.`);
    crearReto(this, {
      tipo: 'pregunta',
      texto: `Llegó el codón ${this.cods[this.i]} al sitio A. ¿Qué pasa ahora?`,
      correcta: 'Es un codón stop: no hay ARNt para él; entra un factor de liberación y se suelta la proteína',
      opciones: mezclar([
        'Es un codón stop: no hay ARNt para él; entra un factor de liberación y se suelta la proteína',
        'Entra un ARNt con su aminoácido y la proteína sigue creciendo',
        'El ribosoma vuelve al AUG y empieza de nuevo la misma proteína',
        'El ribosoma salta ese codón y sigue leyendo',
      ]),
    }, () => {
      this.titulo.setText(`¡Proteína terminada: ${this.cadena.length} aminoácidos!`);
      // La proteína se suelta del ribosoma.
      this.tweens.add({ targets: this.proteina, y: -40, x: -30, duration: 1200, ease: 'Sine.inOut', yoyo: true, repeat: -1 });
      this.celebrar();
      this.opciones.add(boton(this, ANCHO / 2, 640, 260, 60, 'Continuar', () => this.terminar(), VERDE));
    });
  }

  celebrar() {
    sonido('victoria');
    const [x, y] = posCadena(0);
    chispas(this, x - 200, y, [0x16a085, 0x1abc9c, 0xf2c94c, 0xffffff], 50, { textura: 'estrella', velocidad: 420, escala: 0.8 });
  }

  // Mueve la tira un codón a la izquierda y redibuja.
  deslizar(ms, luego) {
    this.tweens.add({
      targets: this.tira, x: -PASO, duration: ms, ease: 'Sine.inOut', onComplete: () => {
        this.i++;
        this.dibujar();
        luego();
      },
    });
  }

  elegir() {
    const c = this.cods[this.i], ok = anticodon(c);
    this.titulo.setText(this.i === 0
      ? 'El ribosoma encontró el AUG. ¿Qué ARNt se aparea con este codón?'
      : `Codón ${c} en el sitio A. ¿Qué ARNt se aparea con él?`);
    const otrosAa = mezclar([...new Set(TODOS_CODONES.map(traducir))].filter(a => a !== '*' && a !== traducir(c))).slice(0, 2);
    const otros = otrosAa.map(a => anticodon(mezclar(TODOS_CODONES.filter(x => traducir(x) === a))[0]));
    this.opciones.removeAll(true);
    mezclar([ok, ...otros]).forEach((ac, k) => {
      const aa = NOMBRE[traducir(anticodon(ac))][0];
      const b = boton(this, ANCHO / 2 + (k - 1) * 330, 640, 300, 84, `ARNt-${aa}\nanticodón 3'-${ac}-5'`, () => {
        if (this.moviendo) return;
        if (ac === ok) {
          E.aciertos++;
          this.aviso.setColor('#1e8449').setText(this.i === 0 ? 'El ARNt iniciador trae la metionina: la proteína empieza con Met.' : `¡Bien! ${c} se aparea con ${ac}: entra ${NOMBRE[traducir(c)][1].toLowerCase()}.`);
          this.opciones.removeAll(true);
          this.llegaArnt(ac, () => this.paso());
        } else {
          E.errores++;
          sonido('mal');
          b.pintar(ROJO);
          this.tweens.add({ targets: b, x: b.x + 10, duration: 50, yoyo: true, repeat: 3 });
          this.aviso.setColor('#c0392b').setText(`El anticodón ${ac} no se aparea con ${c}. Base con base: A con U, C con G.`);
        }
      }, 0x6c5ce7, 20);
      b.setScale(0.6).setAlpha(0);
      this.tweens.add({ targets: b, scale: 1, alpha: 1, duration: 260, delay: k * 60, ease: 'Back.out' });
      this.opciones.add(b);
    });
  }

  // El ARNt entra al sitio A, entrega su aminoácido a la cadena y sale; después el ARNm avanza.
  llegaArnt(ac, luego) {
    this.moviendo = true;
    const a = traducir(this.cods[this.i]);
    const t = this.add.container(SITIO_A + 320, 90).setDepth(7).setAlpha(0);
    t.add(this.add.image(0, -80, 'arnt-gen').setScale(ESCALA * 1.2));
    [...ac].forEach((b, j) => t.add(ficha(this, (j - 1) * 38, 0, b, 30)));
    const crearBola = (x, y) => this.add.container(x, y, [
      this.add.circle(0, 0, 21, 0xf2c94c).setStrokeStyle(3, 0xc49a1c),
      this.add.text(0, 0, NOMBRE[a][0], estilo(13, '#23233a', { fontStyle: '900' })).setOrigin(0.5),
    ]);
    const bola = crearBola(0, -146);
    t.add(bola);
    sonido('abrir');
    this.tweens.chain({
      targets: t, tweens: [
        { x: SITIO_A, y: Y_ARNM - 42, alpha: 1, duration: 520, ease: 'Back.out' },
        {
          scale: 1.06, duration: 90, yoyo: true, onComplete: () => {
            sonido('bien');
            chispas(this, SITIO_A, Y_ARNM - 25, [...ac].map(b => COLOR_BASE[b]).concat(0xffffff), 18, { gravedad: 0, velocidad: 200, escala: 0.45 });
            // El aminoácido viaja hasta la punta de la cadena.
            const [x, y] = posCadena(0);
            bola.setVisible(false);
            const viaja = crearBola(t.x, t.y - 146).setDepth(8);
            this.tweens.add({
              targets: viaja, x, y, duration: 380, ease: 'Quad.inOut', onComplete: () => {
                viaja.destroy();
                this.cadena.push(a);
                this.dibujar();
                numero(this, x, y - 40, NOMBRE[a][0], '#16a085', 26);
                // El ARNt vacío sale por el costado y el ARNm avanza.
                this.tweens.add({ targets: t, x: SITIO_P - PASO, y: 80, alpha: 0, angle: -25, duration: 600, ease: 'Sine.in', onComplete: () => t.destroy() });
                this.deslizar(380, () => { this.moviendo = false; luego(); });
              },
            });
          },
        },
      ],
    });
  }

  terminar() {
    guardar();
    const fin = this.d.fin;
    this.scene.stop();
    fin();
  }
}
