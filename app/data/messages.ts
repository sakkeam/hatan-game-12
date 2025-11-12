/**
 * はたんゲーム 12 - Game Over Messages
 * 
 * Creative Japanese messages for different game over scenarios
 */

/**
 * Messages shown when player makes wrong classification
 */
export const WRONG_CLASSIFICATION_MESSAGES = [
  '破綻を他の場所に持ち込んでしまった！',
  '分類に失敗した！',
  'それは違う破綻だった...',
  '判断ミス！破綻が逃げた！',
  '破綻の見極めに失敗！',
  '方向を間違えた！',
  '破綻を誤認してしまった...',
  'これは破綻の破綻だ！',
] as const;

/**
 * Messages shown when items overflow (10+ items stacked)
 */
export const OVERFLOW_MESSAGES = [
  '破綻が溢れてしまった！',
  '破綻の山ができた！',
  '処理能力の限界だ！',
  '破綻に埋もれた...',
  '破綻の洪水だ！',
  '破綻が制御不能に！',
  '破綻のタワーが崩壊した！',
  '破綻が溢れ出す...',
] as const;

/**
 * Get random message from wrong classification array
 */
export function getRandomWrongMessage(): string {
  const index = Math.floor(Math.random() * WRONG_CLASSIFICATION_MESSAGES.length);
  return WRONG_CLASSIFICATION_MESSAGES[index];
}

/**
 * Get random message from overflow array
 */
export function getRandomOverflowMessage(): string {
  const index = Math.floor(Math.random() * OVERFLOW_MESSAGES.length);
  return OVERFLOW_MESSAGES[index];
}
