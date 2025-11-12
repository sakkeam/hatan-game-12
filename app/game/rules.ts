/**
 * はたんゲーム 12 - Game Rules Logic
 * 
 * Handles rule randomization and difficulty scaling
 */

import { ITEM_VARIATIONS, type ItemVariation } from '@/app/data/items';

export type Direction = 'left' | 'right';

export interface GameRule {
  correctVariation: ItemVariation;
  correctDirection: Direction;
}

/**
 * Randomly select one variation and one direction as the "correct" answer
 */
export function randomizeRule(): GameRule {
  const randomVariation = ITEM_VARIATIONS[
    Math.floor(Math.random() * ITEM_VARIATIONS.length)
  ];
  
  const randomDirection: Direction = Math.random() < 0.5 ? 'left' : 'right';
  
  return {
    correctVariation: randomVariation,
    correctDirection: randomDirection,
  };
}

/**
 * Calculate next rule change score threshold based on current score
 * Formula: max(10, 30 - floor(score/100) * 5)
 * 
 * Initial: every 30 points
 * At score 100: every 25 points
 * At score 200: every 20 points
 * At score 400: every 10 points (minimum)
 */
export function getNextRuleChangeInterval(currentScore: number): number {
  const interval = Math.max(10, 30 - Math.floor(currentScore / 100) * 5);
  return interval;
}

/**
 * Calculate spawn interval in milliseconds based on current score
 * Formula: max(500, 2000 - floor(score/10) * 100)
 * 
 * Initial: 2000ms (2 seconds)
 * At score 10: 1900ms
 * At score 100: 1000ms
 * At score 150+: 500ms (minimum)
 */
export function calculateSpawnInterval(score: number): number {
  return Math.max(500, 2000 - Math.floor(score / 10) * 100);
}

/**
 * Validate if classification is correct based on current rule
 */
export function validateClassification(
  itemText: ItemVariation,
  swipeDirection: Direction,
  rule: GameRule
): boolean {
  return (
    itemText === rule.correctVariation &&
    swipeDirection === rule.correctDirection
  );
}
