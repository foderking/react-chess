const {
	white_pieces, black_pieces, rows, cols
} = require("./constants")

/*
export function getType(piece) {
	if ( [white_king, black_king].includes(piece) ) return "king"
	if ( [white_queen, black_queen].includes(piece) ) return "queen"
	if ( [white_bishop, black_bishop].includes(piece) ) return "bishop"
	if ( [white_knight, black_knight].includes(piece) ) return "knight"
	if ( [white_rook, black_rook].includes(piece) ) return "rook"
	if ( [white_pawn, black_pawn].includes(piece) ) return "pawn"
	return null
}

export function changePlayer(current_player) {
	if (current_player === "white") return "black"
	return "white"
}

export function generateRandomString(N)
{
	// Returns an alphanumeric string of N characters
	let result           = '';
	const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( var i = 0; i < N; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
 return result;
}

export function movePiece(init_location, final_location, board) {
	// assumes the piece in `final_location` is empty
	let new_board = board.map(each => { return {...each}})
	let a = new_board.find(each => each.position === init_location)
	let b = new_board.find(each => each.position === final_location)
	let moved_piece = a.piece
	a.piece  = ""
	b.piece = moved_piece
	return new_board
}

export function canMove(final_location, board) {
	let l = board.find(each => each.position === final_location)
	if (!l) return false
	// if (l.isActive) return false
	// console.log(l.isActive)
	// console.log(l.isActive, "ff")

	if (l.piece !== "") return false
	return l.isActive
}

export function canKill(init_location, final_location, board, color) {
	let new_board = board.map(each => { return {...each}})
	let a = new_board.find(each => each.position === init_location)
	let b = new_board.find(each => each.position === final_location)

	// if (l.isKill) return true
	if (getPieceColor(b.piece) === color) return false
	if (color === ".." ) throw  "cankill error"
	return b.isKill
}

export function killPiece (init_location, final_location, board, color) {
	let new_board = board.map(each => { return {...each}})
	let a = new_board.find(each => each.position === init_location)
	let b = new_board.find(each => each.position === final_location)

	let killed_piece = b.piece
	let moved_piece = a.piece
	a.piece = ""
	b.piece = moved_piece
	return [new_board, killed_piece]
}

*/

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
	return ".."
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
	// sqaure.isSelected = true
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
	// square.isSelected = true

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
	// square.isSelected = true
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
	// square.isSelected = true
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
}