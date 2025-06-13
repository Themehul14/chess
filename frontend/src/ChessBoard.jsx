import React, { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { startMatch, resolveMatch, mintTrophyNFT } from './contract';
import { getBestMove, getRandomizedMove } from './logic/ai';

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());
  const [mode, setMode] = useState('pvp');
  const [moves, setMoves] = useState([]);
  const [wager, setWager] = useState(0);

  useEffect(() => {
    if (mode === 'aivai') {
      const interval = setInterval(() => makeAIMove(), 500);
      return () => clearInterval(interval);
    }
  }, [mode, game]);

  const makePlayerMove = (move) => {
    if (game.move(move)) {
      setMoves([...moves, move]);
      if (mode === 'pvai' && !game.game_over()) {
        setTimeout(makeAIMove, 500);
      }
    }
  };

  const makeAIMove = () => {
    const aiMove = getBestMove(game, 3);
    const randomized = getRandomizedMove(aiMove ? [aiMove] : game.moves());
    if (randomized && game.move(randomized)) {
      setMoves([...moves, randomized]);
    }
  };

  const start = async () => {
    await startMatch(wager);
  };

  const resolve = async (winner) => {
    await resolveMatch(winner);
  };

  const mint = async () => {
    await mintTrophyNFT({ date: Date.now(), moves: moves.length });
  };

  return (
    <div>
      <div>
        <select onChange={(e) => setMode(e.target.value)} value={mode}>
          <option value="pvp">PvP</option>
          <option value="pvai">PvAI</option>
          <option value="aivai">AIvAI</option>
        </select>
      </div>
      <div>
        <input type="number" value={wager} onChange={(e) => setWager(Number(e.target.value))} />
        <button onClick={start}>Start Match (Wager)</button>
        <button onClick={() => resolve('winner-address')}>Resolve Match</button>
        <button onClick={mint}>Mint Trophy</button>
      </div>
      <pre>{game.fen()}</pre>
    </div>
  );
}
