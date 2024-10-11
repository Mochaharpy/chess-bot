const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});

const game = new Chess();

function onDragStart (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search('w') === -1) {
        return false;
    }
}

function onDrop (source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // promote to a queen
    });

    removeGreySquares();
    
    if (move === null) return 'snapback';

    renderMoveHistory(game.history());
    
    if (game.game_over()) {
        alert('Game over');
    } else {
        makeBestMove();
    }
}

function onSnapEnd () {
    board.position(game.fen());
}

function renderMoveHistory (moves) {
    const historyElement = $('#status');
    historyElement.empty();
    historyElement.empty();
    historyElement.append(moves.join(', '));
}

function makeBestMove() {
    const possibleMoves = game.ugly_moves();
    let bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    
    // For different difficulty levels, you can implement Minimax or adjust this logic
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    
    if (game.game_over()) {
        alert('Game over');
    }
}

function removeGreySquares() {
    $('#board .square-55d63').css('background', '');
}

$('#startBtn').on('click', board.start);
$('#clearBtn').on('click', board.clear);
