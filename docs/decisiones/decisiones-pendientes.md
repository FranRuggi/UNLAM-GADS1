# Registro de decisiones

Este registro evita que decisiones funcionales o técnicas se oculten en implementaciones aisladas. El responsable de cada tema debe documentar la resolución, fecha, participantes, alternativas y requisitos afectados. Si la decisión cambia arquitectura, también se crea un ADR en [`adr/`](adr/).

| ID | Tema | Estado | Fecha límite sugerida |
|---|---|---|---|
| DP-01 | Autorización y efectos de modificar/reabrir una oportunidad cerrada | Pendiente | 02/10 |
| DP-02 | Herencia, asignación y visibilidad de responsables comerciales | Pendiente | 12/09 |
| DP-03 | Diccionario de datos, formatos, unicidad, moneda y obligatoriedad | Parcial | 12/09 para E1; completar 02/10 |
| DP-04 | Roles que administran salones y efecto de su desactivación | Pendiente | 02/10 |
| DP-05 | Fecha de ocurrencia frente a fecha de registro de actividades | Pendiente | 13/10 |
| DP-06 | Etapas, transiciones, orígenes, pérdidas, actividades y tipos de evento | **Parcial** — etapas resueltas | Etapas resueltas 12/09; resto 02/10 |
| DP-07 | Semántica temporal de superposición, zona horaria y reaperturas | Pendiente | 13/10 |
| DP-08 | Aplicación del nicho de hasta 50 personas | Pendiente | 02/10 |
| DP-09 | Atributos especializados de E1 y un salón por oportunidad | **Aceptada** | 12/09 |
| DP-10 | Búsquedas, filtros, orden y tamaño de página | Pendiente | 13/10 |
| DP-11 | Stack, despliegue, pantallas, calidad, equipo y año | **Parcial** — stack cerrado | 11/09 |
| DP-12 | Incorporación y flujo de IA opcional | Diferida | Después del núcleo |

Las decisiones **técnicas** del backend (DT-00..DT-22) se registran aparte, en
`.claude/context/03-decisiones-tecnicas.md`, y las que alteran arquitectura tienen su ADR.

## Prioridad inmediata

Resueltas DP-06 (etapas) y DP-09, queda **DP-02** y el subconjunto E1 de **DP-03** antes de
cerrar el modelo de E1. El esquema de E1 se implementa bajo los supuestos declarados en la
resolución parcial de DP-03; si el equipo decide otra cosa, se corrige con una migración nueva.

Antes de implementar reservas se debe resolver DP-07. La elección determina tipos temporales, rango `[inicio, fin)`, zona horaria, restricción PostgreSQL, respuestas ante reapertura y casos de prueba concurrentes.

---

# Decisiones resueltas

## DP-06 (parcial) — Etapas del embudo comercial

- Estado: Aceptada
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia
- Requisitos afectados: embudo comercial de E1, cambio de etapa, historial de etapas
- Decisión: siete etapas precargadas, con **visita al salón** como etapa propia de la industria.

| # | Etapa | Tipo (`kind`) | Cierra la oportunidad |
|---|---|---|---|
| 1 | Consulta recibida | `OPEN` | no |
| 2 | Necesidad relevada | `OPEN` | no |
| 3 | Visita al salón | `OPEN` | no |
| 4 | Propuesta enviada | `OPEN` | no |
| 5 | Negociación | `OPEN` | no |
| 6 | Ganada / Reservado | `WON` | sí |
| 7 | Perdida | `LOST` | sí |

  `Stage` es una tabla configurable (`name`, `position`, `kind`, `active`), no un enum,
  porque la entrega final exige un embudo configurable. Se precarga por migración Flyway.
  Una oportunidad `ABIERTA` sólo puede estar en una etapa `OPEN`; mover a `WON` o `LOST`
  cierra la oportunidad y exige fecha real de cierre (y motivo de pérdida si es `LOST`).

- Alternativas consideradas: embudo de 6 etapas (descartado por parecerse al ejemplo genérico
  de la consigna y aportar poco a la especialización exigida); embudo de 9 etapas con
  "disponibilidad verificada" y "seña" separadas (descartado por exceso de columnas en el
  tablero y más transiciones que validar sin beneficio claro para el TP).
- Consecuencias y pruebas necesarias: migración `V2__seed_catalogs.sql`; validación de
  compatibilidad etapa/estado en el servicio de cambio de etapa; test de que una oportunidad
  abierta no puede quedar en etapa `WON`/`LOST` sin pasar por el caso de uso de cierre.
- Pendiente de DP-06: transiciones válidas entre etapas (¿se puede saltear etapas? ¿retroceder?),
  orígenes comerciales, motivos de pérdida y tipos de actividad concretos.

## DP-09 — Un salón por oportunidad y atributos del evento en E1

- Estado: Aceptada
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia
- Requisitos afectados: modelo de `Opportunity`, capacidad del salón, reserva
- Decisión: una oportunidad referencia **un único salón** mediante FK `venue_id` (no una
  relación N:N). Desde E1 la oportunidad incluye `event_date` y `attendee_count`. La
  validación de capacidad y la restricción de exclusión por solapamiento llegan en la etapa
  de especialización (04/11), sobre columnas que ya existen desde E1.
  Los `EventService` asociados a una oportunidad quedan fuera de E1.
- Alternativas consideradas: N:N salón↔oportunidad para eventos que ocupan dos salones
  (descartado: complica la reserva y la restricción de solapamiento sin caso real en el TP);
  postergar `event_date` y `attendee_count` a después de E1 (descartado: obliga a una
  migración de columnas nuevas sobre datos existentes justo antes de la especialización).
- Consecuencias y pruebas necesarias: `venue_id NOT NULL` en `opportunities`; la restricción
  GiST de 04/11 se apoya en `venue_id` + rango temporal + `tenant_id` filtrado por estado
  ganado; test de que `attendee_count` no supera la capacidad del salón.

## DP-03 (parcial) — Diccionario de datos para E1

- Estado: Parcial
- Fecha: 12/09/2026
- Participantes: Nehuen Ascoitia
- Requisitos afectados: migración `V1__initial_schema.sql`, validaciones de entrada
- Decisión: para E1 rige el siguiente supuesto, declarado explícitamente para no esconderlo
  en el código. Se corrige con una migración nueva si el equipo define otra cosa.
  - Moneda única ARS, `NUMERIC(15,2)`, sin campo `currency`.
  - Instantes en `timestamptz` (UTC); zona de negocio `America/Argentina/Buenos_Aires`.
  - `Company`: obligatorios nombre y estado. CUIT opcional, **único por tenant cuando está
    presente**. Email validado por formato, no único.
  - `Contact`: obligatorios nombre, apellido y estado. Documento opcional, único por tenant
    cuando está presente. `company_id` **nullable** (cliente individual).
  - `User`: email **único a nivel sistema** (no por tenant), es la credencial de login.
    El login recibe sólo email + password, sin selector de organización — ver la nota
    en `V1__initial_schema.sql`.
  - Textos libres (`observaciones`) sin límite duro más allá del tipo de columna.
- Pendiente: obligatoriedad y formato exacto de teléfono, dirección y sitio web; longitudes
  máximas por campo; si el CUIT se valida con dígito verificador.

## DP-11 (parcial) — Stack y despliegue

- Estado: Parcial
- Fecha: 12/09/2026 (actualiza el acuerdo previo)
- Participantes: Nehuen Ascoitia
- Decisión: monorepo, monolito modular, React/TypeScript/Vite, **Java 25 + Spring Boot 4**,
  PostgreSQL con Flyway, JWT, Docker, **Render** para la API y **Supabase** como PostgreSQL
  administrado (reemplaza a Neon). Ver [ADR-002](adr/ADR-002-plataforma-supabase-render.md).
- Pendiente: año formal de los hitos, diseño de pantallas, reparto del equipo y parámetros
  cuantitativos de calidad.

---

## Plantilla de resolución

```markdown
## DP-XX — Título

- Estado: Aceptada | Reemplazada
- Fecha:
- Participantes:
- Requisitos afectados:
- Decisión:
- Alternativas consideradas:
- Consecuencias y pruebas necesarias:
```
