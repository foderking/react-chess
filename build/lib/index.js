"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFamily = exports.CalcIfFirst = exports.GetCol = exports.GetLocation = exports.GetRow = exports.checkKill = exports.GetSquareColor = exports.GetArr = exports.parsePawn = exports.parseKnight = exports.parseRook = exports.parseBishop = exports.parseQueen = exports.parseKing = exports.generateRandomString = void 0;
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
function generateRandomString(N) {
    // Returns an alphanumeric string of N characters
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < N; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateRandomString = generateRandomString;
var move_dot = '○';
var move_dot_2 = '●';
function parseKing(_a) {
    var row = _a.row, col = _a.col, init_arr = _a.init_arr, fam = _a.fam, spec = _a.spec;
    var arr = JSON.parse(JSON.stringify(init_arr));
    var kill = [];
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            console.log(i, j);
            if (i === row && j === col) {
                continue;
            }
            if (i <= 0 || j <= 0) {
                continue;
            }
            if (i > 7 || j > 7) {
                continue;
            }
            if (arr[i][j] !== '') {
                if (FamCheck(fam, arr[i][j])) {
                    kill.push([i, j]);
                }
                continue;
            }
            arr[i][j] = move_dot;
        }
    }
    if (spec === 'first') {
        return arr;
    }
    if (spec === 'kill') {
        return kill;
    }
}
exports.parseKing = parseKing;
function parseQueen(_a) {
    var row = _a.row, col = _a.col, init_arr = _a.init_arr, fam = _a.fam, spec = _a.spec;
    var arr = JSON.parse(JSON.stringify(init_arr));
    if (spec === 'first') {
        var arr_2 = parseBishop({ row: row, col: col, init_arr: init_arr, fam: fam, spec: spec });
        for (var i = row - 1; i <= row + 1; i++) {
            for (var j = col - 1; j <= col + 1; j++) {
                if (i === row || j === col) {
                    console.log(i, j);
                    // if ( i <= 0) {
                    // 	continue
                    // }
                    if (i === row && j === col) {
                        continue;
                    }
                    if (i <= 0 || j <= 0) {
                        continue;
                    }
                    if (i > 7 || j > 7) {
                        continue;
                    }
                    if (arr_2[i][j] !== '') {
                        continue;
                    }
                    arr_2[i][j] = move_dot;
                }
            }
        }
        var arr_1 = arr_2;
        return arr_1;
    }
    if (spec === 'kill') {
        var kk = [];
        // const kill_1 = parseKing({row, col, init_arr, fam, spec})
        var kill_2 = parseBishop({ row: row, col: col, init_arr: init_arr, fam: fam, spec: spec });
        for (var i = row - 1; i <= row + 1; i++) {
            for (var j = col - 1; j <= col + 1; j++) {
                if (i === row || j === col) {
                    console.log(i, j);
                    // if ( i <= 0) {
                    // 	continue
                    // }
                    if (i === row && j === col) {
                        continue;
                    }
                    if (i <= 0 || j <= 0) {
                        continue;
                    }
                    if (i > 7 || j > 7) {
                        continue;
                    }
                    if (arr[i][j] === move_dot) {
                        continue;
                    }
                    if (arr[i][j] !== '' && FamCheck(fam, arr[i][j])) {
                        kk.push([i, j]);
                        continue;
                    }
                }
            }
        }
        return kk.concat(kill_2);
    }
}
exports.parseQueen = parseQueen;
function parseBishop(_a) {
    var row = _a.row, col = _a.col, init_arr = _a.init_arr, fam = _a.fam, spec = _a.spec;
    var arr = JSON.parse(JSON.stringify(init_arr));
    var kill = [];
    /* Notice we only test for i ? if j is out of bounds the array \
     * gives undefined which is handled in the if statements anyways \
     * but if the i overflows, we try to access [j] from undefined which gives error */
    for (var j = col + 1, i = row + 1; i < 8; i++, j++) {
        // console.log(i, j)
        if (arr[i][j] !== '') {
            if (FamCheck(fam, arr[i][j])) {
                kill.push([i, j]);
            }
            break;
        }
        arr[i][j] = move_dot;
    }
    for (var j = col - 1, i = row - 1; i >= 0; i--, j--) {
        // console.log(i, j)
        if (arr[i][j] !== '') {
            if (FamCheck(fam, arr[i][j])) {
                kill.push([i, j]);
            }
            break;
        }
        arr[i][j] = move_dot;
    }
    for (var j = col + 1, i = row - 1; i >= 0; i--, j++) {
        // console.log(i, j)
        if (arr[i][j] !== '') {
            if (FamCheck(fam, arr[i][j])) {
                kill.push([i, j]);
            }
            break;
        }
        arr[i][j] = move_dot;
    }
    for (var j = col - 1, i = row + 1; i < 8; i++, j--) {
        // console.log(i, j)
        if (arr[i][j] !== '') {
            if (FamCheck(fam, arr[i][j])) {
                kill.push([i, j]);
            }
            break;
        }
        arr[i][j] = move_dot;
    }
    if (spec === 'first') {
        return arr;
    }
    if (spec === 'kill') {
        return kill;
    }
}
exports.parseBishop = parseBishop;
function parseRook(_a) {
    var row = _a.row, col = _a.col, init_arr = _a.init_arr, fam = _a.fam, spec = _a.spec;
    /**
     * Valid cols: [row -> 8], [0 -> row], [col -> 8], [0 -> col],
     */
    var arr = JSON.parse(JSON.stringify(init_arr));
    if (spec === 'first') {
        for (var i = col + 1; i < 8; i++) {
            if (arr[row][i] !== '') {
                break;
            }
            arr[row][i] = move_dot;
        }
        for (var i = row + 1; i < 8; i++) {
            if (arr[i][col] !== '') {
                break;
            }
            arr[i][col] = move_dot;
        }
        for (var i = col - 1; i > 0; i--) {
            if (arr[row][i] !== '') {
                break;
            }
            arr[row][i] = move_dot;
        }
        for (var i = row - 1; i > 0; i--) {
            if (arr[i][col] !== '') {
                break;
            }
            arr[i][col] = move_dot;
        }
        return arr;
    }
    if (spec === 'kill') {
        var kills = [];
        for (var i = col + 1; i < 8; i++) {
            if (arr[row][i] !== '') {
                if (FamCheck(fam, arr[row][i])) {
                    kills.push([row, i]);
                }
                break;
            }
        }
        for (var i = col - 1; i >= 0; i--) {
            if (arr[row][i] !== '') {
                if (FamCheck(fam, arr[row][i])) {
                    kills.push([row, i]);
                }
                break;
            }
        }
        for (var i = row + 1; i < 8; i++) {
            if (arr[i][col] !== '') {
                if (FamCheck(fam, arr[i][col])) {
                    kills.push([i, col]);
                }
                break;
            }
        }
        for (var i = row - 1; i >= 0; i--) {
            if (arr[i][col] !== '') {
                if (FamCheck(fam, arr[i][col])) {
                    kills.push([i, col]);
                }
                break;
            }
        }
        return kills;
    }
}
exports.parseRook = parseRook;
function parseKnight(_a) {
    var row = _a.row, col = _a.col, init_arr = _a.init_arr, fam = _a.fam, spec = _a.spec;
    var west = col - 1;
    var westwest = col - 2;
    var east = col + 1;
    var easteast = col + 2;
    var north = row - 1;
    var northnorth = row - 2;
    var south = row + 1;
    var southsouth = row + 2;
    var validate_ss = (southsouth < 8);
    var validate_nn = (northnorth >= 0);
    var validate_ee = (easteast < 8);
    var validate_ww = (westwest >= 0);
    var validate_s = (south < 8);
    var validate_n = (north >= 0);
    var validate_e = (east < 8);
    var validate_w = (west >= 0);
    var validate_ss_e = (validate_ss && validate_e);
    var validate_ss_w = (validate_ss && validate_w);
    var validate_nn_e = (validate_nn && validate_e);
    var validate_nn_w = (validate_nn && validate_w);
    var validate_n_ee = (validate_ee && validate_n);
    var validate_s_ee = (validate_ee && validate_s);
    var validate_n_ww = (validate_ww && validate_n);
    var validate_s_ww = (validate_ww && validate_s);
    var elem_ss_e = validate_ss_e ? init_arr[southsouth][east] : null;
    var elem_ss_w = validate_ss_w ? init_arr[southsouth][west] : null;
    var elem_nn_e = validate_nn_e ? init_arr[northnorth][east] : null;
    var elem_nn_w = validate_nn_w ? init_arr[northnorth][west] : null;
    var elem_n_ee = validate_n_ee ? init_arr[north][easteast] : null;
    var elem_s_ee = validate_s_ee ? init_arr[south][easteast] : null;
    var elem_n_ww = validate_n_ww ? init_arr[north][westwest] : null;
    var elem_s_ww = validate_s_ww ? init_arr[south][westwest] : null;
    if (spec === 'kill') {
        var kills = [];
        /* The if statements always short circuits with the location fails
            * the `validate_xx_x` validation. this prevents overflows */
        /* SS */
        if (validate_ss_e && elem_ss_e !== '') {
            if (FamCheck(fam, elem_ss_e)) {
                kills.push([southsouth, east]);
            }
        }
        if (validate_ss_w && elem_ss_w !== '') {
            if (FamCheck(fam, elem_ss_w)) {
                kills.push([southsouth, west]);
            }
        }
        /* NN */
        if (validate_nn_e && elem_nn_e !== '') {
            if (FamCheck(fam, elem_nn_e)) {
                kills.push([northnorth, east]);
            }
        }
        if (validate_nn_w && elem_nn_w !== '') {
            if (FamCheck(fam, elem_nn_w)) {
                kills.push([northnorth, west]);
            }
        }
        /* EE */
        if (validate_n_ee && elem_n_ee !== '') {
            if (FamCheck(fam, elem_n_ee)) {
                kills.push([north, easteast]);
            }
        }
        if (validate_s_ee && elem_s_ee !== '') {
            if (FamCheck(fam, elem_s_ee)) {
                kills.push([south, easteast]);
            }
        }
        /* WW */
        if (validate_n_ww && elem_n_ww !== '') {
            if (FamCheck(fam, elem_n_ww)) {
                kills.push([north, westwest]);
            }
        }
        if (validate_s_ww && elem_s_ww !== '') {
            if (FamCheck(fam, elem_s_ww)) {
                kills.push([south, westwest]);
            }
        }
        return kills;
    }
    else if (spec === 'first') {
        console.log('kkk');
        var arr = JSON.parse(JSON.stringify(init_arr));
        /* SS */
        if (validate_ss_e && elem_ss_e === '') {
            arr[southsouth][east] = move_dot;
            console.log('sse ->', [southsouth, east]);
        }
        if (validate_ss_w && elem_ss_w === '') {
            arr[southsouth][west] = move_dot;
            console.log('ssw ->', [southsouth, west]);
        }
        /* NN */
        if (validate_nn_e && elem_nn_e === '') {
            arr[northnorth][east] = move_dot;
            console.log('nne ->', [northnorth, east]);
        }
        if (validate_nn_w && elem_nn_w === '') {
            arr[northnorth][west] = move_dot;
            console.log('nnw ->', [northnorth, west]);
        }
        /* EE */
        if (validate_n_ee && elem_n_ee === '') {
            // console.log(westwest)
            arr[north][easteast] = move_dot;
            console.log('een ->', [north, easteast]);
        }
        if (validate_s_ee && elem_s_ee === '') {
            arr[south][easteast] = move_dot;
            console.log('ees ->', [south, easteast]);
        }
        // /* WW */
        if (validate_n_ww && elem_n_ww === '') {
            // console.log(westwest, north)
            arr[north][westwest] = move_dot;
            console.log('wwn ->', [north, westwest]);
        }
        if (validate_s_ww && elem_s_ww === '') {
            arr[south][westwest] = move_dot;
            console.log('wws ->'[south, westwest]);
        }
        return arr;
    }
}
exports.parseKnight = parseKnight;
function parsePawn(_a) {
    var row = _a.row, col = _a.col, init_arr = _a.init_arr, spec = _a.spec, fam = _a.fam;
    console.log(fam);
    // const arr = [ ...init_arr ]
    var arr = JSON.parse(JSON.stringify(init_arr));
    if (fam === 'negative') {
        console.log('object');
        row *= -1;
    }
    if (spec === 'first') {
        var start = row + 1;
        var end = row + 3;
        console.log(start, end, row);
        for (var i = start; i < end; i++) {
            var _i = Math.abs(i);
            // console.log(i, col)
            if (_i >= 8) {
                break;
            }
            // console.log(next)
            var next = arr[_i][col];
            if (next == '') {
                arr[_i][col] = move_dot;
                // console.log('next')
            }
            else {
                // console.log('no next')
                break;
            }
        }
        console.log(arr);
        return arr;
    }
    if (spec === 'normal') {
        var start = row + 1;
        var end = row + 2;
        console.log(start, end, row);
        for (var i = start; i < end; i++) {
            var _i = Math.abs(i);
            // console.log(i, col)
            if (_i >= 8) {
                break;
            }
            // console.log(next)
            var next = arr[_i][col];
            if (next == '') {
                arr[_i][col] = move_dot;
                // console.log('next')
            }
            else {
                // console.log('no next')
                break;
            }
        }
        console.log(arr);
        return arr;
    }
    else if (spec === 'kill') {
        var arr_3 = JSON.parse(JSON.stringify(init_arr));
        var kills = [];
        var i = Math.abs(row + 1);
        var right = col + 1;
        var left = col - 1;
        if (i > 7 || i < 0) {
            return kills;
        }
        var elem_right = arr_3[i][right];
        var elem_left = arr_3[i][left];
        if (elem_left !== '' && FamCheck(fam, elem_left)) {
            kills.push([i, left]);
        }
        if (elem_right !== '' && FamCheck(fam, elem_right)) {
            kills.push([i, right]);
        }
        console.log(kills);
        return kills;
    }
}
exports.parsePawn = parsePawn;
function FamCheck(fam, elem) {
    if (!elem) {
        return false;
    }
    return fam !== GetFamily(elem);
}
function GetArr() {
    var arr = [];
    for (var i = 0; i < 64; i++) {
        arr[i] = i;
    }
    return arr;
}
exports.GetArr = GetArr;
function GetSquareColor(index) {
    var i = index % 16;
    var first = i % 2;
    var second = (i % 8) % 2 == 0;
    if ((first && i < 8) || (second && i >= 8)) {
        return 'negative';
    }
    else {
        return 'postive';
    }
}
exports.GetSquareColor = GetSquareColor;
function checkKill(each, new_move) {
    // console.log(each)
    if (new_move != true) {
        var arr = JSON.stringify([parseInt(each / 8), (each % 8)]);
        var kill = JSON.stringify(new_move.kill);
        // console.log(arr)
        if (kill.indexOf(arr) === -1) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}
exports.checkKill = checkKill;
function GetRow(no) {
    no = parseInt(no / 8) + 1;
    return ' row-' + no;
}
exports.GetRow = GetRow;
function GetLocation(class_) {
    var loc = class_[3].slice(4) + class_[4].slice(4);
    return loc;
}
exports.GetLocation = GetLocation;
function GetCol(no) {
    no = no % 8;
    var charset = 'hgfedcba';
    return ' col-' + charset[no];
}
exports.GetCol = GetCol;
function CalcIfFirst(piece_type, fam, row, col, arrangement) {
    var ying = ['positive', 'negative'];
    // For pawns 
    if (piece_type === 'pawn') {
        if (fam === ying[0]) {
            if (row === arrangement['white'][1]) {
                return true;
            }
            else {
                return false;
            }
        }
        if (fam === ying[1]) {
            if (row === arrangement['black'][1]) {
                return true;
            }
            else {
                return false;
            }
        }
        throw 'calc first error: ' + fam;
    }
    // if (piece_type === 'rook') {
    // 	if (fam === ying[0]) {
    // 		if (row === arrangement['white'][0]) {
    // 			return
    // 		}
    // 		else {
    // 			return
    // 		}
    // 	}
    // 	if (fam === ying[1]) {
    // 		if (row === arrangement['white'][0]) {
    // 			return
    // 		}
    // 		else {
    // 			return 
    // 		}
    // 	}
    // }
    // if (piece_type === 'rook') {
    // 	if (fam === ying[0]) {
    // 		if (row === arrangement['white'][0]) {
    // 			return
    // 		}
    // 		else {
    // 			return
    // 		}
    // 	}
    // 	if (fam === ying[1]) {
    // 		if (row === arrangement['white'][0]) {
    // 			return
    // 		}
    // 		else {
    // 			return 
    // 		}
    // 	}
    // }
    return '';
}
exports.CalcIfFirst = CalcIfFirst;
function GetFamily(piece) {
    var black = [black_bishop, black_king, black_knight, black_pawn, black_queen, black_rook];
    var white = [white_bishop, white_king, white_knight, white_pawn, white_queen, white_rook];
    if (black.includes(piece)) {
        return 'negative';
    }
    else if (white.includes(piece)) {
        return 'positive';
    }
    else if (piece == '') {
        return null;
    }
    throw 'family error: ' + piece;
}
exports.GetFamily = GetFamily;
//# sourceMappingURL=index.js.map