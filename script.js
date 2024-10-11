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
    'r': '♞', 'R': '♖',
    'n': '♟', 'N': '♘',
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

    if (move === null) return 'snapback';
    
    renderMoveHistory(game.history());
    
    if (game.game_over()) {
        alert('Game over');
    } else {
        makeBestMove();
    }
}

function onSnapEnd() {
    board.position(game.fen());
    renderBoard();
}

function renderMoveHistory(moves) {
    const historyElement = $('#status');
    historyElement.empty();
    historyElement.append(moves.join(', '));
}

function makeBestMove() {
    const possibleMoves = game.ugly_moves();
    if (possibleMoves.length === 0) return;

    const bestMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    
    if (game.game_over()) {
        alert('Game over');
    }
}

function renderBoard() {
    const boardElement = $('#board');
    boardElement.empty();
    
    const squares = boardElement.find('.square');
    for (let i = 0; i < 64; i++) {
        const square = squares[i];
        const piece = game.board()[Math.floor(i / 8)][i % 8];
        $(square).html(piece ? pieceUnicode[piece] : '');
    }
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

renderBoard();
