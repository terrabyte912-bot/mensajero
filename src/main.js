import { E, cargar, empezar, hayPartida } from './estado.js';
import { cargarArte, ESCALA } from './arte.js';
import { BASES, traducir, NOMBRE, COLOR_BASE } from './data.js';
import * as R from './retos.js';
import { ANCHO, ALTO, estilo, boton, panel, fondo, crearReto, VIOLETA, VERDE, GRIS } from './ui.js';
import { texturasBase, parpadeo, aparecer, alternarSonido, sonidoActivo, sonido } from './fx.js';
import { Mundo } from './mundo.js';
import { Batalla } from './batalla.js';
import { Traduccion } from './traduccion.js';

const hex = n => '#' + n.toString(16).padStart(6, '0');

class Inicio extends Phaser.Scene {
  constructor() { super('Inicio'); }
  create() {
    this.cameras.main.setBackgroundColor(0x1d1838);
    texturasBase(this);
    // La fuente y los dibujos cargan a la vez; los textos se crean recién después (si no, Phaser usa otra fuente).
    const fuente = Promise.all(['600 20px Nunito', '800 20px Nunito', '900 20px Nunito'].map(f => document.fonts.load(f))).catch(() => {});
    Promise.all([fuente, cargarArte(this)]).then(() => this.scene.start('Titulo'));
  }
}

class Titulo extends Phaser.Scene {
  constructor() { super('Titulo'); }
  create() {
    fondo(this, 0xf6f2ff, 0xd8cbfb);
    for (let i = 0; i < 22; i++) {
      const b = BASES[i % 4];
      const t = this.add.text(Phaser.Math.Between(0, ANCHO), Phaser.Math.Between(0, ALTO - 120), b, estilo(Phaser.Math.Between(30, 52), hex(COLOR_BASE[b]), { fontStyle: '900' })).setAlpha(0.22);
      this.tweens.add({ targets: t, y: t.y - 60, angle: Phaser.Math.Between(-20, 20), duration: 3000 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
    this.helice = this.add.graphics();
    this.add.particles(0, 0, 'estrella', {
      x: { min: 300, max: 980 }, y: { min: 50, max: 180 }, lifespan: 1400, scale: { start: 0.5, end: 0 },
      alpha: { start: 0.9, end: 0 }, rotate: { min: 0, max: 180 }, tint: [0xf2c94c, 0xffffff, 0xa495e0], frequency: 260,
    }).setDepth(2);

    // Título letra por letra: caen con rebote y después ondulan.
    const titulo = 'MENSAJERO', tam = 104;
    const medidas = [...titulo].map(l => this.add.text(0, 0, l, estilo(tam, '#6c5ce7', { fontStyle: '900' })));
    const total = medidas.reduce((s, t) => s + t.width, 0);
    let x = ANCHO / 2 - total / 2;
    medidas.forEach((t, i) => {
      t.setOrigin(0, 0.5).setPosition(x, -100).setShadow(0, 7, '#c9bbf7', 0, false, true).setDepth(3);
      x += t.width;
      this.tweens.add({ targets: t, y: 112, duration: 700, delay: 120 + i * 70, ease: 'Bounce.out' });
      this.tweens.add({ targets: t, y: 100, duration: 900, delay: 1200 + i * 110, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    });
    const sub = this.add.text(ANCHO / 2, 190, 'Un RPG del ADN a la proteína', estilo(30, '#4a4a68', { fontStyle: '700' })).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: sub, alpha: 1, duration: 600, delay: 900 });
    this.add.ellipse(ANCHO / 2, 318, 190, 24, 0x6c5ce7, 0.15);
    const yo = this.add.image(ANCHO / 2, 262, 'arnm-2');
    aparecer(this, yo, 1.6 * ESCALA, 700);
    this.tweens.add({ targets: yo, y: 250, angle: { from: -4, to: 4 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    parpadeo(this, () => [yo]);
    this.add.text(ANCHO / 2, ALTO - 6, 'Con la secuencia real del gen humano del interferón beta (IFNB1)', estilo(16, '#7a6fb0')).setOrigin(0.5, 1).setDepth(1);
    const son = boton(this, 120, 50, 200, 50, `Sonido: ${sonidoActivo() ? 'sí' : 'no'}`, () => {
      son.texto.setText(`Sonido: ${alternarSonido() ? 'sí' : 'no'}`);
      sonido('clic');
    }, GRIS, 18);

    const hay = hayPartida();
    let seguro = !hay;
    const nueva = boton(this, ANCHO / 2, 400, 380, 62, 'Nueva partida', () => {
      if (!seguro) { seguro = true; return nueva.texto.setText('¿Borrar la partida guardada? Tocá otra vez'); }
      empezar();
      this.scene.start('Mundo');
    }, VIOLETA, hay ? 20 : 26);
    const botones = [nueva];
    if (hay) botones.push(boton(this, ANCHO / 2, 474, 380, 62, 'Continuar', () => { cargar(); this.scene.start('Mundo'); }, VERDE, 26));
    botones.push(boton(this, ANCHO / 2, hay ? 548 : 474, 380, 62, 'Modo práctica', () => this.scene.start('Practica'), 0xf2994a, 26));
    botones.forEach((b, i) => aparecer(this, b, 1, 900 + i * 120));
    if (this.scale.fullscreen.available) boton(this, ANCHO - 130, 50, 220, 50, 'Pantalla completa', () => this.scale.toggleFullscreen(), GRIS, 18);
  }

  // Doble hélice que gira, abajo de todo.
  update(t) {
    const g = this.helice.clear(), y = ALTO - 80, fase = t / 600, colores = Object.values(COLOR_BASE);
    for (let x = -10, k = 0; x <= ANCHO + 10; x += 26, k++) {
      const dy = 30 * Math.sin(x / 45 + fase);
      g.lineStyle(6, colores[k % 4], 0.55).lineBetween(x, y - dy, x, y + dy);
    }
    for (const [color, s] of [[0x2f80ed, 1], [0xf2994a, -1]]) {
      g.lineStyle(9, color, 0.75).beginPath();
      for (let x = -10; x <= ANCHO + 10; x += 8) g.lineTo(x, y + s * 30 * Math.sin(x / 45 + fase));
      g.strokePath();
    }
  }
}

// Escenas de historia: imagen + texto, se avanza tocando.
class Historia extends Phaser.Scene {
  constructor() { super('Historia'); }
  init(d) { this.d = d; this.i = 0; }
  create() {
    fondo(this, 0x2e2560, 0x14122b);
    for (let i = 0; i < 50; i++) {
      const e = this.add.circle(Phaser.Math.Between(0, ANCHO), Phaser.Math.Between(0, ALTO), Phaser.Math.Between(1, 3), 0xffffff, 0.3);
      this.tweens.add({ targets: e, alpha: 0.05, duration: Phaser.Math.Between(700, 2000), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 1500) });
    }
    this.add.particles(0, 0, 'punto', {
      x: { min: 0, max: ANCHO }, y: ALTO + 10, lifespan: 9000, speedY: { min: -60, max: -20 }, speedX: { min: -10, max: 10 },
      scale: { min: 0.15, max: 0.5 }, alpha: { values: [0, 0.6, 0], interpolation: 'linear' }, tint: Object.values(COLOR_BASE), frequency: 160, advance: 9000,
    });
    this.halo = this.add.image(ANCHO / 2, 250, 'halo').setTint(0x8e7cf0).setScale(6).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: this.halo, scale: 6.8, alpha: 0.6, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.img = this.add.image(ANCHO / 2, 250, 'virus');
    this.tweens.add({ targets: this.img, y: 238, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    parpadeo(this, () => [this.img]);
    this.texto = this.add.text(ANCHO / 2, 470, '', estilo(32, '#ffffff', { fontStyle: '700', align: 'center', wordWrap: { width: 1000 }, lineSpacing: 8 })).setOrigin(0.5, 0);
    this.add.text(ANCHO - 30, ALTO - 30, 'Tocá para seguir ▶', estilo(20, '#a99ff0')).setOrigin(1);
    const seguir = () => { if (++this.i < this.d.paginas.length) this.mostrar(); else { const fin = this.d.fin; this.scene.stop(); fin(); } };
    this.input.on('pointerdown', seguir);
    this.input.keyboard.on('keydown-SPACE', seguir);
    this.input.keyboard.on('keydown-ENTER', seguir);
    this.mostrar();
  }
  mostrar() {
    const [img, texto] = this.d.paginas[this.i];
    this.img.setVisible(!!img);
    this.halo.setVisible(!!img);
    if (img) {
      this.img.setTexture(img);
      aparecer(this, this.img, 2 * ESCALA);
    }
    const y = img ? 470 : 200;
    this.texto.setText(texto).setY(y + 24).setAlpha(0);
    this.tweens.add({ targets: this.texto, y, alpha: 1, duration: 450, delay: 120, ease: 'Cubic.out' });
    sonido('abrir');
  }
}

// La tabla del código genético, con las páginas que el jugador ya encontró.
class Codonario extends Phaser.Scene {
  constructor() { super('Codonario'); }
  create(d) {
    const pags = d.todas ? 'UCAG' : E.paginas;
    sonido('abrir');
    this.cameras.main.setZoom(0.9).setAlpha(0);
    this.tweens.add({ targets: this.cameras.main, zoom: 1, alpha: 1, duration: 240, ease: 'Back.out' });
    this.add.rectangle(ANCHO / 2, ALTO / 2, ANCHO, ALTO, 0x000000, 0.5).setInteractive();
    panel(this, ANCHO / 2, ALTO / 2, 1230, 700);
    this.add.text(60, 28, 'Codonario: el código genético', estilo(28, '#23233a', { fontStyle: 'bold' }));
    boton(this, ANCHO - 120, 50, 180, 52, 'Cerrar', () => this.scene.stop(), VIOLETA, 20);
    const x0 = 150, y0 = 120, w = 265, h = 126;
    [...BASES].forEach((b2, c) => this.add.text(x0 + c * w + w / 2, y0 - 22, `2ª base: ${b2}`, estilo(20, '#555', { fontStyle: 'bold' })).setOrigin(0.5));
    [...BASES].forEach((b1, f) => {
      const y = y0 + f * h;
      this.add.text(95, y + h / 2, b1, estilo(44, '#' + COLOR_BASE[b1].toString(16).padStart(6, '0'), { fontStyle: 'bold' })).setOrigin(0.5);
      const abierta = pags.includes(b1);
      this.add.rectangle(x0, y + 3, 4 * w - 6, h - 6, abierta ? 0xf7f5ff : 0xe6e6ea).setOrigin(0);
      if (!abierta) return this.add.text(x0 + 2 * w, y + h / 2, `Página ${b1}: todavía no la encontraste`, estilo(22, '#9aa0b4')).setOrigin(0.5);
      [...BASES].forEach((b2, c) => [...BASES].forEach((b3, k) => {
        const cod = b1 + b2 + b3, a = traducir(cod);
        const color = a === '*' ? '#c0392b' : cod === 'AUG' ? '#1e8449' : '#23233a';
        const peso = a === '*' || cod === 'AUG' ? '900' : '600';
        const fy = y + 12 + k * 27;
        [...cod].forEach((b, j) => this.add.text(x0 + c * w + 18 + j * 17, fy, b, estilo(20, hex(COLOR_BASE[b]), { fontStyle: '900' })));
        this.add.text(x0 + c * w + 82, fy, `${a === '*' ? 'Stop' : NOMBRE[a][0]}${cod === 'AUG' ? ' (inicio)' : ''}`, estilo(20, color, { fontStyle: peso }));
      }));
    });
    this.add.text(ANCHO / 2, ALTO - 18, 'Se lee: 1ª base (fila) · 2ª base (columna) · 3ª base (renglón dentro del cuadro)', estilo(17, '#555')).setOrigin(0.5, 1);
  }
}

class Practica extends Phaser.Scene {
  constructor() { super('Practica'); }
  create() {
    fondo(this, 0xf6f2ff, 0xd8cbfb);
    this.add.text(ANCHO / 2, 70, 'Modo práctica', estilo(60, '#6c5ce7', { fontStyle: '900' })).setOrigin(0.5).setShadow(0, 5, '#c9bbf7', 0, false, true);
    this.add.text(ANCHO / 2, 130, 'Elegí un tema. Los tramos de ADN son del gen real del interferón beta.', estilo(22, '#4a4a68')).setOrigin(0.5);
    const temas = [
      ['Transcribir ADN → ARNm', () => R.transcribir(9)],
      ['Codón → aminoácido', () => R.codon()],
      ['Codón → anticodón (ARNt)', () => R.anticodonReto()],
      ['Tipos de mutación', () => R.mutacion()],
      ['Preguntas', () => R.pregunta()],
    ];
    temas.forEach(([nombre, gen], i) => boton(this, ANCHO / 2, 220 + i * 80, 480, 64, nombre, () => this.jugar(gen), VIOLETA, 24));
    boton(this, ANCHO / 2, 640, 240, 56, 'Volver', () => this.scene.start('Titulo'), GRIS, 22);
  }
  jugar(gen) {
    let bien = 0, total = 0, actual;
    const marcador = this.add.text(30, ALTO - 4, '', estilo(20, '#23233a', { fontStyle: 'bold' })).setOrigin(0, 1).setDepth(3100);
    const salir = boton(this, ANCHO - 110, ALTO - 20, 180, 36, 'Salir', () => { actual?.destroy(); marcador.destroy(); salir.destroy(); }, GRIS, 18).setDepth(3100);
    const otro = () => {
      marcador.setText(`Aciertos: ${bien} de ${total}`);
      actual = crearReto(this, gen(), ok => { total++; bien += ok; otro(); });
    };
    otro();
  }
}

// window.juego: acceso para depurar desde la consola del navegador.
window.juego = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'juego',
  width: ANCHO,
  height: ALTO,
  backgroundColor: '#efe9fb',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: 'arcade' },
  input: { activePointers: 3 },
  scene: [Inicio, Titulo, Mundo, Batalla, Traduccion, Historia, Codonario, Practica],
});
