/**
 * はたんゲーム 12 - Main Game Page
 * 
 * Mobile-first classification game with Three.js
 */

'use client';

import dynamic from 'next/dynamic';
import GameUI from './components/GameUI';
import SwipeHandler from './components/SwipeHandler';
import GameLoop from './game/loop';

// Dynamically import Canvas and GameScene to avoid SSR issues
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const GameScene = dynamic(() => import('./components/GameScene'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas - Full screen portrait */}
      <Canvas
        className="absolute inset-0"
      >
        <GameScene />
      </Canvas>

      {/* UI Overlay */}
      <GameUI />

      {/* Input Handler */}
      <SwipeHandler />

      {/* Game Loop */}
      <GameLoop />
    </div>
  );
}
