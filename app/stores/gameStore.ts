/**
 * はたんゲーム 12 - Game State Store
 * 
 * Zustand store with immer for immutable updates and neverthrow for error handling
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ok, err, Result } from 'neverthrow';
import type { GameItem, ItemVariation } from '@/app/data/items';
import type { Direction, GameRule } from '@/app/game/rules';
import {
  randomizeRule,
  getNextRuleChangeInterval,
  calculateSpawnInterval,
  validateClassification,
} from '@/app/game/rules';
import { getRandomWrongMessage, getRandomOverflowMessage } from '@/app/data/messages';

export type GamePhase = 'start' | 'playing' | 'gameover';
export type GameOverReason = 'wrong' | 'overflow' | null;

const MAX_ITEMS = 10;

export interface GameState {
  // Game state
  gamePhase: GamePhase;
  score: number;
  activeItems: GameItem[];
  
  // Game over info
  gameOverReason: GameOverReason;
  gameOverMessage: string;
  
  // Current rule
  correctVariation: ItemVariation | null;
  correctDirection: Direction | null;
  nextRuleChangeScore: number;
  
  // Timing
  spawnInterval: number;
  lastSpawnTime: number;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  spawnItem: (item: GameItem) => Result<void, string>;
  classifyItem: (direction: Direction) => Result<void, string>;
  checkRuleChange: () => void;
  checkOverflow: () => void;
}

export const useGameStore = create<GameState>()(
  immer((set, get) => ({
    // Initial state
    gamePhase: 'start',
    score: 0,
    activeItems: [],
    gameOverReason: null,
    gameOverMessage: '',
    correctVariation: null,
    correctDirection: null,
    nextRuleChangeScore: 0,
    spawnInterval: 2000,
    lastSpawnTime: 0,

    /**
     * Start a new game
     */
    startGame: () => {
      set((state) => {
        const rule = randomizeRule();
        state.gamePhase = 'playing';
        state.score = 0;
        state.activeItems = [];
        state.gameOverReason = null;
        state.gameOverMessage = '';
        state.correctVariation = rule.correctVariation;
        state.correctDirection = rule.correctDirection;
        state.nextRuleChangeScore = getNextRuleChangeInterval(0);
        state.spawnInterval = 2000;
        state.lastSpawnTime = Date.now();
      });
    },

    /**
     * Restart game after game over
     */
    restartGame: () => {
      get().startGame();
    },

    /**
     * Add new item to active items queue
     */
    spawnItem: (item: GameItem): Result<void, string> => {
      const state = get();
      
      if (state.gamePhase !== 'playing') {
        return err('Game is not in playing state');
      }
      
      if (state.activeItems.length >= MAX_ITEMS) {
        return err('Maximum items reached');
      }
      
      set((draft) => {
        draft.activeItems.push(item);
        draft.lastSpawnTime = Date.now();
      });
      
      // Check for overflow after adding
      get().checkOverflow();
      
      return ok(undefined);
    },

    /**
     * Classify the bottom-most item (first in queue)
     */
    classifyItem: (direction: Direction): Result<void, string> => {
      const state = get();
      
      if (state.gamePhase !== 'playing') {
        return err('Game is not in playing state');
      }
      
      if (state.activeItems.length === 0) {
        return err('No items to classify');
      }
      
      const item = state.activeItems[0];
      
      console.log('=== Classification Debug ===');
      console.log('Item text:', item.text);
      console.log('Swipe direction:', direction);
      console.log('Correct variation:', state.correctVariation);
      console.log('Correct direction:', state.correctDirection);
      
      const isCorrect = validateClassification(
        item.text,
        direction,
        {
          correctVariation: state.correctVariation!,
          correctDirection: state.correctDirection!,
        }
      );
      
      console.log('Is correct:', isCorrect);
      console.log('========================');
      
      if (isCorrect) {
        // Correct classification - remove item and increment score
        set((draft) => {
          draft.activeItems.shift();
          draft.score += 1;
          draft.spawnInterval = calculateSpawnInterval(draft.score);
        });
        
        // Check if rule should change
        get().checkRuleChange();
        
        return ok(undefined);
      } else {
        // Wrong classification - game over
        set((draft) => {
          draft.gamePhase = 'gameover';
          draft.gameOverReason = 'wrong';
          draft.gameOverMessage = getRandomWrongMessage();
        });
        
        return err('Wrong classification');
      }
    },

    /**
     * Check if score has reached rule change threshold
     */
    checkRuleChange: () => {
      const state = get();
      
      if (state.score >= state.nextRuleChangeScore) {
        const newRule = randomizeRule();
        const newInterval = getNextRuleChangeInterval(state.score);
        
        set((draft) => {
          draft.correctVariation = newRule.correctVariation;
          draft.correctDirection = newRule.correctDirection;
          draft.nextRuleChangeScore = state.score + newInterval;
        });
      }
    },

    /**
     * Check if items have overflowed (>= MAX_ITEMS)
     */
    checkOverflow: () => {
      const state = get();
      
      if (state.activeItems.length >= MAX_ITEMS) {
        set((draft) => {
          draft.gamePhase = 'gameover';
          draft.gameOverReason = 'overflow';
          draft.gameOverMessage = getRandomOverflowMessage();
        });
      }
    },
  }))
);
