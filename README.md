This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## はたんゲーム 12 (Hatan Game 12)

A mobile-first classification game built with Next.js 16, React 19, and React Three Fiber.

**Theme**: Categorize different types of "failures/breakdowns" (破綻) by swiping left or right.

**Target Platform**: Smartphone (portrait orientation)

### Features

- **3D Text Rendering** - Japanese text variations rendered with Three.js
- **State Management** - Zustand with immer for immutable updates
- **Error Handling** - neverthrow for railway-oriented programming
- **Post-processing Effects** - Dynamic visual effects driven by game state:
  - **Vignette** - Focus attention on center, increases with item stack count
  - **Bloom** - Glowing white text, pulses on successful classification
  - **Noise/Grain** - Film grain that increases with fall speed (difficulty)
  - **Chromatic Aberration** - RGB separation effect, spikes on rule changes
  - **Depth of Field** - Blur background items when stack grows (3+ items)
  - **Glitch** - Digital corruption effect on game over

### Post-processing Implementation

Visual effects are implemented in `app/components/Effects.tsx` using `@react-three/postprocessing`:

- **State-driven intensities**: Effects respond to `activeItems.length`, `fallSpeed`, `score`, and `gamePhase`
- **Dynamic triggers**: Bloom pulse and chromatic aberration spike on successful classification
- **Game over effect**: Glitch effect triggers when game ends
- **Performance optimization**: Conditional DepthOfField (only when 3+ items stacked)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
