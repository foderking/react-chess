import React, { useEffect, useState } from 'react'
import Checkmate from './Components/Checkmate'
import LeftSidebar from './Components/LeftSidebar'
import Navbar from './Components/Navbar'
import NowPlaying from './Components/NowPlaying'
import RightSidebar from './Components/RightSidebar'
import { Board } from './constants'
import Promotion from './Promotion'
import {
	calculateIndex, checkPromotion, generateMoveForBoard, generateRandomString,
	getIndex, getKings, getPiece, getPieceColor, getPieceFromPosition, getType, killPiece, movePiece, promotePawn
} from './Utility'

const App = () =>
{
	const [isCheck, setCheck] = useState(null) // sets when a king is in check; 3 possible value `null`, position of pieces checking white and black king
	const [isCheckmate, setCheckmate] = useState(null)

	const [board, setBoard] =  useState(Board) // represents the whole chess board
	const [white_k, black_k] = getKings(board) // stores the location of the white and black kings

	const [player, setPlayer] = useState(true) // white is to play if player is `true` else, its black
	const [location, setLocation] = useState(null) // location of clicked piece, killable/movable locations are highlighted if its `can_kill` or `can_move` contains `location`
	const [clicked_piece, setPiece] = useState(null) // value of clicked piece
	const [kills, setKills] = useState([]) // all the pieces that have been killed
	const [last_piece, setLast]  = useState(null)
	const [last_location, setLastLocation]  = useState(null)

	const [promotion, doPromotion] = useState(false) // controls whether the promotion popup shows
	const [promoted_location, setPromoLocation] = useState(null)
	const [promoted_family, setPromoFamily] = useState(null)


	generateMoveForBoard(board, white_k, black_k, isCheck) // generate moves
	checkCastle(board)
	const castle_positions = checkCastle(board)
	console.log(board, castle_positions)

	// i have to write this fucking shit because of javascript stupidity
	Array.prototype.contains = function(val){
  let hash = {};
    for (let i=0; i<this.length; i++) {
			hash[this[i]] = i 
		}
    return hash.hasOwnProperty(val)
	}

	const stats = {location, player, isCheck, kills, last_piece, last_location, clicked_piece}
	
	useEffect(()=> {
		if (player && getPiece(white_k, board).can_kill) setCheck("white")
		if (!player && getPiece(black_k, board).can_kill) setCheck("black")
	}, [board])

// hook for checkmating
			// console.log(board.filter(each => each.check[0] || each.check[1]))
	useEffect(() => {
		if (isCheck) {
			// console.log(board.filter(each => each.check[0] || each.check[1]))
			if (board.filter(each => each.check[0] || each.check[1]).length===0) setCheckmate(true)
		}
	}, [isCheck])
	


	function handleClick(e) {
		e.preventDefault()
		let piece_name     = e.target.innerText
		let piece_location = e.target.id
		let family         = getPieceColor(piece_name)
		// get index of piece in board based on location
		let [row, col] = getIndex(piece_location)
		let index      = calculateIndex(row, col)
		let piece = board[index]
		// bolean to determine if piece can kill
		let pieceKill = ((isCheck===null && (location && piece.can_kill)) && piece.can_kill.includes(location))
										||
										((isCheck && (location && (piece.can_kill&&(piece.check[0]||piece.check[1])))) && piece.can_kill.includes(location))
		// bolean to determine if piece can move
		let pieceMove = isCheck==null && ((location && piece.can_move) && piece.can_move.includes(location))
										||
										((isCheck && (location && (piece.can_move&&(piece.check[0]||piece.check[1])))) && piece.can_move.includes(location))

			// console.log(checkEnPassant(last_piece, last_location, piece_location, board))
		// {}
		// undo move if you click twice
		if (piece_location === location) {
			setLocation(null)
			setPiece(null)
		}
		// castling
		else if (isCheck===null && castle_positions.contains([location, piece_location])) {
			console.log(player ? "white" : "black" , "just castled")
			let new_board = castle(piece_location, board)
			setBoard(new_board)

			setLast(clicked_piece) // stores the last moved piece
			setLastLocation(piece_location) // stores location of last moved piece
			setLocation(null)
			setPiece(null)

			setPlayer(!player)
			setCheck(null)
		}
		// en passant
		else if (validPassant(getPiece(piece_location, board), "left")||validPassant(getPiece(piece_location, board), "right")) {
			// console.log("en passant to the right")
				// let left = String.fromCharCode(last_location.charCodeAt(1)-1)
			let color = getPieceColor(clicked_piece)
			let mul = (color==="white") ? 1 : -1
			let new_loc = (piece_location[0]-mul)+piece_location[1]
			console.log(new_loc, color, mul)
			let new_board, killed
			// first kill the pawn en passing
			[new_board, killed] = killPiece(location, new_loc, board) 
			new_board = movePiece(new_loc, piece_location, new_board)

			setBoard(new_board)
			setKills(kills.concat(killed))

			setLast(clicked_piece) // stores the last moved piece
			setLastLocation(piece_location) // stores location of last moved piece
			setLocation(null)
			setPiece(null)

			setPlayer(!player)
			setCheck(null)
		}
		/*
		function enPassant(target, clicked_piece) {
			let new_board
			new_board=  movePiece(location , board)
		}
		*/
		// change moves if another valid piece is clicked
		else if (family==="white" && player || family==="black" && !player) { 
			setLocation(piece_location)
			setPiece(piece_name)
		}
		// {checkEnPassant(last_piece, last_location, piece_location, board)}
		// killing a piece
		else if (pieceKill) {
			let [new_board, killed] = killPiece(location, piece_location, board) 
			setBoard(new_board)
			if (checkPromotion(clicked_piece, piece_location)) startPromotion(player, piece_location) // opens promotion popup if there is a promotion
			setKills(kills.concat(killed))

			setLast(clicked_piece) // stores the last moved piece
			setLastLocation(piece_location) // stores location of last moved piece
			setLocation(null)
			setPiece(null)

			setPlayer(!player)
			setCheck(null)
		}
		// moving to an empty location
		else if (pieceMove) {
			let new_board = movePiece(location, piece_location, board)
			setBoard(new_board)
			if (checkPromotion(clicked_piece, piece_location)) startPromotion(player, piece_location) // opens promotion popup if there is a promotion

			setLast(clicked_piece) // stores the last moved piece
			setLastLocation(piece_location) // stores location of last moved piece
			setLocation(null)
			setPiece(null)

			setPlayer(!player)
			setCheck(null)
		}
		// an empty or invalid piece is clicked
		else {
			setLocation(null)
			setPiece(null)
		}
	}

	/* 
	Castling is permissible if the following conditions are met:
		- Neither the king nor the rook has previously moved during the game.
		- There are no pieces between the king and the rook.
		- The king is not in check and does not pass through or land on any square attacked by an enemy piece.
*/
	function checkCastle(board) {
		const white_left  = board.find(each => each.position==="1a").piece
		const white_right = board.find(each => each.position==="1h").piece
		const black_left  = board.find(each => each.position==="8a").piece
		const black_right = board.find(each => each.position==="8h").piece
		const white_king  =  board.find(each => each.position==="1e").piece
		const black_king  =  board.find(each => each.position==="8e").piece
		let ans = []

		let wl_valid = white_left.moves ===0 && (getType(white_left.name )==="rook" && getPieceColor(white_left.name )==="white")
		let wr_valid = white_right.moves===0 && (getType(white_right.name)==="rook" && getPieceColor(white_right.name)==="white")
		let bl_valid = black_left.moves ===0 && (getType(black_left.name )==="rook" && getPieceColor(black_left.name )==="black")
		let br_valid = black_right.moves===0 && (getType(black_right.name)==="rook" && getPieceColor(black_right.name)==="black")
		
		let wk_valid = white_king.moves===0 && (getType(white_king.name)==="king" && getPieceColor(white_king.name)==="white")
		let bk_valid = black_king.moves===0 && (getType(black_king.name)==="king" && getPieceColor(black_king.name)==="black")

		// castle for 1c
		if (wl_valid && wk_valid){
			if (board.filter(each => each.position[0]==="1" && each.position[1] > "a"
														&& each.position[1] < "e" && each.piece.name).length===0) ans.push(["1e","1c"])
		}
		// castle for 1g
		if (wr_valid && wk_valid){
			if (board.filter(each => each.position[0]==="1" && each.position[1] > "e"
														&& each.position[1] < "h" && each.piece.name).length===0) ans.push(["1e","1g"])
		}
		// castle for 8c
		if (bl_valid && bk_valid) {
			if (board.filter(each => each.position[0]==="8" && each.position[1] > "a"
														&& each.position[1] < "e" && each.piece.name).length===0) ans.push(["8e","8c"])
		}
		// castle for 8g
		if (br_valid && bk_valid){
			if (board.filter(each => each.position[0]==="8" && each.position[1] > "e"
														&& each.position[1] < "h" && each.piece.name).length===0) ans.push(["8e","8g"])
		}

		return ans
	}

	function castle(position, board){
		// const castle_positions = ["8c", "8g", "1c", "1g"]
		let new_board
		switch (position) {
			case "1g":
				//move king
				new_board = movePiece("1e", "1g", board)
				//move knight
				new_board = movePiece("1h", "1f", new_board)
				break
			case "8g":
				//move king
				new_board = movePiece("8e", "8g", board)
				//move knight
				new_board = movePiece("8h", "8f", new_board)
				break
			case "1c":
				// move king
				new_board = movePiece("1e", "1c", board)
				//move knight
				new_board = movePiece("1a", "1d", new_board)
				break
			case "8c":
				// move king
				new_board = movePiece("8e", "8c", board)
				//move knight
				new_board = movePiece("8a", "8d", new_board)
				break
			default: throw "castle error"
		}
		return new_board
	}
	/*
	Conditions for En Passant
		- last moved piece is a pawn
		- last moved piece must have moved once with two steps
		- current moveing piece is a pawn
		- current piece must be directly to the left or right of target

	*/
	function checkEnPassant(last_piece, last_location, current_location, board) {
		const ranks = {
			"white" : "4", "black" : "5"
		}
		let current_piece = getPieceFromPosition(current_location, board) 
		if (!last_piece || !current_piece || !current_location || !last_location) return false
		if (getType(last_piece) !== "pawn" || getType(current_piece) !== "pawn") return false
		if (getPiece(last_location, board).piece.moves !== 1) return false
		if (ranks[getPieceColor(last_piece)] !== last_location[0]) return false // checks if first move is two steps
		if (last_location[0]===current_location[0] && Math.abs(cols.indexOf(last_location[1])-cols.indexOf(current_location[1]))===1) return true
		return false
	}

	function startPromotion(family, piece_location) {
		doPromotion(true)
		setPromoFamily(family)
		setPromoLocation(piece_location)
	}

	function validDuringCheck(each) {
		/*
		determines which pieces can be moved during check
		each.check[0] is only for king
		each.check[1] is for other pieces
		*/
		// console.log(each.chce)
		let king = isCheck==="white" ? white_k : black_k
		return (clicked_piece === getPieceFromPosition(king, board) ? !isCheck===!each.check[0] : !isCheck===!each.check[1])
	}

	function validPassant(each, pos) {
		if (!last_piece || !last_location) return false
		if (getType(last_piece)!=="pawn") return false
		let color = getPieceColor(last_piece)
		let mul = color==="white" ? -1 : 1
		let full
		if (each.position[1]!==last_location[1]) return false
		if (each.position[0]-last_location[0]!==mul) return false
		switch (pos) {
			case "right":
				let left = String.fromCharCode(last_location.charCodeAt(1)-1)
				if (left<"a") return false
				full = last_location[0]+left
				// console.log(location, full)
				if (full!==location) return false
				return checkEnPassant(last_piece, last_location, full, board)
			case "left":
				let right = String.fromCharCode(last_location.charCodeAt(1)+1)
				if (right>"h") return false
				full = last_location[0]+right
				if (full!==location) return false
				return checkEnPassant(last_piece, last_location, full, board)
			default: throw "valid passant error"
		}
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
		<div className='contain'>
				{/* <h1>Chess App</h1> */}
				<Navbar />
				{ 
					promotion &&
					<Promotion family={promoted_family} handlePromotion={finishPromotion} />
				}
				{
					isCheckmate &&
					<Checkmate king={ player ? "white" : "black" }/>
				}
				<div className='main-view'>
					<LeftSidebar />
					<NowPlaying />
					<div className='chessboard'>
					<div className='rand'>

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
											${ (location && each.can_kill) && (validDuringCheck(each) && each.can_kill.includes(location)) ? 'kill'   : '' }
											${ (location && each.can_move) && (validDuringCheck(each) && each.can_move.includes(location)) ? "active" : '' }
											${ isCheck==="white" && each.position===white_k || isCheck==="black" && each.position===black_k ? "check" : "" }
											${ (location ) && castle_positions.contains([location, each.position]) ? "castle" : ""}
											${ validPassant(each, "left") || validPassant(each, "right") ? "en-passant" : ""}`
										}
									>
										{ each.piece.name }
									</div>
								)
							}
						</div>

						<div class="ranks coords">
							<div className="b coord">1</div>
							<div className="w coord">2</div>
							<div className="b coord">3</div>
							<div className="w coord">4</div>
							<div className="b coord">5</div>
							<div className="w coord">6</div>
							<div className="b coord">7</div>
							<div className="w coord">8</div>
						</div>
						<div class="files coords">
							<div className="w coord">a</div>
							<div className="b coord">b</div>
							<div className="w coord">c</div>
							<div className="b coord">d</div>
							<div className="w coord">e</div>
							<div className="b coord">f</div>
							<div className="w coord">g</div>
							<div className="b coord">h</div>
						</div>
					</div>
					</div>
					<RightSidebar />
				</div>

				{/* <Stats {...stats} /> */}
		</div>
	)
}

function Stats({location, player, isCheck, kills, last_piece, last_location, clicked_piece}) {
	return (
		<div className="stats">
			<span id='loc-state'>{ location ? location : "..." }</span>
			<div>
					active player: { player ? "white" : "black" }
			</div>
			<div>
					check : { isCheck ? isCheck : "" }
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
			<div>
				last: { last_piece ? last_piece : ""}
			</div>
			<div>
				last location: { last_location ? last_location : ""}
			</div>
			{ clicked_piece ? clicked_piece : ".."}
		</div>
	)
}

export default App