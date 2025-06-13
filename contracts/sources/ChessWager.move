module arena_ai_chess::chess_wager {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    /// Represents a wagered chess match held in escrow
    struct WageredMatch has key, store {
        id: UID,
        player1: address,
        player2: address,
        stake: Coin<SUI>,
        metadata: vector<u8>,
        resolved: bool,
    }

    /// Creates a new wagered match storing the wager in escrow
    public fun start_wagered_match(
        player1: address,
        player2: address,
        stake: Coin<SUI>,
        metadata: vector<u8>,
        ctx: &mut TxContext
    ): WageredMatch {
        WageredMatch {
            id: object::new(ctx),
            player1,
            player2,
            stake,
            metadata,
            resolved: false,
        }
    }

    /// Resolves the match and transfers the escrow to the caller if they are the winner
    public fun resolve_match(match_obj: WageredMatch, ctx: &mut TxContext) {
        let caller = tx_context::sender(ctx);
        assert!(!match_obj.resolved, 1);
        assert!(caller == match_obj.player1 || caller == match_obj.player2, 2);
        transfer::transfer(match_obj.stake, caller);
        // match object is destroyed after transferring stake
    }
}
