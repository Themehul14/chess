import React from 'react';
import { WalletProvider, ConnectButton, useWallet } from '@mysten/wallet-kit';

function WalletInfo() {
  const { connected, account } = useWallet();

  if (!connected) return null;
  return (
    <div>
      <p>Address: {account.address}</p>
    </div>
  );
}

export default function WalletConnect() {
  return (
    <WalletProvider autoConnect>
      <ConnectButton />
      <WalletInfo />
    </WalletProvider>
  );
}
