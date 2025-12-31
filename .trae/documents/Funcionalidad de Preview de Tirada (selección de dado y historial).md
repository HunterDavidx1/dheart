## Alcance
- Hacer la sección de preview mucho más pequeña y operativa.
- Permitir seleccionar el/los dados a usar, actualizar el texto del botón según la selección, tirar valores aleatorios acorde al dado activo y registrar un historial.
- Los chips "+1 +2 +3" y "10 13 15" serán de selección (no acumulativos).

## Cambios de UI (más pequeño)
- Reducir paddings/márgenes: `p-3`/`p-2`, `mb-2`.
- Tipografías más pequeñas: `text-sm`/`text-xs`.
- `DieShape` en preview a `size=24`.
- Compactar la tarjeta de resultados e historial.

## Selección de dados
- En `apps/web/src/components/DicePreview.vue` añadir una paleta compacta de dados (d4,d6,d8,d10,d12,d20). Opcional: derivar de `library.diceSets` si existe.
- Estado: `selectedDice: number[]` (máx. 2). Click en un `DieShape`:
  - Si no está seleccionado → añadir (hasta 2). Si ya hay 2, reemplazar el más antiguo.
  - Si está seleccionado → quitar.
- Colores cuando hay 2: Esperanza verde `#5f8b3f`, Miedo rojo `#d16a65`.
- Texto del botón:
  - 1 dado: `Tirar d<sides>`.
  - 2 dados: `Tirar Esperanza y Miedo`.

## Chips estéticos (no suman)
- Modificador: chips `[0,1,2,3]` que asignan `modifier` exactamente (no incrementan).
- Umbral: chips `[10,13,15]` que asignan `minSuccess` exactamente.

## Lógica de tirada
- Click en el botón de tirar:
  - Si `selectedDice.length === 1`: `roll = rand(1..selectedDice[0])`, `total = roll + modifier`.
  - Si `selectedDice.length === 2`: `hope = rand(1..selectedDice[0])`, `fear = rand(1..selectedDice[1])`, `total = hope + fear + modifier`.
  - Si no hay selección → modo por defecto DaggerHeart: 2×d12.
- `success = total >= minSuccess`.
- Actualizar la UI de resultados (compacta) con los valores.

## Historial de tiradas
- Estructura `RollEntry`: `{ ts, mode: 'single'|'hopeFear', sides: number[], results: number[], modifier, minSuccess, total, success }`.
- Guardar las últimas 10 tiradas en `history` local del componente.
- Renderizar lista compacta (hora, dados, resultado, éxito/fallo) en `DicePreview.vue`.

## Integración
- Insertar la paleta y chips dentro de `DicePreview.vue` debajo del grid de sets ya mostrado en `LibraryPage.vue`.
- No se requiere modificación de `LibraryPage.vue` más allá de mostrar `DicePreview`.

## Accesibilidad
- `aria-label` en los `DieShape` y chips; foco visible con clases utilitarias.

## Verificación
- Cargar Biblioteca → Dados. Seleccionar 1 dado (p.ej. d6) y tirar: ver roll aleatorio 1..6 y entrada en historial.
- Seleccionar 2 dados (p.ej. d12+d12): botón cambia a “Tirar Esperanza y Miedo”, tirar: ver dos valores y entrada en historial.
- Cambiar chips de `modificador` y `umbral`: fijan el valor exacto, no acumulan.
- Comprobar que se mantienen las últimas 10 tiradas.
