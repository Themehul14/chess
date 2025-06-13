import React from 'react';
import WalletConnect from './components/WalletConnect.jsx';
import ChessBoard from './components/ChessBoard.jsx';

export default function App() {
  return (
    <div>
      <h1>Sui Chess</h1>
      <WalletConnect />
      <ChessBoard />
    </div>
  );
}
