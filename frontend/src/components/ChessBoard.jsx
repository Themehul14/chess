import { useState } from 'react';
import { startMatch } from '../contract';

export default function ChessBoard({ wallet, player1, player2, wager, metadata, onResolved }) {
  const [status, setStatus] = useState('');

  async function handleStart() {
    try {
      await startMatch(wallet, player1, player2, wager, metadata);
      setStatus('Wager accepted, game starting...');
      if (onResolved) {
        onResolved(player1); // placeholder winner
      }
    } catch (e) {
      setStatus('Failed to start match');
    }
  }

  return (
    <div>
      <button onClick={handleStart}>Start Match</button>
      {status && <div>{status}</div>}
      {/* Chess board UI would go here */}
    </div>
  );
}
