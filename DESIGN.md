---
name: Chatree Kengpipat — ERP Consultant Portfolio
description: A private engineering-ledger portfolio for an ERP implementation consultant — Inter + JetBrains Mono, warm neutrals, Engineering Oxblood, and precise champagne details.
colors:
  engineering-red: "#7d1f24"
  engineering-red-hover: "#5b1519"
  engineering-red-soft: "#a3474d"
  accent-light: "#ead5d2"
  accent-bg: "#f5e9e6"
  bg: "#f7f4ee"
  surface: "#fffcf7"
  surface-2: "#f0ebe2"
  surface-3: "#e8e0d4"
  ink: "#201b1c"
  ink-strong: "#100c0d"
  ink-muted: "#62595a"
  ink-subtle: "#756a6b"
  border: "#ded6c8"
  border-strong: "#c9bba7"
  success: "#247464"
  danger: "#b42318"
  warning: "#94601e"
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
    backgroundColor: "{colors.engineering-red}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.engineering-red-hover}"
    textColor: "#ffffff"
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
    textColor: "{colors.engineering-red}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
---

# Design System: Chatree Kengpipat — ERP Consultant Portfolio

## 1. Overview

**Creative North Star: "The Engineering Ledger"**

This is the portfolio of an engineer-turned-ERP-consultant, and the interface
reads like the instrument panel of someone who builds systems for a living:
precise alignment, a restrained parchment/red-black palette, monospace labels
that frame content like readouts, and a decisive oxblood signal color. The
personality is modern, technical, and bold — bold in the
sense of committed typographic scale and a confident dark mode, never loud or
noisy. Trust here is earned by specificity (real module names, project phases,
live dashboards), and the visual system mirrors that: it shows precision rather
than asserting it.

Depth is conveyed through tonal layering and interaction, not heavy chrome.
Surfaces sit flat against warm parchment (or red-black in dark mode) and come alive
on hover and focus with a soft accent glow. Two type voices carry everything:
Inter for all prose and headings, JetBrains Mono reserved strictly for labels,
tags, and metric readouts. The result should feel engineered, not decorated.

This system explicitly rejects the generic portfolio / AI-template look. If a
stranger could glance at it and say "bought theme" or "AI-generated," it has
failed. No interchangeable creative-dev scaffolding, no marketing gloss standing
in for evidence.

**Key Characteristics:**
- Warm-neutral foundation with one Engineering Oxblood accent
- Two-voice typography: Inter (prose) + JetBrains Mono (labels only)
- Flat-by-default surfaces; accent glow appears on interaction
- Full light/dark theme parity via a toggle
- Monospace readouts frame content like an instrument console

## 2. Colors

A warm-neutral base carrying a single dark engineering red that does the
signaling. Champagne marks precision and hierarchy without competing with the
brand. The strategy is **Restrained**: neutrals own the surface, one accent
earns attention.

### Primary
- **Engineering Oxblood** (#7d1f24): The single brand signal. Used on primary
  actions, active navigation, links, metric highlights, and focus accents. In
  dark mode it becomes warm signal red (#e08a81) against red-black surfaces.
- **Engineering Oxblood Hover** (#5b1519): The pressed/hover state of the primary
  action only.
- **Engineering Red Soft** (#a3474d): Secondary accent fills and softer
  highlights where full strength would shout.

### Neutral
- **Ink** (#201b1c): Primary body text on light surfaces.
- **Ink Strong / Red-black** (#100c0d): Headings and the dark-mode canvas.
- **Ink Muted** (#62595a): Secondary text, pill labels, and captions. It meets
  WCAG AA on parchment; do not push lighter for body copy.
- **Ink Subtle** (#756a6b): Tertiary metadata and de-emphasized timestamps only;
  never body copy.
- **Background** (#f7f4ee): The warm parchment canvas in light mode.
- **Surface / Surface-2 / Surface-3** (#fffcf7 / #f0ebe2 / #e8e0d4): Tonal
  layering for cards and raised regions. Depth comes from these steps, not from
  shadow.
- **Border / Border Strong** (#ded6c8 / #c9bba7): Hairline dividers and the
  outline-button stroke.

### Tertiary (status, used sparingly)
- **Success** (#247464), **Danger** (#b42318), **Warning** (#94601e): Reserved
  for genuine status; never decorative.

### Named Rules
**The One Brand Accent Rule.** Engineering Oxblood is the only brand signal.
Champagne is a precision marker; green, danger red, and warning amber are
semantic only. If a second decorative hue competes for attention, it is wrong.

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
from the warm tonal ramp (bg → surface → surface-2 → surface-3), not from
resting shadows. Elevation is a *response to interaction*: on hover and focus,
cards and buttons lift slightly (`translateY`) and pick up a restrained red
signal glow. The shadow scale stays neutral-warm in light and red-black in dark.

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
- **Primary:** Engineering Oxblood fill, white text, resting `--shadow`. On hover:
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
in ink, the second in Engineering Red. It is the single loudest element and
the brand's anchor — one per page, never repeated.

## 6. Do's and Don'ts

### Do:
- **Do** keep Engineering Oxblood (#7d1f24) as the only brand accent; carry
  everything else on warm neutrals (The One Brand Accent Rule).
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
- **Don't** introduce a third type family or a second decorative accent hue.
  Emphasis comes from weight, scale, and engineering red — not novelty colors.
