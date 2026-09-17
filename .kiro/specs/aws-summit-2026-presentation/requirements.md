# Requirements Document

## Introduction

This feature delivers an interactive, visually sophisticated web presentation that transforms the content of `aws.md` into a premium executive/technical narrative about **AWS Summit São Paulo 2026**. The presentation combines a slide deck, landing page, storytelling, and visual documentation into a single scroll-and-keyboard navigable experience of approximately 34 full-viewport screens.

The application is built with React + Vite, uses SVG/CSS/HTML for all diagrams and icons (no external images), and is ready for local execution and Vercel deployment. It follows a dark, technological, cloud/AI visual direction with orange used sparingly as a highlight.

**Single Source of Truth Constraint:** The file `aws.md` is the only authoritative content source. The presentation MUST NOT introduce external research, invented talks, numbers, names, technologies, dates, results, participants, or features that are absent from `aws.md`. Content may be reorganized visually, summarized for supporting visuals, and split across screens, but all detailed information present in `aws.md` MUST be preserved somewhere in the site (including via expandable detail panels/modals).

## Glossary

- **Presentation_App**: The complete React + Vite web application that renders the interactive AWS Summit 2026 presentation.
- **Screen**: A full-viewport (minimum height 100vh) narrative unit; the presentation contains approximately 34 screens in a fixed narrative sequence.
- **Navigation_System**: The subsystem handling scroll navigation, keyboard controls, next/previous buttons, and section menu.
- **Progress_Indicator**: The visual element that shows the viewer's current position within the sequence of screens.
- **Section_Menu**: The side or top menu providing direct access to main sections of the presentation.
- **Detail_Panel**: An expandable panel, modal, or expandable card mechanism ("Ver detalhes" / "Explorar conceito") that reveals detailed content from `aws.md` beyond the essentials shown on a screen.
- **Diagram_Component**: A component that renders a flow, timeline, or architecture diagram using only SVG/CSS/HTML.
- **Content_Store**: The centralized data module (e.g., `data/awsSummitContent`) that holds all textual content sourced from `aws.md`.
- **Animation_System**: The subsystem producing entrance and transition animations (fade, slide, scale, blur, parallax, connecting lines, sequential reveal, animated counters, progressive diagrams).
- **Reduced_Motion_Mode**: The behavior state activated when the viewer's environment signals `prefers-reduced-motion`.
- **Source_Document**: The file `aws.md`, the single authoritative content source.
- **Viewer**: The person viewing and navigating the presentation.

## Requirements

### Requirement 1: Content Fidelity to Source Document

**User Story:** As a viewer, I want the presentation to accurately reflect the AWS Summit 2026 content, so that I can trust the information without external verification.

#### Acceptance Criteria

1. THE Presentation_App SHALL display only textual content whose wording and meaning trace to a corresponding passage in the Source_Document, and SHALL NOT display textual content that has no corresponding passage in the Source_Document.
2. WHERE a Screen displays a summarized or reduced form of a Source_Document passage, THE Presentation_App SHALL make the complete corresponding Source_Document passage available within a Detail_Panel reachable from that Screen through a single user action.
3. WHEN content from the Source_Document is reorganized, summarized, or split across two or more Screens, THE Presentation_App SHALL retain every distinct factual statement, named entity, numeric value, and stated relationship from the corresponding Source_Document passage.
4. THE Content_Store SHALL hold exactly one authoritative copy of each textual passage sourced from the Source_Document, and all Screens and Detail_Panels SHALL derive their textual content from the Content_Store rather than from any other origin.
5. THE Presentation_App SHALL present all textual content in Portuguese, matching the language of the corresponding Source_Document passage.
6. IF a request targets textual content that has no corresponding passage in the Content_Store, THEN THE Presentation_App SHALL omit that content from display and SHALL indicate to the viewer that the requested content is unavailable, without displaying substitute or externally sourced text.

### Requirement 2: Narrative Screen Sequence

**User Story:** As a viewer, I want the presentation organized as a guided narrative of screens, so that I can follow the event story from opening to conclusion.

#### Acceptance Criteria

1. THE Presentation_App SHALL render exactly 34 Screens in the following fixed order with no omissions, duplicates, or reordering: 01 Capa/Hero, 02 O evento em uma visão, 03 Mapa geral dos aprendizados, 04 Da demo ao deploy, 05 RAG, 06 LLM + código determinístico, 07 Segurança dos agentes, 08 Keynote (transição), 09 Código como commodity, 10 Kiro, 11 Harness, 12 Case C6 Bank, 13 Segurança no desenvolvimento, 14 Web Search on AgentCore, 15 Multi-Agent, 16 Spec-Driven Development, 17 MCP, 18 AI-DLC, 19 Human in the Loop, 20 Brownfield Development, 21 Snowflake (transição), 22 Governança de dados, 23 Snowflake Cortex AI, 24 Semantic Views, 25 Cortex Analyst, 26 Cortex Search + RAG, 27 Cortex Agents, 28 Snowflake Intelligence, 29 Arquitetura completa, 30 Principais aprendizados, 31 Evolução da IA, 32 A arquitetura do futuro, 33 Conclusão, 34 Encerramento.
2. THE Presentation_App SHALL render each of the 34 Screens with a computed height of at least 100vh (equal to the full viewport height).
3. THE Presentation_App SHALL populate each Screen only with content that is traceable to a corresponding section of the Source_Document.
4. IF a Screen has no corresponding content in the Source_Document, THEN THE Presentation_App SHALL leave that Screen without invented content and SHALL NOT display information absent from the Source_Document.
5. WHEN the Hero Screen (01 Capa/Hero) is rendered, THE Presentation_App SHALL display the event name "AWS Summit São Paulo 2026", the date "03 de setembro de 2026", and the location "São Paulo Expo — São Paulo, SP" exactly as stated in the Source_Document.

### Requirement 3: Scroll and Keyboard Navigation

**User Story:** As a viewer, I want to navigate with scroll and keyboard, so that I can move through the presentation using my preferred input method.

#### Acceptance Criteria

1. WHEN the Viewer scrolls down by at least 50 pixels of accumulated scroll delta, THE Navigation_System SHALL advance to the next Screen in sequence within 500 milliseconds.
2. WHEN the Viewer scrolls up by at least 50 pixels of accumulated scroll delta, THE Navigation_System SHALL return to the previous Screen in sequence within 500 milliseconds.
3. WHEN the Viewer presses the ArrowRight key, THE Navigation_System SHALL advance to the next Screen in sequence within 500 milliseconds.
4. WHEN the Viewer presses the ArrowLeft key, THE Navigation_System SHALL return to the previous Screen in sequence within 500 milliseconds.
5. WHEN the Viewer presses the Home key, THE Navigation_System SHALL navigate to the first Screen within 500 milliseconds.
6. WHEN the Viewer presses the End key, THE Navigation_System SHALL navigate to the last Screen within 500 milliseconds.
7. WHILE the Viewer is on the first Screen, IF a previous-Screen action is requested via scroll or keyboard, THEN THE Navigation_System SHALL keep the Viewer on the first Screen and perform no Screen transition.
8. WHILE the Viewer is on the last Screen, IF a next-Screen action is requested via scroll or keyboard, THEN THE Navigation_System SHALL keep the Viewer on the last Screen and perform no Screen transition.

### Requirement 4: Navigation Controls and Progress

**User Story:** As a viewer, I want on-screen controls and a progress indicator, so that I can navigate directly and know my position in the presentation.

#### Acceptance Criteria

1. WHEN the Viewer activates the "Próximo" control, THE Navigation_System SHALL advance to the next Screen in the sequence within 500 milliseconds.
2. IF the Viewer activates the "Próximo" control while on the last Screen in the sequence, THEN THE Navigation_System SHALL remain on the current Screen and take no navigation action.
3. WHEN the Viewer activates the "Anterior" control, THE Navigation_System SHALL return to the previous Screen in the sequence within 500 milliseconds.
4. IF the Viewer activates the "Anterior" control while on the first Screen in the sequence, THEN THE Navigation_System SHALL remain on the current Screen and take no navigation action.
5. THE Progress_Indicator SHALL display the Viewer's current position as the current Screen number and the total number of Screens (for example, "3 / 12").
6. WHEN the Viewer navigates to a different Screen, THE Progress_Indicator SHALL update within 500 milliseconds to display the new current Screen number.
7. THE Section_Menu SHALL display one direct-access link for each main section of the presentation.
8. WHEN the Viewer activates a Section_Menu link, THE Navigation_System SHALL navigate to the first Screen of the corresponding section within 500 milliseconds.

### Requirement 5: Detail Panels for Deep Content

**User Story:** As a viewer, I want to expand detailed content on demand, so that the main presentation stays clean while the full depth of the source remains available.

#### Acceptance Criteria

1. WHERE a Screen summarizes content that is detailed in the Source_Document, THE Screen SHALL provide a Detail_Panel control labeled exactly "Ver detalhes" or "Explorar conceito".
2. WHEN the Viewer activates a Detail_Panel control, THE Presentation_App SHALL display, within 1 second, the corresponding detailed content from the Source_Document that maps to the activating Screen's summarized content.
3. IF the corresponding detailed content cannot be retrieved from the Source_Document when a Detail_Panel control is activated, THEN THE Presentation_App SHALL keep the Screen in its summarized state and display an error indication that the detailed content is unavailable.
4. WHEN the Viewer closes a Detail_Panel, THE Presentation_App SHALL return the Screen to its summarized state within 1 second, preserving the Screen's summarized content unchanged.

### Requirement 6: SVG-Based Diagrams

**User Story:** As a viewer, I want the conceptual flows and architectures shown as diagrams, so that I can understand how the concepts relate.

#### Acceptance Criteria

1. THE Diagram_Component SHALL render all diagrams using only inline SVG, CSS, and HTML, with zero references to external raster or vector image files.
2. THE Diagram_Component SHALL represent the flow, timeline, and architecture relationships described in the Source_Document, such that each relationship documented in the Source_Document has a corresponding visual element in the rendered diagram.
3. WHILE rendering at any supported viewport width from 320 pixels to 1920 pixels, THE Diagram_Component SHALL render all diagram text at a computed font size of at least 12 pixels.
4. WHERE the Viewer's viewport width is greater than or equal to 1024 pixels, THE Diagram_Component SHALL arrange complex diagrams so that connected nodes are laid out along the horizontal axis.
5. WHERE the Viewer's viewport width is less than 768 pixels, THE Diagram_Component SHALL arrange complex diagrams so that connected nodes are laid out along the vertical axis.
6. IF a diagram fails to render, THEN THE Diagram_Component SHALL display a visible text fallback describing the diagram content and SHALL NOT display a broken or empty diagram area.

### Requirement 7: Animations and Motion Control

**User Story:** As a viewer, I want subtle animations that support the narrative, so that the experience feels premium without being distracting or inaccessible.

#### Acceptance Criteria

1. WHEN a Screen enters the viewport such that at least 20 percent of its area is visible, THE Animation_System SHALL apply entrance animations to that Screen's elements within 100 milliseconds.
2. WHEN entrance animations are applied to a Screen's elements, THE Animation_System SHALL complete each element's animation within a duration of 200 to 800 milliseconds.
3. THE Animation_System SHALL support fade, slide, scale, blur, parallax, connecting-line, sequential-reveal, animated-counter, and progressive-diagram effects.
4. WHILE Reduced_Motion_Mode is active, THE Animation_System SHALL present content without motion-based animations.
5. WHILE Reduced_Motion_Mode is active, THE Animation_System SHALL keep all informational content fully visible and readable without requiring any animation to complete.
6. IF an entrance animation fails to complete within 800 milliseconds, THEN THE Animation_System SHALL display the affected elements in their final visible state.

### Requirement 8: Responsive Layout

**User Story:** As a viewer on any device, I want the presentation to adapt to my screen, so that no important information is lost.

#### Acceptance Criteria

1. THE Presentation_App SHALL render layouts without horizontal scrolling or content overflow at desktop (viewport width 1280px and above), notebook (viewport width 1024px to 1279px), tablet (viewport width 768px to 1023px), and mobile (viewport width 320px to 767px) viewport sizes.
2. WHILE the viewport width is between 320px and 767px, THE Presentation_App SHALL keep all informational content reachable through vertical scrolling without truncation, clipping, or overlap.
3. WHEN the viewport width changes to a value within a different viewport range defined in criterion 1, THE Presentation_App SHALL apply the layout for the new range within 500 milliseconds.
4. THE Presentation_App SHALL apply a typographic hierarchy with H1 between 56px and 80px, H2 between 40px and 56px, H3 between 24px and 32px, Body between 18px and 22px, and Caption between 13px and 16px at desktop viewport sizes (viewport width 1280px and above).
5. WHILE the viewport width is below 1280px, THE Presentation_App SHALL scale each typographic level proportionally so that the ordering H1 greater than H2 greater than H3 greater than Body greater than Caption is preserved and Body text remains at least 14px.

### Requirement 9: Visual Design System

**User Story:** As a viewer, I want a consistent, premium visual identity, so that the presentation feels professional and cohesive.

#### Acceptance Criteria

1. THE Presentation_App SHALL apply a dark visual theme using the defined palette: background #07111f, secondary background #0c1828, surface #111f31, light surface #17283b, primary text #f5f7fa, secondary text #aeb9c8, accent #ff9900, secondary accent #ffb84d, and border rgba(255,255,255,.10).
2. THE Presentation_App SHALL restrict the accent color #ff9900 to highlight elements (interactive states, emphasis marks, and active indicators) such that accent-colored pixels occupy no more than 10 percent of the total pixel area of any single Screen.
3. WHEN a Screen or Diagram_Component is rendered, THE Presentation_App SHALL apply the defined palette from criterion 1 to that element's background, text, surface, and border, with zero color values outside the defined palette.
4. THE Presentation_App SHALL render all body and heading text using a sans-serif typeface with a minimum body text size of 16 pixels and a minimum contrast ratio of 4.5:1 between text color and its background color.
5. IF a Screen or Diagram_Component references a color value not present in the defined palette from criterion 1, THEN THE Presentation_App SHALL substitute the nearest defined palette value and continue rendering the element without failure.

### Requirement 10: Accessibility

**User Story:** As a viewer using assistive technology or keyboard, I want the presentation to be accessible, so that I can perceive and operate all content.

#### Acceptance Criteria

1. THE Presentation_App SHALL use semantic HTML elements (headings, lists, buttons, landmarks) for structural and content elements, with heading levels applied in sequential order without skipping levels.
2. WHEN an interactive element receives keyboard focus, THE Presentation_App SHALL display a visible focus indicator with a contrast ratio of at least 3:1 against adjacent colors and a minimum outline thickness of 2 CSS pixels.
3. THE Presentation_App SHALL allow the Viewer to reach and operate all interactive controls using the keyboard alone, with no control requiring pointer input to activate.
4. IF keyboard focus enters an interactive control, THEN THE Presentation_App SHALL allow focus to move away from that control using standard keyboard navigation without becoming trapped.
5. THE Presentation_App SHALL provide an aria-label or equivalent accessible name for every interactive control that lacks visible text, such that the accessible name is non-empty.
6. THE Presentation_App SHALL provide a non-empty text alternative for every informative non-text element, and SHALL mark purely decorative non-text elements so they are ignored by assistive technology.
7. THE Presentation_App SHALL render text with a contrast ratio of at least 4.5:1 against its background for text smaller than 18 point (or 14 point bold), and at least 3:1 for larger text, across all colors in the defined palette.

### Requirement 11: Component Architecture and Maintainability

**User Story:** As a developer, I want a clean componentized architecture, so that the presentation is maintainable and easy to extend.

#### Acceptance Criteria

1. THE Presentation_App SHALL organize its source into distinct modules for content, components, layout, styles, and animations, such that each of these five concerns resides in a separate module with no concern's code duplicated across the others.
2. THE Presentation_App SHALL provide the following components, each defined once and referenced from at least two distinct locations: Screen, Navigation, Progress_Indicator, section title, information card, flow diagram, timeline, architecture diagram, metric card, and Detail_Panel.
3. THE Presentation_App SHALL place each section's composition in a dedicated section module containing only that section's composition, with one module per section.
4. THE Presentation_App SHALL source all displayed content through the Content_Store, such that no presentational component contains hardcoded display text or content values.

### Requirement 12: Build, Run, and Deploy

**User Story:** As a developer, I want to run the project locally and deploy it easily, so that I can preview and publish the presentation.

#### Acceptance Criteria

1. WHEN the build process is executed, THE Presentation_App SHALL build using React and Vite and complete with a success exit status and no build errors.
2. WHEN a developer runs the Vite development command, THE Presentation_App SHALL start a local development server and serve the presentation without startup errors.
3. WHEN the production build command is executed, THE Presentation_App SHALL produce a production build artifact that deploys to Vercel and loads without runtime errors.
4. IF the build or deploy process fails, THEN THE Presentation_App SHALL terminate with a non-success exit status and surface an error indicating the cause of failure.
5. THE Presentation_App SHALL include only dependencies that are required for React, Vite, styling, or animation, such that every declared runtime dependency maps to one of these four purposes.

### Requirement 13: Performance

**User Story:** As a viewer, I want the presentation to load and run smoothly, so that navigation and animations feel responsive.

#### Acceptance Criteria

1. THE Presentation_App SHALL render all diagrams and icons using SVG and CSS, with no diagram or icon rendered from a raster image exceeding 100 KB.
2. THE Presentation_App SHALL include only dependencies required for React, Vite, styling, or animation, such that every declared runtime dependency maps to one of these four purposes.
3. WHERE a Screen's content is not within the viewport, THE Presentation_App SHALL defer rendering of that Screen's non-visible content until the Screen enters or is within 1 viewport height of the viewport.
4. WHEN a navigation action changes the active Screen, THE Presentation_App SHALL complete the transition and become interactive within 500 milliseconds.
5. WHILE an animation is running, THE Presentation_App SHALL sustain a rendering rate of at least 30 frames per second and SHALL NOT trigger re-renders of components whose displayed state has not changed.
