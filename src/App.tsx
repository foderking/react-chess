import React, { useEffect, useState } from 'react'
import Checkmate from './Components/Checkmate'
import LeftSidebar from './Components/LeftSidebar'
import Navbar from './Components/Navbar'
import NowPlaying from './Components/NowPlaying'
import Promotion from './Components/Promotion'
import RightSidebar from './Components/RightSidebar'
import { BoardState } from './engine/board'
import { 
  AllPieces, BoardPosition, defaultMoveMapping, getSquareColor, MoveMapping, parsePosition, serializeBoardPosition, serializePiece
} from './engine/util'
import { Ranks, Files } from './Components/Coords'

const App = () => {
  const [isCheckmate, setCheckmate] = useState(null)
  const [player, setPlayer] = useState(true) // white is to play if player is `true` else, its black
  const [promotion, doPromotion] = useState(false) // controls whether the promotion popup shows
  const [promoted_location, setPromoLocation] = useState(null)
  const [promoted_family, setPromoFamily] = useState(null)
  const [history, setHistory] = useState([/*1,2,3,4,5,1,2,3,4,5,1 ,2,3,4,5,1,5,1 ,2,3,4,5,5,1 ,2,3,4,5,5,1 ,2,3,4,5 ,2,3,4,5*/])

  const [boardState, setBoardState] = useState<BoardState>(new BoardState(/**"5N2/5P1B/2pk1P1K/2pr1r2/3p1P2/3p3p/4Q1p1/8 w - - 0 1"*/))
  const [canKill , setCanKill] = useState<MoveMapping>(defaultMoveMapping())
  const [canMove , setCanMove] = useState<MoveMapping>(defaultMoveMapping())
  const [clickOn , setClickOn] = useState<boolean>(false)
  const [selected, setSelect ] = useState<BoardPosition>(null)
  const [isCheckd, setCheckd ] = useState<BoardPosition>(null)
  const [whiteIsMain, setMain] = useState<boolean>(true)

  const _defaultMoveMap = defaultMoveMapping()

  useEffect(() => {
    //setBoardState(new BoardState())
    console.log(boardState)
    console.log(serializeBoardPosition())
    //setmoveList(boardState.generateMoves())
    console.log(defaultMoveMapping())
  }, [])

 function finishPromotion(piece) {
    doPromotion(false)
    setPromoFamily(false)
    setPromoLocation(false)
  }

  function handleSquareClick<T>(e: React.MouseEvent<T>, position: string) {
    e.preventDefault()
    let pos = parsePosition(position[0], position[1])
    /* The move picking works as thus:
       clickOn determines if a square has beeen clicked (moves for a piece at that square if the piece is valid)
       By default, clickOn, is off

       - if clickOn is off and a square is clicked
          - if there is a piece in the square, and the piece is part of the family to move...
            then moves for that square are shown, and clickOn is set to on
          - else clickOn remains off
       - if clickOn is On and a square is clicked
          - if the square is a valid target location for the move, the move is made, and clickOn is set back to off
          - if the square is not a valid target location, but is part of the family to move, then.. 
            moves are generated for that square with the previous moves discard, and clickOn still remains on
          - if the square is not a valid target location, and not a valid piece to move, then ... 
            the previously generated moves are discarded, and clickOn is reset to off
    */
    // if clickOn is off and a valid square is clicked
    if (!clickOn && boardState.isValidPiece(pos)) {
      let move = Object.assign({}, _defaultMoveMap)
      let kill = Object.assign({}, _defaultMoveMap)
      for (let each of boardState._moveList[pos]) {
        if (each.capturedPiece===AllPieces.NULL) move[each.to] = true
        if (each.capturedPiece!==AllPieces.NULL) kill[each.to] = true
      }
      setCanKill(kill)
      setCanMove(move)
      setClickOn(true)
      setSelect(pos)
    }
    // if a valid target location for current move is clicked
    else if (clickOn && (canKill[pos] || canMove[pos])){
      console.log(`piece at ${position} has been killed`)
      let moveToMake = boardState._moveList[selected].find(each => each.to===pos)
      setBoardState(boardState.make_move(moveToMake))
      setClickOn(false)
      setCanKill(_defaultMoveMap)
      setCanMove(_defaultMoveMap)
      setSelect(null)
    }
    // if another valid square is clicked
    else if (clickOn && boardState.isValidPiece(pos) && pos!==selected){
      let move = Object.assign({}, _defaultMoveMap)
      let kill = Object.assign({}, _defaultMoveMap)
      for (let each of boardState._moveList[pos]) {
        if (each.capturedPiece===AllPieces.NULL) move[each.to] = true
        if (each.capturedPiece!==AllPieces.NULL) kill[each.to] = true
      }
      setCanKill(kill)
      setCanMove(move)
      setSelect(pos)
    }
    // an invalid target location
    else {
      setClickOn(false)
      setCanKill(_defaultMoveMap)
      setCanMove(_defaultMoveMap)
      setSelect(null)
    }
  }

  return (
    <React.StrictMode>
    <div className='contain'>
      <Navbar />

      {
        promotion &&
        <Promotion family={promoted_family} handlePromotion={finishPromotion} />
      }
      {
        isCheckmate &&
        <Checkmate king={player ? "white" : "black"} okay={() => setCheckmate(false)} />
      }

      <div className='main-view'>
        <LeftSidebar />
        <NowPlaying />

        <div className='chessboard'>
          <div className='rand'>
            {
              boardState &&
              <CBoard
                board_state={boardState}
                canKill    ={canKill}
                canMove    ={canMove}
                isCheckd   ={isCheckd}
                selected   ={selected}
                whiteMain  ={whiteIsMain}
                handleClick={handleSquareClick} />
            }
            <Ranks mainSide={whiteIsMain}/>
            <Files mainSide={whiteIsMain}/>
          </div>
        </div>

        <RightSidebar history={history} />
      </div>
      <button onClick={(e) => {e.preventDefault(); setMain(!whiteIsMain)}}>Switch</button>

    </div>
    </React.StrictMode>
  )
}

interface CBoardProps {
  board_state: BoardState
  canKill    : MoveMapping
  canMove    : MoveMapping
  selected   : BoardPosition
  isCheckd   : BoardPosition
  whiteMain  : boolean
  handleClick: <T>(e: React.MouseEvent<T>, pos: string) => void
}

const CBoard = ({ board_state, canKill, canMove, selected, isCheckd, whiteMain,handleClick }: CBoardProps) => {
  return (
    <div className='board' >
      {
        serializeBoardPosition()
          .map(each =>  [(whiteMain ? 8-parseInt(each[1]) : each[1]).toString(), each])
          .sort()
          .map(each => each[1])
          .map(each => each.toLowerCase())
          .map(each =>
            <div
              key={each}
              id={each}
              className= {`text-center board-cell col-${each[1]} row-${each[0]}
                        ${getSquareColor(each[0], each[1])}
           							${ canKill[parsePosition(each[0],each[1])]   ? 'kill'    : '' }
           							${ canMove[parsePosition(each[0],each[1])]   ? 'active'  : '' }
                        ${ selected===parsePosition(each[0],each[1]) ? "selected": "" }
                        ${ isCheckd===parsePosition(each[0],each[1]) ? "check"   : "" }
              `}
              onClick={(e) => handleClick(e, each)}
            >
              {serializePiece(board_state.board[parsePosition(each[0], each[1])])}
              {/* {parsePosition(each[0],each[1])} */}

            </div>
          )
      }
    </div>
  )
}

export default App