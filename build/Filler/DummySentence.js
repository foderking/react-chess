"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var dummy_1 = require("./dummy");
var DummySentence = function (props) {
    var sentence = (0, dummy_1.generateRandomLine)(props.length);
    return react_1.default.createElement(react_1.default.Fragment, null, sentence);
};
exports.default = DummySentence;
//# sourceMappingURL=DummySentence.js.map