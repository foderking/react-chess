import React from 'react'

export default function RightSidebar({history}){
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
						history.map( (each,i) =>
						<>
							{
								i % 2
								?
								<div className='move'><span>{each}</span></div>
								:
								<>
									<div className='index'>{parseInt(i/2)+1}</div>
									<div className='move'><span>{each}</span></div>
								</>
							}
						</>
						)
					}
				</div>
				<div class="status">White resigned • Black is victorious</div>

			</div>
		</div>
	)
}