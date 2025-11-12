import type { GameRule } from '@/app/game/rules';

export type ItemVariation = 
  | '破綻'
  | 'はたん'
  | 'ハタン'
  | 'hatan'
  | 'Hatan'
  | 'HATAN'
  | 'はたーん';

export const ITEM_VARIATIONS: ItemVariation[] = [
  '破綻',
  'はたん',
  'ハタン',
  'hatan',
  'Hatan',
  'HATAN',
  'はたーん',
];

export interface GameItem {
  id: string;
  text: ItemVariation;
  timestamp: number;
  rule: GameRule; // Rule that was active when this item was spawned
}

/**
 * Create a new game item with unique ID and current rule
 */
export function createGameItem(text: ItemVariation, rule: GameRule): GameItem {
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    timestamp: Date.now(),
    rule,
  };
}

/**
 * Get random item variation from the pool
 */
export function getRandomVariation(): ItemVariation {
  return ITEM_VARIATIONS[Math.floor(Math.random() * ITEM_VARIATIONS.length)];
}
