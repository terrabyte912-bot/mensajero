// Guarda el juego en el dispositivo para que funcione sin internet.
// Cambiá VERSION cada vez que publiques cambios, así los celulares bajan la versión nueva.
const VERSION = 'mensajero-2';
const ARCHIVOS = [
  './', 'index.html', 'manifest.webmanifest', 'icono.svg',
  'fuente.css', 'src/phaser.min.js', 'juego.js',
];

self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS))));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
