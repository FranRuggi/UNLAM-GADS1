# Repository Guidelines

## Project Structure & Module Organization

Monorepo del CRM de salones de eventos corporativos (UNLaM GADS1).

- `README.md`: overview del proyecto.
- `CLAUDE.md` y `.claude/context/`: contexto destilado para las instancias de Claude Code.
- `docs/consignas/`: consignas originales del TP en PDF. **Fuente de máxima autoridad.**
- `docs/arquitectura/`, `docs/planificacion/`, `docs/decisiones/`: arquitectura, plan y
  registro de decisiones. Los ADR viven en `docs/decisiones/adr/`.
- `backend/`: API REST en Java 25 + Spring Boot 4. Incluye su `Dockerfile`.
- `frontend/`: SPA en React + TypeScript + Vite.

`backend/` y `frontend/` se desarrollan en paralelo por instancias distintas de Claude
Code. El contrato entre ambos es el OpenAPI que publica el backend, exportado a
`docs/api/openapi.json`.

Estructura de paquetes del backend: módulo de negocio al primer nivel, capas adentro
(`com.ztech.crm.<modulo>.{controller,service,domain,dto,repository,mapper}`), con lo
transversal en `com.ztech.crm.shared`. Ver
[ADR-001](docs/decisiones/adr/ADR-001-estructura-de-paquetes.md).

## Build, Test, and Development Commands

Backend (Maven, desde `backend/`):

```powershell
./mvnw clean verify        # compila y corre toda la batería de tests
./mvnw test                # sólo tests
./mvnw spring-boot:run     # levanta la API en local (perfil local)
```

Los tests de integración usan **Testcontainers**: requieren Docker Desktop corriendo.

Verificaciones de repositorio:

```powershell
git status --short   # revisar trabajo pendiente
git diff --check     # detectar errores de whitespace
```

## Coding Style & Naming Conventions

Código, entidades, tablas y columnas en **inglés**; mensajes al usuario en **español**.
Tablas y columnas en `snake_case` y plural; clases en `PascalCase`. Preservar la
terminología de dominio en español dentro de la documentación (*oportunidad*, *etapa*,
*salón*) y los identificadores de requisito (`RF-01`, `RN-01`, `CA-01`); no renumerarlos.

Markdown conciso, encabezados ATX. Nombres de archivo descriptivos; evitar `final2`, `nuevo`.

## Testing Guidelines

Cada corte vertical incluye sus pruebas: dominio con JUnit puro, servicios con Mockito,
repositorios y migraciones con Testcontainers sobre PostgreSQL real, y controladores con
MockMvc. Casos negativos obligatorios: rol insuficiente, **acceso a otro tenant** (por
listado y por id directo), transición de etapa inválida, reserva superpuesta y capacidad
excedida. Las migraciones se prueban desde base vacía.

## Commit & Pull Request Guidelines

Subjects imperativos y scopeados: `feat(opportunities): registrar historial de etapas`,
`docs: registrar ADR-003`. Commits chicos y enfocados.

Los pull requests explican el cambio y sus IDs de requisito, listan la validación
realizada, enlazan el issue correspondiente y llaman la atención sobre decisiones abiertas
o cambios de alcance. Actualizar `docs/` y `CLAUDE.md` en el mismo PR que cambie un límite
modular, un contrato, una tecnología, una regla crítica o un hito. Las decisiones de
arquitectura irreversibles o costosas se registran como ADR **antes** de implementarse.
