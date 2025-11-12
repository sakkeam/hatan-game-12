/**
 * はたんゲーム 12 - Game Scene Component
 * 
 * Main 3D scene container for the game
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useGameStore } from '@/app/stores/gameStore';
import FallingItem from './FallingItem';

export default function GameScene() {
  const activeItems = useGameStore((state) => state.activeItems);
  const cameraRef = useRef<any>(null);

  useFrame(() => {
    // Camera can be animated here if needed
  });

  return (
    <>
      {/* Orthographic camera for 2D-like view */}
      <OrthographicCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 10]}
        zoom={100}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Render all active items with stacking */}
      {activeItems.map((item, index) => (
        <FallingItem
          key={item.id}
          item={item}
          stackIndex={index}
          totalItems={activeItems.length}
        />
      ))}
    </>
  );
}
