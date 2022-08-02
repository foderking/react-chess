import { BoardState } from "./board";
import { AllPieces, BoardPosition, Family, getPiece, getPieceColor, getPositionNotation, isPromotable, MainPieces, Ranks } from "./util";

export interface Move {
    to: BoardPosition
    from: BoardPosition
    movingPiece: AllPieces
    capturedPiece: AllPieces
    promotion?: boolean
    enPassant?: BoardPosition
    castling? : number
}

export function getMoveNotation(move: Move): string {
    if (move.castling || move.enPassant || move.promotion) throw new Error("not implemented");
    const pieceNames = " RNBQK"
    let captureField = move.capturedPiece===AllPieces.NULL ? "" : "x"
    let toField      = getPositionNotation(move.to)
    let pieceField   = move.capturedPiece!==AllPieces.NULL && getPiece(move.movingPiece)===MainPieces.Pawn
                        ? getPositionNotation(move.from)[0]
                        : pieceNames[getPiece(move.movingPiece)]

    return (pieceField + captureField + toField).trimStart()
}

export function generateMoves(board: BoardState, piece: AllPieces, square: BoardPosition): Move[] {
    const bishop_ray = [17,15,-17,-15]
    const rook_ray   = [1,-1,16,-16]
    const queen_ray  = [1,-1,16,-16, 17,15,-17,-15]
    const knight_ray = [33,31,-33,-31,18,-18,14,-14]
    const king_ray   = [1,-1,16,-16,15,-15,17,-17]
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
                return genPawnMoves(board, piece, square, 16, [15,17])
            return genPawnMoves(board, piece, square, -16, [-15,-17])
        default:
            return []
    }
}

export function genPawnMoves(board: BoardState, piece: AllPieces, square: BoardPosition, move_ray: number, kill_ray: [number, number]): Move[] {
    let result: Move[] = []
    let max_push = 1 + Number(board.canDoublePush(square, getPieceColor(board.board[square])))
    let piece_color = getPieceColor(piece)
    // generate normal moves
    let i = 0
    for (let position=square+move_ray; !(position & 0x88) ; position += move_ray) {
        if (i===max_push) break
        if (board.board[position]===AllPieces.NULL) {
            if (isPromotable(square, piece_color))
                result.push({
                    to: position,
                    from: square,
                    movingPiece: piece,
                    capturedPiece: AllPieces.NULL,
                    promotion: true
                })
            else
                result.push({
                    to: position,
                    from: square,
                    movingPiece: piece,
                    capturedPiece: AllPieces.NULL
                })
            i++
            continue
        }
        else break; // any piece can block pawn move gen
    }
    // generate pawn normal attacks
    let pos = square+kill_ray[0]
    if (!(pos & 0x88) && board.board[pos]!==AllPieces.NULL && getPieceColor(board.board[pos])!==piece_color) {
        if (isPromotable(square, piece_color))
            result.push({
                to: pos,
                from: square,
                movingPiece: piece,
                capturedPiece: board.board[pos],
                promotion : true
            })
        else
            result.push({
                to: pos,
                from: square,
                movingPiece: piece,
                capturedPiece: board.board[pos]
            })
    }
    pos = square+kill_ray[1]
    if (!(pos & 0x88) && board.board[pos]!==AllPieces.NULL && getPieceColor(board.board[pos])!==piece_color) {
        if (isPromotable(square, piece_color))
            result.push({
                to: pos,
                from: square,
                movingPiece: piece,
                capturedPiece: board.board[pos],
                promotion: true,
            })
        else
            result.push({
                to: pos,
                from: square,
                movingPiece: piece,
                capturedPiece: board.board[pos]
            })
    }
    return result
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
        else continue // non sliding attacks are not blocked by pieces
    }
    return result
}