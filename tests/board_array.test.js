const { Board, Pieces } = require("../src/constants")

describe("Checks that the contents of the board array are correct", () => {
	const rows = "12345678"
	const cols = "abcdefgh"
	const valid = ["black", "white"]
	
	test("All children should have a 2 character position in form `rowcol`", () => {
		for (let each of Board) {
			expect(each.position.length).toBe(2) // checks that the string contains two characters
			expect(rows).toContain(each.position[0]) // checks that the first character is a valid number
			expect(cols).toContain(each.position[1]) // checks that the second character is an valid alphabet
		}
	})

	test("All children should have a key `color` which is either `black` or `white`", () => {
		for (let each of Board) {
			expect(valid).toContain(each.color)
		}
	})

	test("All children should have a key `piece` with only valid pieces", () => {
		for (let each of Board) {
			expect(Pieces).toContain(each.piece)
		}
	})

	test("Checks for all the remaining keys", () => {
		for (let each of Board) {
			expect(each.can_move).toBeDefined()
			expect(each.can_kill).toBeDefined()
			// expect(each.isSelected).toBeDefined()
		}
	})
})