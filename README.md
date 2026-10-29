# Mensajero

RPG educativo sobre **transcripción y traducción** para bachillerato. Sos un ARN mensajero: nacés en el núcleo, salís por el poro nuclear, cruzás el citoplasma y llegás al ribosoma para fabricar **interferón beta**, la proteína que avisa a las células vecinas que hay un virus.

Funciona en el navegador (celular, ceibalita o PC) y se puede instalar como app para jugar sin internet.

## Cómo se juega

| Zona | Qué se aprende |
|---|---|
| Núcleo | Transcripción (ADN molde → ARNm), casquete 5' y cola poli-A |
| Poro nuclear | Diferencias entre ADN y ARN, preguntas generales |
| Citoplasma | Codones y aminoácidos, anticodones, ARNasas, mutaciones (jefe: el virus), codón de inicio |
| Retículo rugoso | Traducción en el ribosoma, péptido señal, codón stop |
| Aparato de Golgi | Empaquetado y salida de la proteína |

También hay un **modo práctica** con cinco temas sueltos, para repasar.

Controles: flechas o WASD y Espacio para hablar; en el celular, arrastrar el dedo y tocar "Hablar".

## Biología

Las secuencias son reales: gen humano **IFNB1** (NCBI NM_002176.4). Para verificar que el juego traduce bien:

```bash
node check.mjs
```

## Jugar en la computadora

Doble clic en `index.html`. No hace falta internet ni servidor.

## Cambiar el juego

El código está en `src/`, pero la página carga `juego.js`, que es todo `src/` junto en un solo archivo (así funciona con doble clic). Después de cambiar algo en `src/`, desde esta carpeta:

```bash
npm run build
```

y recargá la página. Si te olvidás, el juego sigue mostrando la versión anterior.

## Publicarlo

Es una página estática: alcanza con subir la carpeta a **GitHub Pages** o **Netlify**. Cada vez que publiques cambios, subí el número de `VERSION` en `sw.js` para que los celulares bajen la versión nueva.

## Dónde está cada cosa

- `src/data.js`: secuencia del gen, código genético y preguntas
- `src/retos.js`: generadores de desafíos
- `src/zonas.js`: mapas, personajes y diálogos
- `src/arte.js`: dibujos de los personajes (SVG), con versión de ojos cerrados para parpadear
- `src/fx.js`: partículas, números que flotan y sonidos (generados en el momento, sin archivos de audio)
- `src/mundo.js`, `src/batalla.js`, `src/traduccion.js`, `src/main.js`: escenas del juego
- `src/phaser.min.js`: motor de juegos [Phaser 3.90](https://phaser.io)
- `fuente.css`: fuente Nunito (licencia SIL Open Font), incluida para que funcione sin internet
