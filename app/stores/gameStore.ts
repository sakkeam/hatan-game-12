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
const INITIAL_RULE_DURATION = 15000; // 15 seconds in ms
const MIN_RULE_DURATION = 5000; // 5 seconds minimum

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
  wrongVariations: ItemVariation[];
  nextRuleChangeScore: number;
  ruleChangeTime: number; // Timestamp when rule will change
  ruleDuration: number; // Duration in ms until next rule change
  
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
    wrongVariations: [],
    nextRuleChangeScore: 0,
    ruleChangeTime: 0,
    ruleDuration: INITIAL_RULE_DURATION,
    spawnInterval: 2000,
    lastSpawnTime: 0,

    /**
     * Start a new game
     */
    startGame: () => {
      set((state) => {
        const rule = randomizeRule();
        const now = Date.now();
        state.gamePhase = 'playing';
        state.score = 0;
        state.activeItems = [];
        state.gameOverReason = null;
        state.gameOverMessage = '';
        state.correctVariation = rule.correctVariation;
        state.correctDirection = rule.correctDirection;
        state.wrongVariations = rule.wrongVariations;
        state.nextRuleChangeScore = getNextRuleChangeInterval(0);
        state.ruleDuration = INITIAL_RULE_DURATION;
        state.ruleChangeTime = now + INITIAL_RULE_DURATION;
        state.spawnInterval = 2000;
        state.lastSpawnTime = now;
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
      console.log('Item rule (when spawned):', item.rule.correctVariation, item.rule.correctDirection);
      console.log('Current rule:', state.correctVariation, state.correctDirection);
      
      const isCorrect = validateClassification(
        item.text,
        direction,
        item.rule // Use the rule from when the item was spawned
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
        
        // Change rule immediately after successful classification
        const newRule = randomizeRule();
        const newDuration = Math.max(MIN_RULE_DURATION, INITIAL_RULE_DURATION - Math.floor(get().score / 10) * 500);
        const now = Date.now();
        
        set((draft) => {
          draft.correctVariation = newRule.correctVariation;
          draft.correctDirection = newRule.correctDirection;
          draft.wrongVariations = newRule.wrongVariations;
          draft.ruleDuration = newDuration;
          draft.ruleChangeTime = now + newDuration;
        });
        
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
     * Check if score has reached rule change threshold or timer expired
     */
    checkRuleChange: () => {
      const state = get();
      const now = Date.now();
      
      // Check timer-based rule change
      if (now >= state.ruleChangeTime) {
        const newRule = randomizeRule();
        // Decrease duration based on score (faster changes at higher scores)
        const newDuration = Math.max(MIN_RULE_DURATION, INITIAL_RULE_DURATION - Math.floor(state.score / 10) * 500);
        
        set((draft) => {
          draft.correctVariation = newRule.correctVariation;
          draft.correctDirection = newRule.correctDirection;
          draft.wrongVariations = newRule.wrongVariations;
          draft.ruleDuration = newDuration;
          draft.ruleChangeTime = now + newDuration;
        });
      }
      
      // Also check score-based rule change (kept for backwards compatibility)
      if (state.score >= state.nextRuleChangeScore) {
        const newRule = randomizeRule();
        const newInterval = getNextRuleChangeInterval(state.score);
        const newDuration = Math.max(MIN_RULE_DURATION, INITIAL_RULE_DURATION - Math.floor(state.score / 10) * 500);
        const now = Date.now();
        
        set((draft) => {
          draft.correctVariation = newRule.correctVariation;
          draft.correctDirection = newRule.correctDirection;
          draft.wrongVariations = newRule.wrongVariations;
          draft.nextRuleChangeScore = state.score + newInterval;
          draft.ruleDuration = newDuration;
          draft.ruleChangeTime = now + newDuration;
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
