const {
	white_pieces, black_pieces, rows, cols, white_bishop, white_knight, white_rook, white_pawn, white_king, white_queen, black_king, black_queen, black_bishop, black_knight, black_rook, black_pawn, null_piece
} = require("./constants")

class PawnPromotion extends Error {
	constructor(message) {
		super(message)
		this.name = "PawnPromotion"
	}
}

function getPieceFromPosition(location, board) {
	let [row, col] = getIndex(location)
	return board[calculateIndex(row, col)].piece.name
}

function getPiece(location, board) {
	let [row, col] = getIndex(location)
	return board[calculateIndex(row, col)]
}

function filterMovesForKing(moves, color, board) {
	return moves.map(each => getPieceColor(getPieceFromPosition(each, board))).filter(each => each !== color).length
}

function checkNoPawnKill(piece, color, board) {
	let multiplier = color === "white" ? true : false
	const cols = "abcdefgh"
	const rows = "12345678"
	let pos = piece.position
	// if white a pawn above can kill
	if (multiplier){
		let new_row = rows[rows.indexOf(pos.charAt(0))+1]
		let l_col = cols[cols.indexOf(pos.charAt(1))-1]
		let r_col = cols[cols.indexOf(pos.charAt(1))+1]
		let left  = pos.charAt(1) !== "a" && pos.charAt(0) !== "8" ?  getPieceFromPosition(new_row+l_col, board) : null
		let right = pos.charAt(1) !== "h" && pos.charAt(0) !== "8" ?  getPieceFromPosition(new_row+r_col, board) : null
		console.log(color, left, right, new_row, l_col, r_col)
		if (left  && (getType(left)==="pawn"  && getPieceColor(left)  !== color)) return false
		if (right && (getType(right)==="pawn" && getPieceColor(right) !== color)) return false
		return true
	}
	// if black a pawn below can kill
	else {
		let new_row = rows[rows.indexOf(pos.charAt(0))-1]
		let l_col = cols[cols.indexOf(pos.charAt(1))-1]
		let r_col = cols[cols.indexOf(pos.charAt(1))+1]
		let left  = pos.charAt(1) !== "a" && pos.charAt(0) !== "1" ?  getPieceFromPosition(new_row+l_col, board) : null
		let right = pos.charAt(1) !== "h" && pos.charAt(0) !== "1" ?  getPieceFromPosition(new_row+r_col, board) : null
		console.log(color, left, right, new_row, l_col, r_col)
		// if (left && getType(left)==="pawn")   return false
		if (left  && (getType(left)==="pawn"  && getPieceColor(left)  !== color)) return false
		if (right && (getType(right)==="pawn" && getPieceColor(right) !== color)) return false
		// if (right && getType(right)==="pawn") return false
		return true
	}
}

function checkForPawn(moves, color, board) {
	let count = 0
	let last
	for (let each of moves) {
		let piece = getPieceFromPosition(each, board)
		let piece_color =  getPieceColor(piece)
		if (piece_color === color) continue
		count++
		last = piece
	}
	if (count === 1) return getType(last) === "pawn"
	return false
}
/**
 * 
	On an empty space
	- If all the pieces that can move are same color as king, then it is valid
	- if there's only a pawn of opposite color, the pawn doesnt pose a threat ( since it can't move/kill forward when blocked)
	- If enemy pieces can move to the same place, then king cannot move to that place cause of the risk of being killed

	On an occupied space
	- If all the pieces that can move are same color as king, then it is valid
	- If an enemy piece is friendly (a piece of the color that can move if occupied piece moves) , the king cannot move
 * @param {string} white_k  The position of white king
 * @param {string} black_k  The position of white king
 * @param  moves  array of all valid moves
 * @param  board array representing the board
 * @returns {boolean} If the current move doesnt affect the king
 */
function validateKingNotAffected(white_k, black_k, k, moves, friends, board) {
	// the move at `moves[k][1]` is guaranteed to be a king (since we go through a separate for loop for king only - as of the time this was commented)
	let color = white_k === moves[k][1] ? "white" : "black" // color of the king
	// friends.sort(sortMoves)
	// console.log(friends)
	let piece = getPiece(moves[k][0], board) // the tareget piece. if the piece is an empty space, it's value is null
	// empty piece
	if (!piece.piece.name) {
		if (!piece.can_move) return true // if there are no other moves, then it is also valid
		// prevents pawn from being able to kill king
		if (!checkNoPawnKill(piece, color, board)) return false
		//- If all the pieces that can move are same color as king, then it is valid
		if (!filterMovesForKing(piece.can_move, color, board) ) return true

		//console.log(color, "sda", moves[k][0])
		//- if there's only a pawn of opposite color moving foward, the pawn doesnt pose a threat ( since it can't move/kill forward when blocked)
		if (filterMovesForKing(piece.can_move, color, board) === 1 && checkForPawn(piece.can_move, color, board)) return true
		// check if theres a pawn that can kill if it moves there
		// let multiplier = color === "white" ? true : false
		//- If enemy pieces can move to the same place, then king cannot move to that place cause of the risk of being killed
		else return false
	}// occupied piece
	else {
		// prevents pawn from being able to kill king
		if (!checkNoPawnKill(piece, color, board)) return false
		return true
	/*
		if (!piece.can_kill) return true // if there are no other moves, then it is also valid
		//- If all the pieces that can 'kill' are same color as king, then it is valid 
		if (!filterMovesForKing(piece.can_kill, color, board) ) return true
		//- If an enemy piece is friendly (a piece of the color that can move if occupied piece moves) , the king cannot move
		f = search(square.position, friends) // checks pieces of the same family that can move to the position
		return f === -1 ? true : false // if there are no friendly  pieces, it returns -1
	*/
	}
}
/**
 * Helps checking of pieces that are the same color as the king
 * To be used in the map function
 * 
 * @param {string} each 
 * @param {"white" | "black"} king_color 
 * @param  board 
 * @returns  number of pieces with different color than king
 */

function getKings(board) {
	let white
	let black
	for (let each of board) {
		let name = each.piece.name
		if ((name && getType(name) === "king") && getPieceColor(name) === "white") white = each.position
		if ((name && getType(name) === "king") && getPieceColor(name) === "black") black = each.position
	}
	return [white, black]
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

function generateMoveForBoard(board, white_k, black_k) {
	let moves = [] ///1 1
	let friends = []
	let possible_moves, friend /// 1 1
	for (let each of board) { // goes through board and adds valid moves for pieces to the array
		if (each.piece.name) { /// 1 n
			let type = getType(each.piece.name) ///12 n // guaranteed to have a valid type
			let piece_color = getPieceColor(each.piece.name) ///12 n
			switch (type) {
				case "king":   [possible_moves, friend] = kingCapture(each.position, board, piece_color) ///108 n
					break;
				case "queen":	 [possible_moves, friend] = queenCapture(each.position, board, piece_color) ///672 n
					break;
				case "bishop": [possible_moves, friend] = bishopCapture(each.position, board, piece_color) ///336 n
					break;
				case "knight": [possible_moves, friend] = knightCapture(each.position, board, piece_color) ///192 n
					break;
				case "rook":   [possible_moves, friend] = rookCapture(each.position, board, piece_color) ///336 n
					break;
				case "pawn":   [possible_moves, friend] = pawnCapture(each.position, board, piece_color)///34 n
					break;
				default:
					throw "Error generating moves!"
			}
			moves = moves.concat(possible_moves) //m
			friends = friends.concat(friend) //m
		}
	}
	for (let each of board) { // clear previously generated moves for board (prevents wierd bugs)
		each.can_kill = null
		each.can_move = null
	}
	moves.sort(sortMoves)///nlogn // array need to be sorted in order to be able to search for positions
	let moves_2 = moves.concat()
	let k
	// (only for pawns that are not king) goes through each position in the board and looks for positions of pieces that can kill it or move to it
	for (let square of board) {//  1 n
		if (!moves.length) break
		k = search(square.position, moves) ///nlogn
		
		if (k === -1) continue
		// moves[k][0] => the position that is to be killed, or moved into
		// moves[k][1] => the position that is doing the moving / killing
		// Array<[dest, src]>
		do {
			if (square.piece.name) { // if there is a piece at the location, it is to be killed
				if ([white_k, black_k].includes(moves[k][1])) 5
				// when key `can_kill` is not empty
				else if (square.can_kill) square.can_kill.push(moves[k][1])
				// key `can_kill` is initially at null, handles for when it is null
				else square.can_kill = [moves[k][1]]
			}
			else { // if there isnt a piece at the location, it is a valid move
				if ([white_k, black_k].includes(moves[k][1])) 5
				// when key `can_move` is not empty
				else if (square.can_move) square.can_move.push(moves[k][1])
				// key `can_move` is initially at null, handles for when it is null
				else square.can_move = [moves[k][1]]
			}
			moves.splice(k, 1) ///n n sqrt(n)
			if (!moves.length) break
			k = search(square.position, moves) ///n sqrt(n) logn 
		} while (k !== -1)
	}
	// /*
	// does moves for king
	for (let square of board) {//  1 n
		if (!moves_2.length) break
		k = search(square.position, moves_2) ///nlogn
		// console.log("firsdsfakslfaj;lkjdf;alkjlskfdat")
		
		if (k === -1) continue
		// moves[k][0] => the position that is to be killed, or moved into
		// moves[k][1] => the position that is doing the moving / killing
		// Array<[dest, src]>
		do {
			if (square.piece.name) { // if there is a piece at the location, it is to be killed
				if (![white_k, black_k].includes(moves_2[k][1])) 5

				else if (!validateKingNotAffected(white_k, black_k, k, moves_2, friends,  board)) 3
				// when key `can_kill` is not empty
				else if (square.can_kill) square.can_kill.push(moves_2[k][1]) // prevents king from moving where it could be kill
				// key `can_kill` is initially at null, handles for when it is null
				else square.can_kill = [moves_2[k][1]] // if theres only king, then, there's no problem
			}
			else { // if there isnt a piece at the location, it is a valid move
				if (![white_k, black_k].includes(moves_2[k][1])) 5

				else if (!validateKingNotAffected(white_k, black_k, k, moves_2, friends,  board)) 3
				// when key `can_move` is not empty
				else if (square.can_move && validateKingNotAffected(white_k, black_k, k, moves_2, friends,  board) ) square.can_move.push(moves_2[k][1]) // prevents king from moving where it could be kill
				// key `can_move` is initially at null, handles for when it is null
				else square.can_move = [moves_2[k][1]]
			}
			moves_2.splice(k, 1) ///n n sqrt(n)
			if (!moves_2.length) break
			k = search(square.position, moves_2) ///n sqrt(n) logn 
		} while (k !== -1)
	}
// */
}

function kingCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png
	// assumes the piece at `location` is a king and `color` is its color
	// returns an array of location pairs [killed_location, king_location]
	let [row_index, col_index] = getIndex(location)
	let index = calculateIndex(row_index, col_index) 
	let ans = []
	let friends = []

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
			// console.log("ffff", active_square)

			if (getPieceColor(active_square.piece.name) === color) friends.push([active_square.position, square.position])
			// if (active_square.piece.name) active_square.isKill = true
			// else active_square.isActive = true
			else ans.push([active_square.position, square.position])
		}
	}
	// castling
	return [ans, friends]
}

function knightCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chess_xot45.svg/33px-Chess_xot45.svg.png
	// Set possible moves for the knight
	// assumes the piece at `location` is a knight and `color` is its color

	let [row_index, col_index] = getIndex(location)

	let index = calculateIndex(row_index, col_index)
	let ans = []
	let friends = []

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
			if (getPieceColor(active_square.piece.name) === color) friends.push([active_square.position, square.position]) 
			// if (active_square.piece) active_square.isKill = true
			// else active_square.isActive = true
			else ans.push([active_square.position, square.position])
		}
	}
	return [ans, friends]
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
	let friends = []
	
	for (let i=1; i<8 ; i++) { 
		if (!up_isblocked && row_index + i < 8) { // all pieces above the rook. `up_isblocked` stops sliding if true
			let up =  calculateIndex(row_index+i, col_index)
			let up_square  =  board[up]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(up_square.piece.name) === color) { friends.push([up_square.position, square.position]); up_isblocked = true }
			else if (up_square.piece.name) { ans.push([up_square.position, square.position]); up_isblocked = true }
			else ans.push([up_square.position, square.position])
		}
		if (!down_isblocked && row_index - i >= 0) { // all pieces below the rook. `down_isblocked` stops sliding if true
			let down =  calculateIndex(row_index-i, col_index)
			let down_square  =  board[down]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(down_square.piece.name) === color) { friends.push([down_square.position, square.position]); down_isblocked = true }
			else if (down_square.piece.name) { ans.push([down_square.position, square.position]); down_isblocked = true }
			else ans.push([down_square.position, square.position])
		}
		if (!right_isblocked && col_index + i < 8) { // all pieces to right of the rook. `right_isblocked` stops sliding if true
			let right =  calculateIndex(row_index, col_index+i)
			let right_square  =  board[right]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(right_square.piece.name) === color) { friends.push([right_square.position, square.position]); right_isblocked = true }
			else if (right_square.piece.name) { ans.push([right_square.position, square.position]); right_isblocked = true }
			else ans.push([right_square.position, square.position])
		}
		if (!left_isblocked && col_index - i >= 0) { // all pieces to left of the rook. `left_isblocked` stops sliding if true
			let left =  calculateIndex(row_index, col_index-i)
			let left_square  =  board[left]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(left_square.piece.name) === color) { friends.push([left_square.position, square.position]); left_isblocked = true }
			else if (left_square.piece.name) { ans.push([left_square.position, square.position]); left_isblocked = true }
			else ans.push([left_square.position, square.position])
		}
	}
	return [ans, friends]
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
	let friends = []

	for (let i=1; i<8 ; i++) {
		if ( !ne_isblocked && (row_index + i < 8 && col_index + i < 8) ) { // all pieces to north-east of the rook. `ne_isblocked` stops sliding if true
			let ne = calculateIndex(row_index+i, col_index+i)
			let ne_square  =  board[ne]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(ne_square.piece.name) === color) { friends.push([ne_square.position, square.position]); ne_isblocked = true }
			else if (ne_square.piece.name) { ans.push([ne_square.position, square.position]); ne_isblocked = true }
			else ans.push([ne_square.position, square.position])
		}
		if (!nw_isblocked && (row_index + i < 8 && col_index - i >= 0) ) { // all pieces to north-west of the rook. `nw_isblocked` stops sliding if true
			let nw =  calculateIndex(row_index+i,col_index-i)
			let nw_square  =  board[nw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(nw_square.piece.name) === color) { friends.push([nw_square.position, square.position]); nw_isblocked = true }
			else if (nw_square.piece.name) { ans.push([nw_square.position, square.position]); nw_isblocked = true }
			else ans.push([nw_square.position, square.position])
		}
		if ( !se_isblocked &&  (row_index - i >= 0 && col_index + i < 8)) { // all pieces to south-east of the rook. `se_isblocked` stops sliding if true
			let se =  calculateIndex(row_index-i, col_index+i)
			let se_square  =  board[se]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(se_square.piece.name) === color) { friends.push([se_square.position, square.position]); se_isblocked = true }
			else if (se_square.piece.name) { ans.push([se_square.position, square.position]); se_isblocked = true }
			else ans.push([se_square.position, square.position])
		}
		if ( !sw_isblocked && (row_index - i >= 0 && col_index - i >= 0) ) { // all pieces to south-west of the rook. `sw_isblocked` stops sliding if true
			let sw =  calculateIndex(row_index-i, col_index-i)
			let sw_square  =  board[sw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(sw_square.piece.name) === color) { friends.push([sw_square.position, square.position]); sw_isblocked = true }  // prevents killing pieces in the same family
			else if (sw_square.piece.name) { ans.push([sw_square.position, square.position]); sw_isblocked = true }
			else ans.push([sw_square.position, square.position])
		}
	}
	return [ans, friends]
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
	let friends = []
	
	for (let i=1; i<8 ; i++) {
		if (!up_isblocked && row_index + i < 8) { // all pieces above the rook. `up_isblocked` stops sliding if true
			let up =  calculateIndex(row_index+i, col_index)
			let up_square  =  board[up]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(up_square.piece.name) === color) { friends.push([up_square.position, square.position]); up_isblocked = true }
			else if (up_square.piece.name) { ans.push([up_square.position, square.position]); up_isblocked = true }
			else ans.push([up_square.position, square.position])
		}
		if (!down_isblocked && row_index - i >= 0) { // all pieces below the rook. `down_isblocked` stops sliding if true
			let down =  calculateIndex(row_index-i, col_index)
			let down_square  =  board[down]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(down_square.piece.name) === color) { friends.push([down_square.position, square.position]); down_isblocked = true }
			else if (down_square.piece.name) { ans.push([down_square.position, square.position]); down_isblocked = true }
			else ans.push([down_square.position, square.position])
		}
		if (!right_isblocked && col_index + i < 8) { // all pieces to right of the rook. `right_isblocked` stops sliding if true
			let right =  calculateIndex(row_index, col_index+i)
			let right_square  =  board[right]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(right_square.piece.name) === color) { friends.push([right_square.position, square.position]); right_isblocked = true }
			else if (right_square.piece.name) { ans.push([right_square.position, square.position]); right_isblocked = true }
			else ans.push([right_square.position, square.position])
		}
		if (!left_isblocked && col_index - i >= 0) { // all pieces to left of the rook. `left_isblocked` stops sliding if true
			let left =  calculateIndex(row_index, col_index-i)
			let left_square  =  board[left]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(left_square.piece.name) === color) { friends.push([left_square.position, square.position]); left_isblocked = true }
			else if (left_square.piece.name) { ans.push([left_square.position, square.position]); left_isblocked = true }
			else ans.push([left_square.position, square.position])
		}
		if ( !ne_isblocked && (row_index + i < 8 && col_index + i < 8) ) { // all pieces to north-east of the rook. `ne_isblocked` stops sliding if true
			let ne = calculateIndex(row_index+i, col_index+i)
			let ne_square  =  board[ne]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(ne_square.piece.name) === color) { friends.push([ne_square.position, square.position]);  ne_isblocked = true }
			else if (ne_square.piece.name) { ans.push([ne_square.position, square.position]); ne_isblocked = true }
			else ans.push([ne_square.position, square.position])
		}
		if (!nw_isblocked && (row_index + i < 8 && col_index - i >= 0) ) { // all pieces to north-west of the rook. `nw_isblocked` stops sliding if true
			let nw =  calculateIndex(row_index+i,col_index-i)
			let nw_square  =  board[nw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(nw_square.piece.name) === color) { friends.push([nw_square.position, square.position]); nw_isblocked = true }
			else if (nw_square.piece.name) { ans.push([nw_square.position, square.position]); nw_isblocked = true }
			else ans.push([nw_square.position, square.position])
		}
		if ( !se_isblocked &&  (row_index - i >= 0 && col_index + i < 8)) { // all pieces to south-east of the rook. `se_isblocked` stops sliding if true
			let se =  calculateIndex(row_index-i, col_index+i)
			let se_square  =  board[se]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(se_square.piece.name) === color) { friends.push([se_square.position, square.position]); se_isblocked = true }
			else if (se_square.piece.name) { ans.push([se_square.position, square.position]); se_isblocked = true }
			else ans.push([se_square.position, square.position])
		}
		if ( !sw_isblocked && (row_index - i >= 0 && col_index - i >= 0) ) { // all pieces to south-west of the rook. `sw_isblocked` stops sliding if true
			let sw =  calculateIndex(row_index-i, col_index-i)
			let sw_square  =  board[sw]
			// all the below are in an if-else block so no need for `continue` for when the selected piece has the same color
			if (getPieceColor(sw_square.piece.name) === color) { friends.push([sw_square.position, square.position]); sw_isblocked = true } // prevents killing pieces in the same family
			else if (sw_square.piece.name) { ans.push([sw_square.position, square.position]); sw_isblocked = true }
			else ans.push([sw_square.position, square.position])
		}
	}
	return [ans, friends]
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
	let friends = []
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
			if (getPieceColor(left_square.piece.name) === color) friends.push([left_square.position, square.position])
		}
		if (i === 1 && col_index+i < 8) {
			let right = calculateIndex(row_index+multiplier*i, col_index+i) // multiplier determines if it moves up or down
			let right_square = board[right]
			if (getPieceColor(right_square.piece.name) !== color && right_square.piece.name) ans.push([right_square.position, square.position])
			if (getPieceColor(right_square.piece.name) === color) friends.push([right_square.position, square.position])
		}
		// check movement for i=1 (and i=2 when its pawns first move)
		let board_index = calculateIndex(row_index+multiplier*i, col_index)
		let active_square  =  board[board_index]

		if (active_square.piece.name) isblocked = true
		else ans.push([active_square.position, square.position])
	}
	return [ans, friends]
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
	getKings,
}