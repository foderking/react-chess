import React, { useEffect, useState } from 'react'
import { Board } from './constants'
import Promotion from './Promotion'
import {
	calculateIndex, checkPromotion, generateMoveForBoard, generateRandomString,
	getIndex, getKings, getPieceColor, getType, killPiece, movePiece, promotePawn
} from './Utility'

const App = () =>
{
	const [board, setBoard] =  useState(Board) // represents the whole chess board
	const [white_k, black_k] = getKings(board) // stores the location of the white and black kings
	generateMoveForBoard(board, white_k, black_k) // map all moves for the board
	console.log(board, )
	const [player, setPlayer] = useState(true) // white is to play if player is `true` else, its black
	const [location, setLocation] = useState(null) // location of clicked piece, killable/movable locations are highlighted if its `can_kill` or `can_move` contains `location`
	const [clicked_piece, setPiece] = useState(null) // value of clicked piece
	const [kills, setKills] = useState([]) // all the pieces that have been killed

	const [promotion, doPromotion] = useState(false) // controls whether the promotion popup shows
	const [promoted_location, setPromoLocation] = useState(null)
	const [promoted_family, setPromoFamily] = useState(null)

	function handleClick(e) {
		e.preventDefault()
		let piece_name     = e.target.innerText
		let piece_location = e.target.id
		let family         = getPieceColor(piece_name)
		// get index of piece in board based on location
		let [row, col] = getIndex(piece_location)
		let index      = calculateIndex(row, col)
		let piece = board[index]

		// undo move if you click twice
		if (piece_location === location) {
			setLocation(null)
			setPiece(null)
		}
		// change moves if another valid piece is clicked
		else if (family==="white" && player || family==="black" && !player) { 
			setLocation(piece_location)
			setPiece(piece_name)
		}
		// killing a piece
		else if ((location && piece.can_kill) && piece.can_kill.includes(location)) {
			let [new_board, killed] = killPiece(location, piece_location, board) 
			setBoard(new_board)
			if (checkPromotion(clicked_piece, piece_location)) startPromotion(player, piece_location) // opens promotion popup if there is a promotion
			setKills(kills.concat(killed))

			setLocation(null)
			setPiece(null)
			setPlayer(!player)
		}
		// moving to an empty location
		else if ((location && piece.can_move) && piece.can_move.includes(location)) {
			let new_board = movePiece(location, piece_location, board)
			setBoard(new_board)
			if (checkPromotion(clicked_piece, piece_location)) startPromotion(player, piece_location) // opens promotion popup if there is a promotion

			setLocation(null)
			setPiece(null)
			setPlayer(!player)
		}
		// an empty or invalid piece is clicked
		else {
			setLocation(null)
			setPiece(null)
		}
	}

	function startPromotion(family, piece_location) {
		doPromotion(true)
		setPromoFamily(family)
		setPromoLocation(piece_location)
	}

	function finishPromotion(piece) {
		promotePawn(promoted_location, piece, board)
		doPromotion(false)
		setPromoFamily(false)
		setPromoLocation(false)
	}

	const cols = 'abcdefgh'.split('')
	const rows = '87654321'.split('')

	return (
		<div className='container'>
				<h1>Chess App</h1>
				{ 
					promotion &&
					<Promotion family={promoted_family} handlePromotion={finishPromotion} />
				}

				<div className='main'>
					<div className='cols'>
						{
							cols.map(each =>
								<div key={each}>
									{each}
								</div>	
							)
						}
					</div>

					<div className='rows'>
						{
							rows.map(each =>
								<div key={each}>
									{each}
								</div>	
							)
						}
					</div>

					<div className='board' >
						{
							board.map(each =>
								<div
									key={each.position}
									id={each.position}
									onClick={handleClick}
									className={
										`text-center board-cell row-${ each.position[0] } ${ each.color }
										col-${ each.position[1] } ${ each.position === location ? "selected" : "" }
										${ (location && each.can_kill) && each.can_kill.includes(location) ? 'kill'   : '' }
										${ (location && each.can_move) && each.can_move.includes(location) ? "active" : '' }`
									}
								>
									{ each.piece.name }
								</div>
							)
						}
					</div>
				</div>

				<span id='loc-state'>{ location ? location : "..." }</span>
				<div>
						active player: { player ? "white" : "black" }
				</div>
				<div>
					kills :
					{
						kills.length
						? kills.map(
							each => <span key={generateRandomString(5)}>{each}</span>
						)
						: "..."
					}
				</div>
		</div>
	)
}

export default App