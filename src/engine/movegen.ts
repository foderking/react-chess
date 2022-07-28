import { BoardState } from "./board";
import { AllPieces, BoardPosition, getPieceColor, Promotable } from "./util";

export interface Move {
    to: BoardPosition
    from: BoardPosition
    movingPiece: AllPieces
    capturedPiece: AllPieces
    promotion?: Promotable
    castling? : number
}

export function generateBishopMove(board: BoardState, piece: AllPieces, square: BoardPosition): Move[] {
    const rays = [17,15,-17,-15]
    return genSlidingMoves(board, piece, square, rays)
}

export function genSlidingMoves(board: BoardState, piece: AllPieces, square: BoardPosition, rays: number[]): Move[] {
    let result: Move[] = []
    for (let ray of rays) {
        for (let position=square+ray; !(position & 0x88); position += ray) {
            // rook lands on empty square, movegeneration continues
            if (board.board[position]===AllPieces.NULL) {
                result.push({
                    to: position,
                    from: square,
                    movingPiece: piece,
                    capturedPiece: AllPieces.NULL
                })
                continue
            }
            // rook lands on square occupied by enemy piece
            else if (getPieceColor(board.board[position])!==getPieceColor(piece)) {
                result.push({
                    to: position,
                    from: square,
                    movingPiece: piece,
                    capturedPiece: board.board[position]
                })
            }
            break; // sliding attacks are blocked by pieces
        }
    }
    return result
}