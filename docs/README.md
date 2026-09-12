# Documentación técnica de zTech CRM

Este directorio traduce las definiciones funcionales y arquitectónicas del proyecto a guías ejecutables para diseño, implementación y entrega.

## Documentos

1. [Arquitectura general](arquitectura/01-arquitectura-general.md): contexto, stack, contenedores, despliegue y restricciones.
2. [Módulos y capas](arquitectura/02-modulos-y-capas.md): límites del monolito modular, dependencias y organización de frontend y backend.
3. [Datos, seguridad y concurrencia](arquitectura/03-datos-seguridad-y-concurrencia.md): multi-tenancy, autorización, persistencia, auditoría y reservas.
4. [Plan de desarrollo](planificacion/plan-de-desarrollo.md): hitos, alcance por entrega, secuencia, pruebas y criterios de salida.
5. [Plan de la maqueta de frontend](planificacion/plan-frontend-maqueta.md): alcance, rutas, SEO y lenguaje visual de la Entrega 1.
6. [Bitácora del frontend](planificacion/bitacora-frontend.md): registro breve de lo ejecutado en la rama `feature/frontend`.
7. [Registro de decisiones](decisiones/decisiones-pendientes.md): temas que deben acordarse antes de cerrar diseño o aceptación.
8. [Decisiones del frontend](decisiones/decisiones-frontend.md): temas abiertos que surgieron al construir la maqueta.

## Marca

`marca/` contiene los archivos aprobados del logo en sus variantes de color, monocromo y escala de grises. Los derivados para la web (favicons, iconos de aplicación e imagen Open Graph) se generan a partir de ellos y viven en `frontend/public/`.

## Fuentes y precedencia

- `ERS - CRM Eventos Corporativos.docx` define alcance, requisitos, reglas de negocio y criterios de aceptación.
- `Arquitectura General — zTech CRM.docx` define arquitectura y tecnologías.
- `TP_CRM_relevamiento.docx` aporta el análisis original de la consigna y el orden de desarrollo.

Ante una diferencia, la ERS gobierna el comportamiento del producto y el documento de arquitectura gobierna las decisiones técnicas, siempre que no contradiga la ERS. Las decisiones aún abiertas se registran explícitamente; no deben resolverse de manera implícita en el código.

## Mantenimiento

Actualizar estos documentos en el mismo pull request que cambie un límite modular, contrato, tecnología, regla crítica o hito. Las decisiones de arquitectura irreversibles o costosas deben registrarse como ADR antes de implementarse.
