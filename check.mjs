// Chequeo de la biología del juego: node check.mjs
import assert from 'node:assert/strict';
import { CDS, ARNM, UTR5, PEPTIDO_SENAL, PREGUNTAS, codones, traducir, anticodon, PAR_ARN } from './src/data.js';
import * as R from './src/retos.js';

// Proteína de NCBI NP_002167.1 (precursor del interferón beta).
const PROTEINA = 'MTNKCLLQIALLLCFSTTALSMSYNLLGFLQRSSNFQCQKLLWQLNGRLEYCLKDRMNFDIPEEIKQLQQ' +
  'FQKEDAALTIYEMLQNIFAIFRQDSSSTGWNETIVENLLANVYHQINHLKTVLEEKLEKEDFTRGKLMSS' +
  'LHLKRYYGRILHYLKAKEYSHCAWTIVRVEILRNFYFINRLTGYLRN';

assert.equal(CDS.length, 564);
assert.equal(codones(ARNM).map(traducir).join(''), PROTEINA + '*');
assert.equal(PROTEINA.slice(PEPTIDO_SENAL, PEPTIDO_SENAL + 6), 'MSYNLL'); // comienzo de la proteína madura
assert.ok(!UTR5.includes('ATG'), 'no puede haber otro AUG antes del de inicio');
assert.equal(traducir('AUG'), 'M');
assert.equal(['UAA', 'UAG', 'UGA'].map(traducir).join(''), '***');

for (let k = 0; k < 300; k++) {
  const t = R.transcribir(9);
  assert.equal(t.respuesta.length, 9);
  [...t.molde].forEach((b, i) => assert.equal({ A: 'U', T: 'A', C: 'G', G: 'C' }[b], t.respuesta[i]));

  const a = R.anticodonReto();
  assert.equal(new Set(a.opciones).size, 4);
  [...a.codon].forEach((b, i) => assert.equal(PAR_ARN[b], a.correcta[i]));

  const c = R.codon('A');
  assert.equal(c.codon[0], 'A');
  assert.ok(c.opciones.includes(traducir(c.codon)));

  const r = R.reclutar('AUG');
  assert.equal(r.correcta, 'AUG');
  assert.equal(anticodon('AUG'), 'UAC');
  assert.equal(new Set(r.opciones).size, 4);

  for (const tipo of ['silenciosa', 'cambio', 'sin sentido']) {
    const m = R.mutacion(tipo);
    const k3 = m.pos - (m.pos % 3), ci = k3 / 3;
    const a0 = traducir(m.original[ci]), a1 = traducir(m.mutada[ci]);
    assert.equal(tipo === 'silenciosa' ? a0 === a1 : tipo === 'sin sentido' ? a1 === '*' : a0 !== a1 && a1 !== '*', true);
  }
  assert.notEqual(R.mutacion('corrimiento').mutada.join('').length, 12);
}
PREGUNTAS.forEach(p => assert.equal(p.length, 5));
const ini = R.inicio();
assert.equal(ini.secuencia.slice(ini.indice, ini.indice + 3), 'AUG');
console.log('ok: biología verificada');
