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

const rows = "12345678"
const cols = "abcdefgh"

const b_rook = {
	name: black_rook,
	moves: 0
}
const b_knight = {
	name: black_knight,
	moves: 0
}
const b_bishop = {
	name: black_bishop,
	moves: 0
}
const b_queen = {
	name: black_queen,
	moves: 0
}
const b_king = {
	name: black_king,
	moves: 0
}
const b_pawn = {
	name: black_pawn,
	moves: 0
}

const null_piece = {
	name: null,
	moves: null
}

const w_pawn = {
	name: white_pawn,
	moves: 0
}
const w_rook = {
	name: white_rook,
	moves: 0
}
const w_knight = {
	name: white_knight,
	moves: 0
}
const w_bishop = {
	name: white_bishop,
	moves: 0
}
const w_queen = {
	name: white_queen,
	moves: 0
}
const w_king = {
	name: white_king,
	moves: 0
}



const Board  = [
	// https://en.wikipedia.org/wiki/Chess#Setup

	// The board consists 64 squares.
	// Each square has two properties - The color, and whether there's a piece on it

	// each rank represents each row of the chess board
	// in each rank are 8 columns (files)  each with a color, and a possible chess piece
	{
		position: "8a",
		color   : "white",
		piece   : b_rook,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8b",
		color   : "black",
		piece   : b_knight,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8c",
		color   : "white",
		piece   : b_bishop,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8d",
		color   : "black",
		piece   : b_queen,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8e",
		color   : "white",
		piece   : b_king,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8f",
		color   : "black",
		piece   : b_bishop,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8g",
		color   : "white",
		piece   : b_knight,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "8h",
		color   : "black",
		piece   : b_rook,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},

	{
		position: "7a",
		color   : "black",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7b",
		color   : "white",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7c",
		color   : "black",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7d",
		color   : "white",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7e",
		color   : "black",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7f",
		color   : "white",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7g",
		color   : "black",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "7h",
		color   : "white",
		piece   : b_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},

	{
		position: "6a",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6b",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6c",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6d",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6e",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6f",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6g",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "6h",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},

	{
		position: "5a",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5b",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5c",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5d",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5e",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5f",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5g",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "5h",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	
	{
		position: "4a",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4b",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4c",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4d",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4e",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4f",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4g",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "4h",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	
	{
		position: "3a",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3b",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3c",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3d",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3e",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3f",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3g",
		color   : "black",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "3h",
		color   : "white",
		piece   : null_piece,
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "2a",
		color   : "white",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2b",
		color   : "black",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2c",
		color   : "white",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2d",
		color   : "black",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2e",
		color   : "white",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2f",
		color   : "black",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2g",
		color   : "white",
		piece   : w_pawn,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "2h",
		color   : "black",
		piece   : w_pawn, 
		can_move: null,
		can_kill: null,
		// isSelected: false,
	},
	{
		position: "1a",
		color   : "black",
		piece   : w_rook,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1b",
		color   : "white",
		piece   : w_knight,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1c",
		color   : "black",
		piece   : w_bishop,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1d",
		color   : "white",
		piece   : w_queen,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1e",
		color   : "black",
		piece   : w_king,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1f",
		color   : "white",
		piece   : w_bishop,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1g",
		color   : "black",
		piece   : w_knight,
		can_move: null,
		can_kill: null,
		// isSelected: false
	},
	{
		position: "1h",
		color   : "white",
		piece   : w_rook,
		can_move: null,
		can_kill: null,
		// isSelected: false
	}
]

const Pieces = [
	null_piece,
	w_pawn,
	w_rook,
	w_knight, 
	w_bishop,
	w_queen,
	w_king,
	b_pawn,
	b_rook,
	b_knight, 
	b_bishop,
	b_queen,
	b_king
]

module.exports = {
	Board,
	Pieces,
	white_pieces,
	black_pieces,
	rows,
	cols,
	white_king,
	white_queen,
	white_rook,
	white_bishop,
	white_knight,
	white_pawn,
	black_king,
	black_queen,
	black_rook,
	black_bishop,
	black_knight,
	black_pawn,
	null_piece,
}