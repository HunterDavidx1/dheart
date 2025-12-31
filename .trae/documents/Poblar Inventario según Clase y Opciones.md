## Objetivo
Implementar el llenado automático del inventario al seleccionar clase, con ítems fijos y elecciones opcionales, manteniendo cantidades y enriqueciendo con datos de `items.json` y `consumables.json`.

## Lectura de Datos
- Importar `inventory.json` desde `@shared/data` y localizar la entrada por `class`.
- Crear diccionarios de referencia:
  - `itemsById`: unión de `items.json` y `consumables.json` (normalizado a un mapa por `id` si existe; si no, usar `name` como clave de respaldo).
  - Tratar metadatos simples (ej. `length` en `rope`) como `notes` del ítem.

## Normalización y Lógica
- Añadir utilidades:
  - `normalizeItem(entry)`: devuelve `{ id, name, quantity, notes, type }` buscando en `itemsById`; si no hay coincidencia, usar `id` como `name`.
  - `applyFixedStartingEquipment(clsInv)`: agrega todos los `fixed` al `form.inventory`. Regla especial: `gold: handful` incrementa `form.gold.handfuls` en +1.
  - `prepareChoiceSlots(clsInv)`: crea `form.inventoryChoices = [{ id, choose, options }]` para renderizar selects.
- Al cambiar `form.className`:
  - Resetear `form.inventory`, `form.inventoryChoices` y oro.
  - Cargar `inventory.json` para la clase y aplicar `fixed` y `choices`.
  - Para `rope` con `length: "50ft"`, mantener `quantity: 1` y `notes: "50ft"`.

## UI en “Inventario”
- Renderizar lista de ítems fijos con `name`, `qty`, y `notes`.
- Por cada `choice` mostrar un `<select>` (o radios) con las `options`:
  - Al elegir, agregar/actualizar en `form.inventory` usando `normalizeItem`.
  - Permitir cambiar la elección (actualiza el ítem correspondiente), y un botón para limpiar la elección.
- Evitar duplicados: si ya existe `{id}`, acumular `quantity`.

## Persistencia y Validación
- `save()`: ya incluye `inventory`; verificar que las elecciones se reflejen en el `data` final.
- Mantener la lógica de reset al cambiar clase.

## Edge Cases
- Si un `id` no está en catálogos, mostrar `id` como nombre y `notes` si aplica.
- `gold` en elecciones futuras: si aparecen cantidades distintas (ej. `bags`, `chest`), mapear a `form.gold`.

## Entregables
- Nuevas utilidades (normalización y aplicación).
- Actualización del `watch(className)` para poblar inventario.
- Render en la sección “Inventario” para ítems fijos y elecciones.

## Verificación
- Seleccionar “Bard”: debe añadir `torch`, `rope (50ft)`, `basic_supplies`, `gold: handful +1` y mostrar elecciones de poción y objeto personal.
- Cambiar clase: inventario se resetea y se vuelve a poblar.
- Guardar: `inventory` y `gold` quedan consistentes.

¿Confirmas que proceda con esta implementación?