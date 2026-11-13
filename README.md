# Verano sin Pulgas · Veterinaria Cola Inquieta

Landing de una sola página de la promo "Verano sin Pulgas" (vence el 28/02/2027 inclusive, hora Argentina).

## Qué hace
- Elegís perro o gato; el pack se asigna solo según la especie y el peso (Liviano, Mediano, Grande o Felino). Con gato no se pide ni se guarda el peso.
- Genera un cupón con código (CI-XXXX-XXXX). Un mismo correo con la misma mascota no obtiene un segundo cupón.
- Cuenta regresiva con la fecha del dispositivo. Pasada la fecha de fin, el formulario se reemplaza por "La promo terminó".
- "Tus cupones" muestra lo guardado en este dispositivo; cada uno se abre, se puede imprimir o cerrar.

## Datos
No hay servidor ni cuentas: todo vive en el `localStorage` del navegador.
- `kod_vet_cupones`: lista de cupones (código, nombre, correo, mascota, tipo, pack, precio, fecha, estado "Sin usar"). Nunca se guarda el peso.
- `kod_vet_demo`: marca que indica que ya se cargaron los 3 cupones de ejemplo en la primera visita.
- La lista solo se reinicia vaciando `kod_vet_cupones`. El estado de un cupón no se modifica desde esta página, y no hay sistema de reservas.

## Probar la promo vencida
Cambiá la fecha del dispositivo a marzo de 2027 o posterior y recargá.

## Desarrollo
`npm install` y `npm run dev` (http://localhost:3100). Chequeos: `npm run check`.
