const { Board, rows, cols } = require("../src/constants")
const {
	getIndex, kingCapture, knightCapture, rookCapture, bishopCapture, queenCapture, pawnCapture
} = require("../src/Utility")
const { pawns, knight, king, board1 } = require("./testcase")

describe("Tests all helper functions", () => {
	
	test("test `getIndex`", () => {
		for (let each of Board) {
			let [row, _] = getIndex(each.position)
			expect(row).toBe(parseInt(each.position[0])-1)
		}
	})
})

describe("Tests the movement functions", () => {
	function sort_(a, b){
		return b[0] > a[0] ? -1 : 1
	}
	function checkRook(a, b) {
			return a[1] === b[1] || a[0] === b[0]
		}
	function checkBishop(a, b) {
		return Math.abs(rows.indexOf(a[0])  - rows.indexOf(b[0])) === Math.abs(cols.indexOf(a[1]) - cols.indexOf(b[1]))
	}

	test("testing king movement", () => {
		k_corner = king.corners
		k_edges  = king.edges
		k_mid    = king.middle

		for (let each of Object.keys(k_corner)) {
			expect(kingCapture(each, Board, "white").sort(sort_)).toEqual(k_corner[each].sort(sort_))
		}
		for (let each of Object.keys(k_edges)) {
			expect(kingCapture(each, Board, "white").sort(sort_)).toEqual(k_edges[each].sort(sort_))
		}
		for (let each of Object.keys(k_mid)) {
			expect(kingCapture(each, Board, "white").sort(sort_)).toEqual(k_mid[each].sort(sort_))
		}
	})

	test("testing knight movement", () => {
		kc_home   = knight.center_home
		kc_attack = knight.center_attack
		e_1       = knight.edge_one
		e_2       = knight.edge_two
		e_3       = knight.edge_three
		e_4       = knight.edge_four
		c_1       = knight.corner_one
		c_2       = knight.corner_two
		c_3       = knight.corner_three
		c_4       = knight.corner_four
		b_one     = knight.board1
		// near the center
		for (let each of Object.keys(kc_home)) {
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(kc_home[each].sort(sort_))
		}
		for (let each of Object.keys(kc_attack)) {
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(kc_attack[each].sort(sort_))
		}
		// at the edges
		for (let each of Object.keys(e_1)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(e_1[each].sort(sort_))
		}
		for (let each of Object.keys(e_2)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(e_2[each].sort(sort_))
		}
		for (let each of Object.keys(e_3)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(e_3[each].sort(sort_))
		}
		for (let each of Object.keys(e_4)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(e_4[each].sort(sort_))
		}
		// at the corners
		for (let each of Object.keys(c_1)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(c_1[each].sort(sort_))
		}
		for (let each of Object.keys(c_2)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(c_2[each].sort(sort_))
		}
		for (let each of Object.keys(c_3)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(c_3[each].sort(sort_))
		}
		for (let each of Object.keys(c_4)){
			expect(knightCapture(each, Board, "white").sort(sort_)).toEqual(c_4[each].sort(sort_))
		}
		// edgecases
		for (let each of Object.keys(b_one)){
		// console.log(each, knightCapture(each, board1, "white"))
			expect(knightCapture(each, board1, "white").sort(sort_)).toEqual(b_one[each].sort(sort_))
		}
	})

	test("testing rook movement", () => {
		// middle
		let res = rookCapture("4d", Board, "white")
		for (let each of res) {
			let [val, root] = each
			expect(checkRook(val, root)).toBeTruthy()
			expect(val !== "2d").toBeTruthy()
			expect(val !== "8d").toBeTruthy()
		}
		// edges
		res = rookCapture("4a", Board, "white")
		for (let each of res) { // left
			let [val, root] = each
			expect(checkRook(val, root)).toBeTruthy()
			expect(val !== "2a").toBeTruthy()
			expect(val !== "8a").toBeTruthy()
		}
		res = rookCapture("4h", Board, "white")
		for (let each of res) { // right
			let [val, root] = each
			expect(checkRook(val, root)).toBeTruthy()
			expect(val !== "2h").toBeTruthy()
			expect(val !== "8h").toBeTruthy()
		}
		res = rookCapture("1c", Board, "white") // down
		expect(res).toEqual([])
		res = rookCapture("8c", Board, "white") // up
		expect(res.sort(sort_)).toEqual([["7c", "8c"], ["8b", "8c"], ["8d", "8c"]].sort(sort_))
		// corners
		res = rookCapture("1a", Board, "white")
		expect(res).toEqual([])
		res = rookCapture("1h", Board, "white")
		expect(res).toEqual([])
		res = rookCapture("8a", Board, "white")
		expect(res.sort(sort_)).toEqual([["7a", "8a"], ["8b", "8a"]].sort(sort_))
		res = rookCapture("8h", Board, "white")
		expect(res.sort(sort_)).toEqual([["7h", "8h"], ["8g", "8h"]].sort(sort_))
	})

	test("testing bishop movement", () => {
		let res
		// corner
		res = bishopCapture("1a", Board, "white")
		expect(res).toEqual([])
		res = bishopCapture("1h", Board, "white")
		expect(res).toEqual([])
		res = bishopCapture("8a", Board, "white")
		expect(res).toEqual([["7b", "8a"]])
		res = bishopCapture("8h", Board, "white")
		expect(res).toEqual([["7g", "8h"]])
		// edges
		res = bishopCapture("1c", Board, "white") // down
		expect(res).toEqual([])
		res = bishopCapture("8c", Board, "white") // up
		expect(res.sort(sort_)).toEqual([["7b", "8c"], ["7d", "8c"]].sort(sort_))
		res = bishopCapture("4a", Board, "white") // left
		for (let each of res) {
			let [val, root] = each
			expect(checkBishop(val, root)).toBeTruthy()
			expect(each !== "2c").toBeTruthy()
			expect(each !== "8e").toBeTruthy()
		}
		res = bishopCapture("4h", Board, "white") // right
		for (let each of res) {
			let [val, root] = each
			expect(checkBishop(val, root)).toBeTruthy()
			expect(each !== "2f").toBeTruthy()
			expect(each !== "8d").toBeTruthy()
		}
		// middle
		res = bishopCapture("4d", Board, "white")
		for (let each of res) {
			let [val, root] = each
			expect(checkBishop(val, root)).toBeTruthy()
			expect(each !== "2f").toBeTruthy()
			expect(each !== "2b").toBeTruthy()
			expect(each !== "8h").toBeTruthy()
		}
	})

	test("Testing queen movement", () => {
		let res
		// corner
		res = queenCapture("1a", Board, "white")
		expect(res).toEqual([])
		res = queenCapture("1h", Board, "white")
		expect(res).toEqual([])
		res = queenCapture("8a", Board, "white")
		expect(res.sort(sort_)).toEqual([["7a", "8a"], ["8b", "8a"], ["7b", "8a"]].sort(sort_))
		res = queenCapture("8h", Board, "white")
		expect(res.sort(sort_)).toEqual([["7h", "8h"], ["8g", "8h"], ["7g", "8h"]].sort(sort_))
		// edges
		res = queenCapture("1c", Board, "white") // down
		expect(res).toEqual([])
		res = queenCapture("8c", Board, "white") // up
		expect(res.sort(sort_)).toEqual([["7b", "8c"], ["7d", "8c"], ["7c", "8c"], ["8b", "8c"], ["8d", "8c"]].sort(sort_))
		res = bishopCapture("4a", Board, "white") // left
		for (let each of res) {
			let [val, root] = each
			expect(checkRook(val, root) || checkBishop(val, root)).toBeTruthy()
			expect(each !== "2c").toBeTruthy()
			expect(each !== "8e").toBeTruthy()
			expect(val !== "2a").toBeTruthy()
			expect(val !== "8a").toBeTruthy()
		}
		res = bishopCapture("4h", Board, "white") // right
		for (let each of res) {
			let [val, root] = each
			expect(checkRook(val, root)||checkBishop(val, root)).toBeTruthy()
			expect(each !== "2f").toBeTruthy()
			expect(each !== "8d").toBeTruthy()
			expect(val !== "2h").toBeTruthy()
			expect(val !== "8h").toBeTruthy()
		}
		// middle
		res = bishopCapture("4d", Board, "white")
		for (let each of res) {
			let [val, root] = each
			expect(checkRook(val, root)||checkBishop(val, root)).toBeTruthy()
			expect(each !== "2f").toBeTruthy()
			expect(each !== "2b").toBeTruthy()
			expect(each !== "8h").toBeTruthy()
			expect(val !== "2d").toBeTruthy()
			expect(val !== "8d").toBeTruthy()
		}
	})

	test("Testing pawn movement", () => {
		let w_home   = pawns.white_home
		let w_empty  = pawns.white_empty
		let w_attack = pawns.white_attack
		let b_attack = pawns.black_attack
		let b_empty  = pawns.black_empty
		let b_home   = pawns.black_home
		// white pawns
		for (let each of Object.keys(w_home)) {
			expect(pawnCapture(each, Board, "white")).toEqual(w_home[each]) // test pawns in initial positions
		}
		for (let each of Object.keys(w_empty)) {
			expect(pawnCapture(each, Board, "white")).toEqual(w_empty[each]) // test pawns in empty square
		}
		for (let each of Object.keys(w_attack)) {
			expect(pawnCapture(each, Board, "white")).toEqual(w_attack[each]) // test pawns near black pawns
		}
		// black pawns
		for (let each of Object.keys(b_attack)) {
			expect(pawnCapture(each, Board, "black")).toEqual(b_attack[each]) // test pawns near white pawns
		}
		for (let each of Object.keys(b_empty)) {
			expect(pawnCapture(each, Board, "black")).toEqual(b_empty[each]) // test pawns in empty squares
		}
		for (let each of Object.keys(b_home)) {
			expect(pawnCapture(each, Board, "black")).toEqual(b_home[each]) // test pawns at initial position
		}
	})
})