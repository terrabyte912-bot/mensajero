// El mundo abierto: mapa de la zona actual, movimiento, diálogos y salidas.
import { E, guardar, darPagina } from './estado.js';
import { ZONAS } from './zonas.js';
import { ANCHO, ALTO, estilo, boton, panel, crearReto, abrirCodonario, VERDE } from './ui.js';

const VELOCIDAD = 270, CERCA = 120;

export class Mundo extends Phaser.Scene {
  constructor() { super('Mundo'); }

  create() {
    const z = (this.z = ZONAS[E.zona]);
    this.ocupado = false;
    this.dialogo = null;
    this.cameras.main.setBackgroundColor(z.fondo).setBounds(0, 0, z.ancho, z.alto);
    if (!this.sinFundido) this.cameras.main.fadeIn(250);
    this.sinFundido = false;
    this.physics.world.setBounds(0, 0, z.ancho, z.alto);
    z.decorar(this, this.add.graphics(), new Phaser.Math.RandomDataGenerator([E.zona]));

    const solidos = this.physics.add.staticGroup();
    const paredes = typeof z.paredes === 'function' ? z.paredes() : z.paredes ?? [];
    for (const [x, y, w, h] of paredes) solidos.add(this.add.zone(x + w / 2, y + h / 2, w, h));
    for (const [x, y, r] of z.circulos ?? []) {
      const c = this.add.zone(x, y, r * 2, r * 2);
      solidos.add(c);
      c.body.setCircle(r);
    }
    for (const [img, x, y] of z.obstaculos ?? []) {
      const o = this.physics.add.staticImage(x, y, img);
      o.body.setSize(o.width * 0.9, o.height * 0.7);
      solidos.add(o);
    }

    const [px, py] = E.pos ?? z.inicio;
    this.yo = this.physics.add.image(px, py, this.texturaYo()).setCollideWorldBounds(true).setDepth(10);
    this.yo.body.setSize(this.yo.width * 0.55, this.yo.height * 0.5);
    if (!E.flags.nacido) this.yo.setAlpha(0);
    this.physics.add.collider(this.yo, solidos);
    this.cameras.main.startFollow(this.yo, true, 0.12, 0.12);

    this.npcs = (z.npcs ?? []).filter(n => !n.visible || n.visible()).map(n => {
      const s = this.add.image(n.x, n.y, n.img).setDepth(5);
      this.physics.add.existing(s, true);
      s.body.setSize(s.width * 0.6, s.height * 0.5);
      this.physics.add.collider(this.yo, s);
      this.tweens.add({ targets: s, y: n.y - 6, duration: 900 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.add.text(n.x, n.y - s.height / 2 - 16, n.nombre, estilo(17, '#4a4a68', { fontStyle: 'bold' })).setOrigin(0.5).setDepth(6);
      s.datos = n;
      return s;
    });

    for (const en of z.enemigos ?? []) {
      if (E.flags[en.id]) continue;
      const s = this.physics.add.image(en.x, en.y, en.img).setDepth(8);
      s.body.setSize(s.width * 0.6, s.height * 0.6);
      s.datos = en;
      if (en.jefe) { s.setScale(1.3); s.body.setImmovable(true); }
      if (en.rango) {
        this.physics.add.collider(s, solidos);
        this.time.addEvent({
          delay: 1500, loop: true, callback: () => {
            if (this.ocupado) return s.setVelocity(0, 0);
            const lejos = Phaser.Math.Distance.Between(s.x, s.y, en.x, en.y) > en.rango;
            const ang = lejos ? Phaser.Math.Angle.Between(s.x, s.y, en.x, en.y) : Math.random() * Math.PI * 2;
            s.setVelocity(Math.cos(ang) * 90, Math.sin(ang) * 90);
          },
        });
      }
      this.physics.add.overlap(this.yo, s, () => this.chocar(s));
    }

    for (const o of z.objetos ?? []) {
      if (E.flags[o.id]) continue;
      const s = this.physics.add.image(o.x, o.y, o.img).setScale(0.6).setDepth(4);
      this.tweens.add({ targets: s, scale: 0.7, duration: 600, yoyo: true, repeat: -1 });
      this.physics.add.overlap(this.yo, s, () => {
        if (this.ocupado || E.flags[o.id]) return;
        E.flags[o.id] = true; guardar();
        s.destroy();
        o.tomar(this);
      });
    }

    this.salidas = z.salidas ?? [];
    for (const s of this.salidas) {
      this.add.rectangle(s.x + s.w / 2, s.y + s.h / 2, s.w, s.h, 0xffffff, 0.35).setDepth(1);
      if (s.etiqueta) this.add.text(s.x - 10, s.y + s.h / 2, s.etiqueta, estilo(22, '#4a4a68', { fontStyle: 'bold' })).setOrigin(1, 0.5).setDepth(2);
    }
    this.ultimo = [px, py];

    this.crearHud();
    this.crearControles();
    if (!this.escuchaWake) {
      this.escuchaWake = true;
      this.events.on('wake', () => { this.input.keyboard.resetKeys(); this.joy.activo = false; });
    }
    z.alEntrar?.(this);
    guardar();
  }

  texturaYo() {
    return E.yo === 'interferon' ? 'interferon' : `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`;
  }

  crearHud() {
    const hud = [];
    const conCola = E.flags.cola && E.yo === 'arnm';
    hud.push(panel(this, 200, conCola ? 70 : 46, 360, conCola ? 112 : 56));
    hud.push(this.add.text(36, 30, this.z.nombre, estilo(22, '#23233a', { fontStyle: 'bold' })));
    if (conCola) {
      hud.push(this.add.text(36, 62, 'Cola poli-A', estilo(16, '#555')));
      hud.push(this.add.rectangle(140, 72, 200, 16, 0xdddddd).setOrigin(0, 0.5));
      hud.push(this.add.rectangle(140, 72, 2 * E.cola, 16, E.cola > 30 ? 0x3dbe6b : 0xeb5757).setOrigin(0, 0.5));
      hud.push(this.add.text(36, 90, `PABP: ${E.pabp}   ARNt: ${E.arnt.length}`, estilo(16, '#555')));
    }
    if (E.paginas) hud.push(boton(this, ANCHO - 290, 44, 180, 52, 'Codonario', () => !this.ocupado && abrirCodonario(this), 0xf2994a, 20));
    hud.push(boton(this, ANCHO - 100, 44, 150, 52, 'Menú', () => { guardar(); this.scene.start('Titulo'); }, 0x9aa0b4, 20));
    hud.forEach(o => o.setScrollFactor(0).setDepth(1000));
  }

  crearControles() {
    this.teclas = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    for (const k of ['SPACE', 'ENTER', 'E']) this.input.keyboard.on(`keydown-${k}`, () => this.accion());

    // Joystick: tocar y arrastrar en cualquier parte de la pantalla.
    this.joy = { activo: false, vx: 0, vy: 0 };
    const base = this.add.circle(0, 0, 70, 0x000000, 0.12).setScrollFactor(0).setDepth(900).setVisible(false);
    const perilla = this.add.circle(0, 0, 32, 0x6c5ce7, 0.6).setScrollFactor(0).setDepth(901).setVisible(false);
    this.input.on('pointerdown', p => {
      if (this.dialogo) return this.avanzar();
      if (this.ocupado) return;
      Object.assign(this.joy, { activo: true, id: p.id, x: p.x, y: p.y, vx: 0, vy: 0 });
      base.setPosition(p.x, p.y).setVisible(true);
      perilla.setPosition(p.x, p.y).setVisible(true);
    });
    this.input.on('pointermove', p => {
      if (!this.joy.activo || p.id !== this.joy.id) return;
      const dx = p.x - this.joy.x, dy = p.y - this.joy.y, d = Math.hypot(dx, dy), k = Math.min(d, 70) / (d || 1);
      perilla.setPosition(this.joy.x + dx * k, this.joy.y + dy * k);
      this.joy.vx = d > 12 ? (dx * k) / 70 : 0;
      this.joy.vy = d > 12 ? (dy * k) / 70 : 0;
    });
    this.input.on('pointerup', p => {
      if (p.id !== this.joy.id) return;
      this.joy.activo = false;
      base.setVisible(false); perilla.setVisible(false);
    });

    this.botonHablar = boton(this, ANCHO - 110, ALTO - 110, 170, 110, 'Hablar', () => this.accion(), VERDE, 28)
      .setScrollFactor(0).setDepth(950).setVisible(false);
  }

  update() {
    let dx = 0, dy = 0;
    if (!this.ocupado) {
      const t = this.teclas;
      dx = (t.RIGHT.isDown || t.D.isDown) - (t.LEFT.isDown || t.A.isDown);
      dy = (t.DOWN.isDown || t.S.isDown) - (t.UP.isDown || t.W.isDown);
      if (this.joy.activo) { dx = this.joy.vx; dy = this.joy.vy; }
    }
    const len = Math.hypot(dx, dy);
    if (len > 1) { dx /= len; dy /= len; }
    this.yo.setVelocity(dx * VELOCIDAD, dy * VELOCIDAD);
    if (dx) this.yo.setFlipX(dx < 0);

    this.cerca = this.ocupado ? null : this.npcs.find(s => Phaser.Math.Distance.Between(s.x, s.y, this.yo.x, this.yo.y) < CERCA + s.width / 3);
    this.botonHablar.setVisible(!!this.cerca);

    if (this.ocupado) return;
    const b = this.yo.body;
    const salida = this.salidas.find(s => b.center.x > s.x && b.center.x < s.x + s.w && b.center.y > s.y && b.center.y < s.y + s.h);
    if (!salida) { this.ultimo = [this.yo.x, this.yo.y]; return; }
    const motivo = salida.puede?.();
    if (motivo) { this.yo.setPosition(...this.ultimo).setVelocity(0, 0); this.hablar([motivo]); }
    else { this.ocupado = true; salida.ir(this); }
  }

  accion() {
    if (this.dialogo) return this.avanzar();
    if (this.ocupado || !this.cerca) return;
    this.cerca.datos.hablar(this);
  }

  // Diálogo: lista de textos o de [quién, texto]. Avanza tocando la pantalla o con Espacio.
  hablar(lineas, fin) {
    if (!lineas.length) { this.ocupado = false; return fin?.(); }
    this.ocupado = true;
    this.yo.setVelocity(0, 0);
    const caja = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
    caja.add(panel(this, ANCHO / 2, ALTO - 105, 1220, 180));
    const quien = this.add.text(55, ALTO - 182, '', estilo(22, '#6c5ce7', { fontStyle: 'bold' }));
    const texto = this.add.text(55, ALTO - 150, '', estilo(24, '#23233a', { wordWrap: { width: 1150 }, lineSpacing: 6 }));
    const seguir = this.add.text(ANCHO - 60, ALTO - 38, '▶', estilo(22, '#6c5ce7')).setOrigin(1);
    caja.add([quien, texto, seguir]);
    this.tweens.add({ targets: seguir, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });
    this.dialogo = { lineas, i: 0, fin, caja, quien, texto, desde: this.time.now };
    this.mostrarLinea();
  }

  mostrarLinea() {
    const d = this.dialogo, l = d.lineas[d.i];
    const [q, t] = Array.isArray(l) ? l : ['', l];
    d.quien.setText(q);
    d.texto.setText(t).setY(q ? ALTO - 150 : ALTO - 165);
  }

  avanzar() {
    const d = this.dialogo;
    if (this.time.now - d.desde < 200) return;
    d.desde = this.time.now;
    if (++d.i < d.lineas.length) return this.mostrarLinea();
    d.caja.destroy();
    this.dialogo = null;
    this.ocupado = false;
    d.fin?.();
  }

  reto(r, fin) {
    this.ocupado = true;
    this.yo.setVelocity(0, 0);
    crearReto(this, r, ok => { this.ocupado = false; guardar(); fin(ok); });
  }

  // Lanza otra escena (combate, traducción, historia) y vuelve acá al terminar.
  otraEscena(clave, datos, fin) {
    this.ocupado = true;
    E.pos = [this.yo.x, this.yo.y];
    guardar();
    this.scene.launch(clave, { ...datos, fin: (...r) => { this.scene.wake(); this.ocupado = false; fin(...r); } });
    this.scene.sleep();
  }
  batalla(tipo, fin) {
    this.otraEscena('Batalla', { tipo }, gano => {
      if (gano) return fin(gano);
      E.cola = 100; E.pos = null; guardar();
      this.hablar(['Tu cola poli-A se terminó y las ARNasas te degradaron...', '...pero el gen sigue en el núcleo: la célula hace una copia nueva. ¡Seguís desde el comienzo de esta zona!'], () => this.scene.restart());
    });
  }
  traducir(datos, fin) { this.otraEscena('Traduccion', datos, fin); }
  historia(paginas, fin) { this.otraEscena('Historia', { paginas }, fin); }

  chocar(s) {
    if (this.ocupado) return;
    const en = s.datos;
    this.yo.setVelocity(0, 0);
    s.setVelocity?.(0, 0);
    this.hablar(en.antes ?? [en.tipo === 'arnasa' ? 'Una ARNasa te encontró: ¡quiere recortar tu cola poli-A!' : '¡Combate!'], () =>
      this.batalla(en.tipo, () => {
        E.flags[en.id] = true;
        const p = en.jefe ? null : darPagina();
        const completo = en.jefe && E.paginas.length < 4;
        if (en.jefe) E.paginas = 'AUCG';
        this.hablar([
          ...(en.despues ?? ['La ARNasa se va a limpiar a otro lado.']),
          ...(p ? [`¡Nueva página del Codonario! Ahora tenés los codones que empiezan con ${p}.`] : []),
          ...(completo ? ['¡Completaste el Codonario: ya tenés las cuatro páginas!'] : []),
        ], () => this.reiniciar());
      }));
  }

  // Vuelve a armar la zona (con la partida actualizada) sin fundido a negro.
  reiniciar() {
    E.pos = [this.yo.x, this.yo.y];
    guardar();
    this.sinFundido = true;
    this.scene.restart();
  }

  irA(zona) {
    this.ocupado = true;
    E.zona = zona; E.pos = null;
    guardar();
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart());
  }

  final() {
    this.historia([
      ['interferon', 'La vesícula se fusiona con la membrana plasmática y el interferón beta sale de la célula.'],
      ['interferon', 'Llega a las células vecinas y les avisa que hay un virus. Ellas activan sus defensas antes de infectarse.'],
      ['arnm-2', 'Mientras tanto, muchos ribosomas leyeron al mismo ARNm, uno detrás de otro: de un solo mensajero salieron muchas copias de interferón.'],
      ['arnasa', 'Con el tiempo, su cola poli-A se acortó y las ARNasas lo degradaron. No es algo malo: así la célula puede dejar de fabricar una proteína cuando ya no la necesita.'],
      ['ribosoma', 'Dato: las vacunas de ARNm usan esta misma idea. Le dan a la célula un ARNm con la receta de una proteína del virus; la célula la fabrica y el sistema inmune aprende a reconocerla.'],
      [null, `¡Fin!\n\nRespuestas correctas: ${E.aciertos}\nErrores: ${E.errores}\n\nGracias por jugar a Mensajero.`],
    ], () => { E.flags.fin = true; guardar(); this.scene.start('Titulo'); });
  }
}
