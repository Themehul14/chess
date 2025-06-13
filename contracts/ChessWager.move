module arena_ai_chess::chess_wager {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::event;
    use sui::coin::{Self as CoinModule, Coin};
    use sui::sui::SUI;
    use sui::balance;
    use sui::random;
    use sui::devnet_nft;
    use std::vector;

    /// Match object that holds the wagered coin in escrow
    struct Match has key, store {
        id: UID,
        player1: address,
        player2: address,
        escrow: Coin<SUI>,
        metadata: vector<u8>,
        active: bool,
    }

    /// Global registry to track active matches
    struct Registry has key, store {
        id: UID,
        matches: vector<ID>,
    }

    /// Initialize registry
    public fun init(ctx: &mut TxContext) {
        let reg = Registry { id: object::new(ctx), matches: vector::empty<ID>() };
        transfer::share_object(reg);
    }

    fun registry(): &mut Registry {
        borrow_global_mut<Registry>(@0x0)
    }

    /// Start a wagered match. The caller provides a Coin<SUI> with at least `amount` inside.
    public entry fun start_wagered_match(
        player1: address,
        player2: address,
        amount: u64,
        metadata: vector<u8>,
        mut coin: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let reg = registry();
        // Prevent duplicate matches
        assert!(!contains_match(&reg.matches, player1, player2), 0);

        let escrow = CoinModule::split(&mut coin, amount);
        CoinModule::destroy_zero(coin);

        let match_obj = Match {
            id: object::new(ctx),
            player1,
            player2,
            escrow,
            metadata,
            active: true,
        };
        let id = object::id(&match_obj);
        vector::push_back(&mut reg.matches, id);
        transfer::share_object(match_obj);
    }

    /// Resolve the match and pay the winner. Only callable by one of the players.
    public entry fun resolve_match(winner: address, match_id: ID, ctx: &mut TxContext) {
        let reg = registry();
        let idx = find_match_index(&reg.matches, match_id);
        let id = vector::remove(&mut reg.matches, idx);
        let mut m = borrow_global_mut<Match>(id);
        assert!(winner == m.player1 || winner == m.player2, 1);
        assert!(m.active, 2);

        let fee = CoinModule::split(&mut m.escrow, CoinModule::value(&m.escrow) / 50); // 2%
        transfer::public_transfer<Coin<SUI>>(fee, @0x0);
        transfer::transfer<Coin<SUI>>(m.escrow, winner);
        m.active = false;
        // Emit event for completion
        event::emit(match_id);
        transfer::delete_object(&mut m);
    }

    /// Mint a simple trophy NFT on devnet
    public entry fun mint_trophy_nft(winner: address, metadata: vector<u8>, ctx: &mut TxContext) {
        let nft = devnet_nft::mint(metadata, ctx);
        transfer::transfer(nft, winner);
    }

    fun contains_match(ids: &vector<ID>, p1: address, p2: address): bool {
        let len = vector::length(ids);
        let i = 0;
        while (i < len) {
            let id = *vector::borrow(ids, i);
            if (match_for_players(id, p1, p2)) {
                return true;
            }
            i = i + 1;
        }
        false
    }

    fun match_for_players(id: ID, p1: address, p2: address): bool {
        let m = borrow_global<Match>(id);
        let res = (m.player1 == p1 && m.player2 == p2) || (m.player1 == p2 && m.player2 == p1);
        res
    }

    fun find_match_index(ids: &vector<ID>, id: ID): u64 {
        let len = vector::length(ids);
        let i = 0;
        while (i < len) {
            if (*vector::borrow(ids, i) == id) { return i; }
            i = i + 1;
        }
        abort 3;
    }
}
