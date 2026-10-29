// Biología del juego. Secuencias reales: NCBI NM_002176.4 (gen IFNB1, interferón beta humano).

// Región codificante (CDS, posiciones 74..637): 564 bases, 187 aminoácidos + codón stop TGA.
export const CDS =
  'ATGACCAACAAGTGTCTCCTCCAAATTGCTCTCCTGTTGTGCTTCTCCACTACAGCTCTTTCCATGAGCT' +
  'ACAACTTGCTTGGATTCCTACAAAGAAGCAGCAATTTTCAGTGTCAGAAGCTCCTGTGGCAATTGAATGG' +
  'GAGGCTTGAATACTGCCTCAAGGACAGGATGAACTTTGACATCCCTGAGGAGATTAAGCAGCTGCAGCAG' +
  'TTCCAGAAGGAGGACGCCGCATTGACCATCTATGAGATGCTCCAGAACATCTTTGCTATTTTCAGACAAG' +
  'ATTCATCTAGCACTGGCTGGAATGAGACTATTGTTGAGAACCTCCTGGCTAATGTCTATCATCAGATAAA' +
  'CCATCTGAAGACAGTCCTGGAAGAAAAACTGGAGAAAGAAGATTTCACCAGGGGAAAACTCATGAGCAGT' +
  'CTGCACCTGAAAAGATATTATGGGAGGATTCTGCATTACCTGAAGGCCAAGGAGTACAGTCACTGTGCCT' +
  'GGACCATAGTCAGAGTGGAAATCCTAAGGAACTTTTACTTCATTAACAGACTTACAGGTTACCTCCGAAA' +
  'CTGA';
// Final de la región 5' no traducida (antes del AUG).
export const UTR5 = 'GGCGACACTGTTCGTGTTGTCAAC';
export const PEPTIDO_SENAL = 21; // aminoácidos 1..21 (sig_peptide 74..136)

export const ARNM = CDS.replace(/T/g, 'U');
export const codones = s => s.match(/.{1,3}/g);

const AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const B = 'UCAG';
export const BASES = B;
export const traducir = c => AA[16 * B.indexOf(c[0]) + 4 * B.indexOf(c[1]) + B.indexOf(c[2])];
export const TODOS_CODONES = [...B].flatMap(a => [...B].flatMap(b => [...B].map(c => a + b + c)));

export const NOMBRE = {
  F: ['Phe', 'Fenilalanina'], L: ['Leu', 'Leucina'], S: ['Ser', 'Serina'], Y: ['Tyr', 'Tirosina'],
  C: ['Cys', 'Cisteína'], W: ['Trp', 'Triptófano'], P: ['Pro', 'Prolina'], H: ['His', 'Histidina'],
  Q: ['Gln', 'Glutamina'], R: ['Arg', 'Arginina'], I: ['Ile', 'Isoleucina'], M: ['Met', 'Metionina'],
  T: ['Thr', 'Treonina'], N: ['Asn', 'Asparagina'], K: ['Lys', 'Lisina'], V: ['Val', 'Valina'],
  A: ['Ala', 'Alanina'], D: ['Asp', 'Ácido aspártico'], E: ['Glu', 'Ácido glutámico'], G: ['Gly', 'Glicina'],
  '*': ['Stop', 'Codón de terminación'],
};
export const aaTexto = a => (a === '*' ? 'Stop' : `${NOMBRE[a][0]} · ${NOMBRE[a][1]}`);

// ADN molde → base de ARN que se aparea; y ARN → ARN (codón ↔ anticodón).
export const ARN_DE_MOLDE = { A: 'U', T: 'A', C: 'G', G: 'C' };
export const PAR_ARN = { A: 'U', U: 'A', C: 'G', G: 'C' };
export const MOLDE_DE_CODIFICANTE = { A: 'T', T: 'A', C: 'G', G: 'C' };
// Anticodón escrito 3'→5', alineado debajo del codón 5'→3'.
export const anticodon = c => [...c].map(b => PAR_ARN[b]).join('');

export const COLOR_BASE = { A: 0x3dbe6b, U: 0xeb5757, T: 0xf2994a, C: 0x2f80ed, G: 0xf2c94c };

export const PREGUNTAS = [
  ['¿Qué base tiene el ARN en lugar de la timina (T)?', 'Uracilo (U)', 'Adenina (A)', 'Citosina (C)', 'Ninguna, también tiene T'],
  ['¿Dónde ocurre la transcripción en una célula eucariota?', 'En el núcleo', 'En el ribosoma', 'En el aparato de Golgi', 'En la mitocondria'],
  ['¿Qué azúcar tiene el ARN?', 'Ribosa', 'Desoxirribosa', 'Glucosa', 'Sacarosa'],
  ['¿Qué enzima fabrica el ARNm copiando el ADN?', 'La ARN polimerasa', 'La ADN polimerasa', 'La ARNasa', 'El ribosoma'],
  ['¿Cuántas bases forman un codón?', '3', '2', '4', '1'],
  ['¿Cuál es el codón de inicio?', 'AUG', 'UAA', 'UGG', 'GGG'],
  ['¿Cuál de estos es un codón de terminación (stop)?', 'UGA', 'AUG', 'UGG', 'GAU'],
  ['¿Qué molécula lleva los aminoácidos al ribosoma?', 'El ARN de transferencia (ARNt)', 'El ARN mensajero (ARNm)', 'El ADN', 'La ARN polimerasa'],
  ['¿Qué tiene el ARNm en su extremo 5\'?', 'Un casquete (cap)', 'La cola poli-A', 'El codón stop', 'Un anticodón'],
  ['¿Para qué sirve la cola poli-A?', 'Protege al ARNm y ayuda a exportarlo y traducirlo', 'Indica dónde empieza la traducción', 'Lleva aminoácidos al ribosoma', 'Une las dos hebras del ADN'],
  ['¿Qué significa que el código genético es redundante (degenerado)?', 'Varios codones distintos codifican el mismo aminoácido', 'Un codón codifica varios aminoácidos', 'Cada especie tiene un código distinto', 'Algunos codones se leen de a dos bases'],
  ['¿En qué sentido se fabrica el ARNm?', 'De 5\' a 3\'', 'De 3\' a 5\'', 'En los dos sentidos a la vez', 'Depende del gen'],
  ['¿Qué es el anticodón?', 'Tres bases del ARNt que se aparean con el codón', 'El codón que termina la traducción', 'La parte del ADN que no se copia', 'El aminoácido que lleva el ARNt'],
  ['¿Qué molécula lleva la información de un gen desde el núcleo hasta el ribosoma?', 'El ARN mensajero (ARNm)', 'El ADN', 'El ARN de transferencia (ARNt)', 'La proteína'],
  ['Si en el ADN molde hay una A, ¿qué base va en el ARNm?', 'U', 'T', 'A', 'G'],
  ['¿Qué hace un codón stop?', 'Termina la traducción', 'Agrega metionina', 'Empieza la transcripción', 'Corta el ADN'],
];

export const DATO_INTRONES = 'Dato real: el gen del interferón beta (IFNB1) no tiene intrones, así que su ARNm no necesita splicing.';
