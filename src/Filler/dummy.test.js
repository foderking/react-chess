const dummy = require('./dummy')

const MAX_PARAGRAPHS = dummy.getMaxParagraphNo() 
const MAX_LINE = dummy.getMaxSentenceNo(true) 
const MIN_LINE = dummy.getMinSentenceNo(true) 
const DEBUG = false

describe('testing "generateRandomParagraph()"', () => {
	test('should generate correct paragraphs', () => {
		const text = dummy.generateRandomParagraph(5, true)	

		expect( text.length ).toBe(5)
	})

	test('behaviour when generating 0 paragraphs', () => {
		const text = dummy.generateRandomParagraph(0)	

		expect( text.length ).toBe(0)
	})

	test('should work with a random number of paragraphs', () => {
		const no = dummy.Random(MAX_PARAGRAPHS) 
		const text = dummy.generateRandomParagraph(no, true)	

		expect( text.length ).toBe(no)
	})

	test('behaviour when generating the maximum amount of paragraphs', () => {
		const text = dummy.generateRandomParagraph(MAX_PARAGRAPHS, true)	

		expect( text.length ).toBe(MAX_PARAGRAPHS)
	})

	test('behaviour when generating an amount higher than maximum', () => {
		const text = dummy.generateRandomParagraph(MAX_PARAGRAPHS + 20, true)	

		expect( text.length ).toBe(MAX_PARAGRAPHS)
	})

	test('behaviour when given a negative number as argument', () => {
		const no = -1 * dummy.Random(MAX_PARAGRAPHS)
		const text = dummy.generateRandomParagraph(no, true)	
		
		if (DEBUG) console.log(no)

		expect( text.length ).toBe(0)
	})

})

describe('testing "generateRandomLine()"', () => {
	test('should generate correct sentence', () => {
		const text = dummy.generateRandomLine(5)	

		expect( dummy.sentenceSplit(text).length ).toBe(5)
	})

	test('behaviour when generating sentence with 0 words ', () => {
		const text = dummy.generateRandomLine(0)	
		
		if (DEBUG) console.log(text, dummy.paragraphSplit(text))

		expect( dummy.sentenceSplit(text).length ).toBe(0)
	})

	test('behaviour when generating the maximum amount of words', () => {
		const text = dummy.generateRandomLine(MAX_LINE, true)	
		
		expect( text.length ).toBeGreaterThanOrEqual(MIN_LINE);
		expect( text.length ).toBeLessThanOrEqual(MAX_LINE);
	})

	test('should work with a random number of paragraphs', () => {
		const no = dummy.Random(MIN_LINE) 
		const text = dummy.generateRandomLine(no, true)	
		
		if (DEBUG) console.log(no)

		expect( text.length ).toBe(no)
	})

	test('behaviour when generating an amount higher than maximum', () => {
		const text = dummy.generateRandomLine(MAX_LINE + 20, true)	

		expect( text.length ).toBeGreaterThanOrEqual(MIN_LINE);
		expect( text.length ).toBeLessThanOrEqual(MAX_LINE);
	})

	test('behaviour when given a negative number as argument', () => {
		const no = -1 * dummy.Random(MAX_LINE)
		const text = dummy.generateRandomLine(no, true)	
		
		if (DEBUG) console.log(no)

		expect( text.length ).toBe(0)
	})
})

describe('testing "generateRandomWord()"', () => {
		test('should generate correct word', () => {
		const text = dummy.generateRandomWord()	

	  if (DEBUG) console.log(text)

		expect( dummy.sentenceSplit(text).length ).toBe(1)
	})
})
