# TOKENS.md

> Version: 2.0
> Purpose: Define every design token used throughout the portfolio.
>
> This file is the single source of truth for colors, typography,
> spacing, shadows, borders, animations, and responsive values.
>
> Components must NEVER use hardcoded values.

---

# Design Token Philosophy

Design tokens provide consistency across the application.

Instead of writing

background: #09090B;

Use

bg.canvas

Instead of

padding: 32px;

Use

space.8

Instead of

border-radius: 20px;

Use

radius.lg

Every visual property should reference a semantic token.

---

# Color Tokens

## Background

bg.canvas

Description:
Main page background.

Value:
#09090B

Usage:

- Body
- Main Layout
- Fullscreen Sections

---

bg.surface

Description:
Default surface for cards.

Value:
#111216

Usage:

- Cards
- Navbar
- Footer
- Panels

---

bg.elevated

Description:
Elevated containers.

Value:
#17181D

Usage:

- Dropdown
- Modal
- Popover

---

bg.hover

Description:
Hover state.

Value:
#1E2128

---

bg.selected

Description:
Selected state.

Value:
#242833

---

bg.overlay

Description:
Modal overlay.

Value:

rgba(0,0,0,.60)

---

# Brand

brand.primary

#4F46E5

Purpose

Primary CTA

---

brand.hover

#6366F1

Purpose

Hover state

---

brand.active

#4338CA

Purpose

Pressed state

---

brand.soft

rgba(79,70,229,.12)

Purpose

Selected backgrounds

---

brand.border

rgba(79,70,229,.25)

Purpose

Focus borders

---

brand.glow

rgba(79,70,229,.15)

Purpose

Very subtle highlight

Never use as shadow.

---

# Text

text.primary

#F8FAFC

Highest emphasis.

---

text.secondary

#CBD5E1

Paragraphs.

---

text.tertiary

#94A3B8

Descriptions.

---

text.disabled

#64748B

Disabled content.

---

text.inverse

#09090B

Used on white surfaces.

---

# Border

border.default

#252932

---

border.hover

#343A46

---

border.focus

#4F46E5

---

border.subtle

rgba(255,255,255,.06)

---

# Semantic Colors

success

#10B981

warning

#F59E0B

danger

#EF4444

info

#3B82F6

---

# Typography

## Font Families

Primary

Inter

Fallback

system-ui

Monospace

JetBrains Mono

---

# Font Sizes

xs

12

sm

14

base

16

lg

18

xl

20

2xl

24

3xl

30

4xl

36

5xl

48

6xl

64

---

# Font Weight

regular

400

medium

500

semibold

600

bold

700

---

# Letter Spacing

tight

-2%

normal

0%

wide

2%

---

# Line Height

heading

110%

body

160%

dense

140%

---

# Spacing Scale

space.0 = 0

space.1 = 4px

space.2 = 8px

space.3 = 12px

space.4 = 16px

space.5 = 20px

space.6 = 24px

space.7 = 32px

space.8 = 40px

space.9 = 48px

space.10 = 64px

space.11 = 80px

space.12 = 96px

space.13 = 128px

Never invent spacing values.

---

# Radius

none

0

xs

4

sm

8

md

12

lg

18

xl

24

full

9999

---

# Shadows

shadow.sm

0 2px 8px rgba(0,0,0,.15)

---

shadow.md

0 8px 20px rgba(0,0,0,.22)

---

shadow.lg

0 12px 40px rgba(0,0,0,.30)

---

shadow.glow

0 0 30px rgba(79,70,229,.08)

Use sparingly.

---

# Blur

none

0

sm

4px

md

8px

lg

16px

Avoid large blur values.

---

# Opacity

disabled

0.45

muted

0.70

overlay

0.90

---

# Animation

fast

150ms

normal

250ms

slow

400ms

---

# Easing

standard

ease

out

ease-out

inOut

ease-in-out

Never use bounce.

Never use elastic.

---

# Z Index

base

0

dropdown

100

sticky

200

navbar

300

overlay

400

modal

500

toast

600

tooltip

700

---

# Responsive Breakpoints

mobile

0

tablet

768

desktop

1024

wide

1280

ultrawide

1536

---

# Container Width

default

1280px

wide

1440px

reading

720px

---

# Grid

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

Gap

24px

---

# Motion Tokens

hover.scale

1.02

card.lift

-4px

image.zoom

1.03

button.press

0.98

---

# Rules

✓ Always use semantic tokens.

✓ Never hardcode values.

✓ Every new component must consume tokens.

✓ Maintain consistent spacing.

✓ Maintain visual rhythm.

✓ One token change should update the entire application.

---

# Motto

A component should never know its colors.

A component should only know its role.