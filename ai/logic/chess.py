import chess
import random
from typing import Optional, Tuple

class ChessAgent:
    def __init__(self, dna_seed: bytes, strategy_hash: bytes):
        self.dna_seed = dna_seed
        self.strategy_hash = strategy_hash
        self.elo = 1200  # Initial ELO rating
        self.generation = 0

    def get_move(self, board: chess.Board) -> Optional[chess.Move]:
        """Get the next move based on the agent's strategy."""
        raise NotImplementedError("Subclasses must implement get_move")

class RandomAgent(ChessAgent):
    def get_move(self, board: chess.Board) -> Optional[chess.Move]:
        """Make a random legal move."""
        legal_moves = list(board.legal_moves)
        return random.choice(legal_moves) if legal_moves else None

class SimpleMinimaxAgent(ChessAgent):
    def __init__(self, dna_seed: bytes, strategy_hash: bytes, depth: int = 2):
        super().__init__(dna_seed, strategy_hash)
        self.depth = depth

    def get_move(self, board: chess.Board) -> Optional[chess.Move]:
        """Make a move using simple minimax algorithm."""
        def minimax(board: chess.Board, depth: int, maximizing: bool) -> Tuple[float, Optional[chess.Move]]:
            if depth == 0 or board.is_game_over():
                return self.evaluate_position(board), None

            best_move = None
            if maximizing:
                max_eval = float('-inf')
                for move in board.legal_moves:
                    board.push(move)
                    eval, _ = minimax(board, depth - 1, False)
                    board.pop()
                    if eval > max_eval:
                        max_eval = eval
                        best_move = move
                return max_eval, best_move
            else:
                min_eval = float('inf')
                for move in board.legal_moves:
                    board.push(move)
                    eval, _ = minimax(board, depth - 1, True)
                    board.pop()
                    if eval < min_eval:
                        min_eval = eval
                        best_move = move
                return min_eval, best_move

        _, best_move = minimax(board, self.depth, board.turn == chess.WHITE)
        return best_move

    def evaluate_position(self, board: chess.Board) -> float:
        """Simple position evaluation based on material."""
        if board.is_checkmate():
            return float('-inf') if board.turn == chess.WHITE else float('inf')
        if board.is_stalemate() or board.is_insufficient_material():
            return 0.0

        piece_values = {
            chess.PAWN: 1,
            chess.KNIGHT: 3,
            chess.BISHOP: 3,
            chess.ROOK: 5,
            chess.QUEEN: 9,
            chess.KING: 0
        }

        score = 0.0
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece:
                value = piece_values[piece.piece_type]
                score += value if piece.color == chess.WHITE else -value

        return score 