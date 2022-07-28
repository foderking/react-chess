import { BoardState } from "./board";
import { AllPieces, BoardPosition, Family, getPiece, getPieceColor, MainPieces, Promotable } from "./util";

export interface Move {
    to: BoardPosition
    from: BoardPosition
    movingPiece: AllPieces
    capturedPiece: AllPieces
    promotion?: Promotable
    castling? : number
}

export function generateMoves(board: BoardState, piece: AllPieces, square: BoardPosition): Move[] {
    const bishop_ray = [17,15,-17,-15]
    const rook_ray   = [1,-1,16,-16]
    const queen_ray  = [1,-1,16,-16, 17,15,-17,-15]
    const knight_ray = [33,31,-33,-31,18,-18,14,-14]
    const king_ray   = [1,-1,16,-16,15,-15,17,-17]
    const wpawn_ray   = [16,15,17]
    const bpawn_ray   = [-16,-15,-17]
    switch (getPiece(piece)) {
        case MainPieces.Rook:
            return genSlidingMoves(board, piece, square, rook_ray)
        case MainPieces.Bishop:
            return genSlidingMoves(board, piece, square, bishop_ray)
        case MainPieces.Queen:
            return genSlidingMoves(board, piece, square, queen_ray)
    
        case MainPieces.Knight:
            return genNonSlidingMoves(board, piece, square, knight_ray)
        case MainPieces.King:
            return genNonSlidingMoves(board, piece, square, king_ray)
        case MainPieces.Pawn:
            if (getPieceColor(piece)===Family.White)
                return genNonSlidingMoves(board, piece, square, wpawn_ray)
            return genNonSlidingMoves(board, piece, square, bpawn_ray)
        default:
            return []
    }
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

export function genNonSlidingMoves(board: BoardState, piece: AllPieces, square: BoardPosition, rays: number[]): Move[] {
    let result: Move[] = []
    for (let ray of rays) {
        let position=square+ray
        if (position & 0x88) continue

        if (board.board[position]===AllPieces.NULL) {
            result.push({
                to: position,
                from: square,
                movingPiece: piece,
                capturedPiece: AllPieces.NULL
            })
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
        else continue
    }
    return result
}