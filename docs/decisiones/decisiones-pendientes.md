# Registro de decisiones pendientes

Este registro evita que decisiones funcionales o técnicas se oculten en implementaciones aisladas. El responsable de cada tema debe documentar la resolución, fecha, participantes, alternativas y requisitos afectados. Si la decisión cambia arquitectura, también se crea un ADR.

| ID | Tema | Estado | Fecha límite sugerida |
|---|---|---|---|
| DP-01 | Autorización y efectos de modificar/reabrir una oportunidad cerrada | Pendiente | 02/10 |
| DP-02 | Herencia, asignación y visibilidad de responsables comerciales | Pendiente | 12/09 |
| DP-03 | Diccionario de datos, formatos, unicidad, moneda y obligatoriedad | Pendiente | 12/09 para E1; completar 02/10 |
| DP-04 | Roles que administran salones y efecto de su desactivación | Pendiente | 02/10 |
| DP-05 | Fecha de ocurrencia frente a fecha de registro de actividades | Pendiente | 13/10 |
| DP-06 | Etapas, transiciones, orígenes, pérdidas, actividades y tipos de evento | Pendiente | 12/09 para etapas E1; completar 02/10 |
| DP-07 | Semántica temporal de superposición, zona horaria y reaperturas | Pendiente | 13/10 |
| DP-08 | Aplicación del nicho de hasta 50 personas | Pendiente | 02/10 |
| DP-09 | Atributos especializados de E1 y un salón por oportunidad | Pendiente | 12/09 |
| DP-10 | Búsquedas, filtros, orden y tamaño de página | Pendiente | 13/10 |
| DP-11 | Stack, despliegue, pantallas, calidad, equipo y año | Parcial | 11/09 |
| DP-12 | Incorporación y flujo de IA opcional | Diferida | Después del núcleo |

## Parte resuelta de DP-11

Se acordaron monorepo, monolito modular, React/TypeScript/Vite, Java/Spring Boot, PostgreSQL/Flyway, JWT, Docker, Render y Cloudflare Pages. Continúan pendientes el año formal de los hitos, diseño de pantallas, reparto del equipo y parámetros cuantitativos de calidad.

## Prioridad inmediata

Antes de modelar E1 se deben acordar DP-02, el subconjunto E1 de DP-03 y DP-06, y DP-09. Sin estas respuestas se pueden preparar proyectos e infraestructura, pero no cerrar el modelo ni sus criterios de aceptación.

Antes de implementar reservas se debe resolver DP-07. La elección determina tipos temporales, rango `[inicio, fin)`, zona horaria, restricción PostgreSQL, respuestas ante reapertura y casos de prueba concurrentes.

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
