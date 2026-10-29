(() => {
  // src/estado.js
  var CLAVE = "mensajero-partida";
  var nuevaPartida = () => ({
    zona: "nucleo",
    yo: "arnm",
    cola: 100,
    flags: {},
    paginas: "",
    pabp: 0,
    arnt: [],
    aciertos: 0,
    errores: 0,
    pos: null
  });
  var E = nuevaPartida();
  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(E));
    } catch {
    }
  }
  function hayPartida() {
    try {
      return !!localStorage.getItem(CLAVE);
    } catch {
      return false;
    }
  }
  function cargar() {
    try {
      E = { ...nuevaPartida(), ...JSON.parse(localStorage.getItem(CLAVE)) };
    } catch {
      E = nuevaPartida();
    }
  }
  function empezar() {
    E = nuevaPartida();
    guardar();
  }
  function darPagina() {
    const p = [..."AUCG"].find((b) => !E.paginas.includes(b));
    if (p) E.paginas += p;
    return p;
  }

  // src/data.js
  var CDS = "ATGACCAACAAGTGTCTCCTCCAAATTGCTCTCCTGTTGTGCTTCTCCACTACAGCTCTTTCCATGAGCTACAACTTGCTTGGATTCCTACAAAGAAGCAGCAATTTTCAGTGTCAGAAGCTCCTGTGGCAATTGAATGGGAGGCTTGAATACTGCCTCAAGGACAGGATGAACTTTGACATCCCTGAGGAGATTAAGCAGCTGCAGCAGTTCCAGAAGGAGGACGCCGCATTGACCATCTATGAGATGCTCCAGAACATCTTTGCTATTTTCAGACAAGATTCATCTAGCACTGGCTGGAATGAGACTATTGTTGAGAACCTCCTGGCTAATGTCTATCATCAGATAAACCATCTGAAGACAGTCCTGGAAGAAAAACTGGAGAAAGAAGATTTCACCAGGGGAAAACTCATGAGCAGTCTGCACCTGAAAAGATATTATGGGAGGATTCTGCATTACCTGAAGGCCAAGGAGTACAGTCACTGTGCCTGGACCATAGTCAGAGTGGAAATCCTAAGGAACTTTTACTTCATTAACAGACTTACAGGTTACCTCCGAAACTGA";
  var UTR5 = "GGCGACACTGTTCGTGTTGTCAAC";
  var ARNM = CDS.replace(/T/g, "U");
  var codones = (s) => s.match(/.{1,3}/g);
  var AA = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
  var B = "UCAG";
  var BASES = B;
  var traducir = (c) => AA[16 * B.indexOf(c[0]) + 4 * B.indexOf(c[1]) + B.indexOf(c[2])];
  var TODOS_CODONES = [...B].flatMap((a) => [...B].flatMap((b) => [...B].map((c) => a + b + c)));
  var NOMBRE = {
    F: ["Phe", "Fenilalanina"],
    L: ["Leu", "Leucina"],
    S: ["Ser", "Serina"],
    Y: ["Tyr", "Tirosina"],
    C: ["Cys", "Ciste\xEDna"],
    W: ["Trp", "Tript\xF3fano"],
    P: ["Pro", "Prolina"],
    H: ["His", "Histidina"],
    Q: ["Gln", "Glutamina"],
    R: ["Arg", "Arginina"],
    I: ["Ile", "Isoleucina"],
    M: ["Met", "Metionina"],
    T: ["Thr", "Treonina"],
    N: ["Asn", "Asparagina"],
    K: ["Lys", "Lisina"],
    V: ["Val", "Valina"],
    A: ["Ala", "Alanina"],
    D: ["Asp", "\xC1cido asp\xE1rtico"],
    E: ["Glu", "\xC1cido glut\xE1mico"],
    G: ["Gly", "Glicina"],
    "*": ["Stop", "Cod\xF3n de terminaci\xF3n"]
  };
  var aaTexto = (a) => a === "*" ? "Stop" : `${NOMBRE[a][0]} \xB7 ${NOMBRE[a][1]}`;
  var PAR_ARN = { A: "U", U: "A", C: "G", G: "C" };
  var MOLDE_DE_CODIFICANTE = { A: "T", T: "A", C: "G", G: "C" };
  var anticodon = (c) => [...c].map((b) => PAR_ARN[b]).join("");
  var COLOR_BASE = { A: 4046443, U: 15423319, T: 15898954, C: 3113197, G: 15911244 };
  var PREGUNTAS = [
    ["\xBFQu\xE9 base tiene el ARN en lugar de la timina (T)?", "Uracilo (U)", "Adenina (A)", "Citosina (C)", "Ninguna, tambi\xE9n tiene T"],
    ["\xBFD\xF3nde ocurre la transcripci\xF3n en una c\xE9lula eucariota?", "En el n\xFAcleo", "En el ribosoma", "En el aparato de Golgi", "En la mitocondria"],
    ["\xBFQu\xE9 az\xFAcar tiene el ARN?", "Ribosa", "Desoxirribosa", "Glucosa", "Sacarosa"],
    ["\xBFQu\xE9 enzima fabrica el ARNm copiando el ADN?", "La ARN polimerasa", "La ADN polimerasa", "La ARNasa", "El ribosoma"],
    ["\xBFCu\xE1ntas bases forman un cod\xF3n?", "3", "2", "4", "1"],
    ["\xBFCu\xE1l es el cod\xF3n de inicio?", "AUG", "UAA", "UGG", "GGG"],
    ["\xBFCu\xE1l de estos es un cod\xF3n de terminaci\xF3n (stop)?", "UGA", "AUG", "UGG", "GAU"],
    ["\xBFQu\xE9 mol\xE9cula lleva los amino\xE1cidos al ribosoma?", "El ARN de transferencia (ARNt)", "El ARN mensajero (ARNm)", "El ADN", "La ARN polimerasa"],
    ["\xBFQu\xE9 tiene el ARNm en su extremo 5'?", "Un casquete (cap)", "La cola poli-A", "El cod\xF3n stop", "Un anticod\xF3n"],
    ["\xBFPara qu\xE9 sirve la cola poli-A?", "Protege al ARNm y ayuda a exportarlo y traducirlo", "Indica d\xF3nde empieza la traducci\xF3n", "Lleva amino\xE1cidos al ribosoma", "Une las dos hebras del ADN"],
    ["\xBFQu\xE9 significa que el c\xF3digo gen\xE9tico es redundante (degenerado)?", "Varios codones distintos codifican el mismo amino\xE1cido", "Un cod\xF3n codifica varios amino\xE1cidos", "Cada especie tiene un c\xF3digo distinto", "Algunos codones se leen de a dos bases"],
    ["\xBFEn qu\xE9 sentido se fabrica el ARNm?", "De 5' a 3'", "De 3' a 5'", "En los dos sentidos a la vez", "Depende del gen"],
    ["\xBFQu\xE9 es el anticod\xF3n?", "Tres bases del ARNt que se aparean con el cod\xF3n", "El cod\xF3n que termina la traducci\xF3n", "La parte del ADN que no se copia", "El amino\xE1cido que lleva el ARNt"],
    ["\xBFQu\xE9 mol\xE9cula lleva la informaci\xF3n de un gen desde el n\xFAcleo hasta el ribosoma?", "El ARN mensajero (ARNm)", "El ADN", "El ARN de transferencia (ARNt)", "La prote\xEDna"],
    ["Si en el ADN molde hay una A, \xBFqu\xE9 base va en el ARNm?", "U", "T", "A", "G"],
    ["\xBFQu\xE9 hace un cod\xF3n stop?", "Termina la traducci\xF3n", "Agrega metionina", "Empieza la transcripci\xF3n", "Corta el ADN"]
  ];
  var DATO_INTRONES = "Dato real: el gen del interfer\xF3n beta (IFNB1) no tiene intrones, as\xED que su ARNm no necesita splicing.";

  // src/arte.js
  var ESCALA = 0.5;
  var hex = (n) => "#" + n.toString(16).padStart(6, "0");
  var C = Object.fromEntries(Object.entries(COLOR_BASE).map(([k, v]) => [k, hex(v)]));
  var TINTA = "#23233a";
  var osc = (h, f = 0.7) => {
    const n = parseInt(h.slice(1), 16), c = (s) => Math.round((n >> s & 255) * f);
    return `rgb(${c(16)},${c(8)},${c(0)})`;
  };
  var borde = (color, w = 3) => `stroke="${osc(color)}" stroke-width="${w}" stroke-linejoin="round"`;
  var svg = (w, h, cuerpo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}">${cuerpo}</svg>`;
  var cerrado = false;
  var ojos = (x, y, sep = 14, r = 5.5) => [x, x + sep].map((cx) => cerrado ? `<path d="M${cx - r} ${y} q${r} ${r * 0.8} ${2 * r} 0" stroke="${TINTA}" stroke-width="${Math.max(2, r / 2.4)}" fill="none" stroke-linecap="round"/>` : `<circle cx="${cx}" cy="${y}" r="${r}" fill="#fff" stroke="${TINTA}" stroke-opacity=".2"/><circle cx="${cx + r * 0.22}" cy="${y + r * 0.15}" r="${r * 0.56}" fill="${TINTA}"/><circle cx="${cx + r * 0.45}" cy="${y - r * 0.18}" r="${r * 0.2}" fill="#fff"/>`).join("");
  var sonrisa = (x, y, w = 10) => `<path d="M${x} ${y} q${w / 2} ${w / 2.5} ${w} 0" stroke="${TINTA}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  var mejillas = (x1, x2, y, r = 4) => [x1, x2].map((x) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="#ff6f91" opacity=".4"/>`).join("");
  var brillo = (cx, cy, rx, ry, rot = -25) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".38" transform="rotate(${rot} ${cx} ${cy})"/>`;
  var texto = (x, y, t, tam = 13, color = "#fff") => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="800" font-size="${tam}" text-anchor="middle" fill="${color}">${t}</text>`;
  function arnm(casquete, cola) {
    const cuerpo = "M42 58 Q57 38 72 58 T102 54", violeta = "#8e7cc3", cabeza = "#a495e0";
    return svg(140, 90, `
    ${cola ? `<path d="M42 58 q-5 -7 -10 0 t-10 0 t-10 0 t-10 0" fill="none" stroke="${osc(C.A)}" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 58 q-5 -7 -10 0 t-10 0 t-10 0 t-10 0" fill="none" stroke="${C.A}" stroke-width="5" stroke-linecap="round"/>` : ""}
    <path d="${cuerpo}" fill="none" stroke="${osc(violeta)}" stroke-width="19" stroke-linecap="round"/>
    <path d="${cuerpo}" fill="none" stroke="${violeta}" stroke-width="14" stroke-linecap="round"/>
    <path d="M46 52 Q57 36 70 50" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3.5" stroke-linecap="round"/>
    ${[[49.5, 50.5, "A"], [64.5, 50.5, "U"], [79.5, 65, "G"], [94.5, 63, "C"]].map(([x, y, b]) => `<circle cx="${x}" cy="${y}" r="4.6" fill="${C[b]}" ${borde(C[b], 1.5)}/>`).join("")}
    <circle cx="112" cy="46" r="20" fill="${cabeza}" ${borde(cabeza)}/>
    ${brillo(104, 36, 7, 4)}
    ${casquete ? `<path d="M93 41 A19 19 0 0 1 131 41 Z" fill="${C.G}" ${borde(C.G, 2.5)}/>
      <rect x="90" y="38" width="44" height="6.5" rx="3.2" fill="#e0b22f" ${borde(C.G, 2)}/>
      ${brillo(105, 30, 6, 3, -15)}` : ""}
    ${ojos(105, 49)}${mejillas(100, 125, 56, 3.2)}${sonrisa(108, 57)}`);
  }
  var enzima = (color, simbolo = "", tam = 13) => svg(90, 90, `
  <circle cx="13" cy="56" r="9" fill="${color}" ${borde(color)}/><circle cx="77" cy="56" r="9" fill="${color}" ${borde(color)}/>
  <ellipse cx="45" cy="50" rx="34" ry="31" fill="${color}" ${borde(color)}/>
  <ellipse cx="45" cy="63" rx="22" ry="13" fill="#fff" fill-opacity=".25"/>
  ${brillo(31, 31, 11, 6)}
  ${ojos(37, 43, 16, 6)}${mejillas(30, 60, 52)}${sonrisa(40, 53)}${texto(45, 75, simbolo, tam)}`);
  function arnt(codon2, aa) {
    const cuerpo = "#ff9f6e", centro = "#ff8a50";
    const anti = codon2 ? anticodon(codon2) : "";
    return svg(80, 124, `
    <rect x="34" y="14" width="12" height="34" rx="6" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/>
    ${aa ? `<circle cx="40" cy="13" r="12" fill="${C.G}" ${borde(C.G, 2.5)}/>${texto(40, 17, aa, 10, TINTA)}` : ""}
    <circle cx="15" cy="60" r="13" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/><circle cx="65" cy="60" r="13" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/>
    <rect x="34" y="66" width="12" height="26" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/><circle cx="40" cy="96" r="15" fill="${cuerpo}" ${borde(cuerpo, 2.5)}/>
    <circle cx="40" cy="60" r="20" fill="${centro}" ${borde(centro, 2.5)}/>
    ${brillo(32, 50, 7, 4)}
    ${[...anti].map((b, i) => `<rect x="${27 + i * 9}" y="104" width="8" height="17" rx="3" fill="${C[b]}" ${borde(C[b], 1.5)}/>`).join("")}
    ${ojos(33, 58, 14, 5)}${mejillas(29, 51, 66, 3)}${sonrisa(35, 66)}`);
  }
  function adn() {
    let rungs = "", s1 = "M", s2 = "M";
    for (let y = 30; y <= 124; y += 4) {
      const dx = 18 * Math.sin(y / 11);
      s1 += `${35 - dx} ${y} `;
      s2 += `${35 + dx} ${y} `;
      if (y % 12 === 6) rungs += `<line x1="${35 - dx}" y1="${y}" x2="${35 + dx}" y2="${y}" stroke="${Object.values(C)[y / 12 % 4 | 0]}" stroke-width="4" stroke-linecap="round"/>`;
    }
    const cabeza = "#6aa8f5";
    return svg(70, 130, `${rungs}
    <path d="${s1}" stroke="#1f63c4" stroke-width="7" fill="none"/><path d="${s1}" stroke="#2f80ed" stroke-width="4.5" fill="none"/>
    <path d="${s2}" stroke="#c7701f" stroke-width="7" fill="none"/><path d="${s2}" stroke="#f2994a" stroke-width="4.5" fill="none"/>
    <circle cx="35" cy="17" r="15" fill="${cabeza}" ${borde(cabeza)}/>${brillo(29, 9, 5, 3)}
    ${ojos(28, 16, 14, 5)}${mejillas(24, 46, 22, 2.8)}${sonrisa(30, 23)}`);
  }
  function dibujos() {
    const violeta = "#6c5ce7", lila = "#a29bfe", naranja = "#f2994a", rosa = "#b83280", azul = "#5c7cfa";
    const marron = "#a1887f", beige = "#d7ccc8", coral = "#ff8a65";
    const d = {
      "arnm-0": arnm(false, false),
      "arnm-1": arnm(true, false),
      "arnm-2": arnm(true, true),
      polimerasa: svg(120, 112, `
      <path d="M18 34 Q18 8 60 8 Q102 8 102 34 L102 88 Q102 106 60 106 Q18 106 18 88 Z" fill="${violeta}" ${borde(violeta)}/>
      ${brillo(38, 22, 16, 7, -10)}
      <path d="M4 82 H116" stroke="#1f63c4" stroke-width="9"/><path d="M4 82 H116" stroke="#2f80ed" stroke-width="6"/>
      <path d="M4 94 H116" stroke="#c7701f" stroke-width="9"/><path d="M4 94 H116" stroke="#f2994a" stroke-width="6"/>
      ${[14, 30, 46, 62, 78, 94, 108].map((x, i) => `<line x1="${x}" y1="85" x2="${x}" y2="91" stroke="${Object.values(C)[i % 4]}" stroke-width="4"/>`).join("")}
      ${ojos(44, 45, 32, 9)}${mejillas(34, 86, 62, 5)}
      <circle cx="44" cy="45" r="12.5" fill="none" stroke="${TINTA}" stroke-width="2.6"/><circle cx="76" cy="45" r="12.5" fill="none" stroke="${TINTA}" stroke-width="2.6"/>
      <path d="M56.5 44 Q60 41 63.5 44" stroke="${TINTA}" stroke-width="2.6" fill="none"/>${sonrisa(52, 63, 16)}`),
      casquete: enzima("#f2994a", "cap"),
      poliA: enzima(C.A, "AAA"),
      pabp: enzima("#56ccf2", "PABP", 12),
      prs: enzima("#bb6bd9", "PRS"),
      chaperona: enzima("#27ae60"),
      peptidasa: enzima(C.U),
      golgi: enzima("#f2b84b", "Golgi", 12),
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
          <circle cx="${x}" cy="${y}" r="6.5" fill="#e84393" ${borde("#e84393", 2.5)}/>`;
      }).join("")}
      <polygon points="${[...Array(6)].map((_, i) => `${60 + 42 * Math.cos(i * Math.PI / 3 + Math.PI / 6)},${60 + 42 * Math.sin(i * Math.PI / 3 + Math.PI / 6)}`).join(" ")}" fill="${rosa}" ${borde(rosa, 3.5)}/>
      <polygon points="${[...Array(6)].map((_, i) => `${60 + 30 * Math.cos(i * Math.PI / 3 + Math.PI / 6)},${60 + 30 * Math.sin(i * Math.PI / 3 + Math.PI / 6)}`).join(" ")}" fill="#fff" fill-opacity=".08"/>
      ${brillo(44, 34, 12, 5, -30)}
      ${ojos(46, 57, 28, 8)}
      <path d="M35 42 L56 51 M85 42 L64 51" stroke="${TINTA}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M46 77 l6 -5 l6 5 l6 -5 l6 5 l6 -5" stroke="${TINTA}" stroke-width="3.2" fill="none" stroke-linejoin="round"/>`),
      ribosoma: svg(140, 112, `
      <ellipse cx="70" cy="88" rx="50" ry="21" fill="${beige}" ${borde(beige)}/>
      <ellipse cx="70" cy="40" rx="62" ry="35" fill="${marron}" ${borde(marron)}/>${brillo(46, 22, 18, 7, -12)}
      ${ojos(56, 37, 28, 7)}${mejillas(48, 92, 48, 4.5)}${sonrisa(62, 49, 16)}`),
      guardian: svg(124, 124, `
      ${[...Array(8)].map((_, i) => `<circle cx="${62 + 50 * Math.cos(i * Math.PI / 4)}" cy="${62 + 50 * Math.sin(i * Math.PI / 4)}" r="11" fill="#4263eb" ${borde("#4263eb", 2.5)}/>`).join("")}
      <circle cx="62" cy="62" r="50" fill="${azul}" ${borde(azul)}/>${brillo(40, 34, 14, 6)}
      <circle cx="62" cy="62" r="20" fill="#dbe4ff" stroke="#3b5bdb" stroke-width="3"/><circle cx="62" cy="62" r="11" fill="#bac8ff"/>
      ${ojos(45, 31, 34, 7)}<path d="M49 20 L60 25 M75 20 L64 25" stroke="${TINTA}" stroke-width="3.2" stroke-linecap="round"/>`),
      adn: adn(),
      interferon: svg(110, 90, `
      ${[12, 30, 48, 66, 84].map((x, i) => {
        const col = i % 2 ? "#1abc9c" : "#16a085", y = 18 + i % 2 * 8, h = 60 - i % 2 * 8;
        return `<rect x="${x}" y="${y}" width="16" height="${h}" rx="8" fill="${col}" ${borde(col, 2.5)}/>` + [...Array(4)].map((_, k) => `<path d="M${x + 3} ${y + 10 + k * 12} l10 -5" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>`).join("");
      }).join("")}
      <circle cx="55" cy="46" r="17" fill="#48d1b4" ${borde("#48d1b4")}/>${brillo(49, 38, 6, 3.5)}
      ${ojos(47, 43, 16, 5.5)}${mejillas(43, 67, 51, 3)}${sonrisa(50, 51)}`),
      mitocondria: svg(170, 84, `<rect x="4" y="4" width="162" height="76" rx="38" fill="${coral}" ${borde(coral, 3.5)}/>
      <rect x="14" y="13" width="142" height="58" rx="29" fill="#ffab91"/>
      <path d="M24 42 q8 -26 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#e64a19" stroke-width="5" stroke-linecap="round"/>
      ${brillo(46, 18, 22, 4, -4)}`),
      cartel: svg(70, 80, `<rect x="31" y="36" width="8" height="42" rx="2" fill="#8d6e63" stroke="#5d4037" stroke-width="2"/>
      <rect x="4" y="4" width="62" height="38" rx="9" fill="#fff8e1" stroke="#8d6e63" stroke-width="4"/>${texto(35, 31, "i", 24, "#8d6e63")}`),
      // Globo de diálogo que aparece sobre quien te puede hablar.
      globo: svg(60, 50, `<path d="M10 4 H50 Q56 4 56 10 V30 Q56 36 50 36 H30 L20 46 L22 36 H10 Q4 36 4 30 V10 Q4 4 10 4 Z" fill="#fff" stroke="${violeta}" stroke-width="3"/>
      ${[18, 30, 42].map((x) => `<circle cx="${x}" cy="20" r="3.6" fill="${violeta}"/>`).join("")}`),
      "arnt-gen": arnt("", "")
    };
    for (const [c, aa] of Object.entries(ARNTS)) d[`arnt-${c}`] = arnt(c, aa);
    return d;
  }
  var ARNTS = { AUG: "Met", ACC: "Thr", AAC: "Asn", AAG: "Lys" };
  var ARTE = dibujos();
  cerrado = true;
  var PARPADEO = dibujos();
  cerrado = false;
  for (const [k, s] of Object.entries(PARPADEO)) if (s !== ARTE[k]) ARTE[`${k}-p`] = s;
  var cargarArte = (scene) => Promise.all(Object.entries(ARTE).map(([clave, s]) => new Promise((ok, mal) => {
    const img = new Image();
    img.onload = () => {
      scene.textures.addImage(clave, img);
      ok();
    };
    img.onerror = mal;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  })));

  // src/retos.js
  var azar = (n) => Math.floor(Math.random() * n);
  var elegir = (a) => a[azar(a.length)];
  var mezclar = (a) => {
    a = [...a];
    for (let i = a.length - 1; i > 0; i--) {
      const j = azar(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  var delasPaginas = (paginas) => TODOS_CODONES.filter((c) => paginas.includes(c[0]));
  var CODONES_GEN = codones(ARNM).slice(0, -1);
  function transcribir(n = 6, desde = azar((CDS.length - 3 - n) / 3) * 3) {
    const cod = CDS.slice(desde, desde + n);
    return { tipo: "transcribir", molde: [...cod].map((b) => MOLDE_DE_CODIFICANTE[b]).join(""), respuesta: cod.replace(/T/g, "U") };
  }
  function codon(paginas = BASES) {
    const c = elegir(delasPaginas(paginas));
    const a = traducir(c);
    const otros = mezclar(Object.keys(NOMBRE).filter((x) => x !== a)).slice(0, 3);
    return { tipo: "codon", codon: c, opciones: mezclar([a, ...otros]), correcta: a };
  }
  function distractores(ok, tipicos) {
    const s = new Set(tipicos.filter((x) => x !== ok));
    while (s.size < 3) {
      const x = elegir(TODOS_CODONES);
      if (x !== ok) s.add(x);
    }
    return mezclar([ok, ...[...s].slice(0, 3)]);
  }
  var reves = (s) => [...s].reverse().join("");
  function anticodonReto(paginas = BASES) {
    const c = elegir(delasPaginas(paginas));
    const ok = anticodon(c);
    return { tipo: "anticodon", codon: c, opciones: distractores(ok, [c, ok.replace(/U/g, "T"), reves(ok)]), correcta: ok };
  }
  function reclutar(codonDelArnt) {
    const anti = anticodon(codonDelArnt);
    return { tipo: "reclutar", anticodon: anti, opciones: distractores(codonDelArnt, [anti, reves(codonDelArnt)]), correcta: codonDelArnt };
  }
  var MUTACIONES = {
    silenciosa: ["Silenciosa", "El cod\xF3n cambi\xF3 pero sigue codificando el mismo amino\xE1cido: el c\xF3digo es redundante."],
    cambio: ["Cambio de sentido", "Cambi\xF3 una base y el cod\xF3n ahora codifica otro amino\xE1cido."],
    "sin sentido": ["Sin sentido", "El cod\xF3n se convirti\xF3 en un stop: la prote\xEDna queda cortada."],
    corrimiento: ["Corrimiento del marco", "Se agreg\xF3 o se perdi\xF3 una base: todos los codones siguientes se leen distinto."]
  };
  function mutacion(tipo = elegir(Object.keys(MUTACIONES))) {
    for (; ; ) {
      const i = 1 + azar(CODONES_GEN.length - 5);
      const orig = CODONES_GEN.slice(i, i + 4).join("");
      if (tipo === "corrimiento") {
        const p = 3 + azar(3);
        const mut = Math.random() < 0.5 ? orig.slice(0, p) + orig.slice(p + 1) : orig.slice(0, p) + elegir(BASES) + orig.slice(p);
        return { tipo: "mutacion", original: codones(orig), mutada: codones(mut), pos: p, correcta: tipo };
      }
      const posibles = [];
      for (let p = 3; p < 9; p++) for (const b of BASES) {
        if (b === orig[p]) continue;
        const mut = orig.slice(0, p) + b + orig.slice(p + 1);
        const k = p - p % 3;
        const a0 = traducir(orig.slice(k, k + 3)), a1 = traducir(mut.slice(k, k + 3));
        const t = a1 === a0 ? "silenciosa" : a1 === "*" ? "sin sentido" : "cambio";
        if (t === tipo) posibles.push({ mut, p });
      }
      if (posibles.length) {
        const { mut, p } = elegir(posibles);
        return { tipo: "mutacion", original: codones(orig), mutada: codones(mut), pos: p, correcta: tipo };
      }
    }
  }
  function pregunta(i = azar(PREGUNTAS.length)) {
    const [texto2, ok, ...malas] = PREGUNTAS[i];
    return { tipo: "pregunta", texto: texto2, opciones: mezclar([ok, ...malas]), correcta: ok };
  }
  function inicio() {
    return { tipo: "inicio", secuencia: UTR5.replace(/T/g, "U") + ARNM.slice(0, 9), indice: UTR5.length };
  }

  // src/fx.js
  var ANCHO = 1280;
  var ALTO = 720;
  function texturasBase(scene) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(16777215).fillCircle(8, 8, 8).generateTexture("punto", 16, 16).clear();
    for (let r = 32; r > 0; r -= 2) g.fillStyle(16777215, 0.05).fillCircle(32, 32, r);
    g.generateTexture("halo", 64, 64).clear();
    g.fillStyle(16777215).fillPoints([[12, 0], [15, 9], [24, 12], [15, 15], [12, 24], [9, 15], [0, 12], [9, 9]].map(([x, y]) => ({ x, y })), true).generateTexture("estrella", 24, 24).destroy();
    const t = scene.textures.createCanvas("vineta", ANCHO, ALTO), ctx2 = t.getContext();
    const grad = ctx2.createRadialGradient(ANCHO / 2, ALTO / 2, 380, ANCHO / 2, ALTO / 2, 860);
    grad.addColorStop(0, "rgba(30,20,70,0)");
    grad.addColorStop(1, "rgba(30,20,70,0.2)");
    ctx2.fillStyle = grad;
    ctx2.fillRect(0, 0, ANCHO, ALTO);
    t.refresh();
  }
  function chispas(scene, x, y, colores = [16777215], n = 22, { textura = "punto", velocidad = 260, gravedad = 300, escala = 0.6, profundidad = 4e3, fija = false } = {}) {
    const em = scene.add.particles(x, y, textura, {
      speed: { min: velocidad * 0.3, max: velocidad },
      angle: { min: 0, max: 360 },
      lifespan: { min: 450, max: 900 },
      scale: { start: escala, end: 0 },
      alpha: { start: 1, end: 0 },
      rotate: { min: 0, max: 360 },
      tint: colores,
      gravityY: gravedad,
      emitting: false
    }).setDepth(profundidad);
    if (fija) em.setScrollFactor(0);
    em.explode(n);
    scene.time.delayedCall(1100, () => em.destroy());
    return em;
  }
  function numero(scene, x, y, texto2, color = "#eb5757", tam = 34) {
    const t = scene.add.text(x, y, texto2, {
      fontFamily: "Nunito, system-ui, sans-serif",
      fontSize: tam + "px",
      fontStyle: "900",
      color,
      stroke: "#ffffff",
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(4100).setScale(0.4);
    scene.tweens.add({ targets: t, scale: 1, duration: 220, ease: "Back.out" });
    scene.tweens.add({ targets: t, y: y - 70, alpha: 0, delay: 450, duration: 700, ease: "Sine.in", onComplete: () => t.destroy() });
  }
  function ambiente(scene, ancho, alto, colores, frecuencia = 90) {
    return scene.add.particles(0, 0, "punto", {
      x: { min: 0, max: ancho },
      y: { min: 0, max: alto },
      lifespan: 9e3,
      speedX: { min: -10, max: 10 },
      speedY: { min: -16, max: -3 },
      scale: { min: 0.12, max: 0.5 },
      alpha: { values: [0, 0.55, 0], interpolation: "linear" },
      tint: colores,
      frequency: frecuencia,
      advance: 9e3
    }).setDepth(1);
  }
  function parpadeo(scene, lista) {
    scene.time.addEvent({
      delay: 260,
      loop: true,
      callback: () => {
        const s = Phaser.Utils.Array.GetRandom(lista());
        if (!s?.active || Math.random() > 0.45) return;
        const k = s.texture.key;
        if (k.endsWith("-p") || !scene.textures.exists(k + "-p")) return;
        s.setTexture(k + "-p");
        scene.time.delayedCall(130, () => s.active && s.texture.key === k + "-p" && s.setTexture(k));
      }
    });
  }
  function aparecer(scene, obj, escala = 1, demora = 0) {
    obj.setScale(escala * 0.3).setAlpha(0);
    scene.tweens.add({ targets: obj, scale: escala, alpha: 1, duration: 380, delay: demora, ease: "Back.out" });
  }
  var ctx = null;
  var activo = (() => {
    try {
      return localStorage.getItem("mensajero-sonido") !== "no";
    } catch {
      return true;
    }
  })();
  var sonidoActivo = () => activo;
  function alternarSonido() {
    activo = !activo;
    try {
      localStorage.setItem("mensajero-sonido", activo ? "si" : "no");
    } catch {
    }
    return activo;
  }
  function tono(f, t, dur, tipo = "sine", vol = 0.1, fFin) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t);
    if (fFin) o.frequency.exponentialRampToValueAtTime(fFin, t + dur);
    g.gain.setValueAtTime(1e-4, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.03);
  }
  function ruido(t, dur, vol, corte = 900) {
    const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 2;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = b;
    f.type = "lowpass";
    f.frequency.value = corte;
    g.gain.value = vol;
    s.connect(f).connect(g).connect(ctx.destination);
    s.start(t);
  }
  var SONIDOS = {
    clic: (t) => tono(700, t, 0.07, "triangle", 0.07, 900),
    hablar: (t) => tono(480 + Math.random() * 160, t, 0.035, "square", 0.018),
    abrir: (t) => tono(320, t, 0.18, "sine", 0.06, 640),
    bien: (t) => [660, 880, 1320].forEach((f, i) => tono(f, t + i * 0.08, 0.16, "triangle", 0.1)),
    mal: (t) => {
      tono(260, t, 0.28, "sawtooth", 0.045, 150);
      tono(180, t + 0.05, 0.25, "square", 0.03, 120);
    },
    golpe: (t) => {
      ruido(t, 0.2, 0.35);
      tono(160, t, 0.15, "sine", 0.15, 60);
    },
    herida: (t) => {
      ruido(t, 0.25, 0.25, 500);
      tono(300, t, 0.2, "triangle", 0.06, 120);
    },
    item: (t) => [988, 1319, 1568, 1976].forEach((f, i) => tono(f, t + i * 0.055, 0.14, "sine", 0.08)),
    victoria: (t) => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tono(f, t + i * 0.1, 0.24, "triangle", 0.1)),
    escudo: (t) => tono(400, t, 0.35, "sine", 0.08, 1200),
    paso: (t) => tono(220 + Math.random() * 40, t, 0.05, "sine", 0.03),
    zona: (t) => [392, 523, 659].forEach((f, i) => tono(f, t + i * 0.12, 0.5, "sine", 0.06))
  };
  function sonido(nombre) {
    if (!activo) return;
    try {
      ctx ??= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      SONIDOS[nombre]?.(ctx.currentTime + 0.01);
    } catch {
    }
  }

  // src/ui.js
  var ANCHO2 = 1280;
  var ALTO2 = 720;
  var TINTA2 = "#23233a";
  var VIOLETA = 7101671;
  var VERDE = 2600544;
  var ROJO = 15423319;
  var GRIS = 10133684;
  var FUENTE = 'Nunito, system-ui, "Segoe UI", Roboto, sans-serif';
  var estilo = (tam = 22, color = TINTA2, extra = {}) => ({ fontFamily: FUENTE, fontSize: tam + "px", color, fontStyle: "600", ...extra });
  var fondo = (scene, arriba, abajo) => scene.add.graphics().setScrollFactor(0).setDepth(-10).fillGradientStyle(arriba, arriba, abajo, abajo, 1).fillRect(0, 0, ANCHO2, ALTO2);
  var fijar = (o) => {
    o.setScrollFactor?.(0);
    o.list?.forEach(fijar);
  };
  var cortar = (p, x, y, ev) => ev?.stopPropagation();
  function boton(scene, x, y, w, h, etiqueta, alTocar, color = VIOLETA, tam = 22) {
    const c = scene.add.container(x, y);
    const g = scene.add.graphics();
    const r = Math.min(16, h / 2);
    c.pintar = (col) => g.clear().fillStyle(Phaser.Display.Color.ValueToColor(col).darken(18).color, 1).fillRoundedRect(-w / 2, -h / 2 + 5, w, h, r).fillStyle(col, 1).fillRoundedRect(-w / 2, -h / 2, w, h, r).fillStyle(16777215, 0.16).fillRoundedRect(-w / 2 + 4, -h / 2 + 3, w - 8, h * 0.42, { tl: r - 3, tr: r - 3, bl: 6, br: 6 });
    c.pintar(color);
    const t = scene.add.text(0, 0, etiqueta, estilo(tam, "#fff", { fontStyle: "800", align: "center", wordWrap: { width: w - 20 } })).setOrigin(0.5);
    c.add([g, t]).setSize(w, h).setInteractive({ useHandCursor: true });
    c.on("pointerdown", (...a) => {
      cortar(...a);
      sonido("clic");
      scene.tweens.add({ targets: c, scaleX: 0.93, scaleY: 0.9, duration: 70, yoyo: true, ease: "Sine.out" });
      alTocar();
    });
    c.on("pointerover", () => scene.tweens.add({ targets: c, scale: 1.04, duration: 120 })).on("pointerout", () => scene.tweens.add({ targets: c, scale: 1, duration: 120 }));
    c.texto = t;
    return c;
  }
  function panel(scene, x, y, w, h, color = 16777215) {
    return scene.add.graphics().fillStyle(2760550, 0.16).fillRoundedRect(x - w / 2, y - h / 2 + 7, w, h, 22).fillStyle(color, 1).fillRoundedRect(x - w / 2, y - h / 2, w, h, 22).lineStyle(3, 14998779, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 22);
  }
  function ficha(scene, x, y, base, tam = 56, borde2 = 0) {
    const c = scene.add.container(x, y);
    const g = scene.add.graphics();
    const pintar = (b, color) => {
      g.clear();
      if (borde2) g.lineStyle(4, borde2).strokeRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
      const col = color ?? COLOR_BASE[b];
      if (b) g.fillStyle(Phaser.Display.Color.ValueToColor(col).darken(15).color, 1).fillRoundedRect(-tam / 2, -tam / 2 + tam * 0.07, tam, tam, 10).fillStyle(col, 1).fillRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
      else g.lineStyle(3, GRIS).strokeRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
      t.setText(b || "");
    };
    const t = scene.add.text(0, 0, "", estilo(tam * 0.52, "#fff", { fontStyle: "900" })).setOrigin(0.5);
    c.add([g, t]);
    pintar(base);
    c.pintar = pintar;
    return c;
  }
  function fila(scene, cont, x, y, bases, tam, { marcar = -1, extremos = ["5'", "3'"], debajo } = {}) {
    const gap = 4, sepCodon = 14;
    const grupos = Math.ceil(bases.length / 3);
    const ancho = bases.length * (tam + gap) + (grupos - 1) * sepCodon;
    let cx = x - ancho / 2 + tam / 2;
    const fichas = [];
    [...bases].forEach((b, i) => {
      if (i && i % 3 === 0) cx += sepCodon;
      const f = ficha(scene, cx, y, b, tam, i === marcar ? 2302778 : 0);
      fichas.push(f);
      cont.add(f);
      if (debajo && i % 3 === 1) cont.add(scene.add.text(cx, y + tam * 0.85, debajo[(i - 1) / 3] ?? "", estilo(18, TINTA2)).setOrigin(0.5));
      cx += tam + gap;
    });
    if (extremos) {
      cont.add(scene.add.text(x - ancho / 2 - 14, y, extremos[0], estilo(22, TINTA2, { fontStyle: "bold" })).setOrigin(1, 0.5));
      cont.add(scene.add.text(x + ancho / 2 + 4, y, extremos[1], estilo(22, TINTA2, { fontStyle: "bold" })).setOrigin(0, 0.5));
    }
    return fichas;
  }
  function abrirCodonario(scene) {
    scene.scene.launch("Codonario", { todas: scene.scene.key === "Practica" });
    scene.scene.bringToTop("Codonario");
  }
  function crearReto(scene, r, alTerminar, { titulo } = {}) {
    const cx = ANCHO2 / 2, cy = ALTO2 / 2;
    const cont = scene.add.container(0, 0).setDepth(3e3).setScrollFactor(0);
    const fondo2 = scene.add.rectangle(cx, cy, ANCHO2, ALTO2, 0, 0.45).setInteractive();
    fondo2.on("pointerdown", cortar);
    cont.add([fondo2, panel(scene, cx, cy, 1160, 640)]);
    const tit = scene.add.text(cx, 70, "", estilo(26, TINTA2, { fontStyle: "bold", align: "center", wordWrap: { width: 1060 } })).setOrigin(0.5, 0);
    const aviso = scene.add.text(cx, 560, "", estilo(22, TINTA2, { align: "center", wordWrap: { width: 1060 } })).setOrigin(0.5, 0);
    cont.add([tit, aviso]);
    const botones = [];
    let listo = false;
    const terminar = (ok, explicacion, mal = "No era eso.") => {
      if (listo) return;
      listo = true;
      ok ? E.aciertos++ : E.errores++;
      botones.forEach((b) => b.disableInteractive());
      aviso.setColor(ok ? "#1e8449" : "#c0392b").setText(`${ok ? "\xA1Bien!" : mal} ${explicacion}`).setY(512);
      if (ok) {
        sonido("bien");
        chispas(scene, cx, 130, [7101671, 4046443, 15911244, 3113197, 15423319], 40, { textura: "estrella", fija: true, velocidad: 420, escala: 0.8 });
      } else {
        sonido("mal");
        scene.tweens.add({ targets: cont, x: { from: -12, to: 12 }, duration: 55, yoyo: true, repeat: 3, onComplete: () => cont.setX(0) });
      }
      scene.tweens.add({ targets: aviso, scale: { from: 0.85, to: 1 }, duration: 260, ease: "Back.out" });
      cont.add(boton(scene, cx, 640, 260, 60, "Continuar", () => {
        cont.destroy();
        alTerminar(ok);
      }, ok ? VERDE : VIOLETA));
      fijar(cont);
    };
    let limpiar = () => {
    };
    cont.once("destroy", () => limpiar());
    const conCodonario = () => {
      if (E.paginas || scene.scene.key === "Practica") cont.add(boton(scene, 1100, 84, 190, 48, "Codonario", () => abrirCodonario(scene), 15898954, 20));
    };
    const opciones = (lista, etiqueta, alElegir, { w = 520, h = 72, y0 = 360, cols = 2 } = {}) => {
      lista.forEach((op, i) => {
        const x = cols === 1 ? cx : cx + (i % 2 ? 1 : -1) * (w / 2 + 12);
        const y = y0 + Math.floor(i / cols) * (h + 14);
        const b = boton(scene, x, y, w, h, etiqueta(op), () => {
          b.setAlpha(1);
          alElegir(op, b);
        }, VIOLETA, 22);
        botones.push(b);
        cont.add(b);
      });
    };
    const marcarBotones = (correcta, elegido, etiqueta) => botones.forEach((b) => {
      if (b.texto.text === etiqueta(correcta)) {
        b.pintar(VERDE);
        scene.tweens.add({ targets: b, scale: 1.07, duration: 160, yoyo: true, repeat: 1 });
      } else if (b === elegido) b.pintar(ROJO);
      else b.setAlpha(0.55);
    });
    if (r.tipo === "transcribir") {
      tit.setText(titulo ?? "Transcrib\xED: arm\xE1 el ARNm que se aparea con el ADN molde");
      cont.add(scene.add.text(cx, 150, "ADN molde", estilo(20, "#555")).setOrigin(0.5));
      fila(scene, cont, cx, 200, r.molde, 56, { extremos: ["3'", "5'"] });
      cont.add(scene.add.text(cx, 270, "ARNm", estilo(20, "#555")).setOrigin(0.5));
      const huecos = fila(scene, cont, cx, 320, "A".repeat(r.respuesta.length), 56);
      huecos.forEach((f) => f.pintar(""));
      let i = 0, errores = 0;
      const cursor = scene.add.rectangle(huecos[0].x, 320 + 40, 40, 6, 2302778);
      cont.add(cursor);
      const tocar = (b) => {
        if (listo) return;
        const ok = r.respuesta[i];
        if (b === ok) {
          huecos[i].pintar(b);
          scene.tweens.add({ targets: huecos[i], scale: { from: 1.45, to: 1 }, duration: 260, ease: "Back.out" });
          chispas(scene, huecos[i].x, 320, [COLOR_BASE[b], 16777215], 10, { fija: true, velocidad: 180, escala: 0.4, gravedad: 0 });
          i++;
          if (i < huecos.length) cursor.x = huecos[i].x;
          else cursor.destroy();
          aviso.setText("");
          if (i === huecos.length) terminar(errores === 0, errores ? `Lo completaste con ${errores} error${errores > 1 ? "es" : ""}. Reglas: A\u2192U, T\u2192A, C\u2192G, G\u2192C.` : "Sin errores.", "Casi.");
        } else {
          errores++;
          aviso.setColor("#c0392b").setText(b === "T" ? "En el ARN no hay T: en su lugar va U (uracilo)." : `Frente a ${r.molde[i]} en el ADN va ${ok} en el ARN.`);
          sonido("mal");
          scene.cameras.main.shake(120, 4e-3);
        }
      };
      [..."AUGCT"].forEach((b, k) => {
        const bt = boton(scene, cx + (k - 2) * 130, 440, 110, 80, b, () => tocar(b), COLOR_BASE[b], 36);
        botones.push(bt);
        cont.add(bt);
      });
      const tecla = (ev) => {
        const k = ev.key.toUpperCase();
        if (k.length === 1 && "AUGCT".includes(k)) tocar(k);
      };
      scene.input.keyboard?.on("keydown", tecla);
      limpiar = () => scene.input.keyboard?.off("keydown", tecla);
    }
    if (r.tipo === "codon") {
      tit.setText(titulo ?? "\xBFQu\xE9 amino\xE1cido codifica este cod\xF3n?");
      conCodonario();
      fila(scene, cont, cx, 200, r.codon, 90);
      const et = aaTexto;
      opciones(r.opciones, et, (op, b) => {
        marcarBotones(r.correcta, b, et);
        terminar(op === r.correcta, `${r.codon} \u2192 ${aaTexto(r.correcta)}.${op === r.correcta ? "" : ` Buscalo en la p\xE1gina ${r.codon[0]} del Codonario.`}`);
      });
    }
    if (r.tipo === "anticodon" || r.tipo === "reclutar") {
      const anti = r.tipo === "anticodon";
      tit.setText(titulo ?? (anti ? "Llam\xE1 al ARNt correcto: \xBFqu\xE9 anticod\xF3n se aparea con este cod\xF3n?" : `Soy un ARNt con el anticod\xF3n 3'-${r.anticodon}-5'. \xBFQu\xE9 cod\xF3n del ARNm leo?`));
      if (anti) conCodonario();
      cont.add(scene.add.text(cx, 150, anti ? "Cod\xF3n del ARNm" : "Anticod\xF3n del ARNt", estilo(20, "#555")).setOrigin(0.5));
      fila(scene, cont, cx, 210, anti ? r.codon : r.anticodon, 80, { extremos: anti ? ["5'", "3'"] : ["3'", "5'"] });
      const et = (op) => anti ? `3'-${op}-5'` : `5'-${op}-3'`;
      opciones(r.opciones, et, (op, b) => {
        marcarBotones(r.correcta, b, et);
        const [cod, ac] = anti ? [r.codon, r.correcta] : [r.correcta, r.anticodon];
        terminar(
          op === r.correcta,
          `El cod\xF3n 5'-${cod}-3' se aparea con el anticod\xF3n 3'-${ac}-5': A con U, C con G.` + (op.includes("T") ? " Ojo: los ARN no tienen T." : "") + ` Ese ARNt lleva ${NOMBRE[traducir(cod)][1].toLowerCase()}.`
        );
      });
    }
    if (r.tipo === "mutacion") {
      tit.setText(titulo ?? "\xBFQu\xE9 tipo de mutaci\xF3n es?");
      conCodonario();
      const aas = r.original.map((c) => c.length === 3 ? NOMBRE[traducir(c)][0] : "");
      cont.add(scene.add.text(140, 165, "Original", estilo(20, "#555")).setOrigin(0, 0.5));
      fila(scene, cont, cx + 40, 165, r.original.join(""), 44, { debajo: aas });
      cont.add(scene.add.text(140, 275, "Mutada", estilo(20, "#555")).setOrigin(0, 0.5));
      fila(scene, cont, cx + 40, 275, r.mutada.join(""), 44, { marcar: r.pos });
      const et = (op) => MUTACIONES[op][0];
      opciones(Object.keys(MUTACIONES), et, (op, b) => {
        marcarBotones(r.correcta, b, et);
        let extra = "";
        if (r.correcta !== "corrimiento") {
          const k = Math.floor(r.pos / 3);
          extra = ` ${r.original[k]} (${NOMBRE[traducir(r.original[k])][0]}) \u2192 ${r.mutada[k]} (${NOMBRE[traducir(r.mutada[k])][0]}).`;
        }
        terminar(op === r.correcta, MUTACIONES[r.correcta][1] + extra);
      }, { y0: 380 });
    }
    if (r.tipo === "pregunta") {
      tit.setText(r.texto);
      const et = (op) => op;
      opciones(r.opciones, et, (op, b) => {
        marcarBotones(r.correcta, b, et);
        terminar(op === r.correcta, `Respuesta: ${r.correcta}.`);
      }, { y0: 250, h: 90, w: 540 });
    }
    if (r.tipo === "inicio") {
      tit.setText("El ribosoma recorre el ARNm desde el casquete 5'. Toc\xE1 el cod\xF3n de inicio.");
      let errores = 0;
      const tam = 30, gap = 3, x0 = cx - r.secuencia.length * (tam + gap) / 2 + tam / 2;
      cont.add(scene.add.text(x0 - 26, 260, "5'", estilo(22, TINTA2, { fontStyle: "bold" })).setOrigin(1, 0.5));
      const fichas = [...r.secuencia].map((b, k) => {
        const f = ficha(scene, x0 + k * (tam + gap), 260, b, tam);
        f.setSize(tam, tam).setInteractive({ useHandCursor: true }).on("pointerdown", (...a) => {
          cortar(...a);
          if (listo) return;
          if (k >= r.indice && k < r.indice + 3) {
            for (let j = 0; j < 3; j++) fichas[r.indice + j].setScale(1.3);
            terminar(errores === 0, "AUG es el cod\xF3n de inicio: codifica metionina (Met), as\xED que la traducci\xF3n empieza con Met.", "Lo encontraste, pero con errores.");
          } else {
            errores++;
            f.setAlpha(0.3);
            aviso.setColor("#c0392b").setText("Ese no es. Busc\xE1 las letras A-U-G seguidas, empezando desde el 5'.");
          }
        });
        cont.add(f);
        return f;
      });
    }
    fijar(cont);
    sonido("abrir");
    cont.setAlpha(0).setY(26);
    scene.tweens.add({ targets: cont, alpha: 1, y: 0, duration: 260, ease: "Back.out" });
    return cont;
  }

  // src/zonas.js
  var nuevaPagina = () => {
    const p = darPagina();
    return p ? [`\xA1Nueva p\xE1gina del Codonario! Ahora ten\xE9s los codones que empiezan con ${p}.`] : [];
  };
  var manchas = (g, rnd, n, ancho, alto, color, alfa, rmin, rmax) => {
    for (let i = 0; i < n; i++) g.fillStyle(color, alfa).fillCircle(rnd.between(0, ancho), rnd.between(0, alto), rnd.between(rmin, rmax));
  };
  var ribosomas = (g, rnd, n, ancho, alto) => {
    for (let i = 0; i < n; i++) {
      const x = rnd.between(30, ancho - 30), y = rnd.between(30, alto - 30);
      g.fillStyle(12363163, 1).fillCircle(x, y, 7).fillStyle(14470598, 1).fillCircle(x + 3, y + 8, 5);
    }
  };
  function fibras(g, rnd, n, ancho, alto, color) {
    g.lineStyle(4, color, 1);
    for (let i = 0; i < n; i++) {
      const y0 = rnd.between(0, alto);
      new Phaser.Curves.CubicBezier(
        new Phaser.Math.Vector2(0, y0),
        new Phaser.Math.Vector2(ancho / 3, y0 + rnd.between(-300, 300)),
        new Phaser.Math.Vector2(2 * ancho / 3, y0 + rnd.between(-300, 300)),
        new Phaser.Math.Vector2(ancho, rnd.between(0, alto))
      ).draw(g, 64);
    }
  }
  function envoltura(g, ancho, alto, color, fondo2) {
    g.lineStyle(26, color, 1).strokeRoundedRect(13, 13, ancho - 26, alto - 26, 120).lineStyle(6, 16777215, 0.55).strokeRoundedRect(13, 13, ancho - 26, alto - 26, 120);
    for (let x = 220; x < ancho - 200; x += 190) for (const y of [13, alto - 13]) g.fillStyle(fondo2, 1).fillCircle(x, y, 13).lineStyle(4, 9403094, 1).strokeCircle(x, y, 13);
    for (let y = 220; y < alto - 200; y += 190) g.fillStyle(fondo2, 1).fillCircle(13, y, 13).lineStyle(4, 9403094, 1).strokeCircle(13, y, 13);
  }
  function helice(g, x0, x1, y) {
    const colores = Object.values(COLOR_BASE);
    for (let x = x0; x <= x1; x += 22) {
      const dy = 22 * Math.sin(x / 30);
      g.lineStyle(5, colores[(x / 22 | 0) % 5], 1).lineBetween(x, y - dy, x, y + dy);
    }
    for (const [color, s] of [[3113197, 1], [15898954, -1]]) {
      g.lineStyle(8, color, 1).beginPath();
      for (let x = x0; x <= x1; x += 6) g.lineTo(x, y + s * 22 * Math.sin(x / 30));
      g.strokePath();
    }
  }
  var ZONAS = {
    nucleo: {
      nombre: "N\xFAcleo",
      ancho: 1800,
      alto: 1100,
      fondo: 15723003,
      inicio: [700, 680],
      decorar(m, g, rnd) {
        manchas(g, rnd, 22, 1800, 1100, 15064314, 0.8, 70, 150);
        manchas(g, rnd, 120, 1800, 1100, 14273782, 1, 3, 6);
        g.fillStyle(0, 0.06).fillCircle(1458, 342, 150);
        g.fillStyle(13615344, 1).fillCircle(1450, 330, 150).fillStyle(12562154, 1).fillCircle(1420, 300, 70).fillStyle(14471413, 1).fillCircle(1500, 380, 40);
        g.fillStyle(16777215, 0.45).fillRoundedRect(140, 520, 860, 80, 40);
        helice(g, 160, 980, 560);
        m.add.text(570, 610, "Gen IFNB1", estilo(20, "#6c5ce7", { fontStyle: "bold" })).setOrigin(0.5);
        envoltura(g, 1800, 1100, 12167398, 15723003);
      },
      circulos: [[1450, 330, 150]],
      npcs: [
        {
          id: "polimerasa",
          img: "polimerasa",
          x: 560,
          y: 545,
          nombre: "ARN polimerasa",
          hablar(m) {
            if (!E.flags.casquete || !E.flags.cola) return m.hablar([["ARN polimerasa", "Antes de salir del n\xFAcleo te faltan el casquete 5' y la cola poli-A. Busc\xE1 a las enzimas que los ponen."]]);
            if (E.flags.practica) return m.hablar([["ARN polimerasa", "Ya est\xE1s listo. La salida al poro nuclear est\xE1 a la derecha. \xA1Buen viaje!"]]);
            m.hablar([["ARN polimerasa", "\xBFPracticamos transcripci\xF3n antes de que te vayas? Tres tramos del gen, sin riesgo."]], () => m.batalla("practica", () => {
              E.flags.practica = true;
              m.hablar([["ARN polimerasa", "\xA1Muy bien!"], ...nuevaPagina()], () => m.reiniciar());
            }));
          }
        },
        {
          id: "casquete",
          img: "casquete",
          x: 1e3,
          y: 300,
          nombre: "Enzima del casquete",
          hablar(m) {
            if (E.flags.casquete) return m.hablar([["Enzima del casquete", "Ese casquete te queda b\xE1rbaro."]]);
            m.hablar([
              ["Enzima del casquete", "Hola. Yo pongo el casquete (cap) en el extremo 5' de los ARNm, apenas empieza la transcripci\xF3n."],
              ["Enzima del casquete", "Es una G modificada: protege tu punta y ayuda a que el ribosoma te reconozca."]
            ], () => {
              E.flags.casquete = true;
              m.reiniciar();
            });
          }
        },
        {
          id: "poliA",
          img: "poliA",
          x: 1250,
          y: 800,
          nombre: "Poli-A polimerasa",
          hablar(m) {
            if (!E.flags.casquete) return m.hablar([["Poli-A polimerasa", "Primero el casquete: se pone al principio de la transcripci\xF3n. La cola va al final, en el extremo 3'."]]);
            if (E.flags.cola) return m.hablar([["Poli-A polimerasa", "Cuid\xE1 esa cola: es tu reloj."]]);
            m.hablar([
              ["Poli-A polimerasa", "Te agrego una cola de muchas A en el extremo 3': en los humanos, unas 200."],
              ["Poli-A polimerasa", "La cola te protege. Pero en el citoplasma las ARNasas la van a ir recortando, y si se termina, te degradan."],
              ["Poli-A polimerasa", "Te la marco arriba a la izquierda. \xA1Cuidala!"]
            ], () => {
              E.flags.cola = true;
              m.reiniciar();
            });
          }
        },
        {
          id: "histona",
          img: "histona",
          x: 300,
          y: 280,
          nombre: "Histona",
          hablar: (m) => m.hablar([["Histona", "El ADN se enrolla alrededor de prote\xEDnas como yo. As\xED unos 2 metros de ADN entran en un n\xFAcleo chiquito."]])
        },
        {
          id: "cartel-gen",
          img: "cartel",
          x: 160,
          y: 450,
          nombre: "Gen",
          hablar: (m) => m.hablar(["Este es el gen IFNB1, en el cromosoma 9: tiene la receta del interfer\xF3n beta.", DATO_INTRONES])
        },
        {
          id: "cartel-nucleolo",
          img: "cartel",
          x: 1450,
          y: 540,
          nombre: "Nucl\xE9olo",
          hablar: (m) => m.hablar(["Nucl\xE9olo: ac\xE1 se fabrican las piezas de los ribosomas, que despu\xE9s salen al citoplasma."])
        }
      ],
      salidas: [{
        x: 1720,
        y: 490,
        w: 80,
        h: 160,
        etiqueta: "Poro nuclear \u2192",
        puede: () => !E.flags.casquete ? "Todav\xEDa no pod\xE9s salir: te falta el casquete 5'." : !E.flags.cola ? "Todav\xEDa no pod\xE9s salir: te falta la cola poli-A." : null,
        ir: (m) => m.irA("poro")
      }],
      alEntrar(m) {
        if (E.flags.nacido) return;
        m.historia([
          ["virus", "Una c\xE9lula de tu cuerpo fue infectada por un virus."],
          ["virus", "El virus quiere usar los ribosomas de la c\xE9lula para fabricar copias de s\xED mismo."],
          ["interferon", "La c\xE9lula tiene un plan: fabricar interfer\xF3n beta, una prote\xEDna que avisa a las c\xE9lulas vecinas para que se defiendan."],
          ["adn", "La receta est\xE1 en un gen, adentro del n\xFAcleo. Pero el ADN no sale del n\xFAcleo... hace falta un mensajero."],
          ["arnm-0", "Ese mensajero vas a ser vos: un ARN mensajero (ARNm)."]
        ], () => m.hablar([
          ["ARN polimerasa", "\xA1Hola! Soy la ARN polimerasa. Estoy por copiar el gen del interfer\xF3n... y la copia vas a ser vos."],
          ["ARN polimerasa", "Leo la hebra molde del ADN de 3' a 5' y voy armando el ARN de 5' a 3'."],
          ["ARN polimerasa", "Las reglas: frente a A va U; frente a T va A; frente a C va G; y frente a G va C. En el ARN no hay T: hay U."],
          ["ARN polimerasa", "Ayudame con las primeras nueve bases del gen."]
        ], () => m.reto(transcribir(9, 0), () => {
          E.flags.nacido = true;
          E.paginas = "A";
          m.hablar([
            ["ARN polimerasa", "\xA1Ah\xED est\xE1s! El resto lo copio yo: el gen tiene 564 bases que codifican prote\xEDna."],
            ["ARN polimerasa", "Te regalo el Codonario: la tabla del c\xF3digo gen\xE9tico. Por ahora tiene la p\xE1gina de los codones que empiezan con A, donde est\xE1 AUG, el cod\xF3n de inicio."],
            ["ARN polimerasa", "Antes de salir te faltan el casquete 5' y la cola poli-A. Busc\xE1 a las enzimas que los ponen."],
            'Movete con las flechas o WASD (en el celular, arrastrando el dedo). Para hablar, acercate y toc\xE1 "Hablar" o apret\xE1 Espacio.'
          ], () => m.reiniciar());
        })));
      }
    },
    poro: {
      nombre: "Poro nuclear",
      ancho: 1300,
      alto: 900,
      fondo: 15723003,
      inicio: [120, 450],
      decorar(m, g, rnd) {
        manchas(g, rnd, 8, 600, 900, 15064314, 0.8, 60, 130);
        manchas(g, rnd, 50, 600, 900, 14273782, 1, 3, 6);
        g.fillStyle(15005167, 1).fillRect(670, 0, 630, 900);
        manchas(g, rnd, 6, 630, 900, 13889510, 0.4, 60, 120);
        g.translateCanvas(670, 0);
        ribosomas(g, rnd, 20, 630, 900);
        g.translateCanvas(-670, 0);
        g.fillStyle(14208502, 1).fillRect(640, 0, 60, 900);
        for (const x of [645, 695]) g.fillStyle(10192856, 1).fillRoundedRect(x - 9, 0, 18, 380, 9).fillRoundedRect(x - 9, 520, 18, 380, 9);
        m.add.text(330, 790, "N\xDACLEO", estilo(26, "#9b87d8", { fontStyle: "800" })).setOrigin(0.5);
        m.add.text(990, 790, "CITOPLASMA", estilo(26, "#5fb79d", { fontStyle: "800" })).setOrigin(0.5);
      },
      paredes: () => [[630, 0, 80, 380], [630, 520, 80, 380], ...E.flags.poro ? [] : [[630, 380, 80, 140]]],
      npcs: [
        {
          id: "guardian",
          img: "guardian",
          x: 670,
          y: 450,
          nombre: "Complejo del poro",
          visible: () => !E.flags.poro,
          hablar(m) {
            m.hablar([
              ["Complejo del poro", "Alto. Controlo lo que entra y sale del n\xFAcleo."],
              ["Complejo del poro", "Solo dejo salir ARNm bien procesados... y que sepan bien lo que son. Respond\xE9 mis preguntas."]
            ], () => m.batalla("guardian", () => {
              E.flags.poro = true;
              m.hablar([["Complejo del poro", "Pod\xE9s pasar. \xA1Suerte en el citoplasma!"], ...nuevaPagina()], () => m.reiniciar());
            }));
          }
        },
        {
          id: "guardian2",
          img: "guardian",
          x: 560,
          y: 250,
          nombre: "Complejo del poro",
          visible: () => !!E.flags.poro,
          hablar: (m) => m.hablar([["Complejo del poro", "Pas\xE1 nom\xE1s. El ADN se queda; los ARNm salen."]])
        },
        {
          id: "adn",
          img: "adn",
          x: 300,
          y: 330,
          nombre: "ADN",
          hablar: (m) => m.hablar([["ADN", "Yo no salgo del n\xFAcleo. La c\xE9lula manda copias de mis genes: los ARN mensajeros, como vos."]])
        },
        {
          id: "actina",
          img: "arnm-2",
          x: 350,
          y: 660,
          nombre: "ARNm de la actina",
          hablar: (m) => m.hablar([["ARNm de la actina", "\xA1Hola, colega! Yo llevo la receta de la actina. Todo el tiempo salen mensajeros distintos, cada uno con la receta de una prote\xEDna."]])
        },
        {
          id: "cartel-envoltura",
          img: "cartel",
          x: 520,
          y: 200,
          nombre: "Envoltura nuclear",
          hablar: (m) => m.hablar(["Envoltura nuclear: dos membranas que rodean el n\xFAcleo. Las mol\xE9culas entran y salen por los poros."])
        }
      ],
      salidas: [{ x: 1230, y: 0, w: 70, h: 900, etiqueta: "Citoplasma \u2192", ir: (m) => m.irA("citoplasma") }]
    },
    citoplasma: {
      nombre: "Citoplasma",
      ancho: 2400,
      alto: 1300,
      fondo: 15005167,
      inicio: [120, 650],
      decorar(m, g, rnd) {
        manchas(g, rnd, 30, 2400, 1300, 13889510, 0.7, 60, 150);
        fibras(g, rnd, 6, 2400, 1300, 13363423);
        ribosomas(g, rnd, 90, 2400, 1300);
        for (let i = 0; i < 14; i++) g.lineStyle(4, 12116180, 1).strokeCircle(rnd.between(50, 2350), rnd.between(50, 1250), rnd.between(12, 22));
        for (const [, x, y] of this.obstaculos) g.fillStyle(0, 0.07).fillEllipse(x, y + 46, 150, 26);
      },
      obstaculos: [["mitocondria", 500, 500], ["mitocondria", 900, 180], ["mitocondria", 1e3, 780], ["mitocondria", 1480, 500], ["mitocondria", 1800, 1080], ["mitocondria", 1720, 200]],
      npcs: [
        ...Object.entries(ARNTS).map(([codon2, aa], i) => ({
          id: `arnt-${codon2}`,
          img: `arnt-${codon2}`,
          x: [300, 760, 1250, 1300][i],
          y: [250, 1060, 260, 1060][i],
          nombre: `ARNt-${aa}`,
          hablar(m) {
            if (E.arnt.includes(codon2)) return m.hablar([[`ARNt-${aa}`, 'En los combates, llamame con "Llamar ARNt".']]);
            m.hablar([[`ARNt-${aa}`, `Soy un ARN de transferencia: llevo el amino\xE1cido ${aa}. Si adivin\xE1s qu\xE9 cod\xF3n leo, me sumo a tu equipo.`]], () => m.reto(reclutar(codon2), (ok) => {
              if (!ok) return m.hablar([[`ARNt-${aa}`, "Casi. Volv\xE9 a hablarme cuando quieras."]]);
              E.arnt.push(codon2);
              m.hablar([[`ARNt-${aa}`, "\xA1Me sumo! En los combates pod\xE9s llamarme."], ...nuevaPagina()], () => m.reiniciar());
            }));
          }
        })),
        {
          id: "cartel-mito",
          img: "cartel",
          x: 380,
          y: 600,
          nombre: "Mitocondria",
          hablar: (m) => m.hablar(["Mitocondria: produce ATP, la energ\xEDa que usa la c\xE9lula. Fabricar prote\xEDnas gasta mucha energ\xEDa."])
        },
        {
          id: "ribosoma",
          img: "ribosoma",
          x: 2240,
          y: 650,
          nombre: "Ribosoma",
          hablar(m) {
            if (!E.flags.virus) return m.hablar([["Ribosoma", "\xA1Socorro! El virus me est\xE1 usando para fabricar sus prote\xEDnas."]]);
            m.hablar([
              ["Ribosoma", "\xA1Gracias por liberarme! Soy un ribosoma: tengo una subunidad grande y una chica."],
              ["Ribosoma", "Me pego cerca de tu casquete 5' y te recorro hasta encontrar el cod\xF3n de inicio."]
            ], () => {
              m.reto(inicio(), (ok) => m.traducir({ desde: 0, jugar: 6, hasta: 21 }, () => m.hablar([
                ["PRS", "\xA1Alto! Soy la part\xEDcula de reconocimiento de la se\xF1al (PRS)."],
                ["PRS", "Los primeros 21 amino\xE1cidos de esta prote\xEDna son un p\xE9ptido se\xF1al: quiere decir que va a salir de la c\xE9lula."],
                ["PRS", "Por eso llevo al ribosoma, con vos adentro, hasta el ret\xEDculo endoplasm\xE1tico rugoso. \xA1Vamos!"]
              ], () => {
                E.flags.trad1 = true;
                m.irA("reticulo");
              })));
            });
          }
        }
      ],
      enemigos: [
        { id: "arnasa1", img: "arnasa", tipo: "arnasa", x: 720, y: 380, rango: 220 },
        { id: "arnasa2", img: "arnasa", tipo: "arnasa", x: 1250, y: 680, rango: 240 },
        { id: "arnasa3", img: "arnasa", tipo: "arnasa", x: 1750, y: 820, rango: 220 },
        {
          id: "virus",
          img: "virus",
          tipo: "virus",
          x: 2020,
          y: 650,
          jefe: true,
          antes: [["Virus", "\xA1Ja! Este ribosoma ahora trabaja para m\xED. Va a fabricar mis prote\xEDnas, no las tuyas."], ["Virus", "Y si me quer\xE9s frenar... \xA1mis genes mutan todo el tiempo!"]],
          despues: [["Virus", "\xA1Nooo! Me voy a buscar otro ribosoma..."], "El ribosoma qued\xF3 libre. \xA1Hablale!"]
        }
      ],
      objetos: [[180, 1180], [1150, 90], [2050, 300]].map(([x, y], i) => ({
        id: `pabp${i}`,
        img: "pabp",
        x,
        y,
        tomar: (m) => {
          E.pabp++;
          m.hablar(["Encontraste una PABP: una prote\xEDna que se pega a la cola poli-A y la protege. Usala en un combate."]);
        }
      })),
      alEntrar(m) {
        if (E.flags.citoplasma) return;
        E.flags.citoplasma = true;
        m.hablar([
          "Llegaste al citoplasma. El ribosoma que necesit\xE1s est\xE1 a la derecha... pero hay un virus cerca.",
          "Cuidado con las ARNasas: limpian la c\xE9lula de ARN viejo y te van a recortar la cola. No son malas: es su trabajo.",
          "Busc\xE1 ARN de transferencia (ARNt): se suman a tu equipo si sab\xE9s qu\xE9 cod\xF3n leen."
        ]);
      }
    },
    reticulo: {
      nombre: "Ret\xEDculo endoplasm\xE1tico rugoso",
      ancho: 1800,
      alto: 1e3,
      fondo: 16642276,
      inicio: [200, 180],
      decorar(m, g, rnd) {
        manchas(g, rnd, 20, 1800, 1e3, 16508113, 0.8, 60, 140);
        for (const [x, y, w, h] of this.paredes) {
          g.fillStyle(0, 0.06).fillRoundedRect(x, y + 8, w, h, 34);
          g.fillStyle(16173480, 1).fillRoundedRect(x, y, w, h, 34);
          g.fillStyle(16506052, 1).fillRoundedRect(x + 16, y + 16, w - 32, h - 32, 18);
          g.fillStyle(10586239, 1);
          for (let px = x + 20; px < x + w - 10; px += 46) g.fillCircle(px, y - 4, 9).fillCircle(px + 18, y + h + 4, 9);
        }
        m.add.text(900, 960, 'Los ribosomas pegados a la membrana le dan el aspecto "rugoso".', estilo(20, "#b07a56")).setOrigin(0.5);
      },
      paredes: [[200, 250, 1350, 70], [250, 520, 1550, 70]],
      npcs: [
        { id: "chaperona", img: "chaperona", x: 700, y: 420, nombre: "Chaperona", hablar: (m) => m.hablar([["Chaperona", "Adentro del ret\xEDculo ayudo a las prote\xEDnas a plegarse bien. Una prote\xEDna mal plegada no funciona."]]) },
        { id: "peptidasa", img: "peptidasa", x: 1620, y: 760, nombre: "Peptidasa se\xF1al", hablar: (m) => m.hablar([["Peptidasa se\xF1al", "Cuando salga tu prote\xEDna, le voy a cortar el p\xE9ptido se\xF1al: ya no lo va a necesitar."]]) },
        {
          id: "ribosoma2",
          img: "ribosoma",
          x: 1350,
          y: 800,
          nombre: "Tu ribosoma",
          hablar(m) {
            m.hablar([["Ribosoma", "Ya estoy anclado al ret\xEDculo: la prote\xEDna va a ir entrando a su interior. \xA1Sigamos traduciendo!"]], () => m.traducir({ desde: 21, jugar: 27, hasta: ARNM.length / 3 - 1, stop: true }, () => m.hablar([
              ["Peptidasa se\xF1al", "Corto el p\xE9ptido se\xF1al. Quedan 166 amino\xE1cidos: el interfer\xF3n beta maduro."],
              ["Chaperona", "Y yo lo ayudo a plegarse. \xA1Listo!"],
              ["Ribosoma", "Te suelto... y enseguida otro ribosoma te empieza a leer de nuevo. De un solo ARNm salen muchas copias de la prote\xEDna."],
              "Ahora seguimos a la prote\xEDna que fabricaste: el interfer\xF3n beta. Viaja en una ves\xEDcula hasta el aparato de Golgi."
            ], () => {
              E.flags.trad2 = true;
              E.yo = "interferon";
              m.irA("golgi");
            })));
          }
        }
      ],
      alEntrar(m) {
        if (E.flags.reticulo) return;
        E.flags.reticulo = true;
        m.hablar(["Llegaste al ret\xEDculo endoplasm\xE1tico rugoso. Tu ribosoma ya est\xE1 anclado a la membrana: buscalo abajo a la derecha."]);
      }
    },
    golgi: {
      nombre: "Aparato de Golgi",
      ancho: 1600,
      alto: 900,
      fondo: 16774876,
      inicio: [120, 450],
      decorar(m, g, rnd) {
        manchas(g, rnd, 16, 1600, 900, 16640952, 0.7, 60, 130);
        for (let i = 0; i < 5; i++) g.lineStyle(30, i % 2 ? 16240506 : 15906891, 1).beginPath().arc(900 + i * 34, 450, 230 - i * 10, Math.PI * 0.68, Math.PI * 1.32).strokePath();
        g.fillStyle(16240506, 1);
        for (let i = 0; i < 14; i++) g.fillCircle(rnd.between(250, 1450), rnd.between(60, 840), rnd.between(10, 18));
        g.fillStyle(15906891, 1).fillRect(1540, 0, 60, 900);
        m.add.text(1500, 450, "Membrana\nplasm\xE1tica", estilo(20, "#b9861f", { align: "right", fontStyle: "bold" })).setOrigin(1, 0.5);
      },
      paredes: [[680, 250, 140, 400]],
      npcs: [{
        id: "golgi",
        img: "golgi",
        x: 480,
        y: 450,
        nombre: "Aparato de Golgi",
        hablar(m) {
          m.hablar([
            ["Golgi", "Bienvenido. En el Golgi muchas prote\xEDnas reciben az\xFAcares y se empaquetan en ves\xEDculas."],
            ["Golgi", "Te pongo en una ves\xEDcula que va a la membrana plasm\xE1tica. Desde ah\xED vas a salir de la c\xE9lula."]
          ], () => {
            E.flags.golgi = true;
            m.reiniciar();
          });
        }
      }],
      salidas: [{
        x: 1540,
        y: 0,
        w: 60,
        h: 900,
        etiqueta: "",
        puede: () => E.flags.golgi ? null : "Primero pas\xE1 por el aparato de Golgi.",
        ir: (m) => m.final()
      }],
      alEntrar(m) {
        if (E.flags.enGolgi) return;
        E.flags.enGolgi = true;
        m.hablar(["Ahora sos el interfer\xF3n beta. Llegaste en una ves\xEDcula desde el ret\xEDculo. Habl\xE1 con el aparato de Golgi."]);
      }
    }
  };

  // src/mundo.js
  var VELOCIDAD = 270;
  var CERCA = 120;
  var LEMAS = {
    nucleo: "Ac\xE1 est\xE1 el ADN",
    poro: "La puerta del n\xFAcleo",
    citoplasma: "Donde trabajan los ribosomas",
    reticulo: "Donde se fabrican las prote\xEDnas que salen de la c\xE9lula",
    golgi: "Empaque y env\xEDo"
  };
  var RETRATOS = {
    "ARN polimerasa": "polimerasa",
    "Enzima del casquete": "casquete",
    "Poli-A polimerasa": "poliA",
    Histona: "histona",
    "Complejo del poro": "guardian",
    ADN: "adn",
    "ARNm de la actina": "arnm-2",
    Ribosoma: "ribosoma",
    PRS: "prs",
    Virus: "virus",
    Chaperona: "chaperona",
    "Peptidasa se\xF1al": "peptidasa",
    Golgi: "golgi",
    ...Object.fromEntries(Object.entries(ARNTS).map(([c, aa]) => [`ARNt-${aa}`, `arnt-${c}`]))
  };
  var Mundo = class extends Phaser.Scene {
    constructor() {
      super("Mundo");
    }
    create() {
      const z = this.z = ZONAS[E.zona];
      this.ocupado = false;
      this.dialogo = null;
      this.cameras.main.setBackgroundColor(z.fondo).setBounds(0, 0, z.ancho, z.alto);
      const entrando = !this.sinFundido;
      if (entrando) this.cameras.main.fadeIn(350);
      this.sinFundido = false;
      this.physics.world.setBounds(0, 0, z.ancho, z.alto);
      const tono2 = Phaser.Display.Color.ValueToColor(z.fondo);
      const lejos = this.add.graphics().setScrollFactor(0.55).setDepth(-2), rnd = new Phaser.Math.RandomDataGenerator([E.zona + "lejos"]);
      for (let i = 0; i < 16; i++) lejos.fillStyle(tono2.clone().darken(5).color, 0.55).fillCircle(rnd.between(-100, z.ancho * 0.55 + 800), rnd.between(-100, z.alto * 0.55 + 500), rnd.between(90, 230));
      z.decorar(this, this.add.graphics(), new Phaser.Math.RandomDataGenerator([E.zona]));
      ambiente(this, z.ancho, z.alto, [tono2.clone().darken(22).color, tono2.clone().darken(12).color, 16777215], 70);
      const solidos = this.physics.add.staticGroup();
      const paredes = typeof z.paredes === "function" ? z.paredes() : z.paredes ?? [];
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
      this.sombras = [];
      const sombra = (s, sigue) => {
        const e = this.add.ellipse(s.x, s.y + s.displayHeight * 0.42, s.displayWidth * 0.7, 18, 0, 0.12).setDepth(2);
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
      this.rastro = this.add.particles(0, 0, "punto", {
        speed: { min: 5, max: 25 },
        lifespan: 600,
        scale: { start: 0.35, end: 0 },
        alpha: { start: 0.8, end: 0 },
        tint: Object.values(COLOR_BASE),
        frequency: 45,
        emitting: false
      }).setDepth(9);
      this.rastro.startFollow(this.yo);
      this.npcs = (z.npcs ?? []).filter((n) => !n.visible || n.visible()).map((n, i) => {
        const s = this.add.image(n.x, n.y, n.img).setScale(ESCALA).setDepth(5);
        sombra(s);
        this.physics.add.existing(s, true);
        s.body.setSize(s.displayWidth * 0.6, s.displayHeight * 0.5);
        this.physics.add.collider(this.yo, s);
        this.tweens.add({
          targets: s,
          y: n.y - 6,
          scaleY: ESCALA * 1.035,
          scaleX: ESCALA * 0.985,
          duration: 900 + i * 130,
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut"
        });
        const nombre = this.add.text(n.x, n.y - s.displayHeight / 2 - 18, n.nombre, estilo(16, "#4a4a68", { fontStyle: "800" })).setOrigin(0.5).setDepth(7);
        this.add.graphics().setDepth(6).fillStyle(16777215, 0.85).fillRoundedRect(nombre.x - nombre.width / 2 - 10, nombre.y - nombre.height / 2 - 3, nombre.width + 20, nombre.height + 6, 12);
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
          this.tweens.add({ targets: s, scale: esc * 1.08, duration: 700, yoyo: true, repeat: -1, ease: "Sine.inOut" });
          this.add.particles(0, 0, "punto", {
            speed: { min: 20, max: 70 },
            lifespan: 1100,
            scale: { start: 0.45, end: 0 },
            alpha: { start: 0.7, end: 0 },
            tint: [15221651, 12071552, 16748487],
            frequency: 70
          }).setDepth(7).startFollow(s);
        } else {
          this.tweens.add({ targets: s, angle: { from: -9, to: 9 }, duration: 380, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        }
        if (en.rango) {
          this.physics.add.collider(s, solidos);
          this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
              if (this.ocupado) return s.setVelocity(0, 0);
              const lejos2 = Phaser.Math.Distance.Between(s.x, s.y, en.x, en.y) > en.rango;
              const ang = lejos2 ? Phaser.Math.Angle.Between(s.x, s.y, en.x, en.y) : Math.random() * Math.PI * 2;
              s.setVelocity(Math.cos(ang) * 90, Math.sin(ang) * 90);
              s.setFlipX(Math.cos(ang) < 0);
            }
          });
        }
        this.physics.add.overlap(this.yo, s, () => this.chocar(s));
      }
      for (const o of z.objetos ?? []) {
        if (E.flags[o.id]) continue;
        const halo = this.add.image(o.x, o.y, "halo").setTint(5688562).setScale(1.8).setDepth(3).setBlendMode(Phaser.BlendModes.ADD);
        const s = this.physics.add.image(o.x, o.y, o.img).setScale(ESCALA * 0.6).setDepth(4);
        this.tweens.add({ targets: s, scale: ESCALA * 0.7, y: o.y - 6, duration: 600, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        this.tweens.add({ targets: halo, scale: 2.4, alpha: 0.5, duration: 900, yoyo: true, repeat: -1 });
        this.physics.add.overlap(this.yo, s, () => {
          if (this.ocupado || E.flags[o.id]) return;
          E.flags[o.id] = true;
          guardar();
          chispas(this, s.x, s.y, [5688562, 16777215, 2989275], 26, { textura: "estrella", gravedad: 0 });
          numero(this, s.x, s.y - 40, "+1 PABP", "#2d9cdb", 28);
          sonido("item");
          s.destroy();
          halo.destroy();
          o.tomar(this);
        });
      }
      this.salidas = z.salidas ?? [];
      for (const s of this.salidas) {
        const brillo2 = this.add.rectangle(s.x + s.w / 2, s.y + s.h / 2, s.w, s.h, 16777215, 0.45).setDepth(1);
        this.tweens.add({ targets: brillo2, alpha: 0.15, duration: 900, yoyo: true, repeat: -1 });
        if (s.etiqueta) {
          const t = this.add.text(s.x - 10, s.y + s.h / 2, s.etiqueta, estilo(22, "#4a4a68", { fontStyle: "800" })).setOrigin(1, 0.5).setDepth(2);
          this.tweens.add({ targets: t, x: s.x - 22, duration: 700, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        }
      }
      this.ultimo = [px, py];
      this.globo = this.add.image(0, 0, "globo").setScale(ESCALA).setDepth(12).setVisible(false);
      this.add.image(ANCHO2 / 2, ALTO2 / 2, "vineta").setScrollFactor(0).setDepth(990);
      parpadeo(this, () => [this.yo, ...this.npcs, ...this.enemigos]);
      this.crearHud();
      this.crearControles();
      if (!this.escuchaWake) {
        this.escuchaWake = true;
        this.events.on("wake", () => {
          this.input.keyboard.resetKeys();
          this.joy.activo = false;
        });
      }
      if (entrando) this.cartelZona();
      z.alEntrar?.(this);
      guardar();
    }
    texturaYo() {
      return E.yo === "interferon" ? "interferon" : `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`;
    }
    // Cartel con el nombre de la zona al entrar.
    cartelZona() {
      const c = this.add.container(ANCHO2 / 2, -90).setScrollFactor(0).setDepth(1500);
      const titulo = this.add.text(0, -14, this.z.nombre, estilo(34, "#6c5ce7", { fontStyle: "900" })).setOrigin(0.5);
      const lema = this.add.text(0, 24, LEMAS[E.zona] ?? "", estilo(18, "#4a4a68", { fontStyle: "700" })).setOrigin(0.5);
      const w = Math.max(titulo.width, lema.width) + 70;
      c.add([panel(this, 0, 0, w, 96), titulo, lema]);
      c.list.forEach((o) => o.setScrollFactor(0));
      sonido("zona");
      this.tweens.chain({
        targets: c,
        tweens: [
          { y: 110, duration: 500, ease: "Back.out", delay: 250 },
          { y: -90, duration: 400, ease: "Back.in", delay: 1800 }
        ],
        onComplete: () => c.destroy()
      });
    }
    crearHud() {
      const hud = [];
      const conCola = E.flags.cola && E.yo === "arnm";
      hud.push(panel(this, 200, conCola ? 70 : 46, 360, conCola ? 112 : 56));
      hud.push(this.add.text(36, 30, this.z.nombre, estilo(22, "#23233a", { fontStyle: "bold" })));
      if (conCola) {
        hud.push(this.add.text(36, 62, "Cola poli-A", estilo(16, "#555")));
        hud.push(this.add.rectangle(140, 72, 200, 16, 14540253).setOrigin(0, 0.5));
        hud.push(this.add.rectangle(140, 72, 2 * E.cola, 16, E.cola > 30 ? 4046443 : 15423319).setOrigin(0, 0.5));
        hud.push(this.add.rectangle(140, 67, 2 * E.cola, 5, 16777215, 0.35).setOrigin(0, 0.5));
        hud.push(this.add.text(36, 90, `PABP: ${E.pabp}   ARNt: ${E.arnt.length}`, estilo(16, "#555")));
      }
      if (E.paginas) hud.push(boton(this, ANCHO2 - 290, 44, 180, 52, "Codonario", () => !this.ocupado && abrirCodonario(this), 15898954, 20));
      hud.push(boton(this, ANCHO2 - 100, 44, 150, 52, "Men\xFA", () => {
        guardar();
        this.scene.start("Titulo");
      }, 10133684, 20));
      hud.forEach((o) => o.setScrollFactor(0).setDepth(1e3));
    }
    crearControles() {
      this.teclas = this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");
      for (const k of ["SPACE", "ENTER", "E"]) this.input.keyboard.on(`keydown-${k}`, () => this.accion());
      this.joy = { activo: false, vx: 0, vy: 0 };
      const base = this.add.circle(0, 0, 70, 0, 0.12).setStrokeStyle(3, 16777215, 0.5).setScrollFactor(0).setDepth(900).setVisible(false);
      const perilla = this.add.circle(0, 0, 32, 7101671, 0.7).setStrokeStyle(3, 16777215, 0.8).setScrollFactor(0).setDepth(901).setVisible(false);
      this.input.on("pointerdown", (p) => {
        if (this.dialogo) return this.avanzar();
        if (this.ocupado) return;
        Object.assign(this.joy, { activo: true, id: p.id, x: p.x, y: p.y, vx: 0, vy: 0 });
        base.setPosition(p.x, p.y).setVisible(true);
        perilla.setPosition(p.x, p.y).setVisible(true);
      });
      this.input.on("pointermove", (p) => {
        if (!this.joy.activo || p.id !== this.joy.id) return;
        const dx = p.x - this.joy.x, dy = p.y - this.joy.y, d = Math.hypot(dx, dy), k = Math.min(d, 70) / (d || 1);
        perilla.setPosition(this.joy.x + dx * k, this.joy.y + dy * k);
        this.joy.vx = d > 12 ? dx * k / 70 : 0;
        this.joy.vy = d > 12 ? dy * k / 70 : 0;
      });
      this.input.on("pointerup", (p) => {
        if (p.id !== this.joy.id) return;
        this.joy.activo = false;
        base.setVisible(false);
        perilla.setVisible(false);
      });
      this.botonHablar = boton(this, ANCHO2 - 110, ALTO2 - 110, 170, 110, "Hablar", () => this.accion(), VERDE, 28).setScrollFactor(0).setDepth(950).setVisible(false);
    }
    update(t) {
      let dx = 0, dy = 0;
      if (!this.ocupado) {
        const k2 = this.teclas;
        dx = (k2.RIGHT.isDown || k2.D.isDown) - (k2.LEFT.isDown || k2.A.isDown);
        dy = (k2.DOWN.isDown || k2.S.isDown) - (k2.UP.isDown || k2.W.isDown);
        if (this.joy.activo) {
          dx = this.joy.vx;
          dy = this.joy.vy;
        }
      }
      const len = Math.hypot(dx, dy);
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      this.yo.setVelocity(dx * VELOCIDAD, dy * VELOCIDAD);
      if (dx) this.yo.setFlipX(dx < 0);
      const mov = len > 0.15;
      const k = mov ? Math.sin(t / 70) : Math.sin(t / 420);
      this.yo.setScale(ESCALA * (1 + (mov ? 0.05 : 0.012) * k), ESCALA * (1 - (mov ? 0.07 : 0.02) * k));
      this.yo.rotation = Phaser.Math.Linear(this.yo.rotation, mov ? dy * 0.14 * (this.yo.flipX ? -1 : 1) : 0, 0.15);
      this.rastro.emitting = mov && E.flags.nacido;
      this.rastro.followOffset.set(this.yo.flipX ? 26 : -26, 6);
      for (const [s, e] of this.sombras) e.setPosition(s.x, s.y + s.displayHeight * 0.42);
      this.cerca = this.ocupado ? null : this.npcs.find((s) => Phaser.Math.Distance.Between(s.x, s.y, this.yo.x, this.yo.y) < CERCA + s.displayWidth / 3);
      this.botonHablar.setVisible(!!this.cerca);
      this.globo.setVisible(!!this.cerca);
      if (this.cerca) this.globo.setPosition(this.cerca.x + this.cerca.displayWidth * 0.35, this.cerca.y - this.cerca.displayHeight / 2 - 44 + Math.sin(t / 180) * 4);
      if (this.ocupado) return;
      const b = this.yo.body;
      const salida = this.salidas.find((s) => b.center.x > s.x && b.center.x < s.x + s.w && b.center.y > s.y && b.center.y < s.y + s.h);
      if (!salida) {
        this.ultimo = [this.yo.x, this.yo.y];
        return;
      }
      const motivo = salida.puede?.();
      if (motivo) {
        this.yo.setPosition(...this.ultimo).setVelocity(0, 0);
        this.hablar([motivo]);
      } else {
        this.ocupado = true;
        salida.ir(this);
      }
    }
    accion() {
      if (this.dialogo) return this.avanzar();
      if (this.ocupado || !this.cerca) return;
      sonido("clic");
      this.cerca.datos.hablar(this);
    }
    // Diálogo: lista de textos o de [quién, texto]. Avanza tocando la pantalla o con Espacio.
    hablar(lineas, fin) {
      if (!lineas.length) {
        this.ocupado = false;
        return fin?.();
      }
      this.ocupado = true;
      this.yo.setVelocity(0, 0);
      const caja = this.add.container(0, 220).setScrollFactor(0).setDepth(2e3);
      caja.add(panel(this, ANCHO2 / 2, ALTO2 - 105, 1220, 180));
      const fondoRetrato = this.add.circle(118, ALTO2 - 105, 66, 15723003).setStrokeStyle(4, 14735099);
      const retrato = this.add.image(118, ALTO2 - 105, "polimerasa");
      const quien = this.add.text(0, ALTO2 - 182, "", estilo(22, "#6c5ce7", { fontStyle: "800" }));
      const texto2 = this.add.text(0, ALTO2 - 150, "", estilo(25, "#23233a", { lineSpacing: 6 }));
      const seguir = this.add.text(ANCHO2 - 60, ALTO2 - 38, "\u25B6", estilo(22, "#6c5ce7")).setOrigin(1);
      caja.add([fondoRetrato, retrato, quien, texto2, seguir]);
      caja.list.forEach((o) => o.setScrollFactor(0));
      this.tweens.add({ targets: caja, y: 0, duration: 280, ease: "Back.out" });
      this.tweens.add({ targets: seguir, alpha: 0.2, x: ANCHO2 - 52, duration: 450, yoyo: true, repeat: -1 });
      this.dialogo = { lineas, i: 0, fin, caja, quien, texto: texto2, retrato, fondoRetrato, seguir, desde: this.time.now };
      this.mostrarLinea();
    }
    // Escribe la línea letra por letra (ya cortada en renglones, para que las palabras no salten).
    mostrarLinea() {
      const d = this.dialogo, l = d.lineas[d.i];
      const [q, t] = Array.isArray(l) ? l : ["", l];
      const img = RETRATOS[q];
      d.retrato.setVisible(!!img);
      d.fondoRetrato.setVisible(!!img);
      if (img) {
        d.retrato.setTexture(img).setScale(Math.min(1, 110 / d.retrato.width, 110 / d.retrato.height));
        this.tweens.add({ targets: d.retrato, angle: { from: -5, to: 5 }, duration: 110, yoyo: true, repeat: Math.min(12, Math.ceil(t.length / 10)), onComplete: () => d.retrato.setAngle(0) });
      }
      const x = img ? 210 : 55;
      d.quien.setText(q).setX(x);
      d.texto.setX(x).setY(q ? ALTO2 - 150 : ALTO2 - 165).setWordWrapWidth(ANCHO2 - x - 70);
      d.completo = d.texto.getWrappedText(t).join("\n");
      d.texto.setWordWrapWidth(null).setText("");
      d.seguir.setVisible(false);
      d.n = 0;
      this.escritura?.remove();
      this.escritura = this.time.addEvent({
        delay: 14,
        repeat: d.completo.length - 1,
        callback: () => {
          d.n++;
          d.texto.setText(d.completo.slice(0, d.n));
          if (d.n % 4 === 1) sonido("hablar");
          if (d.n >= d.completo.length) d.seguir.setVisible(true);
        }
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
      crearReto(this, r, (ok) => {
        this.ocupado = false;
        guardar();
        fin(ok);
      });
    }
    // Lanza otra escena (combate, traducción, historia) y vuelve acá al terminar.
    otraEscena(clave, datos, fin) {
      this.ocupado = true;
      E.pos = [this.yo.x, this.yo.y];
      guardar();
      this.scene.launch(clave, { ...datos, fin: (...r) => {
        this.scene.wake();
        this.ocupado = false;
        fin(...r);
      } });
      this.scene.sleep();
    }
    batalla(tipo, fin) {
      this.otraEscena("Batalla", { tipo }, (gano) => {
        if (gano) return fin(gano);
        E.cola = 100;
        E.pos = null;
        guardar();
        this.hablar(["Tu cola poli-A se termin\xF3 y las ARNasas te degradaron...", "...pero el gen sigue en el n\xFAcleo: la c\xE9lula hace una copia nueva. \xA1Segu\xEDs desde el comienzo de esta zona!"], () => this.scene.restart());
      });
    }
    traducir(datos, fin) {
      this.otraEscena("Traduccion", datos, fin);
    }
    historia(paginas, fin) {
      this.otraEscena("Historia", { paginas }, fin);
    }
    chocar(s) {
      if (this.ocupado) return;
      const en = s.datos;
      this.yo.setVelocity(0, 0);
      s.setVelocity?.(0, 0);
      this.ocupado = true;
      sonido("golpe");
      this.cameras.main.flash(220, 255, 255, 255).shake(200, 6e-3);
      chispas(this, (s.x + this.yo.x) / 2, (s.y + this.yo.y) / 2, [16777215, 15911244], 18, { textura: "estrella", gravedad: 0 });
      this.time.delayedCall(350, () => this.hablar(en.antes ?? [en.tipo === "arnasa" ? "Una ARNasa te encontr\xF3: \xA1quiere recortar tu cola poli-A!" : "\xA1Combate!"], () => this.batalla(en.tipo, () => {
        E.flags[en.id] = true;
        const p = en.jefe ? null : darPagina();
        const completo = en.jefe && E.paginas.length < 4;
        if (en.jefe) E.paginas = "AUCG";
        this.hablar([
          ...en.despues ?? ["La ARNasa se va a limpiar a otro lado."],
          ...p ? [`\xA1Nueva p\xE1gina del Codonario! Ahora ten\xE9s los codones que empiezan con ${p}.`] : [],
          ...completo ? ["\xA1Completaste el Codonario: ya ten\xE9s las cuatro p\xE1ginas!"] : []
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
      E.zona = zona;
      E.pos = null;
      guardar();
      this.cameras.main.fadeOut(400, 29, 24, 56);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.restart());
    }
    final() {
      this.historia([
        ["interferon", "La ves\xEDcula se fusiona con la membrana plasm\xE1tica y el interfer\xF3n beta sale de la c\xE9lula."],
        ["interferon", "Llega a las c\xE9lulas vecinas y les avisa que hay un virus. Ellas activan sus defensas antes de infectarse."],
        ["arnm-2", "Mientras tanto, muchos ribosomas leyeron al mismo ARNm, uno detr\xE1s de otro: de un solo mensajero salieron muchas copias de interfer\xF3n."],
        ["arnasa", "Con el tiempo, su cola poli-A se acort\xF3 y las ARNasas lo degradaron. No es algo malo: as\xED la c\xE9lula puede dejar de fabricar una prote\xEDna cuando ya no la necesita."],
        ["ribosoma", "Dato: las vacunas de ARNm usan esta misma idea. Le dan a la c\xE9lula un ARNm con la receta de una prote\xEDna del virus; la c\xE9lula la fabrica y el sistema inmune aprende a reconocerla."],
        [null, `\xA1Fin!

Respuestas correctas: ${E.aciertos}
Errores: ${E.errores}

Gracias por jugar a Mensajero.`]
      ], () => {
        E.flags.fin = true;
        guardar();
        this.scene.start("Titulo");
      });
    }
  };

  // src/batalla.js
  var RIVALES = {
    practica: { nombre: "Pr\xE1ctica con la polimerasa", img: "polimerasa", vida: 3, fondo: 15723003, contador: "Tramos que faltan" },
    guardian: { nombre: "Complejo del poro", img: "guardian", vida: 3, fondo: 14936822, contador: "Preguntas que faltan" },
    arnasa: { nombre: "ARNasa", img: "arnasa", vida: 60, fondo: 15005167 },
    virus: { nombre: "Virus", img: "virus", vida: 140, fondo: 16180463 }
  };
  var RX = 920;
  var RY = 245;
  var YX = 330;
  var YY = 420;
  var Batalla = class extends Phaser.Scene {
    constructor() {
      super("Batalla");
    }
    init(d) {
      this.d = d;
    }
    create() {
      const r = this.r = RIVALES[this.d.tipo];
      this.vida = r.vida;
      this.escudo = 0;
      this.preguntas = mezclar(PREGUNTAS.map((_, i) => i));
      this.cameras.main.fadeIn(250);
      const tono2 = Phaser.Display.Color.ValueToColor(r.fondo);
      fondo(this, tono2.clone().lighten(5).color, tono2.clone().darken(12).color);
      this.add.particles(0, 0, "punto", {
        x: { min: 0, max: ANCHO2 },
        y: { min: 0, max: ALTO2 },
        lifespan: 7e3,
        speedY: { min: -20, max: -5 },
        speedX: { min: -8, max: 8 },
        scale: { min: 0.15, max: 0.5 },
        alpha: { values: [0, 0.5, 0], interpolation: "linear" },
        frequency: 120,
        advance: 7e3,
        tint: [16777215, tono2.clone().darken(25).color]
      });
      this.add.ellipse(ANCHO2 / 2, 560, 1600, 300, 16777215, 0.35);
      this.add.image(RX, RY, "halo").setScale(6).setAlpha(0.5);
      this.add.image(YX, YY, "halo").setScale(5).setAlpha(0.4);
      this.add.ellipse(RX, 330, 320, 60, 0, 0.08);
      const escRival = ESCALA * (this.d.tipo === "virus" ? 1.9 : 1.6);
      this.rival = this.add.image(1500, RY, r.img).setScale(escRival);
      this.add.ellipse(YX, 482, 320, 60, 0, 0.08);
      this.yo = this.add.image(-250, YY, `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`).setScale(ESCALA * 1.7);
      this.burbuja = this.add.circle(YX, YY, 105).setStrokeStyle(6, 5688562, 0.9).setFillStyle(5688562, 0.12).setVisible(false);
      this.tweens.add({ targets: this.burbuja, scale: 1.06, alpha: 0.7, duration: 600, yoyo: true, repeat: -1 });
      this.tweens.add({
        targets: this.rival,
        x: RX,
        duration: 650,
        ease: "Back.out",
        onComplete: () => this.tweens.add({ targets: this.rival, y: RY - 10, scaleY: escRival * 1.03, duration: 1e3, yoyo: true, repeat: -1, ease: "Sine.inOut" })
      });
      this.tweens.add({
        targets: this.yo,
        x: YX,
        duration: 650,
        delay: 150,
        ease: "Back.out",
        onComplete: () => this.tweens.add({ targets: this.yo, y: YY - 6, scaleY: ESCALA * 1.75, duration: 800, yoyo: true, repeat: -1, ease: "Sine.inOut" })
      });
      if (this.d.tipo === "virus") this.add.particles(0, 0, "punto", {
        speed: { min: 20, max: 80 },
        lifespan: 1200,
        scale: { start: 0.6, end: 0 },
        alpha: { start: 0.7, end: 0 },
        tint: [15221651, 12071552, 16748487],
        frequency: 50
      }).startFollow(this.rival);
      parpadeo(this, () => [this.rival, this.yo]);
      const info = this.add.container(0, -160);
      info.add([panel(this, 330, 110, 460, 100), this.add.text(120, 72, r.nombre, estilo(24, "#23233a", { fontStyle: "800" }))]);
      if (r.contador) info.add(this.barraRival = this.add.text(120, 110, "", estilo(20, "#555")));
      else info.add([this.add.rectangle(120, 122, 400, 18, 14540253).setOrigin(0, 0.5), this.barraRival = this.add.rectangle(120, 122, 400, 18, 15423319).setOrigin(0, 0.5)]);
      this.tweens.add({ targets: info, y: 0, duration: 500, delay: 300, ease: "Back.out" });
      const mia = this.add.container(500, 0);
      mia.add([
        panel(this, 930, 440, 460, 100),
        this.add.text(720, 402, "Vos (ARNm)", estilo(24, "#23233a", { fontStyle: "800" })),
        this.add.text(720, 442, "Cola poli-A", estilo(16, "#555")),
        this.add.rectangle(830, 451, 300, 18, 14540253).setOrigin(0, 0.5),
        this.barraYo = this.add.rectangle(830, 451, 300, 18, 4046443).setOrigin(0, 0.5),
        this.textoEscudo = this.add.text(720, 466, "", estilo(16, "#2d9cdb", { fontStyle: "800" }))
      ]);
      this.tweens.add({ targets: mia, x: 0, duration: 500, delay: 400, ease: "Back.out" });
      panel(this, ANCHO2 / 2, 630, 1240, 160);
      this.texto = this.add.text(40, 568, "", estilo(24, "#23233a", { wordWrap: { width: 620 }, lineSpacing: 4 }));
      this.menu = this.add.container(0, 0);
      this.actualizar(true);
      this.esperar = null;
      const seguir = () => {
        if (this.esperar) {
          const f = this.esperar;
          this.esperar = null;
          f();
        }
      };
      this.input.on("pointerdown", seguir);
      this.input.keyboard.on("keydown-SPACE", seguir);
      this.input.keyboard.on("keydown-ENTER", seguir);
      const intro = {
        practica: "La polimerasa te va a dar tres tramos del gen para transcribir.",
        guardian: "El complejo del poro te va a hacer tres preguntas.",
        arnasa: "La ARNasa se acerca a tu cola poli-A.",
        virus: "\xA1El virus no quiere soltar el ribosoma!"
      }[this.d.tipo];
      sonido("abrir");
      this.time.delayedCall(700, () => this.msj(intro, () => this.turno()));
    }
    // Muestra un mensaje; al tocar sigue con `luego`.
    msj(texto2, luego) {
      this.texto.setText(texto2 + (luego ? "  \u25B6" : "")).setAlpha(0);
      this.tweens.add({ targets: this.texto, alpha: 1, duration: 200 });
      this.esperar = luego ?? null;
    }
    actualizar(inmediato) {
      const anima = (barra, ancho) => inmediato ? barra.width = ancho : this.tweens.add({ targets: barra, width: ancho, duration: 450, ease: "Cubic.out" });
      if (this.r.contador) this.barraRival.setText(`${this.r.contador}: ${this.vida}`);
      else anima(this.barraRival, 400 * Math.max(0, this.vida) / this.r.vida);
      anima(this.barraYo, 3 * Math.max(0, E.cola));
      this.barraYo.fillColor = E.cola > 30 ? 4046443 : 15423319;
      this.textoEscudo.setText(this.escudo ? `Protegida por PABP (${this.escudo})` : "");
      this.burbuja.setVisible(this.escudo > 0);
    }
    turno() {
      if (this.d.tipo === "practica") return this.reto(transcribir(6), (ok) => this.golpe(ok ? 1 : 0, ok ? "\xA1Tramo correcto!" : "Ese tramo tuvo errores. Probemos con otro."));
      if (this.d.tipo === "guardian") {
        if (!this.preguntas.length) this.preguntas = mezclar(PREGUNTAS.map((_, i) => i));
        return this.reto(pregunta(this.preguntas.pop()), (ok) => this.golpe(ok ? 1 : 0, ok ? "El guardi\xE1n asiente." : "El guardi\xE1n no est\xE1 convencido todav\xEDa."));
      }
      this.texto.setText("\xBFQu\xE9 hac\xE9s?");
      const acciones = [
        ["Leer cod\xF3n", VIOLETA, () => this.reto(codon(E.paginas), (ok) => this.golpe(ok ? 30 : 0, ok ? "\xA1Bien le\xEDdo! " + this.efecto() : "Fallaste la lectura."))],
        [`Llamar ARNt (${E.arnt.length})`, VERDE, E.arnt.length && (() => this.reto(anticodonReto(E.paginas), (ok) => this.golpe(ok ? 45 : 0, ok ? "\xA1Lleg\xF3 el ARNt correcto: golpe fuerte! " + this.efecto() : "Ese ARNt no se aparea con el cod\xF3n.", "arnt-gen")))],
        [`Usar PABP (${E.pabp})`, 2989275, E.pabp > 0 && (() => {
          E.pabp--;
          this.escudo = 2;
          this.actualizar();
          sonido("escudo");
          chispas(this, YX, YY, [5688562, 16777215], 30, { textura: "estrella", gravedad: 0 });
          this.msj("Una PABP se pega a tu cola poli-A: te protege de los pr\xF3ximos dos ataques.", () => this.turnoRival());
        })],
        ["Codonario", 15898954, () => abrirCodonario(this)]
      ];
      this.menu.removeAll(true);
      acciones.forEach(([etiqueta, color, f], i) => {
        const b = boton(this, 800 + i % 2 * 290, 595 + Math.floor(i / 2) * 72, 270, 60, etiqueta, () => {
          if (f) {
            if (i < 3) this.menu.removeAll(true);
            f();
          }
        }, f ? color : 13158608, 21);
        b.setScale(0.6).setAlpha(0);
        this.tweens.add({ targets: b, scale: 1, alpha: 1, duration: 260, delay: i * 50, ease: "Back.out" });
        this.menu.add(b);
      });
    }
    efecto() {
      return this.d.tipo === "virus" ? "El virus pierde el control del ribosoma." : "La ARNasa retrocede.";
    }
    reto(r, fin) {
      crearReto(this, r, fin);
    }
    // Animación de tu ataque: un proyectil vuela hasta el rival.
    lanzar(textura, alLlegar) {
      this.tweens.add({ targets: this.yo, x: YX + 70, duration: 130, yoyo: true, ease: "Quad.out" });
      const p = textura === "arnt-gen" ? this.add.image(YX + 60, YY - 20, textura).setScale(ESCALA * 0.9) : this.add.image(YX + 60, YY - 20, "halo").setTint(7101671).setScale(1.6).setBlendMode(Phaser.BlendModes.ADD);
      const estela = this.add.particles(0, 0, "punto", {
        speed: 20,
        lifespan: 380,
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.9, end: 0 },
        tint: Object.values(COLOR_BASE),
        frequency: 18
      }).startFollow(p);
      this.tweens.add({ targets: p, x: RX - 20, duration: 420, ease: "Quad.in", delay: 100 });
      this.tweens.add({
        targets: p,
        y: RY - 120,
        duration: 210,
        delay: 100,
        ease: "Sine.out",
        yoyo: true,
        onComplete: () => {
          p.destroy();
          estela.stop();
          this.time.delayedCall(400, () => estela.destroy());
          alLlegar();
        }
      });
      if (textura === "arnt-gen") this.tweens.add({ targets: p, angle: 360, duration: 420, delay: 100 });
    }
    impactoRival(texto2, colores = [15423319, 15911244, 16777215]) {
      sonido("golpe");
      this.rival.setTintFill(16777215);
      this.time.delayedCall(90, () => this.rival.clearTint());
      this.tweens.add({ targets: this.rival, x: RX + 18, duration: 50, yoyo: true, repeat: 3, onComplete: () => this.rival.setX(RX) });
      chispas(this, RX, RY, colores, 30, { textura: "estrella", velocidad: 340 });
      numero(this, RX + 40, RY - 90, texto2, "#eb5757", 40);
      this.cameras.main.shake(120, 5e-3);
    }
    golpe(danio, texto2, proyectil = "orbe") {
      const seguir = () => {
        this.actualizar();
        guardar();
        this.msj(texto2, () => this.vida <= 0 ? this.ganar() : this.turnoRival());
      };
      if (!danio) {
        chispas(this, YX + 40, YY - 40, [10133684, 16777215], 14, { gravedad: -60, velocidad: 120 });
        return seguir();
      }
      this.vida -= danio;
      if (this.r.contador) {
        sonido("bien");
        chispas(this, RX, RY - 60, [4046443, 16777215, 15911244], 26, { textura: "estrella", gravedad: 0 });
        numero(this, RX, RY - 110, "\xA1Bien!", "#1e8449", 36);
        this.tweens.add({ targets: this.rival, angle: { from: -8, to: 8 }, duration: 90, yoyo: true, repeat: 3, onComplete: () => this.rival.setAngle(0) });
        return seguir();
      }
      this.lanzar(proyectil, () => {
        this.impactoRival(`-${danio}`);
        seguir();
      });
    }
    turnoRival() {
      const t = this.d.tipo;
      if (t === "practica" || t === "guardian") return this.turno();
      if (t === "virus" && Math.random() < 0.5) {
        this.tweens.addCounter({
          from: 0,
          to: 8,
          duration: 700,
          onUpdate: (tw) => this.rival.setTint([16777215, 10181046, 4046443, 15911244][Math.floor(tw.getValue()) % 4]),
          onComplete: () => this.rival.clearTint()
        });
        chispas(this, RX, RY, [10181046, 4046443, 15911244], 24, { gravedad: 0, velocidad: 200 });
        sonido("abrir");
        return this.msj("\xA1El virus mut\xF3! Si identific\xE1s la mutaci\xF3n, anticip\xE1s su ataque.", () => this.reto(mutacion(), (ok) => ok ? this.esquivar() : this.ataque(18, "El virus te tom\xF3 por sorpresa.")));
      }
      this.ataque(t === "virus" ? 15 : 12, t === "virus" ? "El virus acapara ribosomas y perd\xE9s tiempo." : "La ARNasa recorta tu cola poli-A.");
    }
    esquivar() {
      this.tweens.add({ targets: this.rival, x: RX - 120, duration: 200, yoyo: true, ease: "Quad.in" });
      this.tweens.add({ targets: this.yo, y: YY - 90, duration: 220, yoyo: true, ease: "Quad.out" });
      numero(this, YX, YY - 120, "\xA1Esquivado!", "#2d9cdb", 32);
      sonido("bien");
      this.msj("\xA1Lo anticipaste! El ataque del virus falla.", () => this.turno());
    }
    ataque(n, texto2) {
      this.tweens.add({
        targets: this.rival,
        x: RX - 160,
        y: RY + 60,
        duration: 220,
        yoyo: true,
        ease: "Quad.in",
        onYoyo: () => {
          if (this.escudo) {
            this.escudo--;
            sonido("escudo");
            chispas(this, YX + 60, YY - 20, [5688562, 16777215], 24, { textura: "estrella", gravedad: 0 });
            numero(this, YX, YY - 120, "\xA1Bloqueado!", "#2d9cdb", 32);
            this.actualizar();
            return this.msj(`${texto2} \xA1Pero la PABP protege tu cola!`, () => this.turno());
          }
          E.cola = Math.max(0, E.cola - n);
          sonido("herida");
          this.cameras.main.shake(200, 8e-3);
          this.yo.setTint(16743291);
          this.time.delayedCall(250, () => this.yo.clearTint());
          chispas(this, YX - 60, YY + 10, [4046443, 16777215], 18, { velocidad: 220 });
          numero(this, YX - 40, YY - 110, `-${n} A`, "#eb5757", 36);
          this.actualizar();
          guardar();
          this.msj(`${texto2} Perd\xE9s ${n} A de tu cola.`, () => E.cola <= 0 ? this.perder() : this.turno());
        }
      });
    }
    ganar() {
      sonido("victoria");
      this.tweens.killTweensOf(this.rival);
      this.tweens.add({ targets: this.rival, scale: 0, angle: 200, alpha: 0, duration: 650, ease: "Back.in" });
      this.time.delayedCall(450, () => chispas(this, RX, RY, [7101671, 4046443, 15911244, 3113197, 15423319], 60, { textura: "estrella", velocidad: 480, escala: 0.9 }));
      const cartel = this.add.text(ANCHO2 / 2, 250, "\xA1Ganaste!", estilo(80, "#6c5ce7", { fontStyle: "900", stroke: "#ffffff", strokeThickness: 10 })).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: cartel, scale: 1, duration: 500, delay: 500, ease: "Back.out" });
      const texto2 = { practica: "\xA1Pr\xE1ctica completa!", guardian: "\xA1Respondiste todo!", arnasa: "\xA1La ARNasa se aleja!", virus: "\xA1El virus solt\xF3 el ribosoma!" }[this.d.tipo];
      this.msj(texto2, () => this.terminar(true));
    }
    perder() {
      this.tweens.killTweensOf(this.yo);
      this.tweens.add({ targets: this.yo, scaleY: 0.1, alpha: 0, duration: 700, ease: "Quad.in" });
      this.msj("Tu cola poli-A se termin\xF3...", () => this.terminar(false));
    }
    terminar(gano) {
      const fin = this.d.fin;
      this.scene.stop();
      fin(gano);
    }
  };

  // src/traduccion.js
  var PASO = 128;
  var SITIO_A = 760;
  var SITIO_P = SITIO_A - PASO;
  var Y_ARNM = 430;
  var CX = SITIO_A - PASO / 2;
  var posCadena = (n) => [SITIO_P - n * 42, 225 - 24 * Math.sin(n / 1.6)];
  var Traduccion = class extends Phaser.Scene {
    constructor() {
      super("Traduccion");
    }
    init(d) {
      this.d = d;
    }
    create() {
      const d = this.d;
      this.auto = this.saltar = this.moviendo = false;
      this.cods = codones(ARNM);
      this.i = d.desde;
      this.cadena = this.cods.slice(0, d.desde).map(traducir);
      this.cameras.main.fadeIn(250);
      fondo(this, d.desde ? 16774894 : 15792886, d.desde ? 16243910 : 13496034);
      this.add.particles(0, 0, "punto", {
        x: { min: 0, max: ANCHO2 },
        y: { min: 0, max: 720 },
        lifespan: 7e3,
        speedY: { min: -15, max: -4 },
        speedX: { min: -6, max: 6 },
        scale: { min: 0.15, max: 0.45 },
        alpha: { values: [0, 0.5, 0], interpolation: "linear" },
        frequency: 140,
        advance: 7e3,
        tint: [16777215, d.desde ? 15250575 : 9425853]
      });
      const sombra = this.add.ellipse(CX, 572, 420, 40, 0, 0.08);
      const chica = this.add.graphics({ x: CX, y: 512 }).fillStyle(12891566, 1).fillEllipse(0, 6, 400, 100).fillStyle(14142664, 1).fillEllipse(0, 0, 400, 92).fillStyle(16777215, 0.3).fillEllipse(-90, -18, 120, 22);
      const grande = this.add.container(CX, 340);
      grande.add(this.add.graphics().fillStyle(9268835, 1).fillEllipse(0, 10, 470, 170).fillStyle(10586239, 1).fillEllipse(0, 0, 470, 160).fillStyle(16777215, 0.22).fillEllipse(-120, -45, 160, 34).fillStyle(16740241, 0.35).fillEllipse(-78, -10, 26, 15).fillEllipse(78, -10, 26, 15));
      const abiertos = this.add.graphics(), cerrados = this.add.graphics().setVisible(false);
      for (const ox of [-40, 40]) {
        abiertos.fillStyle(16777215, 1).fillCircle(ox, -40, 15).fillStyle(2302778, 1).fillCircle(ox + 3, -38, 8).fillStyle(16777215, 1).fillCircle(ox + 6, -43, 3);
        cerrados.lineStyle(5, 2302778, 1).beginPath().arc(ox, -42, 12, 0.15 * Math.PI, 0.85 * Math.PI).strokePath();
      }
      grande.add([abiertos, cerrados, this.add.graphics().lineStyle(4, 2302778, 1).beginPath().arc(0, -22, 16, 0.2 * Math.PI, 0.8 * Math.PI).strokePath()]);
      this.time.addEvent({ delay: 2600, loop: true, callback: () => {
        abiertos.setVisible(false);
        cerrados.setVisible(true);
        this.time.delayedCall(140, () => {
          abiertos.setVisible(true);
          cerrados.setVisible(false);
        });
      } });
      this.tweens.add({ targets: [grande, chica], scaleX: 1.012, scaleY: 1.03, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.tweens.add({ targets: sombra, scaleX: 0.96, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      for (const [x, l] of [[SITIO_P, "P"], [SITIO_A, "A"]]) this.add.text(x, 384, `sitio ${l}`, estilo(18, "#fff", { fontStyle: "800" })).setOrigin(0.5);
      this.tira = this.add.container(0, 0).setDepth(5);
      this.proteina = this.add.container(0, 0).setDepth(6);
      this.titulo = this.add.text(ANCHO2 / 2, 30, "", estilo(26, "#23233a", { fontStyle: "800", align: "center", wordWrap: { width: 1200 } })).setOrigin(0.5, 0);
      this.contador = this.add.text(ANCHO2 - 30, 120, "", estilo(22, "#555", { fontStyle: "700" })).setOrigin(1, 0);
      this.aviso = this.add.text(ANCHO2 / 2, 560, "", estilo(22, "#23233a", { align: "center", wordWrap: { width: 1200 } })).setOrigin(0.5, 0).setDepth(8);
      this.opciones = this.add.container(0, 0).setDepth(9);
      this.dibujar();
      this.paso();
    }
    dibujar() {
      this.tira.removeAll(true).setX(0);
      for (let k = this.i - 6; k <= this.i + 5; k++) {
        if (k < 0 || k >= this.cods.length) continue;
        const x = SITIO_A + (k - this.i) * PASO;
        [...this.cods[k]].forEach((b, j) => this.tira.add(ficha(this, x + (j - 1) * 38, Y_ARNM, b, 34, k === this.i ? 2302778 : 0)));
      }
      if (this.i - 6 <= 0) this.tira.add(this.add.text(SITIO_A + -this.i * PASO - 80, Y_ARNM, "5'", estilo(22, "#23233a", { fontStyle: "800" })).setOrigin(1, 0.5));
      this.proteina.removeAll(true);
      const ultimos = this.cadena.slice(-14);
      ultimos.forEach((a, j) => {
        const n = ultimos.length - 1 - j, [x, y] = posCadena(n);
        if (n) {
          const [x2, y2] = posCadena(n - 1);
          this.proteina.add(this.add.line(0, 0, x, y, x2, y2, 949350).setOrigin(0).setLineWidth(4));
        }
        this.proteina.add(this.add.circle(x, y, 20, j % 2 ? 1482885 : 1752220).setStrokeStyle(3, 949350));
        this.proteina.add(this.add.text(x, y, NOMBRE[a][0], estilo(13, "#fff", { fontStyle: "800" })).setOrigin(0.5));
      });
      this.contador.setText(`Amino\xE1cidos: ${this.cadena.length} / ${this.cods.length - 1}`);
    }
    paso() {
      const d = this.d;
      if (this.i < d.jugar) return this.elegir();
      if (this.i < d.hasta) {
        if (!this.auto) {
          this.auto = true;
          this.titulo.setText("Muy bien. Ahora el ribosoma sigue solo, cod\xF3n por cod\xF3n...");
          this.aviso.setText("");
          this.opciones.removeAll(true);
          this.opciones.add(boton(this, ANCHO2 / 2, 640, 220, 56, "Saltar \u23E9", () => {
            this.saltar = true;
          }, 10133684, 20));
        }
        if (this.saltar) {
          while (this.i < d.hasta) this.cadena.push(traducir(this.cods[this.i++]));
          this.dibujar();
          return this.paso();
        }
        this.cadena.push(traducir(this.cods[this.i]));
        if (this.i % 3 === 0) sonido("hablar");
        return this.deslizar(90, () => this.paso());
      }
      this.opciones.removeAll(true);
      if (!d.stop) {
        this.titulo.setText(`\xA1Sali\xF3 el p\xE9ptido se\xF1al: los primeros ${d.hasta} amino\xE1cidos!`);
        this.celebrar();
        return this.opciones.add(boton(this, ANCHO2 / 2, 640, 260, 60, "Continuar", () => this.terminar(), VERDE));
      }
      this.titulo.setText(`Lleg\xF3 el cod\xF3n ${this.cods[this.i]} al sitio A.`);
      crearReto(this, {
        tipo: "pregunta",
        texto: `Lleg\xF3 el cod\xF3n ${this.cods[this.i]} al sitio A. \xBFQu\xE9 pasa ahora?`,
        correcta: "Es un cod\xF3n stop: no hay ARNt para \xE9l; entra un factor de liberaci\xF3n y se suelta la prote\xEDna",
        opciones: mezclar([
          "Es un cod\xF3n stop: no hay ARNt para \xE9l; entra un factor de liberaci\xF3n y se suelta la prote\xEDna",
          "Entra un ARNt con su amino\xE1cido y la prote\xEDna sigue creciendo",
          "El ribosoma vuelve al AUG y empieza de nuevo la misma prote\xEDna",
          "El ribosoma salta ese cod\xF3n y sigue leyendo"
        ])
      }, () => {
        this.titulo.setText(`\xA1Prote\xEDna terminada: ${this.cadena.length} amino\xE1cidos!`);
        this.tweens.add({ targets: this.proteina, y: -40, x: -30, duration: 1200, ease: "Sine.inOut", yoyo: true, repeat: -1 });
        this.celebrar();
        this.opciones.add(boton(this, ANCHO2 / 2, 640, 260, 60, "Continuar", () => this.terminar(), VERDE));
      });
    }
    celebrar() {
      sonido("victoria");
      const [x, y] = posCadena(0);
      chispas(this, x - 200, y, [1482885, 1752220, 15911244, 16777215], 50, { textura: "estrella", velocidad: 420, escala: 0.8 });
    }
    // Mueve la tira un codón a la izquierda y redibuja.
    deslizar(ms, luego) {
      this.tweens.add({
        targets: this.tira,
        x: -PASO,
        duration: ms,
        ease: "Sine.inOut",
        onComplete: () => {
          this.i++;
          this.dibujar();
          luego();
        }
      });
    }
    elegir() {
      const c = this.cods[this.i], ok = anticodon(c);
      this.titulo.setText(this.i === 0 ? "El ribosoma encontr\xF3 el AUG. \xBFQu\xE9 ARNt se aparea con este cod\xF3n?" : `Cod\xF3n ${c} en el sitio A. \xBFQu\xE9 ARNt se aparea con \xE9l?`);
      const otrosAa = mezclar([...new Set(TODOS_CODONES.map(traducir))].filter((a) => a !== "*" && a !== traducir(c))).slice(0, 2);
      const otros = otrosAa.map((a) => anticodon(mezclar(TODOS_CODONES.filter((x) => traducir(x) === a))[0]));
      this.opciones.removeAll(true);
      mezclar([ok, ...otros]).forEach((ac, k) => {
        const aa = NOMBRE[traducir(anticodon(ac))][0];
        const b = boton(this, ANCHO2 / 2 + (k - 1) * 330, 640, 300, 84, `ARNt-${aa}
anticod\xF3n 3'-${ac}-5'`, () => {
          if (this.moviendo) return;
          if (ac === ok) {
            E.aciertos++;
            this.aviso.setColor("#1e8449").setText(this.i === 0 ? "El ARNt iniciador trae la metionina: la prote\xEDna empieza con Met." : `\xA1Bien! ${c} se aparea con ${ac}: entra ${NOMBRE[traducir(c)][1].toLowerCase()}.`);
            this.opciones.removeAll(true);
            this.llegaArnt(ac, () => this.paso());
          } else {
            E.errores++;
            sonido("mal");
            b.pintar(ROJO);
            this.tweens.add({ targets: b, x: b.x + 10, duration: 50, yoyo: true, repeat: 3 });
            this.aviso.setColor("#c0392b").setText(`El anticod\xF3n ${ac} no se aparea con ${c}. Base con base: A con U, C con G.`);
          }
        }, 7101671, 20);
        b.setScale(0.6).setAlpha(0);
        this.tweens.add({ targets: b, scale: 1, alpha: 1, duration: 260, delay: k * 60, ease: "Back.out" });
        this.opciones.add(b);
      });
    }
    // El ARNt entra al sitio A, entrega su aminoácido a la cadena y sale; después el ARNm avanza.
    llegaArnt(ac, luego) {
      this.moviendo = true;
      const a = traducir(this.cods[this.i]);
      const t = this.add.container(SITIO_A + 320, 90).setDepth(7).setAlpha(0);
      t.add(this.add.image(0, -80, "arnt-gen").setScale(ESCALA * 1.2));
      [...ac].forEach((b, j) => t.add(ficha(this, (j - 1) * 38, 0, b, 30)));
      const crearBola = (x, y) => this.add.container(x, y, [
        this.add.circle(0, 0, 21, 15911244).setStrokeStyle(3, 12884508),
        this.add.text(0, 0, NOMBRE[a][0], estilo(13, "#23233a", { fontStyle: "900" })).setOrigin(0.5)
      ]);
      const bola = crearBola(0, -146);
      t.add(bola);
      sonido("abrir");
      this.tweens.chain({
        targets: t,
        tweens: [
          { x: SITIO_A, y: Y_ARNM - 42, alpha: 1, duration: 520, ease: "Back.out" },
          {
            scale: 1.06,
            duration: 90,
            yoyo: true,
            onComplete: () => {
              sonido("bien");
              chispas(this, SITIO_A, Y_ARNM - 25, [...ac].map((b) => COLOR_BASE[b]).concat(16777215), 18, { gravedad: 0, velocidad: 200, escala: 0.45 });
              const [x, y] = posCadena(0);
              bola.setVisible(false);
              const viaja = crearBola(t.x, t.y - 146).setDepth(8);
              this.tweens.add({
                targets: viaja,
                x,
                y,
                duration: 380,
                ease: "Quad.inOut",
                onComplete: () => {
                  viaja.destroy();
                  this.cadena.push(a);
                  this.dibujar();
                  numero(this, x, y - 40, NOMBRE[a][0], "#16a085", 26);
                  this.tweens.add({ targets: t, x: SITIO_P - PASO, y: 80, alpha: 0, angle: -25, duration: 600, ease: "Sine.in", onComplete: () => t.destroy() });
                  this.deslizar(380, () => {
                    this.moviendo = false;
                    luego();
                  });
                }
              });
            }
          }
        ]
      });
    }
    terminar() {
      guardar();
      const fin = this.d.fin;
      this.scene.stop();
      fin();
    }
  };

  // src/main.js
  var hex2 = (n) => "#" + n.toString(16).padStart(6, "0");
  var Inicio = class extends Phaser.Scene {
    constructor() {
      super("Inicio");
    }
    create() {
      this.cameras.main.setBackgroundColor(1906744);
      texturasBase(this);
      const fuente = Promise.all(["600 20px Nunito", "800 20px Nunito", "900 20px Nunito"].map((f) => document.fonts.load(f))).catch(() => {
      });
      Promise.all([fuente, cargarArte(this)]).then(() => this.scene.start("Titulo"));
    }
  };
  var Titulo = class extends Phaser.Scene {
    constructor() {
      super("Titulo");
    }
    create() {
      fondo(this, 16184063, 14207995);
      for (let i = 0; i < 22; i++) {
        const b = BASES[i % 4];
        const t = this.add.text(Phaser.Math.Between(0, ANCHO2), Phaser.Math.Between(0, ALTO2 - 120), b, estilo(Phaser.Math.Between(30, 52), hex2(COLOR_BASE[b]), { fontStyle: "900" })).setAlpha(0.22);
        this.tweens.add({ targets: t, y: t.y - 60, angle: Phaser.Math.Between(-20, 20), duration: 3e3 + i * 120, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      }
      this.helice = this.add.graphics();
      this.add.particles(0, 0, "estrella", {
        x: { min: 300, max: 980 },
        y: { min: 50, max: 180 },
        lifespan: 1400,
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.9, end: 0 },
        rotate: { min: 0, max: 180 },
        tint: [15911244, 16777215, 10786272],
        frequency: 260
      }).setDepth(2);
      const titulo = "MENSAJERO", tam = 104;
      const medidas = [...titulo].map((l) => this.add.text(0, 0, l, estilo(tam, "#6c5ce7", { fontStyle: "900" })));
      const total = medidas.reduce((s, t) => s + t.width, 0);
      let x = ANCHO2 / 2 - total / 2;
      medidas.forEach((t, i) => {
        t.setOrigin(0, 0.5).setPosition(x, -100).setShadow(0, 7, "#c9bbf7", 0, false, true).setDepth(3);
        x += t.width;
        this.tweens.add({ targets: t, y: 112, duration: 700, delay: 120 + i * 70, ease: "Bounce.out" });
        this.tweens.add({ targets: t, y: 100, duration: 900, delay: 1200 + i * 110, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      });
      const sub = this.add.text(ANCHO2 / 2, 190, "Un RPG del ADN a la prote\xEDna", estilo(30, "#4a4a68", { fontStyle: "700" })).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: sub, alpha: 1, duration: 600, delay: 900 });
      this.add.ellipse(ANCHO2 / 2, 318, 190, 24, 7101671, 0.15);
      const yo = this.add.image(ANCHO2 / 2, 262, "arnm-2");
      aparecer(this, yo, 1.6 * ESCALA, 700);
      this.tweens.add({ targets: yo, y: 250, angle: { from: -4, to: 4 }, duration: 900, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      parpadeo(this, () => [yo]);
      this.add.text(ANCHO2 / 2, ALTO2 - 6, "Con la secuencia real del gen humano del interfer\xF3n beta (IFNB1)", estilo(16, "#7a6fb0")).setOrigin(0.5, 1).setDepth(1);
      const son = boton(this, 120, 50, 200, 50, `Sonido: ${sonidoActivo() ? "s\xED" : "no"}`, () => {
        son.texto.setText(`Sonido: ${alternarSonido() ? "s\xED" : "no"}`);
        sonido("clic");
      }, GRIS, 18);
      const hay = hayPartida();
      let seguro = !hay;
      const nueva = boton(this, ANCHO2 / 2, 400, 380, 62, "Nueva partida", () => {
        if (!seguro) {
          seguro = true;
          return nueva.texto.setText("\xBFBorrar la partida guardada? Toc\xE1 otra vez");
        }
        empezar();
        this.scene.start("Mundo");
      }, VIOLETA, hay ? 20 : 26);
      const botones = [nueva];
      if (hay) botones.push(boton(this, ANCHO2 / 2, 474, 380, 62, "Continuar", () => {
        cargar();
        this.scene.start("Mundo");
      }, VERDE, 26));
      botones.push(boton(this, ANCHO2 / 2, hay ? 548 : 474, 380, 62, "Modo pr\xE1ctica", () => this.scene.start("Practica"), 15898954, 26));
      botones.forEach((b, i) => aparecer(this, b, 1, 900 + i * 120));
      if (this.scale.fullscreen.available) boton(this, ANCHO2 - 130, 50, 220, 50, "Pantalla completa", () => this.scale.toggleFullscreen(), GRIS, 18);
    }
    // Doble hélice que gira, abajo de todo.
    update(t) {
      const g = this.helice.clear(), y = ALTO2 - 80, fase = t / 600, colores = Object.values(COLOR_BASE);
      for (let x = -10, k = 0; x <= ANCHO2 + 10; x += 26, k++) {
        const dy = 30 * Math.sin(x / 45 + fase);
        g.lineStyle(6, colores[k % 4], 0.55).lineBetween(x, y - dy, x, y + dy);
      }
      for (const [color, s] of [[3113197, 1], [15898954, -1]]) {
        g.lineStyle(9, color, 0.75).beginPath();
        for (let x = -10; x <= ANCHO2 + 10; x += 8) g.lineTo(x, y + s * 30 * Math.sin(x / 45 + fase));
        g.strokePath();
      }
    }
  };
  var Historia = class extends Phaser.Scene {
    constructor() {
      super("Historia");
    }
    init(d) {
      this.d = d;
      this.i = 0;
    }
    create() {
      fondo(this, 3024224, 1315371);
      for (let i = 0; i < 50; i++) {
        const e = this.add.circle(Phaser.Math.Between(0, ANCHO2), Phaser.Math.Between(0, ALTO2), Phaser.Math.Between(1, 3), 16777215, 0.3);
        this.tweens.add({ targets: e, alpha: 0.05, duration: Phaser.Math.Between(700, 2e3), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 1500) });
      }
      this.add.particles(0, 0, "punto", {
        x: { min: 0, max: ANCHO2 },
        y: ALTO2 + 10,
        lifespan: 9e3,
        speedY: { min: -60, max: -20 },
        speedX: { min: -10, max: 10 },
        scale: { min: 0.15, max: 0.5 },
        alpha: { values: [0, 0.6, 0], interpolation: "linear" },
        tint: Object.values(COLOR_BASE),
        frequency: 160,
        advance: 9e3
      });
      this.halo = this.add.image(ANCHO2 / 2, 250, "halo").setTint(9338096).setScale(6).setBlendMode(Phaser.BlendModes.ADD);
      this.tweens.add({ targets: this.halo, scale: 6.8, alpha: 0.6, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.img = this.add.image(ANCHO2 / 2, 250, "virus");
      this.tweens.add({ targets: this.img, y: 238, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      parpadeo(this, () => [this.img]);
      this.texto = this.add.text(ANCHO2 / 2, 470, "", estilo(32, "#ffffff", { fontStyle: "700", align: "center", wordWrap: { width: 1e3 }, lineSpacing: 8 })).setOrigin(0.5, 0);
      this.add.text(ANCHO2 - 30, ALTO2 - 30, "Toc\xE1 para seguir \u25B6", estilo(20, "#a99ff0")).setOrigin(1);
      const seguir = () => {
        if (++this.i < this.d.paginas.length) this.mostrar();
        else {
          const fin = this.d.fin;
          this.scene.stop();
          fin();
        }
      };
      this.input.on("pointerdown", seguir);
      this.input.keyboard.on("keydown-SPACE", seguir);
      this.input.keyboard.on("keydown-ENTER", seguir);
      this.mostrar();
    }
    mostrar() {
      const [img, texto2] = this.d.paginas[this.i];
      this.img.setVisible(!!img);
      this.halo.setVisible(!!img);
      if (img) {
        this.img.setTexture(img);
        aparecer(this, this.img, 2 * ESCALA);
      }
      const y = img ? 470 : 200;
      this.texto.setText(texto2).setY(y + 24).setAlpha(0);
      this.tweens.add({ targets: this.texto, y, alpha: 1, duration: 450, delay: 120, ease: "Cubic.out" });
      sonido("abrir");
    }
  };
  var Codonario = class extends Phaser.Scene {
    constructor() {
      super("Codonario");
    }
    create(d) {
      const pags = d.todas ? "UCAG" : E.paginas;
      sonido("abrir");
      this.cameras.main.setZoom(0.9).setAlpha(0);
      this.tweens.add({ targets: this.cameras.main, zoom: 1, alpha: 1, duration: 240, ease: "Back.out" });
      this.add.rectangle(ANCHO2 / 2, ALTO2 / 2, ANCHO2, ALTO2, 0, 0.5).setInteractive();
      panel(this, ANCHO2 / 2, ALTO2 / 2, 1230, 700);
      this.add.text(60, 28, "Codonario: el c\xF3digo gen\xE9tico", estilo(28, "#23233a", { fontStyle: "bold" }));
      boton(this, ANCHO2 - 120, 50, 180, 52, "Cerrar", () => this.scene.stop(), VIOLETA, 20);
      const x0 = 150, y0 = 120, w = 265, h = 126;
      [...BASES].forEach((b2, c) => this.add.text(x0 + c * w + w / 2, y0 - 22, `2\xAA base: ${b2}`, estilo(20, "#555", { fontStyle: "bold" })).setOrigin(0.5));
      [...BASES].forEach((b1, f) => {
        const y = y0 + f * h;
        this.add.text(95, y + h / 2, b1, estilo(44, "#" + COLOR_BASE[b1].toString(16).padStart(6, "0"), { fontStyle: "bold" })).setOrigin(0.5);
        const abierta = pags.includes(b1);
        this.add.rectangle(x0, y + 3, 4 * w - 6, h - 6, abierta ? 16250367 : 15132394).setOrigin(0);
        if (!abierta) return this.add.text(x0 + 2 * w, y + h / 2, `P\xE1gina ${b1}: todav\xEDa no la encontraste`, estilo(22, "#9aa0b4")).setOrigin(0.5);
        [...BASES].forEach((b2, c) => [...BASES].forEach((b3, k) => {
          const cod = b1 + b2 + b3, a = traducir(cod);
          const color = a === "*" ? "#c0392b" : cod === "AUG" ? "#1e8449" : "#23233a";
          const peso = a === "*" || cod === "AUG" ? "900" : "600";
          const fy = y + 12 + k * 27;
          [...cod].forEach((b, j) => this.add.text(x0 + c * w + 18 + j * 17, fy, b, estilo(20, hex2(COLOR_BASE[b]), { fontStyle: "900" })));
          this.add.text(x0 + c * w + 82, fy, `${a === "*" ? "Stop" : NOMBRE[a][0]}${cod === "AUG" ? " (inicio)" : ""}`, estilo(20, color, { fontStyle: peso }));
        }));
      });
      this.add.text(ANCHO2 / 2, ALTO2 - 18, "Se lee: 1\xAA base (fila) \xB7 2\xAA base (columna) \xB7 3\xAA base (rengl\xF3n dentro del cuadro)", estilo(17, "#555")).setOrigin(0.5, 1);
    }
  };
  var Practica = class extends Phaser.Scene {
    constructor() {
      super("Practica");
    }
    create() {
      fondo(this, 16184063, 14207995);
      this.add.text(ANCHO2 / 2, 70, "Modo pr\xE1ctica", estilo(60, "#6c5ce7", { fontStyle: "900" })).setOrigin(0.5).setShadow(0, 5, "#c9bbf7", 0, false, true);
      this.add.text(ANCHO2 / 2, 130, "Eleg\xED un tema. Los tramos de ADN son del gen real del interfer\xF3n beta.", estilo(22, "#4a4a68")).setOrigin(0.5);
      const temas = [
        ["Transcribir ADN \u2192 ARNm", () => transcribir(9)],
        ["Cod\xF3n \u2192 amino\xE1cido", () => codon()],
        ["Cod\xF3n \u2192 anticod\xF3n (ARNt)", () => anticodonReto()],
        ["Tipos de mutaci\xF3n", () => mutacion()],
        ["Preguntas", () => pregunta()]
      ];
      temas.forEach(([nombre, gen], i) => boton(this, ANCHO2 / 2, 220 + i * 80, 480, 64, nombre, () => this.jugar(gen), VIOLETA, 24));
      boton(this, ANCHO2 / 2, 640, 240, 56, "Volver", () => this.scene.start("Titulo"), GRIS, 22);
    }
    jugar(gen) {
      let bien = 0, total = 0, actual;
      const marcador = this.add.text(30, ALTO2 - 4, "", estilo(20, "#23233a", { fontStyle: "bold" })).setOrigin(0, 1).setDepth(3100);
      const salir = boton(this, ANCHO2 - 110, ALTO2 - 20, 180, 36, "Salir", () => {
        actual?.destroy();
        marcador.destroy();
        salir.destroy();
      }, GRIS, 18).setDepth(3100);
      const otro = () => {
        marcador.setText(`Aciertos: ${bien} de ${total}`);
        actual = crearReto(this, gen(), (ok) => {
          total++;
          bien += ok;
          otro();
        });
      };
      otro();
    }
  };
  window.juego = new Phaser.Game({
    type: Phaser.AUTO,
    parent: "juego",
    width: ANCHO2,
    height: ALTO2,
    backgroundColor: "#efe9fb",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: "arcade" },
    input: { activePointers: 3 },
    scene: [Inicio, Titulo, Mundo, Batalla, Traduccion, Historia, Codonario, Practica]
  });
})();
