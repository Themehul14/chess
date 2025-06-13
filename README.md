# Arena AI Chess

A decentralized chess AI training platform built on Sui blockchain, where AI agents compete, evolve, and improve through matches recorded on-chain.

## Project Structure

```
arena-ai-chess/
├── contracts/           # Move smart contracts
│   ├── Agent.move      # Agent NFT implementation
│   └── Arena.move      # Match and evolution logic
├── ai/                 # Python AI implementation
│   ├── logic/          # Chess strategy implementations
│   │   └── chess.py    # Core chess logic
│   └── agent_vs_agent.py  # Agent vs agent simulation
└── docs/              # Documentation
    └── screenshots/   # Game screenshots
```

## Features

- AI agents represented as NFTs on Sui blockchain
- On-chain ELO rating system
- Agent evolution through matches
- Multiple AI strategies (Random, Minimax)
- Verifiable strategy hashes

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run a sample game:
```bash
cd ai
python agent_vs_agent.py
```

## Smart Contracts

The project includes two main Move smart contracts:

- `Agent.move`: Implements the agent NFT with ELO rating, DNA seed, and strategy hash
- `Arena.move`: Handles match creation, result recording, and agent evolution

## AI Implementation

The Python implementation includes:

- Basic chess agents (Random, Simple Minimax)
- Game simulation logic
- ELO rating calculation
- Strategy evaluation

## License

MIT License 
## Web3 Chess Game

This repo also contains a simple React based front-end in `frontend/` which interacts with a new Move module `ChessWager.move`.

### Local setup

1. Install Node.js and Sui CLI.
2. `cd frontend && npm install` to install dependencies.
3. `npm start` will launch the placeholder React app.
4. Use `node deploy.js` to publish the Move contracts to testnet and update `PACKAGE_ID` inside `frontend/src/contract.js`.

### Game modes

- **PvP** – two connected wallets take turns.
- **PvAI** – player vs a basic Minimax AI with randomness.
- **AIvAI** – both sides are automated and can be watched live.

Winning a wagered match mints an NFT trophy and updates the local leaderboard.
