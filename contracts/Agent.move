module arena_ai_chess::agent {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::event;

    /// Represents an AI chess agent as an NFT
    struct Agent has key, store {
        id: UID,
        elo: u64,
        dna_seed: vector<u8>,
        strategy_hash: vector<u8>,
        generation: u64,
    }

    /// Event emitted when a new agent is created
    struct AgentCreated has copy, drop {
        agent_id: ID,
        elo: u64,
        generation: u64,
    }

    /// Creates a new agent with initial parameters
    public fun create_agent(
        elo: u64,
        dna_seed: vector<u8>,
        strategy_hash: vector<u8>,
        generation: u64,
        ctx: &mut TxContext
    ): Agent {
        let agent = Agent {
            id: object::new(ctx),
            elo,
            dna_seed,
            strategy_hash,
            generation,
        };

        event::emit(AgentCreated {
            agent_id: object::id(&agent),
            elo,
            generation,
        });

        agent
    }

    /// Updates the agent's ELO rating
    public fun update_elo(agent: &mut Agent, new_elo: u64) {
        agent.elo = new_elo;
    }

    /// Updates the agent's generation
    public fun increment_generation(agent: &mut Agent) {
        agent.generation = agent.generation + 1;
    }
} 