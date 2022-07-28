import React from 'react'
import {
white_rook, white_bishop, white_knight, white_queen,
black_rook, black_bishop, black_knight, black_queen, generateRandomString } from "../engine/util"

export default function Promotion({ family, handlePromotion })
{
  const white_promotions = [white_rook, white_bishop, white_knight, white_queen]
  const black_promotions = [black_rook, black_bishop, black_knight, black_queen]
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