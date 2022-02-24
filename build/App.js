"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lib_1 = require("./lib");
var App = function () {
    var white_king = '♔';
    var white_queen = '♕';
    var white_rook = '♖';
    var white_bishop = '♗';
    var white_knight = '♘';
    var white_pawn = '♙';
    var black_king = '♚';
    var black_queen = '♛';
    var black_rook = '♜';
    var black_bishop = '♝';
    var black_knight = '♞';
    var black_pawn = '♟';
    var _a = (0, react_1.useState)({
        white: [0, 1],
        black: [7, 6]
    }), arrangement = _a[0], SetArrange = _a[1];
    var board_array = (0, lib_1.GetArr)();
    // Constant value representining all position in board
    // [
    // 	 0, 1, 2, 3, 4, 5, 6, 7,
    // 	 8, 9,10,11,12,13,14,15,
    // 	16,17,18,19,20,21,22,23,
    // 	24,25,26,27,28,29,30,31,
    // 	32,33,34,35,36,37,38,39,
    // 	40,41,42,43,44,45,46,47,
    // 	48,49,50,51,52,53,54,55,
    // 	56,57,58,59,60,61,62,63
    // ]
    var _b = (0, react_1.useState)([
        ['', '', '', '', '', white_bishop, white_knight, white_rook],
        [white_pawn, white_pawn, white_pawn, white_bishop, white_pawn, white_pawn, white_pawn, white_pawn],
        ['', '', '', white_pawn, '', black_pawn, '', ''],
        ['', '', white_queen, '', '', '', white_king, ''],
        [white_rook, '', white_knight, '', '', '', '', ''],
        ['', black_pawn, '', '', '', '', '', ''],
        [black_pawn, '', '', black_pawn, black_pawn, black_pawn, black_pawn, black_pawn],
        [black_rook, black_knight, black_bishop, black_queen, black_king, black_bishop, black_knight, black_rook],
    ]), player_array = _b[0], SetPlayer = _b[1];
    var _c = (0, react_1.useState)('nil'), location = _c[0], SetLocation = _c[1];
    var _d = (0, react_1.useState)(true), new_move = _d[0], SetMove = _d[1];
    function GetType(piece) {
        console.log(piece);
        var pawns = [black_pawn, white_pawn];
        var knights = [black_knight, white_knight];
        var rooks = [black_rook, white_rook];
        var bishops = [black_bishop, white_bishop];
        var queens = [black_queen, white_queen];
        var kings = [black_king, white_king];
        if (pawns.includes(piece)) {
            return 'pawn';
        }
        if (knights.includes(piece)) {
            return 'knight';
        }
        if (rooks.includes(piece)) {
            return 'rook';
        }
        if (bishops.includes(piece)) {
            return 'bishop';
        }
        if (queens.includes(piece)) {
            return 'queen';
        }
        if (kings.includes(piece)) {
            return 'king';
        }
        return null;
    }
    // 		<>
    // 		<button className='board-cell postive'> { items[0] } </button>
    // 		<button className='board-cell negative'>{ items[1] } </button>
    // 		<button className='board-cell postive'> { items[2] } </button>
    // 		<button className='board-cell negative'>{ items[3] } </button>
    // 		<button className='board-cell postive'> { items[4] } </button>
    // 		<button className='board-cell negative'>{ items[5] } </button>
    // 		<button className='board-cell postive'> { items[6] } </button>
    // 		<button className='board-cell negative'>{ items[7] } </button>
    // 		<button className='board-cell negative'>{ items[8] } </button>
    // 		<button className='board-cell postive'> { items[9] } </button>
    // 		<button className='board-cell negative'>{ items[10]} </button>
    // 		<button className='board-cell postive'> { items[11]} </button>
    // 		<button className='board-cell negative'>{ items[12]} </button>
    // 		<button className='board-cell postive'> { items[13]} </button>
    // 		<button className='board-cell negative'>{ items[14]} </button>
    // 		<button className='board-cell postive'> { items[15]} </button>
    // 		</>
    var Rules = /** @class */ (function () {
        /**
         *
         * @param { int } location location of the piece on board
         * @param {*} type type of pice - pawn, king etc..
         * @param {*} famility  family of piece, whether black(negative) or white(postive)
         */
        function Rules(location, type, family) {
            if (!location || !type || !family) {
                throw 'specify constructors';
            }
            this.type = type;
            this.family = family;
            this.init_arr = __spreadArray([], player_array, true);
            this.parseLocation(location);
            this.addRules();
        }
        Rules.prototype.move = function (type) {
            this.parseRule(type);
        };
        Rules.prototype.parseLocation = function (location) {
            var dic = { 'h': '0', 'g': '1', 'f': '2', 'e': '3', 'd': '4', 'c': '5', 'b': '6', 'a': '7' };
            var arr = this.init_arr;
            var row = parseInt(location[1]) - 1;
            var col = parseInt(dic[location[0]]);
            var elem = arr[row][col];
            // console.log(elem)
            this.current_row = row;
            this.current_col = col;
            this.current_elem = elem;
        };
        Rules.prototype.parseRule = function (type) {
            var rule = this.RULES;
            // console.log(rule)
            if (!Object.keys(rule).includes(this.type)) {
                throw 'wrong type';
            }
            if (type === 'first') {
                var is_first = (0, lib_1.CalcIfFirst)(this.type, this.family, this.current_row, this.current_col, arrangement);
                // will result to 'first' only for pawn and the others implemented in calciffirst
                var key = is_first ? 'first' : 'normal';
                console.log('key -> ', key);
                this.new_arr = rule[this.type][key]();
                this.kill = rule[this.type]['kill']();
                SetPlayer(this.new_arr);
                // console.log()
            }
            else if (type === 'second') {
                console.log('second');
                SetPlayer(this.init_arr);
                // console.log(rule[this.type]['normal']())
            }
            // SetPlayer(ans)
        };
        Rules.prototype.addRules = function () {
            var _this = this;
            this.RULES = {
                pawn: {
                    first: function () { return (0, lib_1.parsePawn)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'first' }); },
                    normal: function () { return (0, lib_1.parsePawn)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'normal' }); },
                    kill: function () { return (0, lib_1.parsePawn)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'kill' }); },
                },
                bishop: {
                    normal: function () { return (0, lib_1.parseBishop)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'first' }); },
                    kill: function () { return (0, lib_1.parseBishop)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'kill' }); },
                },
                knight: {
                    normal: function () { return (0, lib_1.parseKnight)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'first' }); },
                    kill: function () { return (0, lib_1.parseKnight)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'kill' }); },
                },
                rook: {
                    normal: function () { return (0, lib_1.parseRook)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'first' }); },
                    kill: function () { return (0, lib_1.parseRook)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'kill' }); },
                },
                king: {
                    normal: function () { return (0, lib_1.parseKing)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'first' }); },
                    kill: function () { return (0, lib_1.parseKing)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'kill' }); },
                },
                queen: {
                    normal: function () { return (0, lib_1.parseQueen)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'first' }); },
                    kill: function () { return (0, lib_1.parseQueen)({ row: _this.current_row, col: _this.current_col, init_arr: _this.init_arr, fam: _this.family, spec: 'kill' }); },
                },
            };
        };
        return Rules;
    }());
    function HandleClick(e) {
        e.preventDefault();
        // console.log(e.target)
        var class_ = e.target.classList;
        var elem = e.target.innerText;
        var type = GetType(elem);
        var fam = (0, lib_1.GetFamily)(elem);
        console.log(fam);
        var loc = (0, lib_1.GetLocation)(class_);
        console.log('type -> ', type);
        // PawnRule(loc)
        if (new_move === true) {
            try {
                var move = new Rules(loc, type, fam);
                move.move('first');
                SetMove(move); //.move('first')
            }
            catch (e) {
                console.log(e);
                SetMove(true);
            }
            // console.log(move.move)
            // SetMove(!new_move)
        }
        else {
            // new Rules(loc, 'pawn', 'positive').move('second')
            new_move.move('second');
            SetMove(true);
        }
        SetLocation("#".concat(loc));
    }
    var cols = 'abcdefgh'.split('').reverse();
    var rows = '12345678'.split('');
    return (react_1.default.createElement("div", { className: 'container' },
        react_1.default.createElement("h1", null, "Chess App"),
        react_1.default.createElement("div", { className: 'main' },
            react_1.default.createElement("div", { className: 'cols' }, cols.map(function (each) {
                return react_1.default.createElement("div", { key: each }, each);
            })),
            react_1.default.createElement("div", { className: 'rows' }, rows.map(function (each) {
                return react_1.default.createElement("div", { key: each }, each);
            })),
            react_1.default.createElement("div", { className: 'board' }, board_array.map(function (each) {
                return react_1.default.createElement("div", { key: each, onClick: HandleClick, className: 'text-center board-cell ' + (0, lib_1.GetSquareColor)(each) + (0, lib_1.GetCol)(each) +
                        (0, lib_1.GetRow)(each) + ((0, lib_1.checkKill)(each, new_move) === true ? ' kill ' : '') }, player_array[parseInt(each / 8)][each % 8]);
            }))),
        react_1.default.createElement("span", { id: 'loc-state' }, location)));
};
exports.default = App;
//# sourceMappingURL=App.js.map