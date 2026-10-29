import { COLOR_BASE, aaTexto, traducir, NOMBRE } from './data.js';
import { MUTACIONES } from './retos.js';
import { E } from './estado.js';
import { chispas, sonido } from './fx.js';

export const ANCHO = 1280, ALTO = 720;
export const TINTA = '#23233a';
export const VIOLETA = 0x6c5ce7, VERDE = 0x27ae60, ROJO = 0xeb5757, GRIS = 0x9aa0b4;

export const FUENTE = 'Nunito, system-ui, "Segoe UI", Roboto, sans-serif';
export const estilo = (tam = 22, color = TINTA, extra = {}) =>
  ({ fontFamily: FUENTE, fontSize: tam + 'px', color, fontStyle: '600', ...extra });

// Fondo degradado de pantalla completa (fijo a la cámara).
export const fondo = (scene, arriba, abajo) =>
  scene.add.graphics().setScrollFactor(0).setDepth(-10).fillGradientStyle(arriba, arriba, abajo, abajo, 1).fillRect(0, 0, ANCHO, ALTO);

// Fija a la pantalla un objeto y todo lo que tiene adentro: Phaser calcula los toques
// de cada hijo con su propio scrollFactor, no con el del contenedor.
const fijar = o => { o.setScrollFactor?.(0); o.list?.forEach(fijar); };

// Corta el evento para que no llegue al joystick ni a los diálogos de abajo.
const cortar = (p, x, y, ev) => ev?.stopPropagation();

export function boton(scene, x, y, w, h, etiqueta, alTocar, color = VIOLETA, tam = 22) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const r = Math.min(16, h / 2);
  c.pintar = col => g.clear()
    .fillStyle(Phaser.Display.Color.ValueToColor(col).darken(18).color, 1).fillRoundedRect(-w / 2, -h / 2 + 5, w, h, r)
    .fillStyle(col, 1).fillRoundedRect(-w / 2, -h / 2, w, h, r)
    .fillStyle(0xffffff, 0.16).fillRoundedRect(-w / 2 + 4, -h / 2 + 3, w - 8, h * 0.42, { tl: r - 3, tr: r - 3, bl: 6, br: 6 });
  c.pintar(color);
  const t = scene.add.text(0, 0, etiqueta, estilo(tam, '#fff', { fontStyle: '800', align: 'center', wordWrap: { width: w - 20 } })).setOrigin(0.5);
  c.add([g, t]).setSize(w, h).setInteractive({ useHandCursor: true });
  // Al tocar se hunde un poco; al pasar el mouse crece apenas.
  c.on('pointerdown', (...a) => {
    cortar(...a);
    sonido('clic');
    scene.tweens.add({ targets: c, scaleX: 0.93, scaleY: 0.9, duration: 70, yoyo: true, ease: 'Sine.out' });
    alTocar();
  });
  c.on('pointerover', () => scene.tweens.add({ targets: c, scale: 1.04, duration: 120 }))
    .on('pointerout', () => scene.tweens.add({ targets: c, scale: 1, duration: 120 }));
  c.texto = t;
  return c;
}

export function panel(scene, x, y, w, h, color = 0xffffff) {
  return scene.add.graphics()
    .fillStyle(0x2a1f66, 0.16).fillRoundedRect(x - w / 2, y - h / 2 + 7, w, h, 22)
    .fillStyle(color, 1).fillRoundedRect(x - w / 2, y - h / 2, w, h, 22)
    .lineStyle(3, 0xe4dcfb, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 22);
}

// Ficha de una base: cuadrado de color con la letra.
export function ficha(scene, x, y, base, tam = 56, borde = 0) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  const pintar = (b, color) => {
    g.clear();
    if (borde) g.lineStyle(4, borde).strokeRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
    const col = color ?? COLOR_BASE[b];
    if (b) g.fillStyle(Phaser.Display.Color.ValueToColor(col).darken(15).color, 1).fillRoundedRect(-tam / 2, -tam / 2 + tam * 0.07, tam, tam, 10)
      .fillStyle(col, 1).fillRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
    else g.lineStyle(3, GRIS).strokeRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
    t.setText(b || '');
  };
  const t = scene.add.text(0, 0, '', estilo(tam * 0.52, '#fff', { fontStyle: '900' })).setOrigin(0.5);
  c.add([g, t]);
  pintar(base);
  c.pintar = pintar;
  return c;
}

// Fila de bases agrupadas de a tres (codones), centrada en x.
function fila(scene, cont, x, y, bases, tam, { marcar = -1, extremos = ["5'", "3'"], debajo } = {}) {
  const gap = 4, sepCodon = 14;
  const grupos = Math.ceil(bases.length / 3);
  const ancho = bases.length * (tam + gap) + (grupos - 1) * sepCodon;
  let cx = x - ancho / 2 + tam / 2;
  const fichas = [];
  [...bases].forEach((b, i) => {
    if (i && i % 3 === 0) cx += sepCodon;
    const f = ficha(scene, cx, y, b, tam, i === marcar ? 0x23233a : 0);
    fichas.push(f); cont.add(f);
    if (debajo && i % 3 === 1) cont.add(scene.add.text(cx, y + tam * 0.85, debajo[(i - 1) / 3] ?? '', estilo(18, TINTA)).setOrigin(0.5));
    cx += tam + gap;
  });
  if (extremos) {
    cont.add(scene.add.text(x - ancho / 2 - 14, y, extremos[0], estilo(22, TINTA, { fontStyle: 'bold' })).setOrigin(1, 0.5));
    cont.add(scene.add.text(x + ancho / 2 + 4, y, extremos[1], estilo(22, TINTA, { fontStyle: 'bold' })).setOrigin(0, 0.5));
  }
  return fichas;
}

export function abrirCodonario(scene) {
  scene.scene.launch('Codonario', { todas: scene.scene.key === 'Practica' });
  scene.scene.bringToTop('Codonario');
}

// Muestra un desafío encima de la escena. alTerminar(acerto) se llama al tocar "Continuar".
export function crearReto(scene, r, alTerminar, { titulo } = {}) {
  const cx = ANCHO / 2, cy = ALTO / 2;
  const cont = scene.add.container(0, 0).setDepth(3000).setScrollFactor(0);
  const fondo = scene.add.rectangle(cx, cy, ANCHO, ALTO, 0x000000, 0.45).setInteractive();
  fondo.on('pointerdown', cortar);
  cont.add([fondo, panel(scene, cx, cy, 1160, 640)]);
  const tit = scene.add.text(cx, 70, '', estilo(26, TINTA, { fontStyle: 'bold', align: 'center', wordWrap: { width: 1060 } })).setOrigin(0.5, 0);
  const aviso = scene.add.text(cx, 560, '', estilo(22, TINTA, { align: 'center', wordWrap: { width: 1060 } })).setOrigin(0.5, 0);
  cont.add([tit, aviso]);
  const botones = [];
  let listo = false;

  const terminar = (ok, explicacion, mal = 'No era eso.') => {
    if (listo) return;
    listo = true;
    ok ? E.aciertos++ : E.errores++;
    botones.forEach(b => b.disableInteractive());
    aviso.setColor(ok ? '#1e8449' : '#c0392b').setText(`${ok ? '¡Bien!' : mal} ${explicacion}`).setY(512);
    if (ok) {
      sonido('bien');
      chispas(scene, cx, 130, [0x6c5ce7, 0x3dbe6b, 0xf2c94c, 0x2f80ed, 0xeb5757], 40, { textura: 'estrella', fija: true, velocidad: 420, escala: 0.8 });
    } else {
      sonido('mal');
      scene.tweens.add({ targets: cont, x: { from: -12, to: 12 }, duration: 55, yoyo: true, repeat: 3, onComplete: () => cont.setX(0) });
    }
    scene.tweens.add({ targets: aviso, scale: { from: 0.85, to: 1 }, duration: 260, ease: 'Back.out' });
    cont.add(boton(scene, cx, 640, 260, 60, 'Continuar', () => { cont.destroy(); alTerminar(ok); }, ok ? VERDE : VIOLETA));
    fijar(cont);
  };
  let limpiar = () => {};
  cont.once('destroy', () => limpiar());
  const conCodonario = () => {
    if (E.paginas || scene.scene.key === 'Practica') cont.add(boton(scene, 1100, 84, 190, 48, 'Codonario', () => abrirCodonario(scene), 0xf2994a, 20));
  };
  const opciones = (lista, etiqueta, alElegir, { w = 520, h = 72, y0 = 360, cols = 2 } = {}) => {
    lista.forEach((op, i) => {
      const x = cols === 1 ? cx : cx + (i % 2 ? 1 : -1) * (w / 2 + 12);
      const y = y0 + Math.floor(i / cols) * (h + 14);
      const b = boton(scene, x, y, w, h, etiqueta(op), () => { b.setAlpha(1); alElegir(op, b); }, VIOLETA, 22);
      botones.push(b); cont.add(b);
    });
  };
  const marcarBotones = (correcta, elegido, etiqueta) => botones.forEach(b => {
    if (b.texto.text === etiqueta(correcta)) {
      b.pintar(VERDE);
      scene.tweens.add({ targets: b, scale: 1.07, duration: 160, yoyo: true, repeat: 1 });
    } else if (b === elegido) b.pintar(ROJO);
    else b.setAlpha(0.55);
  });

  if (r.tipo === 'transcribir') {
    tit.setText(titulo ?? 'Transcribí: armá el ARNm que se aparea con el ADN molde');
    cont.add(scene.add.text(cx, 150, 'ADN molde', estilo(20, '#555')).setOrigin(0.5));
    fila(scene, cont, cx, 200, r.molde, 56, { extremos: ["3'", "5'"] });
    cont.add(scene.add.text(cx, 270, 'ARNm', estilo(20, '#555')).setOrigin(0.5));
    const huecos = fila(scene, cont, cx, 320, 'A'.repeat(r.respuesta.length), 56);
    huecos.forEach(f => f.pintar(''));
    let i = 0, errores = 0;
    const cursor = scene.add.rectangle(huecos[0].x, 320 + 40, 40, 6, 0x23233a);
    cont.add(cursor);
    const tocar = b => {
      if (listo) return;
      const ok = r.respuesta[i];
      if (b === ok) {
        huecos[i].pintar(b);
        scene.tweens.add({ targets: huecos[i], scale: { from: 1.45, to: 1 }, duration: 260, ease: 'Back.out' });
        chispas(scene, huecos[i].x, 320, [COLOR_BASE[b], 0xffffff], 10, { fija: true, velocidad: 180, escala: 0.4, gravedad: 0 });
        i++;
        if (i < huecos.length) cursor.x = huecos[i].x; else cursor.destroy();
        aviso.setText('');
        if (i === huecos.length) terminar(errores === 0, errores ? `Lo completaste con ${errores} error${errores > 1 ? 'es' : ''}. Reglas: A→U, T→A, C→G, G→C.` : 'Sin errores.', 'Casi.');
      } else {
        errores++;
        aviso.setColor('#c0392b').setText(b === 'T' ? 'En el ARN no hay T: en su lugar va U (uracilo).' : `Frente a ${r.molde[i]} en el ADN va ${ok} en el ARN.`);
        sonido('mal');
        scene.cameras.main.shake(120, 0.004);
      }
    };
    [...'AUGCT'].forEach((b, k) => {
      const bt = boton(scene, cx + (k - 2) * 130, 440, 110, 80, b, () => tocar(b), COLOR_BASE[b], 36);
      botones.push(bt); cont.add(bt);
    });
    const tecla = ev => { const k = ev.key.toUpperCase(); if (k.length === 1 && 'AUGCT'.includes(k)) tocar(k); };
    scene.input.keyboard?.on('keydown', tecla);
    limpiar = () => scene.input.keyboard?.off('keydown', tecla);
  }

  if (r.tipo === 'codon') {
    tit.setText(titulo ?? '¿Qué aminoácido codifica este codón?');
    conCodonario();
    fila(scene, cont, cx, 200, r.codon, 90);
    const et = aaTexto;
    opciones(r.opciones, et, (op, b) => {
      marcarBotones(r.correcta, b, et);
      terminar(op === r.correcta, `${r.codon} → ${aaTexto(r.correcta)}.${op === r.correcta ? '' : ` Buscalo en la página ${r.codon[0]} del Codonario.`}`);
    });
  }

  if (r.tipo === 'anticodon' || r.tipo === 'reclutar') {
    const anti = r.tipo === 'anticodon';
    tit.setText(titulo ?? (anti ? 'Llamá al ARNt correcto: ¿qué anticodón se aparea con este codón?'
      : `Soy un ARNt con el anticodón 3'-${r.anticodon}-5'. ¿Qué codón del ARNm leo?`));
    if (anti) conCodonario();
    cont.add(scene.add.text(cx, 150, anti ? 'Codón del ARNm' : 'Anticodón del ARNt', estilo(20, '#555')).setOrigin(0.5));
    fila(scene, cont, cx, 210, anti ? r.codon : r.anticodon, 80, { extremos: anti ? ["5'", "3'"] : ["3'", "5'"] });
    const et = op => (anti ? `3'-${op}-5'` : `5'-${op}-3'`);
    opciones(r.opciones, et, (op, b) => {
      marcarBotones(r.correcta, b, et);
      const [cod, ac] = anti ? [r.codon, r.correcta] : [r.correcta, r.anticodon];
      terminar(op === r.correcta,
        `El codón 5'-${cod}-3' se aparea con el anticodón 3'-${ac}-5': A con U, C con G.` +
        (op.includes('T') ? ' Ojo: los ARN no tienen T.' : '') + ` Ese ARNt lleva ${NOMBRE[traducir(cod)][1].toLowerCase()}.`);
    });
  }

  if (r.tipo === 'mutacion') {
    tit.setText(titulo ?? '¿Qué tipo de mutación es?');
    conCodonario();
    const aas = r.original.map(c => (c.length === 3 ? NOMBRE[traducir(c)][0] : ''));
    cont.add(scene.add.text(140, 165, 'Original', estilo(20, '#555')).setOrigin(0, 0.5));
    fila(scene, cont, cx + 40, 165, r.original.join(''), 44, { debajo: aas });
    cont.add(scene.add.text(140, 275, 'Mutada', estilo(20, '#555')).setOrigin(0, 0.5));
    fila(scene, cont, cx + 40, 275, r.mutada.join(''), 44, { marcar: r.pos });
    const et = op => MUTACIONES[op][0];
    opciones(Object.keys(MUTACIONES), et, (op, b) => {
      marcarBotones(r.correcta, b, et);
      let extra = '';
      if (r.correcta !== 'corrimiento') {
        const k = Math.floor(r.pos / 3);
        extra = ` ${r.original[k]} (${NOMBRE[traducir(r.original[k])][0]}) → ${r.mutada[k]} (${NOMBRE[traducir(r.mutada[k])][0]}).`;
      }
      terminar(op === r.correcta, MUTACIONES[r.correcta][1] + extra);
    }, { y0: 380 });
  }

  if (r.tipo === 'pregunta') {
    tit.setText(r.texto);
    const et = op => op;
    opciones(r.opciones, et, (op, b) => {
      marcarBotones(r.correcta, b, et);
      terminar(op === r.correcta, `Respuesta: ${r.correcta}.`);
    }, { y0: 250, h: 90, w: 540 });
  }

  if (r.tipo === 'inicio') {
    tit.setText('El ribosoma recorre el ARNm desde el casquete 5\'. Tocá el codón de inicio.');
    let errores = 0;
    const tam = 30, gap = 3, x0 = cx - (r.secuencia.length * (tam + gap)) / 2 + tam / 2;
    cont.add(scene.add.text(x0 - 26, 260, "5'", estilo(22, TINTA, { fontStyle: 'bold' })).setOrigin(1, 0.5));
    const fichas = [...r.secuencia].map((b, k) => {
      const f = ficha(scene, x0 + k * (tam + gap), 260, b, tam);
      f.setSize(tam, tam).setInteractive({ useHandCursor: true }).on('pointerdown', (...a) => {
        cortar(...a);
        if (listo) return;
        if (k >= r.indice && k < r.indice + 3) {
          for (let j = 0; j < 3; j++) fichas[r.indice + j].setScale(1.3);
          terminar(errores === 0, 'AUG es el codón de inicio: codifica metionina (Met), así que la traducción empieza con Met.', 'Lo encontraste, pero con errores.');
        } else {
          errores++;
          f.setAlpha(0.3);
          aviso.setColor('#c0392b').setText('Ese no es. Buscá las letras A-U-G seguidas, empezando desde el 5\'.');
        }
      });
      cont.add(f);
      return f;
    });
  }
  fijar(cont);
  sonido('abrir');
  cont.setAlpha(0).setY(26);
  scene.tweens.add({ targets: cont, alpha: 1, y: 0, duration: 260, ease: 'Back.out' });
  return cont;
}
