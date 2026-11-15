# Verano sin Pulgas · Veterinaria Cola Inquieta

Landing de una sola página de la promo "Verano sin Pulgas" (vence el 28/02/2027 inclusive, hora Argentina).

## Qué hace
- Elegís perro o gato; el pack se asigna solo según la especie y el peso (Liviano, Mediano, Grande o Felino). Con gato no se pide ni se guarda el peso.
- Genera un cupón con código (VER-0001). Un mismo correo con la misma mascota no obtiene un segundo cupón.
- Cuenta regresiva con la fecha del dispositivo. Pasada la fecha de fin, el formulario se reemplaza por "La promo terminó".
- "Tus cupones" muestra lo guardado en este dispositivo; cada uno se abre, se puede imprimir o cerrar.

## Datos y almacenamiento

No hay servidor, base de datos ni cuentas: todo lo que se guarda vive en el `localStorage` del navegador. Todo el acceso pasa por `src/lib/cupones.ts`; las constantes y claves están en `src/lib/packs.ts`.

### Inventario

| Elemento | Dónde vive | Persistente |
|---|---|---|
| Cupones (incluye código, mascota y datos del titular) | `localStorage`, clave `kod_vet_cupones` | Sí |
| Contador de códigos | `localStorage`, clave `kod_vet_contador` | Sí |
| Marca de ejemplos cargados | `localStorage`, clave `kod_vet_demo` | Sí |
| Packs y precios | Código: `PACKS` en `src/lib/packs.ts` | No es un dato del navegador |
| Fecha de fin de la promo | Código: `PROMO_FIN_ISO`, `PROMO_VENCE` en `src/lib/packs.ts` | No |
| Cupones de ejemplo | Código: `EJEMPLOS` en `src/lib/cupones.ts` | No |

No existen: historial de operaciones, preferencias de usuario, configuraciones guardadas, datos de pesos ni otras claves. El peso del perro solo se usa en el formulario para elegir el pack y **nunca se guarda**; con gatos ni se pide.

### `kod_vet_cupones`
- Tipo: texto JSON con un array de cupones.
- Estructura de cada cupón (tipo `Cupon`):

```json
{
  "codigo": "VER-0001",
  "nombre": "Lucía Fernández",
  "correo": "lucia.fernandez@ejemplo.com.ar",
  "mascota": "Tobi",
  "tipo": "perro",
  "pack": "Mediano",
  "precio": 31000,
  "fecha": "2026-11-04T14:20:00-03:00",
  "estado": "Sin usar"
}
```
  `tipo` es `perro` o `gato`; `pack` es `Liviano`, `Mediano`, `Grande` o `Felino`; `precio` es un número en pesos; `correo` es opcional. Pueden existir cupones antiguos con código `CI-…`; siguen siendo válidos.
- Cuándo se usa:
  - **Se lee** al cargar «Tus cupones» (`src/components/mis-cupones.tsx`, `leerCupones`) y al enviar el formulario para evitar duplicados (`existeCupon`, `codigosExistentes`). Si falta o está corrupto, se trata como lista vacía. Solo se muestran los registros con `codigo`, `nombre` y `mascota` de texto.
  - **Se escribe** al generar un cupón (`src/components/cupon-form.tsx` → `agregarCupon`) y en la primera visita (`sembrarEjemplos`).
  - Cada escritura emite el evento `cupones:cambio` para refrescar la lista.
- El estado del cupón no se modifica desde esta página, y no hay sistema de reservas.

### `kod_vet_contador`
- Tipo: número como texto (por ejemplo `"3"`): el último número de código entregado.
- Se consulta y se actualiza en `reservarCodigo()` (al enviar el formulario). El siguiente código es el mayor entre este contador y los códigos `VER-####` existentes, más uno (`generarCodigo` en `src/lib/packs.ts`). Por eso vaciar la lista no reinicia la numeración.
- `sembrarEjemplos` y `restaurarEjemplos` lo dejan en `3`.

### `kod_vet_demo`
- Tipo: marca (`"1"`).
- Se escribe una sola vez, en la primera visita (`sembrarEjemplos`, llamada desde `mis-cupones.tsx`). Si existe, nunca se vuelven a cargar los ejemplos automáticamente. Además, si ya había cupones guardados, los ejemplos no los pisan.
- Ejemplos: Tobi (VER-0001, Mediano), Mishi (VER-0002, Felino), Bruno (VER-0003, Grande).

## Reinicio y restablecimiento

La interfaz no tiene botones para esto. `src/lib/cupones.ts` ofrece las funciones `eliminarCupon`, `vaciarCupones`, `restaurarEjemplos` y `actualizarCupon`, pero no están expuestas en el navegador. Para operar a mano, abrí la consola del navegador (F12 → Consola) en la página de la promo y pegá los comandos de abajo, que hacen lo mismo que esas funciones.

**Eliminar un cupón** (ejemplo: VER-0002):
```js
const k = 'kod_vet_cupones';
localStorage.setItem(k, JSON.stringify(JSON.parse(localStorage.getItem(k) || '[]').filter(c => c.codigo !== 'VER-0002')));
location.reload();
```

**Eliminar todos los cupones** (no reinicia el contador ni vuelve a cargar los ejemplos):
```js
localStorage.setItem('kod_vet_cupones', '[]'); location.reload();
```

**Reiniciar los contadores** (el próximo código será el siguiente al mayor `VER-####` que siga en la lista; con la lista vacía, `VER-0001`):
```js
localStorage.setItem('kod_vet_contador', '0'); location.reload();
```
Si quedan cupones, el contador no baja de su mayor código: la numeración nunca repite un código existente.

**Restablecer los packs:** los packs y precios no se guardan en el navegador, están en `PACKS` (`src/lib/packs.ts`). Para volver a los valores originales, restaurá ese archivo desde el historial de versiones. Un cambio de precios en el código no modifica los cupones ya emitidos, que guardan su `pack` y `precio` al momento de la emisión.

**Borrar todos los datos de la aplicación:**
```js
['kod_vet_cupones', 'kod_vet_contador', 'kod_vet_demo'].forEach(k => localStorage.removeItem(k)); location.reload();
```
Al recargar, como la marca `kod_vet_demo` ya no existe, se vuelven a cargar los 3 ejemplos (efecto igual al de la configuración inicial).

**Recuperar la configuración inicial** (3 ejemplos, contador en 3, como `restaurarEjemplos`):
```js
localStorage.setItem('kod_vet_demo', '1');
localStorage.setItem('kod_vet_contador', '3');
localStorage.setItem('kod_vet_cupones', JSON.stringify([
 {estado:'Sin usar',codigo:'VER-0001',nombre:'Lucía Fernández',correo:'lucia.fernandez@ejemplo.com.ar',mascota:'Tobi',tipo:'perro',pack:'Mediano',precio:31000,fecha:'2026-11-04T14:20:00-03:00'},
 {estado:'Sin usar',codigo:'VER-0002',nombre:'Martín Gómez',correo:'martin.gomez@ejemplo.com.ar',mascota:'Mishi',tipo:'gato',pack:'Felino',precio:19000,fecha:'2026-11-08T10:05:00-03:00'},
 {estado:'Sin usar',codigo:'VER-0003',nombre:'Camila Rossi',correo:'camila.rossi@ejemplo.com.ar',mascota:'Bruno',tipo:'perro',pack:'Grande',precio:39000,fecha:'2026-11-11T18:40:00-03:00'}
]));
location.reload();
```
Si cambiás los ejemplos en `EJEMPLOS` (`src/lib/cupones.ts`), actualizá también este bloque.

### Reiniciar datos vs. restablecer la configuración inicial
- **Reiniciar datos**: vaciar o borrar cupones y/o contador. Puede dejar la app sin ejemplos y con la numeración en otro punto.
- **Restablecer la configuración inicial**: dejar el navegador como en la primera visita (3 ejemplos, contador en 3, marca `kod_vet_demo`).
- Vaciar `kod_vet_cupones` no devuelve los ejemplos; borrar las tres claves sí.

## Seguridad y precauciones
- Borrar el `localStorage` (o los datos del sitio, o usar modo incógnito) elimina los cupones guardados en ese navegador, sin copia de seguridad ni forma de recuperarlos.
- Los datos **no se sincronizan** entre dispositivos ni navegadores: cada uno tiene sus propios cupones y su propio contador, por lo que dos dispositivos pueden generar el mismo código `VER-0001`. Un cupón no es una prueba de validez frente al local.
- Los cupones incluyen nombre y correo en texto plano; cualquiera con acceso al navegador puede verlos o editarlos.
- Antes de borrar, podés copiar una copia de respaldo en la consola: `copy(localStorage.getItem('kod_vet_cupones'))`.

## Probar la promo vencida
Cambiá la fecha del dispositivo a marzo de 2027 o posterior y recargá.

## Desarrollo
`npm install` y `npm run dev` (http://localhost:3100). Chequeos: `npm run check`.
