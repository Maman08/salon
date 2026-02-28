# Unique Vibe Grenix — Project Instructions

## Overview
This is a luxury beauty e-commerce frontend for **Unique Vibe Grenix** salon. Built with Next.js 15, Three.js, Framer Motion, and Tailwind CSS.

## Design System
- **Theme**: Dark luxury (background: `#0a0a0a`, text: `#f5f0eb`)
- **Primary colors**: Gold (`#c9a96e`), Rose (`#d4a0a0`)
- **Fonts**: Playfair Display (serif headings), Inter (body)
- **Style**: Glass morphism, gradient borders, subtle animations

## Architecture
- `src/app/` — Pages using Next.js App Router
- `src/components/` — Reusable components organized by feature
- `src/data/` — Mock product data (no backend yet)
- All components are client-side (`"use client"`)

## Key Libraries
- `framer-motion` for animations
- `@react-three/fiber` + `@react-three/drei` for 3D
- `lenis` for smooth scrolling
- `lucide-react` for icons

## Conventions
- Use `font-[family-name:var(--font-playfair)]` for serif headings
- Use `text-gradient-gold` / `text-gradient-rose` for gradient text
- Use the `<Reveal>` component for scroll-triggered animations
- Product data is in `src/data/products.ts`
- Indian Rupee (₹) for currency
