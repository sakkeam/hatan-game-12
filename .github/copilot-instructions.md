# はたんゲーム 12 - AI Coding Instructions

## Project Overview

This is a **mobile-first classification game** called "Hatan Game 12" (破綻ゲーム), built with Next.js 16 and React 19. The game concept is categorizing different types of "failures/breakdowns" (破綻) by swiping left or right on a vertical mobile screen.

**Target Platform**: Smartphone (portrait orientation)

## Architecture & Technology Stack

### Core Framework
- **Next.js 16.0.1** (App Router) with TypeScript
- **React 19.2.0** with experimental features
- **Tailwind CSS v4** (newer PostCSS-based setup, see `@tailwindcss/postcss`)
- **Bun** as the package manager (note `bun.lock`)

### Planned State & Data Management (from `docs/proposal.md`)
The game will use a functional reactive architecture:
- `neverthrow` - Railway-oriented error handling
- `immer` - Immutable state updates
- `rxjs` - Reactive streams for game events
- `zustand` - Client state management

### Planned 3D/Visual Layer
- `@react-three/fiber` - React Three.js renderer
- `@react-three/drei` - Helper components
- `@react-three/uikit` - 3D UI elements
- `@react-three/postprocessing` - Visual effects

**Note**: These dependencies are specified in the proposal but not yet installed in `package.json`. Check before assuming availability.

## Development Workflow

### Commands
- `bun run dev` - Start dev server (http://localhost:3000)
- `bun run build` - Production build
- `bun run lint` - Run ESLint

### Path Aliases
Use `@/*` for imports from the project root (configured in `tsconfig.json`):
```typescript
import { Component } from '@/app/components/Component';
```

## Code Conventions

### TypeScript Configuration
- **Target**: ES2017 (check `tsconfig.json` - not ES2022)
- **JSX**: `react-jsx` (React 19's new JSX transform)
- **Strict mode enabled** - expect full type safety

### ESLint Setup
Uses Next.js config with custom overrides in `eslint.config.mjs`:
- Follows `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

### Styling Approach
- **Tailwind CSS v4** (newer inline `@theme` syntax in `globals.css`)
- Utility-first with CSS variables for theming
- Custom font variables: `--font-geist-sans` and `--font-geist-mono`
- Dark mode via `prefers-color-scheme` media query

### File Organization
- `app/` - Next.js App Router structure
  - `layout.tsx` - Root layout with fonts and metadata
  - `page.tsx` - Home page
  - `globals.css` - Global styles with Tailwind
- `docs/` - Project documentation (see `proposal.md` for game spec)
- `public/` - Static assets

## Game-Specific Context

### Game Mechanics (from proposal)
- **Controls**: Left key = categorize left, Right key = categorize right
- **Objective**: Quickly classify falling "failures" as true failures or not
- **Story**: Classify chaotic failures and return them to their proper place
- **Motto**: "Don't bring failures to other places"

### Mobile-First Implementation
When building UI:
- Default to vertical/portrait orientation
- Use touch-friendly interaction patterns
- Consider `flex-col` layouts for mobile stacking
- Test responsive behavior with mobile viewport

## Current Status

**Branch**: `feature/mvp` (MVP development phase)

This is a fresh Next.js project scaffold. The game logic, 3D visualization, and state management libraries from the proposal are **not yet implemented**. When adding these:

1. Install dependencies listed in `docs/proposal.md` first
2. Set up Zustand store structure before building game logic
3. Integrate Three.js canvas as the main game viewport
4. Implement reactive event streams with RxJS for game state transitions
5. Use `neverthrow` Result types for all game operations that can fail

## Key References
- Game specification: `docs/proposal.md`
- Japanese content: Game UI and story elements use Japanese text
