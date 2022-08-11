import React from 'react';
import { BoardState } from '../engine/board';
import { BoardPosition, generateRandomString, serializeBoardPosition, serializeFamily } from '../engine/util';

interface StatProps {
  board_state: BoardState
  check_pos  : BoardPosition | null
  click: (e: React.MouseEvent<HTMLButtonElement,MouseEvent>) => void
}

export function Stats({ board_state, check_pos, click  }: StatProps): JSX.Element {
  return (
    <div className="stats" style={{fontFamily: "monospace", color: "white"} }>
      {/* <span id='loc-state'>{location ? location : "..."}</span> */}
      <div>
        active player: {serializeFamily(board_state.current_side)}
      </div>
      <div>
        check : {check_pos}
      </div>
      <div>
        en passant: {board_state.enpassant_sq}
      </div>
      <div>
        kills :
      {
        board_state._killed.map(each => <span key={generateRandomString()}>{each}</span>)
      }
      </div>
      <button onClick={click}>Switch</button>
    </div>
  );
}
