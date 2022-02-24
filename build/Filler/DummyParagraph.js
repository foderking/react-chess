"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var dummy_1 = require("./dummy");
var dummy_2 = require("./dummy");
var DummyParagraph = function (props) {
    // recieves an array of paragraphs
    var paragraph = (0, dummy_1.generateRandomParagraph)(props.length, true);
    // maps each element to a paragraph element and renders everything
    return react_1.default.createElement(react_1.default.Fragment, null,
        " ",
        paragraph.map(function (each) { return react_1.default.createElement("p", { key: (0, dummy_2.RandomNumGen)() }, each); }),
        " ");
};
exports.default = DummyParagraph;
//# sourceMappingURL=DummyParagraph.js.map