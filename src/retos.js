// Generadores de desafíos. No dependen de Phaser, así se pueden probar con node (ver check.mjs).
import {
  CDS, ARNM, UTR5, BASES, PREGUNTAS, NOMBRE, TODOS_CODONES,
  codones, traducir, anticodon, MOLDE_DE_CODIFICANTE,
} from './data.js';

const azar = n => Math.floor(Math.random() * n);
const elegir = a => a[azar(a.length)];
export const mezclar = a => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) { const j = azar(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const delasPaginas = paginas => TODOS_CODONES.filter(c => paginas.includes(c[0]));
const CODONES_GEN = codones(ARNM).slice(0, -1); // sin el stop

// Tramo real del gen: el jugador ve el ADN molde (3'→5') y arma el ARNm (5'→3').
export function transcribir(n = 6, desde = azar((CDS.length - 3 - n) / 3) * 3) {
  const cod = CDS.slice(desde, desde + n);
  return { tipo: 'transcribir', molde: [...cod].map(b => MOLDE_DE_CODIFICANTE[b]).join(''), respuesta: cod.replace(/T/g, 'U') };
}

export function codon(paginas = BASES) {
  const c = elegir(delasPaginas(paginas));
  const a = traducir(c);
  const otros = mezclar(Object.keys(NOMBRE).filter(x => x !== a)).slice(0, 3);
  return { tipo: 'codon', codon: c, opciones: mezclar([a, ...otros]), correcta: a };
}

// Distractores con los errores típicos: copiar el codón, poner T, o escribir el anticodón al revés.
function distractores(ok, tipicos) {
  const s = new Set(tipicos.filter(x => x !== ok));
  while (s.size < 3) { const x = elegir(TODOS_CODONES); if (x !== ok) s.add(x); }
  return mezclar([ok, ...[...s].slice(0, 3)]);
}
const reves = s => [...s].reverse().join('');

export function anticodonReto(paginas = BASES) {
  const c = elegir(delasPaginas(paginas));
  const ok = anticodon(c);
  return { tipo: 'anticodon', codon: c, opciones: distractores(ok, [c, ok.replace(/U/g, 'T'), reves(ok)]), correcta: ok };
}

// Al revés: el ARNt muestra su anticodón y el jugador elige el codón.
export function reclutar(codonDelArnt) {
  const anti = anticodon(codonDelArnt);
  return { tipo: 'reclutar', anticodon: anti, opciones: distractores(codonDelArnt, [anti, reves(codonDelArnt)]), correcta: codonDelArnt };
}

export const MUTACIONES = {
  silenciosa: ['Silenciosa', 'El codón cambió pero sigue codificando el mismo aminoácido: el código es redundante.'],
  cambio: ['Cambio de sentido', 'Cambió una base y el codón ahora codifica otro aminoácido.'],
  'sin sentido': ['Sin sentido', 'El codón se convirtió en un stop: la proteína queda cortada.'],
  corrimiento: ['Corrimiento del marco', 'Se agregó o se perdió una base: todos los codones siguientes se leen distinto.'],
};

export function mutacion(tipo = elegir(Object.keys(MUTACIONES))) {
  for (;;) {
    const i = 1 + azar(CODONES_GEN.length - 5);
    const orig = CODONES_GEN.slice(i, i + 4).join('');
    if (tipo === 'corrimiento') {
      const p = 3 + azar(3);
      const mut = Math.random() < 0.5 ? orig.slice(0, p) + orig.slice(p + 1) : orig.slice(0, p) + elegir(BASES) + orig.slice(p);
      return { tipo: 'mutacion', original: codones(orig), mutada: codones(mut), pos: p, correcta: tipo };
    }
    const posibles = [];
    for (let p = 3; p < 9; p++) for (const b of BASES) {
      if (b === orig[p]) continue;
      const mut = orig.slice(0, p) + b + orig.slice(p + 1);
      const k = p - (p % 3);
      const a0 = traducir(orig.slice(k, k + 3)), a1 = traducir(mut.slice(k, k + 3));
      const t = a1 === a0 ? 'silenciosa' : a1 === '*' ? 'sin sentido' : 'cambio';
      if (t === tipo) posibles.push({ mut, p });
    }
    if (posibles.length) {
      const { mut, p } = elegir(posibles);
      return { tipo: 'mutacion', original: codones(orig), mutada: codones(mut), pos: p, correcta: tipo };
    }
  }
}

export function pregunta(i = azar(PREGUNTAS.length)) {
  const [texto, ok, ...malas] = PREGUNTAS[i];
  return { tipo: 'pregunta', texto, opciones: mezclar([ok, ...malas]), correcta: ok };
}

// Final real de la región 5' no traducida + comienzo del gen: hay que tocar el AUG.
export function inicio() {
  return { tipo: 'inicio', secuencia: UTR5.replace(/T/g, 'U') + ARNM.slice(0, 9), indice: UTR5.length };
}
