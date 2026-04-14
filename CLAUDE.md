# CLAUDE.md

This file is the entry point for any new Claude Code session working on this project.
**Read it fully before making changes.**

---

## What this project is

**MyPlanny** (working name) — a daily planner for retail store managers. The current MVP is a React/TypeScript SPA that helps store managers plan their day in one screen: team assignments, breaks, tasks, daily focus, registers, evening shift, notes, plus daily/weekly KPIs. Includes PDF export, cloud-free sharing via URL-encoded payloads, German/English i18n, and tab-scoped session persistence.

The product is positioned as the future "operating system for retail store management" — see `docs/FUTURE_VISION.md` for the full strategy, ICP, GTM, and roadmap.

## Current state

- **MVP is shipped** to a Vercel-hosted preview URL and works end-to-end
- **8-step architecture migration is complete and committed** on the `tech-migration` branch
- **Phase 1 (cloud SaaS) plan is written** but not yet implemented — see `docs/plans/phase-1-saas.md`
- **Branch policy:** all migration work happens on `tech-migration`. `main` holds the previous client-side-only version. Merge `tech-migration` → `main` only when the user explicitly approves
- **Test suite:** 80 vitest tests + 9 Playwright tests, all passing

## Quick commands

```bash
# Install dependencies (the project uses pnpm, NOT npm)
pnpm install

# Dev server (runs on port 3000)
pnpm dev

# TypeScript check
pnpm lint
# (this is `tsc --noEmit` — there's no eslint configured)

# Unit + integration tests (Vitest)
pnpm test:run         # one-shot
pnpm test             # watch mode
pnpm test:ui          # vitest UI

# E2E tests (Playwright)
pnpm test:e2e
pnpm test:e2e:ui

# Production build
pnpm build
```

**Always run `pnpm lint && pnpm test:run` before declaring any change "done".** Run `pnpm test:e2e` for any change that touches user flows (sharing, persistence, language switching).

## Architecture at a glance

The codebase follows a **domain-organized layout** under `src/`:

```
src/
├── App.tsx                           # Top-level page composition (~210 lines)
├── App.test.tsx                      # Integration tests
├── main.tsx                          # Entry point: Sentry/PostHog init (later), AuthGate (later), URL hydration
├── index.css                         # Global styles + print CSS
│
├── i18n/                             # Cross-cutting: translations
│   ├── index.tsx                     # I18nProvider, useTranslation hook
│   ├── de.json, en.json
│   └── *.test.ts(x)
│
├── test/                             # Test setup
│   ├── setup.ts                      # afterEach cleanup
│   └── helpers.tsx                   # renderWithI18n wrapper
│
├── shared/                           # Cross-cutting primitives + page composition
│   ├── EditableInput.tsx             # The reusable inline-edit text input
│   ├── Header.tsx                    # Page header (composes from many domains)
│   ├── LanguageToggle.tsx            # DE/EN switcher
│   ├── ErrorBoundary.tsx             # React class-component error boundary
│   ├── types.ts                      # SectionItem, KpiData, TeamIcon
│   └── services/
│       ├── storage.ts                # StorageService interface + sessionStorage impl
│       ├── analytics.ts              # AnalyticsService singleton (no-op today, PostHog later)
│       └── *.test.ts
│
└── domains/                          # Business domains
    ├── plan/                         # Daily plan: sections, items, KPIs
    │   ├── Section.tsx
    │   ├── KpiCard.tsx
    │   ├── listOps.ts                # addItem, removeItem, updateItem
    │   ├── planStore.ts              # Zustand store with persist middleware
    │   ├── planSchema.ts             # Zod schemas for validation
    │   └── *.test.ts(x)
    │
    ├── store-location/               # Retail store selection (the BRICK-AND-MORTAR concept)
    │   └── StoreSelector.tsx
    │
    ├── sharing/                      # Sharing the plan
    │   ├── ShareMenu.tsx
    │   ├── FloatingActions.tsx
    │   ├── share.ts                  # buildShareUrl helper
    │   ├── encodeShareUrl.ts         # MVP-SHARE-URL: temporary URL-encoded share. DELETE in Phase 1.
    │   └── *.test.ts
    │
    └── team/                         # Team member visual identity
        └── teamIcons.ts              # 28 SVG/Lucide icons
```

**Key architectural rules — these were set during the 8-step migration and must be respected:**

1. **Components live at module scope.** Never define a component inside another component. The migration deleted that anti-pattern from `App.tsx` (it caused stale-DOM bugs in tests).

2. **State lives in Zustand**, not in `useState` hooks. The single source of truth for plan data is `src/domains/plan/planStore.ts`. To add a new field: update `PlanState`, `PersistedPlanState`, `getPersistableState`, the schema, and the initial state — all in that one file.

3. **Storage is abstracted via `StorageService`.** Never call `sessionStorage.getItem(...)` directly. The Zustand persist middleware uses `sessionStorageService` from `shared/services/storage.ts`. Phase 1 swaps this for a Supabase-backed implementation — see `docs/plans/phase-1-saas.md`.

4. **Analytics is a singleton.** Components call `analytics.track('event_name', { ... })` directly. The event names are a TypeScript union (`AnalyticsEvent`) — typos are compile errors. Adding a new event means extending the union in `shared/services/analytics.ts`.

5. **Validation happens at boundaries via Zod.** The `planSchema.ts` validates persisted data on hydration via the Zustand `merge` callback. Phase 1 will reuse the same schema to validate API responses. Components inside the app trust the data they receive.

6. **All variable names are English.** The German labels are in the i18n JSON files only. There must be no `pausen`, `kassen`, `abend`, `vj`, `ly`, `t1`, `t2` in source code — these were renamed to `breaks`, `registers`, `eveningShift`, `lastYearDay`, `lastYearMonth`, `monthlyTarget1`, `monthlyTarget2` in Step 7.

7. **Strict TypeScript is enabled.** `noUncheckedIndexedAccess`, `strict`, `noUnusedLocals`, `noUnusedParameters` are all on. Don't introduce `any` or `// @ts-ignore` — find the real type instead.

8. **The Header is the only component that can subscribe to multiple domains.** Other components stay within their own domain. If something needs to compose pieces from many domains, it goes in `shared/`.

## Current technical debt — `MVP-SHARE-URL` markers

The MVP needed a working share feature before Phase 1 cloud storage exists. We added a temporary client-side workaround that **encodes the entire plan state into the share URL** using `lz-string` compression. Every file involved is tagged with the literal string `MVP-SHARE-URL` so it can be grep'd and removed when Phase 1 lands.

```bash
# Find every file that needs cleanup:
grep -rn "MVP-SHARE-URL" src/
```

The cleanup checklist lives in `docs/FUTURE_VISION.md` under "Phase 1 → MVP Cleanup Tasks". When Phase 1 sub-phase 1.5 ships, every `MVP-SHARE-URL` reference must be deleted.

## Documentation locations

> **⚠️ The `docs/` folder is gitignored.**
> A fresh clone will not have the documents below. If you don't see them, ask the user — they live on the user's local machine. They are not yet checked into version control by deliberate choice.

```
docs/
├── FUTURE_VISION.md            # Full product strategy, ICP, GTM, business model, roadmap, MVP cleanup checklist
├── ARCHITECTURE_ANALYSIS.md    # Architectural decisions, principles, technology choices, original migration roadmap
├── TESTING.md                  # How to run/write tests, conventions, debugging
├── FEEDBACK.md                 # 7 rounds of investor feedback (synthesized into FUTURE_VISION)
└── plans/
    ├── step-01-test-infrastructure.md      # ✅ Done
    ├── step-02-strict-typescript.md        # ✅ Done
    ├── step-03-extract-components.md       # ✅ Done
    ├── step-04-zustand.md                  # ✅ Done
    ├── step-05-domain-folders.md           # ✅ Done
    ├── step-06-service-abstractions.md     # ✅ Done
    ├── step-07-rename-german-variables.md  # ✅ Done
    ├── step-08-zod-error-boundary.md       # ✅ Done
    └── phase-1-saas.md                     # 📋 Next — not yet implemented
```

**Read order for a new session resuming work:**
1. This file (CLAUDE.md)
2. `docs/FUTURE_VISION.md` — business context
3. `docs/ARCHITECTURE_ANALYSIS.md` — why the codebase looks the way it does
4. `docs/plans/phase-1-saas.md` — what comes next
5. The git log on `tech-migration` — what's already done

## How to work with this user

A few preferences the user has explicitly stated during the migration:

1. **Don't auto-commit and push.** The user manages commits themselves. Stage changes in the working tree and report what's ready, but don't run `git commit` or `git push` unless explicitly asked.

2. **Use Option B planning approach:** before executing a multi-step task, write a detailed implementation plan to `docs/plans/<step-name>.md` and get user approval before executing. Plans should follow the format of the existing 8 step plans: goal, scope, file-by-file changes, execution order, commit plan, risks, definition of done.

3. **Respect the architectural principles** listed above. They were established by deliberate choice during Steps 1-8.

4. **Tests come first.** Step 1 of the migration was building the test suite specifically so that future refactors are protected. Don't change behavior without first understanding the tests that cover it.

5. **The user uses pnpm**, not npm. The `package.json` `packageManager` field enforces this.

6. **Commits should be atomic.** One logical change per commit. Reference the migration commits (`git log --oneline`) for the style.

7. **The user prefers small focused tasks** over big batch changes. When in doubt, do less and ask for confirmation.

8. **Don't be sycophantic.** The user values direct, honest feedback over flattery. If a proposed approach is wrong, say so.

## What's coming next

The user has approved the Phase 1 plan in `docs/plans/phase-1-saas.md`. The next session may be asked to:
- Set up Supabase locally
- Implement Sub-phase 1.1 (Foundation)
- Or any specific sub-phase the user picks

Phase 1 is broken into 6 sub-phases — each is a stoppable milestone. Don't try to do all 6 in one session.

## Tech stack reference

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| UI framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 (with `persist` middleware) |
| Validation | Zod 4 |
| Animation | Framer Motion (`motion/react`) |
| Icons | Lucide React + custom SVGs |
| Tests | Vitest 3 + Testing Library + Playwright 1.59 |
| i18n | Custom (no library) |
| Sharing (temporary) | lz-string for URL compression |
| Hosting (current MVP) | Vercel free tier |
| Hosting (Phase 1 plan) | Cloudflare Pages + Supabase |

---

*Last updated: April 2026 — after the 8-step architecture migration completed and the Phase 1 plan was drafted.*
