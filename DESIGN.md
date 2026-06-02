---
name: Chatree Kengpipat — ERP Consultant Portfolio
description: An engineer's-console portfolio for an ERP implementation consultant — Inter + JetBrains Mono, slate neutrals, a single Implementation Blue accent, flat-by-default surfaces that glow on interaction.
colors:
  implementation-blue: "#2563eb"
  implementation-blue-hover: "#1d4ed8"
  implementation-blue-soft: "#3b82f6"
  accent-light: "#dbeafe"
  accent-bg: "#eff6ff"
  bg: "#ffffff"
  surface: "#f8fafc"
  surface-2: "#f1f5f9"
  surface-3: "#e2e8f0"
  ink: "#0f172a"
  ink-strong: "#020617"
  ink-muted: "#64748b"
  ink-subtle: "#94a3b8"
  border: "#e2e8f0"
  border-strong: "#cbd5e1"
  success: "#059669"
  danger: "#dc2626"
  warning: "#d97706"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(4rem, 9vw, 9rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  heading:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "100px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.75rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.implementation-blue}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.implementation-blue-hover}"
    textColor: "{colors.bg}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.4rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.4rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "2rem"
  pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.75rem"
  tag:
    backgroundColor: "{colors.accent-bg}"
    textColor: "{colors.implementation-blue}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
---

# Design System: Chatree Kengpipat — ERP Consultant Portfolio

## 1. Overview

**Creative North Star: "The Engineer's Console"**

This is the portfolio of an engineer-turned-ERP-consultant, and the interface
reads like the instrument panel of someone who builds systems for a living:
precise alignment, a restrained slate palette, monospace labels that frame
content like readouts, and a single decisive blue that behaves like a signal,
not decoration. The personality is modern, technical, and bold — bold in the
sense of committed typographic scale and a confident dark mode, never loud or
noisy. Trust here is earned by specificity (real module names, project phases,
live dashboards), and the visual system mirrors that: it shows precision rather
than asserting it.

Depth is conveyed through tonal layering and interaction, not heavy chrome.
Surfaces sit flat against near-white (or deep slate in dark mode) and come alive
on hover and focus with a soft accent glow. Two type voices carry everything:
Inter for all prose and headings, JetBrains Mono reserved strictly for labels,
tags, and metric readouts. The result should feel engineered, not decorated.

This system explicitly rejects the generic portfolio / AI-template look. If a
stranger could glance at it and say "bought theme" or "AI-generated," it has
failed. No interchangeable creative-dev scaffolding, no marketing gloss standing
in for evidence.

**Key Characteristics:**
- Slate-neutral foundation with one Implementation Blue accent
- Two-voice typography: Inter (prose) + JetBrains Mono (labels only)
- Flat-by-default surfaces; accent glow appears on interaction
- Full light/dark theme parity via a toggle
- Monospace readouts frame content like an instrument console

## 2. Colors

A slate-neutral base carrying a single saturated blue that does all the
signaling. The strategy is **Restrained**: neutrals own the surface, one accent
earns attention.

### Primary
- **Implementation Blue** (#2563eb): The single signal color. Used on primary
  buttons, active nav, links, metric highlights, and focus accents. In dark mode
  it lightens to #60a5fa for contrast against deep slate.
- **Implementation Blue Hover** (#1d4ed8): The pressed/hover state of the primary
  action only.
- **Implementation Blue Soft** (#3b82f6): Secondary accent fills and softer
  highlights where full strength would shout.

### Neutral
- **Ink** (#0f172a): Primary body text on light surfaces; also the dark-mode
  background.
- **Ink Strong** (#020617): Headings and the highest-emphasis text.
- **Ink Muted** (#64748b): Secondary text, pill labels, captions. Hits ≥4.5:1 on
  white; do not push lighter for body copy.
- **Ink Subtle** (#94a3b8): Tertiary metadata and de-emphasized timestamps only;
  never body copy.
- **Background** (#ffffff): The page canvas in light mode.
- **Surface / Surface-2 / Surface-3** (#f8fafc / #f1f5f9 / #e2e8f0): Tonal
  layering for cards and raised regions. Depth comes from these steps, not from
  shadow.
- **Border / Border Strong** (#e2e8f0 / #cbd5e1): Hairline dividers and the
  outline-button stroke.

### Tertiary (status, used sparingly)
- **Success** (#059669), **Danger** (#dc2626), **Warning** (#d97706): Reserved
  for genuine status; never decorative.

### Named Rules
**The One Accent Rule.** Implementation Blue is the only chromatic voice. Every
other surface is a slate neutral. If a second hue starts competing for
attention, it's wrong — emphasis comes from blue, weight, or scale, not from a
new color.

**The Twin-Theme Rule.** Light and dark are first-class equals, swapped via the
`[data-theme]` toggle. Any new color must be defined for both themes and hold
contrast in each; a token that only works in light mode is incomplete.

## 3. Typography

**Display / Heading Font:** Inter (with -apple-system, BlinkMacSystemFont fallback)
**Body Font:** Inter
**Label / Mono Font:** JetBrains Mono

**Character:** A single workhorse sans (Inter, used across weights 300–900) gives
the system its modern, neutral-technical voice, while JetBrains Mono provides a
deliberate contrast axis for labels and readouts. The pairing reads as
engineering precision: one family does the talking, one annotates it.

> Note: the linked Google Fonts include Cormorant Garamond and DM Sans/Mono, but
> the stylesheet does not actually use them. The real, shipping system is
> Inter + JetBrains Mono.

### Hierarchy
- **Signature Display** (Inter 900, clamp(4rem, 9vw, 9rem), line-height ~0.95,
  letter-spacing -0.04em): The hero name lockup (`.ck-signature`). One per page,
  the loudest element by design.
- **Heading** (Inter 800, clamp(2rem, 4.5vw, 3.5rem), line-height 1.1): Section
  titles. Use `text-wrap: balance`.
- **Title** (Inter 600–700, ~1.25–1.5rem): Card titles, sub-section heads.
- **Body** (Inter 400, 15px, line-height 1.6): Default prose. Cap measure at
  65–75ch.
- **Label** (JetBrains Mono 500, 0.72rem, letter-spacing 0.05em): Pills, tags,
  metric units, eyebrow-style annotations. Sentence or short-phrase length only.

### Named Rules
**The Two-Voice Rule.** Inter for everything readable; JetBrains Mono only for
labels, tags, and numeric readouts. Mono never sets a paragraph; Inter never
fakes a code label. Three+ families would read as indecision.

## 4. Elevation

**Flat-by-default with accent glow.** Surfaces are flat at rest — depth is built
from the slate tonal ramp (bg → surface → surface-2 → surface-3), not from
resting shadows. Elevation is a *response to interaction*: on hover and focus,
cards and buttons lift slightly (`translateY`) and pick up a soft Implementation
Blue glow. The shadow scale exists for this state work, and stays neutral
(slate-tinted in light, near-black in dark).

### Shadow Vocabulary
- **shadow-sm** (`0 1px 2px rgba(15,23,42,0.04)`): Hairline lift, resting buttons.
- **shadow / shadow-md** (`0 1px 3px … / 0 4px 6px -1px …`): Default and hover
  card elevation.
- **shadow-lg / shadow-xl**: Reserved for the highest layers (scrolled nav,
  modals/overlays if added).
- **Accent glow** (`0 15px 30px -8px var(--glow-strong), 0 0 25px var(--glow-color)`,
  where glow = a 35–60% mix of the accent): The signature interaction — applied
  to primary buttons and key cards on hover only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow and glow appear
only in response to state (hover, focus, scrolled). A drop shadow on a static,
non-interactive element is wrong; use a tonal surface step instead.

## 5. Components

Components feel **precise and technical, quietly confident**: clean geometry,
small monospace labels framing content, restrained motion that confirms
interaction rather than performing.

### Buttons
- **Shape:** Gently rounded (6px, `--radius-sm`), padding 0.75rem 1.4rem, Inter
  600, letter-spacing -0.01em.
- **Primary:** Implementation Blue fill, white text, resting `--shadow`. On hover:
  `translateY(-2px) scale(1.02)` with the accent glow. A subtle radial ripple
  expands from center (`.btn::before`).
- **Outline:** Transparent with a 1px `--border-strong` stroke and ink text. On
  hover: border and text shift to accent, background fills with `--accent-bg`.

### Cards (project / method / focus)
- **Corner Style:** 8–12px (`--radius-md`).
- **Background:** `--surface` over the page `--bg`; layering, not shadow, sets it
  apart at rest.
- **Border:** 1px `--border` hairline.
- **Internal Padding:** 1.75–2rem (`--space-lg`/`--space-xl`).
- **Hover:** Lifts with `--ease-smooth`, title color shifts to accent, metric
  values animate with `--ease-bounce`.

### Pills & Tags
- **Pill** (`.hero-v7-meta-pill`): JetBrains Mono 0.72rem, `--surface` background,
  1px `--border`, fully rounded (100px), ink-muted text. Hover shifts border and
  text to accent with a small lift + glow.
- **Tag** (`.hero-v7-tag`): JetBrains Mono, `--accent-bg` background, accent text,
  100px radius, 1px border at 25% accent. The "now / focus" marker.

### Navigation
- **Style:** Fixed top bar, translucent (`color-mix` of bg + transparent), 1px
  bottom border. Logo left, links + theme toggle right.
- **Links:** Ink-muted at rest; hover/active shift to accent text on `--accent-bg`.
- **Scrolled state:** `nav.scrolled` raises opacity to 95% and adds `--shadow-md`.
- **Theme toggle:** Sun/moon glyph button driving `[data-theme]`.

### Signature: The Name Lockup (`.ck-signature`)
The hero stacks CHATREE / KENGPIPAT in Inter 900 at display scale, the first line
in ink, the second in Implementation Blue. It is the single loudest element and
the brand's anchor — one per page, never repeated.

## 6. Do's and Don'ts

### Do:
- **Do** keep Implementation Blue (#2563eb) as the only accent; carry everything
  else on slate neutrals (The One Accent Rule).
- **Do** reserve JetBrains Mono for labels, tags, and readouts; set all prose in
  Inter (The Two-Voice Rule).
- **Do** keep surfaces flat at rest and let shadow/glow appear only on hover,
  focus, or scroll (The Flat-By-Default Rule).
- **Do** define every new color for both light and dark themes and verify body
  text ≥4.5:1, large text ≥3:1 in each.
- **Do** honor `prefers-reduced-motion`: the animated tech-canvas background and
  any reveal must have a reduced/instant alternative.
- **Do** lead with specific ERP evidence (module names, phases, live dashboards),
  matching PRODUCT.md's "show the work, don't claim it."

### Don't:
- **Don't** let it look like a generic portfolio or an AI-template / bought
  theme. If a stranger could guess "AI-generated" or "template," rework it.
- **Don't** use tiny tracked-uppercase eyebrows above every section, or numbered
  `01 / 02 / 03` section scaffolding. (PRODUCT.md anti-references.)
- **Don't** ship identical icon-heading-text card grids, gradient text
  (`background-clip: text`), decorative glassmorphism, or the hero-metric
  template.
- **Don't** use a colored `border-left`/`border-right` greater than 1px as a
  side-stripe accent (the current `.formula-block` 3px accent stripe is exactly
  this anti-pattern — convert to a full border, background tint, or leading mono
  label).
- **Don't** use marketing buzzwords (streamline, empower, leverage, seamless,
  world-class). Use specific ERP nouns and verbs.
- **Don't** introduce a third type family or a second accent hue. Emphasis comes
  from weight, scale, and blue — not from new colors or fonts.
