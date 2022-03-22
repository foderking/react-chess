import React, { useEffect, useState } from 'react'
import { Board } from './constants'
import { bishopCapture, calculateIndex, canKill, canMove, changePlayer, generateMoveForBoard, generateRandomString, getIndex, getPieceColor, getType, killPiece, kingCapture, knightCapture, movePiece, pawnCapture, queenCapture, rookCapture } from './Utility'

const App = () =>
{
	const [board, setBoard] =  useState(Board) // represents the whole chess board
	generateMoveForBoard(board)
	// console.log(board.map(each => [each.can_move, each.can_kill]))
	console.log(board)
	// const [oldboard, setOldBoard] =  useState(Board) // represents history of the whole chess board one move ago
	const [player, setPlayer] = useState(true) // white is to play if player is `true` else, its black
	const [location, setLocation] = useState(null)
	// const [activeSquare, setActiveSquare] = useState(false)
	// const [piece_color, setColor] = useState(null)
	const [clicked_piece, setPiece] = useState(null)
	const [kills, setKills] = useState([])

	// useEffect( () => { // hook for moving pieces
	// 	if (activeSquare) { // changes possible moves when a new square is selected
// 				break;
	// 		}
	// 		setBoard(possible_moves)
	// 		// setBoard(oldboard)
	// 		// setOldBoard(board)
	// 	}
	// 	else { // unselects possible moves when activesquare is false
	// 		setBoard(oldboard)
	// 	}
	// }, [activeSquare])

	function handleClick(e)
	{
		e.preventDefault()
	// 	//console.log(e)
		let piece_name       = e.target.innerText
		let piece_location = e.target.id
		let [row, col] = getIndex(piece_location)
		let index = calculateIndex(row, col)
		// let piece = board.find(each => each.position === piece_location)
		let piece = board[index]
		let family = getPieceColor(piece_name)
		// console.log(piece_name, family, clicked_piece, location)
		// console.log(player, family)
		// console.log(piece)

		if (piece_location === location) { // undo move if you click twice
			setLocation(null)
			setPiece(null)
		}
		else if (family==="white" && player || family==="black" && !player) { // change moves if another valid piece is clicked
			setLocation(piece_location)
			setPiece(piece_name)
		}
		// Three possible reasons - moving piece to a new location, killing another piece, or a totally invalid move
		else if ((location && piece.can_kill) && piece.can_kill.includes(location)){ // killing another piece
			let [new_board, killed] = killPiece(location, piece_location, board) 
			setBoard(new_board)
			setKills(kills.concat(killed))
			setLocation(null)
			setPiece(null)
			setPlayer(!player)
		}
		else if ((location && piece.can_move) && piece.can_move.includes(location)) { // moving to a new location
			console.log("piece can move here!") 
			setBoard(movePiece(location, piece_location, board))
			setLocation(null)
			setPiece(null)
			setPlayer(!player)
		}
		else { // invalid move
			console.log("invalid move")
			setLocation(null)
			setPiece(null)
			// if (!location)
			// if (!current_piece)
		}

	// 	if (family === player) { // only the next player is allowed make a move
	// 		if (activeSquare === newLocation) setActiveSquare(false)  // handles for when you click the same piece twice. it is made inactive (set to false)
	// 		else setActiveSquare(newLocation) // handles when a new location is clicked. changes the active cell to the new location
	// 	}
	// 	else if (activeSquare && canMove(newLocation, board)) {
	// 		// console.log('first')
	// 		let n_board = movePiece(activeSquare, newLocation, oldboard)				
	// 		setBoard(n_board)
	// 		setOldBoard(n_board) // this is needed since the useeffect changes board to oldboard when active is false
	// 		setActiveSquare(false)
	// 		let next_p = changePlayer(player)
	// 		nextPlayer(next_p)
	// 	}
	// 	else if (activeSquare && canKill(activeSquare, newLocation, board, pieceColor)) {
	// 		let [n_board, killed] = killPiece(activeSquare, newLocation, oldboard)				
	// 		setKills( kills.concat(killed) )
	// 		setBoard(n_board)
	// 		setOldBoard(n_board) // this is needed since the useeffect changes board to oldboard when active is false
	// 		setActiveSquare(false)
	// 		let next_p = changePlayer(player)
	// 		nextPlayer(next_p)
	
	// 	}
	// 	else setActiveSquare(false) // if the clicked player is not the next, active is set to false
	}

	const cols = 'abcdefgh'.split('')
	const rows = '87654321'.split('')

	return (
		<div className='container'>
				<h1>Chess App</h1>

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
				{/* <div>
						activeSquare: { activeSquare ? activeSquare : "..."}
				</div> */}
				<div>
						activePlayer: { player ? "white" : "black" }
				</div>
				{/* <div>
						piece family: { piece_color ? piece_color : "..."}
				</div> */}
				<div>
						kills : {
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