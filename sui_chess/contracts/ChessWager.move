module sui_chess::chess_wager {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    struct Wager has key, store {
        id: UID,
        player1: address,
        player2: address,
        amount: u64,
    }

    /// Creates a new wager between two players. Funds must be sent separately
    public fun create_wager(player1: address, player2: address, amount: u64, ctx: &mut TxContext): Wager {
        Wager {
            id: object::new(ctx),
            player1,
            player2,
            amount,
        }
    }

    /// Payout to the winner
    public fun payout(wager: Wager, winner: address) {
        // send the escrowed amount to the winner
        transfer::transfer(winner, wager.amount);
        // object is consumed
    }
}
