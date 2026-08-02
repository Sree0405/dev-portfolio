# MOTION.md

> Version: 2.0
>
> Purpose:
>
> Define every animation, transition, and interaction used throughout
> the portfolio.
>
> Motion should improve usability—not attract unnecessary attention.

---

# Motion Philosophy

Motion should answer one question:

"What changed?"

If an animation doesn't communicate a change of state,
it probably shouldn't exist.

Animation exists to:

✓ Guide attention

✓ Confirm interactions

✓ Improve hierarchy

✓ Increase perceived quality

Never animate simply because something can move.

---

# Design Principles

Motion should feel:

Calm

Natural

Responsive

Purposeful

Elegant

Confident

Invisible

---

Avoid

Playful

Bouncy

Elastic

Floating

Flashy

Over-animated

---

# Motion Language

The website should feel like

A premium desktop application

Not

A marketing landing page.

---

# Timing

Fast

150ms

Use for

Hover

Buttons

Icons

Links

---

Normal

250ms

Use for

Cards

Dropdowns

Tooltips

Navigation

---

Slow

400ms

Use for

Page transitions

Hero reveals

Section transitions

---

Never exceed

600ms

Anything longer feels slow.

---

# Easing

Standard

ease

Default interactions.

---

Ease Out

ease-out

Elements entering.

---

Ease In Out

ease-in-out

Complex transitions.

---

Never use

Bounce

Elastic

Back

Spring overshoot

Rubber band

---

# Hover Animations

Hover should communicate

"This element is interactive."

Allowed

Opacity

Elevation

Border

Background

Tiny Scale

Forbidden

Rotation

Bounce

Infinite motion

---

# Buttons

Hover

Elevation increases

Background changes

Scale

1.02

---

Pressed

Scale

0.98

Duration

100ms

---

Loading

Spinner replaces icon.

Button width never changes.

---

# Cards

Hover

Lift

-4px

Shadow

Increase slightly

Border

Slightly brighter

Duration

250ms

Never rotate cards.

---

# Images

Hover

Zoom

1.03

Duration

400ms

Transform Origin

Center

No aggressive zoom.

---

# Links

Hover

Underline grows left to right.

Text color changes.

Duration

150ms

---

# Navigation

Active link

Animated indicator.

Hover

Subtle color transition.

Navbar

Background appears after scrolling.

Avoid large navbar animations.

---

# Hero

Hero should appear once.

Animation

Fade

+

TranslateY

12px

Duration

400ms

Delay

Stagger children

60ms

Never animate forever.

---

# Section Reveal

Trigger

When section enters viewport.

Animation

Opacity

0 → 1

TranslateY

24px → 0

Duration

500ms

Threshold

20%

Animate only once.

---

# Stagger

Use only for

Project Cards

Skill Cards

Timeline

Maximum Delay

60ms

Never create long cascading animations.

---

# Modal

Open

Fade

Scale

0.98 → 1

Duration

250ms

Close

Reverse.

---

# Tooltip

Fade

+

TranslateY

4px

Duration

150ms

---

# Dropdown

Fade

+

TranslateY

8px

Duration

200ms

---

# Mobile Menu

Slide

Right

or

Top

Duration

250ms

Overlay

Fade

Never bounce.

---

# Accordion

Height animation

+

Opacity

Duration

250ms

Avoid complicated transforms.

---

# Project Cards

Hover

Screenshot zoom

↓

Card lift

↓

CTA fades in

↓

Border brightens

Everything happens together.

No sequential delays.

---

# Timeline

Reveal

Fade

TranslateY

Line grows vertically.

Keep it subtle.

---

# Skills

Hover

Background

Border

Icon

Nothing else.

Never spin icons.

---

# Cursor

Use default cursor.

Pointer only for interactive elements.

Avoid custom cursors.

---

# Scroll

Smooth scrolling

Yes

Scroll hijacking

Never

Horizontal scrolling

Never

Parallax

Very limited

Maximum

8px

---

# Background Motion

Background should remain static.

Allowed

Very subtle gradient movement

Optional

Very slow

30s+

Forbidden

Floating blobs

Particles

Moving grids

Rotating meshes

Infinite object movement

Animated noise

---

# Skeleton Loading

Preferred over spinner.

Fade

Opacity

1 → .6

Duration

1200ms

Infinite

Ease-in-out

---

# Progress Indicators

Linear

Smooth

Never jump suddenly.

---

# Focus States

Keyboard focus

Immediate.

No animation delay.

Accessibility is more important.

---

# Theme Transition

Duration

200ms

Animate

Background

Text

Border

Do not animate layout.

---

# Page Transition

Old Page

Fade Out

↓

New Page

Fade In

↓

Content

Stagger

Avoid large slide transitions.

---

# Scroll Indicator

Optional.

Thin progress bar.

Top of page.

Brand color.

Height

2px

---

# Performance Rules

Use

transform

opacity

Avoid animating

height

width

top

left

margin

box-shadow continuously

Prefer GPU accelerated animations.

---

# Reduced Motion

Respect

prefers-reduced-motion

Disable

Section reveal

Hero animations

Parallax

Large transitions

Keep only essential state changes.

---

# Animation Checklist

✓ Fast

✓ Predictable

✓ Purposeful

✓ GPU Friendly

✓ Accessible

✓ Consistent

✓ Doesn't distract

---

# Never Use

❌ Floating circles

❌ Constant bouncing

❌ Infinite glowing

❌ Spinning logos

❌ Animated gradients everywhere

❌ Rotating cubes

❌ Elastic menus

❌ Scroll hijacking

❌ Confetti effects

❌ Cursor trails

❌ Mouse follower blobs

❌ Fake 3D effects

---

# Premium Motion Examples

Button

Hover → Elevation

Press → Scale 0.98

Card

Hover → Lift 4px

Image

Hover → Zoom 1.03

Section

Fade + TranslateY

Navigation

Smooth active indicator

Modal

Fade + Scale

Nothing more.

---

# Motion Motto

If the user notices the animation before the content,

the animation is too strong.