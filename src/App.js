import React, { useEffect, useState } from 'react'
import { bishopCapture, Board, canKill, canMove, changePlayer, generateRandomString, getPieceColor, getType, killPiece, kingCapture, knightCapture, movePiece, pawnCapture, queenCapture, rookCapture } from './Utility'

const App = () =>
{
	const [board, setBoard] =  useState(Board) // represents the whole chess board
	const [oldboard, setOldBoard] =  useState(Board) // represents the whole chess board
	const [player, nextPlayer] = useState("white") // the current player. set to white at the start of the game
	const [location, setLocation] = useState("..")
	const [activeSquare, setActiveSquare] = useState(false)
	const [pieceColor, setColor] = useState("..")
	const [current_piece, setPiece] = useState("")
	const [kills, setKills] = useState([])

	useEffect( () => { // hook for moving pieces
		if (activeSquare) { // changes possible moves when a new square is selected
			let type = getType(current_piece)
			let possible_moves
			switch (type) {
				case "king":
					possible_moves = kingCapture(location, oldboard, pieceColor)
					break;
				case "queen":
					possible_moves = queenCapture(location, oldboard, pieceColor)
					break;
				case "bishop":
					possible_moves = bishopCapture(location, oldboard, pieceColor)
					break;
				case "knight":
					possible_moves = knightCapture(location, oldboard, pieceColor)
					break;
				case "rook":
					possible_moves = rookCapture(location, oldboard, pieceColor)
					break;
				case "pawn":
					possible_moves = pawnCapture(location, oldboard, pieceColor)
					break;
					
				default:
					console.log('error')
					break;
			}
			setBoard(possible_moves)
			// setBoard(oldboard)
			// setOldBoard(board)
		}
		else { // unselects possible moves when activesquare is false
			setBoard(oldboard)
		}
	}, [activeSquare])



	function handleClick(e)
	{
		e.preventDefault()
		//console.log(e)
		let newLocation = e.target.id
		setLocation(newLocation) // changes the location to the one that was clicked
		let piece       = e.target.innerText
		setPiece(piece)
		let family = getPieceColor(piece)
		setColor(family)

		if (family === player) { // only the next player is allowed make a move
			if (activeSquare === newLocation) setActiveSquare(false)  // handles for when you click the same piece twice. it is made inactive (set to false)
			else setActiveSquare(newLocation) // handles when a new location is clicked. changes the active cell to the new location
		}
		else if (activeSquare && canMove(newLocation, board)) {
			// console.log('first')
			let n_board = movePiece(activeSquare, newLocation, oldboard)				
			setBoard(n_board)
			setOldBoard(n_board) // this is needed since the useeffect changes board to oldboard when active is false
			setActiveSquare(false)
			let next_p = changePlayer(player)
			nextPlayer(next_p)
		}
		else if (activeSquare && canKill(activeSquare, newLocation, board, pieceColor)) {
			let [n_board, killed] = killPiece(activeSquare, newLocation, oldboard)				
			setKills( kills.concat(killed) )
			setBoard(n_board)
			setOldBoard(n_board) // this is needed since the useeffect changes board to oldboard when active is false
			setActiveSquare(false)
			let next_p = changePlayer(player)
			nextPlayer(next_p)
	
		}
		else setActiveSquare(false) // if the clicked player is not the next, active is set to false
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
										col-${ each.position[1] } ${ each.isSelected ? "selected" : "" }
										${ each.isKill ? 'kill': '' } ${ each.isActive ? "active" : '' }`
									}
								>
										{ each.piece }
								</div>
							)
						}
					</div>
				</div>

				<span id='loc-state'>{ location }</span>
				<div>
						activeSquare: { activeSquare ? activeSquare : "Null"}
				</div>
				<div>
						activePlayer: { player }
				</div>
				<div>
						piece family: { pieceColor }
				</div>
				<div>
						kills : { kills.map(
							each => <span key={generateRandomString(5)}>{each}</span>
						)}
				</div>
		</div>
	)
}

export default App