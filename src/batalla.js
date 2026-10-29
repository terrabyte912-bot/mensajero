// Combate por turnos: cada acción es un desafío de biología.
import { E, guardar } from './estado.js';
import { PREGUNTAS } from './data.js';
import * as R from './retos.js';
import { ANCHO, ALTO, estilo, boton, panel, crearReto, abrirCodonario, VIOLETA, VERDE } from './ui.js';

const RIVALES = {
  practica: { nombre: 'Práctica con la polimerasa', img: 'polimerasa', vida: 3, fondo: 0xefe9fb, contador: 'Tramos que faltan' },
  guardian: { nombre: 'Complejo del poro', img: 'guardian', vida: 3, fondo: 0xe3eaf6, contador: 'Preguntas que faltan' },
  arnasa: { nombre: 'ARNasa', img: 'arnasa', vida: 60, fondo: 0xe4f5ef },
  virus: { nombre: 'Virus', img: 'virus', vida: 140, fondo: 0xf6e4ef },
};

export class Batalla extends Phaser.Scene {
  constructor() { super('Batalla'); }
  init(d) { this.d = d; }

  create() {
    const r = (this.r = RIVALES[this.d.tipo]);
    this.vida = r.vida;
    this.escudo = 0;
    this.preguntas = R.mezclar(PREGUNTAS.map((_, i) => i));
    this.cameras.main.setBackgroundColor(r.fondo).fadeIn(200);

    this.add.ellipse(920, 330, 320, 60, 0x000000, 0.08);
    this.rival = this.add.image(920, 250, r.img).setScale(this.d.tipo === 'virus' ? 1.9 : 1.6);
    this.tweens.add({ targets: this.rival, y: 240, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.add.ellipse(330, 480, 320, 60, 0x000000, 0.08);
    this.yo = this.add.image(330, 420, `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`).setScale(1.7);

    panel(this, 330, 110, 460, 100);
    this.add.text(120, 72, r.nombre, estilo(24, '#23233a', { fontStyle: 'bold' }));
    if (r.contador) this.barraRival = this.add.text(120, 110, '', estilo(20, '#555'));
    else {
      this.add.rectangle(120, 122, 400, 18, 0xdddddd).setOrigin(0, 0.5);
      this.barraRival = this.add.rectangle(120, 122, 400, 18, 0xeb5757).setOrigin(0, 0.5);
    }
    panel(this, 930, 440, 460, 100);
    this.add.text(720, 402, 'Vos (ARNm)', estilo(24, '#23233a', { fontStyle: 'bold' }));
    this.add.text(720, 442, 'Cola poli-A', estilo(16, '#555'));
    this.add.rectangle(830, 451, 300, 18, 0xdddddd).setOrigin(0, 0.5);
    this.barraYo = this.add.rectangle(830, 451, 300, 18, 0x3dbe6b).setOrigin(0, 0.5);
    this.textoEscudo = this.add.text(720, 466, '', estilo(16, '#2d9cdb'));

    panel(this, ANCHO / 2, 630, 1240, 160);
    this.texto = this.add.text(40, 568, '', estilo(24, '#23233a', { wordWrap: { width: 620 }, lineSpacing: 4 }));
    this.menu = this.add.container(0, 0);
    this.actualizar();

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
    this.msj(intro, () => this.turno());
  }

  // Muestra un mensaje; al tocar sigue con `luego`.
  msj(texto, luego) {
    this.texto.setText(texto + (luego ? '  ▶' : ''));
    this.esperar = luego ?? null;
  }

  actualizar() {
    if (this.r.contador) this.barraRival.setText(`${this.r.contador}: ${this.vida}`);
    else this.barraRival.width = 400 * Math.max(0, this.vida) / this.r.vida;
    this.barraYo.width = 3 * Math.max(0, E.cola);
    this.barraYo.fillColor = E.cola > 30 ? 0x3dbe6b : 0xeb5757;
    this.textoEscudo.setText(this.escudo ? `Protegida por PABP (${this.escudo})` : '');
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
      [`Llamar ARNt (${E.arnt.length})`, VERDE, E.arnt.length && (() => this.reto(R.anticodonReto(E.paginas), ok => this.golpe(ok ? 45 : 0, ok ? '¡Llegó el ARNt correcto: golpe fuerte! ' + this.efecto() : 'Ese ARNt no se aparea con el codón.')))],
      [`Usar PABP (${E.pabp})`, 0x2d9cdb, E.pabp > 0 && (() => { E.pabp--; this.escudo = 2; this.actualizar(); this.msj('Una PABP se pega a tu cola poli-A: te protege de los próximos dos ataques.', () => this.turnoRival()); })],
      ['Codonario', 0xf2994a, () => abrirCodonario(this)],
    ];
    this.menu.removeAll(true);
    acciones.forEach(([etiqueta, color, f], i) => {
      const b = boton(this, 800 + (i % 2) * 290, 595 + Math.floor(i / 2) * 72, 270, 60, etiqueta, () => { if (f) { if (i < 3) this.menu.removeAll(true); f(); } }, f ? color : 0xc8c8d0, 21);
      this.menu.add(b);
    });
  }

  efecto() { return this.d.tipo === 'virus' ? 'El virus pierde el control del ribosoma.' : 'La ARNasa retrocede.'; }

  reto(r, fin) { crearReto(this, r, fin); }

  golpe(danio, texto) {
    if (danio) {
      this.vida -= danio;
      this.tweens.add({ targets: this.rival, x: 940, duration: 60, yoyo: true, repeat: 3 });
      this.rival.setTint(0xff9999);
      this.time.delayedCall(300, () => this.rival.clearTint());
    }
    this.actualizar();
    guardar();
    this.msj(texto, () => (this.vida <= 0 ? this.ganar() : this.turnoRival()));
  }

  turnoRival() {
    const t = this.d.tipo;
    if (t === 'practica' || t === 'guardian') return this.turno();
    if (t === 'virus' && Math.random() < 0.5) {
      return this.msj('¡El virus mutó! Si identificás la mutación, anticipás su ataque.', () =>
        this.reto(R.mutacion(), ok => (ok ? this.msj('¡Lo anticipaste! El ataque del virus falla.', () => this.turno()) : this.ataque(18, 'El virus te tomó por sorpresa.'))));
    }
    this.ataque(t === 'virus' ? 15 : 12, t === 'virus' ? 'El virus acapara ribosomas y perdés tiempo.' : 'La ARNasa recorta tu cola poli-A.');
  }

  ataque(n, texto) {
    if (this.escudo) {
      this.escudo--;
      this.actualizar();
      return this.msj(`${texto} ¡Pero la PABP protege tu cola!`, () => this.turno());
    }
    E.cola = Math.max(0, E.cola - n);
    this.cameras.main.shake(150, 0.006);
    this.actualizar();
    guardar();
    this.msj(`${texto} Perdés ${n} A de tu cola.`, () => (E.cola <= 0 ? this.terminar(false) : this.turno()));
  }

  ganar() {
    this.tweens.add({ targets: this.rival, alpha: 0, scale: 0.5, duration: 500 });
    const texto = { practica: '¡Práctica completa!', guardian: '¡Respondiste todo!', arnasa: '¡La ARNasa se aleja!', virus: '¡El virus soltó el ribosoma!' }[this.d.tipo];
    this.msj(texto, () => this.terminar(true));
  }

  terminar(gano) {
    const fin = this.d.fin;
    this.scene.stop();
    fin(gano);
  }
}
