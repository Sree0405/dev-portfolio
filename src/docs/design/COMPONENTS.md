# COMPONENTS.md

> Version: 2.0
> Purpose:
>
> Define every reusable UI component.
>
> Every component must be predictable, accessible, scalable, and consume design tokens.
>
> Components are product building blocks—not decorative elements.

---

# Design Philosophy

Every component must answer three questions.

1. What problem does it solve?
2. When should it be used?
3. What should it never do?

If those cannot be answered,
the component should not exist.

---

# Component Rules

✓ Reusable

✓ Token Based

✓ Accessible

✓ Responsive

✓ Keyboard Navigable

✓ Minimal Variants

✓ Predictable

Never create a component for a single page.

---

# BUTTON

Purpose

Primary user action.

Examples

View Project

Download Resume

Contact

---

Variants

Primary

Secondary

Ghost

Danger

Icon

Link

Only one Primary button should exist inside any viewport.

---

Sizes

Small

Medium

Large

---

Structure

Icon (optional)

↓

Label

↓

Arrow (optional)

---

Padding

Uses spacing tokens.

Never hardcode.

---

Radius

radius.md

---

States

Default

Hover

Pressed

Focused

Disabled

Loading

---

Hover

Increase elevation.

Do NOT change size dramatically.

---

Loading

Replace text with spinner.

Width must remain constant.

---

Never

❌ Gradient Button

❌ Glow Button

❌ Neon

❌ Heavy Shadow

---

# CARD

Purpose

Group related content.

Cards should improve readability.

Not decorate.

---

Variants

Default

Elevated

Interactive

Outline

---

Structure

Padding

↓

Content

↓

Footer (optional)

---

Hover

Border slightly brighter.

Shadow increases slightly.

Translate Y -4px.

No rotation.

---

Radius

radius.lg

---

Never

Glassmorphism

Backdrop Blur

Strong Glow

Animated Borders

---

# BADGE

Purpose

Small metadata.

Examples

React

Next.js

TypeScript

Open Source

Production

---

Variants

Neutral

Brand

Success

Warning

Danger

---

Height

28px

---

Padding

Horizontal only.

---

Never

Huge badges.

Rainbow badges.

---

# NAVBAR

Purpose

Primary navigation.

---

Height

72px

---

Contains

Logo

Navigation

CTA

Theme Switch (future)

---

Behavior

Sticky

Background appears after scroll.

Subtle blur OR surface color.

Not both.

---

Never

Huge shadows.

Floating animations.

---

# SECTION

Purpose

Logical grouping.

Every page consists of sections.

---

Structure

Eyebrow

↓

Heading

↓

Description

↓

Content

---

Spacing

Top

space.13

Bottom

space.13

---

Never

Different spacing for every section.

---

# HERO

Purpose

Introduce yourself.

Create curiosity.

Guide users.

---

Contains

Headline

↓

Supporting Text

↓

Primary CTA

↓

Secondary CTA

↓

Hero Image OR Visual

---

Should NOT contain

8 buttons

10 badges

Large feature grids

Random decorations

---

The visitor should understand

Who are you?

↓

What do you build?

↓

Why should they continue scrolling?

within five seconds.

---

# PROJECT CARD

Most important component.

Treat every project like a SaaS product.

---

Structure

Screenshot

↓

Project Name

↓

One-line Summary

↓

Problem

↓

Solution

↓

Impact

↓

Technology

↓

Actions

---

Impact Examples

Reduced API latency by 45%

Used by 10K users

Realtime synchronization

Multi-tenant architecture

---

Avoid

Lorem ipsum descriptions.

Generic marketing text.

---

Hover

Image slightly zooms.

Card lifts.

Buttons fade in.

---

# EXPERIENCE CARD

Purpose

Timeline entry.

---

Structure

Company

↓

Role

↓

Duration

↓

Achievements

↓

Technologies

---

Achievements should always be measurable.

---

# SKILL CHIP

Purpose

Technology metadata.

---

Maximum width

Content based.

---

No colorful icons.

---

Use

Neutral background.

---

# INPUT

Purpose

Collect user information.

---

States

Default

Focused

Error

Disabled

Success

---

Height

48px

---

Radius

radius.md

---

Focus

Border changes.

No glowing outline.

---

# TEXTAREA

Minimum Height

160px

Resizable vertically.

---

# AVATAR

Purpose

Profile image.

---

Radius

Full

---

Fallback

Initials.

---

# DIVIDER

Purpose

Separate content.

---

Height

1px

Uses border.subtle.

Never use decorative lines.

---

# MODAL

Purpose

Temporary interaction.

---

Contains

Header

↓

Body

↓

Footer

---

Width

Responsive

---

Animation

Fade

Scale 0.98 → 1

---

Never slide from random directions.

---

# TOOLTIP

Delay

300ms

Maximum width

240px

---

# ICON

Library

Lucide

---

Stroke

1.75

---

Never mix icon styles.

---

# FOOTER

Contains

Logo

↓

Navigation

↓

Social Links

↓

Copyright

---

Should feel quiet.

Not another hero.

---

# EMPTY STATE

Contains

Simple Illustration (optional)

↓

Title

↓

Description

↓

Action

---

Never

Huge illustrations.

Funny mascots.

---

# LOADER

Prefer

Skeleton

instead of spinner.

Use spinner only for

Button

Initial App Load

Authentication

---

# LINK

Underline on hover.

Accessible focus state.

No flashy animation.

---

# IMAGE

Rounded corners.

Lazy loaded.

High quality.

Never stretch.

---

# CODE BLOCK

Use

JetBrains Mono

---

Provide

Copy Button

Language Label

---

# RESPONSIVE RULES

Desktop

12 columns

Tablet

8 columns

Mobile

4 columns

---

Components should resize.

Not disappear.

---

# Accessibility Checklist

✓ Keyboard Navigation

✓ Focus Ring

✓ Screen Reader Labels

✓ AA Contrast

✓ Reduced Motion

✓ Semantic HTML

✓ Correct Button Types

---

# Performance Rules

No unnecessary rerenders.

Lazy load heavy components.

Memoize expensive lists.

Optimize images.

Avoid large animations.

---

# Golden Rule

Every component should feel like it belongs to the same product.

If a component looks unique,
it probably violates the design system.