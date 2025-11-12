/**
 * はたんゲーム 12 - Game Loop
 * 
 * Connects RxJS streams to Zustand store and manages game timing
 */

'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/app/stores/gameStore';
import { createSpawnStream } from '@/app/game/streams';
import { createGameItem, getRandomVariation } from '@/app/data/items';

/**
 * Custom hook to manage the game loop
 */
export function useGameLoop() {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const spawnInterval = useGameStore((state) => state.spawnInterval);
  const spawnItem = useGameStore((state) => state.spawnItem);
  const checkRuleChange = useGameStore((state) => state.checkRuleChange);
  
  const spawnStreamRef = useRef<ReturnType<typeof createSpawnStream> | null>(null);
  const ruleCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gamePhase === 'playing') {
      // Create spawn stream
      if (!spawnStreamRef.current) {
        spawnStreamRef.current = createSpawnStream(() => {
          return useGameStore.getState().spawnInterval;
        });
      }

      // Subscribe to spawn events
      const subscription = spawnStreamRef.current.spawn$.subscribe(() => {
        const variation = getRandomVariation();
        const item = createGameItem(variation);
        spawnItem(item);
      });

      // Start spawning
      spawnStreamRef.current.start();

      // Check rule change every 100ms for smooth countdown
      ruleCheckIntervalRef.current = setInterval(() => {
        checkRuleChange();
      }, 100);

      return () => {
        subscription.unsubscribe();
        if (spawnStreamRef.current) {
          spawnStreamRef.current.stop();
        }
        if (ruleCheckIntervalRef.current) {
          clearInterval(ruleCheckIntervalRef.current);
        }
      };
    } else {
      // Stop spawning when not playing
      if (spawnStreamRef.current) {
        spawnStreamRef.current.stop();
      }
      if (ruleCheckIntervalRef.current) {
        clearInterval(ruleCheckIntervalRef.current);
      }
    }
  }, [gamePhase, spawnInterval, spawnItem, checkRuleChange]);
}

/**
 * Game Loop Component
 * Manages the game timing and spawn logic
 */
export default function GameLoop() {
  useGameLoop();
  return null;
}
