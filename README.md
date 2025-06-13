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

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running

Start the Flask backend:
```bash
gunicorn ai.wsgi:app
```

Start the React frontend:
```bash
cd frontend
npm start
```

## Deploying Smart Contracts

Use the deploy script to publish Move contracts to testnet:
```bash
cd scripts
./deploy.sh
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

## Game Modes

- **PvP**: Two human players compete on-chain with optional wagers.
- **PvAI**: Play against the on-chain AI agent using the Minimax strategy.
- **AIvAI**: Watch two AI agents battle and evolve their ratings.

## License

MIT License 