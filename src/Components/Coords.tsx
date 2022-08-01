import React from 'react';
const ranks = "12345678"
const colms = "abcdefgh"
// 							${ (location && !isCheck) && castle_positions.contains([location, each.position]) ? "castle" : ""}
// 							${ validPassant(each, "left") || validPassant(each, "right") ? "en-passant" : ""}`
interface CoordProps {
  mainSide: boolean
}

export function Ranks({mainSide}: CoordProps) {
  let arr  = ["1","2","3","4","5","6","7","8"]
  let main = false
  return (
    <div className="ranks coords">
      {
        (mainSide ? arr : arr.reverse())
          .map(each => {
            main = !main
            return <div key={each} className={`${main ? "w" : "b"} coord`}>{each}</div>
          }
          , main)
      }
    </div>
  );
}
export function Files({mainSide}: CoordProps) {
  let arr = ["a","b","c","d","e","f","g","h"]
  let main = true
  return (
    <div className="files coords">
      {
        (mainSide ? arr : arr.reverse())
          .map(each => {
            main = !main
            return <div key={each} className={`${main ? "w" : "b"} coord`}>{each}</div>
          }
          , main)
      }
    </div>
  );
}
