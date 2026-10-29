// La partida se guarda en el propio dispositivo (localStorage).
const CLAVE = 'mensajero-partida';

export const nuevaPartida = () => ({
  zona: 'nucleo', yo: 'arnm', cola: 100, flags: {}, paginas: '', pabp: 0, arnt: [], aciertos: 0, errores: 0, pos: null,
});
export let E = nuevaPartida();

export function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch {} }
export function hayPartida() { try { return !!localStorage.getItem(CLAVE); } catch { return false; } }
export function cargar() {
  try { E = { ...nuevaPartida(), ...JSON.parse(localStorage.getItem(CLAVE)) }; } catch { E = nuevaPartida(); }
}
export function empezar() { E = nuevaPartida(); guardar(); }

// Páginas del Codonario: una por primera base del codón.
export function darPagina() {
  const p = [...'AUCG'].find(b => !E.paginas.includes(b));
  if (p) E.paginas += p;
  return p;
}
