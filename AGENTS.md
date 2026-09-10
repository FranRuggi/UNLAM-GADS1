# Repository Guidelines

## Project Structure & Module Organization

This repository is currently in the requirements and architecture phase for the UNLaM GADS1 corporate-events CRM. The root contains:

- `README.md`: short project overview.
- `docs/`: versioned architecture, planning, and decision records in Markdown.
- `Arquitectura General — zTech CRM.docx`: approved architecture and technology stack.
- `ERS - CRM Eventos Corporativos.docx`: consolidated software requirements specification.
- `TP_CRM_relevamiento.docx`: assignment analysis, domain model, and delivery scope.

No application source, automated tests, or asset directories are committed yet. When implementation begins, keep code and tests in clearly named top-level directories appropriate to the chosen stack (for example, `src/` and `tests/`) and update both this guide and `README.md` with the resulting layout.

## Build, Test, and Development Commands

There is currently no build or test toolchain. Do not document or depend on local-only scripts. Useful repository checks are:

```powershell
git status --short   # Review tracked and untracked work
git diff --check     # Detect whitespace errors in text changes
```

Open each edited `.docx` file in Word or LibreOffice before committing it and confirm that headings, tables, diagrams, and page layout render correctly. Add exact setup, run, build, migration, and test commands here once the stack is committed.

## Coding Style & Naming Conventions

Keep Markdown concise, use ATX headings (`#`, `##`), and preserve the repository's Spanish domain terminology (for example, *oportunidad*, *etapa*, and *salón*). Retain requirement identifiers such as `RF-01`, `RN-01`, and `CA-01`; do not renumber them casually. Use descriptive filenames and avoid ambiguous variants such as `final2` or `nuevo`.

For future code, commit the formatter and linter configuration with the first implementation and apply it consistently; do not introduce an undocumented style convention.

## Testing Guidelines

Until automated tests exist, validation is document-focused: cross-check changes against both requirements documents, verify internal references, and inspect exported/rendered output. Future features should include tests for backend authorization, opportunity stage history, logical deletion, reservation capacity, and overlapping confirmed bookings.

## Commit & Pull Request Guidelines

The history currently contains only `Initial commit`, so no established convention exists. Use short, imperative subjects, optionally scoped, such as `docs: clarify reservation overlap rule`. Keep commits focused.

Pull requests should explain the change and its requirement IDs, list validation performed, link the relevant issue, and include screenshots or an exported PDF when document layout changes. Call out unresolved decisions or scope changes explicitly.
