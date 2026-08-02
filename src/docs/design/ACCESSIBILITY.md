# ACCESSIBILITY.md

> Version: 2.0
>
> Purpose
>
> Define accessibility standards for every page, component, and interaction.
>
> Accessibility is a core product requirement—not an afterthought.
>
> Every feature should be usable by everyone.

---

# Philosophy

Accessibility improves usability.

Accessible software is:

✓ Easier to navigate

✓ Easier to understand

✓ Easier to maintain

✓ Better for SEO

✓ Better for all users

Accessibility should be considered during design,
not after development.

---

# Standards

Target Standard

WCAG 2.2 AA

Minimum Lighthouse

Accessibility

100

Never intentionally violate accessibility guidelines.

---

# Core Principles

Perceivable

Operable

Understandable

Robust

Every component must satisfy these four principles.

---

# Semantic HTML

Always use semantic elements.

Use

<header>

<nav>

<main>

<section>

<article>

<aside>

<footer>

<button>

<label>

<form>

Do not replace semantic elements with divs.

---

# Headings

Only one

<h1>

per page.

Use headings in order.

Correct

h1

↓

h2

↓

h3

Avoid skipping heading levels.

---

# Images

Every image requires alt text.

Decorative images

alt=""

Project screenshots

Describe the screen.

Example

"Kitchen dashboard showing weekly meal planner."

Never use

image1

photo

screenshot

---

# Color Contrast

Minimum

WCAG AA

Body text

4.5:1

Large text

3:1

Never rely on color alone.

---

# Keyboard Navigation

Every interactive element must be keyboard accessible.

Tab

Move forward

Shift + Tab

Move backward

Enter

Activate

Space

Buttons

Escape

Close modal

Arrow keys

Menus where applicable

---

# Focus States

Every interactive component requires a visible focus state.

Use

2px outline

Brand focus color

Never remove outlines without replacement.

---

# Forms

Every input requires

Label

Placeholder (optional)

Helper text (optional)

Error message

Never rely on placeholder as the label.

---

# Error Messages

Must explain

What happened

Why

How to fix it

Bad

Invalid input.

Good

Please enter a valid email address.

---

# Buttons

Every button should have

Accessible name

Correct type

Visible focus

Disabled state

Loading state

Avoid icon-only buttons unless labeled.

---

# Links

Links should describe destination.

Bad

Click here

Read more

Good

View case study

Download Resume

---

# Icons

Decorative icons

aria-hidden="true"

Interactive icons

Accessible label required.

Example

aria-label="Open GitHub Repository"

---

# Navigation

Provide

Skip to Content

Keyboard navigation

Current page indication

Logical order

---

# Modals

Focus moves into modal.

Escape closes modal.

Focus returns to trigger.

Background should not be keyboard accessible.

---

# Tooltips

Tooltip content must be available to keyboard users.

Do not rely on hover.

---

# Dropdowns

Keyboard support

Arrow navigation

Escape closes

Enter selects

Tab exits

---

# Tables

Use

<thead>

<tbody>

<th>

Scope attributes

Avoid tables for layout.

---

# Lists

Use

<ul>

<ol>

When content is actually a list.

---

# Animations

Respect

prefers-reduced-motion

Disable

Parallax

Large transitions

Continuous animation

Keep essential transitions only.

---

# Motion

Animation should never cause

Dizziness

Distraction

Loss of focus

---

# Audio

No autoplay.

Provide controls.

Mute by default.

---

# Video

Captions

Poster image

Keyboard controls

Pause button

---

# Responsive Accessibility

Touch targets

Minimum

44px × 44px

Spacing between targets

Minimum

8px

---

# Reading

Maximum line width

75 characters

Body text

Minimum

16px

Avoid justified text.

---

# Language

Set

lang="en"

Use correct language for multilingual pages.

---

# Screen Readers

Use

aria-label

aria-labelledby

aria-describedby

only when semantic HTML is insufficient.

Avoid unnecessary ARIA.

Rule

Native HTML first.

ARIA second.

---

# Loading

Skeletons should be announced appropriately.

Avoid endless loading.

Provide progress when possible.

---

# Errors

Do not trap users.

Explain errors clearly.

Allow recovery.

---

# Empty States

Every empty state should explain

What happened

Why

What to do next

---

# Notifications

Use

aria-live

for

Success

Error

Status updates

Avoid interrupting screen readers unnecessarily.

---

# Search

Input should have

Accessible label

Clear button

Keyboard support

---

# Pagination

Announce

Current page

Previous

Next

Total pages

---

# Cards

Entire card should not always be clickable.

Primary action should be obvious.

---

# Project Screenshots

Provide descriptive captions.

Avoid image-only explanations.

---

# Code Blocks

Use monospace font.

Provide copy button.

Label programming language.

---

# Contact Form

Every field

Required indicator

Error message

Validation

Accessible labels

Keyboard support

---

# Theme Support

Dark Mode

Light Mode

Both must maintain contrast.

Never sacrifice readability for aesthetics.

---

# Accessibility Testing

Test with

Keyboard only

↓

Screen reader

↓

High contrast mode

↓

Zoom to 200%

↓

Reduced motion

↓

Mobile

↓

Desktop

---

# Lighthouse Goals

Accessibility

100

---

# Manual Checklist

✓ Keyboard only navigation

✓ Focus visible

✓ Screen reader friendly

✓ Proper headings

✓ Semantic HTML

✓ Labels

✓ Alt text

✓ Contrast

✓ Reduced motion

✓ Responsive

✓ Touch targets

✓ Skip links

✓ Accessible forms

---

# Things To Avoid

❌ Clickable divs

❌ Missing labels

❌ Missing alt text

❌ Tiny buttons

❌ Placeholder-only inputs

❌ Removing focus outlines

❌ Color-only indicators

❌ Auto-playing media

❌ Infinite animations

❌ Keyboard traps

---

# Accessibility Motto

Accessibility is not a feature.

It is a fundamental quality of good software.