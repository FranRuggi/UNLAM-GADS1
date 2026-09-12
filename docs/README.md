# Documentación técnica de zTech CRM

Este directorio traduce las definiciones funcionales y arquitectónicas del proyecto a guías ejecutables para diseño, implementación y entrega.

## Documentos

1. [Arquitectura general](arquitectura/01-arquitectura-general.md): contexto, stack, contenedores, despliegue y restricciones.
2. [Módulos y capas](arquitectura/02-modulos-y-capas.md): límites del monolito modular, dependencias y organización de frontend y backend.
3. [Datos, seguridad y concurrencia](arquitectura/03-datos-seguridad-y-concurrencia.md): multi-tenancy, autorización, persistencia, auditoría y reservas.
4. [Plan de desarrollo](planificacion/plan-de-desarrollo.md): hitos, alcance por entrega, secuencia, pruebas y criterios de salida.
5. [Registro de decisiones](decisiones/decisiones-pendientes.md): decisiones funcionales resueltas y temas aún abiertos.
6. [ADR](decisiones/adr/): decisiones que cambian arquitectura, límites modulares, contratos o tecnología.

## Fuentes y precedencia

- `consignas/*.pdf` definen alcance, entidades mínimas, reglas de negocio, casos de uso, entregas y orden obligatorio de desarrollo. **Es la fuente de máxima autoridad.**
- `ERS - CRM Eventos Corporativos.docx` consolida y detalla esos requisitos.
- `Arquitectura General — zTech CRM.docx` define arquitectura y tecnologías.
- `TP_CRM_relevamiento.docx` aporta el análisis original de la consigna y el orden de desarrollo.

Ante una diferencia: la consigna gobierna el alcance, la ERS gobierna el comportamiento del producto y el documento de arquitectura gobierna las decisiones técnicas, siempre que no contradiga a las anteriores. Las decisiones aún abiertas se registran explícitamente; no deben resolverse de manera implícita en el código.

Cuando una decisión se aparta deliberadamente de la consigna, debe quedar registrada como ADR con el motivo — es el caso de [ADR-003](decisiones/adr/ADR-003-multi-tenancy.md), que mantiene la multi-tenancy aunque la consigna la excluya del alcance.

## Contexto operativo para agentes

`CLAUDE.md` en la raíz y `.claude/context/` destilan estos documentos para las instancias de Claude Code que implementan el sistema. Si cambia una decisión acá, hay que actualizarlos en el mismo pull request.

## Mantenimiento

Actualizar estos documentos en el mismo pull request que cambie un límite modular, contrato, tecnología, regla crítica o hito. Las decisiones de arquitectura irreversibles o costosas deben registrarse como ADR antes de implementarse.
