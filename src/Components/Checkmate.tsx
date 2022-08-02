import React from 'react'

export default function Checkmate({ king, okay }): JSX.Element
{
	return (
		<div className="promotion_popup">
			<span className="helper"></span>
			<div>
				<h1>Checkmate {king}!!!</h1>
				You've been checkmated motherfucker!.
				<button onClick={okay} >Okay</button>
			</div>
		</div>
	)
}