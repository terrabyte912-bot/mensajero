// Efectos: texturas base, partículas, números que flotan, parpadeo y sonidos (sintetizados, sin archivos).
const ANCHO = 1280, ALTO = 720;

export function texturasBase(scene) {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffffff).fillCircle(8, 8, 8).generateTexture('punto', 16, 16).clear();
  for (let r = 32; r > 0; r -= 2) g.fillStyle(0xffffff, 0.05).fillCircle(32, 32, r);
  g.generateTexture('halo', 64, 64).clear();
  g.fillStyle(0xffffff).fillPoints([[12, 0], [15, 9], [24, 12], [15, 15], [12, 24], [9, 15], [0, 12], [9, 9]].map(([x, y]) => ({ x, y })), true)
    .generateTexture('estrella', 24, 24).destroy();
  // Viñeta: oscurece apenas los bordes de la pantalla.
  const t = scene.textures.createCanvas('vineta', ANCHO, ALTO), ctx = t.getContext();
  const grad = ctx.createRadialGradient(ANCHO / 2, ALTO / 2, 380, ANCHO / 2, ALTO / 2, 860);
  grad.addColorStop(0, 'rgba(30,20,70,0)');
  grad.addColorStop(1, 'rgba(30,20,70,0.2)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ANCHO, ALTO);
  t.refresh();
}

// Explosión de partículas que se borra sola.
export function chispas(scene, x, y, colores = [0xffffff], n = 22, { textura = 'punto', velocidad = 260, gravedad = 300, escala = 0.6, profundidad = 4000, fija = false } = {}) {
  const em = scene.add.particles(x, y, textura, {
    speed: { min: velocidad * 0.3, max: velocidad }, angle: { min: 0, max: 360 }, lifespan: { min: 450, max: 900 },
    scale: { start: escala, end: 0 }, alpha: { start: 1, end: 0 }, rotate: { min: 0, max: 360 },
    tint: colores, gravityY: gravedad, emitting: false,
  }).setDepth(profundidad);
  if (fija) em.setScrollFactor(0);
  em.explode(n);
  scene.time.delayedCall(1100, () => em.destroy());
  return em;
}

// Texto que sube y se desvanece (daño, puntos).
export function numero(scene, x, y, texto, color = '#eb5757', tam = 34) {
  const t = scene.add.text(x, y, texto, {
    fontFamily: 'Nunito, system-ui, sans-serif', fontSize: tam + 'px', fontStyle: '900', color, stroke: '#ffffff', strokeThickness: 6,
  }).setOrigin(0.5).setDepth(4100).setScale(0.4);
  scene.tweens.add({ targets: t, scale: 1, duration: 220, ease: 'Back.out' });
  scene.tweens.add({ targets: t, y: y - 70, alpha: 0, delay: 450, duration: 700, ease: 'Sine.in', onComplete: () => t.destroy() });
}

// Partículas que flotan en el ambiente (en coordenadas del mundo).
export function ambiente(scene, ancho, alto, colores, frecuencia = 90) {
  return scene.add.particles(0, 0, 'punto', {
    x: { min: 0, max: ancho }, y: { min: 0, max: alto }, lifespan: 9000,
    speedX: { min: -10, max: 10 }, speedY: { min: -16, max: -3 },
    scale: { min: 0.12, max: 0.5 }, alpha: { values: [0, 0.55, 0], interpolation: 'linear' },
    tint: colores, frequency: frecuencia, advance: 9000,
  }).setDepth(1);
}

// Hace parpadear de vez en cuando a los personajes que tienen versión con ojos cerrados (clave + '-p').
export function parpadeo(scene, lista) {
  scene.time.addEvent({
    delay: 260, loop: true, callback: () => {
      const s = Phaser.Utils.Array.GetRandom(lista());
      if (!s?.active || Math.random() > 0.45) return;
      const k = s.texture.key;
      if (k.endsWith('-p') || !scene.textures.exists(k + '-p')) return;
      s.setTexture(k + '-p');
      scene.time.delayedCall(130, () => s.active && s.texture.key === k + '-p' && s.setTexture(k));
    },
  });
}

// Aparece con un pequeño rebote.
export function aparecer(scene, obj, escala = 1, demora = 0) {
  obj.setScale(escala * 0.3).setAlpha(0);
  scene.tweens.add({ targets: obj, scale: escala, alpha: 1, duration: 380, delay: demora, ease: 'Back.out' });
}

// ---- Sonido ----
let ctx = null;
let activo = (() => { try { return localStorage.getItem('mensajero-sonido') !== 'no'; } catch { return true; } })();
export const sonidoActivo = () => activo;
export function alternarSonido() {
  activo = !activo;
  try { localStorage.setItem('mensajero-sonido', activo ? 'si' : 'no'); } catch {}
  return activo;
}

function tono(f, t, dur, tipo = 'sine', vol = 0.1, fFin) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(f, t);
  if (fFin) o.frequency.exponentialRampToValueAtTime(fFin, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.03);
}
function ruido(t, dur, vol, corte = 900) {
  const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = b; f.type = 'lowpass'; f.frequency.value = corte; g.gain.value = vol;
  s.connect(f).connect(g).connect(ctx.destination);
  s.start(t);
}

const SONIDOS = {
  clic: t => tono(700, t, 0.07, 'triangle', 0.07, 900),
  hablar: t => tono(480 + Math.random() * 160, t, 0.035, 'square', 0.018),
  abrir: t => tono(320, t, 0.18, 'sine', 0.06, 640),
  bien: t => [660, 880, 1320].forEach((f, i) => tono(f, t + i * 0.08, 0.16, 'triangle', 0.1)),
  mal: t => { tono(260, t, 0.28, 'sawtooth', 0.045, 150); tono(180, t + 0.05, 0.25, 'square', 0.03, 120); },
  golpe: t => { ruido(t, 0.2, 0.35); tono(160, t, 0.15, 'sine', 0.15, 60); },
  herida: t => { ruido(t, 0.25, 0.25, 500); tono(300, t, 0.2, 'triangle', 0.06, 120); },
  item: t => [988, 1319, 1568, 1976].forEach((f, i) => tono(f, t + i * 0.055, 0.14, 'sine', 0.08)),
  victoria: t => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tono(f, t + i * 0.1, 0.24, 'triangle', 0.1)),
  escudo: t => tono(400, t, 0.35, 'sine', 0.08, 1200),
  paso: t => tono(220 + Math.random() * 40, t, 0.05, 'sine', 0.03),
  zona: t => [392, 523, 659].forEach((f, i) => tono(f, t + i * 0.12, 0.5, 'sine', 0.06)),
};
export function sonido(nombre) {
  if (!activo) return;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    SONIDOS[nombre]?.(ctx.currentTime + 0.01);
  } catch {}
}
