# Retail Store - Manager Planner

A daily planner for retail store managers — helps them turn morning chaos into a structured 5-minute plan. The single screen replaces sticky notes, WhatsApp groups, and verbal handovers with team assignments, breaks, tasks, daily focus, registers, evening shift, notes, and KPI tracking. Includes PDF export, shareable read-only links, and full German/English internationalization.

The MVP is fully client-side. The Phase 1 cloud SaaS rollout is planned (see [`docs/plans/phase-1-saas.md`](docs/plans/phase-1-saas.md)).

## Run locally

**Prerequisites:** Node.js + [pnpm](https://pnpm.io) (the project uses pnpm — `npm install` will not work).

```bash
pnpm install
pnpm dev
```

The app starts at `http://localhost:3000`.

## Available scripts

```bash
pnpm dev              # Vite dev server on port 3000
pnpm build            # Production build into ./dist
pnpm preview          # Preview the production build
pnpm lint             # TypeScript check (tsc --noEmit)

pnpm test             # Vitest in watch mode
pnpm test:run         # Vitest one-shot (CI mode)
pnpm test:ui          # Vitest UI

pnpm test:e2e         # Playwright end-to-end tests
pnpm test:e2e:ui      # Playwright UI inspector
```

**Always run `pnpm lint && pnpm test:run` before committing.** Run `pnpm test:e2e` after touching user flows (sharing, persistence, language switching, KPIs).

## Tech stack

- **React 19** + **TypeScript** (strict mode, `noUncheckedIndexedAccess`)
- **Vite 6** for build/dev server
- **Tailwind CSS v4** for styling (with custom glass-morphism + print stylesheets)
- **Zustand 5** for state management (with `persist` middleware backed by sessionStorage)
- **Zod 4** for runtime validation at boundaries
- **Framer Motion** for animations
- **Vitest** + **React Testing Library** for unit/integration tests (~80 tests)
- **Playwright** for end-to-end tests (~9 tests)
- **lz-string** for URL-encoded share links (temporary — see "Tech debt" below)

## Project structure

```
src/
├── App.tsx                  # Top-level page composition
├── main.tsx                 # Entry point + ErrorBoundary + URL hydration
├── i18n/                    # German/English translations + provider
├── test/                    # Test setup + helpers
├── shared/                  # Cross-cutting primitives + page composition
│   ├── EditableInput.tsx
│   ├── Header.tsx
│   ├── LanguageToggle.tsx
│   ├── ErrorBoundary.tsx
│   ├── types.ts
│   └── services/            # StorageService, AnalyticsService
└── domains/                 # Business domains
    ├── plan/                # Daily plan, sections, KPIs, Zustand store, Zod schema
    ├── store-location/      # Brick-and-mortar store selection
    ├── sharing/             # Share menu, share URL building
    └── team/                # Team member icons (28 SVGs + Lucide)
```

The codebase follows a domain-organized layout established during the architecture migration. New features should respect the domain boundaries — see `CLAUDE.md` for the architectural rules.

## Project documentation

> ⚠️ The `docs/` folder is intentionally gitignored. Documents below live on the maintainer's local machine and are not in version control.

```
docs/
├── FUTURE_VISION.md          # Product strategy, ICP, GTM, business model, full roadmap
├── ARCHITECTURE_ANALYSIS.md  # Architectural decisions, principles, technology choices
├── TESTING.md                # How to run and write tests
├── FEEDBACK.md               # Investor feedback synthesis
└── plans/
    ├── step-01 … step-08     # The 8-step architecture migration plans (all complete)
    └── phase-1-saas.md       # The Phase 1 cloud SaaS implementation plan
```

If you're a new maintainer or you've cloned the project to a new machine and don't see the docs, ask the project owner — they have the only copies.

## For Claude Code sessions

The project root contains a `CLAUDE.md` file with the full session-handoff context: architectural rules, current state, branch policy, technical debt, and how to work with the project owner. **Read it first before making any changes.**

## Tech debt — `MVP-SHARE-URL` markers

The MVP needed working share links before Phase 1 cloud storage exists. The temporary fix encodes the entire plan state into the share URL using `lz-string` compression. Every file involved is tagged with the literal string `MVP-SHARE-URL` so it can be removed during Phase 1 cleanup.

```bash
grep -rn "MVP-SHARE-URL" src/
```

The cleanup checklist lives in `docs/FUTURE_VISION.md` under "Phase 1 → MVP Cleanup Tasks".

## Branch policy

- **`main`** — the previous client-side-only version. Production-deployable.
- **`tech-migration`** — the architecture migration branch. Currently ahead of `main` with the full 8-step migration + Phase 1 plan + MVP-SHARE-URL fix. Merges to `main` only on explicit approval.

## License

Private. All rights reserved.
