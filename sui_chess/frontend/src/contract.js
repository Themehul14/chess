import { SuiClient } from '@mysten/sui.js';

const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

export async function createWager(player2, amount, wallet) {
  const tx = {
    packageObjectId: '<PACKAGE_ID>', // replace after publishing
    module: 'chess_wager',
    function: 'create_wager',
    arguments: [wallet.address, player2, amount],
  };
  return wallet.signAndExecuteTransaction({ transaction: tx });
}
