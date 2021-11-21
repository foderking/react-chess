import React, { useEffect, useState } from 'react'
import { 
	parseBishop, parseKnight, parseRook, parsePawn, GetArr, GetSquareColor, GetCol, GetFamily, GetLocation, GetRow, GetType, checkKill, CalcIfFirst
} from './lib'

const App = () =>
{
	const white_king 	  = '♔'
	const white_queen 	= '♕'
	const white_rook 	  = '♖'
	const white_bishop 	= '♗'
	const white_knight 	= '♘'
	const white_pawn 	  = '♙'
	const black_king 	  = '♚'
	const black_queen 	= '♛'
	const black_rook 	  = '♜'
	const black_bishop 	= '♝'
	const black_knight 	= '♞'
	const black_pawn 	  = '♟'

	const [arrangement, SetArrange] = useState({
		white : [0, 1],
		black : [7, 6]
	})


	const board_array = GetArr()
	// Constant value representining all position in board
	// [
	// 	 0, 1, 2, 3, 4, 5, 6, 7,
	// 	 8, 9,10,11,12,13,14,15,
	// 	16,17,18,19,20,21,22,23,
	// 	24,25,26,27,28,29,30,31,
	// 	32,33,34,35,36,37,38,39,
	// 	40,41,42,43,44,45,46,47,
	// 	48,49,50,51,52,53,54,55,
	// 	56,57,58,59,60,61,62,63
	// ]

	const [player_array, SetPlayer] = useState([
		['', '', '', white_queen, white_king, white_bishop, white_knight, white_rook],
		[white_pawn, white_pawn, white_pawn, white_bishop, white_pawn, white_pawn, white_pawn, white_pawn ] ,
		['', '', '', white_pawn, '', black_pawn, '', '' ],
		['', '', '', '', '', '', '', '' ],
		[white_rook, '', white_knight, '', '', '', '', '' ],
		['', black_pawn, '', '', '', '', '', '' ],
		[black_pawn, '', '', black_pawn, black_pawn, black_pawn, black_pawn, black_pawn ],
		[black_rook, black_knight, black_bishop, black_queen, black_king, black_bishop, black_knight, black_rook],
	])
	const [location, SetLocation] = useState('nil')
	const [new_move, SetMove] = useState(true)


	function GetType(piece)
	{
		console.log(piece)
		const pawns   = [black_pawn,   white_pawn]
		const knights = [black_knight, white_knight]
		const rooks   = [black_rook,   white_rook]
		const bishops = [black_bishop, white_bishop] 
		const queens  = [black_queen,  white_queen]
		const kings   = [black_king,   white_king]
		
		if (pawns.includes(piece)) {
			return 'pawn'
		}
		if (knights.includes(piece)) {
			return 'knight'
		}
		if (rooks.includes(piece)) {
			return 'rook'
		}
		if (bishops.includes(piece)) {
			return 'bishop'
		}
		if (queens.includes(piece)) {
			return 'queen'
		}
		if (kings.includes(piece)) {
			return 'king'
		}

		return null
	}

	function GetFamily(piece)
	{
		const black = [black_bishop, black_king, black_knight, black_pawn, black_queen, black_rook]
		const white = [white_bishop, white_king, white_knight, white_pawn, white_queen, white_rook]

		if (black.includes(piece) ){
			return 'negative'
		}
		else if (white.includes(piece))  {
			return 'positive'
		}
		else if (piece == '') {
			return null
		}
		throw 'family error'
	}

	// 		<>
	// 		<button className='board-cell postive'> { items[0] } </button>
	// 		<button className='board-cell negative'>{ items[1] } </button>
	// 		<button className='board-cell postive'> { items[2] } </button>
	// 		<button className='board-cell negative'>{ items[3] } </button>
	// 		<button className='board-cell postive'> { items[4] } </button>
	// 		<button className='board-cell negative'>{ items[5] } </button>
	// 		<button className='board-cell postive'> { items[6] } </button>
	// 		<button className='board-cell negative'>{ items[7] } </button>

	// 		<button className='board-cell negative'>{ items[8] } </button>
	// 		<button className='board-cell postive'> { items[9] } </button>
	// 		<button className='board-cell negative'>{ items[10]} </button>
	// 		<button className='board-cell postive'> { items[11]} </button>
	// 		<button className='board-cell negative'>{ items[12]} </button>
	// 		<button className='board-cell postive'> { items[13]} </button>
	// 		<button className='board-cell negative'>{ items[14]} </button>
	// 		<button className='board-cell postive'> { items[15]} </button>
	// 		</>

	class Rules {
	/**
	 * 
	 * @param { int } location location of the piece on board
	 * @param {*} type type of pice - pawn, king etc..
	 * @param {*} famility  family of piece, whether black(negative) or white(postive) 
	 */
	
		constructor(location, type, family) {
			if (!location || !type || !family) {
				throw 'specify constructors'
			}
			this.type     = type
			this.family   = family
			this.init_arr = [...player_array]
			this.parseLocation(location)
			this.addRules()
		}

		move(type) {
			this.parseRule(type)
		}
		
		parseLocation(location)
		{
			const dic = {'h':'0', 'g': '1', 'f': '2', 'e':'3', 'd': '4', 'c': '5', 'b': '6', 'a': '7' }
			const arr = this.init_arr
			const row  = parseInt( location[1] ) - 1
			const col  = parseInt(  dic[location[0]] )
			const elem = arr[row][col]
			// console.log(elem)

			this.current_row  = row
			this.current_col  = col
			this.current_elem = elem
		}

		parseRule(type)
		{
			const rule = this.RULES
			// console.log(rule)

			if ( !Object.keys(rule).includes(this.type) ) {
				throw 'wrong type'
			}

			if (type === 'first') {
				const is_first = CalcIfFirst(this.type, this.family, this.current_row, this.current_col, arrangement)
				const key = is_first ? 'first' : 'normal'
				console.log('key -> ', key)

				this.new_arr = rule[this.type][key]()
				this.kill = rule[this.type]['kill']()
				SetPlayer(this.new_arr)
				// console.log()
			}
			else if (type === 'second') {
				console.log('second')
				SetPlayer(this.init_arr)
				// console.log(rule[this.type]['normal']())
			}

			// SetPlayer(ans)
		}

		addRules()
		{
			this.RULES = {
				pawn : {
					first  : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					normal  : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'normal'}),
					kill   : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'kill'}),
				},
				bishop: {
					first  : () => parseBishop({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					normal : () => parseBishop({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					kill   : () => parseBishop({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'kill'}),
				},
				knight: {
					first  : () => parseKnight({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					normal : () => parseKnight({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					kill   : () => parseKnight({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'kill'}),
				},
				rook: {
					first  : () => parseRook({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					normal : () => parseRook({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					kill   : () => parseRook({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'kill'}),
				},
				// king: {
				// 	first  : parseKing(),
				// 	normal : parseKing(),
				// 	kill   : parseKing(),
				// },
				// queen: {
				// 	first  : parseQueen(),
				// 	normal : parseQueen(),
				// 	kill   : parseQueen(),
				// },
			}

		}
	
	}


	function HandleClick(e)
	{
		e.preventDefault()
		// console.log(e.target)

		const class_ = e.target.classList
		const elem = e.target.innerText
		const type = GetType(elem)
		const fam = GetFamily(elem)
		console.log(fam)
		const loc = GetLocation(class_)
		console.log('type -> ', type)
		
		// PawnRule(loc)
		if (new_move === true) {
			try {
				const move =  new Rules(loc, type, fam)
				move.move('first')
				SetMove(move)//.move('first')
			}
			catch (e) {
				console.log(e)
				SetMove(true)
			}
			// console.log(move.move)
			// SetMove(!new_move)
		}
		else {
			// new Rules(loc, 'pawn', 'positive').move('second')
			new_move.move('second')
			SetMove(true)
		}
		SetLocation(`#${loc}`)
		
	}

	return (
		<div className='container'>
				<h1>Chess App</h1>
				<div className='board' >
					{
						board_array.map(each =>
							<div
								key={each}
								onClick={HandleClick}
								className={
									'text-center board-cell ' + GetSquareColor(each) + GetCol(each)  + GetRow(each) + ( checkKill(each, new_move) === true ? ' kill ': '')
								}>
									{ player_array[ parseInt(each/8) ][each % 8] }
							</div>
						)
					}
				</div>
				<span id='loc-state'>{ location }</span>
		</div>
	)
}

export default App