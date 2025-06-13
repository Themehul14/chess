import { TransactionBlock } from '@mysten/sui.js';
import { useWalletKit } from '@mysten/wallet-kit';

const PACKAGE_ID = 'REPLACE_WITH_PACKAGE_ID';

export async function startMatch(amount) {
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::chess_wager::start_wagered_match`,
    arguments: [tx.pure(amount)],
  });
  await signAndExecuteTransactionBlock({ transactionBlock: tx });
}

export async function resolveMatch(winner) {
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::chess_wager::resolve_match`,
    arguments: [tx.pure(winner)],
  });
  await signAndExecuteTransactionBlock({ transactionBlock: tx });
}

export async function mintTrophyNFT(metadata) {
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::chess_wager::mint_trophy_nft`,
    arguments: [tx.pure(JSON.stringify(metadata))],
  });
  await signAndExecuteTransactionBlock({ transactionBlock: tx });
}
