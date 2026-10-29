// El mundo abierto: mapa de la zona actual, movimiento, diálogos y salidas.
import { E, guardar, darPagina } from './estado.js';
import { ZONAS } from './zonas.js';
import { ANCHO, ALTO, estilo, boton, panel, crearReto, abrirCodonario, VERDE } from './ui.js';
import { ARNTS, ESCALA } from './arte.js';
import { ambiente, chispas, numero, parpadeo, sonido } from './fx.js';
import { COLOR_BASE } from './data.js';

const VELOCIDAD = 270, CERCA = 120;
const LEMAS = {
  nucleo: 'Acá está el ADN', poro: 'La puerta del núcleo', citoplasma: 'Donde trabajan los ribosomas',
  reticulo: 'Donde se fabrican las proteínas que salen de la célula', golgi: 'Empaque y envío',
};

// Quién habla → su dibujo, para el retrato del diálogo.
const RETRATOS = {
  'ARN polimerasa': 'polimerasa', 'Enzima del casquete': 'casquete', 'Poli-A polimerasa': 'poliA', Histona: 'histona',
  'Complejo del poro': 'guardian', ADN: 'adn', 'ARNm de la actina': 'arnm-2', Ribosoma: 'ribosoma', PRS: 'prs',
  Virus: 'virus', Chaperona: 'chaperona', 'Peptidasa señal': 'peptidasa', Golgi: 'golgi',
  ...Object.fromEntries(Object.entries(ARNTS).map(([c, aa]) => [`ARNt-${aa}`, `arnt-${c}`])),
};

export class Mundo extends Phaser.Scene {
  constructor() { super('Mundo'); }

  create() {
    const z = (this.z = ZONAS[E.zona]);
    this.ocupado = false;
    this.dialogo = null;
    this.cameras.main.setBackgroundColor(z.fondo).setBounds(0, 0, z.ancho, z.alto);
    const entrando = !this.sinFundido;
    if (entrando) this.cameras.main.fadeIn(350);
    this.sinFundido = false;
    this.physics.world.setBounds(0, 0, z.ancho, z.alto);

    // Capa lejana (se mueve más lento que la cámara) y decoración de la zona.
    const tono = Phaser.Display.Color.ValueToColor(z.fondo);
    const lejos = this.add.graphics().setScrollFactor(0.55).setDepth(-2), rnd = new Phaser.Math.RandomDataGenerator([E.zona + 'lejos']);
    for (let i = 0; i < 16; i++) lejos.fillStyle(tono.clone().darken(5).color, 0.55).fillCircle(rnd.between(-100, z.ancho * 0.55 + 800), rnd.between(-100, z.alto * 0.55 + 500), rnd.between(90, 230));
    z.decorar(this, this.add.graphics(), new Phaser.Math.RandomDataGenerator([E.zona]));
    ambiente(this, z.ancho, z.alto, [tono.clone().darken(22).color, tono.clone().darken(12).color, 0xffffff], 70);

    const solidos = this.physics.add.staticGroup();
    const paredes = typeof z.paredes === 'function' ? z.paredes() : z.paredes ?? [];
    for (const [x, y, w, h] of paredes) solidos.add(this.add.zone(x + w / 2, y + h / 2, w, h));
    for (const [x, y, r] of z.circulos ?? []) {
      const c = this.add.zone(x, y, r * 2, r * 2);
      solidos.add(c);
      c.body.setCircle(r);
    }
    for (const [img, x, y] of z.obstaculos ?? []) {
      const o = this.physics.add.staticImage(x, y, img).setScale(ESCALA);
      o.refreshBody();
      o.body.setSize(o.displayWidth * 0.9, o.displayHeight * 0.7);
      solidos.add(o);
    }

    // Sombras: las de los que se mueven se actualizan en update().
    this.sombras = [];
    const sombra = (s, sigue) => {
      const e = this.add.ellipse(s.x, s.y + s.displayHeight * 0.42, s.displayWidth * 0.7, 18, 0x000000, 0.12).setDepth(2);
      if (sigue) this.sombras.push([s, e]);
      return e;
    };

    const [px, py] = E.pos ?? z.inicio;
    this.yo = this.physics.add.image(px, py, this.texturaYo()).setScale(ESCALA).setCollideWorldBounds(true).setDepth(10);
    this.yo.body.setSize(this.yo.width * 0.55, this.yo.height * 0.5);
    if (!E.flags.nacido) this.yo.setAlpha(0);
    else sombra(this.yo, true);
    this.physics.add.collider(this.yo, solidos);
    this.cameras.main.startFollow(this.yo, true, 0.1, 0.1);
    // Rastro de bases de colores al moverse.
    this.rastro = this.add.particles(0, 0, 'punto', {
      speed: { min: 5, max: 25 }, lifespan: 600, scale: { start: 0.35, end: 0 }, alpha: { start: 0.8, end: 0 },
      tint: Object.values(COLOR_BASE), frequency: 45, emitting: false,
    }).setDepth(9);
    this.rastro.startFollow(this.yo);

    this.npcs = (z.npcs ?? []).filter(n => !n.visible || n.visible()).map((n, i) => {
      const s = this.add.image(n.x, n.y, n.img).setScale(ESCALA).setDepth(5);
      sombra(s);
      this.physics.add.existing(s, true);
      s.body.setSize(s.displayWidth * 0.6, s.displayHeight * 0.5);
      this.physics.add.collider(this.yo, s);
      this.tweens.add({
        targets: s, y: n.y - 6, scaleY: ESCALA * 1.035, scaleX: ESCALA * 0.985,
        duration: 900 + i * 130, yoyo: true, repeat: -1, ease: 'Sine.inOut',
      });
      const nombre = this.add.text(n.x, n.y - s.displayHeight / 2 - 18, n.nombre, estilo(16, '#4a4a68', { fontStyle: '800' })).setOrigin(0.5).setDepth(7);
      this.add.graphics().setDepth(6).fillStyle(0xffffff, 0.85)
        .fillRoundedRect(nombre.x - nombre.width / 2 - 10, nombre.y - nombre.height / 2 - 3, nombre.width + 20, nombre.height + 6, 12);
      s.datos = n;
      return s;
    });

    this.enemigos = [];
    for (const en of z.enemigos ?? []) {
      if (E.flags[en.id]) continue;
      const esc = ESCALA * (en.jefe ? 1.3 : 1);
      const s = this.physics.add.image(en.x, en.y, en.img).setScale(esc).setDepth(8);
      s.body.setSize(s.width * 0.6, s.height * 0.6);
      s.datos = en;
      this.enemigos.push(s);
      sombra(s, true);
      if (en.jefe) {
        s.body.setImmovable(true);
        this.tweens.add({ targets: s, scale: esc * 1.08, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
        this.add.particles(0, 0, 'punto', {
          speed: { min: 20, max: 70 }, lifespan: 1100, scale: { start: 0.45, end: 0 }, alpha: { start: 0.7, end: 0 },
          tint: [0xe84393, 0xb83280, 0xff8fc7], frequency: 70,
        }).setDepth(7).startFollow(s);
      } else {
        this.tweens.add({ targets: s, angle: { from: -9, to: 9 }, duration: 380, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
      if (en.rango) {
        this.physics.add.collider(s, solidos);
        this.time.addEvent({
          delay: 1500, loop: true, callback: () => {
            if (this.ocupado) return s.setVelocity(0, 0);
            const lejos = Phaser.Math.Distance.Between(s.x, s.y, en.x, en.y) > en.rango;
            const ang = lejos ? Phaser.Math.Angle.Between(s.x, s.y, en.x, en.y) : Math.random() * Math.PI * 2;
            s.setVelocity(Math.cos(ang) * 90, Math.sin(ang) * 90);
            s.setFlipX(Math.cos(ang) < 0);
          },
        });
      }
      this.physics.add.overlap(this.yo, s, () => this.chocar(s));
    }

    for (const o of z.objetos ?? []) {
      if (E.flags[o.id]) continue;
      const halo = this.add.image(o.x, o.y, 'halo').setTint(0x56ccf2).setScale(1.8).setDepth(3).setBlendMode(Phaser.BlendModes.ADD);
      const s = this.physics.add.image(o.x, o.y, o.img).setScale(ESCALA * 0.6).setDepth(4);
      this.tweens.add({ targets: s, scale: ESCALA * 0.7, y: o.y - 6, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      this.tweens.add({ targets: halo, scale: 2.4, alpha: 0.5, duration: 900, yoyo: true, repeat: -1 });
      this.physics.add.overlap(this.yo, s, () => {
        if (this.ocupado || E.flags[o.id]) return;
        E.flags[o.id] = true; guardar();
        chispas(this, s.x, s.y, [0x56ccf2, 0xffffff, 0x2d9cdb], 26, { textura: 'estrella', gravedad: 0 });
        numero(this, s.x, s.y - 40, '+1 PABP', '#2d9cdb', 28);
        sonido('item');
        s.destroy(); halo.destroy();
        o.tomar(this);
      });
    }

    this.salidas = z.salidas ?? [];
    for (const s of this.salidas) {
      const brillo = this.add.rectangle(s.x + s.w / 2, s.y + s.h / 2, s.w, s.h, 0xffffff, 0.45).setDepth(1);
      this.tweens.add({ targets: brillo, alpha: 0.15, duration: 900, yoyo: true, repeat: -1 });
      if (s.etiqueta) {
        const t = this.add.text(s.x - 10, s.y + s.h / 2, s.etiqueta, estilo(22, '#4a4a68', { fontStyle: '800' })).setOrigin(1, 0.5).setDepth(2);
        this.tweens.add({ targets: t, x: s.x - 22, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      }
    }
    this.ultimo = [px, py];

    this.globo = this.add.image(0, 0, 'globo').setScale(ESCALA).setDepth(12).setVisible(false);
    this.add.image(ANCHO / 2, ALTO / 2, 'vineta').setScrollFactor(0).setDepth(990);
    parpadeo(this, () => [this.yo, ...this.npcs, ...this.enemigos]);

    this.crearHud();
    this.crearControles();
    if (!this.escuchaWake) {
      this.escuchaWake = true;
      this.events.on('wake', () => { this.input.keyboard.resetKeys(); this.joy.activo = false; });
    }
    if (entrando) this.cartelZona();
    z.alEntrar?.(this);
    guardar();
  }

  texturaYo() {
    return E.yo === 'interferon' ? 'interferon' : `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`;
  }

  // Cartel con el nombre de la zona al entrar.
  cartelZona() {
    const c = this.add.container(ANCHO / 2, -90).setScrollFactor(0).setDepth(1500);
    const titulo = this.add.text(0, -14, this.z.nombre, estilo(34, '#6c5ce7', { fontStyle: '900' })).setOrigin(0.5);
    const lema = this.add.text(0, 24, LEMAS[E.zona] ?? '', estilo(18, '#4a4a68', { fontStyle: '700' })).setOrigin(0.5);
    const w = Math.max(titulo.width, lema.width) + 70;
    c.add([panel(this, 0, 0, w, 96), titulo, lema]);
    c.list.forEach(o => o.setScrollFactor(0));
    sonido('zona');
    this.tweens.chain({
      targets: c, tweens: [
        { y: 110, duration: 500, ease: 'Back.out', delay: 250 },
        { y: -90, duration: 400, ease: 'Back.in', delay: 1800 },
      ], onComplete: () => c.destroy(),
    });
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
      hud.push(this.add.rectangle(140, 67, 2 * E.cola, 5, 0xffffff, 0.35).setOrigin(0, 0.5));
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
    const base = this.add.circle(0, 0, 70, 0x000000, 0.12).setStrokeStyle(3, 0xffffff, 0.5).setScrollFactor(0).setDepth(900).setVisible(false);
    const perilla = this.add.circle(0, 0, 32, 0x6c5ce7, 0.7).setStrokeStyle(3, 0xffffff, 0.8).setScrollFactor(0).setDepth(901).setVisible(false);
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

  update(t) {
    let dx = 0, dy = 0;
    if (!this.ocupado) {
      const k = this.teclas;
      dx = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.A.isDown);
      dy = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.W.isDown);
      if (this.joy.activo) { dx = this.joy.vx; dy = this.joy.vy; }
    }
    const len = Math.hypot(dx, dy);
    if (len > 1) { dx /= len; dy /= len; }
    this.yo.setVelocity(dx * VELOCIDAD, dy * VELOCIDAD);
    if (dx) this.yo.setFlipX(dx < 0);

    // Al moverse se estira y se inclina; quieto, "respira".
    const mov = len > 0.15;
    const k = mov ? Math.sin(t / 70) : Math.sin(t / 420);
    this.yo.setScale(ESCALA * (1 + (mov ? 0.05 : 0.012) * k), ESCALA * (1 - (mov ? 0.07 : 0.02) * k));
    this.yo.rotation = Phaser.Math.Linear(this.yo.rotation, mov ? dy * 0.14 * (this.yo.flipX ? -1 : 1) : 0, 0.15);
    this.rastro.emitting = mov && E.flags.nacido;
    this.rastro.followOffset.set(this.yo.flipX ? 26 : -26, 6);
    for (const [s, e] of this.sombras) e.setPosition(s.x, s.y + s.displayHeight * 0.42);

    this.cerca = this.ocupado ? null : this.npcs.find(s => Phaser.Math.Distance.Between(s.x, s.y, this.yo.x, this.yo.y) < CERCA + s.displayWidth / 3);
    this.botonHablar.setVisible(!!this.cerca);
    this.globo.setVisible(!!this.cerca);
    if (this.cerca) this.globo.setPosition(this.cerca.x + this.cerca.displayWidth * 0.35, this.cerca.y - this.cerca.displayHeight / 2 - 44 + Math.sin(t / 180) * 4);

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
    sonido('clic');
    this.cerca.datos.hablar(this);
  }

  // Diálogo: lista de textos o de [quién, texto]. Avanza tocando la pantalla o con Espacio.
  hablar(lineas, fin) {
    if (!lineas.length) { this.ocupado = false; return fin?.(); }
    this.ocupado = true;
    this.yo.setVelocity(0, 0);
    const caja = this.add.container(0, 220).setScrollFactor(0).setDepth(2000);
    caja.add(panel(this, ANCHO / 2, ALTO - 105, 1220, 180));
    const fondoRetrato = this.add.circle(118, ALTO - 105, 66, 0xefe9fb).setStrokeStyle(4, 0xe0d6fb);
    const retrato = this.add.image(118, ALTO - 105, 'polimerasa');
    const quien = this.add.text(0, ALTO - 182, '', estilo(22, '#6c5ce7', { fontStyle: '800' }));
    const texto = this.add.text(0, ALTO - 150, '', estilo(25, '#23233a', { lineSpacing: 6 }));
    const seguir = this.add.text(ANCHO - 60, ALTO - 38, '▶', estilo(22, '#6c5ce7')).setOrigin(1);
    caja.add([fondoRetrato, retrato, quien, texto, seguir]);
    caja.list.forEach(o => o.setScrollFactor(0));
    this.tweens.add({ targets: caja, y: 0, duration: 280, ease: 'Back.out' });
    this.tweens.add({ targets: seguir, alpha: 0.2, x: ANCHO - 52, duration: 450, yoyo: true, repeat: -1 });
    this.dialogo = { lineas, i: 0, fin, caja, quien, texto, retrato, fondoRetrato, seguir, desde: this.time.now };
    this.mostrarLinea();
  }

  // Escribe la línea letra por letra (ya cortada en renglones, para que las palabras no salten).
  mostrarLinea() {
    const d = this.dialogo, l = d.lineas[d.i];
    const [q, t] = Array.isArray(l) ? l : ['', l];
    const img = RETRATOS[q];
    d.retrato.setVisible(!!img);
    d.fondoRetrato.setVisible(!!img);
    if (img) {
      d.retrato.setTexture(img).setScale(Math.min(1, 110 / d.retrato.width, 110 / d.retrato.height));
      this.tweens.add({ targets: d.retrato, angle: { from: -5, to: 5 }, duration: 110, yoyo: true, repeat: Math.min(12, Math.ceil(t.length / 10)), onComplete: () => d.retrato.setAngle(0) });
    }
    const x = img ? 210 : 55;
    d.quien.setText(q).setX(x);
    d.texto.setX(x).setY(q ? ALTO - 150 : ALTO - 165).setWordWrapWidth(ANCHO - x - 70);
    d.completo = d.texto.getWrappedText(t).join('\n');
    d.texto.setWordWrapWidth(null).setText('');
    d.seguir.setVisible(false);
    d.n = 0;
    this.escritura?.remove();
    this.escritura = this.time.addEvent({
      delay: 14, repeat: d.completo.length - 1, callback: () => {
        d.n++;
        d.texto.setText(d.completo.slice(0, d.n));
        if (d.n % 4 === 1) sonido('hablar');
        if (d.n >= d.completo.length) d.seguir.setVisible(true);
      },
    });
  }

  avanzar() {
    const d = this.dialogo;
    if (this.time.now - d.desde < 150) return;
    d.desde = this.time.now;
    if (d.n < d.completo.length) {
      this.escritura?.remove();
      d.n = d.completo.length;
      d.texto.setText(d.completo);
      d.seguir.setVisible(true);
      return;
    }
    if (++d.i < d.lineas.length) return this.mostrarLinea();
    this.escritura?.remove();
    this.dialogo = null;
    this.ocupado = false;
    this.tweens.add({ targets: d.caja, y: 220, alpha: 0, duration: 180, onComplete: () => d.caja.destroy() });
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
    this.ocupado = true;
    sonido('golpe');
    this.cameras.main.flash(220, 255, 255, 255).shake(200, 0.006);
    chispas(this, (s.x + this.yo.x) / 2, (s.y + this.yo.y) / 2, [0xffffff, 0xf2c94c], 18, { textura: 'estrella', gravedad: 0 });
    this.time.delayedCall(350, () => this.hablar(en.antes ?? [en.tipo === 'arnasa' ? 'Una ARNasa te encontró: ¡quiere recortar tu cola poli-A!' : '¡Combate!'], () =>
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
      })));
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
    this.cameras.main.fadeOut(400, 29, 24, 56);
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
