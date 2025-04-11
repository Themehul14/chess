// Chess Game Functionality
$(document).ready(function() {
    // Initialize variables
    let board = null;
    let game = null;
    let autoPlayInterval = null;
    let isAutoPlaying = false;
    
    // Initialize the chessboard
    function initBoard() {
        // Default starting position
        const config = {
            position: 'start',
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
            showNotation: true
        };
        
        // Initialize the board
        board = Chessboard('board', config);
        
        // Resize the board when window size changes
        $(window).resize(board.resize);
    }
    
    // Initialize game state
    function initGame() {
        $.ajax({
            url: '/api/game_state',
            method: 'GET',
            success: function(response) {
                updateGameDisplay(response);
            },
            error: function(error) {
                console.error('Error fetching game state:', error);
            }
        });
    }
    
    // Execute the next move
    function nextMove() {
        $.ajax({
            url: '/api/next_move',
            method: 'GET',
            success: function(response) {
                if (response.success) {
                    updateGameDisplay(response.state);
                    
                    // If game is over, stop auto play
                    if (response.state.game_over && isAutoPlaying) {
                        stopAutoPlay();
                    }
                } else {
                    console.log('Move not made. Game might be over.');
                    if (isAutoPlaying) {
                        stopAutoPlay();
                    }
                }
            },
            error: function(error) {
                console.error('Error making move:', error);
                if (isAutoPlaying) {
                    stopAutoPlay();
                }
            }
        });
    }
    
    // Reset the game
    function resetGame() {
        // Stop auto play if it's running
        if (isAutoPlaying) {
            stopAutoPlay();
        }
        
        $.ajax({
            url: '/api/reset_game',
            method: 'GET',
            success: function(response) {
                if (response.success) {
                    updateGameDisplay(response.state);
                    // Clear move history
                    $('#moves-list').empty();
                }
            },
            error: function(error) {
                console.error('Error resetting game:', error);
            }
        });
    }
    
    // Start auto play
    function startAutoPlay() {
        if (!isAutoPlaying) {
            isAutoPlaying = true;
            $('#auto-play-btn').text('Stop Auto Play');
            autoPlayInterval = setInterval(nextMove, 1000); // Make a move every second
        } else {
            stopAutoPlay();
        }
    }
    
    // Stop auto play
    function stopAutoPlay() {
        if (isAutoPlaying) {
            isAutoPlaying = false;
            $('#auto-play-btn').text('Auto Play');
            clearInterval(autoPlayInterval);
        }
    }
    
    // Update the game display with new state
    function updateGameDisplay(state) {
        // Update the board
        board.position(state.fen);
        
        // Update game info
        $('#current-player').text(state.current_player);
        $('#move-count').text(state.move_count);
        
        // Update game status
        if (state.game_over) {
            $('#game-status').text(state.result);
            // Disable next move button
            $('#next-move-btn').prop('disabled', true);
        } else {
            $('#game-status').text('In Progress');
            // Enable next move button
            $('#next-move-btn').prop('disabled', false);
        }
        
        // Update move history
        if (state.move_history && state.move_history.length > 0) {
            const latestMove = state.move_history[state.move_history.length - 1];
            
            const moveItem = $('<div class="move-item"></div>');
            const moveNumber = $('<span class="move-num"></span>').text(`${latestMove.move_number}.`);
            const movePlayer = $('<span class="move-player"></span>').text(latestMove.player);
            const moveText = $('<span class="move-text"></span>').text(latestMove.move);
            
            moveItem.append(moveNumber, movePlayer, moveText);
            $('#moves-list').append(moveItem);
            
            // Scroll to bottom of move history
            const movesList = document.getElementById('moves-list');
            movesList.scrollTop = movesList.scrollHeight;
        }
    }
    
    // Button event handlers
    $('#start-btn').click(function() {
        initGame();
    });
    
    $('#next-move-btn').click(function() {
        nextMove();
    });
    
    $('#auto-play-btn').click(function() {
        startAutoPlay();
    });
    
    $('#reset-btn').click(function() {
        resetGame();
    });
    
    // Initialize the board when the page loads
    initBoard();
    initGame();
}); 