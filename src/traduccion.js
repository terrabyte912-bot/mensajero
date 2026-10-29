// El ribosoma lee el ARNm codón por codón; el jugador elige el ARNt por su anticodón.
import { E, guardar } from './estado.js';
import { ARNM, codones, traducir, anticodon, NOMBRE, TODOS_CODONES } from './data.js';
import { mezclar } from './retos.js';
import { ANCHO, estilo, boton, ficha, fondo, crearReto, VERDE, ROJO } from './ui.js';

const PASO = 128, SITIO_A = 760, SITIO_P = SITIO_A - PASO, Y_ARNM = 430;

export class Traduccion extends Phaser.Scene {
  constructor() { super('Traduccion'); }
  init(d) { this.d = d; }

  create() {
    const d = this.d;
    this.auto = this.saltar = false;
    this.cods = codones(ARNM);
    this.i = d.desde;
    this.cadena = this.cods.slice(0, d.desde).map(traducir);
    this.cameras.main.fadeIn(200);
    fondo(this, d.desde ? 0xfff6ee : 0xf0faf6, d.desde ? 0xf7dcc6 : 0xcdeee2);

    // Ribosoma: subunidad grande (con cara) arriba y chica abajo; el ARNm pasa entre las dos.
    const g = this.add.graphics(), cx = SITIO_A - PASO / 2;
    g.fillStyle(0x000000, 0.08).fillEllipse(cx, 572, 420, 40);
    g.fillStyle(0x8d6e63, 1).fillEllipse(cx, 350, 470, 170).fillStyle(0xa1887f, 1).fillEllipse(cx, 340, 470, 160);
    g.fillStyle(0xc4b5ae, 1).fillEllipse(cx, 518, 400, 100).fillStyle(0xd7ccc8, 1).fillEllipse(cx, 512, 400, 92);
    for (const ox of [-40, 40]) g.fillStyle(0xffffff, 1).fillCircle(cx + ox, 300, 15).fillStyle(0x23233a, 1).fillCircle(cx + ox + 3, 302, 7);
    g.lineStyle(4, 0x23233a, 1).beginPath().arc(cx, 318, 16, 0.2 * Math.PI, 0.8 * Math.PI).strokePath();
    for (const [x, l] of [[SITIO_P, 'P'], [SITIO_A, 'A']]) this.add.text(x, 384, `sitio ${l}`, estilo(18, '#fff', { fontStyle: '800' })).setOrigin(0.5);

    this.tira = this.add.container(0, 0);
    this.proteina = this.add.container(0, 0);
    this.titulo = this.add.text(ANCHO / 2, 30, '', estilo(26, '#23233a', { fontStyle: 'bold', align: 'center', wordWrap: { width: 1200 } })).setOrigin(0.5, 0);
    this.contador = this.add.text(ANCHO - 30, 120, '', estilo(22, '#555')).setOrigin(1, 0);
    this.aviso = this.add.text(ANCHO / 2, 560, '', estilo(22, '#23233a', { align: 'center', wordWrap: { width: 1200 } })).setOrigin(0.5, 0);
    this.opciones = this.add.container(0, 0);
    this.dibujar();
    this.paso();
  }

  dibujar() {
    this.tira.removeAll(true);
    for (let k = this.i - 5; k <= this.i + 4; k++) {
      if (k < 0 || k >= this.cods.length) continue;
      const x = SITIO_A + (k - this.i) * PASO;
      [...this.cods[k]].forEach((b, j) => this.tira.add(ficha(this, x + (j - 1) * 38, Y_ARNM, b, 34, k === this.i ? 0x23233a : 0)));
    }
    if (this.i - 5 <= 0) this.tira.add(this.add.text(SITIO_A + (-this.i) * PASO - 80, Y_ARNM, "5'", estilo(22, '#23233a', { fontStyle: 'bold' })).setOrigin(1, 0.5));
    this.proteina.removeAll(true);
    const ultimos = this.cadena.slice(-14);
    ultimos.forEach((a, j) => {
      const n = ultimos.length - 1 - j;
      const x = SITIO_P - n * 42, y = 225 - 24 * Math.sin(n / 1.6);
      this.proteina.add(this.add.circle(x, y, 20, j % 2 ? 0x16a085 : 0x1abc9c));
      this.proteina.add(this.add.text(x, y, NOMBRE[a][0], estilo(13, '#fff', { fontStyle: 'bold' })).setOrigin(0.5));
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
      return this.time.delayedCall(55, () => this.avanzar());
    }
    this.opciones.removeAll(true);
    if (!d.stop) {
      this.titulo.setText(`¡Salió el péptido señal: los primeros ${d.hasta} aminoácidos!`);
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
      this.opciones.add(boton(this, ANCHO / 2, 640, 260, 60, 'Continuar', () => this.terminar(), VERDE));
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
        if (ac === ok) {
          E.aciertos++;
          this.aviso.setColor('#1e8449').setText(this.i === 0 ? 'El ARNt iniciador trae la metionina: la proteína empieza con Met.' : `¡Bien! ${c} se aparea con ${ac}: entra ${NOMBRE[traducir(c)][1].toLowerCase()}.`);
          this.avanzar();
        } else {
          E.errores++;
          b.list[0].clear().fillStyle(ROJO).fillRoundedRect(-150, -42, 300, 84, 14);
          this.aviso.setColor('#c0392b').setText(`El anticodón ${ac} no se aparea con ${c}. Base con base: A con U, C con G.`);
        }
      }, 0x6c5ce7, 20);
      this.opciones.add(b);
    });
  }

  avanzar() {
    this.cadena.push(traducir(this.cods[this.i]));
    this.i++;
    this.dibujar();
    this.paso();
  }

  terminar() {
    guardar();
    const fin = this.d.fin;
    this.scene.stop();
    fin();
  }
}
