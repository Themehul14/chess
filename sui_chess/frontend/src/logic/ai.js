import { Chess } from 'chess.js';

export function makeAIMove(game) {
  const moves = game.moves();
  if (moves.length === 0) return null;
  // Very simple AI: random move
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}
