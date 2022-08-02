import React from 'react'
import { getMoveNotation, Move } from '../engine/movegen'
import { generateRandomString } from '../engine/util'

interface RSidebardProps {
  history: Move[]
}
export default function RightSidebar({history}: RSidebardProps): JSX.Element {
	return (
		<div className='right-sidebar analyze text-center'>
			<div className='ceval'>
				<span className='pearl'></span>
				<div className='help'>
					<span>Random Title</span>
				</div>
				<div className='switch'></div>
			</div>
			
			<div className='analyze-moves'>
				{/* <div class="result">0-1</div> */}

				<div className='tview2 tview2-column'>
					{
						history
              .map(each => getMoveNotation(each))
              .map((each: string, i: number) =>
                <>
                  {
                    i % 2
                    ?
                    <div className='move' key={generateRandomString()}><span>{each}</span></div>
                    :
                    <>
                      <div className='index' key={generateRandomString()}>{parseInt((i/2).toString())+1}</div>
                      <div className='move' key={generateRandomString()}><span>{each}</span></div>
                    </>
                  }
                </>
              )
					}
				</div>
				<div className="status">White resigned • Black is victorious</div>

			</div>
		</div>
	)
}