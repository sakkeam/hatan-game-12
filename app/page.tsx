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

// Dynamically import GameCanvas to avoid SSR serialization issues
const GameCanvas = dynamic(() => import('./components/GameCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas - Full screen portrait */}
      <GameCanvas />

      {/* UI Overlay */}
      <GameUI />

      {/* Input Handler */}
      <SwipeHandler />

      {/* Game Loop */}
      <GameLoop />
    </div>
  );
}
