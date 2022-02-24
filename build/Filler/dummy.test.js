var dummy = require('./dummy');
var MAX_PARAGRAPHS = dummy.getMaxParagraphNo();
var MAX_LINE = dummy.getMaxSentenceNo(true);
var MIN_LINE = dummy.getMinSentenceNo(true);
var DEBUG = false;
describe('testing "generateRandomParagraph()"', function () {
    test('should generate correct paragraphs', function () {
        var text = dummy.generateRandomParagraph(5, true);
        expect(text.length).toBe(5);
    });
    test('behaviour when generating 0 paragraphs', function () {
        var text = dummy.generateRandomParagraph(0);
        expect(text.length).toBe(0);
    });
    test('should work with a random number of paragraphs', function () {
        var no = dummy.Random(MAX_PARAGRAPHS);
        var text = dummy.generateRandomParagraph(no, true);
        expect(text.length).toBe(no);
    });
    test('behaviour when generating the maximum amount of paragraphs', function () {
        var text = dummy.generateRandomParagraph(MAX_PARAGRAPHS, true);
        expect(text.length).toBe(MAX_PARAGRAPHS);
    });
    test('behaviour when generating an amount higher than maximum', function () {
        var text = dummy.generateRandomParagraph(MAX_PARAGRAPHS + 20, true);
        expect(text.length).toBe(MAX_PARAGRAPHS);
    });
    test('behaviour when given a negative number as argument', function () {
        var no = -1 * dummy.Random(MAX_PARAGRAPHS);
        var text = dummy.generateRandomParagraph(no, true);
        if (DEBUG)
            console.log(no);
        expect(text.length).toBe(0);
    });
});
describe('testing "generateRandomLine()"', function () {
    test('should generate correct sentence', function () {
        var text = dummy.generateRandomLine(5);
        expect(dummy.sentenceSplit(text).length).toBe(5);
    });
    test('behaviour when generating sentence with 0 words ', function () {
        var text = dummy.generateRandomLine(0);
        if (DEBUG)
            console.log(text, dummy.paragraphSplit(text));
        expect(dummy.sentenceSplit(text).length).toBe(0);
    });
    test('behaviour when generating the maximum amount of words', function () {
        var text = dummy.generateRandomLine(MAX_LINE, true);
        expect(text.length).toBeGreaterThanOrEqual(MIN_LINE);
        expect(text.length).toBeLessThanOrEqual(MAX_LINE);
    });
    test('should work with a random number of paragraphs', function () {
        var no = dummy.Random(MIN_LINE);
        var text = dummy.generateRandomLine(no, true);
        if (DEBUG)
            console.log(no);
        expect(text.length).toBe(no);
    });
    test('behaviour when generating an amount higher than maximum', function () {
        var text = dummy.generateRandomLine(MAX_LINE + 20, true);
        expect(text.length).toBeGreaterThanOrEqual(MIN_LINE);
        expect(text.length).toBeLessThanOrEqual(MAX_LINE);
    });
    test('behaviour when given a negative number as argument', function () {
        var no = -1 * dummy.Random(MAX_LINE);
        var text = dummy.generateRandomLine(no, true);
        if (DEBUG)
            console.log(no);
        expect(text.length).toBe(0);
    });
});
describe('testing "generateRandomWord()"', function () {
    test('should generate correct word', function () {
        var text = dummy.generateRandomWord();
        if (DEBUG)
            console.log(text);
        expect(dummy.sentenceSplit(text).length).toBe(1);
    });
});
//# sourceMappingURL=dummy.test.js.map