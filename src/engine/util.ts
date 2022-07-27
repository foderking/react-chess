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
    White, Black
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


export function parsePosition(col: string, row: string): BoardPosition {
    const allCols = "abcdefgh", allRows = "12345678"
    let colIndex = allCols.indexOf(col)
    let rowIndex = allRows.indexOf(row)
    if (colIndex===-1 || rowIndex===-1)
        throw new Error("Invalid positon given")
    return (rowIndex >> 3) + colIndex
}