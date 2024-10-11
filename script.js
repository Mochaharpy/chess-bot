const board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    squareClass: 'square'
});

const game = new Chess();

const pieceUnicode = {
    'p': '♟', 'P': '♙',
    'r': '♖', 'R': '♖',
    'n': '♞', 'N': '♘',
    'b': '♝', 'B': '♗',
    'q': '♛', 'Q': '♕',
    'k': '♚', 'K': '♔'
};

function onDragStart(source, piece) {
    if (game.in_checkmate() || game.in_draw() || piece.search('w') === -1) {
        return false;
    }
}

function onDrop(source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // promote to a queen
    });

    // If the move is illegal, snap back the piece
    if (move === null) return 'snapback';

    renderMoveHistory(game.history());

    // Check for game over conditions
    if (game.game_over()) {
        alert('Game over');
    } else {
        makeBestMove();
    }
}

function onSnapEnd() {
    board.position(game.fen());
}

function renderMoveHistory(moves) {
    const historyElement = $('#status');
    historyElement.empty();
    historyElement.append(moves.join(', '));
}

function makeBestMove() {
    const possibleMoves = game.ugly_moves();
    if (possibleMoves.length === 0) return;

    // Choose a random legal move for the bot
    const bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());

    if (game.game_over()) {
        alert('Game over');
    }
}

function renderBoard() {
    const squares = $('#board').find('.square');
    squares.each(function(index) {
        const piece = game.board()[Math.floor(index / 8)][index % 8];
        $(this).html(piece ? pieceUnicode[piece] : '');
    });
}

$('#startBtn').on('click', () => {
    game.reset();
    board.start();
    renderBoard();
});

$('#clearBtn').on('click', () => {
    game.clear();
    board.clear();
    renderBoard();
});

// Initial rendering of the board
renderBoard();
