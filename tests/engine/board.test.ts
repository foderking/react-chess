import { BoardState, defaultFenString } from "../../src/engine/board"
import { BoardPosition, CastleType, Family } from "../../src/engine/util"


describe("Check 'BoardState' constructor", () => {
    let board: BoardState
    test("default", () => {
        board = new BoardState()
        console.log(board.board)
        expect(board.castling).toBe(
            CastleType.BKingCastle  |
            CastleType.WKingCastle  |
            CastleType.BQueenCastle |
            CastleType.WQueenCastle 
        )
        expect(board.current_side).toBe(Family.White)
        expect(board.enpassant_sq).toBe(BoardPosition.NULL)
        expect(board.half_move).toBe(0)
        expect(board.full_move).toBe(1)
    })

    test("default fen string", () => {
        board = new BoardState(defaultFenString)
        expect(board.castling).toBe(
            CastleType.BKingCastle  |
            CastleType.WKingCastle  |
            CastleType.BQueenCastle |
            CastleType.WQueenCastle 
        )
        expect(board.current_side).toBe(Family.White)
        expect(board.enpassant_sq).toBe(BoardPosition.NULL)
        expect(board.half_move).toBe(0)
        expect(board.full_move).toBe(1)
    })

    test("fen string 1", () => {
        board = new BoardState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 3 11")
        expect(board.castling).toBe(
            CastleType.BKingCastle  |
            CastleType.WKingCastle  |
            CastleType.BQueenCastle |
            CastleType.WQueenCastle 
        )
        expect(board.current_side).toBe(Family.White)
        expect(board.enpassant_sq).toBe(BoardPosition.NULL)
        expect(board.half_move).toBe(3)
        expect(board.full_move).toBe(11)
    })
})