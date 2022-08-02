import { BoardState } from "../../src/engine/board"
import { getMoveNotation } from "../../src/engine/movegen"
import { AllPieces, BoardPosition } from "../../src/engine/util"

describe("normal movegen", () => {
    let _board = new BoardState()
    test("bishop movegen", () => {
    })

    test('getMoveNotation works', () => {
        // normal moves
        expect(getMoveNotation({
            movingPiece: AllPieces.BlackBishop,
            to: BoardPosition.E5,
            from : BoardPosition.D4,
            capturedPiece: AllPieces.NULL
        }))
        .toBe("Be5")
        expect(getMoveNotation({
            movingPiece: AllPieces.WhiteKnight,
            to: BoardPosition.F3,
            from : BoardPosition.D4,
            capturedPiece: AllPieces.NULL
        }))
        .toBe("Nf3")
        expect(getMoveNotation({
            movingPiece: AllPieces.WhitePawn,
            to: BoardPosition.C5,
            from : BoardPosition.D4,
            capturedPiece: AllPieces.NULL
        }))
        .toBe("c5")
        // captures
        expect(getMoveNotation({
            movingPiece: AllPieces.BlackBishop,
            to: BoardPosition.E5,
            from : BoardPosition.D4,
            capturedPiece: AllPieces.WhiteKnight
        }))
        .toBe("Bxe5")
        expect(getMoveNotation({
            movingPiece: AllPieces.WhiteKnight,
            to: BoardPosition.F3,
            from : BoardPosition.D4,
            capturedPiece: AllPieces.BlackBishop
        }))
        .toBe("Nxf3")
        expect(getMoveNotation({
            movingPiece: AllPieces.WhitePawn,
            to: BoardPosition.C5,
            from : BoardPosition.D4,
            capturedPiece: AllPieces.BlackBishop
        }))
        .toBe("dxc5")
    })
})