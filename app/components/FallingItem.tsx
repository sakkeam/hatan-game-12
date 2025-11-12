/**
 * はたんゲーム 12 - Falling Item Component
 * 
 * 3D text component with falling and swipe animations
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type { GameItem } from '@/app/data/items';
import type { Direction } from '@/app/game/rules';
import { useGameStore } from '@/app/stores/gameStore';

const BOTTOM_Y = -3; // Bottom position where items stack
const Y_OFFSET = 0.3; // Y-axis offset between stacked items (positive = upward)
const BASE_FALL_SPEED = 0.1; // Base speed of falling animation
const SWIPE_SPEED = 0.15; // Speed of swipe-away animation
const SWIPE_DISTANCE = 10; // How far items fly when swiped

interface FallingItemProps {
  item: GameItem;
  stackIndex: number; // Position in stack (0 = bottom)
  totalItems: number;
}

export default function FallingItem({ item, stackIndex, totalItems }: FallingItemProps) {
  const meshRef = useRef<any>(null);
  const [isFalling, setIsFalling] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<Direction | null>(null);
  const fallSpeed = useGameStore((state) => state.fallSpeed);
  
  // Calculate target Y position - stackIndex 0 is bottom, higher index goes up
  const targetY = BOTTOM_Y + (stackIndex * Y_OFFSET);
  
  // Initialize position above screen
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.y = 6;
      meshRef.current.position.x = 0;
      meshRef.current.position.z = 0;
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    if (swipeDirection) {
      // Swipe-away animation
      const direction = swipeDirection === 'left' ? -1 : 1;
      meshRef.current.position.x += direction * SWIPE_SPEED;
      meshRef.current.position.y += SWIPE_SPEED * 0.5; // Slight upward arc
      meshRef.current.rotation.z += direction * 0.05; // Rotate while flying
      
      // Fade out
      if (meshRef.current.material) {
        meshRef.current.material.opacity = Math.max(
          0,
          meshRef.current.material.opacity - 0.02
        );
      }
    } else if (isFalling) {
      // Falling animation
      const currentY = meshRef.current.position.y;
      
      if (currentY > targetY) {
        meshRef.current.position.y -= BASE_FALL_SPEED * fallSpeed;
      } else {
        meshRef.current.position.y = targetY;
        setIsFalling(false);
      }
    } else {
      // Stack animation - smoothly move to new position when items below are removed
      const currentY = meshRef.current.position.y;
      const diff = targetY - currentY;
      
      if (Math.abs(diff) > 0.01) {
        meshRef.current.position.y += diff * 0.1; // Smooth interpolation
      } else {
        meshRef.current.position.y = targetY;
      }
    }
  });

  // Expose swipe method for external triggering
  useEffect(() => {
    // This would be called from the game loop when item is classified
    // For now, we'll handle it through props updates
  }, []);

  return (
    <Text
      ref={meshRef}
      fontSize={0.8}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#000000"
      material-transparent={true}
      material-opacity={1}
    >
      {item.text}
    </Text>
  );
}
