import React from 'react';
import { generateRandomString } from '../Utility';

function Stats({ location, player, isCheck, kills, last_piece, last_location, clicked_piece }) {
  return (
    <div className="stats">
      <span id='loc-state'>{location ? location : "..."}</span>
      <div>
        active player: {player ? "white" : "black"}
      </div>
      <div>
        check : {isCheck ? isCheck : ""}
      </div>
      <div>
        kills :
        {kills.length
          ? kills.map(
            each => <span key={generateRandomString(5)}>{each}</span>
          )
          : "..."}
      </div>
      <div>
        last: {last_piece ? last_piece : ""}
      </div>
      <div>
        last location: {last_location ? last_location : ""}
      </div>
      {clicked_piece ? clicked_piece : ".."}
    </div>
  );
}
