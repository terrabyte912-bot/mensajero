// Combate por turnos: cada acción es un desafío de biología.
import { E, guardar } from './estado.js';
import { PREGUNTAS, COLOR_BASE } from './data.js';
import * as R from './retos.js';
import { ANCHO, ALTO, estilo, boton, panel, fondo, crearReto, abrirCodonario, VIOLETA, VERDE } from './ui.js';
import { ESCALA } from './arte.js';
import { chispas, numero, parpadeo, sonido } from './fx.js';

const RIVALES = {
  practica: { nombre: 'Práctica con la polimerasa', img: 'polimerasa', vida: 3, fondo: 0xefe9fb, contador: 'Tramos que faltan' },
  guardian: { nombre: 'Complejo del poro', img: 'guardian', vida: 3, fondo: 0xe3eaf6, contador: 'Preguntas que faltan' },
  arnasa: { nombre: 'ARNasa', img: 'arnasa', vida: 60, fondo: 0xe4f5ef },
  virus: { nombre: 'Virus', img: 'virus', vida: 140, fondo: 0xf6e4ef },
};
const RX = 920, RY = 245, YX = 330, YY = 420; // posiciones del rival y del jugador

export class Batalla extends Phaser.Scene {
  constructor() { super('Batalla'); }
  init(d) { this.d = d; }

  create() {
    const r = (this.r = RIVALES[this.d.tipo]);
    this.vida = r.vida;
    this.escudo = 0;
    this.preguntas = R.mezclar(PREGUNTAS.map((_, i) => i));
    this.cameras.main.fadeIn(250);
    const tono = Phaser.Display.Color.ValueToColor(r.fondo);
    fondo(this, tono.clone().lighten(5).color, tono.clone().darken(12).color);
    this.add.particles(0, 0, 'punto', {
      x: { min: 0, max: ANCHO }, y: { min: 0, max: ALTO }, lifespan: 7000, speedY: { min: -20, max: -5 }, speedX: { min: -8, max: 8 },
      scale: { min: 0.15, max: 0.5 }, alpha: { values: [0, 0.5, 0], interpolation: 'linear' }, frequency: 120, advance: 7000,
      tint: [0xffffff, tono.clone().darken(25).color],
    });
    this.add.ellipse(ANCHO / 2, 560, 1600, 300, 0xffffff, 0.35);
    this.add.image(RX, RY, 'halo').setScale(6).setAlpha(0.5);
    this.add.image(YX, YY, 'halo').setScale(5).setAlpha(0.4);

    this.add.ellipse(RX, 330, 320, 60, 0x000000, 0.08);
    const escRival = ESCALA * (this.d.tipo === 'virus' ? 1.9 : 1.6);
    this.rival = this.add.image(1500, RY, r.img).setScale(escRival);
    this.add.ellipse(YX, 482, 320, 60, 0x000000, 0.08);
    this.yo = this.add.image(-250, YY, `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`).setScale(ESCALA * 1.7);
    this.burbuja = this.add.circle(YX, YY, 105).setStrokeStyle(6, 0x56ccf2, 0.9).setFillStyle(0x56ccf2, 0.12).setVisible(false);
    this.tweens.add({ targets: this.burbuja, scale: 1.06, alpha: 0.7, duration: 600, yoyo: true, repeat: -1 });

    // Entrada: cada uno llega desde su lado; después quedan "respirando".
    this.tweens.add({
      targets: this.rival, x: RX, duration: 650, ease: 'Back.out', onComplete: () =>
        this.tweens.add({ targets: this.rival, y: RY - 10, scaleY: escRival * 1.03, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
    });
    this.tweens.add({
      targets: this.yo, x: YX, duration: 650, delay: 150, ease: 'Back.out', onComplete: () =>
        this.tweens.add({ targets: this.yo, y: YY - 6, scaleY: ESCALA * 1.75, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' }),
    });
    if (this.d.tipo === 'virus') this.add.particles(0, 0, 'punto', {
      speed: { min: 20, max: 80 }, lifespan: 1200, scale: { start: 0.6, end: 0 }, alpha: { start: 0.7, end: 0 },
      tint: [0xe84393, 0xb83280, 0xff8fc7], frequency: 50,
    }).startFollow(this.rival);
    parpadeo(this, () => [this.rival, this.yo]);

    const info = this.add.container(0, -160);
    info.add([panel(this, 330, 110, 460, 100), this.add.text(120, 72, r.nombre, estilo(24, '#23233a', { fontStyle: '800' }))]);
    if (r.contador) info.add(this.barraRival = this.add.text(120, 110, '', estilo(20, '#555')));
    else info.add([this.add.rectangle(120, 122, 400, 18, 0xdddddd).setOrigin(0, 0.5), this.barraRival = this.add.rectangle(120, 122, 400, 18, 0xeb5757).setOrigin(0, 0.5)]);
    this.tweens.add({ targets: info, y: 0, duration: 500, delay: 300, ease: 'Back.out' });

    const mia = this.add.container(500, 0);
    mia.add([panel(this, 930, 440, 460, 100), this.add.text(720, 402, 'Vos (ARNm)', estilo(24, '#23233a', { fontStyle: '800' })),
      this.add.text(720, 442, 'Cola poli-A', estilo(16, '#555')), this.add.rectangle(830, 451, 300, 18, 0xdddddd).setOrigin(0, 0.5),
      this.barraYo = this.add.rectangle(830, 451, 300, 18, 0x3dbe6b).setOrigin(0, 0.5),
      this.textoEscudo = this.add.text(720, 466, '', estilo(16, '#2d9cdb', { fontStyle: '800' }))]);
    this.tweens.add({ targets: mia, x: 0, duration: 500, delay: 400, ease: 'Back.out' });

    panel(this, ANCHO / 2, 630, 1240, 160);
    this.texto = this.add.text(40, 568, '', estilo(24, '#23233a', { wordWrap: { width: 620 }, lineSpacing: 4 }));
    this.menu = this.add.container(0, 0);
    this.actualizar(true);

    this.esperar = null;
    const seguir = () => { if (this.esperar) { const f = this.esperar; this.esperar = null; f(); } };
    this.input.on('pointerdown', seguir);
    this.input.keyboard.on('keydown-SPACE', seguir);
    this.input.keyboard.on('keydown-ENTER', seguir);

    const intro = {
      practica: 'La polimerasa te va a dar tres tramos del gen para transcribir.',
      guardian: 'El complejo del poro te va a hacer tres preguntas.',
      arnasa: 'La ARNasa se acerca a tu cola poli-A.',
      virus: '¡El virus no quiere soltar el ribosoma!',
    }[this.d.tipo];
    sonido('abrir');
    this.time.delayedCall(700, () => this.msj(intro, () => this.turno()));
  }

  // Muestra un mensaje; al tocar sigue con `luego`.
  msj(texto, luego) {
    this.texto.setText(texto + (luego ? '  ▶' : '')).setAlpha(0);
    this.tweens.add({ targets: this.texto, alpha: 1, duration: 200 });
    this.esperar = luego ?? null;
  }

  actualizar(inmediato) {
    const anima = (barra, ancho) => (inmediato ? (barra.width = ancho) : this.tweens.add({ targets: barra, width: ancho, duration: 450, ease: 'Cubic.out' }));
    if (this.r.contador) this.barraRival.setText(`${this.r.contador}: ${this.vida}`);
    else anima(this.barraRival, 400 * Math.max(0, this.vida) / this.r.vida);
    anima(this.barraYo, 3 * Math.max(0, E.cola));
    this.barraYo.fillColor = E.cola > 30 ? 0x3dbe6b : 0xeb5757;
    this.textoEscudo.setText(this.escudo ? `Protegida por PABP (${this.escudo})` : '');
    this.burbuja.setVisible(this.escudo > 0);
  }

  turno() {
    if (this.d.tipo === 'practica') return this.reto(R.transcribir(6), ok => this.golpe(ok ? 1 : 0, ok ? '¡Tramo correcto!' : 'Ese tramo tuvo errores. Probemos con otro.'));
    if (this.d.tipo === 'guardian') {
      if (!this.preguntas.length) this.preguntas = R.mezclar(PREGUNTAS.map((_, i) => i));
      return this.reto(R.pregunta(this.preguntas.pop()), ok => this.golpe(ok ? 1 : 0, ok ? 'El guardián asiente.' : 'El guardián no está convencido todavía.'));
    }
    this.texto.setText('¿Qué hacés?');
    const acciones = [
      ['Leer codón', VIOLETA, () => this.reto(R.codon(E.paginas), ok => this.golpe(ok ? 30 : 0, ok ? '¡Bien leído! ' + this.efecto() : 'Fallaste la lectura.'))],
      [`Llamar ARNt (${E.arnt.length})`, VERDE, E.arnt.length && (() => this.reto(R.anticodonReto(E.paginas), ok => this.golpe(ok ? 45 : 0, ok ? '¡Llegó el ARNt correcto: golpe fuerte! ' + this.efecto() : 'Ese ARNt no se aparea con el codón.', 'arnt-gen')))],
      [`Usar PABP (${E.pabp})`, 0x2d9cdb, E.pabp > 0 && (() => {
        E.pabp--; this.escudo = 2; this.actualizar();
        sonido('escudo');
        chispas(this, YX, YY, [0x56ccf2, 0xffffff], 30, { textura: 'estrella', gravedad: 0 });
        this.msj('Una PABP se pega a tu cola poli-A: te protege de los próximos dos ataques.', () => this.turnoRival());
      })],
      ['Codonario', 0xf2994a, () => abrirCodonario(this)],
    ];
    this.menu.removeAll(true);
    acciones.forEach(([etiqueta, color, f], i) => {
      const b = boton(this, 800 + (i % 2) * 290, 595 + Math.floor(i / 2) * 72, 270, 60, etiqueta, () => { if (f) { if (i < 3) this.menu.removeAll(true); f(); } }, f ? color : 0xc8c8d0, 21);
      b.setScale(0.6).setAlpha(0);
      this.tweens.add({ targets: b, scale: 1, alpha: 1, duration: 260, delay: i * 50, ease: 'Back.out' });
      this.menu.add(b);
    });
  }

  efecto() { return this.d.tipo === 'virus' ? 'El virus pierde el control del ribosoma.' : 'La ARNasa retrocede.'; }

  reto(r, fin) { crearReto(this, r, fin); }

  // Animación de tu ataque: un proyectil vuela hasta el rival.
  lanzar(textura, alLlegar) {
    this.tweens.add({ targets: this.yo, x: YX + 70, duration: 130, yoyo: true, ease: 'Quad.out' });
    const p = textura === 'arnt-gen'
      ? this.add.image(YX + 60, YY - 20, textura).setScale(ESCALA * 0.9)
      : this.add.image(YX + 60, YY - 20, 'halo').setTint(0x6c5ce7).setScale(1.6).setBlendMode(Phaser.BlendModes.ADD);
    const estela = this.add.particles(0, 0, 'punto', {
      speed: 20, lifespan: 380, scale: { start: 0.5, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: Object.values(COLOR_BASE), frequency: 18,
    }).startFollow(p);
    this.tweens.add({ targets: p, x: RX - 20, duration: 420, ease: 'Quad.in', delay: 100 });
    this.tweens.add({
      targets: p, y: RY - 120, duration: 210, delay: 100, ease: 'Sine.out', yoyo: true,
      onComplete: () => { p.destroy(); estela.stop(); this.time.delayedCall(400, () => estela.destroy()); alLlegar(); },
    });
    if (textura === 'arnt-gen') this.tweens.add({ targets: p, angle: 360, duration: 420, delay: 100 });
  }

  impactoRival(texto, colores = [0xeb5757, 0xf2c94c, 0xffffff]) {
    sonido('golpe');
    this.rival.setTintFill(0xffffff);
    this.time.delayedCall(90, () => this.rival.clearTint());
    this.tweens.add({ targets: this.rival, x: RX + 18, duration: 50, yoyo: true, repeat: 3, onComplete: () => this.rival.setX(RX) });
    chispas(this, RX, RY, colores, 30, { textura: 'estrella', velocidad: 340 });
    numero(this, RX + 40, RY - 90, texto, '#eb5757', 40);
    this.cameras.main.shake(120, 0.005);
  }

  golpe(danio, texto, proyectil = 'orbe') {
    const seguir = () => {
      this.actualizar();
      guardar();
      this.msj(texto, () => (this.vida <= 0 ? this.ganar() : this.turnoRival()));
    };
    if (!danio) {
      chispas(this, YX + 40, YY - 40, [0x9aa0b4, 0xffffff], 14, { gravedad: -60, velocidad: 120 });
      return seguir();
    }
    this.vida -= danio;
    if (this.r.contador) {
      sonido('bien');
      chispas(this, RX, RY - 60, [0x3dbe6b, 0xffffff, 0xf2c94c], 26, { textura: 'estrella', gravedad: 0 });
      numero(this, RX, RY - 110, '¡Bien!', '#1e8449', 36);
      this.tweens.add({ targets: this.rival, angle: { from: -8, to: 8 }, duration: 90, yoyo: true, repeat: 3, onComplete: () => this.rival.setAngle(0) });
      return seguir();
    }
    this.lanzar(proyectil, () => { this.impactoRival(`-${danio}`); seguir(); });
  }

  turnoRival() {
    const t = this.d.tipo;
    if (t === 'practica' || t === 'guardian') return this.turno();
    if (t === 'virus' && Math.random() < 0.5) {
      // El virus "muta": parpadea de colores antes del desafío.
      this.tweens.addCounter({
        from: 0, to: 8, duration: 700,
        onUpdate: tw => this.rival.setTint([0xffffff, 0x9b59b6, 0x3dbe6b, 0xf2c94c][Math.floor(tw.getValue()) % 4]),
        onComplete: () => this.rival.clearTint(),
      });
      chispas(this, RX, RY, [0x9b59b6, 0x3dbe6b, 0xf2c94c], 24, { gravedad: 0, velocidad: 200 });
      sonido('abrir');
      return this.msj('¡El virus mutó! Si identificás la mutación, anticipás su ataque.', () =>
        this.reto(R.mutacion(), ok => (ok ? this.esquivar() : this.ataque(18, 'El virus te tomó por sorpresa.'))));
    }
    this.ataque(t === 'virus' ? 15 : 12, t === 'virus' ? 'El virus acapara ribosomas y perdés tiempo.' : 'La ARNasa recorta tu cola poli-A.');
  }

  esquivar() {
    this.tweens.add({ targets: this.rival, x: RX - 120, duration: 200, yoyo: true, ease: 'Quad.in' });
    this.tweens.add({ targets: this.yo, y: YY - 90, duration: 220, yoyo: true, ease: 'Quad.out' });
    numero(this, YX, YY - 120, '¡Esquivado!', '#2d9cdb', 32);
    sonido('bien');
    this.msj('¡Lo anticipaste! El ataque del virus falla.', () => this.turno());
  }

  ataque(n, texto) {
    // El rival se lanza hacia vos.
    this.tweens.add({
      targets: this.rival, x: RX - 160, y: RY + 60, duration: 220, yoyo: true, ease: 'Quad.in', onYoyo: () => {
        if (this.escudo) {
          this.escudo--;
          sonido('escudo');
          chispas(this, YX + 60, YY - 20, [0x56ccf2, 0xffffff], 24, { textura: 'estrella', gravedad: 0 });
          numero(this, YX, YY - 120, '¡Bloqueado!', '#2d9cdb', 32);
          this.actualizar();
          return this.msj(`${texto} ¡Pero la PABP protege tu cola!`, () => this.turno());
        }
        E.cola = Math.max(0, E.cola - n);
        sonido('herida');
        this.cameras.main.shake(200, 0.008);
        this.yo.setTint(0xff7b7b);
        this.time.delayedCall(250, () => this.yo.clearTint());
        chispas(this, YX - 60, YY + 10, [0x3dbe6b, 0xffffff], 18, { velocidad: 220 });
        numero(this, YX - 40, YY - 110, `-${n} A`, '#eb5757', 36);
        this.actualizar();
        guardar();
        this.msj(`${texto} Perdés ${n} A de tu cola.`, () => (E.cola <= 0 ? this.perder() : this.turno()));
      },
    });
  }

  ganar() {
    sonido('victoria');
    this.tweens.killTweensOf(this.rival);
    this.tweens.add({ targets: this.rival, scale: 0, angle: 200, alpha: 0, duration: 650, ease: 'Back.in' });
    this.time.delayedCall(450, () => chispas(this, RX, RY, [0x6c5ce7, 0x3dbe6b, 0xf2c94c, 0x2f80ed, 0xeb5757], 60, { textura: 'estrella', velocidad: 480, escala: 0.9 }));
    const cartel = this.add.text(ANCHO / 2, 250, '¡Ganaste!', estilo(80, '#6c5ce7', { fontStyle: '900', stroke: '#ffffff', strokeThickness: 10 })).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: cartel, scale: 1, duration: 500, delay: 500, ease: 'Back.out' });
    const texto = { practica: '¡Práctica completa!', guardian: '¡Respondiste todo!', arnasa: '¡La ARNasa se aleja!', virus: '¡El virus soltó el ribosoma!' }[this.d.tipo];
    this.msj(texto, () => this.terminar(true));
  }

  perder() {
    this.tweens.killTweensOf(this.yo);
    this.tweens.add({ targets: this.yo, scaleY: 0.1, alpha: 0, duration: 700, ease: 'Quad.in' });
    this.msj('Tu cola poli-A se terminó...', () => this.terminar(false));
  }

  terminar(gano) {
    const fin = this.d.fin;
    this.scene.stop();
    fin(gano);
  }
}
