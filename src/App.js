import React, { useEffect, useState } from 'react'

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
	const move_dot      = '○'
	const move_dot_2    = '●'
	/** Interesting
	 * ---
	 * f = i % 2 == 0
	 * s = (i % 8) % 2 == 0
	 * // Rook?
	 * ---
	 * 
	 */

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
		[white_rook, white_knight, white_bishop, white_queen, white_king, white_bishop, white_knight, white_rook],
		[white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn ] ,
		['', '', '', '', '', black_pawn, '', '' ],
		['', '', '', '', '', '', '', '' ],
		['', '', '', '', '', '', '', '' ],
		['', '', '', '', '', '', '', '' ],
		[black_pawn, black_pawn, '', black_pawn, black_pawn, black_pawn, black_pawn, black_pawn ],
		[black_rook, black_knight, black_bishop, black_queen, black_king, black_bishop, black_knight, black_rook],
	])
	const [location, SetLocation] = useState('nil')
	const [new_move, SetMove] = useState(true)

	function GetArr()
	{
		let arr = []

		for (let i = 0; i < 64; i++) {
			arr[i] = i
		}
		return arr
	}

	useEffect(() => {
		console.log(board_array)
		console.log(player_array)
	}, [])
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

	function GetSquareColor(index)
	{/**
		 * board_arr -> 2d array representing the board
		 */
		const i = index % 16
		const first = i % 2
		const second =  (i % 8) % 2 == 0

		if ((first && i < 8) || (second && i >= 8)) {
			return 'negative'
		}
		else {
			return 'postive'
		}
	}

	function checkKill(each)
	{
		console.log(each)
		if (new_move != true) {
			const arr = JSON.stringify([parseInt(each / 8), (each % 8)])
			const kill = JSON.stringify(new_move.kill)
			console.log(arr)

			if (kill.indexOf(arr) === -1) {
				return false
			}
			else {
				return true
			}
		}
		else {
			return false
		}
	}

	function parsePawn({row, col, init_arr, spec})
	{
		// console.log(spec)
		// const arr = [ ...init_arr ]
		const arr = JSON.parse(JSON.stringify(init_arr))

		if ( spec === 'first')
		{
			for (let i = row + 1; i < row + 3 ; i++) {
				// console.log(i, col)
				const next = arr[i][col]
				// console.log(next)
				
				if ( next == '' ) {
					arr[i][col] = move_dot
					// console.log('next')
				}
				else {
					// console.log('no next')
					break
				}
			}

			return arr
		}
		else if (spec === 'kill') {
			const arr = JSON.parse(JSON.stringify(init_arr))
			let kills = []

			const i = row + 1
			const right = col + 1
			const left = col - 1
			
			const elem_right = arr[i][right]
			const elem_left = arr[i][left]

			if (elem_left !== '') {
				kills.push([i, left])
			}
			if (elem_right !== '') {
				kills.push([i, right])
			}
			console.log(kills)
			return kills
		}


	}


	class Rules {
	/**
	 * 
	 * @param { } location 
	 * @param {*} type 
	 * @param {*} famility 
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
				console.log('first')
				this.new_arr = rule[this.type]['first']()
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
		a({row, col, init_arr}){
			console.log(row, col, init_arr)
		}
		addRules()
		{
			this.RULES = {
				pawn : {
					first  : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, spec: 'first'}),
					normal : () => parsePawn(this.row, this.col, this.init_arr ),
					kill   : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, spec: 'kill'}),
				},
				// bishop: {
				// 	first  : parseBishop(this.row, this.col, this.init_arr ),
				// 	normal : parseBishop(this.row, this.col, this.init_arr ),
				// 	kill   : parseBishop(this.row, this.col, this.init_arr ),
				// },
				// knight: {
				// 	first  : parseKnight(),
				// 	normal : parseKnight(),
				// 	kill   : parseKnight(),
				// },
				// rook: {
				// 	first  : parseRook(),
				// 	normal : parseRook(),
				// 	kill   : parseRook(),
				// },
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

	function GetLocation(class_)
	{
		const loc =class_[3].slice(4) + class_[4].slice(4)

		return loc
	}

	function HandeClick(e)
	{
		e.preventDefault()
		// console.log(e.target)

		const class_ = e.target.classList
		const loc = GetLocation(class_)
		
		// PawnRule(loc)
		if (new_move === true) {
			const move =  new Rules(loc, 'pawn', 'positive')
			move.move('first')
			// console.log(move.move)
			SetMove(move)//.move('first')
			// SetMove(!new_move)
		}
		else {
			// new Rules(loc, 'pawn', 'positive').move('second')
			new_move.move('second')
			SetMove(true)
		}
		SetLocation(`#${loc}`)
		
	}

	function GetRow(no)
	{
		no = parseInt(no / 8) + 1
		return ' row-' + no
	}

	function GetCol(no)
	{
		no = no % 8
		const charset = 'hgfedcba'
		return ' col-' + charset[no]
	}

  return (
    <div className='container'>
			<h1>Chess App</h1>
			<div className='board' >
				{
					board_array.map(each =>
						<div
							key={each}
							onClick={HandeClick}
							className={
								'text-center board-cell ' + GetSquareColor(each) + GetCol(each)  + GetRow(each) + ( checkKill(each) === true ? ' kill ': '')
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