import { Chess } from 'chess.js';

export function getBestMove(game, depth) {
  let bestMove = null;
  let bestValue = -Infinity;
  for (const move of game.moves()) {
    game.move(move);
    const value = minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimax(game, depth, alpha, beta, maximizing) {
  if (depth === 0 || game.game_over()) {
    return evaluate(game);
  }
  if (maximizing) {
    let value = -Infinity;
    for (const move of game.moves()) {
      game.move(move);
      value = Math.max(value, minimax(game, depth - 1, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const move of game.moves()) {
      game.move(move);
      value = Math.min(value, minimax(game, depth - 1, alpha, beta, true));
      game.undo();
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

function evaluate(game) {
  const vals = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  let score = 0;
  for (const piece of game.board()) {
    if (piece) {
      const val = vals[piece.type];
      score += piece.color === 'w' ? val : -val;
    }
  }
  return score;
}

export function getRandomizedMove(moves) {
  if (!moves.length) return null;
  const idx = Math.floor(Math.random() * moves.length);
  return moves[idx];
}
