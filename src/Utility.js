const {
	white_pieces, black_pieces, rows, cols, white_bishop, white_knight, white_rook, white_pawn, white_king, white_queen, black_king, black_queen, black_bishop, black_knight, black_rook, black_pawn, null_piece
} = require("./constants")

class PawnPromotion extends Error {
	constructor(message) {
		super(message)
		this.name = "PawnPromotion"
	}
}

function generateRandomString(N=10) {
	// Returns an alphanumeric string of N characters
	let result           = '';
	const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( var i = 0; i < N; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
 return result;
}
		
function getType(piece) {
	if ( [white_king, black_king].includes(piece) ) return "king"
	if ( [white_queen, black_queen].includes(piece) ) return "queen"
	if ( [white_bishop, black_bishop].includes(piece) ) return "bishop"
	if ( [white_knight, black_knight].includes(piece) ) return "knight"
	if ( [white_rook, black_rook].includes(piece) ) return "rook"
	if ( [white_pawn, black_pawn].includes(piece) ) return "pawn"
	throw "Invalid Piece!"
}

function promotePawn(pawn_location, promoted, board) {
	let [row_index, col_index] = getIndex(pawn_location)
	let index = calculateIndex(row_index, col_index) 
	let pawn  = board[index]
	pawn.piece = { 
		name: promoted,
		moves: pawn.piece.moves
	}
}

function checkPromotion(source_piece, target_location) {
	let valid_white =  ["8a", "8b", "8c", "8d", "8e", "8f", "8g", "8h", ]
	let valid_black =  ["1a", "1b", "1c", "1d", "1e", "1f", "1g", "1h", ]
	let piece = getType(source_piece)
	if (piece !== "pawn") return false
	let color = getPieceColor(source_piece)
	if (color === "white") return valid_white.includes(target_location)
	if (color === "black") return valid_black.includes(target_location)
	return false
}

function removePiece(location, board) {
	// clears `location` from `can_kill` and `can_move` of all elements in `board`
	function filterPiece(each) {
		if (each.can_kill) each.can_kill = each.can_kill.filter(each => each !== location)
		if (each.can_move) each.can_move = each.can_move.filter(each => each !== location)
		return each
	}
	return board.map(filterPiece)
}

function movePiece(source_location, target_location, board) {
	let new_board = cloneBoard(board)
	let [rowa, cola] = getIndex(source_location)
	let [rowb, colb] = getIndex(target_location)
	let a = new_board[calculateIndex(rowa, cola)]
	let b = new_board[calculateIndex(rowb, colb)]
	if (b.piece.name) throw "movePiece Error!"
	// switches the pieces
	let moved_piece = JSON.parse(JSON.stringify(a.piece)) // copy object direct not by reference (prevent wierd bugs with pawns, since all pawns initially reference the same object)
	moved_piece.moves += 1
	a.piece  = null_piece
	b.piece = moved_piece
	// removes all possible moves previously associated with the original location
	new_board = removePiece(source_location, new_board)
	// clear `can_move` for destination (since it is now occupied)
	b.can_move = null
	b.can_kill = null // not necesssary since can_kill for an empty piece should be null, but just in case
	// throw PawnPromotion
	return new_board
}

function killPiece(source_location, target_location, board) {
	let new_board = cloneBoard(board)
	let [rowa, cola] = getIndex(source_location)
	let [rowb, colb] = getIndex(target_location)
	let a = new_board[calculateIndex(rowa, cola)]
	let b = new_board[calculateIndex(rowb, colb)]
	if (!b.piece.name) throw "killPiece Error!"
	// switches the pieces
	let moved_piece = JSON.parse(JSON.stringify(a.piece)) // copy object direct not by reference (prevent wierd bugs with pawns, since all pawns initially reference the same object)
	let killed_piece = JSON.parse(JSON.stringify(b.piece)) // copy object direct not by reference (prevent wierd bugs with pawns, since all pawns initially reference the same object)
	moved_piece.moves += 1
	a.piece  = null_piece
	b.piece = moved_piece
	// removes all possible moves previously associated with the original location
	new_board = removePiece(source_location, new_board)
	// removes all possible moves previously associated with the killed target
	new_board = removePiece(target_location, new_board)
	// clear `can_move` for destination (since it is now occupied)
	b.can_move = null
	b.can_kill = null
	return [new_board, killed_piece.name]
}

function getIndex(location) {
	let [row, col] = location
	let row_index = rows.indexOf(row)
	let col_index = cols.indexOf(col)
	return [row_index, col_index]
}

function cloneBoard(board) {
	let new_board = board.map(each => { return {...each}})
	return new_board
}

function calculateIndex(row, col) {
	// calculates the index in `board_array` given the position e.g `3h`
	// the board is arranged [8a, 8b, .., 7a, 7b, .., ... , 1a, 1b, ...]
	return 8 * (7 - row ) + col
}

function getPieceColor(piece) {
	if (white_pieces.includes(piece)) return "white"
	if (black_pieces.includes(piece)) return "black"
	return null
}

function sortMoves(a, b) {
	return b[0] > a[0] ? -1 : 1
}

function search(board_position, moves) {
	// search for `board_position` in moves. returns -1 if it doesn't exist
	let i = 0
	let n = moves.length
	if (moves[0][0] >= board_position) return moves[i][0] === board_position ? i: -1
	for (let b=~~(n/2); b>0; b=~~(b/2)) {
		for(;b+i < n && moves[b+i][0] < board_position;)  i += b
	}
	if (i+1 >= n) return -1
	return moves[i+1][0] === board_position ? i+1: -1
}

function generateMoveForBoard(board) {
	let moves = [] ///1 1
	let possible_moves /// 1 1
	for (let each of board) { // goes through board and adds valid moves for pieces to the array
		if (each.piece.name) { /// 1 n
			let type = getType(each.piece.name) ///12 n // guaranteed to have a valid type
			let piece_color = getPieceColor(each.piece.name) ///12 n
			switch (type) {
				case "king":   possible_moves = kingCapture(each.position, board, piece_color) ///108 n
					break;
				case "queen":	 possible_moves = queenCapture(each.position, board, piece_color) ///672 n
					break;
				case "bishop": possible_moves = bishopCapture(each.position, board, piece_color) ///336 n
					break;
				case "knight": possible_moves = knightCapture(each.position, board, piece_color) ///192 n
					break;
				case "rook":   possible_moves = rookCapture(each.position, board, piece_color) ///336 n
					break;
				case "pawn":   possible_moves = pawnCapture(each.position, board, piece_color)///34 n
					break;
				default:
					throw "Error generating moves!"
			}
			moves = moves.concat(possible_moves) //m
		}
	}
	for (let each of board) { // clear previously generated moves for board (prevents wierd bugs)
		each.can_kill = null
		each.can_move = null
	}
	moves.sort(sortMoves)///nlogn // array need to be sorted in order to be able to search for positions
	let k
	// goes through each position in the board and looks for positions of pieces that can kill it or move to it
	for (let square of board) {//  1 n
		if (!moves.length) break
		k = search(square.position, moves) ///nlogn
		// console.log(board[i].position, k)
		if (k === -1) continue
		// for locations without valid moves, clear can_kill and can_move (prevent wierd bugs) and go to next location
		// 	square.can_kill = null
		// 	square.can_move = null
		// 	continue
		// }

		// moves[k][0] => the position that is to be killed, or moved into
		// moves[k][1] => the position that is doing the moving / killing
		// Array<[dest, src]>
		do {
			if (square.piece.name) { // if there is a piece at the location, it is to be killed
				if (square.can_kill) {
					// when key `can_kill` is not empty
					square.can_kill.push(moves[k][1])
				}
				else {
					// key `can_kill` is initially at null, handles for when it is null
					square.can_kill = [moves[k][1]]
				}
			}
			else { // if there isnt a piece at the location, it is a valid move
				if (square.can_move) {
					// when key `can_move` is not empty
					// if (!square.can_move.includes(moves[k][1]))
					square.can_move.push(moves[k][1])
				}
				else {
					// key `can_move` is initially at null, handles for when it is null
					// console.log(square.can_move, moves[k][1])
					square.can_move = [moves[k][1]]
				}
			}
			moves.splice(k, 1) ///n n sqrt(n)
			if (!moves.length) break
			// console.log(moves)
			k = search(square.position, moves) ///n sqrt(n) logn 
		} while (k !== -1)
	}
	// console.log(board)
}

function kingCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png
	// assumes the piece at `location` is a king and `color` is its color
	// returns an array of location pairs [killed_location, king_location]
	let [row_index, col_index] = getIndex(location)
	let index = calculateIndex(row_index, col_index) 
	let ans = []

	let square = board[index] // gets object representing location from board array
	// square.isSelected = true  // ???

	for (let i=row_index-1 ; i < row_index+2  ; i++) {
		for (let j=col_index-1 ; j < col_index+2  ; j++) {
			if (i===row_index && j===col_index) continue
			if (i<0 || i>=8) continue
			if (j<0 || j>=8) continue
			// console.log(i, j)
			let board_index = calculateIndex(i, j) 
			let active_square  =  board[board_index]

			if (getPieceColor(active_square.piece.name) === color) continue  // prevents killing pieces in the same family
			// if (active_square.piece.name) active_square.isKill = true
			// else active_square.isActive = true
			ans.push([active_square.position, square.position])
		}
	}
	// castling
	return ans
}

function knightCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chess_xot45.svg/33px-Chess_xot45.svg.png
	// Set possible moves for the knight
	// assumes the piece at `location` is a knight and `color` is its color

	let [row_index, col_index] = getIndex(location)

	let index = calculateIndex(row_index, col_index)
	let ans = []

	let square = board[index]
	// square.isSelected = true

	for (let i=row_index-2 ; i < row_index+3 ; i++) {
		for (let j=col_index-2 ; j < col_index+3 ; j++) {
			if (i < 0 || i >= 8) continue
			if (j < 0 || j >= 8) continue
			if (i === row_index) continue
			if (j === col_index) continue

			if (Math.abs(i - row_index) === Math.abs(j - col_index)) continue

			let board_index = calculateIndex(i, j)
			let active_square  =  board[board_index]
			if (getPieceColor(active_square.piece.name) === color) continue  // prevents killing pieces in the same family
			// if (active_square.piece) active_square.isKill = true
			// else active_square.isActive = true
			ans.push([active_square.position, square.position])
		}
	}
	return ans
}

function rookCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/33px-Chess_rlt45.svg.png
	// Set possible moves for the rook
	// assumes the piece at `location` is a knight and `color` is its color

	let [row_index, col_index]  = getIndex(location)
	let up_isblocked    = false
	let down_isblocked  = false
	let right_isblocked = false
	let left_isblocked  = false

	let index = calculateIndex(row_index, col_index)
	let square = board[index]
	let ans = []
	
	for (let i=1; i<8 ; i++) { 
		if (!up_isblocked && row_index + i < 8) { // all pieces above the rook. `up_isblocked` stops sliding if true
			let up =  calculateIndex(row_index+i, col_index)
			let up_square  =  board[up]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(up_square.piece.name) === color) up_isblocked = true
			else if (up_square.piece.name) { ans.push([up_square.position, square.position]); up_isblocked = true }
			else ans.push([up_square.position, square.position])
		}
		if (!down_isblocked && row_index - i >= 0) { // all pieces below the rook. `down_isblocked` stops sliding if true
			let down =  calculateIndex(row_index-i, col_index)
			let down_square  =  board[down]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(down_square.piece.name) === color) down_isblocked = true
			else if (down_square.piece.name) { ans.push([down_square.position, square.position]); down_isblocked = true }
			else ans.push([down_square.position, square.position])
		}
		if (!right_isblocked && col_index + i < 8) { // all pieces to right of the rook. `right_isblocked` stops sliding if true
			let right =  calculateIndex(row_index, col_index+i)
			let right_square  =  board[right]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(right_square.piece.name) === color) right_isblocked = true
			else if (right_square.piece.name) { ans.push([right_square.position, square.position]); right_isblocked = true }
			else ans.push([right_square.position, square.position])
		}
		if (!left_isblocked && col_index - i >= 0) { // all pieces to left of the rook. `left_isblocked` stops sliding if true
			let left =  calculateIndex(row_index, col_index-i)
			let left_square  =  board[left]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(left_square.piece.name) === color) left_isblocked = true
			else if (left_square.piece.name) { ans.push([left_square.position, square.position]); left_isblocked = true }
			else ans.push([left_square.position, square.position])
		}
	}
	return ans
}

function bishopCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png
	// Sets the possible moves for the bishop
	// assumes the piece at `location` is a bishop and `color` is its color

	let [row_index, col_index] = getIndex(location)
	let ne_isblocked = false
	let nw_isblocked = false
	let se_isblocked = false
	let sw_isblocked = false

	let index =  calculateIndex(row_index, col_index)
	let square = board[index]
	let ans = []

	for (let i=1; i<8 ; i++) {
		if ( !ne_isblocked && (row_index + i < 8 && col_index + i < 8) ) { // all pieces to north-east of the rook. `ne_isblocked` stops sliding if true
			let ne = calculateIndex(row_index+i, col_index+i)
			let ne_square  =  board[ne]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(ne_square.piece.name) === color) ne_isblocked = true
			else if (ne_square.piece.name) { ans.push([ne_square.position, square.position]); ne_isblocked = true }
			else ans.push([ne_square.position, square.position])
		}
		if (!nw_isblocked && (row_index + i < 8 && col_index - i >= 0) ) { // all pieces to north-west of the rook. `nw_isblocked` stops sliding if true
			let nw =  calculateIndex(row_index+i,col_index-i)
			let nw_square  =  board[nw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(nw_square.piece.name) === color) nw_isblocked = true
			else if (nw_square.piece.name) { ans.push([nw_square.position, square.position]); nw_isblocked = true }
			else ans.push([nw_square.position, square.position])
		}
		if ( !se_isblocked &&  (row_index - i >= 0 && col_index + i < 8)) { // all pieces to south-east of the rook. `se_isblocked` stops sliding if true
			let se =  calculateIndex(row_index-i, col_index+i)
			let se_square  =  board[se]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(se_square.piece.name) === color) se_isblocked = true
			else if (se_square.piece.name) { ans.push([se_square.position, square.position]); se_isblocked = true }
			else ans.push([se_square.position, square.position])
		}
		if ( !sw_isblocked && (row_index - i >= 0 && col_index - i >= 0) ) { // all pieces to south-west of the rook. `sw_isblocked` stops sliding if true
			let sw =  calculateIndex(row_index-i, col_index-i)
			let sw_square  =  board[sw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(sw_square.piece.name) === color) sw_isblocked = true  // prevents killing pieces in the same family
			else if (sw_square.piece.name) { ans.push([sw_square.position, square.position]); sw_isblocked = true }
			else ans.push([sw_square.position, square.position])
		}
	}
	return ans
}

function queenCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chess_xot45.svg/33px-Chess_xot45.svg.png
	// Sets the possible moves for the bishop
	// assumes the piece at `location` is a bishop and `color` is its color

	let [row_index, col_index]  = getIndex(location)
	let up_isblocked    = false
	let down_isblocked  = false
	let right_isblocked = false
	let left_isblocked  = false
	let ne_isblocked = false
	let nw_isblocked = false
	let se_isblocked = false
	let sw_isblocked = false

	let index = calculateIndex(row_index, col_index)
	let square = board[index]
	let ans = []
	
	for (let i=1; i<8 ; i++) {
		if (!up_isblocked && row_index + i < 8) { // all pieces above the rook. `up_isblocked` stops sliding if true
			let up =  calculateIndex(row_index+i, col_index)
			let up_square  =  board[up]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(up_square.piece.name) === color) up_isblocked = true
			else if (up_square.piece.name) { ans.push([up_square.position, square.position]); up_isblocked = true }
			else ans.push([up_square.position, square.position])
		}
		if (!down_isblocked && row_index - i >= 0) { // all pieces below the rook. `down_isblocked` stops sliding if true
			let down =  calculateIndex(row_index-i, col_index)
			let down_square  =  board[down]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(down_square.piece.name) === color) down_isblocked = true
			else if (down_square.piece.name) { ans.push([down_square.position, square.position]); down_isblocked = true }
			else ans.push([down_square.position, square.position])
		}
		if (!right_isblocked && col_index + i < 8) { // all pieces to right of the rook. `right_isblocked` stops sliding if true
			let right =  calculateIndex(row_index, col_index+i)
			let right_square  =  board[right]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(right_square.piece.name) === color) right_isblocked = true
			else if (right_square.piece.name) { ans.push([right_square.position, square.position]); right_isblocked = true }
			else ans.push([right_square.position, square.position])
		}
		if (!left_isblocked && col_index - i >= 0) { // all pieces to left of the rook. `left_isblocked` stops sliding if true
			let left =  calculateIndex(row_index, col_index-i)
			let left_square  =  board[left]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(left_square.piece.name) === color) left_isblocked = true
			else if (left_square.piece.name) { ans.push([left_square.position, square.position]); left_isblocked = true }
			else ans.push([left_square.position, square.position])
		}
		if ( !ne_isblocked && (row_index + i < 8 && col_index + i < 8) ) { // all pieces to north-east of the rook. `ne_isblocked` stops sliding if true
			let ne = calculateIndex(row_index+i, col_index+i)
			let ne_square  =  board[ne]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(ne_square.piece.name) === color) ne_isblocked = true
			else if (ne_square.piece.name) { ans.push([ne_square.position, square.position]); ne_isblocked = true }
			else ans.push([ne_square.position, square.position])
		}
		if (!nw_isblocked && (row_index + i < 8 && col_index - i >= 0) ) { // all pieces to north-west of the rook. `nw_isblocked` stops sliding if true
			let nw =  calculateIndex(row_index+i,col_index-i)
			let nw_square  =  board[nw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(nw_square.piece.name) === color) nw_isblocked = true
			else if (nw_square.piece.name) { ans.push([nw_square.position, square.position]); nw_isblocked = true }
			else ans.push([nw_square.position, square.position])
		}
		if ( !se_isblocked &&  (row_index - i >= 0 && col_index + i < 8)) { // all pieces to south-east of the rook. `se_isblocked` stops sliding if true
			let se =  calculateIndex(row_index-i, col_index+i)
			let se_square  =  board[se]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(se_square.piece.name) === color) se_isblocked = true
			else if (se_square.piece.name) { ans.push([se_square.position, square.position]); se_isblocked = true }
			else ans.push([se_square.position, square.position])
		}
		if ( !sw_isblocked && (row_index - i >= 0 && col_index - i >= 0) ) { // all pieces to south-west of the rook. `sw_isblocked` stops sliding if true
			let sw =  calculateIndex(row_index-i, col_index-i)
			let sw_square  =  board[sw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(sw_square.piece.name) === color) sw_isblocked = true  // prevents killing pieces in the same family
			else if (sw_square.piece.name) { ans.push([sw_square.position, square.position]); sw_isblocked = true }
			else ans.push([sw_square.position, square.position])
		}
	}
	return ans
}

function pawnCapture (location, board, color) {
	// Set possible moves the pawn
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png

	let [row_index, col_index] = getIndex(location)
	let index =  calculateIndex(row_index, col_index)
	let square = board[index]

	let isblocked = false
	let multiplier = "white" === color ? 1 : -1 // white pawn moves up, black moves down
	let ans = []
	// let en_passant_rows = [3, 4]
	// En-passant
	// https://en.wikipedia.org/wiki/Chess#En_passant
	// if (en_passant_rows.includes(row_index)) {
	// }

	for (let i=1 ; i < 3  ; i++) {
		if (row_index+multiplier*i >= 8) continue //stops at the end of the board
		if (row_index+multiplier*i <  0) continue //stops at the end of the board
		if (isblocked) continue
		if (i === 2 && square.piece.moves !== 0) continue // skips if it is not first move

		// killing pieces left and right
		if (i === 1 && col_index-i >=0) {
			let left  = calculateIndex(row_index+multiplier*i, col_index-i) // multiplier determines if it moves up or down
			let left_square  = board[left]
			if (getPieceColor(left_square.piece.name) !== color && left_square.piece.name) ans.push([left_square.position, square.position])
		}
		if (i === 1 && col_index+i < 8) {
			let right = calculateIndex(row_index+multiplier*i, col_index+i) // multiplier determines if it moves up or down
			let right_square = board[right]
			if (getPieceColor(right_square.piece.name) !== color && right_square.piece.name) ans.push([right_square.position, square.position])
		}
		// check movement for i=1 (and i=2 when its pawns first move)
		let board_index = calculateIndex(row_index+multiplier*i, col_index)
		let active_square  =  board[board_index]

		if (active_square.piece.name) isblocked = true
		else ans.push([active_square.position, square.position])
	}
	return ans
}

module.exports = {
	getIndex,
	kingCapture,
	knightCapture,
	rookCapture,
	bishopCapture,
	queenCapture,
	pawnCapture,
	generateRandomString,
	generateMoveForBoard,
	getPieceColor,
	getIndex,
	calculateIndex,
	movePiece,
	killPiece,
	promotePawn,
	PawnPromotion,
	checkPromotion,
}