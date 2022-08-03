import { AllPieces, BoardPosition, Family, getPositionNotation, getSquareColor, serializeBoardPosition } from "../../src/engine/util"

describe("Testing the enums", () => {
    
    test("serializing the 'BoardPosition", () => {
        expect(serializeBoardPosition()).toEqual([
            "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
            "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
            "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
            "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
            "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
            "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
            "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
            "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"
        ])
    })
})

describe('Testing helpers', () => { 

    test("getSquareColor", () => {
        expect(getSquareColor("a", "1")).toBe("black")
        expect(getSquareColor("h", "3")).toBe("white")
        expect(getSquareColor("c", "7")).toBe("black")
    })


    test('test get position rep', () => {
        expect(getPositionNotation(BoardPosition.D5)).toBe("d5")
        expect(getPositionNotation(BoardPosition.A1)).toBe("a1")
        expect(getPositionNotation(BoardPosition.B2)).toBe("b2")
        expect(getPositionNotation(BoardPosition.C3)).toBe("c3")
        expect(getPositionNotation(BoardPosition.D4)).toBe("d4")
        expect(getPositionNotation(BoardPosition.E5)).toBe("e5")
        expect(getPositionNotation(BoardPosition.F6)).toBe("f6")
        expect(getPositionNotation(BoardPosition.G7)).toBe("g7")
        expect(getPositionNotation(BoardPosition.H8)).toBe("h8")
    })

 })