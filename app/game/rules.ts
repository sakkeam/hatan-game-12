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
  wrongVariations: ItemVariation[];
  suggestedDirection: 'left' | 'right'; // Randomly selected wrong option
  suggestedVariation: ItemVariation; // Randomly selected wrong variation
}

/**
 * Randomly select one variation and one direction as the "correct" answer
 * Also select specific wrong variations that must be classified
 * Generate a random suggestion (one of the two wrong options)
 */
export function randomizeRule(): GameRule {
  const randomVariation = ITEM_VARIATIONS[
    Math.floor(Math.random() * ITEM_VARIATIONS.length)
  ];
  
  const randomDirection: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';
  
  // Get wrong variations (all except the correct one)
  const wrongVariations = ITEM_VARIATIONS.filter(v => v !== randomVariation);
  
  // Generate suggestion: randomly pick one of two wrong options
  // Option 1: wrong variation + correct direction
  // Option 2: correct variation + wrong direction
  const useWrongVariation = Math.random() < 0.5;
  
  const suggestedVariation = useWrongVariation 
    ? wrongVariations[Math.floor(Math.random() * wrongVariations.length)]
    : randomVariation;
    
  const suggestedDirection: 'left' | 'right' = useWrongVariation
    ? randomDirection
    : (randomDirection === 'left' ? 'right' : 'left');
  
  return {
    correctVariation: randomVariation,
    correctDirection: randomDirection,
    wrongVariations,
    suggestedDirection,
    suggestedVariation,
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
 * Formula: max(300, 1500 - floor(score/8) * 100)
 * 
 * Initial: 1500ms (1.5 seconds)
 * At score 8: 1400ms
 * At score 96: 300ms (minimum)
 */
export function calculateSpawnInterval(score: number): number {
  return Math.max(300, 1500 - Math.floor(score / 8) * 100);
}

/**
 * Validate if classification is correct based on current rule
 * - If item matches correctVariation, swipe in correctDirection
 * - If item is in wrongVariations, swipe in opposite direction
 * - 'suggest' is treated as wrong (uses suggestedDirection with suggestedVariation)
 */
export function validateClassification(
  itemText: ItemVariation,
  swipeDirection: Direction,
  rule: GameRule
): boolean {
  const isCorrectVariation = itemText === rule.correctVariation;
  const isWrongVariation = rule.wrongVariations.includes(itemText);
  
  // Handle 'suggest' - this is always wrong by design
  if (swipeDirection === 'suggest') {
    // Suggest uses the suggested wrong option, so it's never correct
    return false;
  }
  
  if (isCorrectVariation) {
    // Correct variation should be swiped in the correct direction
    return swipeDirection === rule.correctDirection;
  } else if (isWrongVariation) {
    // Wrong variation should be swiped in the opposite direction
    const oppositeDirection: 'left' | 'right' = rule.correctDirection === 'left' ? 'right' : 'left';
    return swipeDirection === oppositeDirection;
  } else {
    // This shouldn't happen - item not in current rule set
    return false;
  }
}
