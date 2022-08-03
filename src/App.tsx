import React, { useEffect, useState } from 'react'
import Checkmate from './Components/Checkmate'
import LeftSidebar from './Components/LeftSidebar'
import Navbar from './Components/Navbar'
import NowPlaying from './Components/NowPlaying'
import Promotion from './Components/Promotion'
import RightSidebar from './Components/RightSidebar'
import { BoardState } from './engine/board'
import { 
  AllPieces, BoardDictionary, BoardPosition, checkCondition, ConditionNotSatisfiedError, defaultMoveMapping, deserializePiece, Family, getPromotionTypes, getSquareColor, MoveMapping, NotExpectedError, parsePosition, serializeBoardPosition, serializePiece
} from './engine/util'
import { Ranks, Files } from './Components/Coords'
import { Stats } from './Components/Stats'

const App = () => {
  const [isCheckmate, setCheckmate] = useState<boolean>(false)

  const [promoted_loc   , setPromoLocation] = useState<BoardPosition>()
  const [promoted_family, setPromoFamily  ] = useState<Family>()
  const [isPromotion    , setPromotion    ] = useState<boolean>(false)
  // const [boardState, setBoardState] = useState<BoardState>(new BoardState("5N2/5P1B/2pk1P1K/2pr1r2/3p1P2/3p3p/4Q1p1/8 w - - 0 1"))
  const [boardState, setBoardState] = useState<BoardState>(new BoardState())
  const [canPromote, setPromote] = useState<BoardDictionary<boolean>>(defaultMoveMapping())
  const [canKill , setCanKill] = useState<MoveMapping>(defaultMoveMapping())
  const [canMove , setCanMove] = useState<MoveMapping>(defaultMoveMapping())
  const [clickOn , setClickOn] = useState<boolean>(false)
  const [selected, setSelect ] = useState<BoardPosition | null>(null)
  const [isCheckd, setCheckd ] = useState<BoardPosition | null>(null)
  const [whiteIsMain, setMain] = useState<boolean>(true)

  const _defaultMoveMap = defaultMoveMapping()

  useEffect(() => {
    //setBoardState(new BoardState())
    console.log(boardState)
    // console.log(serializeBoardPosition())
    //setmoveList(boardState.generateMoves())
    // console.log(defaultMoveMapping())
  }, [boardState])

  function finishPawnPromotion(piece: string) {
    let promoted_to = getPromotionTypes(deserializePiece(piece))

    if (promoted_loc===undefined || selected===null) throw new ConditionNotSatisfiedError()
    let moveToMake = boardState._moveList[selected].find(each => each.to===promoted_loc && each.promotion===promoted_to)
    if (moveToMake===undefined) throw new ConditionNotSatisfiedError()


    // setPromoFamily(null)
    // setPromoLocation(null)
    setPromotion(false)

    setCanKill(_defaultMoveMap)
    setCanMove(_defaultMoveMap)
    setPromote({})

    setBoardState(boardState.make_move(moveToMake))
    setClickOn(false)
    setSelect(null)

    console.log(piece, deserializePiece(piece))
  }

  function startPawnPromotion (family: Family, location: BoardPosition) {
    setPromotion(true)
    setPromoFamily(family)
    setPromoLocation(location)
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
      let promo: BoardDictionary<boolean> = {}
      for (let each of boardState._moveList[pos]) {
        if (each.promotion !== undefined) promo[each.to] = true
        else if (each.capturedPiece===AllPieces.NULL) move[each.to] = true
        else kill[each.to] = true
      }
      setCanKill(kill)
      setCanMove(move)
      setPromote(promo)

      setClickOn(true)
      setSelect(pos)
    }
    // if a valid target location for current move is clicked
    else if (clickOn && (canKill[pos] || canMove[pos])){
      if (selected===null)   throw new NotExpectedError()
      let moveToMake = boardState._moveList[selected].find(each => each.to===pos)
      if (moveToMake===undefined) throw new NotExpectedError()

      setCanKill(_defaultMoveMap)
      setCanMove(_defaultMoveMap)
      setPromote({})

      setBoardState(boardState.make_move(moveToMake))
      setClickOn(false)
      setSelect(null)
    }
    else if (clickOn && (canPromote[pos])){
      // start pawn promotion
      setPromotion(true)
      setPromoFamily(boardState.current_side)
      setPromoLocation(pos)
    }
    // if another valid square is clicked
    else if (clickOn && boardState.isValidPiece(pos) && pos!==selected){
      let move = Object.assign({}, _defaultMoveMap)
      let kill = Object.assign({}, _defaultMoveMap)
      let promo: BoardDictionary<boolean> = {}
      for (let each of boardState._moveList[pos]) {
        if (each.promotion !== undefined) promo[each.to] = true
        else if (each.capturedPiece===AllPieces.NULL) move[each.to] = true
        else kill[each.to] = true
      }
      setCanKill(kill)
      setCanMove(move)
      setPromote(promo)

      setSelect(pos)
    }
    // an invalid target location
    else {
      setCanKill(_defaultMoveMap)
      setCanMove(_defaultMoveMap)
      setPromote({})

      setClickOn(false)
      setSelect(null)
    }
  }

  return (
    <React.StrictMode>
    <div className='contain'>
      <Navbar />

      {
        isPromotion &&
        <Promotion family={promoted_family as Family} finishPromotion={finishPawnPromotion} />
      }
      {
        isCheckmate &&
        <Checkmate king={whiteIsMain ? "white" : "black"} okay={() => setCheckmate(false)} />
      }

      <div className='main-view'>
        <LeftSidebar />
        <NowPlaying />

        <div className='chessboard'>
          <div className='rand'>
            {
              boardState &&
              <CBoard
                board_state={ boardState }
                canKill    ={ canKill }
                canMove    ={ canMove }
                isCheckd   ={ isCheckd }
                selected   ={ selected }
                whiteMain  ={ whiteIsMain }
                canPromote ={ canPromote }
                handleClick={ handleSquareClick }
              />
            }
            <Ranks mainSide={ whiteIsMain }/>
            <Files mainSide={ whiteIsMain }/>
          </div>
        </div>

        <RightSidebar history={boardState._pastMoves} />
      </div>
      <Stats
        board_state={boardState}
        check_pos = {isCheckd}
        click={(e) => {e.preventDefault(); setMain(!whiteIsMain)}}
      />
    </div>
    </React.StrictMode>
  )
}

interface CBoardProps {
  board_state: BoardState
  canKill    : MoveMapping
  canMove    : MoveMapping
  selected   : BoardPosition | null
  isCheckd   : BoardPosition | null
  canPromote : BoardDictionary<boolean>
  whiteMain  : boolean
  handleClick: <T>(e: React.MouseEvent<T>, pos: string) => void
}

const CBoard = ({ board_state, canKill, canMove, selected, isCheckd, whiteMain, canPromote, handleClick }: CBoardProps) => {
  const wMapping = serializeBoardPosition()
                    .map(each =>  [(8-parseInt(each[1])).toString(), each])
                    .sort()
                    .map(each => each[1])
  return (
    <div className='board' >
      {
        (whiteMain ? wMapping : wMapping.reverse())
          .map(each => each.toLowerCase())
          .map(each =>
            <div
              key={each}
              id={each}
              className= {`text-center board-cell col-${each[1]} row-${each[0]}
                        ${getSquareColor(each[0], each[1])}
           							${ canKill[parsePosition(each[0],each[1])]   ? 'kill'     : '' }
           							${ canMove[parsePosition(each[0],each[1])]   ? 'move'     : '' }
           							${ canPromote[parsePosition(each[0],each[1])]? 'promotion': '' }
                        ${ selected && selected===parsePosition(each[0],each[1]) ? "selected": "" }
                        ${ isCheckd && isCheckd===parsePosition(each[0],each[1]) ? "check"   : "" }
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