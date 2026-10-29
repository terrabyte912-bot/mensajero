import { E, cargar, empezar, hayPartida } from './estado.js';
import { cargarArte } from './arte.js';
import { BASES, traducir, NOMBRE, COLOR_BASE } from './data.js';
import * as R from './retos.js';
import { ANCHO, ALTO, estilo, boton, panel, crearReto, VIOLETA, VERDE, GRIS } from './ui.js';
import { Mundo } from './mundo.js';
import { Batalla } from './batalla.js';
import { Traduccion } from './traduccion.js';

class Inicio extends Phaser.Scene {
  constructor() { super('Inicio'); }
  preload() {
    this.add.text(ANCHO / 2, ALTO / 2, 'Cargando...', estilo(28)).setOrigin(0.5);
    cargarArte(this);
  }
  create() { this.scene.start('Titulo'); }
}

class Titulo extends Phaser.Scene {
  constructor() { super('Titulo'); }
  create() {
    this.cameras.main.setBackgroundColor(0xefe9fb);
    for (let i = 0; i < 24; i++) {
      const b = BASES[i % 4];
      const t = this.add.text(Phaser.Math.Between(0, ANCHO), Phaser.Math.Between(0, ALTO), b, estilo(40, '#' + COLOR_BASE[b].toString(16).padStart(6, '0'), { fontStyle: 'bold' })).setAlpha(0.25);
      this.tweens.add({ targets: t, y: t.y - 60, duration: 3000 + i * 120, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    }
    this.add.text(ANCHO / 2, 120, 'MENSAJERO', estilo(96, '#6c5ce7', { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(ANCHO / 2, 195, 'Un RPG sobre transcripción y traducción', estilo(28, '#4a4a68')).setOrigin(0.5);
    const yo = this.add.image(ANCHO / 2, 300, 'arnm-2').setScale(1.6);
    this.tweens.add({ targets: yo, y: 285, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    const hay = hayPartida();
    let seguro = !hay;
    const nueva = boton(this, ANCHO / 2, 420, 380, 66, 'Nueva partida', () => {
      if (!seguro) { seguro = true; return nueva.texto.setText('¿Borrar la partida guardada? Tocá otra vez'); }
      empezar();
      this.scene.start('Mundo');
    }, VIOLETA, hay ? 20 : 26);
    if (hay) boton(this, ANCHO / 2, 500, 380, 66, 'Continuar', () => { cargar(); this.scene.start('Mundo'); }, VERDE, 26);
    boton(this, ANCHO / 2, hay ? 580 : 500, 380, 66, 'Modo práctica', () => this.scene.start('Practica'), 0xf2994a, 26);
    if (this.scale.fullscreen.available) boton(this, ANCHO - 140, ALTO - 50, 240, 52, 'Pantalla completa', () => this.scale.toggleFullscreen(), GRIS, 18);
  }
}

// Escenas de historia: imagen + texto, se avanza tocando.
class Historia extends Phaser.Scene {
  constructor() { super('Historia'); }
  init(d) { this.d = d; this.i = 0; }
  create() {
    this.cameras.main.setBackgroundColor(0x23233a);
    this.img = this.add.image(ANCHO / 2, 250, 'virus').setScale(2);
    this.texto = this.add.text(ANCHO / 2, 470, '', estilo(30, '#ffffff', { align: 'center', wordWrap: { width: 1000 }, lineSpacing: 8 })).setOrigin(0.5, 0);
    this.add.text(ANCHO - 30, ALTO - 30, 'Tocá para seguir ▶', estilo(20, '#9aa0b4')).setOrigin(1);
    const seguir = () => { if (++this.i < this.d.paginas.length) this.mostrar(); else { const fin = this.d.fin; this.scene.stop(); fin(); } };
    this.input.on('pointerdown', seguir);
    this.input.keyboard.on('keydown-SPACE', seguir);
    this.input.keyboard.on('keydown-ENTER', seguir);
    this.mostrar();
  }
  mostrar() {
    const [img, texto] = this.d.paginas[this.i];
    this.img.setVisible(!!img);
    if (img) this.img.setTexture(img);
    this.texto.setText(texto).setY(img ? 470 : 200);
    this.cameras.main.fadeIn(250);
  }
}

// La tabla del código genético, con las páginas que el jugador ya encontró.
class Codonario extends Phaser.Scene {
  constructor() { super('Codonario'); }
  create(d) {
    const pags = d.todas ? 'UCAG' : E.paginas;
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
        this.add.text(x0 + c * w + 18, y + 12 + k * 27, `${cod}  ${a === '*' ? 'Stop' : NOMBRE[a][0]}${cod === 'AUG' ? ' (inicio)' : ''}`,
          estilo(20, color, { fontFamily: 'ui-monospace, Consolas, monospace', fontStyle: a === '*' || cod === 'AUG' ? 'bold' : 'normal' }));
      }));
    });
    this.add.text(ANCHO / 2, ALTO - 18, 'Se lee: 1ª base (fila) · 2ª base (columna) · 3ª base (renglón dentro del cuadro)', estilo(17, '#555')).setOrigin(0.5, 1);
  }
}

class Practica extends Phaser.Scene {
  constructor() { super('Practica'); }
  create() {
    this.cameras.main.setBackgroundColor(0xefe9fb);
    this.add.text(ANCHO / 2, 70, 'Modo práctica', estilo(56, '#6c5ce7', { fontStyle: 'bold' })).setOrigin(0.5);
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

new Phaser.Game({
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
