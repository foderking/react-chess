import React from 'react'
import { generateRandomLine } from './dummy'
import DummyParagraph from './DummyParagraph'


const DummySentence = (props) => 
{
	const sentence = generateRandomLine(props.length)

	return <>{sentence}</>
}


export default DummySentence