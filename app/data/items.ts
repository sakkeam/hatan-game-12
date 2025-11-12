/**
 * はたんゲーム 12 - Game Items Data
 * 
 * 7 variations of "hatan" (破綻) text for classification game
 */

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
}

/**
 * Create a new game item with unique ID
 */
export function createGameItem(text: ItemVariation): GameItem {
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text,
    timestamp: Date.now(),
  };
}

/**
 * Get random item variation from the pool
 */
export function getRandomVariation(): ItemVariation {
  return ITEM_VARIATIONS[Math.floor(Math.random() * ITEM_VARIATIONS.length)];
}
