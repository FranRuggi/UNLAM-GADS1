# Repository Guidelines

## Project Structure & Module Organization

This repository holds the UNLaM GADS1 corporate-events CRM. The root contains:

- `README.md`: short project overview.
- `frontend/`: React 19 + TypeScript + Vite application. Today it is a **visual mock-up with no backend**: no auth, no HTTP, no persistence. See `frontend/README.md`.
- `docs/`: versioned architecture, planning, and decision records in Markdown, plus `docs/marca/` with the approved logo files.
- `docs/consignas/`: the four assignment PDFs.

The backend (`backend/`) and deployment artifacts (`infra/`) are not committed yet; the target layout is in `docs/arquitectura/01-arquitectura-general.md`. Update this guide and `README.md` whenever a new top-level directory appears.

## Build, Test, and Development Commands

Frontend commands run from `frontend/`:

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # tsc -b && vite build — must pass before every commit
npm run preview  # serve the production build
npm run lint     # oxlint
```

There is no backend toolchain yet. Useful repository checks:

```powershell
git status --short   # Review tracked and untracked work
git diff --check     # Detect whitespace errors in text changes
```

## Coding Style & Naming Conventions

Keep Markdown concise, use ATX headings (`#`, `##`), and preserve the repository's Spanish domain terminology (for example, *oportunidad*, *etapa*, and *salón*). Retain requirement identifiers such as `RF-01`, `RN-01`, and `CA-01`; do not renumber them casually. Use descriptive filenames and avoid ambiguous variants such as `final2` or `nuevo`.

Frontend code follows the same rule: **files, components, props, variables, and UI copy are written in Spanish**, using the ERS vocabulary. Styling is CSS Modules plus design tokens — never hard-code a colour, spacing, or font value; take it from `frontend/src/shared/styles/tokens.css`. Icons are added to `shared/components/Icono.tsx` rather than pulled from a library. Every public page renders `<Seo />`; every `/app` screen renders it with `noIndexar`. Conventions are spelled out in `frontend/README.md`.

## Testing Guidelines

Automated tests do not exist yet; they arrive together with the API layer. For now:

- Frontend changes must pass `npm run build` (type-check included) before committing.
- Walk the routes you touched and confirm there are no console errors, that the page does not scroll horizontally at 390 px, and that each public page keeps its own `title`, `description`, and `canonical`.
- Document changes are validated by cross-checking both requirements documents and verifying internal references.

Future features should include tests for backend authorization, opportunity stage history, logical deletion, reservation capacity, and overlapping confirmed bookings, plus Vitest and Testing Library on the frontend.

## Commit & Pull Request Guidelines

Use short, imperative subjects, optionally scoped, such as `docs: clarify reservation overlap rule` or `feat(frontend): add opportunity detail screen`. Keep commits focused.

Pull requests should explain the change and its requirement IDs, list validation performed, link the relevant issue, and include screenshots or an exported PDF when document layout changes. Call out unresolved decisions or scope changes explicitly.
