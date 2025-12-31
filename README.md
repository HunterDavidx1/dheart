# Vue 3 + TypeScript + Vite

## Configuración y Ejecución del Proyecto

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos
- Node.js (v20 o superior recomendado)
- PostgreSQL instalado localmente (el script busca en `C:\Program Files\PostgreSQL` por defecto)

### 1. Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar todas las dependencias:

```bash
npm install
```

### 2. Configuración de la Base de Datos

El proyecto utiliza un script personalizado para gestionar una instancia local de PostgreSQL en el puerto `5433` (para evitar conflictos con el puerto por defecto `5432`).

**Inicialización (Primera vez o para reiniciar todo):**
Este comando borra los datos existentes, inicializa una nueva base de datos, crea el usuario y la base de datos `daggerheart`.

```bash
npm run db:reset --workspace=apps/server
```

**Migraciones y Datos Semilla:**
Una vez inicializada la base de datos, aplica el esquema y carga los datos iniciales:

```bash
npm run prisma:migrate:dev --workspace=apps/server
npm run db:seed --workspace=apps/server
```

### 3. Ejecución de Servicios

Para trabajar en el proyecto, necesitarás tener corriendo la base de datos, el backend y el frontend.

**Base de Datos:**
Si la base de datos no está corriendo (por ejemplo, después de reiniciar el equipo), iníciala con:
```bash
npm run db:start --workspace=apps/server
```
*(Para detenerla: `npm run db:stop --workspace=apps/server`)*

**Backend (API):**
En una terminal nueva:
```bash
npm run server
```
Esto iniciará el servidor en modo desarrollo (`watch`).

**Frontend (Web):**
En otra terminal nueva:
```bash
npm run dev
```
Esto iniciará la aplicación Vue con Vite.

### Comandos Útiles

- **Linting:** `npm run lint`
- **Typecheck:** `npm run typecheck`
- **Build:** `npm run build`
