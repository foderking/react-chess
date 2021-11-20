import React from 'react'
import { generateRandomParagraph } from './dummy'
import { RandomNumGen } from './dummy'


const DummyParagraph = (props) =>
{
	// recieves an array of paragraphs
	const paragraph = generateRandomParagraph(props.length, true)

	// maps each element to a paragraph element and renders everything
	return <> { 
		paragraph.map( each => <p key={RandomNumGen()}>{each}</p> ) 
	} </>
}

export default DummyParagraph