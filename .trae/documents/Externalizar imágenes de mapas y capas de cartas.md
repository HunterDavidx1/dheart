## Objetivos
- Mantener el repositorio liviano evitando almacenar imágenes grandes.
- Servir mapas como imágenes optimizadas o en mosaicos con CDN.
- Definir un esquema de capas para cartas de personajes sin duplicar assets.
- Preparar un flujo seguro de subida y acceso a archivos.

## Opciones de Almacenamiento y CDN
- Cloudflare R2 + CDN: S3-compatible, egress gratuito vía Cloudflare, ideal para mapas y tiles.
- Supabase Storage: sencillo, SDK directo para web y Node, soporta público/privado.
- Cloudinary/ImageKit/Uploadcare: almacenamiento + transformaciones y overlays para capas; más caro pero potente.
- Git LFS: evita inflar el repo, pero no resuelve distribución óptima ni CDN.

## Recomendación Técnica
- Mapas: almacenar en R2 o Supabase y servir vía CDN. Para mapas grandes, generar mosaicos (tiles) y mostrar con un visor tipo OpenSeadragon.
- Cartas con capas: dos enfoques
  - Cliente (Canvas/CSS): descargar capas como PNG/SVG y componer en el navegador; control total y sin costo de transformaciones.
  - Managed overlays (Cloudinary): enviar parámetros de overlay y recibir la imagen compuesta; útil para rendimientos móviles y cacheo.

## Esquema de Datos
- MapAsset: `id`, `title`, `imageUrl`, `tileBaseUrl?`, `maxZoom?`, `width?`, `height?`.
- CardTemplate: `id`, `name`, `layers: [{ id, url, type: 'image'|'svg'|'text', z, opacity, blend }]`, `variables: { key: default }`.
- Guardar solo URLs; nunca binarios en el repo.

## Flujo de Subida
1. Cliente solicita una URL firmada de subida al servidor (`POST /assets/sign-upload`).
2. Cliente sube el archivo directamente al storage con la URL firmada.
3. Servidor devuelve el `publicUrl` y metadatos (dimensiones, hash) para guardarlos en la app.
4. Mapas grandes: un job genera tiles (por ejemplo `256x256`) y publica en `tileBaseUrl/{z}/{x}/{y}.png`.

## Optimización de Entrega
- Formatos: preferir WebP/AVIF, fallback a PNG/JPEG.
- `srcset`/`sizes` y `loading="lazy"` en `<img>`.
- Cache CDN con `Cache-Control` y invalidación por versión/hash.
- Placeholder LQIP: mostrar un blur base64 mientras carga el asset.

## Visor de Mapas
- Mapas pequeños: `<img>` responsive.
- Mapas grandes: OpenSeadragon/Deep Zoom con tiles, interacción suave y bajo consumo.
- Controles: zoom, pan, reset, anclajes.

## Capas de Cartas
- Canvas renderer en Vue: apilar capas (`z`), aplicar `opacity` y `blend` si procede.
- Texto dinámico: capa `type: 'text'` con tipografía embebida (o rasterizada en servidor si se usa Cloudinary).
- Exportar PNG/SVG bajo demanda (botón "Exportar carta").

## Seguridad y Privacidad
- Assets privados: acceso por URLs firmadas con expiración.
- Evitar secretos en el repo; usar variables de entorno en el servidor.
- Validar tipo/mime y tamaño en subida; limitar dimensiones.

## Cambios a Implementar (resumen)
1. Servidor: endpoints para firmas de subida/lectura y configuración del proveedor (R2/Supabase).
2. Cliente: UI de subida de mapas (drag & drop) y captura de metadatos.
3. Cliente: visor de mapas con tiles y fallback a `<img>`.
4. Cliente: motor de capas para cartas (Canvas), esquema JSON y guardado de plantillas.
5. Build: no incluir imágenes en `public/`; solo URLs externas.

## Roadmap
- Fase 1: Integrar storage + subida segura + mostrar mapas por URL.
- Fase 2: Tiles y visor avanzado para mapas grandes.
- Fase 3: Motor de capas para cartas y exportación.
- Fase 4: Opcional, integración con Cloudinary para overlays gestionados.

¿Confirmas esta dirección para comenzar la implementación?