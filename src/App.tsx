import React, { useEffect, useState } from 'react'
import Checkmate from './Components/Checkmate'
import LeftSidebar from './Components/LeftSidebar'
import Navbar from './Components/Navbar'
import NowPlaying from './Components/NowPlaying'
import Promotion from './Promotion'
import RightSidebar from './Components/RightSidebar'
import { Board } from "./constants"
import { promotePawn } from './Utility'
import { BoardState } from './engine/board'
import { 
  AllPieces, BoardPosition, defaultMoveMapping, getSquareColor, MoveMapping, parsePosition, serializeBoardPosition, serializePiece
} from './engine/util'

// i have to do this fucking shit because of javascript stupidity
declare global {
  interface Array<T> {
    contains(val: T): boolean
  }
}

Array.prototype.contains = function (val) {
  let hash = {};
  for (let i = 0; i < this.length; i++) {
    hash[this[i]] = i
  }
  return hash.hasOwnProperty(val)
}



const App = () => {
  const [isCheckmate, setCheckmate] = useState(null)
  const [board, setBoard] = useState(Board) // represents the whole chess board
  const [player, setPlayer] = useState(true) // white is to play if player is `true` else, its black
  const [promotion, doPromotion] = useState(false) // controls whether the promotion popup shows
  const [promoted_location, setPromoLocation] = useState(null)
  const [promoted_family, setPromoFamily] = useState(null)
  const [history, setHistory] = useState([/*1,2,3,4,5,1,2,3,4,5,1 ,2,3,4,5,1,5,1 ,2,3,4,5,5,1 ,2,3,4,5,5,1 ,2,3,4,5 ,2,3,4,5*/])


  const [boardState, setBoardState] = useState<BoardState>(new BoardState())
  const [canKill , setCanKill] = useState<MoveMapping>(defaultMoveMapping())
  const [canMove , setCanMove] = useState<MoveMapping>(defaultMoveMapping())
  const [clickOn , setClickOn] = useState<boolean>(false)
  const [selected, setSelect ] = useState<BoardPosition>(null)
  const [isCheckd, setCheckd ] = useState<BoardPosition>(null)



  useEffect(() => {
    //setBoardState(new BoardState())
    console.log(boardState)
    console.log(serializeBoardPosition())
    //setmoveList(boardState.generateMoves())
    console.log(defaultMoveMapping())
  }, [])



 function finishPromotion(piece) {
    promotePawn(promoted_location, piece, board)
    doPromotion(false)
    setPromoFamily(false)
    setPromoLocation(false)
  }

  function handleSquareClick<T>(e: React.MouseEvent<T>, position: string) {
    e.preventDefault()
    let pos = parsePosition(position[0], position[1])

    if (!clickOn) {
      let move = Object.assign({}, canMove)
      let kill = Object.assign({}, canKill)
      for (let each of boardState._moveList[pos]) {
        if (each.capturedPiece===AllPieces.NULL) move[each.to] = true
        if (each.capturedPiece!==AllPieces.NULL) kill[each.to] = true
      }
      setCanKill(kill)
      setCanMove(move)
      setClickOn(true)
    }
    else {
      if (canKill[pos] || canMove[pos]) console.log(`piece at ${position} has been killed`)
      setClickOn(false)
      setCanKill(defaultMoveMapping())
      setCanMove(defaultMoveMapping())
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
                handleClick={handleSquareClick} />
            }
            <Ranks />
            <Files />
          </div>
        </div>

        <RightSidebar history={history} />
      </div>
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
  handleClick: <T>(e: React.MouseEvent<T>, pos: string) => void
}

const CBoard = ({ board_state, canKill, canMove, selected, isCheckd, handleClick }: CBoardProps) => {
  return (
    <div className='board' >
      {
        serializeBoardPosition()
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

// 							${ (location && !isCheck) && castle_positions.contains([location, each.position]) ? "castle" : ""}
// 							${ validPassant(each, "left") || validPassant(each, "right") ? "en-passant" : ""}`
function Ranks() {
  return (
    <div className="ranks coords">
      <div className="b coord">1</div>
      <div className="w coord">2</div>
      <div className="b coord">3</div>
      <div className="w coord">4</div>
      <div className="b coord">5</div>
      <div className="w coord">6</div>
      <div className="b coord">7</div>
      <div className="w coord">8</div>
    </div>
  )
}

function Files() {
  return (
    <div className="files coords">
      <div className="w coord">a</div>
      <div className="b coord">b</div>
      <div className="w coord">c</div>
      <div className="b coord">d</div>
      <div className="w coord">e</div>
      <div className="b coord">f</div>
      <div className="w coord">g</div>
      <div className="b coord">h</div>
    </div>
  )
}

export default App