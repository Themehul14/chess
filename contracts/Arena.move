module arena_ai_chess::arena {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::random;
    use sui::event;
    use arena_ai_chess::agent::{Self, Agent};

    /// Represents a chess match between two agents
    struct Match has key, store {
        id: UID,
        white_agent: ID,
        black_agent: ID,
        result: u8, // 0: white wins, 1: black wins, 2: draw
        timestamp: u64,
    }

    /// Event emitted when a match is completed
    struct MatchCompleted has copy, drop {
        match_id: ID,
        white_agent: ID,
        black_agent: ID,
        result: u8,
    }

    /// Creates a new match between two agents
    public fun create_match(
        white_agent: &Agent,
        black_agent: &Agent,
        ctx: &mut TxContext
    ): Match {
        let match_obj = Match {
            id: object::new(ctx),
            white_agent: object::id(white_agent),
            black_agent: object::id(black_agent),
            result: 2, // Default to draw
            timestamp: tx_context::epoch(ctx),
        };

        match_obj
    }

    /// Records the result of a match and updates agent ELOs
    public fun record_match_result(
        match_obj: &mut Match,
        white_agent: &mut Agent,
        black_agent: &mut Agent,
        result: u8,
    ) {
        match_obj.result = result;
        
        // Update ELOs based on match result
        let (new_white_elo, new_black_elo) = calculate_elo_update(
            agent::elo(white_agent),
            agent::elo(black_agent),
            result
        );

        agent::update_elo(white_agent, new_white_elo);
        agent::update_elo(black_agent, new_black_elo);

        event::emit(MatchCompleted {
            match_id: object::id(match_obj),
            white_agent: object::id(white_agent),
            black_agent: object::id(black_agent),
            result,
        });
    }

    /// Calculates ELO updates based on match result
    fun calculate_elo_update(
        white_elo: u64,
        black_elo: u64,
        result: u8
    ): (u64, u64) {
        // K-factor for ELO calculation
        let k: u64 = 32;
        
        // Calculate expected scores
        let white_expected = 1 / (1 + 10 ^ ((black_elo - white_elo) / 400));
        let black_expected = 1 - white_expected;

        // Calculate actual scores based on result
        let (white_score, black_score) = match result {
            0 => (1, 0), // White wins
            1 => (0, 1), // Black wins
            _ => (0.5, 0.5), // Draw
        };

        // Calculate new ELOs
        let new_white_elo = white_elo + (k * (white_score - white_expected));
        let new_black_elo = black_elo + (k * (black_score - black_expected));

        (new_white_elo, new_black_elo)
    }
} 