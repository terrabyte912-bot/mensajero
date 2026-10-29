// Personajes en estilo plano, como SVG. Para cambiar un dibujo, editá su SVG acá.
// Se dibujan al doble de tamaño (más nítidos) y se muestran con escala 0.5: ver ESCALA.
import { COLOR_BASE, anticodon } from './data.js';

export const ESCALA = 0.5;
const hex = n => '#' + n.toString(16).padStart(6, '0');
const C = Object.fromEntries(Object.entries(COLOR_BASE).map(([k, v]) => [k, hex(v)]));
const TINTA = '#23233a';

// Oscurece un color #rrggbb (para contornos y sombras).
const osc = (h, f = 0.7) => {
  const n = parseInt(h.slice(1), 16), c = s => Math.round(((n >> s) & 255) * f);
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};
const borde = (color, w = 3) => `stroke="${osc(color)}" stroke-width="${w}" stroke-linejoin="round"`;

const svg = (w, h, cuerpo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}">${cuerpo}</svg>`;

// Con `cerrado` en true se dibujan los ojos cerrados: así se arma la versión para parpadear.
let cerrado = false;
const ojos = (x, y, sep = 14, r = 5.5) => [x, x + sep].map(cx => cerrado
  ? `<path d="M${cx - r} ${y} q${r} ${r * 0.8} ${2 * r} 0" stroke="${TINTA}" stroke-width="${Math.max(2, r / 2.4)}" fill="none" stroke-linecap="round"/>`
  : `<circle cx="${cx}" cy="${y}" r="${r}" fill="#fff" stroke="${TINTA}" stroke-opacity=".2"/>` +
    `<circle cx="${cx + r * 0.22}" cy="${y + r * 0.15}" r="${r * 0.56}" fill="${TINTA}"/>` +
    `<circle cx="${cx + r * 0.45}" cy="${y - r * 0.18}" r="${r * 0.2}" fill="#fff"/>`).join('');
const sonrisa = (x, y, w = 10) => `<path d="M${x} ${y} q${w / 2} ${w / 2.5} ${w} 0" stroke="${TINTA}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
const mejillas = (x1, x2, y, r = 4) => [x1, x2].map(x => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="#ff6f91" opacity=".4"/>`).join('');
const brillo = (cx, cy, rx, ry, rot = -25) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".38" transform="rotate(${rot} ${cx} ${cy})"/>`;
const texto = (x, y, t, tam = 13, color = '#fff') =>
  `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${tam}" text-anchor="middle" fill="${color}">${t}</text>`;

// El protagonista: cabeza = extremo 5' (con casquete), cola = extremo 3' (poli-A).
function arnm(casquete, cola) {
  const cuerpo = 'M42 58 Q57 38 72 58 T102 54', violeta = '#8e7cc3', cabeza = '#a495e0';
  return svg(140, 90, `
    ${cola ? `<path d="M42 58 q-5 -7 -10 0 t-10 0 t-10 0 t-10 0" fill="none" stroke="${osc(C.A)}" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 58 q-5 -7 -10 0 t-10 0 t-10 0 t-10 0" fill="none" stroke="${C.A}" stroke-width="5" stroke-linecap="round"/>` : ''}
    <path d="${cuerpo}" fill="none" stroke="${osc(violeta)}" stroke-width="19" stroke-linecap="round"/>
    <path d="${cuerpo}" fill="none" stroke="${violeta}" stroke-width="14" stroke-linecap="round"/>
    <path d="M46 52 Q57 36 70 50" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3.5" stroke-linecap="round"/>
    ${[[49.5, 50.5, 'A'], [64.5, 50.5, 'U'], [79.5, 65, 'G'], [94.5, 63, 'C']].map(([x, y, b]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${C[b]}" ${borde(C[b], 1.5)}/>`).join('')}
    <circle cx="112" cy="46" r="20" fill="${cabeza}" ${borde(cabeza)}/>
    ${brillo(104, 36, 7, 4)}
    ${casquete ? `<path d="M93 41 A19 19 0 0 1 131 41 Z" fill="${C.G}" ${borde(C.G, 2.5)}/>
      <rect x="90" y="38" width="44" height="6.5" rx="3.2" fill="#e0b22f" ${borde(C.G, 2)}/>
      ${brillo(105, 30, 6, 3, -15)}` : ''}
    ${ojos(105, 49)}${mejillas(100, 125, 56, 3.2)}${sonrisa(108, 57)}`);
}

const enzima = (color, simbolo = '', tam = 13) => svg(90, 90, `
  <circle cx="13" cy="56" r="9" fill="${color}" ${borde(color)}/><circle cx="77" cy="56" r="9" fill="${color}" ${borde(color)}/>
  <ellipse cx="45" cy="50" rx="34" ry="31" fill="${color}" ${borde(color)}/>
  <ellipse cx="45" cy="63" rx="22" ry="13" fill="#fff" fill-opacity=".25"/>
  ${brillo(31, 31, 11, 6)}
  ${ojos(37, 43, 16, 6)}${mejillas(30, 60, 52)}${sonrisa(40, 53)}${texto(45, 75, simbolo, tam)}`);

function arnt(codon, aa) {
  const cuerpo = '#ff9f6e', centro = '#ff8a50';
  const anti = codon ? anticodon(codon) : '';
  return svg(80, 124, `
    <rect x="34" y="14" width="12" height="34" rx="6" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/>
    ${aa ? `<circle cx="40" cy="13" r="12" fill="${C.G}" ${borde(C.G, 2.5)}/>${texto(40, 17, aa, 10, TINTA)}` : ''}
    <circle cx="15" cy="60" r="13" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/><circle cx="65" cy="60" r="13" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/>
    <rect x="34" y="66" width="12" height="26" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/><circle cx="40" cy="96" r="15" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/>
    <circle cx="40" cy="60" r="20" fill="${centro}" ${borde(centro, 2.5)}/>
    ${brillo(32, 50, 7, 4)}
    ${[...anti].map((b, i) => `<rect x="${27 + i * 9}" y="104" width="8" height="17" rx="3" fill="${C[b]}" ${borde(C[b], 1.5)}/>`).join('')}
    ${ojos(33, 58, 14, 5)}${mejillas(29, 51, 66, 3)}${sonrisa(35, 66)}`);
}

function adn() {
  let rungs = '', s1 = 'M', s2 = 'M';
  for (let y = 30; y <= 124; y += 4) {
    const dx = 18 * Math.sin(y / 11);
    s1 += `${35 - dx} ${y} `; s2 += `${35 + dx} ${y} `;
    if (y % 12 === 6) rungs += `<line x1="${35 - dx}" y1="${y}" x2="${35 + dx}" y2="${y}" stroke="${Object.values(C)[(y / 12) % 4 | 0]}" stroke-width="4" stroke-linecap="round"/>`;
  }
  const cabeza = '#6aa8f5';
  return svg(70, 130, `${rungs}
    <path d="${s1}" stroke="#1f63c4" stroke-width="7" fill="none"/><path d="${s1}" stroke="#2f80ed" stroke-width="4.5" fill="none"/>
    <path d="${s2}" stroke="#c7701f" stroke-width="7" fill="none"/><path d="${s2}" stroke="#f2994a" stroke-width="4.5" fill="none"/>
    <circle cx="35" cy="17" r="15" fill="${cabeza}" ${borde(cabeza)}/>${brillo(29, 9, 5, 3)}
    ${ojos(28, 16, 14, 5)}${mejillas(24, 46, 22, 2.8)}${sonrisa(30, 23)}`);
}

function dibujos() {
  const violeta = '#6c5ce7', lila = '#a29bfe', naranja = '#f2994a', rosa = '#b83280', azul = '#5c7cfa';
  const marron = '#a1887f', beige = '#d7ccc8', coral = '#ff8a65';
  const d = {
    'arnm-0': arnm(false, false),
    'arnm-1': arnm(true, false),
    'arnm-2': arnm(true, true),
    polimerasa: svg(120, 112, `
      <path d="M18 34 Q18 8 60 8 Q102 8 102 34 L102 88 Q102 106 60 106 Q18 106 18 88 Z" fill="${violeta}" ${borde(violeta)}/>
      ${brillo(38, 22, 16, 7, -10)}
      <path d="M4 82 H116" stroke="#1f63c4" stroke-width="9"/><path d="M4 82 H116" stroke="#2f80ed" stroke-width="6"/>
      <path d="M4 94 H116" stroke="#c7701f" stroke-width="9"/><path d="M4 94 H116" stroke="#f2994a" stroke-width="6"/>
      ${[14, 30, 46, 62, 78, 94, 108].map((x, i) => `<line x1="${x}" y1="85" x2="${x}" y2="91" stroke="${Object.values(C)[i % 4]}" stroke-width="4"/>`).join('')}
      ${ojos(44, 45, 32, 9)}${mejillas(34, 86, 62, 5)}
      <circle cx="44" cy="45" r="12.5" fill="none" stroke="${TINTA}" stroke-width="2.6"/><circle cx="76" cy="45" r="12.5" fill="none" stroke="${TINTA}" stroke-width="2.6"/>
      <path d="M56.5 44 Q60 41 63.5 44" stroke="${TINTA}" stroke-width="2.6" fill="none"/>${sonrisa(52, 63, 16)}`),
    casquete: enzima('#f2994a', 'cap'),
    poliA: enzima(C.A, 'AAA'),
    pabp: enzima('#56ccf2', 'PABP', 12),
    prs: enzima('#bb6bd9', 'PRS'),
    chaperona: enzima('#27ae60'),
    peptidasa: enzima(C.U),
    golgi: enzima('#f2b84b', 'Golgi', 12),
    histona: svg(90, 90, `<circle cx="45" cy="45" r="30" fill="${lila}" ${borde(lila)}/>${brillo(34, 30, 10, 6)}
      <ellipse cx="45" cy="48" rx="41" ry="13" fill="none" stroke="#1f63c4" stroke-width="8" transform="rotate(-18 45 48)"/>
      <ellipse cx="45" cy="48" rx="41" ry="13" fill="none" stroke="#2f80ed" stroke-width="5" transform="rotate(-18 45 48)"/>
      ${ojos(36, 36, 16, 5.5)}${mejillas(31, 60, 43, 3)}${sonrisa(40, 44)}`),
    arnasa: svg(96, 90, `
      <line x1="76" y1="12" x2="84" y2="70" stroke="#5d4037" stroke-width="7" stroke-linecap="round"/>
      <line x1="76" y1="12" x2="84" y2="70" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/>
      <path d="M71 66 L97 66 L92 87 L76 87 Z" fill="${C.G}" ${borde(C.G, 2.5)}/>
      <path d="M78 70 L79 85 M84 70 L84 85 M90 70 L89 85" stroke="${osc(C.G)}" stroke-width="1.5"/>
      <circle cx="44" cy="50" r="32" fill="${naranja}" ${borde(naranja)}/>${brillo(32, 34, 11, 6)}
      ${ojos(34, 43, 16, 6)}${mejillas(28, 60, 54, 4)}
      <ellipse cx="44" cy="59" rx="5" ry="4" fill="${TINTA}"/>`),
    virus: svg(120, 120, `
      ${[...Array(8)].map((_, i) => {
        const a = i * Math.PI / 4, x = 60 + 54 * Math.cos(a), y = 60 + 54 * Math.sin(a);
        return `<line x1="60" y1="60" x2="${x}" y2="${y}" stroke="#a3195b" stroke-width="7"/><line x1="60" y1="60" x2="${x}" y2="${y}" stroke="#e84393" stroke-width="4"/>
          <circle cx="${x}" cy="${y}" r="6.5" fill="#e84393" ${borde('#e84393', 2.5)}/>`;
      }).join('')}
      <polygon points="${[...Array(6)].map((_, i) => `${60 + 42 * Math.cos(i * Math.PI / 3 + Math.PI / 6)},${60 + 42 * Math.sin(i * Math.PI / 3 + Math.PI / 6)}`).join(' ')}" fill="${rosa}" ${borde(rosa, 3.5)}/>
      <polygon points="${[...Array(6)].map((_, i) => `${60 + 30 * Math.cos(i * Math.PI / 3 + Math.PI / 6)},${60 + 30 * Math.sin(i * Math.PI / 3 + Math.PI / 6)}`).join(' ')}" fill="#fff" fill-opacity=".08"/>
      ${brillo(44, 34, 12, 5, -30)}
      ${ojos(46, 57, 28, 8)}
      <path d="M35 42 L56 51 M85 42 L64 51" stroke="${TINTA}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M46 77 l6 -5 l6 5 l6 -5 l6 5 l6 -5" stroke="${TINTA}" stroke-width="3.2" fill="none" stroke-linejoin="round"/>`),
    ribosoma: svg(140, 112, `
      <ellipse cx="70" cy="88" rx="50" ry="21" fill="${beige}" ${borde(beige)}/>
      <ellipse cx="70" cy="40" rx="62" ry="35" fill="${marron}" ${borde(marron)}/>${brillo(46, 22, 18, 7, -12)}
      ${ojos(56, 37, 28, 7)}${mejillas(48, 92, 48, 4.5)}${sonrisa(62, 49, 16)}`),
    guardian: svg(124, 124, `
      ${[...Array(8)].map((_, i) => `<circle cx="${62 + 50 * Math.cos(i * Math.PI / 4)}" cy="${62 + 50 * Math.sin(i * Math.PI / 4)}" r="11" fill="#4263eb" ${borde('#4263eb', 2.5)}/>`).join('')}
      <circle cx="62" cy="62" r="50" fill="${azul}" ${borde(azul)}/>${brillo(40, 34, 14, 6)}
      <circle cx="62" cy="62" r="20" fill="#dbe4ff" stroke="#3b5bdb" stroke-width="3"/><circle cx="62" cy="62" r="11" fill="#bac8ff"/>
      ${ojos(45, 31, 34, 7)}<path d="M49 20 L60 25 M75 20 L64 25" stroke="${TINTA}" stroke-width="3.2" stroke-linecap="round"/>`),
    adn: adn(),
    interferon: svg(110, 90, `
      ${[12, 30, 48, 66, 84].map((x, i) => {
        const col = i % 2 ? '#1abc9c' : '#16a085', y = 18 + (i % 2) * 8, h = 60 - (i % 2) * 8;
        return `<rect x="${x}" y="${y}" width="16" height="${h}" rx="8" fill="${col}" ${borde(col, 2.5)}/>` +
          [...Array(4)].map((_, k) => `<path d="M${x + 3} ${y + 10 + k * 12} l10 -5" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>`).join('');
      }).join('')}
      <circle cx="55" cy="46" r="17" fill="#48d1b4" ${borde('#48d1b4')}/>${brillo(49, 38, 6, 3.5)}
      ${ojos(47, 43, 16, 5.5)}${mejillas(43, 67, 51, 3)}${sonrisa(50, 51)}`),
    mitocondria: svg(170, 84, `<rect x="4" y="4" width="162" height="76" rx="38" fill="${coral}" ${borde(coral, 3.5)}/>
      <rect x="14" y="13" width="142" height="58" rx="29" fill="#ffab91"/>
      <path d="M24 42 q8 -26 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#e64a19" stroke-width="5" stroke-linecap="round"/>
      ${brillo(46, 18, 22, 4, -4)}`),
    cartel: svg(70, 80, `<rect x="31" y="36" width="8" height="42" rx="2" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>
      <rect x="4" y="4" width="62" height="38" rx="9" fill="#fff8e1" stroke="#8d6e63" stroke-width="4"/>${texto(35, 31, 'i', 24, '#8d6e63')}`),
    // Globo de diálogo que aparece sobre quien te puede hablar.
    globo: svg(60, 50, `<path d="M10 4 H50 Q56 4 56 10 V30 Q56 36 50 36 H30 L20 46 L22 36 H10 Q4 36 4 30 V10 Q4 4 10 4 Z" fill="#fff" stroke="${violeta}" stroke-width="3"/>
      ${[18, 30, 42].map(x => `<circle cx="${x}" cy="20" r="3.6" fill="${violeta}"/>`).join('')}`),
    'arnt-gen': arnt('', ''),
  };
  for (const [c, aa] of Object.entries(ARNTS)) d[`arnt-${c}`] = arnt(c, aa);
  return d;
}

export const ARNTS = { AUG: 'Met', ACC: 'Thr', AAC: 'Asn', AAG: 'Lys' };
export const ARTE = dibujos();
cerrado = true;
const PARPADEO = dibujos();
cerrado = false;
// Versión con ojos cerrados de cada dibujo que tiene ojos: clave + '-p'.
for (const [k, s] of Object.entries(PARPADEO)) if (s !== ARTE[k]) ARTE[`${k}-p`] = s;

// Crea las texturas con <img> y data URLs (sin pedidos de red), así funciona también con doble clic.
export const cargarArte = scene => Promise.all(Object.entries(ARTE).map(([clave, s]) => new Promise((ok, mal) => {
  const img = new Image();
  img.onload = () => { scene.textures.addImage(clave, img); ok(); };
  img.onerror = mal;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
})));
