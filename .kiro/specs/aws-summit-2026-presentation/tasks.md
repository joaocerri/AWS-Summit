# Implementation Plan: AWS Summit São Paulo 2026 Presentation

## Overview

This plan converts the design into incremental, test-driven coding tasks for a React + Vite + TypeScript single-page presentation of exactly 34 full-viewport screens sourced entirely from `aws.md`. Work proceeds from scaffolding and design tokens, to the Content_Store single-source-of-truth data model and 34-screen registry, to the pure navigation reducer and controller, to reusable components, the SVG diagram system, the animation system, and the DetailPanel modal. It then implements all 34 section modules mapped to their `aws.md` sources, wires the App shell, and closes with accessibility, performance, property-based tests for the 19 correctness properties, and a final build/verify pass.

Each task builds on prior tasks and ends with integration so no code is left orphaned. Test sub-tasks are marked optional with `*`; property tests are tagged `// Feature: aws-summit-2026-presentation, Property N: ...` and run with `fast-check` at `{ numRuns: 100 }` minimum.

## Tasks

- [ ] 1. Scaffold the React + Vite + TypeScript project
  - Create `package.json` declaring only runtime deps `react`, `react-dom`, `framer-motion` (animation), and dev deps `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `fast-check`, `@testing-library/react`, `jsdom`
  - Add `vite.config.ts` (React plugin + Vitest `test` config with `jsdom` environment and `globals`) and `tsconfig.json`
  - Add `index.html` mounting `#root` and loading `src/main.tsx`; add `src/main.tsx` rendering a placeholder `App`
  - Add `vercel.json` with SPA rewrite; add npm scripts `dev`, `build`, `preview`, `test`
  - _Requirements: 12.1, 12.2, 12.3, 12.5, 13.2_

  - [ ]* 1.1 Write dependency-allowlist test
    - Assert every declared runtime dependency in `package.json` maps to React, Vite, styling, or animation
    - _Requirements: 12.5, 13.2_

- [ ] 2. Create the styles and design tokens module
  - [ ] 2.1 Implement `src/styles/tokens.css` with the exact palette CSS custom properties and fluid typography scale
    - Declare `--bg #07111f`, `--bg-secondary #0c1828`, `--surface #111f31`, `--surface-light #17283b`, `--text #f5f7fa`, `--text-secondary #aeb9c8`, `--accent #ff9900`, `--accent-secondary #ffb84d`, `--border rgba(255,255,255,.10)`
    - Declare type-scale tokens using `clamp()`: H1 56–80px, H2 40–56px, H3 24–32px, Body 18–22px (min 14px below 1280px), Caption 13–16px
    - _Requirements: 9.1, 9.3, 8.4, 8.5_

  - [ ] 2.2 Implement `src/styles/globals.css` (reset + base) and palette utilities `src/styles/palette.ts`
    - CSS reset, sans-serif system font stack, body ≥16px, default dark theme applied from tokens
    - `nearestPalette(color)` utility returning nearest defined palette member; `contrastRatio(fg, bg)` helper
    - _Requirements: 9.4, 9.5, 9.2_

  - [ ]* 2.3 Write property test for palette conformance
    - **Property 16: All colors conform to the defined palette**
    - **Validates: Requirements 9.1, 9.3, 9.5**

  - [ ]* 2.4 Write property test for contrast thresholds
    - **Property 17: Palette text/background pairings meet contrast thresholds**
    - **Validates: Requirements 9.4, 10.7**

  - [ ]* 2.5 Write property test for typographic ordering and minimums
    - **Property 15: Typographic ordering and minimums hold at every width**
    - **Validates: Requirements 8.4, 8.5**

- [ ] 3. Define the Content_Store data model types
  - Create `src/data/types.ts` with `DiagramType`, `DiagramNode`, `DiagramEdge`, `DiagramModel` (incl. `fallbackText`), `MetricModel`, `DetailContent`, `ScreenContent`, `ScreenDefinition`, `ContentStore`
  - Add a content resolver `resolveContent(key)` returning `{ status: 'ok', value } | { status: 'unavailable' }` and a `getDetail(detailKey)` selector
  - _Requirements: 1.4, 1.6, 5.2, 5.3, 11.4_

  - [ ]* 3.1 Write property test for missing-content reporting
    - **Property 8: Missing content is reported, never substituted**
    - **Validates: Requirements 1.6, 5.3**

- [ ] 4. Transcribe aws.md into the Content_Store and build the 34-screen registry
  - [ ] 4.1 Transcribe screen content and details from `aws.md` into `src/data/awsSummitContent.ts`
    - Populate `ScreenContent` (Portuguese, verbatim/faithful summaries) and `details` entries for every summarized screen; each summarized screen carries a `detailKey` to its full passage
    - Include Hero exact strings: "AWS Summit São Paulo 2026", "03 de setembro de 2026", "São Paulo Expo — São Paulo, SP"
    - Include C6 Bank `MetricModel[]` exactly: "até 88%"; "3 meses"→"8 dias"; "2 meses"→"8 dias"; "10 sprints"→"1 sprint"; "8 sprints"→"1 sprint"
    - Introduce no content absent from `aws.md`; leave transition screens (01, 08, 21, 34) without invented content and without a `detailKey`
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.3, 2.4, 2.5_

  - [ ] 4.2 Build the ordered 34-screen registry and sections in `src/data/screenRegistry.ts`
    - Define 34 `ScreenDefinition`s in the exact fixed order and titles from Requirement 2.1, with `index` 0–33 and `sectionId` grouping for the Section_Menu; export `sections` with `firstScreenIndex`
    - _Requirements: 2.1, 4.7_

  - [ ] 4.3 Build diagram datasets in `src/data/diagrams.ts`
    - Define `DiagramModel` node/edge sets (with non-empty `fallbackText`) for the flows, timelines, and architectures documented in `aws.md`, referenced by the relevant screens
    - _Requirements: 6.2, 6.6_

  - [ ]* 4.4 Write property test for registry invariant
    - **Property 6: Screen registry has 34 uniquely ordered screens**
    - **Validates: Requirements 2.1**

  - [ ]* 4.5 Write property test for store integrity and single source
    - **Property 7: Content_Store is the single source and every reference resolves**
    - **Validates: Requirements 1.4, 5.2**

  - [ ]* 4.6 Write unit tests for Hero strings and C6 Bank metrics
    - Assert Hero name/date/location exact strings and the five C6 metric values are present and exact
    - _Requirements: 2.5, 1.3_

- [ ] 5. Implement the navigation reducer and controller
  - [ ] 5.1 Implement the pure navigation reducer in `src/hooks/navigationReducer.ts`
    - Handle `NEXT`, `PREV`, `FIRST`, `LAST`, `GOTO` with clamping to `[0, total-1]`; `total = 34`
    - _Requirements: 3.7, 3.8, 4.2, 4.4_

  - [ ] 5.2 Implement `useNavigationController` hook in `src/hooks/useNavigationController.ts`
    - Expose `currentIndex`, `total`, `progressLabel` (`"${currentIndex+1} / ${total}"`), `next`, `prev`, `goToFirst`, `goToLast`, `goToScreen`, `goToSection`
    - _Requirements: 4.1, 4.3, 4.5, 4.8, 3.5, 3.6_

  - [ ]* 5.3 Write property test for index clamping
    - **Property 1: Navigation index stays within bounds (clamping)**
    - **Validates: Requirements 3.7, 3.8, 4.2, 4.4**

  - [ ]* 5.4 Write property test for next/prev inverse
    - **Property 2: Next and previous are inverse within interior bounds**
    - **Validates: Requirements 3.1, 3.2, 4.1, 4.3**

  - [ ]* 5.5 Write property test for progress label
    - **Property 4: Progress label reflects the current index**
    - **Validates: Requirements 4.5, 4.6**

  - [ ]* 5.6 Write property test for section jump
    - **Property 5: Section jump lands on the section's first screen**
    - **Validates: Requirements 4.7, 4.8**

- [ ] 6. Implement scroll and keyboard navigation input handling
  - [ ] 6.1 Implement scroll accumulator logic in `src/hooks/useScrollNavigation.ts`
    - Accumulate wheel delta; emit exactly one `NEXT`/`PREV` per 50px crossing, reset accumulator, apply ~500ms lock; drive `scrollIntoView` transition
    - _Requirements: 3.1, 3.2_

  - [ ] 6.2 Implement keyboard handling in `src/hooks/useKeyboardNavigation.ts`
    - Map `ArrowRight→next`, `ArrowLeft→prev`, `Home→goToFirst`, `End→goToLast`; disable while a Detail_Panel is open
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

  - [ ]* 6.3 Write property test for scroll accumulator
    - **Property 3: Scroll accumulator steps exactly once per 50px crossing**
    - **Validates: Requirements 3.1, 3.2**

  - [ ]* 6.4 Write unit tests for key-to-action mapping
    - Test ArrowRight/ArrowLeft/Home/End dispatch correct actions
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [ ] 7. Checkpoint - core data and navigation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement the animation system
  - [ ] 8.1 Implement `src/animations/variants.ts` and `src/hooks/useReducedMotion.ts`
    - Define `fadeIn`, `slideUp/Left/Right`, `scaleIn`, `blurIn`, `parallax`, `lineDraw` (`pathLength` 0→1), `staggerContainer`, and a `useCounter` hook; durations bounded 200–800ms
    - Reduced-motion resolution returns final visible values with duration 0; add `onAnimationComplete`/timeout fallback forcing final state past 800ms
    - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ] 8.2 Implement `src/hooks/useActiveScreen.ts` (IntersectionObserver entrance)
    - Trigger entrance animations at ≥20% visibility within 100ms; report active screen for controller sync
    - _Requirements: 7.1_

  - [ ]* 8.3 Write property test for reduced motion
    - **Property 13: Reduced motion yields the final visible state with zero duration**
    - **Validates: Requirements 7.4, 7.5**

  - [ ]* 8.4 Write property test for animation duration bounds
    - **Property 14: Animation durations are bounded to 200–800ms**
    - **Validates: Requirements 7.2, 7.6**

- [ ] 9. Implement reusable core components
  - [ ] 9.1 Implement `Screen` component in `src/components/Screen/`
    - Full-viewport wrapper (min-height 100vh), `scroll-snap-align: start`, semantic `<section>`, `ariaLabel`, deferred children rendering hook-in point
    - _Requirements: 2.2, 10.1, 13.3_

  - [ ] 9.2 Implement `ProgressBar` in `src/components/ProgressBar/`
    - Render `"N / total"` from controller; update on index change
    - _Requirements: 4.5, 4.6_

  - [ ] 9.3 Implement `Navigation` (Próximo/Anterior + SectionMenu) in `src/components/Navigation/`
    - Buttons dispatch next/prev (no-ops at boundaries); SectionMenu renders one link per section calling `goToSection`; keyboard-operable with aria-labels
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.7, 4.8, 10.3, 10.5_

  - [ ] 9.4 Implement `SectionTitle`, `InfoCard`, `MetricCard` in `src/components/`
    - `SectionTitle` (eyebrow/title/subtitle), `InfoCard` (title/body/items/detailKey), `MetricCard` (animated counter via `useCounter`); all text sourced via props from Content_Store
    - _Requirements: 11.2, 11.4_

  - [ ] 9.5 Implement inline SVG `icons` in `src/components/icons/`
    - Content-agnostic SVG icons; informative icons get `role="img"`+`<title>`, decorative get `aria-hidden`; no raster references
    - _Requirements: 6.1, 10.6, 13.1_

- [ ] 10. Implement the SVG diagram system
  - [ ] 10.1 Implement `Diagram` dispatcher + responsive direction hook in `src/components/diagram/Diagram.tsx`
    - Dispatch to Flow/Timeline/Architecture; `matchMedia` hook sets direction: ≥1024px horizontal, <768px vertical, 768–1023px adaptive; wrap in error boundary rendering `fallbackText`
    - _Requirements: 6.1, 6.4, 6.5, 6.6_

  - [ ] 10.2 Implement `FlowDiagram`, `Timeline`, `ArchitectureDiagram` in `src/components/diagram/`
    - Pure SVG/CSS/HTML; one visual node per model node, one connector per edge; diagram text token ≥12px at all widths; progressive-build animation via `pathLength`/staggered opacity
    - _Requirements: 6.1, 6.2, 6.3, 7.3_

  - [ ]* 10.3 Write property test for layout direction
    - **Property 11: Diagram layout direction follows viewport width**
    - **Validates: Requirements 6.4, 6.5**

  - [ ]* 10.4 Write property test for diagram completeness and fallback
    - **Property 12: Every diagram relationship has a visual element and a non-empty fallback**
    - **Validates: Requirements 6.2, 6.6**

  - [ ]* 10.5 Write unit tests for SVG-only and text size
    - Assert no `<img>`/external `url(...)`; diagram text ≥12px at 320/768/1024/1920
    - _Requirements: 6.1, 6.3, 13.1_

- [ ] 11. Implement the accessible DetailPanel modal
  - [ ] 11.1 Implement `DetailPanel` in `src/components/DetailPanel/`
    - `role="dialog"`, `aria-modal`, accessible name; trigger label exactly `"Ver detalhes"` or `"Explorar conceito"`; populate from `details[detailKey]` within 1s; if unresolved keep summarized state and show "conteúdo indisponível"
    - Move focus to panel on open, restore to trigger on close (Escape/close button), never trap focus; restore summarized state on close within 1s
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 10.4_

  - [ ]* 11.2 Write property test for detail trigger label
    - **Property 9: Detail trigger label is one of the two exact labels**
    - **Validates: Requirements 5.1**

  - [ ]* 11.3 Write property test for detail open/close round-trip
    - **Property 10: Opening then closing a detail panel restores the summarized state**
    - **Validates: Requirements 5.4**

  - [ ]* 11.4 Write unit tests for focus restore and no-trap
    - Assert focus moves to panel on open, returns to trigger on close, is not trapped; keyboard operable
    - _Requirements: 10.3, 10.4_

- [ ] 12. Checkpoint - components and systems
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement the 34 section modules (part 1: screens 01–17)
  - [ ] 13.1 Implement transition/framing screens `S01_Hero`, `S08_Keynote`
    - Compose Screen + SectionTitle using Content_Store keys; no Detail_Panel; Hero renders exact event name/date/location
    - _Requirements: 2.1, 2.5, 11.3, 11.4_

  - [ ] 13.2 Implement content screens `S02`–`S07`
    - `S02` O evento em uma visão, `S03` Mapa geral (flow), `S04` Da demo ao deploy (flow), `S05` RAG (flow), `S06` LLM+código determinístico (flow), `S07` Segurança dos agentes (flow/architecture); each with DetailPanel
    - _Requirements: 2.1, 2.3, 5.1, 6.2, 11.3, 11.4_

  - [ ] 13.3 Implement content screens `S09`–`S17`
    - `S09` Código como commodity, `S10` Kiro (flow), `S11` Harness (architecture), `S12` C6 Bank (metrics+flow), `S13` Segurança no desenvolvimento (flow), `S14` Web Search on AgentCore (flow), `S15` Multi-Agent (architecture/flow), `S16` Spec-Driven Development (flow), `S17` MCP (flow); each with DetailPanel
    - _Requirements: 2.1, 2.3, 5.1, 6.2, 11.3, 11.4_

- [ ] 14. Implement the 34 section modules (part 2: screens 18–34)
  - [ ] 14.1 Implement content screens `S18`–`S22`
    - `S18` AI-DLC (timeline), `S19` Human in the Loop (flow), `S20` Brownfield Development (flow), `S21` Snowflake transição (no panel), `S22` Governança de dados (flow); DetailPanels where summarized
    - _Requirements: 2.1, 2.3, 5.1, 6.2, 11.3, 11.4_

  - [ ] 14.2 Implement content screens `S23`–`S29`
    - `S23` Snowflake Cortex AI (flow), `S24` Semantic Views (flow), `S25` Cortex Analyst (flow), `S26` Cortex Search + RAG (flow), `S27` Cortex Agents (architecture), `S28` Snowflake Intelligence (flow), `S29` Arquitetura completa (architecture); each with DetailPanel
    - _Requirements: 2.1, 2.3, 5.1, 6.2, 11.3, 11.4_

  - [ ] 14.3 Implement content/closing screens `S30`–`S34`
    - `S30` Principais aprendizados (flow/cards), `S31` Evolução da IA (timeline), `S32` A arquitetura do futuro (architecture), `S33` Conclusão, `S34` Encerramento (no panel); DetailPanels where summarized
    - _Requirements: 2.1, 2.3, 5.1, 6.2, 11.3, 11.4_

- [ ] 15. Wire the App shell and integrate all subsystems
  - [ ] 15.1 Implement `src/App.tsx` app shell
    - Mount `useNavigationController`, scroll + keyboard hooks, and IntersectionObserver; render all 34 section modules in order inside a scroll-snap container; render `Navigation` + `ProgressBar` + `SectionMenu`; use semantic `<main>`/`<nav>` landmarks
    - _Requirements: 2.1, 4.5, 4.7, 10.1, 11.1_

  - [ ]* 15.2 Write integration/smoke tests for shell wiring
    - Assert 34 screens render in order, progress updates on navigation, section menu jumps to first screen of section, no horizontal overflow at 320/768/1024/1280
    - _Requirements: 2.1, 4.6, 4.8, 8.1, 8.2_

- [ ] 16. Accessibility pass
  - Apply sequential heading levels (h1→h3, no skips), semantic landmarks; visible focus outline ≥2px and ≥3:1 contrast on all interactive controls; ensure all controls keyboard-operable and non-empty accessible names for icon-only controls; mark decorative SVGs `aria-hidden`
  - _Requirements: 10.1, 10.2, 10.3, 10.5, 10.6, 10.7_

  - [ ]* 16.1 Write property test for non-text alternatives
    - **Property 18: Non-text elements have a text alternative or are marked decorative**
    - **Validates: Requirements 10.5, 10.6**

  - [ ]* 16.2 Write unit tests for semantic structure and focus indicator
    - Assert sequential heading levels, semantic landmarks, focus outline ≥2px/≥3:1
    - _Requirements: 10.1, 10.2_

- [ ] 17. Performance pass
  - [ ] 17.1 Apply memoization and deferred off-screen rendering
    - `React.memo` on Screen/Diagram/Card components keyed by content identity; defer heavy Screen content until within one viewport height via IntersectionObserver `rootMargin: '100% 0px'`; animate only transform/opacity/`pathLength`
    - _Requirements: 13.3, 13.4, 13.5_

  - [ ]* 17.2 Write property test for no stray re-renders
    - **Property 19: Unchanged content does not cause re-renders**
    - **Validates: Requirements 13.5**

  - [ ]* 17.3 Write unit tests for off-screen deferral and accent-area audit
    - Assert off-screen content deferred within 1 viewport height; sample accent-colored area ≤10% on representative screens
    - _Requirements: 13.3, 9.2_

- [ ] 18. Final build/verify checkpoint
  - Run `npm run test -- --run` and `npm run build`; ensure the production build succeeds with no errors and all tests pass; confirm dependency allowlist and SVG-only/no raster >100KB hold; ask the user if questions arise
  - _Requirements: 12.1, 12.3, 12.4, 12.5, 13.1, 13.2_

- [ ] 19. Add GitLab Pages CI/CD deployment
  - [ ] 19.1 Create `.gitlab-ci.yml` for GitLab Pages deployment
    - Create `.gitlab-ci.yml` at the project root defining a `pages` job (the reserved job name GitLab Pages requires) that runs only on the default branch (guard with `rules: - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'`)
    - Use an official Node image (e.g. `image: node:20`), install deps with `npm ci`, and run `npm run build` so the same Vite/React build that must succeed locally runs in CI (a failed build fails the pipeline, surfacing errors)
    - GitLab Pages serves from a `public/` directory: emit the Vite build into `public` — either set Vite `build.outDir` to `public` (configurable via env, e.g. `VITE_OUT_DIR`) or `mv dist public` in the job script — and declare `artifacts: { paths: [public] }`
    - Keep the Vite `base` path configurable (env-driven, e.g. `VITE_BASE`): document that project Pages sites are served under `/<project-name>/` so `base` must be `/<project-name>/` for assets and routing to resolve, while a user/group root Pages site uses `/`; default that keeps local `dev`/`preview` working and note the override for CI
    - Do not add new runtime dependencies; keep consistent with the existing React + Vite build and dependency allowlist
    - _Requirements: 12.3, 12.1, 12.4_

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; core implementation tasks are never optional.
- Property tests use `fast-check` at `{ numRuns: 100 }` minimum and are tagged `// Feature: aws-summit-2026-presentation, Property N: {text}`.
- Each task references specific requirements for traceability; checkpoints ensure incremental validation.
- The Content_Store is the single source of truth; no presentational component contains hardcoded display text (Req 11.4). All content traces to `aws.md` (Req 1.1).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "8.1", "8.2"] },
    { "id": 2, "tasks": ["2.3", "2.4", "2.5", "5.1", "8.3", "8.4"] },
    { "id": 3, "tasks": ["3.1", "5.2", "6.1", "6.2"] },
    { "id": 4, "tasks": ["4.1", "5.3", "5.4", "5.5", "6.3", "6.4", "9.1", "9.2", "9.5"] },
    { "id": 5, "tasks": ["4.2", "4.3", "9.3", "9.4", "10.1"] },
    { "id": 6, "tasks": ["4.4", "4.5", "4.6", "5.6", "10.2", "11.1"] },
    { "id": 7, "tasks": ["10.3", "10.4", "10.5", "11.2", "11.3", "11.4"] },
    { "id": 8, "tasks": ["13.1", "13.2", "13.3", "14.1", "14.2", "14.3"] },
    { "id": 9, "tasks": ["15.1"] },
    { "id": 10, "tasks": ["15.2", "16.1", "16.2", "17.1"] },
    { "id": 11, "tasks": ["17.2", "17.3"] },
    { "id": 12, "tasks": ["19.1"] }
  ]
}
```
