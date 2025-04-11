import chess
import random
import time
from typing import Tuple, Optional
from logic.chess import ChessAgent, RandomAgent, SimpleMinimaxAgent

def create_agents() -> Tuple[ChessAgent, ChessAgent]:
    """Create two agents with random DNA seeds."""
    dna_seed1 = random.randbytes(32)
    dna_seed2 = random.randbytes(32)
    strategy_hash1 = random.randbytes(32)
    strategy_hash2 = random.randbytes(32)

    # Create one random agent and one minimax agent
    agent1 = RandomAgent(dna_seed1, strategy_hash1)
    agent2 = SimpleMinimaxAgent(dna_seed2, strategy_hash2, depth=2)
    
    return agent1, agent2

def display_board(board: chess.Board, move_number: int, current_player: str):
    """Display the current board state."""
    print("\n" + "="*50)
    print(f"Move #{move_number} - {current_player} to play")
    print(board)
    print("="*50 + "\n")

def play_game(white_agent: ChessAgent, black_agent: ChessAgent, show_board: bool = True, delay: float = 0.5) -> Tuple[Optional[int], int]:
    """
    Play a game between two agents.
    Returns (result, move_count) where:
    - result: 0 for white win, 1 for black win, 2 for draw
    - move_count: number of moves played
    """
    board = chess.Board()
    move_count = 0
    
    if show_board:
        display_board(board, move_count, "White")
    
    while not board.is_game_over():
        current_player = "White" if board.turn == chess.WHITE else "Black"
        move_count += 1
        
        if board.turn == chess.WHITE:
            move = white_agent.get_move(board)
            agent_type = "RandomAgent" if isinstance(white_agent, RandomAgent) else "MinimaxAgent"
        else:
            move = black_agent.get_move(board)
            agent_type = "RandomAgent" if isinstance(black_agent, RandomAgent) else "MinimaxAgent"

        if move is None:
            break

        # Display move info
        print(f"Move #{move_count}: {current_player} ({agent_type}) plays {board.san(move)}")
        
        board.push(move)
        
        if show_board:
            display_board(board, move_count, "Black" if current_player == "White" else "White")
            time.sleep(delay)  # Delay to make it easier to follow

    # Determine game result
    if board.is_checkmate():
        result = 1 if board.turn == chess.WHITE else 0  # Current player lost
        print(f"Checkmate! {'Black' if board.turn == chess.WHITE else 'White'} wins!")
    elif board.is_stalemate():
        result = 2  # Draw
        print("Stalemate! Game is a draw.")
    elif board.is_insufficient_material():
        result = 2  # Draw
        print("Insufficient material! Game is a draw.")
    else:
        result = 2  # Draw for other termination conditions
        print("Game ended in a draw.")

    return result, move_count

def main():
    print("🎮 Arena AI Chess - Agent vs Agent Simulation 🎮")
    print("\nCreating agents...")
    
    # Create agents
    agent1, agent2 = create_agents()
    print("White: RandomAgent (ELO: 1200)")
    print("Black: MinimaxAgent (ELO: 1200, Depth: 2)")
    
    print("\nStarting game simulation...")
    # Play a game
    result, move_count = play_game(agent1, agent2)
    
    # Print results
    result_str = {
        0: "White wins",
        1: "Black wins",
        2: "Draw"
    }[result]
    
    print("\n🏆 Game Results 🏆")
    print(f"Game completed in {move_count} moves")
    print(f"Result: {result_str}")
    print(f"White agent ELO: {agent1.elo}")
    print(f"Black agent ELO: {agent2.elo}")

if __name__ == "__main__":
    main() 