/**
 * はたんゲーム 12 - Game Rules Logic
 * 
 * Handles rule randomization and difficulty scaling
 */

import { ITEM_VARIATIONS, type ItemVariation } from '@/app/data/items';

export type Direction = 'left' | 'right' | 'suggest';

export interface GameRule {
  correctVariation: ItemVariation;
  correctDirection: Direction;
  wrongVariations: ItemVariation[]; // Specific wrong variations to classify
}

/**
 * Randomly select one variation and one direction as the "correct" answer
 * Also select specific wrong variations that must be classified
 */
export function randomizeRule(): GameRule {
  const randomVariation = ITEM_VARIATIONS[
    Math.floor(Math.random() * ITEM_VARIATIONS.length)
  ];
  
  const randomDirection: Direction = Math.random() < 0.5 ? 'left' : 'right';
  
  // Get wrong variations (all except the correct one)
  const wrongVariations = ITEM_VARIATIONS.filter(v => v !== randomVariation);
  
  return {
    correctVariation: randomVariation,
    correctDirection: randomDirection,
    wrongVariations,
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
 * - If item matches correctVariation, swipe in correctDirection
 * - If item is in wrongVariations, swipe in opposite direction
 * - 'suggest' always classifies correctly based on the rule
 */
export function validateClassification(
  itemText: ItemVariation,
  swipeDirection: Direction,
  rule: GameRule
): boolean {
  const isCorrectVariation = itemText === rule.correctVariation;
  const isWrongVariation = rule.wrongVariations.includes(itemText);
  
  // Handle 'suggest' - always correct
  if (swipeDirection === 'suggest') {
    return true;
  }
  
  if (isCorrectVariation) {
    // Correct variation should be swiped in the correct direction
    return swipeDirection === rule.correctDirection;
  } else if (isWrongVariation) {
    // Wrong variation should be swiped in the opposite direction
    const oppositeDirection: Direction = rule.correctDirection === 'left' ? 'right' : 'left';
    return swipeDirection === oppositeDirection;
  } else {
    // This shouldn't happen - item not in current rule set
    return false;
  }
}
