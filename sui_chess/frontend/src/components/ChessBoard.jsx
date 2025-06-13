import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { makeAIMove } from '../logic/ai.js';

const boardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 40px)',
  width: '320px',
};

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());

  useEffect(() => {
    if (game.turn() === 'b') {
      const move = makeAIMove(game);
      if (move) {
        game.move(move);
        setFen(game.fen());
      }
    }
  }, [fen]);

  const onSquareClick = (square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length) {
      game.move(moves[0]);
      setFen(game.fen());
    }
  };

  const squares = [];
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = String.fromCharCode(97 + file) + (rank + 1);
      squares.push(
        <div
          key={square}
          onClick={() => onSquareClick(square)}
          style={{ width: 40, height: 40, background: (rank + file) % 2 ? '#769656' : '#eeeed2' }}
        >
          {game.get(square)?.type.toUpperCase() || ''}
        </div>
      );
    }
  }

  return <div style={boardStyle}>{squares}</div>;
}
