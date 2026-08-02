# PERFORMANCE.md

> Version: 2.0
>
> Purpose
>
> Define engineering standards for performance,
> scalability, maintainability, and user experience.
>
> Performance is a feature.
> Every component should be built with performance in mind.

---

# Philosophy

Users notice slow software.

They rarely notice perfect animations.

Performance should always be prioritized over visual effects.

Good engineering is invisible.

---

# Performance Goals

The portfolio should feel

✓ Instant

✓ Responsive

✓ Lightweight

✓ Native

✓ Smooth

Every interaction should feel intentional.

---

# Success Metrics

## Lighthouse

Performance

100

Accessibility

100

Best Practices

100

SEO

100

---

Core Web Vitals

LCP

< 2.0s

CLS

0

INP

< 150ms

TTFB

< 300ms

FCP

< 1s

---

# JavaScript Budget

Initial JS

< 150KB (gzipped)

Preferred

< 100KB

Never ship unnecessary JavaScript.

---

# CSS Budget

Initial CSS

< 40KB

Unused CSS

0%

Prefer utility classes.

Avoid duplicate styles.

---

# Image Budget

Hero Image

< 250KB

Project Screenshot

< 400KB

Icons

SVG

Avatars

WebP

Never use PNG unless transparency is required.

---

# Font Loading

Maximum

2 font families

Maximum

4 font files

Use

font-display: swap

Preload critical fonts.

---

# Rendering Strategy

Prefer

Static Rendering

↓

Server Rendering

↓

Streaming

↓

Client Rendering

Hydrate only interactive components.

---

# Component Rendering Rules

Every component should answer

Can this be static?

If yes,

don't hydrate it.

---

Memoization

Use only when profiling proves benefit.

Avoid premature optimization.

---

# React Guidelines

Prefer

Server Components (where applicable)

↓

Memoized Components

↓

Client Components

Avoid unnecessary state.

Keep state local.

---

# State Management

Local State

↓

Context

↓

Redux / Zustand

↓

Server State

Use the simplest solution first.

---

# Data Fetching

Parallel fetches whenever possible.

Avoid waterfalls.

Cache aggressively.

Deduplicate requests.

Retry intelligently.

---

# API Strategy

Batch requests.

Paginate large datasets.

Use cursor pagination when appropriate.

Avoid fetching unused fields.

Support optimistic updates.

---

# Lists

Virtualize

100+ items

Infinite scroll

When content is continuous

Pagination

When users search

Avoid rendering thousands of DOM nodes.

---

# Images

Lazy load below the fold.

Responsive sizes.

Use srcset.

Preload hero image.

Use blur placeholder.

Avoid layout shift.

---

# Icons

SVG only.

No icon font.

Tree shake icon libraries.

Import individual icons.

---

# Animations

Animate only

transform

opacity

Never animate

width

height

left

top

margin

border-radius continuously

GPU acceleration only.

---

# Bundle Strategy

Split by route.

Split heavy libraries.

Lazy load

Charts

Maps

Editors

Code blocks

Large galleries

Never load everything initially.

---

# Caching

Browser Cache

Static Assets

1 year

API

Appropriate cache headers

Images

Immutable

---

# Code Splitting

Lazy load

Projects

Blog

Analytics

Contact Form

Heavy animations

Charts

Documentation

---

# Dependencies

Every dependency must justify its existence.

Ask

Can we write this ourselves?

Is it maintained?

Tree-shakeable?

Bundle size?

License?

---

# Accessibility Performance

Never sacrifice accessibility for speed.

Semantic HTML first.

Keyboard support.

Reduced motion.

Screen reader support.

---

# Mobile Performance

Design mobile-first.

Touch targets

Minimum 44px

Avoid heavy animations.

Minimize network requests.

Test on low-end devices.

---

# Network

Minimize requests.

Compress assets.

Enable Brotli.

Use HTTP/2 or HTTP/3.

Preconnect external domains.

---

# SEO Performance

Metadata

Structured Data

OpenGraph

Twitter Cards

Canonical URLs

XML Sitemap

Robots.txt

---

# Security Performance

Avoid exposing secrets.

Sanitize user input.

Use CSP.

Use HTTPS.

Secure headers.

---

# Error Handling

Graceful fallbacks.

Retry failed requests.

Skeleton loading.

Meaningful error messages.

No blank screens.

---

# Loading Strategy

Preferred

Skeleton

↓

Progressive rendering

↓

Optimistic UI

Avoid spinners whenever possible.

---

# Code Quality

Strict TypeScript.

ESLint.

Prettier.

No console.log in production.

Dead code removed.

Tree shaking enabled.

---

# Monitoring

Measure

Lighthouse

Core Web Vitals

Bundle Size

Render Time

Hydration Time

Interaction Latency

Track regressions.

---

# Performance Checklist

✓ Images optimized

✓ Fonts optimized

✓ Code split

✓ Lazy loaded

✓ Memoized when necessary

✓ Measure Lighthouse regularly; treat 100 as a target, not a claim

✓ No layout shift

✓ Minimal JS

✓ Responsive

✓ Accessible

---

# Things To Avoid

❌ Large dependencies

❌ Unoptimized images

❌ Full-page re-renders

❌ Nested providers

❌ Heavy client-side rendering

❌ Blocking scripts

❌ Infinite animations

❌ Massive bundles

❌ Duplicate API requests

❌ Render loops

---

# Engineering Standards

Every feature should answer

Can it be faster?

Can it be simpler?

Can it be more maintainable?

Can it reduce bundle size?

Can it improve UX?

---

# Performance Motto

Fast software feels professional.

Performance is not optimization.

Performance is part of the design.