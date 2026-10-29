// Las cinco zonas, en el orden real del viaje del ARNm. `m` es la escena Mundo.
import { E, darPagina } from './estado.js';
import { DATO_INTRONES, ARNM, COLOR_BASE } from './data.js';
import { ARNTS } from './arte.js';
import * as R from './retos.js';
import { estilo } from './ui.js';

const nuevaPagina = () => { const p = darPagina(); return p ? [`¡Nueva página del Codonario! Ahora tenés los codones que empiezan con ${p}.`] : []; };

// Decoración de fondo: manchas suaves, puntos y ribosomas libres.
const manchas = (g, rnd, n, ancho, alto, color, alfa, rmin, rmax) => {
  for (let i = 0; i < n; i++) g.fillStyle(color, alfa).fillCircle(rnd.between(0, ancho), rnd.between(0, alto), rnd.between(rmin, rmax));
};
const ribosomas = (g, rnd, n, ancho, alto) => {
  for (let i = 0; i < n; i++) {
    const x = rnd.between(30, ancho - 30), y = rnd.between(30, alto - 30);
    g.fillStyle(0xbca59b, 1).fillCircle(x, y, 7).fillStyle(0xdccdc6, 1).fillCircle(x + 3, y + 8, 5);
  }
};
function fibras(g, rnd, n, ancho, alto, color) {
  g.lineStyle(4, color, 1);
  for (let i = 0; i < n; i++) {
    const y0 = rnd.between(0, alto);
    new Phaser.Curves.CubicBezier(
      new Phaser.Math.Vector2(0, y0), new Phaser.Math.Vector2(ancho / 3, y0 + rnd.between(-300, 300)),
      new Phaser.Math.Vector2(2 * ancho / 3, y0 + rnd.between(-300, 300)), new Phaser.Math.Vector2(ancho, rnd.between(0, alto))).draw(g, 64);
  }
}
// Envoltura nuclear: doble membrana con poros.
function envoltura(g, ancho, alto, color, fondo) {
  g.lineStyle(26, color, 1).strokeRoundedRect(13, 13, ancho - 26, alto - 26, 120)
    .lineStyle(6, 0xffffff, 0.55).strokeRoundedRect(13, 13, ancho - 26, alto - 26, 120);
  for (let x = 220; x < ancho - 200; x += 190) for (const y of [13, alto - 13]) g.fillStyle(fondo, 1).fillCircle(x, y, 13).lineStyle(4, 0x8f7ad6, 1).strokeCircle(x, y, 13);
  for (let y = 220; y < alto - 200; y += 190) g.fillStyle(fondo, 1).fillCircle(13, y, 13).lineStyle(4, 0x8f7ad6, 1).strokeCircle(13, y, 13);
}

function helice(g, x0, x1, y) {
  const colores = Object.values(COLOR_BASE);
  for (let x = x0; x <= x1; x += 22) {
    const dy = 22 * Math.sin(x / 30);
    g.lineStyle(5, colores[(x / 22 | 0) % 5], 1).lineBetween(x, y - dy, x, y + dy);
  }
  for (const [color, s] of [[0x2f80ed, 1], [0xf2994a, -1]]) {
    g.lineStyle(8, color, 1).beginPath();
    for (let x = x0; x <= x1; x += 6) g.lineTo(x, y + s * 22 * Math.sin(x / 30));
    g.strokePath();
  }
}

export const ZONAS = {
  nucleo: {
    nombre: 'Núcleo', ancho: 1800, alto: 1100, fondo: 0xefe9fb, inicio: [700, 680],
    decorar(m, g, rnd) {
      manchas(g, rnd, 22, 1800, 1100, 0xe5dcfa, 0.8, 70, 150);
      manchas(g, rnd, 120, 1800, 1100, 0xd9ccf6, 1, 3, 6);
      g.fillStyle(0x000000, 0.06).fillCircle(1458, 342, 150);
      g.fillStyle(0xcfc0f0, 1).fillCircle(1450, 330, 150).fillStyle(0xbfaeea, 1).fillCircle(1420, 300, 70).fillStyle(0xdcd0f5, 1).fillCircle(1500, 380, 40);
      g.fillStyle(0xffffff, 0.45).fillRoundedRect(140, 520, 860, 80, 40);
      helice(g, 160, 980, 560);
      m.add.text(570, 610, 'Gen IFNB1', estilo(20, '#6c5ce7', { fontStyle: 'bold' })).setOrigin(0.5);
      envoltura(g, 1800, 1100, 0xb9a8e6, 0xefe9fb);
    },
    circulos: [[1450, 330, 150]],
    npcs: [
      {
        id: 'polimerasa', img: 'polimerasa', x: 560, y: 545, nombre: 'ARN polimerasa',
        hablar(m) {
          if (!E.flags.casquete || !E.flags.cola) return m.hablar([['ARN polimerasa', 'Antes de salir del núcleo te faltan el casquete 5\' y la cola poli-A. Buscá a las enzimas que los ponen.']]);
          if (E.flags.practica) return m.hablar([['ARN polimerasa', 'Ya estás listo. La salida al poro nuclear está a la derecha. ¡Buen viaje!']]);
          m.hablar([['ARN polimerasa', '¿Practicamos transcripción antes de que te vayas? Tres tramos del gen, sin riesgo.']], () =>
            m.batalla('practica', () => { E.flags.practica = true; m.hablar([['ARN polimerasa', '¡Muy bien!'], ...nuevaPagina()], () => m.reiniciar()); }));
        },
      },
      {
        id: 'casquete', img: 'casquete', x: 1000, y: 300, nombre: 'Enzima del casquete',
        hablar(m) {
          if (E.flags.casquete) return m.hablar([['Enzima del casquete', 'Ese casquete te queda bárbaro.']]);
          m.hablar([
            ['Enzima del casquete', 'Hola. Yo pongo el casquete (cap) en el extremo 5\' de los ARNm, apenas empieza la transcripción.'],
            ['Enzima del casquete', 'Es una G modificada: protege tu punta y ayuda a que el ribosoma te reconozca.'],
          ], () => { E.flags.casquete = true; m.reiniciar(); });
        },
      },
      {
        id: 'poliA', img: 'poliA', x: 1250, y: 800, nombre: 'Poli-A polimerasa',
        hablar(m) {
          if (!E.flags.casquete) return m.hablar([['Poli-A polimerasa', 'Primero el casquete: se pone al principio de la transcripción. La cola va al final, en el extremo 3\'.']]);
          if (E.flags.cola) return m.hablar([['Poli-A polimerasa', 'Cuidá esa cola: es tu reloj.']]);
          m.hablar([
            ['Poli-A polimerasa', 'Te agrego una cola de muchas A en el extremo 3\': en los humanos, unas 200.'],
            ['Poli-A polimerasa', 'La cola te protege. Pero en el citoplasma las ARNasas la van a ir recortando, y si se termina, te degradan.'],
            ['Poli-A polimerasa', 'Te la marco arriba a la izquierda. ¡Cuidala!'],
          ], () => { E.flags.cola = true; m.reiniciar(); });
        },
      },
      {
        id: 'histona', img: 'histona', x: 300, y: 280, nombre: 'Histona',
        hablar: m => m.hablar([['Histona', 'El ADN se enrolla alrededor de proteínas como yo. Así unos 2 metros de ADN entran en un núcleo chiquito.']]),
      },
      {
        id: 'cartel-gen', img: 'cartel', x: 160, y: 450, nombre: 'Gen',
        hablar: m => m.hablar(['Este es el gen IFNB1, en el cromosoma 9: tiene la receta del interferón beta.', DATO_INTRONES]),
      },
      {
        id: 'cartel-nucleolo', img: 'cartel', x: 1450, y: 540, nombre: 'Nucléolo',
        hablar: m => m.hablar(['Nucléolo: acá se fabrican las piezas de los ribosomas, que después salen al citoplasma.']),
      },
    ],
    salidas: [{
      x: 1720, y: 490, w: 80, h: 160, etiqueta: 'Poro nuclear →',
      puede: () => (!E.flags.casquete ? 'Todavía no podés salir: te falta el casquete 5\'.' : !E.flags.cola ? 'Todavía no podés salir: te falta la cola poli-A.' : null),
      ir: m => m.irA('poro'),
    }],
    alEntrar(m) {
      if (E.flags.nacido) return;
      m.historia([
        ['virus', 'Una célula de tu cuerpo fue infectada por un virus.'],
        ['virus', 'El virus quiere usar los ribosomas de la célula para fabricar copias de sí mismo.'],
        ['interferon', 'La célula tiene un plan: fabricar interferón beta, una proteína que avisa a las células vecinas para que se defiendan.'],
        ['adn', 'La receta está en un gen, adentro del núcleo. Pero el ADN no sale del núcleo... hace falta un mensajero.'],
        ['arnm-0', 'Ese mensajero vas a ser vos: un ARN mensajero (ARNm).'],
      ], () => m.hablar([
        ['ARN polimerasa', '¡Hola! Soy la ARN polimerasa. Estoy por copiar el gen del interferón... y la copia vas a ser vos.'],
        ['ARN polimerasa', 'Leo la hebra molde del ADN de 3\' a 5\' y voy armando el ARN de 5\' a 3\'.'],
        ['ARN polimerasa', 'Las reglas: frente a A va U; frente a T va A; frente a C va G; y frente a G va C. En el ARN no hay T: hay U.'],
        ['ARN polimerasa', 'Ayudame con las primeras nueve bases del gen.'],
      ], () => m.reto(R.transcribir(9, 0), () => {
        E.flags.nacido = true;
        E.paginas = 'A';
        m.hablar([
          ['ARN polimerasa', '¡Ahí estás! El resto lo copio yo: el gen tiene 564 bases que codifican proteína.'],
          ['ARN polimerasa', 'Te regalo el Codonario: la tabla del código genético. Por ahora tiene la página de los codones que empiezan con A, donde está AUG, el codón de inicio.'],
          ['ARN polimerasa', 'Antes de salir te faltan el casquete 5\' y la cola poli-A. Buscá a las enzimas que los ponen.'],
          'Movete con las flechas o WASD (en el celular, arrastrando el dedo). Para hablar, acercate y tocá "Hablar" o apretá Espacio.',
        ], () => m.reiniciar());
      })));
    },
  },

  poro: {
    nombre: 'Poro nuclear', ancho: 1300, alto: 900, fondo: 0xefe9fb, inicio: [120, 450],
    decorar(m, g, rnd) {
      manchas(g, rnd, 8, 600, 900, 0xe5dcfa, 0.8, 60, 130);
      manchas(g, rnd, 50, 600, 900, 0xd9ccf6, 1, 3, 6);
      g.fillStyle(0xe4f5ef, 1).fillRect(670, 0, 630, 900);
      manchas(g, rnd, 6, 630, 900, 0xd3efe6, 0.4, 60, 120);
      g.translateCanvas(670, 0);
      ribosomas(g, rnd, 20, 630, 900);
      g.translateCanvas(-670, 0);
      g.fillStyle(0xd8cdf6, 1).fillRect(640, 0, 60, 900);
      for (const x of [645, 695]) g.fillStyle(0x9b87d8, 1).fillRoundedRect(x - 9, 0, 18, 380, 9).fillRoundedRect(x - 9, 520, 18, 380, 9);
      m.add.text(330, 790, 'NÚCLEO', estilo(26, '#9b87d8', { fontStyle: '800' })).setOrigin(0.5);
      m.add.text(990, 790, 'CITOPLASMA', estilo(26, '#5fb79d', { fontStyle: '800' })).setOrigin(0.5);
    },
    paredes: () => [[630, 0, 80, 380], [630, 520, 80, 380], ...(E.flags.poro ? [] : [[630, 380, 80, 140]])],
    npcs: [
      {
        id: 'guardian', img: 'guardian', x: 670, y: 450, nombre: 'Complejo del poro', visible: () => !E.flags.poro,
        hablar(m) {
          m.hablar([
            ['Complejo del poro', 'Alto. Controlo lo que entra y sale del núcleo.'],
            ['Complejo del poro', 'Solo dejo salir ARNm bien procesados... y que sepan bien lo que son. Respondé mis preguntas.'],
          ], () => m.batalla('guardian', () => {
            E.flags.poro = true;
            m.hablar([['Complejo del poro', 'Podés pasar. ¡Suerte en el citoplasma!'], ...nuevaPagina()], () => m.reiniciar());
          }));
        },
      },
      {
        id: 'guardian2', img: 'guardian', x: 560, y: 250, nombre: 'Complejo del poro', visible: () => !!E.flags.poro,
        hablar: m => m.hablar([['Complejo del poro', 'Pasá nomás. El ADN se queda; los ARNm salen.']]),
      },
      {
        id: 'adn', img: 'adn', x: 300, y: 330, nombre: 'ADN',
        hablar: m => m.hablar([['ADN', 'Yo no salgo del núcleo. La célula manda copias de mis genes: los ARN mensajeros, como vos.']]),
      },
      {
        id: 'actina', img: 'arnm-2', x: 350, y: 660, nombre: 'ARNm de la actina',
        hablar: m => m.hablar([['ARNm de la actina', '¡Hola, colega! Yo llevo la receta de la actina. Todo el tiempo salen mensajeros distintos, cada uno con la receta de una proteína.']]),
      },
      {
        id: 'cartel-envoltura', img: 'cartel', x: 520, y: 200, nombre: 'Envoltura nuclear',
        hablar: m => m.hablar(['Envoltura nuclear: dos membranas que rodean el núcleo. Las moléculas entran y salen por los poros.']),
      },
    ],
    salidas: [{ x: 1230, y: 0, w: 70, h: 900, etiqueta: 'Citoplasma →', ir: m => m.irA('citoplasma') }],
  },

  citoplasma: {
    nombre: 'Citoplasma', ancho: 2400, alto: 1300, fondo: 0xe4f5ef, inicio: [120, 650],
    decorar(m, g, rnd) {
      manchas(g, rnd, 30, 2400, 1300, 0xd3efe6, 0.7, 60, 150);
      fibras(g, rnd, 6, 2400, 1300, 0xcbe8df);
      ribosomas(g, rnd, 90, 2400, 1300);
      for (let i = 0; i < 14; i++) g.lineStyle(4, 0xb8e0d4, 1).strokeCircle(rnd.between(50, 2350), rnd.between(50, 1250), rnd.between(12, 22));
      for (const [, x, y] of this.obstaculos) g.fillStyle(0x000000, 0.07).fillEllipse(x, y + 46, 150, 26);
    },
    obstaculos: [['mitocondria', 500, 500], ['mitocondria', 900, 180], ['mitocondria', 1000, 780], ['mitocondria', 1480, 500], ['mitocondria', 1800, 1080], ['mitocondria', 1720, 200]],
    npcs: [
      ...Object.entries(ARNTS).map(([codon, aa], i) => ({
        id: `arnt-${codon}`, img: `arnt-${codon}`, x: [300, 760, 1250, 1300][i], y: [250, 1060, 260, 1060][i], nombre: `ARNt-${aa}`,
        hablar(m) {
          if (E.arnt.includes(codon)) return m.hablar([[`ARNt-${aa}`, 'En los combates, llamame con "Llamar ARNt".']]);
          m.hablar([[`ARNt-${aa}`, `Soy un ARN de transferencia: llevo el aminoácido ${aa}. Si adivinás qué codón leo, me sumo a tu equipo.`]], () =>
            m.reto(R.reclutar(codon), ok => {
              if (!ok) return m.hablar([[`ARNt-${aa}`, 'Casi. Volvé a hablarme cuando quieras.']]);
              E.arnt.push(codon);
              m.hablar([[`ARNt-${aa}`, '¡Me sumo! En los combates podés llamarme.'], ...nuevaPagina()], () => m.reiniciar());
            }));
        },
      })),
      {
        id: 'cartel-mito', img: 'cartel', x: 380, y: 600, nombre: 'Mitocondria',
        hablar: m => m.hablar(['Mitocondria: produce ATP, la energía que usa la célula. Fabricar proteínas gasta mucha energía.']),
      },
      {
        id: 'ribosoma', img: 'ribosoma', x: 2240, y: 650, nombre: 'Ribosoma',
        hablar(m) {
          if (!E.flags.virus) return m.hablar([['Ribosoma', '¡Socorro! El virus me está usando para fabricar sus proteínas.']]);
          m.hablar([
            ['Ribosoma', '¡Gracias por liberarme! Soy un ribosoma: tengo una subunidad grande y una chica.'],
            ['Ribosoma', 'Me pego cerca de tu casquete 5\' y te recorro hasta encontrar el codón de inicio.'],
          ], () => {
            m.reto(R.inicio(), ok => m.traducir({ desde: 0, jugar: 6, hasta: 21 }, () => m.hablar([
              ['PRS', '¡Alto! Soy la partícula de reconocimiento de la señal (PRS).'],
              ['PRS', 'Los primeros 21 aminoácidos de esta proteína son un péptido señal: quiere decir que va a salir de la célula.'],
              ['PRS', 'Por eso llevo al ribosoma, con vos adentro, hasta el retículo endoplasmático rugoso. ¡Vamos!'],
            ], () => { E.flags.trad1 = true; m.irA('reticulo'); })));
          });
        },
      },
    ],
    enemigos: [
      { id: 'arnasa1', img: 'arnasa', tipo: 'arnasa', x: 720, y: 380, rango: 220 },
      { id: 'arnasa2', img: 'arnasa', tipo: 'arnasa', x: 1250, y: 680, rango: 240 },
      { id: 'arnasa3', img: 'arnasa', tipo: 'arnasa', x: 1750, y: 820, rango: 220 },
      {
        id: 'virus', img: 'virus', tipo: 'virus', x: 2020, y: 650, jefe: true,
        antes: [['Virus', '¡Ja! Este ribosoma ahora trabaja para mí. Va a fabricar mis proteínas, no las tuyas.'], ['Virus', 'Y si me querés frenar... ¡mis genes mutan todo el tiempo!']],
        despues: [['Virus', '¡Nooo! Me voy a buscar otro ribosoma...'], 'El ribosoma quedó libre. ¡Hablale!'],
      },
    ],
    objetos: [[180, 1180], [1150, 90], [2050, 300]].map(([x, y], i) => ({
      id: `pabp${i}`, img: 'pabp', x, y,
      tomar: m => { E.pabp++; m.hablar(['Encontraste una PABP: una proteína que se pega a la cola poli-A y la protege. Usala en un combate.']); },
    })),
    alEntrar(m) {
      if (E.flags.citoplasma) return;
      E.flags.citoplasma = true;
      m.hablar([
        'Llegaste al citoplasma. El ribosoma que necesitás está a la derecha... pero hay un virus cerca.',
        'Cuidado con las ARNasas: limpian la célula de ARN viejo y te van a recortar la cola. No son malas: es su trabajo.',
        'Buscá ARN de transferencia (ARNt): se suman a tu equipo si sabés qué codón leen.',
      ]);
    },
  },

  reticulo: {
    nombre: 'Retículo endoplasmático rugoso', ancho: 1800, alto: 1000, fondo: 0xfdf0e4, inicio: [200, 180],
    decorar(m, g, rnd) {
      manchas(g, rnd, 20, 1800, 1000, 0xfbe4d1, 0.8, 60, 140);
      for (const [x, y, w, h] of this.paredes) {
        g.fillStyle(0x000000, 0.06).fillRoundedRect(x, y + 8, w, h, 34);
        g.fillStyle(0xf6c9a8, 1).fillRoundedRect(x, y, w, h, 34);
        g.fillStyle(0xfbdcc4, 1).fillRoundedRect(x + 16, y + 16, w - 32, h - 32, 18);
        g.fillStyle(0xa1887f, 1);
        for (let px = x + 20; px < x + w - 10; px += 46) g.fillCircle(px, y - 4, 9).fillCircle(px + 18, y + h + 4, 9);
      }
      m.add.text(900, 960, 'Los ribosomas pegados a la membrana le dan el aspecto "rugoso".', estilo(20, '#b07a56')).setOrigin(0.5);
    },
    paredes: [[200, 250, 1350, 70], [250, 520, 1550, 70]],
    npcs: [
      { id: 'chaperona', img: 'chaperona', x: 700, y: 420, nombre: 'Chaperona', hablar: m => m.hablar([['Chaperona', 'Adentro del retículo ayudo a las proteínas a plegarse bien. Una proteína mal plegada no funciona.']]) },
      { id: 'peptidasa', img: 'peptidasa', x: 1620, y: 760, nombre: 'Peptidasa señal', hablar: m => m.hablar([['Peptidasa señal', 'Cuando salga tu proteína, le voy a cortar el péptido señal: ya no lo va a necesitar.']]) },
      {
        id: 'ribosoma2', img: 'ribosoma', x: 1350, y: 800, nombre: 'Tu ribosoma',
        hablar(m) {
          m.hablar([['Ribosoma', 'Ya estoy anclado al retículo: la proteína va a ir entrando a su interior. ¡Sigamos traduciendo!']], () =>
            m.traducir({ desde: 21, jugar: 27, hasta: ARNM.length / 3 - 1, stop: true }, () => m.hablar([
              ['Peptidasa señal', 'Corto el péptido señal. Quedan 166 aminoácidos: el interferón beta maduro.'],
              ['Chaperona', 'Y yo lo ayudo a plegarse. ¡Listo!'],
              ['Ribosoma', 'Te suelto... y enseguida otro ribosoma te empieza a leer de nuevo. De un solo ARNm salen muchas copias de la proteína.'],
              'Ahora seguimos a la proteína que fabricaste: el interferón beta. Viaja en una vesícula hasta el aparato de Golgi.',
            ], () => { E.flags.trad2 = true; E.yo = 'interferon'; m.irA('golgi'); })));
        },
      },
    ],
    alEntrar(m) {
      if (E.flags.reticulo) return;
      E.flags.reticulo = true;
      m.hablar(['Llegaste al retículo endoplasmático rugoso. Tu ribosoma ya está anclado a la membrana: buscalo abajo a la derecha.']);
    },
  },

  golgi: {
    nombre: 'Aparato de Golgi', ancho: 1600, alto: 900, fondo: 0xfff6dc, inicio: [120, 450],
    decorar(m, g, rnd) {
      manchas(g, rnd, 16, 1600, 900, 0xfdebb8, 0.7, 60, 130);
      for (let i = 0; i < 5; i++) g.lineStyle(30, i % 2 ? 0xf7cf7a : 0xf2b84b, 1).beginPath().arc(900 + i * 34, 450, 230 - i * 10, Math.PI * 0.68, Math.PI * 1.32).strokePath();
      g.fillStyle(0xf7cf7a, 1);
      for (let i = 0; i < 14; i++) g.fillCircle(rnd.between(250, 1450), rnd.between(60, 840), rnd.between(10, 18));
      g.fillStyle(0xf2b84b, 1).fillRect(1540, 0, 60, 900);
      m.add.text(1500, 450, 'Membrana\nplasmática', estilo(20, '#b9861f', { align: 'right', fontStyle: 'bold' })).setOrigin(1, 0.5);
    },
    paredes: [[680, 250, 140, 400]],
    npcs: [{
      id: 'golgi', img: 'golgi', x: 480, y: 450, nombre: 'Aparato de Golgi',
      hablar(m) {
        m.hablar([
          ['Golgi', 'Bienvenido. En el Golgi muchas proteínas reciben azúcares y se empaquetan en vesículas.'],
          ['Golgi', 'Te pongo en una vesícula que va a la membrana plasmática. Desde ahí vas a salir de la célula.'],
        ], () => { E.flags.golgi = true; m.reiniciar(); });
      },
    }],
    salidas: [{
      x: 1540, y: 0, w: 60, h: 900, etiqueta: '',
      puede: () => (E.flags.golgi ? null : 'Primero pasá por el aparato de Golgi.'),
      ir: m => m.final(),
    }],
    alEntrar(m) {
      if (E.flags.enGolgi) return;
      E.flags.enGolgi = true;
      m.hablar(['Ahora sos el interferón beta. Llegaste en una vesícula desde el retículo. Hablá con el aparato de Golgi.']);
    },
  },
};
