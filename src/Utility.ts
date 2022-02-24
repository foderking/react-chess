/**
interface PieceLocation {
	readonly position: string,
	readonly color   : "white" | "black",
	piece  : null | string
}

abstract class Piece {
	color : "white" | "black"
	abstract nextMove(): string[] // Returns an array of all the valid locations of where the piece can be moved to next
}

class Pawn extends Piece {
	...
}

class Rook extends Piece {
	...
}

class Bishop extends Piece {
	...
}

class Knight extends Piece {
	...
}

class Queen extends Piece {
	...
}

class King extends Piece {
	...
}
**/

class Board {
	// https://en.wikipedia.org/wiki/Chess#Setup

	// The board consists 64 squares.
	// Each square has two properties - The color, and whether there's a piece on it

	// each rank represents each row of the chess board
	// in each rank are 8 columns (files)  each with a color, and a possible chess piece
	ranks  = [
		[
			{
				position: "1a",
				color   : "black",
				piece   : null
			},
			{
				position: "1b",
				color   : "white",
				piece   : null
			},
			{
				position: "1c",
				color   : "black",
				piece   : null
			},
			{
				position: "1d",
				color   : "white",
				piece   : null
			},
			{
				position: "1e",
				color   : "black",
				piece   : null
			},
			{
				position: "1f",
				color   : "white",
				piece   : null
			},
			{
				position: "1g",
				color   : "black",
				piece   : null
			},
			{
				position: "1h",
				color   : "white",
				piece   : null
			},
		],
		[
			{
				position: "2a",
				color   : "white",
				piece   : null
			},
			{
				position: "2b",
				color   : "black",
				piece   : null
			},
			{
				position: "2c",
				color   : "white",
				piece   : null
			},
			{
				position: "2d",
				color   : "black",
				piece   : null
			},
			{
				position: "2e",
				color   : "white",
				piece   : null
			},
			{
				position: "2f",
				color   : "black",
				piece   : null
			},
			{
				position: "2g",
				color   : "white",
				piece   : null
			},
			{
				position: "2h",
				color   : "black",
				piece   : null
			},
		],
		[
			{
				position: "3a",
				color   : "black",
				piece   : null
			},
			{
				position: "3b",
				color   : "white",
				piece   : null
			},
			{
				position: "3c",
				color   : "black",
				piece   : null
			},
			{
				position: "3d",
				color   : "white",
				piece   : null
			},
			{
				position: "3e",
				color   : "black",
				piece   : null
			},
			{
				position: "3f",
				color   : "white",
				piece   : null
			},
			{
				position: "3g",
				color   : "black",
				piece   : null
			},
			{
				position: "3h",
				color   : "white",
				piece   : null
			},
		],
		[
			{
				position: "4a",
				color   : "white",
				piece   : null
			},
			{
				position: "4b",
				color   : "black",
				piece   : null
			},
			{
				position: "4c",
				color   : "white",
				piece   : null
			},
			{
				position: "4d",
				color   : "black",
				piece   : null
			},
			{
				position: "4e",
				color   : "white",
				piece   : null
			},
			{
				position: "4f",
				color   : "black",
				piece   : null
			},
			{
				position: "4g",
				color   : "white",
				piece   : null
			},
			{
				position: "4h",
				color   : "black",
				piece   : null
			},
		],
		[
			{
				position: "5a",
				color   : "black",
				piece   : null
			},
			{
				position: "5b",
				color   : "white",
				piece   : null
			},
			{
				position: "5c",
				color   : "black",
				piece   : null
			},
			{
				position: "5d",
				color   : "white",
				piece   : null
			},
			{
				position: "5e",
				color   : "black",
				piece   : null
			},
			{
				position: "5f",
				color   : "white",
				piece   : null
			},
			{
				position: "5g",
				color   : "black",
				piece   : null
			},
			{
				position: "5h",
				color   : "white",
				piece   : null
			},
		],
		[
			{
				position: "6a",
				color   : "white",
				piece   : null
			},
			{
				position: "6b",
				color   : "black",
				piece   : null
			},
			{
				position: "6c",
				color   : "white",
				piece   : null
			},
			{
				position: "6d",
				color   : "black",
				piece   : null
			},
			{
				position: "6e",
				color   : "white",
				piece   : null
			},
			{
				position: "6f",
				color   : "black",
				piece   : null
			},
			{
				position: "6g",
				color   : "white",
				piece   : null
			},
			{
				position: "6h",
				color   : "black",
				piece   : null
			},
		],
		[
			{
				position: "7a",
				color   : "black",
				piece   : null
			},
			{
				position: "7b",
				color   : "white",
				piece   : null
			},
			{
				position: "7c",
				color   : "black",
				piece   : null
			},
			{
				position: "7d",
				color   : "white",
				piece   : null
			},
			{
				position: "7e",
				color   : "black",
				piece   : null
			},
			{
				position: "7f",
				color   : "white",
				piece   : null
			},
			{
				position: "7g",
				color   : "black",
				piece   : null
			},
			{
				position: "7h",
				color   : "white",
				piece   : null
			},
		],
		[
			{
				position: "8a",
				color   : "white",
				piece   : null
			},
			{
				position: "8b",
				color   : "black",
				piece   : null
			},
			{
				position: "8c",
				color   : "white",
				piece   : null
			},
			{
				position: "8d",
				color   : "black",
				piece   : null
			},
			{
				position: "8e",
				color   : "white",
				piece   : null
			},
			{
				position: "8f",
				color   : "black",
				piece   : null
			},
			{
				position: "8g",
				color   : "white",
				piece   : null
			},
			{
				position: "8h",
				color   : "black",
				piece   : null
			},
		],
	]
}