## Objetivo
Permitir que cada usuario cree y guarde personajes, enemigos, dados y mapas en una biblioteca personal reutilizable en futuras sesiones, con opción de compartirlos en salas.

## Enfoque Recomendado
- Fase 0: Biblioteca local (sin cuenta) usando `localStorage` + exportar/importar JSON.
- Fase 1: Cuentas mínimas (email + contraseña) con JWT en el backend.
- Fase 2: Compartir y adjuntar activos (“assets”) a salas; control de permisos GM/jugadores.
- Fase 3: Versionado y plantillas; historial de cambios por activo.

## Modelo de Datos
- `users`: `id`, `email`, `password_hash`, `created_at`.
- `profiles`: `user_id`, `display_name`, `locale`, `avatar_url`.
- `characters`: `id`, `owner_user_id`, `data_json` (valida con `schema/character.schema.json`), `name`, `tags`, `version`, `is_public`, `archived`, `created_at`, `updated_at`.
- `enemies`: similar a `characters` pero con su propio `data_json` y campos de desafío.
- `dice_sets`: `id`, `owner_user_id`, `name`, `config_json` (dados, macros), `version`, `created_at`, `updated_at`.
- `maps`: `id`, `owner_user_id`, `title`, `layers_json` o `image_url`, `grid_size`, `version`, `created_at`, `updated_at`.
- `rooms`: `id`, `name`, `password_hash`, `owner_user_id`, `created_at`.
- `room_players`: `room_id`, `user_id` o `guest_id`, `role` (`GM`|`Player`), `joined_at`.
- `room_assets`: `room_id`, `asset_type` (`character`|`enemy`|`dice_set`|`map`), `asset_id`, `added_by_user_id`, `created_at`.

## API (REST)
- Auth: `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /me`.
- Biblioteca:
  - `GET /assets?type=character|enemy|dice_set|map` (lista del usuario)
  - `POST /assets/characters` (crear), `PUT /assets/characters/:id` (actualizar), `DELETE /assets/characters/:id`.
  - Endpoints análogos para `enemies`, `dice_sets`, `maps`.
- Salas:
  - `POST /rooms/create`, `POST /rooms/join`, `GET /rooms/:id`.
  - `GET /rooms/:id/assets`, `POST /rooms/:id/assets/add`.

## Eventos en Tiempo Real (Socket)
- Biblioteca: `AssetCreated`, `AssetUpdated`, `AssetDeleted` (emite al propietario en sesiones abiertas).
- Sala: `RoomAssetAdded`, `RoomCharacterUpdated`, `StateSync`, `LogPosted`.
- Permisos: solo GM puede añadir/editar `enemies` y `maps` en sala; jugadores agregan sus propios `characters` y `dice_sets`.

## UI/UX
- Nueva página `Library` con pestañas: Personajes, Enemigos, Dados, Mapas.
- Cada pestaña: lista, buscar/filtrar, crear/editar, exportar/importar JSON.
- `Creators` se abren desde `Library` (evita duplicación).
- En `Room`: selector para “Adjuntar desde mi Biblioteca” por tipo de asset.
- Cambiador de idioma activo; etiquetas i18n para `library.*`, `creator.*`, `asset.*`.

## Almacenamiento de Archivos
- Mapas: soportar `image_url` (objeto de almacenamiento) y/o `layers_json`.
- Adjuntar imágenes vía carga simple; guardar en almacenamiento (p.ej., bucket `maps/`).

## Seguridad y Reglas
- Validar JSON de `characters` con `schema/character.schema.json`.
- Límite de jugadores por sala: 7.
- JWT en encabezado `Authorization`.
- Autorización por propietario y rol en sala.
- Rate limiting básico en endpoints de biblioteca.

## Versionado y Plantillas
- Campo `version` y `updated_at`; mantener tabla `asset_history` opcional para snapshots.
- Plantillas: permitir marcar assets como `is_public` para compartir como base.

## Internacionalización
- Añadir claves para biblioteca, creadores, y acciones (crear, editar, adjuntar, exportar, importar).
- Mantener ES/EN sincronizado.

## Estrategia de Migración
1) Empezar con `localStorage` (rápido y sin fricción).
2) Introducir cuentas y sincronización a servidor con migración: al iniciar sesión, importar assets locales.
3) Habilitar adjuntar assets a salas con control de permisos.
4) Añadir versionado e historial.

## Opciones Técnicas
- Auth: simple JWT en Express (bcrypt + tokens) o integración futura con Supabase Auth.
- DB: Postgres (Prisma) o Supabase (con RLS cuando se habilite compartir público).
- Storage: bucket para imágenes (mapas).

Si apruebas este diseño, procedo a crear las páginas de `Library`, los endpoints y eventos minimos, y el guardado local + migración a cuenta cuando esté disponible.