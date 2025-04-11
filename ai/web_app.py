import chess
import json
import random
from flask import Flask, render_template, jsonify
from logic.chess import RandomAgent, SimpleMinimaxAgent

# Initialize Flask app with explicit static and template folder paths
app = Flask(__name__, 
           template_folder='/'.join(__file__.split('/')[:-1] + ['templates']),
           static_folder='/'.join(__file__.split('/')[:-1] + ['static']))

class GameManager:
    def __init__(self):
        self.board = chess.Board()
        self.white_agent = RandomAgent(random.randbytes(32), random.randbytes(32))
        self.black_agent = SimpleMinimaxAgent(random.randbytes(32), random.randbytes(32), depth=2)
        self.move_history = []
        self.game_over = False
        self.result = None
        self.current_player = "White"
        self.move_count = 0
    
    def next_move(self):
        """Make the next move in the game."""
        if self.game_over:
            return False
        
        # Get the current move
        if self.board.turn == chess.WHITE:
            move = self.white_agent.get_move(self.board)
            agent_type = "RandomAgent"
        else:
            move = self.black_agent.get_move(self.board)
            agent_type = "MinimaxAgent"
        
        if move is None:
            self.game_over = True
            self.result = "Stalemate"
            return False
        
        # Make the move
        san_move = self.board.san(move)
        self.board.push(move)
        self.move_count += 1
        
        # Record the move
        self.move_history.append({
            "move": san_move,
            "player": "White" if self.board.turn == chess.BLACK else "Black",
            "agent": agent_type,
            "fen": self.board.fen(),
            "move_number": self.move_count
        })
        
        # Check if the game is over
        if self.board.is_game_over():
            self.game_over = True
            if self.board.is_checkmate():
                self.result = "Black wins" if self.board.turn == chess.WHITE else "White wins"
            elif self.board.is_stalemate():
                self.result = "Draw by stalemate"
            elif self.board.is_insufficient_material():
                self.result = "Draw by insufficient material"
            else:
                self.result = "Draw"
        
        self.current_player = "White" if self.board.turn == chess.WHITE else "Black"
        return True
    
    def reset_game(self):
        """Reset the game to start a new one."""
        self.board = chess.Board()
        self.white_agent = RandomAgent(random.randbytes(32), random.randbytes(32))
        self.black_agent = SimpleMinimaxAgent(random.randbytes(32), random.randbytes(32), depth=2)
        self.move_history = []
        self.game_over = False
        self.result = None
        self.current_player = "White"
        self.move_count = 0
        return True
    
    def get_board_state(self):
        """Get the current board state as FEN string."""
        return self.board.fen()
    
    def get_legal_moves(self):
        """Get all legal moves from the current position."""
        return [self.board.san(move) for move in self.board.legal_moves]
    
    def get_game_state(self):
        """Get the complete game state as a dictionary."""
        return {
            "fen": self.board.fen(),
            "current_player": self.current_player,
            "move_count": self.move_count,
            "game_over": self.game_over,
            "result": self.result,
            "move_history": self.move_history,
            "white_agent": "RandomAgent",
            "black_agent": "MinimaxAgent (Depth: 2)"
        }

# Create a game manager
game_manager = GameManager()

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/api/next_move', methods=['GET'])
def next_move():
    """Make the next move in the game."""
    success = game_manager.next_move()
    return jsonify({"success": success, "state": game_manager.get_game_state()})

@app.route('/api/reset_game', methods=['GET'])
def reset_game():
    """Reset the game to start a new one."""
    success = game_manager.reset_game()
    return jsonify({"success": success, "state": game_manager.get_game_state()})

@app.route('/api/game_state', methods=['GET'])
def game_state():
    """Get the current game state."""
    return jsonify(game_manager.get_game_state())

# For Vercel, we need to export the app
app.debug = False

# The following is only executed when the script is run directly
if __name__ == '__main__':
    app.run(debug=True) 