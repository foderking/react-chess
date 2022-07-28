import { BoardState } from "../../src/engine/board"
import { generateBishopMove } from "../../src/engine/movegen"
import { AllPieces, BoardPosition } from "../../src/engine/util"

describe("normal movegen", () => {
    let _board = new BoardState()
    test("bishop movegen", () => {
        expect(generateBishopMove(_board, AllPieces.WhiteBishop, BoardPosition.D5)).toEqual([])
    })
})