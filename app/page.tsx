/**
 * はたんゲーム 12 - Main Game Page
 * 
 * Mobile-first classification game with Three.js
 */

'use client';

import { Canvas } from '@react-three/fiber';
import GameScene from './components/GameScene';
import GameUI from './components/GameUI';
import SwipeHandler from './components/SwipeHandler';
import GameLoop from './game/loop';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas - Full screen portrait */}
      <Canvas
        className="absolute inset-0"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
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
