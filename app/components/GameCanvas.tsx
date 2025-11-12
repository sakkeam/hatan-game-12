/**
 * はたんゲーム 12 - Game Canvas Component
 * 
 * Separate canvas component to avoid cyclic serialization issues
 */

'use client';

import { Canvas } from '@react-three/fiber';
import GameScene from './GameScene';

export default function GameCanvas() {
  return (
    <Canvas className="absolute inset-0">
      <GameScene />
    </Canvas>
  );
}
