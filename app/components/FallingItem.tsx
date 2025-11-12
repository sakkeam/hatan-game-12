/**
 * はたんゲーム 12 - Falling Item Component
 * 
 * 3D text component with physics-based falling and mountain stacking
 */

'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center } from '@react-three/drei';
import { RigidBody, type RapierRigidBody } from '@react-three/rapier';
import type { GameItem } from '@/app/data/items';
import type { Direction } from '@/app/game/rules';
import { useGameStore } from '@/app/stores/gameStore';

const SPAWN_HEIGHT = 8; // Height above ground where items spawn
const SWIPE_IMPULSE = 20; // Force applied when swiping items away
const ITEM_MASS = 1; // Mass of each text item

interface FallingItemProps {
  item: GameItem;
  stackIndex: number;
  totalItems: number;
}

export default function FallingItem({ item, stackIndex, totalItems }: FallingItemProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const textRef = useRef<any>(null);
  const [opacity, setOpacity] = useState(1);
  
  // Watch for swipe command from store
  const swipedItemId = useGameStore((state) => state.swipedItemId);
  const swipeDirection = useGameStore((state) => state.swipeDirection);
  const shouldSwipe = swipedItemId === item.id;
  
  // Apply swipe impulse when this item is targeted
  useEffect(() => {
    if (shouldSwipe && swipeDirection && rigidBodyRef.current) {
      const direction = swipeDirection === 'left' ? -1 : 1;
      const impulse = { x: direction * SWIPE_IMPULSE, y: SWIPE_IMPULSE * 0.5, z: 0 };
      const torqueImpulse = { x: 0, y: 0, z: direction * 5 };
      
      rigidBodyRef.current.applyImpulse(impulse, true);
      rigidBodyRef.current.applyTorqueImpulse(torqueImpulse, true);
    }
  }, [shouldSwipe, swipeDirection]);

  // Fade out when swiped
  useFrame(() => {
    if (shouldSwipe && opacity > 0) {
      setOpacity((prev) => Math.max(0, prev - 0.02));
    }
  });

  // Random small offset for natural mountain formation (memoized to prevent repositioning)
  const spawnPosition = useMemo(() => {
    const spawnX = (Math.random() - 0.5) * 0.5;
    const spawnZ = (Math.random() - 0.5) * 0.5;
    return [spawnX, SPAWN_HEIGHT, spawnZ] as [number, number, number];
  }, []);

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={spawnPosition}
      mass={ITEM_MASS}
      restitution={0.3}
      friction={0.8}
    >
      <Center>
        <Text3D
          ref={textRef}
          font="/fonts/Noto_Sans_JP_Bold.json"
          size={0.8}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelSegments={5}
        >
          {item.text}
          <meshStandardMaterial
            color="#ffffff"
            transparent={true}
            opacity={opacity}
          />
        </Text3D>
      </Center>
    </RigidBody>
  );
}
