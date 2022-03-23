import { black_pieces, white_pieces } from "./constants";
import React from 'react'

export default function Promotion({ family })
{
	return (
		<div className="promotion_popup">
			<span className="helper"></span>
			<div>
				<h1>Promotion</h1>
				Please pick piece to promote to
				<div>
					{ family === "white" ?
						white_pieces.join(" ")
						: black_pieces.join(" ")
					}
				</div>
			</div>
		</div>
	)
}