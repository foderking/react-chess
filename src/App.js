import React, { useEffect, useState } from 'react'
import { 
	parseBishop, parseKnight, parseRook, parsePawn, GetArr, GetSquareColor, GetCol, GetFamily, GetLocation, GetRow, GetType, checkKill, CalcIfFirst, parseKing, parseQueen, 
} from './lib'
import { bishopCapture, Board, getPieceColor, kingCapture, knightCapture, pawnCapture, queenCapture, rookCapture } from './Utility'

const App = () =>
{
	const [board, setBoard] =  useState(Board) // represents the whole chess board
	const [oldboard, setOldBoard] =  useState(Board) // represents the whole chess board
	const [player, nextPlayer] = useState("white") // the current player. set to white at the start of the game
	const [location, setLocation] = useState("..")
	const [activeSquare, setActiveSquare] = useState(false)
	const [pieceColor, setColor] = useState("..")

	useEffect( () => {
		if (activeSquare) { // changes possible moves when a new square is selected
			let b = pawnCapture(location, oldboard, pieceColor) // uses old board with previously active moves
			setBoard(b)
			// console.log("first")
			// console.log(b)
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
		let piece       = e.target.innerText

		setLocation(newLocation) // changes the location to the one that was clicked
		let family = getPieceColor(piece)
		setColor(family)

		if (family === player) { // only the next player is allowed make a move
			if (activeSquare === newLocation) {
				setActiveSquare(false)  // if the the location that was clicked has been
																	// has been clicked before, set active to false( makes cell inactive)

			}
			else {
				setActiveSquare(newLocation)// or else, changes the active cell to the new location
				// let b = rookCapture(location, board)
				// console.log(b)
			}
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
		</div>
	)
}

export default App