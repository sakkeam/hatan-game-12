/**
 * はたんゲーム 12 - RxJS Game Streams
 * 
 * Reactive event streams for game logic
 */

import { Subject, interval, fromEvent } from 'rxjs';
import { filter, map, throttleTime, withLatestFrom } from 'rxjs/operators';
import type { Direction } from '@/app/game/rules';
import type { GameItem } from '@/app/data/items';

/**
 * Subject for swipe/keyboard input events
 */
export const swipeEvent$ = new Subject<Direction>();

/**
 * Subject for item spawn events
 */
export const spawnEvent$ = new Subject<GameItem>();

/**
 * Subject for classification result events
 */
export const classificationEvent$ = new Subject<{
  success: boolean;
  direction: Direction;
}>();

/**
 * Subject for game state changes
 */
export const gameStateEvent$ = new Subject<{
  type: 'start' | 'gameover' | 'score' | 'rule_change';
  data?: any;
}>();

/**
 * Create a throttled swipe stream to prevent spam
 */
export function createSwipeStream() {
  return swipeEvent$.pipe(
    throttleTime(200) // Prevent rapid swipes
  );
}

/**
 * Create keyboard event stream for left/right arrows
 */
export function createKeyboardStream() {
  if (typeof window === 'undefined') return new Subject<Direction>();
  
  return fromEvent<KeyboardEvent>(window, 'keydown').pipe(
    filter(event => event.key === 'ArrowLeft' || event.key === 'ArrowRight'),
    map(event => (event.key === 'ArrowLeft' ? 'left' : 'right') as Direction),
    throttleTime(200)
  );
}

/**
 * Create dynamic spawn interval stream
 * The interval changes based on the game's spawn interval setting
 */
export function createSpawnStream(getSpawnInterval: () => number) {
  let currentInterval = getSpawnInterval();
  let subscription: any = null;
  
  const spawnSubject = new Subject<void>();
  
  const startSpawning = () => {
    if (subscription) {
      subscription.unsubscribe();
    }
    
    currentInterval = getSpawnInterval();
    subscription = interval(currentInterval).subscribe(() => {
      const newInterval = getSpawnInterval();
      
      // Restart if interval changed significantly
      if (Math.abs(newInterval - currentInterval) > 50) {
        startSpawning();
      } else {
        spawnSubject.next();
      }
    });
  };
  
  const stopSpawning = () => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  };
  
  return {
    spawn$: spawnSubject.asObservable(),
    start: startSpawning,
    stop: stopSpawning,
  };
}

/**
 * Cleanup all subscriptions
 */
export function cleanupStreams() {
  swipeEvent$.complete();
  spawnEvent$.complete();
  classificationEvent$.complete();
  gameStateEvent$.complete();
}
