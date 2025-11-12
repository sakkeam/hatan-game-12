/**
 * はたんゲーム 12 - Swipe Handler Component
 * 
 * Detects touch swipes and keyboard input for item classification
 */

'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/app/stores/gameStore';
import { swipeEvent$, createKeyboardStream } from '@/app/game/streams';
import type { Direction } from '@/app/game/rules';

const SWIPE_THRESHOLD = 50; // Minimum pixels for swipe detection

export default function SwipeHandler() {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const classifyItem = useGameStore((state) => state.classifyItem);
  
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (gamePhase !== 'playing') return;

    // Handle keyboard input
    const keyboardSub = createKeyboardStream().subscribe((direction) => {
      swipeEvent$.next(direction);
      classifyItem(direction);
    });

    // Handle touch start
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    // Handle touch end (swipe detection)
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      // Check if horizontal swipe exceeds threshold
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        const direction: Direction = deltaX > 0 ? 'right' : 'left';
        swipeEvent$.next(direction);
        classifyItem(direction);
      }

      touchStartRef.current = null;
    };

    // Handle touch cancel
    const handleTouchCancel = () => {
      touchStartRef.current = null;
    };

    // Add event listeners
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      keyboardSub.unsubscribe();
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [gamePhase, classifyItem]);

  // This component doesn't render anything
  return null;
}
