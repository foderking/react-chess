import { Move } from "./movegen"

export enum MainPieces {
    Pawn, Rook, Knight, Bishop, Queen, King, NULL
}

/** All possible pieces in a board (including `NULL_PIECE` representing no piece) */
export enum AllPieces {
    WhitePawn,
    WhiteRook,
    WhiteKnight,
    WhiteBishop,
    WhiteQueen,
    WhiteKing,
    BlackPawn,
    BlackRook,
    BlackKnight,
    BlackBishop,
    BlackQueen,
    BlackKing,
    NULL
}
/** The two type of piece - black and white */
export enum Family {
    Black, White
}
/** Unique type of castling
 * ```txt
 * number's last 4 bits
 * |---|----|---|
 * WKC WQC BKC BQC
 * 
 * WKC: white king castling
 * WQC: white queen castling
 * BKC: black king castling
 * BQC: black queen castling
 * ```
*/
export enum CastleType {
    NoCastling   = 0,
    BQueenCastle = 1<<0,
    BKingCastle  = 1<<1,
    WQueenCastle = 1<<2,
    WKingCastle  = 1<<3,
}
/** All possible positions in the board (including a nullposition) */
export enum BoardPosition {
    A1=0x00, B1, C1, D1, E1, F1, G1, H1,
    A2=0x10, B2, C2, D2, E2, F2, G2, H2,
    A3=0x20, B3, C3, D3, E3, F3, G3, H3,
    A4=0x30, B4, C4, D4, E4, F4, G4, H4,
    A5=0x40, B5, C5, D5, E5, F5, G5, H5,
    A6=0x50, B6, C6, D6, E6, F6, G6, H6,
    A7=0x60, B7, C7, D7, E7, F7, G7, H7,
    A8=0x70, B8, C8, D8, E8, F8, G8, H8, NULL
}

/** Pieces a pawn can be promoted to */
export enum Promotable {
    Rook, Knight, Bishop, Queen
}

type MailBox<T> = [
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
    T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T,
]
export type MailBox88 = MailBox<AllPieces>

export type MoveDictionary = Record<BoardPosition, Move[]>

export type MoveMapping = Record<BoardPosition, boolean>

export function defaultMoveMapping(): MoveMapping {
    let dict = {}
    for (let pos of serializeBoardPosition()) {
        dict[parsePosition(pos[0], pos[1])] = false
    }
    return dict as MoveMapping
}
/** Checks if a position is col-row form is valid
 * if it isn't raises an error, else returns thier indices
 */
function validatePosition(col: string, row: string): [number, number] {
    const allCols = "abcdefgh", allRows = "12345678"
    let colIndex = allCols.indexOf(col)
    let rowIndex = allRows.indexOf(row)
    if (colIndex===-1 || rowIndex===-1)
        throw new Error("Invalid positon given")
    return [colIndex, rowIndex]
}

/** Given a string in form "colrow" returns it's Position */
export function parsePosition(col: string, row: string): BoardPosition {
    let [colIndex, rowIndex] = validatePosition(col.toLowerCase(), row.toLowerCase())
    rowIndex = 7-rowIndex // little endian rank-file mapping 
    return (rowIndex << 4) + colIndex
}

/** Returns board positions as an array of 64 strings */
export function serializeBoardPosition(): string[] {
    return Object.values(BoardPosition).slice(0,64) as string[]
}

/** Gets color of square at position */
export function getSquareColor(col: string, row: string): string {
    let final = (color: boolean, dist: number) => dist%2===0 ? color : !color
    let [colIndex, rowIndex] = validatePosition(col, row)
    let start = final(true, rowIndex)
    return serializeFamily(Number(final(start, colIndex)))
}

export function serializeFamily(fam: Family): string {
    switch(fam) {
        case Family.White: return "white"
        case Family.Black: return "black"
        default: throw new Error("Invalid family given");
    }
}

export const white_king='♔', white_queen='♕', white_rook='♖', white_bishop='♗', white_knight='♘', white_pawn='♙'
export const black_king='♚', black_queen='♛', black_rook='♜', black_bishop='♝', black_knight='♞', black_pawn='♟'
export function serializePiece(piece: AllPieces): string {
    switch (piece) {
        case AllPieces.WhitePawn  : return white_pawn
        case AllPieces.WhiteKnight: return white_knight
        case AllPieces.WhiteBishop: return white_bishop
        case AllPieces.WhiteRook  : return white_rook
        case AllPieces.WhiteQueen : return white_queen
        case AllPieces.WhiteKing  : return white_king
        case AllPieces.BlackPawn  : return black_pawn
        case AllPieces.BlackKnight: return black_knight
        case AllPieces.BlackBishop: return black_bishop
        case AllPieces.BlackRook  : return black_rook
        case AllPieces.BlackQueen : return black_queen
        case AllPieces.BlackKing  : return black_king
        case AllPieces.NULL       : return ""
        default:
            throw new Error("Invalid piece given");
    }
}

export function getPieceColor(piece: AllPieces): Family {
    switch (piece) {
        case AllPieces.WhitePawn  :
        case AllPieces.WhiteKnight:
        case AllPieces.WhiteBishop:
        case AllPieces.WhiteRook  :
        case AllPieces.WhiteQueen :
        case AllPieces.WhiteKing  :
            return Family.White
        case AllPieces.BlackPawn  :
        case AllPieces.BlackKnight:
        case AllPieces.BlackBishop:
        case AllPieces.BlackRook  :
        case AllPieces.BlackQueen :
        case AllPieces.BlackKing  :
            return Family.Black
        default:
            throw new Error("Invalid piece given");
    }
}

export function getPiece(piece: AllPieces): MainPieces {
    switch (piece) {
        case AllPieces.BlackPawn:
        case AllPieces.WhitePawn:
            return MainPieces.Pawn
        case AllPieces.BlackRook:
        case AllPieces.WhiteRook:
            return MainPieces.Rook
        case AllPieces.BlackKnight:
        case AllPieces.WhiteKnight:
            return MainPieces.Knight
        case AllPieces.BlackBishop:
        case AllPieces.WhiteBishop:
            return MainPieces.Bishop
        case AllPieces.BlackQueen:
        case AllPieces.WhiteQueen:
            return MainPieces.Queen
        case AllPieces.BlackKing:
        case AllPieces.WhiteKing:
            return MainPieces.King
        case AllPieces.NULL: return MainPieces.NULL
        default:
            throw new Error("Invalid Piece given");
            
    }
}

export function generateRandomString(N=10) {
	// Returns an alphanumeric string of N characters
	let result           = '';
	const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( var i = 0; i < N; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
 return result;
}