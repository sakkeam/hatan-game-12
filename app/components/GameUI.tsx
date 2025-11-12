/**
 * はたんゲーム 12 - Game UI Overlay Component
 * 
 * UI overlay for score, game state, and controls
 */

'use client';

import { useGameStore } from '@/app/stores/gameStore';

export default function GameUI() {
  const gamePhase = useGameStore((state) => state.gamePhase);
  const score = useGameStore((state) => state.score);
  const activeItems = useGameStore((state) => state.activeItems);
  const gameOverMessage = useGameStore((state) => state.gameOverMessage);
  const correctVariation = useGameStore((state) => state.correctVariation);
  const correctDirection = useGameStore((state) => state.correctDirection);
  const nextRuleChangeScore = useGameStore((state) => state.nextRuleChangeScore);
  const startGame = useGameStore((state) => state.startGame);
  const restartGame = useGameStore((state) => state.restartGame);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score Display - Top Left */}
      {gamePhase === 'playing' && (
        <div className="absolute top-6 left-6 text-white pointer-events-none">
          <div className="text-4xl font-bold font-mono">{score}</div>
          <div className="text-sm text-gray-400 mt-1">
            {activeItems.length} / 10
          </div>
        </div>
      )}

      {/* Current Rule Display - Top Right */}
      {gamePhase === 'playing' && correctVariation && correctDirection && (
        <div className="absolute top-6 right-6 text-white pointer-events-none text-right">
          <div className="text-xs text-gray-400 mb-1">正解</div>
          <div className="text-3xl font-bold mb-2">{correctVariation}</div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-gray-400">→</span>
            <span className="text-2xl font-bold">
              {correctDirection === 'left' ? '← 左' : '右 →'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            次の変更: {nextRuleChangeScore}点
          </div>
        </div>
      )}

      {/* Start Screen */}
      {gamePhase === 'start' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 pointer-events-auto">
          <h1 className="text-5xl font-bold text-white mb-4">
            はたんゲーム 12
          </h1>
          <p className="text-lg text-gray-300 mb-2 max-w-md text-center px-8">
            ある日、突然として破綻が次々と降り注いできた。
          </p>
          <p className="text-md text-gray-400 mb-8 max-w-md text-center px-8">
            キミの使命は、破綻か破綻ではないかを正しく分類し、
            <br />
            混沌とした破綻を元の場所へ返納すること。
          </p>
          <p className="text-sm text-gray-500 mb-12 italic">
            「破綻を他の場所に持ち込んではならない」
          </p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors"
          >
            タップして開始
          </button>
          <div className="absolute bottom-12 text-center text-gray-500 text-sm">
            <p>スワイプまたは矢印キーで分類</p>
            <p className="text-xs mt-2">← 左 | 右 →</p>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gamePhase === 'gameover' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 pointer-events-auto">
          <h2 className="text-3xl font-bold text-red-500 mb-4">
            ゲームオーバー
          </h2>
          <p className="text-xl text-white mb-8">{gameOverMessage}</p>
          <div className="text-5xl font-bold text-white mb-12">
            スコア: {score}
          </div>
          <button
            onClick={restartGame}
            className="px-8 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors"
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  );
}
