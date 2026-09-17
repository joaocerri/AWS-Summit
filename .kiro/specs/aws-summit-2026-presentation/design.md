# Design Document

## Overview

The Presentation_App is a single-page React + Vite application that renders the content of `aws.md` as an interactive, premium narrative of exactly 34 full-viewport screens about **AWS Summit São Paulo 2026**. It is navigable by scroll, keyboard, on-screen buttons, and a section menu, with a progress indicator, expandable detail panels, SVG-only diagrams, and subtle animations that respect `prefers-reduced-motion`. It is built for local development and Vercel deployment.

The core architectural principle is a strict **single-source-of-truth content model**: every displayed string originates from a centralized `Content_Store` (`src/data/awsSummitContent`) whose values are transcribed or summarized from `aws.md` and nothing else. Presentational components never hardcode display text. This directly enforces Requirement 1 (content fidelity) and Requirement 11.4 (no hardcoded content).

**Design decisions and rationale:**

- **React 18 + Vite** — mandated by Requirement 12.1/12.2. Vite provides a fast dev server and a production build that deploys cleanly to Vercel (Req 12.3).
- **Plain modern CSS with CSS custom properties + CSS Modules** for styling rather than Tailwind. Rationale: Requirement 9 fixes an exact palette and a precise typographic scale, and Requirement 12.5/13.2 restrict dependencies to "React, Vite, styling, or animation". CSS variables express the palette once and guarantee palette conformance (Req 9.3/9.5) with zero runtime dependency cost. CSS Modules give per-component scoping and satisfy the "styles as a separate module" concern (Req 11.1). Tailwind would add tooling and make the exact palette/typography constraints harder to audit.
- **Framer Motion** for the Animation_System. Rationale: Requirement 7 requires fade, slide, scale, blur, parallax, connecting-line, sequential-reveal (stagger), animated-counter, and progressive-diagram effects, plus `prefers-reduced-motion` handling and completion guarantees. Framer Motion provides declarative variants, stagger orchestration, `useReducedMotion`, and SVG `pathLength` animation for line-drawing, covering all nine effect types with one animation dependency. It maps to the permitted "animation" purpose in Req 12.5/13.2.
- **Inline SVG components** for every diagram and icon (Req 6.1, 13.1). No raster or external image files are referenced anywhere.
- **TypeScript** for the Content_Store and component contracts. It is a dev-time tool (not a runtime dependency), so it does not violate Req 12.5, and it lets us encode content-model invariants (e.g., the 34-screen registry) as types.

### Requirements coverage map (high level)

| Requirement | Primary design element |
|---|---|
| 1 Content fidelity | Content_Store single-source model, Detail_Panel mapping |
| 2 Narrative sequence | `screenRegistry` (34 ordered entries), Screen component |
| 3 Scroll/keyboard nav | `useNavigationController` hook |
| 4 Controls & progress | Navigation component, ProgressBar, SectionMenu |
| 5 Detail panels | DetailPanel component + content links |
| 6 SVG diagrams | Diagram primitive (Flow/Timeline/Architecture) |
| 7 Animations | Animation_System (Framer Motion variants + IntersectionObserver) |
| 8 Responsive layout | CSS breakpoints + fluid typography tokens |
| 9 Visual design | CSS variables palette + type scale tokens |
| 10 Accessibility | Semantic HTML, focus styles, aria strategy |
| 11 Architecture | Module separation, reusable components, section modules |
| 12 Build/run/deploy | Vite config, minimal dependency set |
| 13 Performance | SVG/CSS rendering, deferred off-screen render, memoization |

## Architecture

### System context

```text
                         ┌─────────────────────────────┐
                         │        aws.md (source)       │
                         │   Single Source of Truth     │
                         └───────────────┬─────────────┘
                                         │  (transcribed at build/author time)
                                         ▼
                         ┌─────────────────────────────┐
                         │   Content_Store (src/data)   │
                         │  screens · sections · nodes  │
                         │  edges · metrics · details   │
                         └───────────────┬─────────────┘
                                         │  (read-only selectors)
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                 ▼
┌───────────────┐              ┌───────────────────┐             ┌──────────────────┐
│  Section      │              │  Navigation +     │             │  Diagram +       │
│  modules      │  compose →   │  Progress +       │   render →  │  Animation       │
│  (34 screens) │              │  SectionMenu      │             │  primitives      │
└───────┬───────┘              └─────────┬─────────┘             └────────┬─────────┘
        │                                │                                │
        └────────────────┬───────────────┴────────────────┬──────────────┘
                         ▼                                 ▼
                 ┌───────────────┐               ┌──────────────────┐
                 │  App shell    │               │  DetailPanel      │
                 │  (layout)     │               │  (modal overlay)  │
                 └───────────────┘               └──────────────────┘
```

### Runtime data flow

1. `App` mounts, reads `screenRegistry` from the Content_Store, and instantiates `useNavigationController`.
2. The controller owns `currentIndex` (0–33) and exposes `next`, `prev`, `goTo`, and derived `progressLabel` (`"N / 34"`).
3. Each Screen is a section module that pulls its content by key from the Content_Store; it never contains literal display text.
4. An `IntersectionObserver` reports which screen is active and triggers entrance animations at ≥20% visibility.
5. Off-screen screens defer rendering their heavy content until within one viewport height (Req 13.3).
6. Detail panels open as an accessible overlay populated from `detailContent` keyed to the activating screen.

### Layered responsibilities (Req 11.1 — five separate concerns)

| Concern | Location | Responsibility |
|---|---|---|
| Content | `src/data/` | Authoritative text, diagram data, metrics, details |
| Components | `src/components/` | Reusable, content-agnostic UI primitives |
| Layout/Sections | `src/sections/` + `src/App.tsx` | Per-section composition + app shell |
| Styles | `src/styles/` + `*.module.css` | Palette, typography, responsive rules |
| Animations | `src/animations/` | Variants, motion config, reduced-motion logic |

No concern's code is duplicated into another module (Req 11.1).

## Project Structure

```text
aws-summit-2026-presentation/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vercel.json                     # SPA rewrite (optional; Vite default works)
└── src/
    ├── main.tsx                    # React root
    ├── App.tsx                     # app shell: mounts controller, renders screens + nav
    ├── data/
    │   ├── awsSummitContent.ts     # Content_Store: screens, sections, details, metrics
    │   ├── diagrams.ts             # diagram node/edge datasets (from aws.md ASCII flows)
    │   └── screenRegistry.ts       # the 34 ordered screen definitions
    ├── components/
    │   ├── Screen/                 # full-viewport wrapper (>=100vh)
    │   ├── Navigation/             # Próximo/Anterior + SectionMenu
    │   ├── ProgressBar/            # "N / 34" indicator
    │   ├── SectionTitle/
    │   ├── InfoCard/
    │   ├── MetricCard/
    │   ├── DetailPanel/            # accessible modal/expandable
    │   ├── diagram/
    │   │   ├── Diagram.tsx         # primitive dispatcher
    │   │   ├── FlowDiagram.tsx
    │   │   ├── Timeline.tsx
    │   │   └── ArchitectureDiagram.tsx
    │   └── icons/                  # inline SVG icon components (no raster)
    ├── sections/
    │   ├── S01_Hero.tsx ... S34_Encerramento.tsx   # one module per section
    ├── hooks/
    │   ├── useNavigationController.ts
    │   ├── useActiveScreen.ts      # IntersectionObserver
    │   └── useReducedMotion.ts     # re-export/wrap Framer Motion
    ├── animations/
    │   └── variants.ts             # fade/slide/scale/blur/stagger/line/counter
    └── styles/
        ├── globals.css             # CSS reset + palette variables + type scale
        └── tokens.css              # palette + typography custom properties
```

This layout satisfies Req 11.1 (five separate concerns), 11.2 (each reusable component defined once), and 11.3 (one module per section).

## Components and Interfaces

### Reusable components (Req 11.2 — each defined once, referenced from ≥2 locations)

| Component | Props (interface sketch) | Referenced by |
|---|---|---|
| `Screen` | `{ id, index, children, ariaLabel }` | every section module |
| `Navigation` | `{ current, total, onNext, onPrev, sections, onJump }` | App shell + mobile menu |
| `ProgressBar` | `{ current, total }` → renders `"N / total"` | App shell + Navigation |
| `SectionTitle` | `{ eyebrow?, title, subtitle? }` | most sections |
| `InfoCard` | `{ title, body, items?, detailKey? }` | most sections |
| `MetricCard` | `{ label, from?, to?, value }` (animated counter) | C6 Bank + Learnings |
| `FlowDiagram` | `{ nodes, direction }` | AgentCore, Kiro, AI-DLC, etc. |
| `Timeline` | `{ steps, orientation }` | AI-DLC, Evolution |
| `ArchitectureDiagram` | `{ center, groups }` | Harness, Snowflake, final architecture |
| `DetailPanel` | `{ open, title, content, onClose }` | any summarized screen |

### Navigation architecture

`useNavigationController` is the single source of navigation state.

```ts
interface NavigationState { currentIndex: number; total: number; }

interface NavigationController {
  currentIndex: number;              // clamped to [0, total-1]
  total: number;                     // 34
  progressLabel: string;             // `${currentIndex + 1} / ${total}`
  next(): void;                      // no-op at last screen (Req 3.8, 4.2)
  prev(): void;                      // no-op at first screen (Req 3.7, 4.4)
  goToFirst(): void;                 // Home key (Req 3.5)
  goToLast(): void;                  // End key (Req 3.6)
  goToScreen(index: number): void;   // section menu / clamp
  goToSection(sectionId: string): void;
}
```

Reducer semantics (pure, testable):

```ts
function reduce(state, action) {
  switch (action.type) {
    case 'NEXT':  return { ...state, currentIndex: Math.min(state.currentIndex + 1, state.total - 1) };
    case 'PREV':  return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };
    case 'FIRST': return { ...state, currentIndex: 0 };
    case 'LAST':  return { ...state, currentIndex: state.total - 1 };
    case 'GOTO':  return { ...state, currentIndex: clamp(action.index, 0, state.total - 1) };
  }
}
```

- **Scroll:** a wheel/scroll handler accumulates delta; once |accumulated| ≥ 50px it fires `NEXT` (down) or `PREV` (up), then resets the accumulator and applies a short lock (~500ms) so one gesture advances exactly one screen (Req 3.1, 3.2). Programmatic `scrollIntoView({ behavior })` performs the visual transition and completes within 500ms.
- **Keyboard:** a `keydown` listener maps `ArrowRight→NEXT`, `ArrowLeft→PREV`, `Home→FIRST`, `End→LAST` (Req 3.3–3.6). Listener is disabled while a Detail_Panel is open to avoid conflicts (Req 5), and focus is restored on close (Req 10.4).
- **Buttons:** `Próximo`/`Anterior` dispatch `NEXT`/`PREV` (Req 4.1, 4.3) and are no-ops at boundaries (Req 4.2, 4.4).
- **Progress:** `ProgressBar` renders `progressLabel` and updates on index change within 500ms (Req 4.5, 4.6).
- **Section menu:** built from the distinct `sectionId` values in `screenRegistry`; each link calls `goToSection`, jumping to that section's first screen (Req 4.7, 4.8).
- **Snapping:** CSS `scroll-snap-type: y mandatory` on the scroll container with `scroll-snap-align: start` per Screen keeps screens aligned; the controller and native snap stay in sync via the IntersectionObserver.

### Diagram system

A single `Diagram` primitive dispatches to three layouts, all pure SVG/CSS/HTML (Req 6.1):

- **FlowDiagram** — sequential nodes joined by arrows; vertical stack by default (matches the `↓` flows in `aws.md`).
- **Timeline** — ordered steps along an axis (used for AI-DLC Inception→Construction→Operations and the IA-evolution chain).
- **ArchitectureDiagram** — a central node with surrounding node groups and connectors (Harness, Snowflake overview, final architecture).

Responsive layout rule (Req 6.4, 6.5): the primitive reads viewport width via a `matchMedia` hook and sets `direction`:
- width ≥ 1024px → nodes laid out along the horizontal axis;
- width < 768px → nodes laid out along the vertical axis;
- 768–1023px → adaptive (wraps).

All diagram text uses a token guaranteeing computed font-size ≥ 12px at every width from 320–1920px (Req 6.3). Each diagram wraps its SVG in an error boundary; on render failure it shows a visible text fallback listing the nodes/relationships instead of an empty area (Req 6.6). Progressive-build animation draws nodes/connectors sequentially via Framer Motion `pathLength` and staggered opacity (Req 7.3).

### Animation system

`src/animations/variants.ts` defines reusable variants: `fadeIn`, `slideUp/Left/Right`, `scaleIn`, `blurIn`, `parallax`, `lineDraw` (SVG `pathLength` 0→1), `staggerContainer` (sequential reveal), and a `useCounter` hook for animated counters (Req 7.3).

- Entrance triggers when a screen reaches ≥20% visibility via IntersectionObserver (`threshold: 0.2`), applied within 100ms (Req 7.1).
- Each element animation duration is constrained to 200–800ms (Req 7.2).
- `useReducedMotion()` (Framer Motion) gates all motion: when active, variants resolve to their final visible state with `transition: { duration: 0 }`, keeping all content visible and readable (Req 7.4, 7.5).
- A safety timeout / `onAnimationComplete` fallback forces the final visible state if an animation would exceed 800ms (Req 7.6).

### Detail panel system

`DetailPanel` is an accessible overlay (dialog pattern):

- Trigger controls are labeled exactly `"Ver detalhes"` or `"Explorar conceito"` (Req 5.1).
- On activation it renders `detailContent[detailKey]` from the Content_Store within 1s (Req 5.2).
- Uses `role="dialog"`, `aria-modal`, an accessible name, focus moved to the panel on open and **restored** to the trigger on close, and `Escape`/close button to dismiss — focus is never trapped permanently (Req 10.4). Closing restores the summarized state within 1s (Req 5.4).
- If `detailKey` resolves to no content, the panel is not opened; the screen stays summarized and an error indication ("conteúdo indisponível") is shown (Req 5.3, and Req 1.6).

### Visual design system

`tokens.css` declares the exact palette as CSS custom properties (Req 9.1):

```css
:root {
  --bg: #07111f;            --bg-secondary: #0c1828;
  --surface: #111f31;       --surface-light: #17283b;
  --text: #f5f7fa;          --text-secondary: #aeb9c8;
  --accent: #ff9900;        --accent-secondary: #ffb84d;
  --border: rgba(255,255,255,.10);
}
```

- All backgrounds, text, surfaces, borders reference only these variables (Req 9.3); any out-of-palette request is mapped to the nearest token by the shared style utilities rather than failing (Req 9.5).
- Accent `#ff9900` is reserved for interactive states, emphasis marks, and active indicators, kept to ≤10% of any screen's pixel area by design guidelines and reviewed via a coverage check (Req 9.2).
- Typography scale tokens (desktop ≥1280px): H1 56–80px, H2 40–56px, H3 24–32px, Body 18–22px, Caption 13–16px (Req 8.4), using `clamp()` for fluid scaling below 1280px while preserving ordering and Body ≥14px (Req 8.5). Sans-serif system font stack; body ≥16px; text/background contrast ≥4.5:1 (Req 9.4).

### Accessibility strategy

- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<button>`, `<h1>`–`<h3>` in sequential order (Req 10.1).
- Visible focus indicator: 2px outline, ≥3:1 contrast against adjacent colors (Req 10.2).
- All controls keyboard-operable, none pointer-only (Req 10.3); focus never trapped (Req 10.4).
- Every icon-only control has a non-empty `aria-label` (Req 10.5).
- Informative SVGs get `role="img"` + `<title>`; decorative SVGs get `aria-hidden="true"` (Req 10.6).
- Palette contrast: ≥4.5:1 for normal text, ≥3:1 for large text (Req 10.7, 9.7-equivalent).

### Performance strategy

- SVG/CSS-only rendering; no raster asset >100KB exists (Req 13.1).
- Off-screen screens defer heavy content until within one viewport height using IntersectionObserver `rootMargin: '100% 0px'` (Req 13.3).
- `React.memo` on Screen/Diagram/Card components keyed by content identity so unchanged screens do not re-render (Req 13.5).
- Navigation transition completes and becomes interactive within 500ms (Req 13.4).
- Animations target ≥30fps by animating only transform/opacity/`pathLength` (compositable properties) (Req 13.5).
- Dependency set restricted to React, Vite, styling (none extra — CSS), animation (Framer Motion) (Req 12.5, 13.2).

## Data Models

### Content_Store core types

```ts
type DiagramType = 'flow' | 'timeline' | 'architecture' | 'none';

interface DiagramNode { id: string; label: string; group?: string; }
interface DiagramEdge { from: string; to: string; label?: string; }
interface DiagramModel {
  type: Exclude<DiagramType, 'none'>;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  center?: string;              // for architecture layouts
  fallbackText: string;         // Req 6.6 text fallback
}

interface MetricModel {         // exact values from aws.md, no invention
  label: string;                // e.g. "Preparação da plataforma de dados"
  from?: string;                // "3 meses"
  to?: string;                  // "8 dias"
  value?: string;               // e.g. "até 88%"
}

interface DetailContent {       // full aws.md passage behind a panel
  key: string;
  title: string;
  paragraphs: string[];
  lists?: { title?: string; items: string[] }[];
}

interface ScreenContent {
  eyebrow?: string;
  title: string;                // Portuguese, from aws.md
  subtitle?: string;
  body?: string[];
  cards?: { title: string; body?: string; items?: string[] }[];
  metrics?: MetricModel[];
  diagram?: DiagramModel;
  detailKey?: string;           // links to DetailContent; enables Detail_Panel
}

interface ScreenDefinition {
  index: number;                // 0-based position, must equal registry order
  slug: string;                 // e.g. "capa-hero"
  sectionId: string;            // groups screens for the Section_Menu
  title: string;                // exact title from Requirement 2 list
  content: ScreenContent;
}

interface ContentStore {
  screens: ScreenDefinition[];  // length === 34, ordered by index
  details: Record<string, DetailContent>;
  sections: { id: string; label: string; firstScreenIndex: number }[];
}
```

All `ScreenContent` values are transcriptions or faithful summaries of `aws.md`; summaries always carry a `detailKey` pointing to the full passage (Req 1.2, 5.1). The store holds exactly one authoritative copy per passage (Req 1.4).

### The 34-screen registry (fixed order — Req 2.1) with source mapping

Every screen's content traces to `aws.md` (Req 2.3). "Detail" = has a Detail_Panel.

| # | Screen title | aws.md source section | Diagram | Detail |
|---|---|---|---|---|
| 01 | Capa/Hero | Header (event name, date, location) | none | no |
| 02 | O evento em uma visão | Intro (170+ sessões, temas) | none | yes |
| 03 | Mapa geral dos aprendizados | §5 Principais aprendizados (overview) | flow | yes |
| 04 | Da demo ao deploy | §1 AIM206 + Amazon Bedrock AgentCore | flow (PoC→Produção) | yes |
| 05 | RAG | §1 RAG — Retrieval-Augmented Generation | flow | yes |
| 06 | LLM + código determinístico | §1 "LLM não deve executar tudo" | flow (LLM→Tool→LLM) | yes |
| 07 | Segurança dos agentes | §1 Segurança | flow/architecture | yes |
| 08 | Keynote (transição) | §2 Keynote intro (speakers, horário) | none | no |
| 09 | Código como commodity | §2 Código como commodity | none | yes |
| 10 | Kiro | §2/§3 Kiro, Steering Docs, Hooks | flow (Spec-driven chain) | yes |
| 11 | Harness | §2 Harness para agentes | architecture | yes |
| 12 | Case C6 Bank | §2 Case C6 Bank | metrics + flow | yes |
| 13 | Segurança no desenvolvimento | §2 Segurança no desenvolvimento com IA | flow (Discover→Remediate) | yes |
| 14 | Web Search on AgentCore | §2 Web Search on Amazon Bedrock AgentCore | flow | yes |
| 15 | Multi-Agent | §2 IA agêntica nas empresas | architecture/flow | yes |
| 16 | Spec-Driven Development | §3 Spec-Driven Development | flow (Ideia→Testes) | yes |
| 17 | MCP | §3 MCP — Model Context Protocol | flow | yes |
| 18 | AI-DLC | §3 AI-DLC (Inception/Construction/Operations) | timeline | yes |
| 19 | Human in the Loop | §3 Human in the Loop | flow | yes |
| 20 | Brownfield Development | §3 Brownfield Development | flow | yes |
| 21 | Snowflake (transição) | §4 Snowflake intro | none | no |
| 22 | Governança de dados | §4 Governança e segurança + Arquitetura | flow (Usuário→Dados) | yes |
| 23 | Snowflake Cortex AI | §4 Snowflake Cortex AI | flow | yes |
| 24 | Semantic Views | §4 Semantic Views | flow | yes |
| 25 | Cortex Analyst | §4 Cortex Analyst | flow | yes |
| 26 | Cortex Search + RAG | §4 Cortex Search + RAG no ecossistema | flow | yes |
| 27 | Cortex Agents | §4 Cortex Agents | architecture | yes |
| 28 | Snowflake Intelligence | §4 Snowflake Intelligence + Observabilidade | flow | yes |
| 29 | Arquitetura completa | §4 Visão geral da arquitetura Snowflake | architecture | yes |
| 30 | Principais aprendizados | §5 (8 aprendizados) | flow/cards | yes |
| 31 | Evolução da IA | §5.1 Chatbot→Multi-Agent | timeline | yes |
| 32 | A arquitetura do futuro | Conclusão (arquitetura IA empresarial) | architecture | yes |
| 33 | Conclusão | Conclusão (foco/mudança) | none | yes |
| 34 | Encerramento | Conclusão (resumo modelo+contexto+...) | none | no |

Screens 01, 08, 21, 34 are pure transition/framing screens with no summarized passage, so they have no Detail_Panel; all other screens summarize richer `aws.md` passages and expose the full text via a panel (Req 1.2, 5.1). If any screen lacks source content it is left without invented content (Req 2.4).

### C6 Bank metric values (exact, from aws.md — no invention)

```ts
const c6Metrics: MetricModel[] = [
  { label: 'Redução no tempo médio até produção', value: 'até 88%' },
  { label: 'Preparação da plataforma de dados', from: '3 meses',  to: '8 dias' },
  { label: 'Revisão de conformidade',            from: '2 meses',  to: '8 dias' },
  { label: 'Desenvolvimento de produtos',        from: '10 sprints', to: '1 sprint' },
  { label: 'Migração de sistemas',               from: '8 sprints',  to: '1 sprint' },
];
```

### Navigation model

Navigation state is `{ currentIndex, total }` with `total = 34`, mutated only through the pure reducer above. `progressLabel = ${currentIndex + 1} / ${total}` (Req 4.5).

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

These properties target the pure, input-varying logic of the application (the navigation reducer, content-store integrity, diagram layout selection, animation variant resolution, palette utilities, and accessibility contracts). Layout/CSS timing, tooling exit codes, and pixel-area measurements are covered by example, integration, and smoke tests in the Testing Strategy instead.

### Property 1: Navigation index stays within bounds (clamping)

*For any* navigation state and *any* sequence of navigation actions (NEXT, PREV, FIRST, LAST, GOTO), the resulting `currentIndex` is always within `[0, total - 1]`; furthermore NEXT applied at the last screen and PREV applied at the first screen leave `currentIndex` unchanged.

**Validates: Requirements 3.7, 3.8, 4.2, 4.4**

### Property 2: Next and previous are inverse within interior bounds

*For any* index `i` in `[1, total - 2]`, applying NEXT then PREV returns to `i`, and applying PREV then NEXT returns to `i`.

**Validates: Requirements 3.1, 3.2, 4.1, 4.3**

### Property 3: Scroll accumulator steps exactly once per 50px crossing

*For any* sequence of scroll deltas, a screen transition is emitted if and only if the accumulated delta magnitude reaches or exceeds 50 pixels, each such crossing advances the index by exactly one in the delta's direction, and the accumulator resets after a step.

**Validates: Requirements 3.1, 3.2**

### Property 4: Progress label reflects the current index

*For any* valid `currentIndex`, the progress label equals `"${currentIndex + 1} / ${total}"`.

**Validates: Requirements 4.5, 4.6**

### Property 5: Section jump lands on the section's first screen

*For any* section defined in the Content_Store, invoking `goToSection(sectionId)` sets `currentIndex` to that section's `firstScreenIndex`, and each section appears exactly once in the Section_Menu.

**Validates: Requirements 4.7, 4.8**

### Property 6: Screen registry has 34 uniquely ordered screens

*For any* build of the Content_Store, `screens` has length 34, the `index` values are exactly the integers 0 through 33 each occurring once, and the titles equal the canonical ordered title list positionally with no omission, duplicate, or reordering.

**Validates: Requirements 2.1**

### Property 7: Content_Store is the single source and every reference resolves

*For any* Content_Store, each detail key is unique, every screen's `detailKey` (when present) resolves to an existing `DetailContent` entry, and every displayed text field is owned by the store (no field originates outside it).

**Validates: Requirements 1.4, 5.2**

### Property 8: Missing content is reported, never substituted

*For any* content key that is absent from the Content_Store, the resolver returns an explicit "unavailable" result and never returns fabricated or externally sourced text.

**Validates: Requirements 1.6, 5.3**

### Property 9: Detail trigger label is one of the two exact labels

*For any* screen whose content has a `detailKey`, the rendered Detail_Panel trigger label is exactly `"Ver detalhes"` or exactly `"Explorar conceito"`.

**Validates: Requirements 5.1**

### Property 10: Opening then closing a detail panel restores the summarized state

*For any* screen with a `detailKey`, opening the Detail_Panel and then closing it restores the screen to its original summarized state with its summarized content unchanged.

**Validates: Requirements 5.4**

### Property 11: Diagram layout direction follows viewport width

*For any* viewport width greater than or equal to 1024 pixels the diagram layout direction is horizontal, and *for any* viewport width less than 768 pixels the diagram layout direction is vertical.

**Validates: Requirements 6.4, 6.5**

### Property 12: Every diagram relationship has a visual element and a non-empty fallback

*For any* `DiagramModel`, the rendered output contains one visual node per model node and one connector per model edge (every documented relationship is represented), and the model's `fallbackText` is non-empty.

**Validates: Requirements 6.2, 6.6**

### Property 13: Reduced motion yields the final visible state with zero duration

*For any* animation variant, resolving it with reduced motion active produces the element's final visible values (fully visible, unblurred, un-transformed) with an effective duration of zero, so all informational content remains visible and readable.

**Validates: Requirements 7.4, 7.5**

### Property 14: Animation durations are bounded to 200–800ms

*For any* motion-enabled animation variant, its resolved duration is at least 200 milliseconds and at most 800 milliseconds.

**Validates: Requirements 7.2, 7.6**

### Property 15: Typographic ordering and minimums hold at every width

*For any* viewport width, the computed sizes satisfy H1 > H2 > H3 > Body > Caption, and for widths below 1280px the Body size remains at least 14 pixels.

**Validates: Requirements 8.4, 8.5**

### Property 16: All colors conform to the defined palette

*For any* color value, the `nearestPalette` utility returns a member of the defined palette set, and every color token used by a rendered Screen or Diagram_Component is a member of that set.

**Validates: Requirements 9.1, 9.3, 9.5**

### Property 17: Palette text/background pairings meet contrast thresholds

*For any* defined text-on-background pairing used in the app, the computed contrast ratio is at least 4.5:1 for normal text and at least 3:1 for large text.

**Validates: Requirements 9.4, 10.7**

### Property 18: Non-text elements have a text alternative or are marked decorative

*For any* icon or diagram element, exactly one of the following holds: it is informative with a non-empty accessible name/`<title>`, or it is decorative and marked `aria-hidden`; and *for any* icon-only interactive control the accessible name is a non-empty string.

**Validates: Requirements 10.5, 10.6**

### Property 19: Unchanged content does not cause re-renders

*For any* memoized presentational component, re-rendering the app with content props that are unchanged by identity does not increase that component's render count.

**Validates: Requirements 13.5**

## Error Handling

| Failure | Detection | Handling | Requirement |
|---|---|---|---|
| Requested content key missing | Content resolver returns `{ status: 'unavailable' }` | Omit content, show "conteúdo indisponível"; never substitute text | 1.6, 5.3 |
| Detail content missing on open | `details[detailKey]` undefined | Do not open panel; keep summarized state; show error indication | 5.3 |
| Diagram render throws | Error boundary around `Diagram` | Render `fallbackText` describing nodes/relationships; never empty area | 6.6 |
| Animation exceeds 800ms | `onAnimationComplete` + safety timeout | Force final visible state | 7.6 |
| Out-of-palette color requested | `nearestPalette` utility | Substitute nearest palette token; continue rendering | 9.5 |
| Screen has no source content | Author-time registry check | Leave screen without invented content | 2.4 |
| Build/deploy fails | Vite/Vercel process exit code | Non-zero exit status; surface error cause | 12.4 |

## Testing Strategy

The app uses a dual approach: **property-based tests** for universal logic properties and **example/integration/smoke tests** for concrete behaviors, DOM/CSS rendering, timing, tooling, and pixel-level concerns.

### Tooling and commands

- **Test runner:** Vitest (Vite-native, no extra bundler config; dev-time only, does not count against Req 12.5 runtime deps).
- **Property-based testing:** `fast-check` (dev dependency). We do not implement PBT from scratch.
- **DOM/component tests:** `@testing-library/react` + `jsdom` (dev-time).
- **Commands:**
  - Dev server: `npm run dev` (Vite) — run manually in a terminal.
  - Build: `npm run build` → `vite build` (Req 12.1, 12.3).
  - Preview production build: `npm run preview`.
  - Tests (single run): `npm run test -- --run` (Vitest, non-watch).

### Property-based tests (one test per property, ≥100 iterations)

Each property from the Correctness Properties section is implemented by a **single** `fast-check` property test configured with `{ numRuns: 100 }` (minimum 100 iterations). Each test is tagged with a comment in the format:

`// Feature: aws-summit-2026-presentation, Property {number}: {property_text}`

| Property | Generators |
|---|---|
| 1 Clamping | arbitrary start index + arbitrary action list |
| 2 Next/prev inverse | index in `[1, total-2]` |
| 3 Scroll accumulator | arbitrary arrays of signed deltas |
| 4 Progress label | index in `[0, 33]` |
| 5 Section jump | arbitrary section id from the store |
| 6 Registry invariant | the built store (property over its structure) |
| 7 Store integrity | the built store; arbitrary screen selection |
| 8 Missing content | arbitrary strings filtered to non-keys |
| 9 Detail label | screens filtered to those with `detailKey` |
| 10 Detail round-trip | screens with `detailKey` |
| 11 Layout direction | widths in `[320, 1920]` (partitioned) |
| 12 Diagram completeness | generated `DiagramModel`s |
| 13 Reduced motion | the variant set |
| 14 Duration bounds | the variant set |
| 15 Typography ordering | widths in `[320, 1920]` |
| 16 Palette conformance | arbitrary color strings + used token set |
| 17 Contrast | the defined text/background pairings |
| 18 Non-text alternatives | icon/diagram component descriptors |
| 19 No stray re-render | arbitrary unchanged-by-identity props |

### Unit / example tests

- Key→action mapping for ArrowRight/ArrowLeft/Home/End (Req 3.3–3.6).
- Hero exact strings: name, date, location (Req 2.5).
- Screen min-height maps to 100vh (Req 2.2).
- Diagrams contain no `<img>`/external `url(...)` (Req 6.1).
- Diagram text ≥12px at 320/768/1024/1920 (Req 6.3).
- IntersectionObserver entrance at 20% threshold (Req 7.1).
- Off-screen deferral within 1 viewport height (Req 13.3).
- Semantic landmarks + sequential heading levels (Req 10.1).
- Visible focus outline ≥2px, ≥3:1 (Req 10.2).
- Keyboard operability + DetailPanel focus restore, no trap (Req 10.3, 10.4).

### Integration / smoke tests

- No horizontal overflow at 320/768/1024/1280 (Req 8.1, 8.2).
- Accent-area sampling audit ≤10% on representative screens (Req 9.2).
- `vite build` / `vite dev` exit codes and artifact presence (Req 12.1–12.4).
- Dependency allowlist: every runtime dependency maps to React/Vite/styling/animation (Req 12.5, 13.2).
- No raster asset >100KB; diagrams/icons are SVG (Req 13.1).
- Transition-to-interactive and ≥30fps measured on target environment (Req 13.4, 13.5 FPS portion).
- Module/section structure checks: one module per section, concerns separated, no hardcoded display text (Req 11.1–11.4).

### Manual / visual verification

- Full WCAG conformance requires manual testing with assistive technologies and expert review; automated contrast/aria checks are a floor, not a guarantee.
- Visual review of the dark premium theme, accent restraint, and diagram readability across breakpoints.

---

The design is complete and covers all thirteen requirements. It is ready for your review. If you spot gaps, I can return to requirements clarification. Once you approve, click the UI button to move to the Tasks phase.
