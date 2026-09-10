# Plan de desarrollo y entregas

## Supuestos de planificación

El calendario usa 2026, consistente con la fecha de la ERS y el contexto actual; el equipo debe confirmarlo en DP-11. La planificación empieza el 10 de septiembre, prioriza un recorrido vertical desplegable y respeta el orden exigido por la consigna. No asigna personas porque el tamaño y disponibilidad del equipo no están documentados.

## Hitos

| Fecha | Hito | Resultado verificable |
|---|---|---|
| 11/09 | Base técnica | Monorepo, proyectos, CI, Flyway, PostgreSQL y ambientes locales |
| 14/09 | Acceso mínimo | Login con usuario habilitado, tenant resuelto en backend y shell de navegación |
| 18/09 | Clientes | Alta, edición, lista y detalle de empresas/contactos; relación persistida |
| 21/09 | Oportunidades | Salones y etapas precargados; alta, edición, lista y detalle |
| 23/09 | Embudo E1 | Agrupación por etapa, cambio persistido y despliegue estable |
| **24/09** | **Entrega 1** | Demostración integral y versión etiquetada |
| 02/10 | Estabilización | Deuda de E1 cerrada, modelo completo previsto y decisiones críticas acordadas |
| 13/10 | Seguridad y maestros EF | Usuarios, tres roles, alcance por asignación, salones y cuatro catálogos |
| 25/10 | Flujo comercial EF | Historial de etapas, actividades, historial comercial y cierres |
| 04/11 | Especialización completa | Capacidad, disponibilidad, concurrencia y reaperturas según política acordada |
| 09/11 | Candidato final | Filtros, paginación, baja lógica, E2E, observabilidad y despliegue |
| **12/11** | **Entrega final** | Demostración, documentación y versión etiquetada |

## Alcance de Entrega 1

E1 debe permitir:

1. Iniciar sesión con al menos un usuario habilitado.
2. Crear, modificar, listar y consultar empresas y contactos, y relacionarlos.
3. Seleccionar salones y etapas precargados.
4. Crear, modificar, listar y consultar oportunidades con empresa o contacto, responsable y salón.
5. Visualizar el embudo por etapa y persistir un cambio de etapa.

El guion obligatorio se automatiza gradualmente como E2E: login → empresa → contacto → oportunidad → embudo → cambio de etapa → nueva consulta. Roles completos, catálogos administrables, actividades e historial no son criterio de E1.

## Trabajo posterior a E1

La secuencia recomendada es:

1. Corregir defectos observados y cerrar decisiones DP-01 a DP-10 que afecten implementación.
2. Completar usuarios, roles, permisos, aislamiento tenant y alcance por asignación.
3. Completar gestión de salones, empresas/contactos y cuatro catálogos.
4. Incorporar historial atómico de etapas y actividades comerciales.
5. Implementar cierre ganado/perdido, baja lógica y auditoría.
6. Implementar datos del evento, capacidad y exclusión de reservas concurrentes.
7. Completar búsqueda, filtros, paginación, accesibilidad básica y manejo uniforme de errores.
8. Ejecutar regresión, ensayo de demostración y estabilización del despliegue.

La IA es opcional y solo entra después de aprobar el núcleo. No forma parte del camino crítico.

## Estrategia de trabajo

Cada funcionalidad se construye como corte vertical: migración → dominio/caso de uso → API → interfaz → pruebas. Los pull requests deben ser pequeños, incluir el requisito (`RF`, `RN`, `CA`) y mantener desplegable la rama principal.

Para cada hito:

- Backend: pruebas unitarias y de integración con JUnit/Testcontainers.
- Frontend: pruebas de comportamiento con Vitest/Testing Library.
- Flujo crítico: Playwright y verificación manual en el ambiente publicado.
- Datos: migraciones probadas desde una base vacía y contra la versión anterior.
- Seguridad: casos negativos de rol, asignación y tenant.

## Criterio de terminado

Una historia está terminada cuando cumple su criterio de aceptación, valida reglas en backend, conserva aislamiento por tenant, incluye pruebas relevantes, no rompe migraciones, presenta errores utilizables y actualiza documentación. Un hito solo se cierra después de ejecutar su demostración completa sobre el ambiente desplegado.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Tiempo corto para E1 | Congelar su alcance y priorizar el recorrido vertical |
| Decisiones funcionales abiertas | Resolver primero DP-02, DP-03, DP-06, DP-07 y DP-09 |
| Fugas entre organizaciones | Repositorios tenant-aware y pruebas negativas desde el inicio |
| Inconsistencia etapa/historial | Un único caso de uso transaccional para cada transición |
| Doble reserva concurrente | Validación de aplicación más restricción PostgreSQL |
| Fallos tardíos de despliegue | Publicar una primera versión antes del 18/09 |
