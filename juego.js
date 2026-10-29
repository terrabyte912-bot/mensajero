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
  var hex = (n) => "#" + n.toString(16).padStart(6, "0");
  var C = Object.fromEntries(Object.entries(COLOR_BASE).map(([k, v]) => [k, hex(v)]));
  var TINTA = "#23233a";
  var svg = (w, h, cuerpo) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${cuerpo}</svg>`;
  var ojos = (x, y, sep = 14, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + sep}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + 1.5}" cy="${y + 1}" r="${r / 2}" fill="${TINTA}"/><circle cx="${x + sep + 1.5}" cy="${y + 1}" r="${r / 2}" fill="${TINTA}"/>`;
  var sonrisa = (x, y, w = 10) => `<path d="M${x} ${y} q${w / 2} ${w / 2.5} ${w} 0" stroke="${TINTA}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  var texto = (x, y, t, tam = 13, color = "#fff") => `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-weight="700" font-size="${tam}" text-anchor="middle" fill="${color}">${t}</text>`;
  function arnm(casquete, cola) {
    return svg(140, 90, `
    ${cola ? `<path d="M42 58 q-5 -7 -10 0 t-10 0 t-10 0 t-10 0" fill="none" stroke="${C.A}" stroke-width="5" stroke-linecap="round"/>` : ""}
    <path d="M42 58 Q57 38 72 58 T102 54" fill="none" stroke="#8e7cc3" stroke-width="14" stroke-linecap="round"/>
    <circle cx="49.5" cy="50.5" r="4.5" fill="${C.A}"/><circle cx="64.5" cy="50.5" r="4.5" fill="${C.U}"/>
    <circle cx="79.5" cy="65" r="4.5" fill="${C.G}"/><circle cx="94.5" cy="63" r="4.5" fill="${C.C}"/>
    <circle cx="112" cy="46" r="20" fill="#a495e0"/>
    ${casquete ? `<path d="M93 41 A19 19 0 0 1 131 41 Z" fill="${C.G}"/><rect x="90" y="38" width="44" height="6" rx="3" fill="#d9ab2e"/>` : ""}
    ${ojos(105, 49)}${sonrisa(108, 57)}`);
  }
  var enzima = (color, simbolo = "", tam = 13) => svg(90, 90, `
  <circle cx="13" cy="56" r="9" fill="${color}"/><circle cx="77" cy="56" r="9" fill="${color}"/>
  <ellipse cx="45" cy="50" rx="34" ry="31" fill="${color}"/>
  <ellipse cx="45" cy="62" rx="22" ry="14" fill="#fff" fill-opacity=".25"/>
  ${ojos(37, 42, 16, 6)}${sonrisa(40, 52)}${texto(45, 74, simbolo, tam)}`);
  function arnt(codon2, aa) {
    const anti = anticodon(codon2);
    return svg(80, 124, `
    <rect x="34" y="14" width="12" height="34" rx="6" fill="#ff9f6e"/>
    <circle cx="40" cy="13" r="12" fill="${C.G}"/>${texto(40, 17, aa, 10, TINTA)}
    <circle cx="15" cy="60" r="13" fill="#ff9f6e"/><circle cx="65" cy="60" r="13" fill="#ff9f6e"/>
    <rect x="34" y="66" width="12" height="26" fill="#ff9f6e"/><circle cx="40" cy="96" r="15" fill="#ff9f6e"/>
    <circle cx="40" cy="60" r="20" fill="#ff8a50"/>
    ${[...anti].map((b, i) => `<rect x="${27 + i * 9}" y="104" width="8" height="17" rx="3" fill="${C[b]}"/>`).join("")}
    ${ojos(33, 57, 14, 5)}${sonrisa(35, 65)}`);
  }
  function adn() {
    let rungs = "", s1 = "M", s2 = "M";
    for (let y = 30; y <= 124; y += 4) {
      const dx = 18 * Math.sin(y / 11);
      s1 += `${35 - dx} ${y} `;
      s2 += `${35 + dx} ${y} `;
      if (y % 12 === 6) rungs += `<line x1="${35 - dx}" y1="${y}" x2="${35 + dx}" y2="${y}" stroke="${Object.values(C)[y / 12 % 4 | 0]}" stroke-width="4"/>`;
    }
    return svg(70, 130, `${rungs}
    <path d="${s1}" stroke="#2f80ed" stroke-width="5" fill="none"/><path d="${s2}" stroke="#f2994a" stroke-width="5" fill="none"/>
    <circle cx="35" cy="17" r="16" fill="#6aa8f5"/>${ojos(28, 15, 14, 5)}${sonrisa(30, 22)}`);
  }
  var ARTE = {
    "arnm-0": arnm(false, false),
    "arnm-1": arnm(true, false),
    "arnm-2": arnm(true, true),
    polimerasa: svg(120, 112, `
    <path d="M18 34 Q18 8 60 8 Q102 8 102 34 L102 88 Q102 106 60 106 Q18 106 18 88 Z" fill="#6c5ce7"/>
    <path d="M6 82 H114" stroke="#2f80ed" stroke-width="6"/><path d="M6 94 H114" stroke="#f2994a" stroke-width="6"/>
    ${[14, 30, 46, 62, 78, 94, 108].map((x, i) => `<line x1="${x}" y1="84" x2="${x}" y2="92" stroke="${Object.values(C)[i % 4]}" stroke-width="4"/>`).join("")}
    ${ojos(44, 44, 32, 9)}
    <circle cx="44" cy="44" r="12" fill="none" stroke="${TINTA}" stroke-width="2.5"/><circle cx="76" cy="44" r="12" fill="none" stroke="${TINTA}" stroke-width="2.5"/>
    <path d="M56 44 H64" stroke="${TINTA}" stroke-width="2.5"/>${sonrisa(52, 62, 16)}`),
    casquete: enzima("#f2994a", "cap"),
    poliA: enzima(C.A, "AAA"),
    pabp: enzima("#56ccf2", "PABP", 12),
    prs: enzima("#bb6bd9", "PRS"),
    chaperona: enzima("#27ae60"),
    peptidasa: enzima(C.U),
    golgi: enzima("#f2b84b", "Golgi", 12),
    histona: svg(90, 90, `<circle cx="45" cy="45" r="30" fill="#a29bfe"/>
    <ellipse cx="45" cy="48" rx="41" ry="13" fill="none" stroke="#2f80ed" stroke-width="5" transform="rotate(-18 45 48)"/>
    ${ojos(36, 36, 16, 5.5)}${sonrisa(40, 44)}`),
    arnasa: svg(96, 90, `<line x1="76" y1="12" x2="84" y2="70" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>
    <path d="M72 66 L96 66 L92 86 L76 86 Z" fill="${C.G}"/>
    <circle cx="44" cy="50" r="32" fill="#f2994a"/>${ojos(34, 42, 16, 6)}
    <ellipse cx="44" cy="58" rx="5" ry="4" fill="${TINTA}"/>`),
    virus: svg(120, 120, `
    ${[...Array(8)].map((_, i) => {
      const a = i * Math.PI / 4, x = 60 + 56 * Math.cos(a), y = 60 + 56 * Math.sin(a);
      return `<line x1="60" y1="60" x2="${x}" y2="${y}" stroke="#e84393" stroke-width="5"/><circle cx="${x}" cy="${y}" r="6" fill="#e84393"/>`;
    }).join("")}
    <polygon points="${[...Array(6)].map((_, i) => `${60 + 42 * Math.cos(i * Math.PI / 3 + Math.PI / 6)},${60 + 42 * Math.sin(i * Math.PI / 3 + Math.PI / 6)}`).join(" ")}" fill="#b83280"/>
    ${ojos(46, 56, 28, 8)}
    <path d="M36 42 L56 50 M84 42 L64 50" stroke="${TINTA}" stroke-width="4" stroke-linecap="round"/>
    <path d="M46 76 l6 -5 l6 5 l6 -5 l6 5 l6 -5" stroke="${TINTA}" stroke-width="3" fill="none" stroke-linejoin="round"/>`),
    ribosoma: svg(140, 112, `<ellipse cx="70" cy="40" rx="62" ry="36" fill="#a1887f"/>
    <ellipse cx="70" cy="88" rx="50" ry="22" fill="#d7ccc8"/>${ojos(56, 36, 28, 7)}${sonrisa(62, 48, 16)}`),
    guardian: svg(124, 124, `
    ${[...Array(8)].map((_, i) => `<circle cx="${62 + 50 * Math.cos(i * Math.PI / 4)}" cy="${62 + 50 * Math.sin(i * Math.PI / 4)}" r="11" fill="#4263eb"/>`).join("")}
    <circle cx="62" cy="62" r="50" fill="#5c7cfa"/><circle cx="62" cy="62" r="20" fill="#dbe4ff"/>
    ${ojos(45, 30, 34, 7)}<path d="M50 20 L60 24 M74 20 L64 24" stroke="${TINTA}" stroke-width="3" stroke-linecap="round"/>`),
    adn: adn(),
    interferon: svg(110, 90, `
    ${[12, 30, 48, 66, 84].map((x, i) => `<rect x="${x}" y="${18 + i % 2 * 8}" width="16" height="${60 - i % 2 * 8}" rx="8" fill="${i % 2 ? "#1abc9c" : "#16a085"}"/>`).join("")}
    <circle cx="55" cy="46" r="17" fill="#48d1b4"/>${ojos(47, 42, 16, 5.5)}${sonrisa(50, 50)}`),
    mitocondria: svg(170, 84, `<rect x="4" y="4" width="162" height="76" rx="38" fill="#ff8a65"/>
    <path d="M24 42 q8 -26 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#e64a19" stroke-width="5" stroke-linecap="round"/>`),
    cartel: svg(70, 80, `<rect x="31" y="36" width="8" height="42" fill="#8d6e63"/>
    <rect x="4" y="4" width="62" height="38" rx="8" fill="#fff8e1" stroke="#8d6e63" stroke-width="4"/>${texto(35, 30, "i", 24, "#8d6e63")}`)
  };
  var ARNTS = { AUG: "Met", ACC: "Thr", AAC: "Asn", AAG: "Lys" };
  for (const [c, aa] of Object.entries(ARNTS)) ARTE[`arnt-${c}`] = arnt(c, aa);
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

  // src/ui.js
  var ANCHO = 1280;
  var ALTO = 720;
  var TINTA2 = "#23233a";
  var VIOLETA = 7101671;
  var VERDE = 2600544;
  var ROJO = 15423319;
  var GRIS = 10133684;
  var FUENTE = 'Nunito, system-ui, "Segoe UI", Roboto, sans-serif';
  var estilo = (tam = 22, color = TINTA2, extra = {}) => ({ fontFamily: FUENTE, fontSize: tam + "px", color, fontStyle: "600", ...extra });
  var fondo = (scene, arriba, abajo) => scene.add.graphics().setScrollFactor(0).setDepth(-10).fillGradientStyle(arriba, arriba, abajo, abajo, 1).fillRect(0, 0, ANCHO, ALTO);
  var fijar = (o) => {
    o.setScrollFactor?.(0);
    o.list?.forEach(fijar);
  };
  var cortar = (p, x, y, ev) => ev?.stopPropagation();
  function boton(scene, x, y, w, h, etiqueta, alTocar, color = VIOLETA, tam = 22) {
    const c = scene.add.container(x, y);
    const g = scene.add.graphics();
    const r = Math.min(16, h / 2);
    g.fillStyle(Phaser.Display.Color.ValueToColor(color).darken(18).color, 1).fillRoundedRect(-w / 2, -h / 2 + 5, w, h, r);
    g.fillStyle(color, 1).fillRoundedRect(-w / 2, -h / 2, w, h, r);
    g.fillStyle(16777215, 0.16).fillRoundedRect(-w / 2 + 4, -h / 2 + 3, w - 8, h * 0.42, { tl: r - 3, tr: r - 3, bl: 6, br: 6 });
    const t = scene.add.text(0, 0, etiqueta, estilo(tam, "#fff", { fontStyle: "800", align: "center", wordWrap: { width: w - 20 } })).setOrigin(0.5);
    c.add([g, t]).setSize(w, h).setInteractive({ useHandCursor: true });
    c.on("pointerdown", (...a) => {
      cortar(...a);
      alTocar();
    });
    c.on("pointerover", () => c.setAlpha(0.85)).on("pointerout", () => c.setAlpha(1));
    c.texto = t;
    return c;
  }
  function panel(scene, x, y, w, h, color = 16777215) {
    return scene.add.graphics().fillStyle(2760550, 0.16).fillRoundedRect(x - w / 2, y - h / 2 + 7, w, h, 22).fillStyle(color, 1).fillRoundedRect(x - w / 2, y - h / 2, w, h, 22).lineStyle(3, 14998779, 1).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 22);
  }
  function ficha(scene, x, y, base, tam = 56, borde = 0) {
    const c = scene.add.container(x, y);
    const g = scene.add.graphics();
    const pintar = (b, color) => {
      g.clear();
      if (borde) g.lineStyle(4, borde).strokeRoundedRect(-tam / 2, -tam / 2, tam, tam, 10);
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
    const cx = ANCHO / 2, cy = ALTO / 2;
    const cont = scene.add.container(0, 0).setDepth(3e3).setScrollFactor(0);
    const fondo2 = scene.add.rectangle(cx, cy, ANCHO, ALTO, 0, 0.45).setInteractive();
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
      if (b.texto.text === etiqueta(correcta)) b.list[0].clear().fillStyle(VERDE).fillRoundedRect(-b.width / 2, -b.height / 2, b.width, b.height, 14);
      else if (b === elegido) b.list[0].clear().fillStyle(ROJO).fillRoundedRect(-b.width / 2, -b.height / 2, b.width, b.height, 14);
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
          i++;
          if (i < huecos.length) cursor.x = huecos[i].x;
          else cursor.destroy();
          aviso.setText("");
          if (i === huecos.length) terminar(errores === 0, errores ? `Lo completaste con ${errores} error${errores > 1 ? "es" : ""}. Reglas: A\u2192U, T\u2192A, C\u2192G, G\u2192C.` : "Sin errores.", "Casi.");
        } else {
          errores++;
          aviso.setColor("#c0392b").setText(b === "T" ? "En el ARN no hay T: en su lugar va U (uracilo)." : `Frente a ${r.molde[i]} en el ADN va ${ok} en el ARN.`);
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
      if (!this.sinFundido) this.cameras.main.fadeIn(250);
      this.sinFundido = false;
      this.physics.world.setBounds(0, 0, z.ancho, z.alto);
      z.decorar(this, this.add.graphics(), new Phaser.Math.RandomDataGenerator([E.zona]));
      const solidos = this.physics.add.staticGroup();
      const paredes = typeof z.paredes === "function" ? z.paredes() : z.paredes ?? [];
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
      this.sombras = [];
      const sombra = (s, sigue) => {
        const e = this.add.ellipse(s.x, s.y + s.displayHeight * 0.42, s.displayWidth * 0.7, 18, 0, 0.12).setDepth(2);
        if (sigue) this.sombras.push([s, e]);
        return e;
      };
      const [px, py] = E.pos ?? z.inicio;
      this.yo = this.physics.add.image(px, py, this.texturaYo()).setCollideWorldBounds(true).setDepth(10);
      this.yo.body.setSize(this.yo.width * 0.55, this.yo.height * 0.5);
      if (!E.flags.nacido) this.yo.setAlpha(0);
      else sombra(this.yo, true);
      this.physics.add.collider(this.yo, solidos);
      this.cameras.main.startFollow(this.yo, true, 0.12, 0.12);
      this.npcs = (z.npcs ?? []).filter((n) => !n.visible || n.visible()).map((n) => {
        const s = this.add.image(n.x, n.y, n.img).setDepth(5);
        sombra(s);
        this.physics.add.existing(s, true);
        s.body.setSize(s.width * 0.6, s.height * 0.5);
        this.physics.add.collider(this.yo, s);
        this.tweens.add({ targets: s, y: n.y - 6, duration: 900 + Math.random() * 400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        const nombre = this.add.text(n.x, n.y - s.height / 2 - 18, n.nombre, estilo(16, "#4a4a68", { fontStyle: "800" })).setOrigin(0.5).setDepth(7);
        this.add.graphics().setDepth(6).fillStyle(16777215, 0.8).fillRoundedRect(nombre.x - nombre.width / 2 - 10, nombre.y - nombre.height / 2 - 3, nombre.width + 20, nombre.height + 6, 12);
        s.datos = n;
        return s;
      });
      for (const en of z.enemigos ?? []) {
        if (E.flags[en.id]) continue;
        const s = this.physics.add.image(en.x, en.y, en.img).setDepth(8);
        s.body.setSize(s.width * 0.6, s.height * 0.6);
        s.datos = en;
        if (en.jefe) {
          s.setScale(1.3);
          s.body.setImmovable(true);
        }
        sombra(s, true);
        if (en.rango) {
          this.physics.add.collider(s, solidos);
          this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => {
              if (this.ocupado) return s.setVelocity(0, 0);
              const lejos = Phaser.Math.Distance.Between(s.x, s.y, en.x, en.y) > en.rango;
              const ang = lejos ? Phaser.Math.Angle.Between(s.x, s.y, en.x, en.y) : Math.random() * Math.PI * 2;
              s.setVelocity(Math.cos(ang) * 90, Math.sin(ang) * 90);
            }
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
          E.flags[o.id] = true;
          guardar();
          s.destroy();
          o.tomar(this);
        });
      }
      this.salidas = z.salidas ?? [];
      for (const s of this.salidas) {
        const brillo = this.add.rectangle(s.x + s.w / 2, s.y + s.h / 2, s.w, s.h, 16777215, 0.45).setDepth(1);
        this.tweens.add({ targets: brillo, alpha: 0.15, duration: 900, yoyo: true, repeat: -1 });
        if (s.etiqueta) {
          const t = this.add.text(s.x - 10, s.y + s.h / 2, s.etiqueta, estilo(22, "#4a4a68", { fontStyle: "800" })).setOrigin(1, 0.5).setDepth(2);
          this.tweens.add({ targets: t, x: s.x - 22, duration: 700, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        }
      }
      this.ultimo = [px, py];
      this.crearHud();
      this.crearControles();
      if (!this.escuchaWake) {
        this.escuchaWake = true;
        this.events.on("wake", () => {
          this.input.keyboard.resetKeys();
          this.joy.activo = false;
        });
      }
      z.alEntrar?.(this);
      guardar();
    }
    texturaYo() {
      return E.yo === "interferon" ? "interferon" : `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`;
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
        hud.push(this.add.text(36, 90, `PABP: ${E.pabp}   ARNt: ${E.arnt.length}`, estilo(16, "#555")));
      }
      if (E.paginas) hud.push(boton(this, ANCHO - 290, 44, 180, 52, "Codonario", () => !this.ocupado && abrirCodonario(this), 15898954, 20));
      hud.push(boton(this, ANCHO - 100, 44, 150, 52, "Men\xFA", () => {
        guardar();
        this.scene.start("Titulo");
      }, 10133684, 20));
      hud.forEach((o) => o.setScrollFactor(0).setDepth(1e3));
    }
    crearControles() {
      this.teclas = this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");
      for (const k of ["SPACE", "ENTER", "E"]) this.input.keyboard.on(`keydown-${k}`, () => this.accion());
      this.joy = { activo: false, vx: 0, vy: 0 };
      const base = this.add.circle(0, 0, 70, 0, 0.12).setScrollFactor(0).setDepth(900).setVisible(false);
      const perilla = this.add.circle(0, 0, 32, 7101671, 0.6).setScrollFactor(0).setDepth(901).setVisible(false);
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
      this.botonHablar = boton(this, ANCHO - 110, ALTO - 110, 170, 110, "Hablar", () => this.accion(), VERDE, 28).setScrollFactor(0).setDepth(950).setVisible(false);
    }
    update() {
      let dx = 0, dy = 0;
      if (!this.ocupado) {
        const t = this.teclas;
        dx = (t.RIGHT.isDown || t.D.isDown) - (t.LEFT.isDown || t.A.isDown);
        dy = (t.DOWN.isDown || t.S.isDown) - (t.UP.isDown || t.W.isDown);
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
      for (const [s, e] of this.sombras) e.setPosition(s.x, s.y + s.displayHeight * 0.42);
      this.cerca = this.ocupado ? null : this.npcs.find((s) => Phaser.Math.Distance.Between(s.x, s.y, this.yo.x, this.yo.y) < CERCA + s.width / 3);
      this.botonHablar.setVisible(!!this.cerca);
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
      const caja = this.add.container(0, 0).setScrollFactor(0).setDepth(2e3);
      caja.add(panel(this, ANCHO / 2, ALTO - 105, 1220, 180));
      const fondoRetrato = this.add.circle(118, ALTO - 105, 66, 15723003);
      const retrato = this.add.image(118, ALTO - 105, "polimerasa");
      const quien = this.add.text(0, ALTO - 182, "", estilo(22, "#6c5ce7", { fontStyle: "800" }));
      const texto2 = this.add.text(0, ALTO - 150, "", estilo(25, "#23233a", { wordWrap: { width: 1150 }, lineSpacing: 6 }));
      const seguir = this.add.text(ANCHO - 60, ALTO - 38, "\u25B6", estilo(22, "#6c5ce7")).setOrigin(1);
      caja.add([fondoRetrato, retrato, quien, texto2, seguir]);
      this.tweens.add({ targets: seguir, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });
      this.dialogo = { lineas, i: 0, fin, caja, quien, texto: texto2, retrato, fondoRetrato, desde: this.time.now };
      this.mostrarLinea();
    }
    mostrarLinea() {
      const d = this.dialogo, l = d.lineas[d.i];
      const [q, t] = Array.isArray(l) ? l : ["", l];
      const img = RETRATOS[q];
      d.retrato.setVisible(!!img);
      d.fondoRetrato.setVisible(!!img);
      if (img) d.retrato.setTexture(img).setScale(Math.min(1, 110 / d.retrato.width, 110 / d.retrato.height));
      const x = img ? 210 : 55;
      d.quien.setText(q).setX(x);
      d.texto.setText(t).setX(x).setWordWrapWidth(ANCHO - x - 70).setY(q ? ALTO - 150 : ALTO - 165);
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
      this.hablar(en.antes ?? [en.tipo === "arnasa" ? "Una ARNasa te encontr\xF3: \xA1quiere recortar tu cola poli-A!" : "\xA1Combate!"], () => this.batalla(en.tipo, () => {
        E.flags[en.id] = true;
        const p = en.jefe ? null : darPagina();
        const completo = en.jefe && E.paginas.length < 4;
        if (en.jefe) E.paginas = "AUCG";
        this.hablar([
          ...en.despues ?? ["La ARNasa se va a limpiar a otro lado."],
          ...p ? [`\xA1Nueva p\xE1gina del Codonario! Ahora ten\xE9s los codones que empiezan con ${p}.`] : [],
          ...completo ? ["\xA1Completaste el Codonario: ya ten\xE9s las cuatro p\xE1ginas!"] : []
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
      E.zona = zona;
      E.pos = null;
      guardar();
      this.cameras.main.fadeOut(300);
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
      this.cameras.main.fadeIn(200);
      const tono = Phaser.Display.Color.ValueToColor(r.fondo);
      fondo(this, tono.clone().lighten(5).color, tono.clone().darken(10).color);
      this.add.ellipse(ANCHO / 2, 560, 1600, 300, 16777215, 0.35);
      this.add.ellipse(920, 330, 320, 60, 0, 0.08);
      this.rival = this.add.image(920, 250, r.img).setScale(this.d.tipo === "virus" ? 1.9 : 1.6);
      this.tweens.add({ targets: this.rival, y: 240, duration: 1e3, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.add.ellipse(330, 480, 320, 60, 0, 0.08);
      this.yo = this.add.image(330, 420, `arnm-${E.flags.cola ? 2 : E.flags.casquete ? 1 : 0}`).setScale(1.7);
      panel(this, 330, 110, 460, 100);
      this.add.text(120, 72, r.nombre, estilo(24, "#23233a", { fontStyle: "bold" }));
      if (r.contador) this.barraRival = this.add.text(120, 110, "", estilo(20, "#555"));
      else {
        this.add.rectangle(120, 122, 400, 18, 14540253).setOrigin(0, 0.5);
        this.barraRival = this.add.rectangle(120, 122, 400, 18, 15423319).setOrigin(0, 0.5);
      }
      panel(this, 930, 440, 460, 100);
      this.add.text(720, 402, "Vos (ARNm)", estilo(24, "#23233a", { fontStyle: "bold" }));
      this.add.text(720, 442, "Cola poli-A", estilo(16, "#555"));
      this.add.rectangle(830, 451, 300, 18, 14540253).setOrigin(0, 0.5);
      this.barraYo = this.add.rectangle(830, 451, 300, 18, 4046443).setOrigin(0, 0.5);
      this.textoEscudo = this.add.text(720, 466, "", estilo(16, "#2d9cdb"));
      panel(this, ANCHO / 2, 630, 1240, 160);
      this.texto = this.add.text(40, 568, "", estilo(24, "#23233a", { wordWrap: { width: 620 }, lineSpacing: 4 }));
      this.menu = this.add.container(0, 0);
      this.actualizar();
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
      this.msj(intro, () => this.turno());
    }
    // Muestra un mensaje; al tocar sigue con `luego`.
    msj(texto2, luego) {
      this.texto.setText(texto2 + (luego ? "  \u25B6" : ""));
      this.esperar = luego ?? null;
    }
    actualizar() {
      if (this.r.contador) this.barraRival.setText(`${this.r.contador}: ${this.vida}`);
      else this.barraRival.width = 400 * Math.max(0, this.vida) / this.r.vida;
      this.barraYo.width = 3 * Math.max(0, E.cola);
      this.barraYo.fillColor = E.cola > 30 ? 4046443 : 15423319;
      this.textoEscudo.setText(this.escudo ? `Protegida por PABP (${this.escudo})` : "");
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
        [`Llamar ARNt (${E.arnt.length})`, VERDE, E.arnt.length && (() => this.reto(anticodonReto(E.paginas), (ok) => this.golpe(ok ? 45 : 0, ok ? "\xA1Lleg\xF3 el ARNt correcto: golpe fuerte! " + this.efecto() : "Ese ARNt no se aparea con el cod\xF3n.")))],
        [`Usar PABP (${E.pabp})`, 2989275, E.pabp > 0 && (() => {
          E.pabp--;
          this.escudo = 2;
          this.actualizar();
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
        this.menu.add(b);
      });
    }
    efecto() {
      return this.d.tipo === "virus" ? "El virus pierde el control del ribosoma." : "La ARNasa retrocede.";
    }
    reto(r, fin) {
      crearReto(this, r, fin);
    }
    golpe(danio, texto2) {
      if (danio) {
        this.vida -= danio;
        this.tweens.add({ targets: this.rival, x: 940, duration: 60, yoyo: true, repeat: 3 });
        this.rival.setTint(16751001);
        this.time.delayedCall(300, () => this.rival.clearTint());
      }
      this.actualizar();
      guardar();
      this.msj(texto2, () => this.vida <= 0 ? this.ganar() : this.turnoRival());
    }
    turnoRival() {
      const t = this.d.tipo;
      if (t === "practica" || t === "guardian") return this.turno();
      if (t === "virus" && Math.random() < 0.5) {
        return this.msj("\xA1El virus mut\xF3! Si identific\xE1s la mutaci\xF3n, anticip\xE1s su ataque.", () => this.reto(mutacion(), (ok) => ok ? this.msj("\xA1Lo anticipaste! El ataque del virus falla.", () => this.turno()) : this.ataque(18, "El virus te tom\xF3 por sorpresa.")));
      }
      this.ataque(t === "virus" ? 15 : 12, t === "virus" ? "El virus acapara ribosomas y perd\xE9s tiempo." : "La ARNasa recorta tu cola poli-A.");
    }
    ataque(n, texto2) {
      if (this.escudo) {
        this.escudo--;
        this.actualizar();
        return this.msj(`${texto2} \xA1Pero la PABP protege tu cola!`, () => this.turno());
      }
      E.cola = Math.max(0, E.cola - n);
      this.cameras.main.shake(150, 6e-3);
      this.actualizar();
      guardar();
      this.msj(`${texto2} Perd\xE9s ${n} A de tu cola.`, () => E.cola <= 0 ? this.terminar(false) : this.turno());
    }
    ganar() {
      this.tweens.add({ targets: this.rival, alpha: 0, scale: 0.5, duration: 500 });
      const texto2 = { practica: "\xA1Pr\xE1ctica completa!", guardian: "\xA1Respondiste todo!", arnasa: "\xA1La ARNasa se aleja!", virus: "\xA1El virus solt\xF3 el ribosoma!" }[this.d.tipo];
      this.msj(texto2, () => this.terminar(true));
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
  var Traduccion = class extends Phaser.Scene {
    constructor() {
      super("Traduccion");
    }
    init(d) {
      this.d = d;
    }
    create() {
      const d = this.d;
      this.auto = this.saltar = false;
      this.cods = codones(ARNM);
      this.i = d.desde;
      this.cadena = this.cods.slice(0, d.desde).map(traducir);
      this.cameras.main.fadeIn(200);
      fondo(this, d.desde ? 16774894 : 15792886, d.desde ? 16243910 : 13496034);
      const g = this.add.graphics(), cx = SITIO_A - PASO / 2;
      g.fillStyle(0, 0.08).fillEllipse(cx, 572, 420, 40);
      g.fillStyle(9268835, 1).fillEllipse(cx, 350, 470, 170).fillStyle(10586239, 1).fillEllipse(cx, 340, 470, 160);
      g.fillStyle(12891566, 1).fillEllipse(cx, 518, 400, 100).fillStyle(14142664, 1).fillEllipse(cx, 512, 400, 92);
      for (const ox of [-40, 40]) g.fillStyle(16777215, 1).fillCircle(cx + ox, 300, 15).fillStyle(2302778, 1).fillCircle(cx + ox + 3, 302, 7);
      g.lineStyle(4, 2302778, 1).beginPath().arc(cx, 318, 16, 0.2 * Math.PI, 0.8 * Math.PI).strokePath();
      for (const [x, l] of [[SITIO_P, "P"], [SITIO_A, "A"]]) this.add.text(x, 384, `sitio ${l}`, estilo(18, "#fff", { fontStyle: "800" })).setOrigin(0.5);
      this.tira = this.add.container(0, 0);
      this.proteina = this.add.container(0, 0);
      this.titulo = this.add.text(ANCHO / 2, 30, "", estilo(26, "#23233a", { fontStyle: "bold", align: "center", wordWrap: { width: 1200 } })).setOrigin(0.5, 0);
      this.contador = this.add.text(ANCHO - 30, 120, "", estilo(22, "#555")).setOrigin(1, 0);
      this.aviso = this.add.text(ANCHO / 2, 560, "", estilo(22, "#23233a", { align: "center", wordWrap: { width: 1200 } })).setOrigin(0.5, 0);
      this.opciones = this.add.container(0, 0);
      this.dibujar();
      this.paso();
    }
    dibujar() {
      this.tira.removeAll(true);
      for (let k = this.i - 5; k <= this.i + 4; k++) {
        if (k < 0 || k >= this.cods.length) continue;
        const x = SITIO_A + (k - this.i) * PASO;
        [...this.cods[k]].forEach((b, j) => this.tira.add(ficha(this, x + (j - 1) * 38, Y_ARNM, b, 34, k === this.i ? 2302778 : 0)));
      }
      if (this.i - 5 <= 0) this.tira.add(this.add.text(SITIO_A + -this.i * PASO - 80, Y_ARNM, "5'", estilo(22, "#23233a", { fontStyle: "bold" })).setOrigin(1, 0.5));
      this.proteina.removeAll(true);
      const ultimos = this.cadena.slice(-14);
      ultimos.forEach((a, j) => {
        const n = ultimos.length - 1 - j;
        const x = SITIO_P - n * 42, y = 225 - 24 * Math.sin(n / 1.6);
        this.proteina.add(this.add.circle(x, y, 20, j % 2 ? 1482885 : 1752220));
        this.proteina.add(this.add.text(x, y, NOMBRE[a][0], estilo(13, "#fff", { fontStyle: "bold" })).setOrigin(0.5));
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
          this.opciones.add(boton(this, ANCHO / 2, 640, 220, 56, "Saltar \u23E9", () => {
            this.saltar = true;
          }, 10133684, 20));
        }
        if (this.saltar) {
          while (this.i < d.hasta) this.cadena.push(traducir(this.cods[this.i++]));
          this.dibujar();
          return this.paso();
        }
        return this.time.delayedCall(55, () => this.avanzar());
      }
      this.opciones.removeAll(true);
      if (!d.stop) {
        this.titulo.setText(`\xA1Sali\xF3 el p\xE9ptido se\xF1al: los primeros ${d.hasta} amino\xE1cidos!`);
        return this.opciones.add(boton(this, ANCHO / 2, 640, 260, 60, "Continuar", () => this.terminar(), VERDE));
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
        this.opciones.add(boton(this, ANCHO / 2, 640, 260, 60, "Continuar", () => this.terminar(), VERDE));
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
        const b = boton(this, ANCHO / 2 + (k - 1) * 330, 640, 300, 84, `ARNt-${aa}
anticod\xF3n 3'-${ac}-5'`, () => {
          if (ac === ok) {
            E.aciertos++;
            this.aviso.setColor("#1e8449").setText(this.i === 0 ? "El ARNt iniciador trae la metionina: la prote\xEDna empieza con Met." : `\xA1Bien! ${c} se aparea con ${ac}: entra ${NOMBRE[traducir(c)][1].toLowerCase()}.`);
            this.avanzar();
          } else {
            E.errores++;
            b.list[0].clear().fillStyle(ROJO).fillRoundedRect(-150, -42, 300, 84, 14);
            this.aviso.setColor("#c0392b").setText(`El anticod\xF3n ${ac} no se aparea con ${c}. Base con base: A con U, C con G.`);
          }
        }, 7101671, 20);
        this.opciones.add(b);
      });
    }
    avanzar() {
      this.cadena.push(traducir(this.cods[this.i]));
      this.i++;
      this.dibujar();
      this.paso();
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
        const t = this.add.text(Phaser.Math.Between(0, ANCHO), Phaser.Math.Between(0, ALTO - 120), b, estilo(Phaser.Math.Between(30, 52), hex2(COLOR_BASE[b]), { fontStyle: "900" })).setAlpha(0.22);
        this.tweens.add({ targets: t, y: t.y - 60, angle: Phaser.Math.Between(-20, 20), duration: 3e3 + i * 120, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      }
      this.helice = this.add.graphics();
      this.add.text(ANCHO / 2, 112, "MENSAJERO", estilo(104, "#6c5ce7", { fontStyle: "900" })).setOrigin(0.5).setShadow(0, 7, "#c9bbf7", 0, false, true);
      this.add.text(ANCHO / 2, 190, "Un RPG del ADN a la prote\xEDna", estilo(30, "#4a4a68", { fontStyle: "700" })).setOrigin(0.5);
      this.add.ellipse(ANCHO / 2, 318, 190, 24, 7101671, 0.15);
      const yo = this.add.image(ANCHO / 2, 262, "arnm-2").setScale(1.6);
      this.tweens.add({ targets: yo, y: 250, duration: 900, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.add.text(ANCHO / 2, ALTO - 6, "Con la secuencia real del gen humano del interfer\xF3n beta (IFNB1)", estilo(16, "#7a6fb0")).setOrigin(0.5, 1).setDepth(1);
      const hay = hayPartida();
      let seguro = !hay;
      const nueva = boton(this, ANCHO / 2, 400, 380, 62, "Nueva partida", () => {
        if (!seguro) {
          seguro = true;
          return nueva.texto.setText("\xBFBorrar la partida guardada? Toc\xE1 otra vez");
        }
        empezar();
        this.scene.start("Mundo");
      }, VIOLETA, hay ? 20 : 26);
      if (hay) boton(this, ANCHO / 2, 474, 380, 62, "Continuar", () => {
        cargar();
        this.scene.start("Mundo");
      }, VERDE, 26);
      boton(this, ANCHO / 2, hay ? 548 : 474, 380, 62, "Modo pr\xE1ctica", () => this.scene.start("Practica"), 15898954, 26);
      if (this.scale.fullscreen.available) boton(this, ANCHO - 130, 50, 220, 50, "Pantalla completa", () => this.scale.toggleFullscreen(), GRIS, 18);
    }
    // Doble hélice que gira, abajo de todo.
    update(t) {
      const g = this.helice.clear(), y = ALTO - 80, fase = t / 600, colores = Object.values(COLOR_BASE);
      for (let x = -10, k = 0; x <= ANCHO + 10; x += 26, k++) {
        const dy = 30 * Math.sin(x / 45 + fase);
        g.lineStyle(6, colores[k % 4], 0.55).lineBetween(x, y - dy, x, y + dy);
      }
      for (const [color, s] of [[3113197, 1], [15898954, -1]]) {
        g.lineStyle(9, color, 0.75).beginPath();
        for (let x = -10; x <= ANCHO + 10; x += 8) g.lineTo(x, y + s * 30 * Math.sin(x / 45 + fase));
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
      for (let i = 0; i < 40; i++) this.add.circle(Phaser.Math.Between(0, ANCHO), Phaser.Math.Between(0, ALTO), Phaser.Math.Between(1, 3), 16777215, 0.25);
      this.halo = this.add.circle(ANCHO / 2, 250, 150, 7101671, 0.25);
      this.tweens.add({ targets: this.halo, scale: 1.12, alpha: 0.12, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.img = this.add.image(ANCHO / 2, 250, "virus").setScale(2);
      this.tweens.add({ targets: this.img, y: 238, duration: 1100, yoyo: true, repeat: -1, ease: "Sine.inOut" });
      this.texto = this.add.text(ANCHO / 2, 470, "", estilo(32, "#ffffff", { fontStyle: "700", align: "center", wordWrap: { width: 1e3 }, lineSpacing: 8 })).setOrigin(0.5, 0);
      this.add.text(ANCHO - 30, ALTO - 30, "Toc\xE1 para seguir \u25B6", estilo(20, "#a99ff0")).setOrigin(1);
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
      if (img) this.img.setTexture(img);
      this.texto.setText(texto2).setY(img ? 470 : 200);
      this.cameras.main.fadeIn(250);
    }
  };
  var Codonario = class extends Phaser.Scene {
    constructor() {
      super("Codonario");
    }
    create(d) {
      const pags = d.todas ? "UCAG" : E.paginas;
      this.add.rectangle(ANCHO / 2, ALTO / 2, ANCHO, ALTO, 0, 0.5).setInteractive();
      panel(this, ANCHO / 2, ALTO / 2, 1230, 700);
      this.add.text(60, 28, "Codonario: el c\xF3digo gen\xE9tico", estilo(28, "#23233a", { fontStyle: "bold" }));
      boton(this, ANCHO - 120, 50, 180, 52, "Cerrar", () => this.scene.stop(), VIOLETA, 20);
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
      this.add.text(ANCHO / 2, ALTO - 18, "Se lee: 1\xAA base (fila) \xB7 2\xAA base (columna) \xB7 3\xAA base (rengl\xF3n dentro del cuadro)", estilo(17, "#555")).setOrigin(0.5, 1);
    }
  };
  var Practica = class extends Phaser.Scene {
    constructor() {
      super("Practica");
    }
    create() {
      fondo(this, 16184063, 14207995);
      this.add.text(ANCHO / 2, 70, "Modo pr\xE1ctica", estilo(60, "#6c5ce7", { fontStyle: "900" })).setOrigin(0.5).setShadow(0, 5, "#c9bbf7", 0, false, true);
      this.add.text(ANCHO / 2, 130, "Eleg\xED un tema. Los tramos de ADN son del gen real del interfer\xF3n beta.", estilo(22, "#4a4a68")).setOrigin(0.5);
      const temas = [
        ["Transcribir ADN \u2192 ARNm", () => transcribir(9)],
        ["Cod\xF3n \u2192 amino\xE1cido", () => codon()],
        ["Cod\xF3n \u2192 anticod\xF3n (ARNt)", () => anticodonReto()],
        ["Tipos de mutaci\xF3n", () => mutacion()],
        ["Preguntas", () => pregunta()]
      ];
      temas.forEach(([nombre, gen], i) => boton(this, ANCHO / 2, 220 + i * 80, 480, 64, nombre, () => this.jugar(gen), VIOLETA, 24));
      boton(this, ANCHO / 2, 640, 240, 56, "Volver", () => this.scene.start("Titulo"), GRIS, 22);
    }
    jugar(gen) {
      let bien = 0, total = 0, actual;
      const marcador = this.add.text(30, ALTO - 4, "", estilo(20, "#23233a", { fontStyle: "bold" })).setOrigin(0, 1).setDepth(3100);
      const salir = boton(this, ANCHO - 110, ALTO - 20, 180, 36, "Salir", () => {
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
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "juego",
    width: ANCHO,
    height: ALTO,
    backgroundColor: "#efe9fb",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: "arcade" },
    input: { activePointers: 3 },
    scene: [Inicio, Titulo, Mundo, Batalla, Traduccion, Historia, Codonario, Practica]
  });
})();
