import { useState } from 'react';

export default function WalletConnect({ wallet }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [error, setError] = useState('');

  async function connect() {
    if (!wallet) {
      setError('Wallet not found');
      return;
    }
    try {
      const result = await wallet.connect();
      setAddress(result.address);
      setError('');
      const suiBalance = await wallet.getBalance();
      setBalance(suiBalance); // assume wallet provides getBalance
    } catch (e) {
      setError('Failed to connect');
    }
  }

  return (
    <div>
      <button onClick={connect}>Connect Wallet</button>
      {address && <div>Address: {address}</div>}
      {balance && <div>Balance: {balance} SUI</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}
