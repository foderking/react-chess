const white_king 	  = '♔'
const white_queen 	= '♕'
const white_rook 	  = '♖'
const white_bishop 	= '♗'
const white_knight 	= '♘'
const white_pawn 	  = '♙'
const black_king 	  = '♚'
const black_queen 	= '♛'
const black_rook 	  = '♜'
const black_bishop 	= '♝'
const black_knight 	= '♞'
const black_pawn 	  = '♟'

const white_pieces =  [white_pawn, white_rook, white_bishop, white_knight, white_king, white_queen]
const black_pieces =  [black_pawn, black_rook, black_bishop, black_knight, black_king, black_queen]

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


function getIndex(location, board) {
	const rows = [1,2,3,4,5,6,7,8]
	const cols = "abcdefgh"

	let [row, col] = location
	let new_board = board.map(each => { return {...each}})
	let row_index = parseInt(row) - 1
	let col_index = cols.indexOf(col)

	return [new_board, row_index, col_index]
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

export function getPieceColor(piece) {
	if (white_pieces.includes(piece)) return "white"
	if (black_pieces.includes(piece)) return "black"
	return ".."
}







export function rookCapture (location, board, color) {
	// Set possible moves for the rook
	// https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/33px-Chess_rlt45.svg.png
	let [new_board, row_index, col_index]  = getIndex(location, board)
	// console.log(row_index, col_index)
	let up_isblocked = false
	let down_isblocked = false
	let right_isblocked = false
	let left_isblocked = false

	let main =  8 * (7 - row_index ) + col_index
	let loc = new_board[main]
	loc.isSelected = true
	
	for (let i=1; i<8 ; i++) {
		if (!up_isblocked && row_index + i < 8) {
			let up =  8 * (7 - (row_index + i) ) + col_index

			let up_location  =  new_board[up]
			if (getPieceColor(up_location.piece) === color) up_isblocked = true
			else if (up_location.piece) { up_location.isKill = true; up_isblocked = true }
			else up_location.isActive = true
		}
		if (!down_isblocked && row_index - i >= 0) {
			let down =  8 * (7 - (row_index - i) ) + col_index

			let down_location  =  new_board[down]
			if (getPieceColor(down_location.piece) === color) down_isblocked = true
			else if (down_location.piece) { down_location.isKill = true; down_isblocked = true }
			else down_location.isActive = true
		}
		if (!right_isblocked && col_index + i < 8) {
			let right =  8 * (7 - row_index ) + (col_index + i)

			let right_location  =  new_board[right]
			if (getPieceColor(right_location.piece) === color) right_isblocked = true
			else if (right_location.piece) { right_location.isKill = true; right_isblocked = true }
			else right_location.isActive = true
		}
		if (!left_isblocked && col_index - i >= 0) {
			let left =  8 * (7 - row_index ) + (col_index - i)

			let left_location  =  new_board[left]
			if (getPieceColor(left_location.piece) === color) left_isblocked = true
			else if (left_location.piece) { left_location.isKill = true; left_isblocked = true }
			else left_location.isActive = true
		}
	}
	return new_board
}

export function bishopCapture (location, board, color) {
	// Sets the possible moves for the bishop
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png
	let [new_board, row_index, col_index] = getIndex(location, board)

	let ne_isblocked = false
	let nw_isblocked = false
	let se_isblocked = false
	let sw_isblocked = false

	let main =  8 * (7 - row_index ) + col_index
	let loc = new_board[main]
	loc.isSelected = true

	for (let i=1; i<8 ; i++) {
		if ( !ne_isblocked && (row_index + i < 8 && col_index + i < 8) ) {
			let ne =  8 * (7 - (row_index + i) ) + (col_index + i)

			let ne_location  =  new_board[ne]
			if (getPieceColor(ne_location.piece) === color) ne_isblocked = true
			else if (ne_location.piece) { ne_location.isKill = true; ne_isblocked = true }
			else ne_location.isActive = true
		}
		if (!nw_isblocked && (row_index + i < 8 && col_index - i >= 0) ) {
			let nw =  8 * (7 - (row_index + i) ) + (col_index - i)

			let nw_location  =  new_board[nw]
			if (getPieceColor(nw_location.piece) === color) nw_isblocked = true
			else if (nw_location.piece) { nw_location.isKill = true; nw_isblocked = true }
			else nw_location.isActive = true
		}
		if ( !se_isblocked &&  (row_index - i >= 0 && col_index + i < 8)) {
			let se =  8 * (7 - (row_index - i) ) + (col_index + i)

			let se_location  =  new_board[se]
			if (getPieceColor(se_location.piece) === color) se_isblocked = true// prevents killing pieces in the same family
			else if (se_location.piece) { se_location.isKill = true; se_isblocked = true }
			else se_location.isActive = true
		}
		if ( !sw_isblocked && (row_index - i >= 0 && col_index - i >= 0) ) {
			let sw =  8 * (7 - (row_index - i) ) + (col_index - i)

			let sw_location  =  new_board[sw]
			if (getPieceColor(sw_location.piece) === color) sw_isblocked = true  // prevents killing pieces in the same family
			else if (sw_location.piece) { sw_location.isKill = true; sw_isblocked = true }
			else sw_location.isActive = true
		}
	}
	return new_board
}

export function knightCapture (location, board, color) {
	// Set possible moves for the knight
	// https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chess_xot45.svg/33px-Chess_xot45.svg.png
	let [new_board, row_index, col_index] = getIndex(location, board)

	let main =  8 * (7 - row_index ) + col_index
	let loc = new_board[main]
	loc.isSelected = true

	for (let i=row_index-2 ; i < row_index+3 ; i++) {
		for (let j=col_index-2 ; j < col_index+3 ; j++) {
			if (i < 0 || i >= 8) continue
			if (j < 0 || j >= 8) continue


			if (i === row_index) continue
			if (j === col_index) continue
			if (Math.abs(i - row_index) === Math.abs(j - col_index)) continue

			let board_index = 8 * (7 - i) + j // gets the index of the location in the board array
																				// the board is arranged [8a, 8b, .., 7a, 7b, .., ... , 1a, 1b, ...]
			let active_location  =  new_board[board_index]
			if (getPieceColor(active_location.piece) === color) continue  // prevents killing pieces in the same family
			if (active_location.piece) active_location.isKill = true
			else active_location.isActive = true
		}
	}
	return new_board
}

export function pawnCapture (location, board, color, isFirstMove=false) {
	// Set possible moves the pawn
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png
	let [new_board, row_index, col_index] = getIndex(location, board)
	let isblocked = false
	// console.log(row_index, col_index)

	let main =  8 * (7 - row_index ) + col_index
	let loc = new_board[main]
	loc.isSelected = true
	
	let multiplier = "white" === color ? 1 : -1 // white pawn moves up, black moves down

	for (let i=1 ; i < 3  ; i++) {
		if (multiplier === 1 && row_index + i >= 8) continue
		if (multiplier === -1 && row_index - i < 0) continue
		if (isblocked) continue
		if (i === 2 && !isFirstMove) continue

		if (i === 1 && (col_index - 1 >=0 && col_index + 1 < 8)) {
			let left = 8 * (7 - (row_index + (multiplier * i) )) + col_index + i
			let right = 8 * (7 - (row_index + (multiplier * i) )) + col_index - i
			let left_location  =  new_board[left]
			let right_location  =  new_board[right]
			if (getPieceColor(left_location.piece) !== color && left_location.piece) left_location.isKill = true
			if (getPieceColor(right_location.piece) !== color && right_location.piece) right_location.isKill = true
		}

		let board_index = 8 * (7 - ( row_index+(multiplier*i) ) ) + col_index
		let active_location  =  new_board[board_index]

		if (active_location.piece) isblocked = true
		else active_location.isActive = true
	}
	return new_board
}

export function kingCapture (location, board, color) {
	// https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chessboard480.svg/264px-Chessboard480.svg.png
	let [new_board, row_index, col_index] = getIndex(location, board)

	let main =  8 * (7 - row_index ) + col_index
	let loc = new_board[main]
	loc.isSelected = true

	for (let i=row_index-1 ; i < row_index+2  ; i++) {
		for (let j=col_index-1 ; j < col_index+2  ; j++) {
			if (i < 0 || i >= 8) continue
			if (j < 0 || j >= 8) continue
			if (i===row_index && j===col_index) continue

			let board_index = 8 * (7 - i) + j // gets the index of the location in the board array
																				// the board is arranged [8a, 8b, .., 7a, 7b, .., ... , 1a, 1b, ...]
			let active_location  =  new_board[board_index]
			if (getPieceColor(active_location.piece) === color) continue  // prevents killing pieces in the same family
			if (active_location.piece) active_location.isKill = true
			else active_location.isActive = true
		}
	}
	return new_board
}

export function queenCapture (location, board, color) {
	// Set possible moves for the queen
	// https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Chess_xot45.svg/33px-Chess_xot45.svg.png
	let [new_board, row_index, col_index]  = getIndex(location, board)

	let up_isblocked = false
	let down_isblocked = false
	let right_isblocked = false
	let left_isblocked = false
	let ne_isblocked = false
	let nw_isblocked = false
	let se_isblocked = false
	let sw_isblocked = false

	let main =  8 * (7 - row_index ) + col_index
	let loc = new_board[main]
	loc.isSelected = true
	
	for (let i=1; i<8 ; i++) {
		if (!up_isblocked && row_index + i < 8) {
			let up =  8 * (7 - (row_index + i) ) + col_index

			let up_location  =  new_board[up]
			if (getPieceColor(up_location.piece) === color) up_isblocked = true
			else if (up_location.piece) { up_location.isKill = true; up_isblocked = true }
			else up_location.isActive = true
		}
		if (!down_isblocked && row_index - i >= 0) {
			let down =  8 * (7 - (row_index - i) ) + col_index

			let down_location  =  new_board[down]
			if (getPieceColor(down_location.piece) === color) down_isblocked = true
			else if (down_location.piece) { down_location.isKill = true; down_isblocked = true }
			else down_location.isActive = true
		}
		if (!right_isblocked && col_index + i < 8) {
			let right =  8 * (7 - row_index ) + (col_index + i)

			let right_location  =  new_board[right]
			if (getPieceColor(right_location.piece) === color) right_isblocked = true
			else if (right_location.piece) { right_location.isKill = true; right_isblocked = true }
			else right_location.isActive = true
		}
		if (!left_isblocked && col_index - i >= 0) {
			let left =  8 * (7 - row_index ) + (col_index - i)

			let left_location  =  new_board[left]
			if (getPieceColor(left_location.piece) === color) left_isblocked = true
			else if (left_location.piece) { left_location.isKill = true; left_isblocked = true }
			else left_location.isActive = true
		}

		if (!ne_isblocked && (row_index + i < 8 && col_index + i < 8)) {
			let ne =  8 * (7 - (row_index + i) ) + (col_index + i)

			let ne_location  =  new_board[ne]
			if (getPieceColor(ne_location.piece) === color) ne_isblocked = true
			else if (ne_location.piece) { ne_location.isKill = true; ne_isblocked = true }
			else ne_location.isActive = true
		}
		if (!nw_isblocked && (row_index + i < 8 && col_index - i >= 0)) {
			let nw =  8 * (7 - (row_index + i) ) + (col_index - i)

			let nw_location  =  new_board[nw]
			if (getPieceColor(nw_location.piece) === color) nw_isblocked = true
			else if (nw_location.piece) { nw_location.isKill = true; nw_isblocked = true }
			else nw_location.isActive = true
		}
		if( !se_isblocked && (row_index - i >= 0 && col_index + i < 8) ) {
			let se =  8 * (7 - (row_index - i) ) + (col_index + i)

			let se_location  =  new_board[se]
			if (getPieceColor(se_location.piece) === color) se_isblocked = true
			else if (se_location.piece) { se_location.isKill = true; se_isblocked = true }
			else se_location.isActive = true
		}
		if (!sw_isblocked && (row_index - i >= 0 && col_index - i >= 0)) {
			let sw =  8 * (7 - (row_index - i) ) + (col_index - i)

			let sw_location  =  new_board[sw]
			if (getPieceColor(sw_location.piece) === color) sw_isblocked = true
			else if (sw_location.piece) { sw_location.isKill = true; sw_isblocked = true }
			else sw_location.isActive = true
		}
	}
	return new_board
}



export const Board  = [
	// https://en.wikipedia.org/wiki/Chess#Setup

	// The board consists 64 squares.
	// Each square has two properties - The color, and whether there's a piece on it

	// each rank represents each row of the chess board
	// in each rank are 8 columns (files)  each with a color, and a possible chess piece
	{
		position: "8a",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_rook
	},
	{
		position: "8b",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_knight
	},
	{
		position: "8c",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_bishop
	},
	{
		position: "8d",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_queen
	},
	{
		position: "8e",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_king
	},
	{
		position: "8f",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_bishop
	},
	{
		position: "8g",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_knight
	},
	{
		position: "8h",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_rook
	},

	{
		position: "7a",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7b",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7c",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7d",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7e",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7f",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7g",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},
	{
		position: "7h",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : black_pawn
	},

	{
		position: "6a",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6b",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6c",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6d",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6e",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6f",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6g",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "6h",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},

	{
		position: "5a",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5b",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5c",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5d",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5e",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5f",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5g",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "5h",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	
	{
		position: "4a",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4b",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4c",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4d",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4e",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4f",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4g",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "4h",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	
	{
		position: "3a",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3b",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3c",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3d",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3e",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3f",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3g",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	{
		position: "3h",
		color   : "white",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : ''
	},
	
	{
		position: "2a",
		color   : "white",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2b",
		color   : "black",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2c",
		color   : "white",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2d",
		color   : "black",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2e",
		color   : "white",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2f",
		color   : "black",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2g",
		color   : "white",
		piece   : white_pawn,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "2h",
		color   : "black",
		isActive: false,
		isKill  : false,
		isSelected: false,
		piece   : white_pawn
	},

	{
		position: "1a",
		color   : "black",
		piece   : white_rook,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1b",
		color   : "white",
		piece   : white_knight,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1c",
		color   : "black",
		piece   : white_bishop,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1d",
		color   : "white",
		piece   : white_queen,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1e",
		color   : "black",
		piece   : white_king,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1f",
		color   : "white",
		piece   : white_bishop,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1g",
		color   : "black",
		piece   : white_knight,
		isActive: false,
		isKill  : false,
		isSelected: false
	},
	{
		position: "1h",
		color   : "white",
		piece   : white_rook,
		isActive: false,
		isKill  : false,
		isSelected: false
	}
]