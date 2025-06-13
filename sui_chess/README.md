# Web3 Chess Game on Sui

This directory contains a minimal full stack example for building a chess game on the Sui blockchain. It includes:

- **Move smart contracts** in `contracts/` implementing a basic wagering escrow.
- **React frontend** in `frontend/` with Sui wallet connection and chess board UI.

## Folder Structure

```
sui_chess/
├── README.md                # Project instructions
├── contracts/               # Move modules
│   └── ChessWager.move      # Escrow logic for match wagering
└── frontend/                # React application
    ├── package.json         # Frontend dependencies
    └── src/
        ├── index.js         # Entry point
        ├── App.jsx          # Main React component
        ├── components/
        │   ├── ChessBoard.jsx      # Chessboard rendering
        │   └── WalletConnect.jsx   # Wallet connection button
        └── logic/
            ├── game.js      # chess.js wrapper
            └── ai.js        # simple minimax AI
```

## Setup Overview

1. Install the Sui CLI and Move tools.
2. Build and publish the Move contract.
3. Install Node dependencies for the frontend.
4. Run the React dev server and interact with the contract via Wallet Kit.

Detailed instructions are provided below.

## Step-by-step Setup (macOS)

1. **Install Sui CLI**
   ```bash
   brew install sui
   ```
   Alternatively follow instructions from <https://docs.sui.io/> for manual installation.

2. **Create a new Move project and build**
   ```bash
   cd contracts
   sui move build
   ```

3. **Publish the contract** (requires testnet faucet funds)
   ```bash
   sui client publish --gas-budget 10000
   ```

4. **Install Node dependencies for the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the React development server**
   ```bash
   npm start
   ```

The frontend uses Sui wallet-kit to detect a wallet, connect, and interact with the `ChessWager` contract.

## Frontend & Contract Integration

`src/contract.js` demonstrates how the frontend can call the Move module after publishing. Replace `<PACKAGE_ID>` with the package ID printed when you publish `ChessWager.move` on testnet. Wallet Kit provides `signAndExecuteTransaction` which submits the transaction signed by the connected wallet.

The simple React board in `ChessBoard.jsx` uses `logic/ai.js` for a random AI move. You can expand this with a minimax implementation and on-chain randomness queries using `SuiClient.getLatestSuiSystemState()` for randomness seeds.
