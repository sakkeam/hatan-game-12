/**
 * はたんゲーム 12 - Game Scene Component
 * 
 * Main 3D scene container for the game
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { useGameStore } from '@/app/stores/gameStore';
import FallingItem from './FallingItem';
import { Effects } from './Effects';

export default function GameScene() {
  const activeItems = useGameStore((state) => state.activeItems);
  const cameraRef = useRef<any>(null);

  useFrame(() => {
    // Camera can be animated here if needed
  });

  return (
    <>
      {/* Perspective camera for 3D mountain view */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 18, 8]}
        fov={45}
        rotation={[-Math.PI / 2.2, 0, 0]}
      />

      {/* Ambient lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} />

      {/* Physics simulation */}
      <Physics gravity={[0, -9.81, 0]}>
        {/* Ground plane for mountain base */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -0.5, 0]} receiveShadow>
            <boxGeometry args={[20, 1, 20]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </RigidBody>

        {/* Render all active items with physics */}
        {activeItems.map((item, index) => (
          <FallingItem
            key={item.id}
            item={item}
            stackIndex={index}
            totalItems={activeItems.length}
          />
        ))}
      </Physics>
      
      {/* Post-processing effects */}
      <Effects />
    </>
  );
}
