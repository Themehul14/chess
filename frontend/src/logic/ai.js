import chess from 'chess.js';

export function getRandomMove(board) {
  const moves = board.moves();
  return moves[Math.floor(Math.random() * moves.length)];
}

export function minimaxMove(board, depth = 2, maximizing = true) {
  if (depth === 0 || board.game_over()) {
    return { score: evaluate(board) };
  }
  let best = { score: maximizing ? -Infinity : Infinity };
  for (const move of board.moves()) {
    board.move(move);
    const result = minimaxMove(board, depth - 1, !maximizing);
    board.undo();
    if (maximizing && result.score > best.score) {
      best = { score: result.score, move };
    }
    if (!maximizing && result.score < best.score) {
      best = { score: result.score, move };
    }
  }
  return best;
}

function evaluate(board) {
  const values = { p:1, n:3, b:3, r:5, q:9, k:0 };
  let score = 0;
  board.board().forEach(row => row.forEach(piece => {
    if (piece) {
      const val = values[piece.type];
      score += piece.color === 'w' ? val : -val;
    }
  }));
  return score;
}

export function getAIMove(board) {
  if (Math.random() < 0.2) {
    return getRandomMove(board);
  }
  const { move } = minimaxMove(board, 3, board.turn() === 'w');
  return move || getRandomMove(board);
}
