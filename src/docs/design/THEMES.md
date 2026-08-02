# THEMES.md

> Version: 2.0
>
> Purpose
>
> Define the complete theme architecture of the portfolio.
>
> Components should never know actual colors.
>
> Components consume semantic tokens.
> Themes provide actual values.
>
> Swapping themes should require changing only token mappings.

---

# Theme Philosophy

Themes change appearance.

They do NOT change

• Layout

• Typography

• Component behavior

• Accessibility

• Motion

Only visual values change.

---

# Core Principles

✓ Semantic Tokens

✓ Theme Driven

✓ Accessible

✓ Scalable

✓ Predictable

Never hardcode colors inside components.

---

# Theme Architecture

Application

↓

Components

↓

Semantic Tokens

↓

Theme

↓

Actual Color Values

Components should never know

#4F46E5

They only know

brand.primary

---

# Theme Structure

themes/

dark.ts

light.ts

high-contrast.ts

future.ts

Each theme exports the same token names.

Never remove tokens.

Never rename tokens.

---

# Semantic Token Categories

Background

Text

Border

Brand

Status

Surface

Overlay

Shadow

Chart

Syntax Highlight

Scrollbar

Selection

Focus

---

# Background Tokens

bg.canvas

bg.surface

bg.elevated

bg.hover

bg.selected

bg.overlay

---

# Text Tokens

text.primary

text.secondary

text.tertiary

text.disabled

text.inverse

---

# Border Tokens

border.default

border.subtle

border.hover

border.focus

---

# Brand Tokens

brand.primary

brand.hover

brand.active

brand.soft

brand.border

brand.glow

---

# Status Tokens

success

warning

danger

info

---

# Shadow Tokens

shadow.sm

shadow.md

shadow.lg

shadow.glow

---

# Focus Tokens

focus.ring

focus.background

focus.border

---

# Selection

selection.background

selection.text

---

# Scrollbar

scrollbar.track

scrollbar.thumb

scrollbar.hover

---

# Syntax Highlight

code.keyword

code.string

code.number

code.function

code.variable

code.comment

---

# Default Theme

Dark

Primary Theme

This is the portfolio's default appearance.

Characteristics

Minimal

Professional

Engineering Focused

Graphite Background

Single Brand Color

Low Visual Noise

---

# Dark Theme

Mood

Focused

Professional

Premium

Editor Inspired

Used

90% of the time

---

Characteristics

Graphite backgrounds

Soft borders

Low contrast surfaces

Bright typography

Minimal glow

---

# Light Theme

Mood

Editorial

Clean

Technical

Documentation Inspired

Characteristics

White canvas

Subtle gray surfaces

Dark typography

Minimal shadows

No harsh contrast

---

# High Contrast Theme

Purpose

Accessibility

Higher visibility

Greater contrast

Reduced visual ambiguity

Must satisfy WCAG AAA whenever possible.

---

# Future Themes

Possible additions

Midnight Blue

Forest

Terminal

Monochrome

Do NOT add themes for aesthetics alone.

Every theme must improve usability.

---

# Theme Switching

Supported

Dark

↓

Light

↓

System

High Contrast (Future)

---

Behavior

Persist user preference.

Fallback

System Preference

---

Transition

Maximum

200ms

Animate

Background

Text

Border

Avoid animating layout.

---

# Theme Detection

Priority

Saved Preference

↓

System Preference

↓

Dark Theme

---

# Component Example

Wrong

Button

↓

background

#4F46E5

Correct

Button

↓

background

brand.primary

---

# Card Example

Wrong

background

#111216

Correct

background

bg.surface

---

# Border Example

Wrong

border

#252932

Correct

border.default

---

# Hover Example

Wrong

background

#1A1A1A

Correct

bg.hover

---

# Benefits

One token update

↓

Entire application updates.

One theme

↓

Entire application changes.

No component modification required.

---

# CSS Variables

Every semantic token should map to CSS variables.

Example

--bg-canvas

--bg-surface

--text-primary

--border-default

--brand-primary

Components consume CSS variables.

---

# Token Mapping Example

Dark Theme

bg.canvas

↓

#09090B

Light Theme

bg.canvas

↓

#FFFFFF

Components never change.

---

# Theme Validation

Every theme must satisfy

AA Contrast

↓

Readable Typography

↓

Consistent Borders

↓

Visible Focus

↓

Accessible Forms

↓

Accessible Navigation

---

# Theme Testing

Test

Desktop

Tablet

Mobile

Dark

Light

Keyboard

Reduced Motion

Screen Reader

High Contrast

---

# Theme Rules

✓ One source of truth

✓ Semantic tokens only

✓ No component overrides

✓ Accessible colors

✓ Consistent hierarchy

✓ Predictable mapping

---

# Future Expansion

The architecture should support

Brand Themes

Seasonal Themes

Client Themes

White-label Products

Without changing component code.

---

# Things To Avoid

❌ Hardcoded colors

❌ Component-specific themes

❌ Random color overrides

❌ Inconsistent token names

❌ Duplicate semantic tokens

❌ Multiple brand colors

❌ Gradient-heavy themes

❌ Low contrast palettes

---

# Example Theme Object

Theme

↓

Background

↓

Text

↓

Border

↓

Brand

↓

Status

↓

Shadow

↓

Focus

↓

Scrollbar

↓

Selection

Everything follows this hierarchy.

---

# Theme Checklist

✓ Uses semantic tokens

✓ Accessible

✓ Responsive

✓ No hardcoded colors

✓ Token complete

✓ Supports dark mode

✓ Supports light mode

✓ Easily extendable

---

# Theme Motto

Components define behavior.

Themes define appearance.

Never mix the two.