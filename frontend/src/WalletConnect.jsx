import React, { useEffect, useState } from 'react';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';

export default function WalletConnect() {
  const { currentAccount, disconnect, connection } = useWalletKit();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      if (!currentAccount) return;
      const coins = await connection.provider.getCoins({ owner: currentAccount.address });
      const total = coins.data.reduce((acc, c) => acc + Number(c.balance), 0);
      setBalance(total / 1e9);
    }
    fetchBalance();
  }, [currentAccount, connection]);

  if (!connection) {
    return <div>No wallet found. Install Sui wallet.</div>;
  }

  return (
    <div>
      {currentAccount ? (
        <div>
          <p>Connected: {currentAccount.address}</p>
          <p>Balance: {balance} SUI</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
