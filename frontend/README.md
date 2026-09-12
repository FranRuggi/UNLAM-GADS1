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
