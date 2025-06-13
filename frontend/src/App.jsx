import { useState } from 'react';
import ChessBoard from './components/ChessBoard.jsx';
import WalletConnect from './components/WalletConnect.jsx';
import { connectContract } from './contract.js';

export default function App() {
  const [wallet, setWallet] = useState(null); // assume wallet instance
  const [message, setMessage] = useState('');
  const [winner, setWinner] = useState('');

  connectContract(process.env.REACT_APP_PACKAGE_ID || '');

  function onMatchResolved(winAddr) {
    setWinner(winAddr);
    setMessage('Reward claimed by ' + winAddr);
  }

  return (
    <div>
      <h1>Arena AI Chess</h1>
      <WalletConnect wallet={wallet} />
      <ChessBoard wallet={wallet} player1={'0x0'} player2={'0x1'} wager={1000} metadata={''} onResolved={onMatchResolved}/>
      {message && <div>{message}</div>}
      {winner && <div>Winner: {winner}</div>}
    </div>
  );
}
