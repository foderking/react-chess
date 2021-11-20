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
	/** Interesting
	 * ---
	 * f = i % 2 == 0
	 * s = (i % 8) % 2 == 0
	 * // Rook?
	 * ---
	 * 
	 */

	const board_array = GetArr()
		// [
		// 	[ 0, 1, 2, 3, 4, 5, 6, 7],
		// 	[ 8, 9,10,11,12,13,14,15],
		// 	[16,17,18,19,20,21,22,23],
		// 	[24,25,26,27,28,29,30,31],
		// 	[32,33,34,35,36,37,38,39],
		// 	[40,41,42,43,44,45,46,47],
		// 	[48,49,50,51,52,53,54,55],
		// 	[56,57,58,59,60,61,62,63]
		// ]
	const [player_array, SetPlayer] = useState([
		[white_rook, white_knight, white_bishop, white_queen, white_king, white_bishop, white_knight, white_rook],
		[white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn ] ,
		['', '', '', '', '', '', '', '' ],
		['', '', '', '', '', '', '', '' ],
		['', '', '', '', '', '', '', '' ],
		['', '', '', '', '', '', '', '' ],
		[black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn ],
		[black_rook, black_knight, black_bishop, black_queen, black_king, black_bishop, black_knight, black_rook],
	])

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
	})
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

	function HandeClick(e)
	{
		e.preventDefault()
		console.log(e.target)

		const piece = e.target.textContent 
		console.log(piece)
		
		if ( CheckIfinState(piece) ){
			console.log('valid')
		}
		console.log('not valid')
		
	}

	function CheckIfinState(text)
	{
		for (let arr of player_array) {
			for (let i of arr) {
				console.log(i)
				if (String(i) == String(text)) {
					true
				}
			}
		}

		return false
	}

  return (
    <div className='container'>
			<h1>Chess App</h1>
			<div className='board' >
				{
					board_array.map(each =>
						<button
							key={each}
							onClick={HandeClick}
							className={'text-center board-cell ' + GetSquareColor(each)}>
								{ player_array[ parseInt(each/8) ][each % 8] }
						</button>
					)
				}
			</div>
    </div>
  )
}

export default App