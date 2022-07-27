import { black_promotions, white_promotions } from "./constants";
import React from 'react'
import { generateRandomString } from "./Utility";

export default function Promotion({ family, handlePromotion })
{
	return (
		<div className="promotion_popup">
			<span className="helper"></span>
			<div>
				<h1>Promotion</h1>
				Please pick piece to promote to
				<div>
					{
						family
						?	white_promotions.map(each =>
							<span onClick={() => handlePromotion(each)} key={generateRandomString()} className="promo">
								{ each }
							</span>
						)
						: black_promotions.map(each =>
							<span onClick={() => handlePromotion(each)} key={generateRandomString()} className="promo">
								{ each }
							</span>
						)
					}
				</div>
			</div>
		</div>
	)
}