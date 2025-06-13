import { TransactionBlock } from '@mysten/sui.js';

let packageId = '';

export function connectContract(id) {
  packageId = id;
}

export async function startMatch(wallet, player1, player2, wager, metadata) {
  if (!packageId) throw new Error('Contract not connected');
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${packageId}::chess_wager::start_wagered_match`,
    arguments: [tx.pure(player1), tx.pure(player2), tx.pure(wager), tx.pure(metadata)],
  });
  tx.setGasBudget(100000000);
  return wallet.signAndExecuteTransactionBlock({ transactionBlock: tx });
}
