// Personajes en estilo plano, como SVG. Para cambiar un dibujo, editá su SVG acá
// (o reemplazá la entrada por un archivo: scene.load.svg(clave, 'assets/x.svg')).
import { COLOR_BASE, anticodon } from './data.js';

const hex = n => '#' + n.toString(16).padStart(6, '0');
const C = Object.fromEntries(Object.entries(COLOR_BASE).map(([k, v]) => [k, hex(v)]));
const TINTA = '#23233a';

const svg = (w, h, cuerpo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${cuerpo}</svg>`;
const ojos = (x, y, sep = 14, r = 5.5) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + sep}" cy="${y}" r="${r}" fill="#fff"/>` +
  `<circle cx="${x + 1.5}" cy="${y + 1}" r="${r / 2}" fill="${TINTA}"/><circle cx="${x + sep + 1.5}" cy="${y + 1}" r="${r / 2}" fill="${TINTA}"/>`;
const sonrisa = (x, y, w = 10) => `<path d="M${x} ${y} q${w / 2} ${w / 2.5} ${w} 0" stroke="${TINTA}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
const texto = (x, y, t, tam = 13, color = '#fff') =>
  `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="700" font-size="${tam}" text-anchor="middle" fill="${color}">${t}</text>`;

// El protagonista: cabeza = extremo 5' (con casquete), cola = extremo 3' (poli-A).
function arnm(casquete, cola) {
  return svg(140, 90, `
    ${cola ? `<path d="M42 58 q-5 -7 -10 0 t-10 0 t-10 0 t-10 0" fill="none" stroke="${C.A}" stroke-width="5" stroke-linecap="round"/>` : ''}
    <path d="M42 58 Q57 38 72 58 T102 54" fill="none" stroke="#8e7cc3" stroke-width="14" stroke-linecap="round"/>
    <circle cx="49.5" cy="50.5" r="4.5" fill="${C.A}"/><circle cx="64.5" cy="50.5" r="4.5" fill="${C.U}"/>
    <circle cx="79.5" cy="65" r="4.5" fill="${C.G}"/><circle cx="94.5" cy="63" r="4.5" fill="${C.C}"/>
    <circle cx="112" cy="46" r="20" fill="#a495e0"/>
    ${casquete ? `<path d="M93 41 A19 19 0 0 1 131 41 Z" fill="${C.G}"/><rect x="90" y="38" width="44" height="6" rx="3" fill="#d9ab2e"/>` : ''}
    ${ojos(105, 49)}${sonrisa(108, 57)}`);
}

const enzima = (color, simbolo = '', tam = 13) => svg(90, 90, `
  <circle cx="13" cy="56" r="9" fill="${color}"/><circle cx="77" cy="56" r="9" fill="${color}"/>
  <ellipse cx="45" cy="50" rx="34" ry="31" fill="${color}"/>
  <ellipse cx="45" cy="62" rx="22" ry="14" fill="#fff" fill-opacity=".25"/>
  ${ojos(37, 42, 16, 6)}${sonrisa(40, 52)}${texto(45, 74, simbolo, tam)}`);

function arnt(codon, aa) {
  const anti = anticodon(codon);
  return svg(80, 124, `
    <rect x="34" y="14" width="12" height="34" rx="6" fill="#ff9f6e"/>
    <circle cx="40" cy="13" r="12" fill="${C.G}"/>${texto(40, 17, aa, 10, TINTA)}
    <circle cx="15" cy="60" r="13" fill="#ff9f6e"/><circle cx="65" cy="60" r="13" fill="#ff9f6e"/>
    <rect x="34" y="66" width="12" height="26" fill="#ff9f6e"/><circle cx="40" cy="96" r="15" fill="#ff9f6e"/>
    <circle cx="40" cy="60" r="20" fill="#ff8a50"/>
    ${[...anti].map((b, i) => `<rect x="${27 + i * 9}" y="104" width="8" height="17" rx="3" fill="${C[b]}"/>`).join('')}
    ${ojos(33, 57, 14, 5)}${sonrisa(35, 65)}`);
}

function adn() {
  let rungs = '', s1 = 'M', s2 = 'M';
  for (let y = 30; y <= 124; y += 4) {
    const dx = 18 * Math.sin(y / 11);
    s1 += `${35 - dx} ${y} `; s2 += `${35 + dx} ${y} `;
    if (y % 12 === 6) rungs += `<line x1="${35 - dx}" y1="${y}" x2="${35 + dx}" y2="${y}" stroke="${Object.values(C)[(y / 12) % 4 | 0]}" stroke-width="4"/>`;
  }
  return svg(70, 130, `${rungs}
    <path d="${s1}" stroke="#2f80ed" stroke-width="5" fill="none"/><path d="${s2}" stroke="#f2994a" stroke-width="5" fill="none"/>
    <circle cx="35" cy="17" r="16" fill="#6aa8f5"/>${ojos(28, 15, 14, 5)}${sonrisa(30, 22)}`);
}

export const ARTE = {
  'arnm-0': arnm(false, false),
  'arnm-1': arnm(true, false),
  'arnm-2': arnm(true, true),
  polimerasa: svg(120, 112, `
    <path d="M18 34 Q18 8 60 8 Q102 8 102 34 L102 88 Q102 106 60 106 Q18 106 18 88 Z" fill="#6c5ce7"/>
    <path d="M6 82 H114" stroke="#2f80ed" stroke-width="6"/><path d="M6 94 H114" stroke="#f2994a" stroke-width="6"/>
    ${[14, 30, 46, 62, 78, 94, 108].map((x, i) => `<line x1="${x}" y1="84" x2="${x}" y2="92" stroke="${Object.values(C)[i % 4]}" stroke-width="4"/>`).join('')}
    ${ojos(44, 44, 32, 9)}
    <circle cx="44" cy="44" r="12" fill="none" stroke="${TINTA}" stroke-width="2.5"/><circle cx="76" cy="44" r="12" fill="none" stroke="${TINTA}" stroke-width="2.5"/>
    <path d="M56 44 H64" stroke="${TINTA}" stroke-width="2.5"/>${sonrisa(52, 62, 16)}`),
  casquete: enzima('#f2994a', 'cap'),
  poliA: enzima(C.A, 'AAA'),
  pabp: enzima('#56ccf2', 'PABP', 12),
  prs: enzima('#bb6bd9', 'PRS'),
  chaperona: enzima('#27ae60'),
  peptidasa: enzima(C.U),
  golgi: enzima('#f2b84b', 'Golgi', 12),
  histona: svg(90, 90, `<circle cx="45" cy="45" r="30" fill="#a29bfe"/>
    <ellipse cx="45" cy="48" rx="41" ry="13" fill="none" stroke="#2f80ed" stroke-width="5" transform="rotate(-18 45 48)"/>
    ${ojos(36, 36, 16, 5.5)}${sonrisa(40, 44)}`),
  arnasa: svg(96, 90, `<line x1="76" y1="12" x2="84" y2="70" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>
    <path d="M72 66 L96 66 L92 86 L76 86 Z" fill="${C.G}"/>
    <circle cx="44" cy="50" r="32" fill="#f2994a"/>${ojos(34, 42, 16, 6)}
    <ellipse cx="44" cy="58" rx="5" ry="4" fill="${TINTA}"/>`),
  virus: svg(120, 120, `
    ${[...Array(8)].map((_, i) => { const a = i * Math.PI / 4, x = 60 + 56 * Math.cos(a), y = 60 + 56 * Math.sin(a);
      return `<line x1="60" y1="60" x2="${x}" y2="${y}" stroke="#e84393" stroke-width="5"/><circle cx="${x}" cy="${y}" r="6" fill="#e84393"/>`; }).join('')}
    <polygon points="${[...Array(6)].map((_, i) => `${60 + 42 * Math.cos(i * Math.PI / 3 + Math.PI / 6)},${60 + 42 * Math.sin(i * Math.PI / 3 + Math.PI / 6)}`).join(' ')}" fill="#b83280"/>
    ${ojos(46, 56, 28, 8)}
    <path d="M36 42 L56 50 M84 42 L64 50" stroke="${TINTA}" stroke-width="4" stroke-linecap="round"/>
    <path d="M46 76 l6 -5 l6 5 l6 -5 l6 5 l6 -5" stroke="${TINTA}" stroke-width="3" fill="none" stroke-linejoin="round"/>`),
  ribosoma: svg(140, 112, `<ellipse cx="70" cy="40" rx="62" ry="36" fill="#a1887f"/>
    <ellipse cx="70" cy="88" rx="50" ry="22" fill="#d7ccc8"/>${ojos(56, 36, 28, 7)}${sonrisa(62, 48, 16)}`),
  guardian: svg(124, 124, `
    ${[...Array(8)].map((_, i) => `<circle cx="${62 + 50 * Math.cos(i * Math.PI / 4)}" cy="${62 + 50 * Math.sin(i * Math.PI / 4)}" r="11" fill="#4263eb"/>`).join('')}
    <circle cx="62" cy="62" r="50" fill="#5c7cfa"/><circle cx="62" cy="62" r="20" fill="#dbe4ff"/>
    ${ojos(45, 30, 34, 7)}<path d="M50 20 L60 24 M74 20 L64 24" stroke="${TINTA}" stroke-width="3" stroke-linecap="round"/>`),
  adn: adn(),
  interferon: svg(110, 90, `
    ${[12, 30, 48, 66, 84].map((x, i) => `<rect x="${x}" y="${18 + (i % 2) * 8}" width="16" height="${60 - (i % 2) * 8}" rx="8" fill="${i % 2 ? '#1abc9c' : '#16a085'}"/>`).join('')}
    <circle cx="55" cy="46" r="17" fill="#48d1b4"/>${ojos(47, 42, 16, 5.5)}${sonrisa(50, 50)}`),
  mitocondria: svg(170, 84, `<rect x="4" y="4" width="162" height="76" rx="38" fill="#ff8a65"/>
    <path d="M24 42 q8 -26 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#e64a19" stroke-width="5" stroke-linecap="round"/>`),
  cartel: svg(70, 80, `<rect x="31" y="36" width="8" height="42" fill="#8d6e63"/>
    <rect x="4" y="4" width="62" height="38" rx="8" fill="#fff8e1" stroke="#8d6e63" stroke-width="4"/>${texto(35, 30, 'i', 24, '#8d6e63')}`),
};
export const ARNTS = { AUG: 'Met', ACC: 'Thr', AAC: 'Asn', AAG: 'Lys' };
for (const [c, aa] of Object.entries(ARNTS)) ARTE[`arnt-${c}`] = arnt(c, aa);

// Crea las texturas con <img> y data URLs (sin pedidos de red), así funciona también con doble clic.
export const cargarArte = scene => Promise.all(Object.entries(ARTE).map(([clave, s]) => new Promise((ok, mal) => {
  const img = new Image();
  img.onload = () => { scene.textures.addImage(clave, img); ok(); };
  img.onerror = mal;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
})));
