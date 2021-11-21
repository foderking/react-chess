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
		[white_rook, '', white_bishop, white_queen, white_king, white_bishop, white_knight, white_rook],
		[white_pawn, white_pawn, white_pawn, '', white_pawn, white_pawn, white_pawn, white_pawn ] ,
		['', '', '', white_pawn, '', black_pawn, '', '' ],
		['', '', '', '', '', '', '', '' ],
		['', '', white_knight, '', '', '', '', '' ],
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
			return 'postive'
		}
		else if (piece == '') {
			return null
		}
		throw 'family error'
	}

	useEffect(() => {
		// console.log(board_array)
		// console.log(player_array)
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
		// console.log(each)
		if (new_move != true) {
			const arr = JSON.stringify([parseInt(each / 8), (each % 8)])
			const kill = JSON.stringify(new_move.kill)
			// console.log(arr)

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

	function parseKnight({row, col, init_arr, fam, spec})
	{
		const west       = col - 1
		const westwest   = col - 2
		const east       = col + 1
		const easteast   = col + 2
		const north      = row - 1
		const northnorth = row - 2
		const south      = row + 1
		const southsouth = row + 2

		const validate_ss  = ( southsouth < 8)
		const validate_nn  = ( northnorth >=0)
		const validate_ee  = ( easteast   < 8)
		const validate_ww  = ( westwest   >=0)
		const validate_s   = ( south < 8)
		const validate_n   = ( north >=0)
		const validate_e   = ( east  < 8)
		const validate_w   = ( west  >=0)

		const validate_ss_e = (validate_ss && validate_e)
		const validate_ss_w = (validate_ss && validate_w)
		const validate_nn_e = (validate_nn && validate_e)
		const validate_nn_w = (validate_nn && validate_w)

		const validate_n_ee = (validate_ee && validate_n)
		const validate_s_ee = (validate_ee && validate_s)
		const validate_n_ww = (validate_ww && validate_n)
		const validate_s_ww = (validate_ww && validate_s)

		const elem_ss_e = validate_ss_e ? init_arr[southsouth][east] : null
		const elem_ss_w = validate_ss_w ? init_arr[southsouth][west] : null
		const elem_nn_e = validate_nn_e ? init_arr[northnorth][east] : null
		const elem_nn_w = validate_nn_w ? init_arr[northnorth][west] : null

		const elem_n_ee = validate_n_ee ? init_arr[north][easteast]  : null
		const elem_s_ee = validate_s_ee ? init_arr[south][easteast]  : null
		const elem_n_ww = validate_n_ww ? init_arr[north][westwest]  : null
		const elem_s_ww = validate_s_ww ? init_arr[south][westwest]  : null

		if (spec === 'kill') {
			const kills = []

			/* The if statements always short circuits with the location fails
			 * the `validate_xx_x` validation. this prevents overflows */
			/* SS */
			if (validate_ss_e &&  elem_ss_e !== '') {
				kills.push([southsouth, east])
			}
			if (validate_ss_w &&  elem_ss_w !== '') {
				kills.push([southsouth, west])
			}
			/* NN */
			if (validate_nn_e &&  elem_nn_e !== '') {
				kills.push([northnorth, east])
			}
			if (validate_nn_w &&  elem_nn_w !== '') {
				kills.push([northnorth, west])
			}
			/* EE */
			if (validate_n_ee &&  elem_n_ee !== '') {
				kills.push([north, easteast])
			}
			if (validate_s_ee &&  elem_s_ee !== '') {
				kills.push([south, easteast])
			}
			/* WW */
			if (validate_n_ww &&  elem_n_ww !== '') {
				kills.push([north, westwest])
			}
			if (validate_s_ww &&  elem_s_ww !== '') {
				kills.push([south, westwest])
			}

			return kills
		}
		else if (spec === 'first'){
			console.log('kkk')
			const arr = JSON.parse(JSON.stringify(init_arr))
			/* SS */
			if (validate_ss_e && elem_ss_e === '') {
				arr[southsouth][east] = move_dot
				console.log('sse ->', [southsouth, east])
			}
			if (validate_ss_w && elem_ss_w === '') {
				arr[southsouth][west] = move_dot
				console.log('ssw ->', [southsouth, west])
			}
			/* NN */
			if (validate_nn_e && elem_nn_e === '') {
				arr[northnorth][east] = move_dot
				console.log('nne ->', [northnorth, east])
			}
			if (validate_nn_w && elem_nn_w === '') {
				arr[northnorth][west] = move_dot
				console.log('nnw ->', [northnorth, west])
			}

			/* EE */
			if (validate_n_ee && elem_n_ee === '') {
				// console.log(westwest)
				arr[north][easteast] = move_dot
				console.log('een ->', [north, easteast])
			}
			if (validate_s_ee && elem_s_ee === '') {
				arr[south][easteast] = move_dot
				console.log('ees ->', [south, easteast])
			}
			// /* WW */
			if (validate_n_ww && elem_n_ww === '') {
				// console.log(westwest, north)
				arr[north][westwest] = move_dot
				console.log('wwn ->', [north, westwest])
			}
			if (validate_s_ww && elem_s_ww === '') {
				arr[south][westwest] = move_dot
				console.log('wws ->' [south, westwest])
			}
			return arr
		}

	}

	function parsePawn({row, col, init_arr, spec, fam})
	{
		console.log(fam)
		// const arr = [ ...init_arr ]
		const arr = JSON.parse(JSON.stringify(init_arr))

		if (fam === 'negative') {
			console.log('object')
			row *= -1
		}

		if ( spec === 'first')
		{

			const start = row + 1
			const end   = row + 3
			console.log(start, end, row)

			for (let i = start; i < end ; i++) {
				const _i = Math.abs(i)
				// console.log(i, col)
				if (_i >= 8 ) {
					break
				}
				// console.log(next)
				const next = arr[_i][col]
				
				if ( next == '' ) {
					arr[_i][col] = move_dot
					// console.log('next')
				}
				else {
					// console.log('no next')
					break
				}
			}
			console.log(arr)
			return arr
		}
		else if (spec === 'kill') {
			const arr = JSON.parse(JSON.stringify(init_arr))
			let kills = []

			const i = Math.abs(row + 1)
			const right = col + 1
			const left = col - 1

			if (i > 7 || i < 0) {
				return kills
			}

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

		addRules()
		{
			this.RULES = {
				pawn : {
					first  : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					// normal : () => parsePawn(this.row, this.col, this.init_arr ),
					kill   : () => parsePawn({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'kill'}),
				},
				// bishop: {
				// 	first  : parseBishop(this.row, this.col, this.init_arr ),
				// 	normal : parseBishop(this.row, this.col, this.init_arr ),
				// 	kill   : parseBishop(this.row, this.col, this.init_arr ),
				// },
				knight: {
					first  : () => parseKnight({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					normal : () => parseKnight({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'first'}),
					kill   : () => parseKnight({row: this.current_row, col: this.current_col, init_arr: this.init_arr, fam: this.family, spec: 'kill'}),
				},
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
							onClick={HandleClick}
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