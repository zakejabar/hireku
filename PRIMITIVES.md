# HireKu — Design Primitives

## Philosophy

**Dark & sharp. Typography-led. One accent.**

HireKu sits between a dev tool and a B2B SaaS. The visual language is inspired by Linear and Supabase for the app shell, and editorial agency design (Bravox) for the landing page. High contrast, bold type on key numbers, teal as the single accent colour. Nothing is decorative — every visual decision serves density or hierarchy.

Rules:
- Type weight and size do the hierarchy work. Colour is not used for decoration.
- Teal is the only accent. Amber is reserved for warnings/maybe states only.
- Borders define surfaces, not shadows.
- If it looks plain, increase type weight or size — not colour.

---

## Colour tokens

Define these in `tailwind.config.ts` under `theme.extend.colors`.

```ts
colors: {
  brand: {
    DEFAULT: '#0d9488',   // teal-600 — primary accent, CTAs, active states, hire verdict
    light: '#ccfbf1',     // teal-100 — text on teal bg
    dim: '#0a1f1d',       // teal bg for badges (dark surfaces)
    hover: '#0f766e',     // teal-700 — hover state
  },
  amber: {
    DEFAULT: '#d97706',   // amber-600 — maybe verdict, warnings only
    dim: '#1f1400',       // amber bg for badges (dark surfaces)
  },
  surface: {
    base: '#080808',      // page background
    low: '#0a0a0a',       // app body background
    mid: '#0d0d0d',       // sidebar, cards, navbar
    high: '#111111',      // elevated elements
    hover: '#141414',     // hover state on dark surfaces
    border: '#161616',    // default border
    borderHigh: '#1c1c1c', // slightly visible border (landing sections)
    borderFocus: '#222222', // hover border on cards
  },
  text: {
    primary: '#f0f0f0',   // headings, names, key values
    secondary: '#e0e0e0', // body, card content
    muted: '#444444',     // nav links, descriptions
    dim: '#2a2a2a',       // subtitles, placeholders
    ghost: '#1f1f1f',     // pass state text, disabled
    accent: '#0d9488',    // teal text — eyebrows, active nav, hire scores
    warning: '#d97706',   // amber text — maybe scores
  },
  verdict: {
    hire: '#0d9488',
    maybe: '#d97706',
    pass: '#2a2a2a',
  }
}
```

---

## Typography scale

Add Inter via `next/font/google`. This is the only font in the product.

```ts
// layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
```

```ts
// tailwind.config.ts
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

### Scale

| Token | Size | Weight | Letter spacing | Usage |
|---|---|---|---|---|
| `display` | 52px | 500 | -2px | Landing hero H1 only |
| `heading-xl` | 32px | 500 | -1px | Stat numbers on landing |
| `heading-lg` | 22px | 500 | -0.6px | Page title inside app |
| `heading-md` | 18px | 500 | -0.4px | Section headings |
| `heading-sm` | 15px | 500 | -0.3px | Card titles, feature titles |
| `body-lg` | 14px | 400 | -0.2px | Body copy, descriptions |
| `body` | 13px | 400 | -0.2px | Card content, sidebar items |
| `body-sm` | 12px | 400 | 0 | Nav links, role pills |
| `label` | 11px | 500 | 0 | Metric labels, card roles |
| `caption` | 10px | 400 | 0 | Bar labels, secondary info |
| `overline` | 10px | 500 | 0.1em | Section labels (uppercase) |
| `eyebrow` | 10px | 500 | 0.12em | Landing eyebrow (uppercase, teal) |

**Rules:**
- Two weights only: 400 (regular) and 500 (medium). Never 600 or 700.
- Letter-spacing is negative on large type, zero on small type.
- Never use colour to create hierarchy — use size and weight first.

---

## Spacing scale

Base unit: 4px. Everything is a multiple.

```
2px  — micro gaps (between badge text and icon)
4px  — tight gaps (between label and value)
6px  — component internal gaps (bar rows, sidebar items)
8px  — small gaps (between card elements)
12px — medium gaps (between cards, metric grid gap)
16px — section internal padding
20px — page content padding
24px — section padding (features)
28px — large section padding (hero, nav)
48px — section breathing room
60px — hero top padding
```

---

## Border radius

Single value for the entire product. **5px everywhere.** No mixing.

```ts
borderRadius: {
  DEFAULT: '5px',
  sm: '3px',   // badges, pills only
  md: '5px',   // inputs, buttons, cards, sidebar items
  lg: '8px',   // larger cards if needed
}
```

---

## Borders

All borders are `0.5px`. Never `1px`.

```
surface.border (#161616)   — default, all cards and surfaces in app
surface.borderHigh (#1c1c1c) — landing page section dividers
surface.borderFocus (#222222) — card hover state
```

No box shadows anywhere. Surfaces are defined by borders only.

---

## Component specs

### Navbar (landing)

```
height: 44–48px
background: surface.mid (#0d0d0d) or transparent on scroll
border-bottom: 0.5px surface.borderHigh
padding: 0 28px
logo: logomark (18×18 teal square, border-radius sm) + name at body-sm/500
nav links: body-sm, text.muted
cta: body-sm/500, teal border 0.5px, teal text, border-radius md, padding 5px 12px
```

### App navbar

```
height: 42px
background: surface.mid
border-bottom: 0.5px surface.border
padding: 0 20px
logo: logomark 18×18 + name at 13px/500
nav items: 11px, text.muted — active: text.secondary + surface.high bg
role pill: 10px, text.muted, surface.high bg, surface.border border
avatar: 24px circle, surface.high bg
```

### Sidebar

```
width: 180px
background: surface.mid
border-right: 0.5px surface.border
padding: 10px 6px
section labels: overline, text.ghost
sidebar items: 12px, text.muted, gap 7px, padding 5px 8px, border-radius md
active item: surface.hover bg, text.secondary, teal icon
role items: 11px name, 9px sub (text.ghost)
```

### Hero (landing)

```
padding: 60px 28px 48px
eyebrow: eyebrow scale, teal, uppercase, letter-spacing 0.12em
H1: display scale (52px/500/-2px), text.primary — accent word in teal
subheading: body-lg (14px), text.muted, max-width 380px, line-height 1.6
primary CTA: brand bg, brand.light text, 10px 20px padding, border-radius md, 13px/500
ghost CTA: 13px, text.muted, no border
stat row: 3-col grid, border-top 0.5px, number at heading-xl with teal accent, label at 11px text.dim
```

### Feature grid (landing)

```
3-col grid, border-top 0.5px
each cell: padding 24px 28px, border-right 0.5px (last child none)
number: overline scale (10px/500), text.ghost — "01" "02" "03"
title: heading-sm (15px/500/-0.3px), text.primary
description: 11px/400, text.muted, line-height 1.6
```

### Metric cards (app)

```
background: surface.mid
border: 0.5px surface.border
border-radius: md
padding: 10px 12px
value: 20px/500/-0.5px — colour by meaning (teal=hire, amber=maybe, ghost=pass, primary=total)
label: 10px/400, text.dim
grid: repeat(4, 1fr), gap 6px
```

### Candidate card (app)

```
background: surface.mid
border: 0.5px surface.border
border-radius: md
padding: 12px 14px
hover: border-color surface.borderFocus
layout: flex, gap 12px

score ring:
  size: 44×44px
  track: surface.border, stroke-width 3
  fill: verdict colour (teal/amber/ghost), stroke-linecap round
  number: 11px/500, text.secondary (pass: text.ghost)
  rotation: -90deg (starts top)

candidate name: 13px/500/-0.2px, text.secondary (pass: text.dim)
badge: 9px/500, border-radius sm (3px)
  hire: bg brand.dim, text brand
  maybe: bg amber.dim, text amber
  pass: bg surface.high, text text.ghost
role line: 10px/400, text.dim

criteria bars:
  layout: flex, gap 3px per row
  label: 9px, text.ghost, width 90px, overflow ellipsis
  track: flex 1, height 2px, surface.border bg
  fill: 2px, border-radius 1px, colour by score (≥7 teal, 4–6 amber, <4 ghost)
  score: 9px, text.ghost, width 16px, text-right
```

### Buttons

```
primary: brand bg, brand.light text, 13px/500, padding 10px 20px (landing) / 6px 12px (app), border-radius md
ghost/secondary: transparent bg, text.muted, no border, 13px
outline: surface.border border, text.secondary, surface.hover on hover
```

### Badges / pills

```
border-radius: sm (3px)
font: 9–10px/500
hire: bg brand.dim (#0a1f1d), text brand (#0d9488)
maybe: bg amber.dim (#1f1400), text amber (#d97706)
pass: bg surface.high (#111), text text.ghost (#2a2a2a)
role pill (navbar): 10px, text.muted, surface.high bg, surface.border border, border-radius sm
```

### Divider label (landing → app bridge)

```
layout: flex, align-items center, gap 16px
padding: 16px 28px
border-top + border-bottom: 0.5px surface.borderHigh
text: overline scale, text.ghost, uppercase
lines: flex 1, height 0.5px, surface.borderHigh bg
```

### Section labels (app)

```
font: 9px/500, text.ghost, letter-spacing 0.1em, uppercase
margin-bottom: 8px
```

---

## Verdict colour system

Used consistently across rings, bars, badges, and metric values.

| Verdict | Colour | Hex | When |
|---|---|---|---|
| Hire | Teal | `#0d9488` | Score ≥ 7.0 |
| Maybe | Amber | `#d97706` | Score 4.0–6.9 |
| Pass | Ghost | `#2a2a2a` | Score < 4.0 |

Bar fill colour rule:
- Score ≥ 7: `#0d9488` (teal)
- Score 4–6: `#d97706` (amber)
- Score < 4: `#1f1f1f` (ghost)

---

## Animation / motion

Minimal. Only where it adds functional clarity.

```
transition: all 150ms ease   — card hover border colour
transition: width 300ms ease — bar fill on load (optional)
```

No entrance animations, no page transitions, no bouncy effects.

---

## Do not

- Use any font weight other than 400 or 500
- Use `box-shadow` anywhere in the app
- Use `1px` borders — always `0.5px`
- Mix border-radius values — stick to sm (3px) for badges, md (5px) for everything else
- Use colour for decoration — only for meaning (teal=positive/active, amber=warning, ghost=inactive)
- Add gradients, glows, or blur effects
- Use white or light backgrounds in the app shell — surfaces are dark only
- Use the amber accent for anything other than maybe/warning states
- Introduce a second accent colour

---

## Tailwind config extension (full)

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#0d9488',
          light: '#ccfbf1',
          dim: '#0a1f1d',
          hover: '#0f766e',
        },
        warn: {
          DEFAULT: '#d97706',
          dim: '#1f1400',
        },
        surface: {
          base: '#080808',
          low: '#0a0a0a',
          mid: '#0d0d0d',
          high: '#111111',
          hover: '#141414',
          border: '#161616',
          borderHigh: '#1c1c1c',
          borderFocus: '#222222',
        },
        ink: {
          primary: '#f0f0f0',
          secondary: '#e0e0e0',
          muted: '#444444',
          dim: '#2a2a2a',
          ghost: '#1f1f1f',
        },
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '5px',
        md: '5px',
        lg: '8px',
      },
      borderWidth: {
        DEFAULT: '0.5px',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4', letterSpacing: '0' }],
        xs: ['11px', { lineHeight: '1.4', letterSpacing: '0' }],
        sm: ['12px', { lineHeight: '1.5', letterSpacing: '0' }],
        base: ['13px', { lineHeight: '1.6', letterSpacing: '-0.2px' }],
        md: ['14px', { lineHeight: '1.6', letterSpacing: '-0.2px' }],
        lg: ['15px', { lineHeight: '1.4', letterSpacing: '-0.3px' }],
        xl: ['18px', { lineHeight: '1.3', letterSpacing: '-0.4px' }],
        '2xl': ['22px', { lineHeight: '1.2', letterSpacing: '-0.6px' }],
        '3xl': ['32px', { lineHeight: '1.1', letterSpacing: '-1px' }],
        display: ['52px', { lineHeight: '1.0', letterSpacing: '-2px' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## File location

Drop this file at the project root as `PRIMITIVES.md`.

When starting a new UI session with your code assistant, paste the relevant component spec from this file alongside your task. Example:

```
Using PRIMITIVES.md as the design spec, rework CandidateCard.tsx.
The card should follow the candidate card spec exactly:
- surface.mid background, surface.border border, md border-radius
- 44px score ring with teal/amber/ghost fill based on verdict
- 9px/500 badge with correct bg/text per verdict
- criteria bars: 2px track, fill colour by score threshold
```
