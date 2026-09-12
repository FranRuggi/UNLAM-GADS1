# Frontend — zTech CRM

Maqueta visual navegable del CRM de salones de eventos corporativos. **No tiene backend**: no hay autenticación, ni llamadas HTTP, ni persistencia. Los datos salen de un módulo de demostración en memoria.

Alcance, no-alcance y mapa de rutas: [`docs/planificacion/plan-frontend-maqueta.md`](../docs/planificacion/plan-frontend-maqueta.md).
Decisiones abiertas: [`docs/decisiones/decisiones-frontend.md`](../docs/decisiones/decisiones-frontend.md).

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificación de tipos y build de producción
npm run preview  # sirve el build
npm run lint     # oxlint
```

## Variables de entorno

| Variable | Para qué | Si falta |
|---|---|---|
| `VITE_SITE_URL` | URL absoluta del sitio, sin barra final. Alimenta el `canonical`, Open Graph, el `sitemap.xml` y el `robots.txt`. | Se usa `VERCEL_PROJECT_PRODUCTION_URL` si el build corre en Vercel; si no, `http://localhost:5173`. |

`robots.txt` y `sitemap.xml` **no están versionados**: los genera `vite.config.ts` durante el build, para que el dominio viva en un solo lugar. Al agregar una ruta pública hay que sumarla a `RUTAS_PUBLICAS` en ese archivo.

Copiá `.env.example` a `.env.local` si querés fijar la URL en desarrollo.

## Despliegue

Publicado en **Vercel** con integración de GitHub. La configuración vive en `vercel.json`: reescrituras de SPA (sin ellas, entrar directo a `/nosotros` da 404), caché inmutable para `/assets/*` y cabeceras de seguridad.

En Vercel, **Root Directory tiene que ser `frontend`**, porque el repositorio es un monorepo.

### Mientras el frontend viva en una rama

Hasta que `frontend/` llegue a `main`, la maqueta se publica como **previsualización de rama**. Cada push a `feature/frontend` genera un despliegue, y su URL es estable: siempre apunta al último despliegue de esa rama.

```text
https://<proyecto>-git-feature-frontend-<scope>.vercel.app
```

La URL exacta está en la pestaña **Deployments** del proyecto. No hace falta tocar la rama de producción para usarla.

### Builds de main que fallan

Vercel usa `main` como rama de producción y `main` todavía no tiene `frontend/`, así que **cada push a `main` dispara un build que falla** con `The specified Root Directory "frontend" does not exist`. No rompe nada, pero le llega un mail de error a todo el equipo.

Dos formas de cortarlo, cualquiera sirve:

- **Settings → Environments → Production → Branch Tracking**: apuntar producción a `feature/frontend`. En cuentas más viejas el ajuste está en **Settings → Git → Production Branch**.
- **Settings → Git → Ignored Build Step**: poner el comando

  ```bash
  git diff --quiet HEAD^ HEAD -- .
  ```

  Vercel salta el build cuando ese comando devuelve 0, es decir cuando el commit no tocó el Root Directory. Es lo habitual en un monorepo y conviene dejarlo puesto aunque después se resuelva lo otro.

Cuando `frontend/` llegue a `main`, la rama de producción vuelve a ser `main` y esto deja de aplicar.

### Cloudflare

`public/_redirects` es el equivalente de `vercel.json` para Cloudflare Pages y Vercel lo ignora. Conviven hasta que se cierre `DF-09` (ver `docs/decisiones/decisiones-frontend.md`).

## Estructura

```text
src/
├── app/
│   ├── layouts/     LayoutPublico (sitio) y LayoutApp (CRM)
│   └── router/      Mapa de rutas y scroll al navegar
├── features/
│   ├── inicio/          Landing de producto
│   ├── institucional/   Nosotros, contacto, términos, privacidad, 404
│   ├── acceso/          Inicio de sesión
│   ├── panel/           Pantalla principal del CRM
│   ├── empresas/        Listado, detalle, alta y edición
│   ├── contactos/       Listado, detalle, alta y edición
│   ├── salones/         Catálogo precargado
│   ├── oportunidades/   Listado, detalle, alta, edición y selector de etapa
│   ├── embudo/          Tablero por etapa
│   └── actividades/     Línea de tiempo del historial comercial
└── shared/
    ├── components/  Componentes de interfaz reutilizables
    ├── data/        Datos de demostración, tipos y formato
    ├── seo/         Metadatos por ruta y datos estructurados
    └── styles/      Tokens, base y patrones de pantalla
```

## Convenciones

- **Idioma:** nombres de archivos, componentes, variables y textos en español, con la terminología del dominio de la ERS (empresa, contacto, oportunidad, etapa, embudo, salón, actividad).
- **Estilos:** CSS Modules y tokens en custom properties. Ningún valor de color, espaciado o tipografía se escribe a mano: sale de `shared/styles/tokens.css`.
- **Componentes:** un `.module.css` por componente, con el mismo nombre. Los estilos compartidos entre pantallas van en `shared/styles/pantalla.module.css`.
- **Iconos:** se agregan a `shared/components/Icono.tsx`, no se importan de librerías.
- **SEO:** toda página pública renderiza `<Seo />` con `titulo`, `descripcion` y `canonica`. Las pantallas de `/app` lo hacen con `noIndexar`.

## Datos de demostración

`src/shared/data/demo.json` es la única fuente. `demo.ts` lo tipa y expone las búsquedas (`empresa`, `contacto`, `oportunidadesDeEtapa`, `historialDe`, entre otras).

Cuando exista la API, se reemplaza `demo.ts` por consultas de TanStack Query manteniendo la misma superficie de funciones: las pantallas no deberían cambiar.

Los datos son ficticios y coherentes entre sí: el estado de cada oportunidad coincide con el tipo de su etapa, las cerradas tienen fecha real de cierre, las perdidas tienen motivo, los asistentes nunca superan la capacidad del salón y el historial de etapas termina siempre en la etapa actual.

## Qué falta para conectar el backend

1. Cliente de API y TanStack Query en lugar de `shared/data/demo.ts`.
2. Autenticación con JWT, contexto de sesión y guardas de ruta.
3. React Hook Form y Zod en los seis formularios (ver DF-06).
4. Estados de carga, error y vacío por consulta.
5. Vitest y Testing Library.
