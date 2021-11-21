export function generateRandomString(N)
{
	// Returns an alphanumeric string of N characters
	let result           = '';
	const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( var i = 0; i < N; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
 return result;
}


const move_dot      = '○'
const move_dot_2    = '●'

export function parseBishop({row, col, init_arr, fam, spec})
{
	const arr = JSON.parse(JSON.stringify(init_arr))
	const kill = []

	/* Notice we only test for i ? if j is out of bounds the array \
	 * gives undefined which is handled in the if statements anyways \
	 * but if the i overflows, we try to access [j] from undefined which gives error */
	for (let j = col + 1, i = row + 1 ; i < 8  ; i++, j++) {
		// console.log(i, j)
		if ( arr[i][j] !== '') {
			kill.push([i, j])
			break
		}
		arr[i][j] = move_dot
	}
	for (let j = col - 1, i = row - 1 ; i >= 0  ; i--, j--) {
		// console.log(i, j)
		if ( arr[i][j] !== '') {
			kill.push([i, j])
			break
		}
		arr[i][j] = move_dot
	}
	for (let j = col + 1, i = row - 1 ; i >= 0  ; i--, j++) {
		// console.log(i, j)
		if ( arr[i][j] !== '') {
			kill.push([i, j])
			break
		}
		arr[i][j] = move_dot
	}
	for (let j = col - 1, i = row + 1 ; i < 8 ; i++, j--) {
		// console.log(i, j)
		if ( arr[i][j] !== '') {
			kill.push([i, j])
			break
		}
		arr[i][j] = move_dot
	}

	if (spec === 'first')
	{
		return arr
	}

	if (spec === 'kill')
	{
		return kill
	}
}

export function parseRook({row, col, init_arr, fam, spec})
{
	/**
	 * Valid cols: [row -> 8], [0 -> row], [col -> 8], [0 -> col], 
	 */
	const arr = JSON.parse(JSON.stringify(init_arr))

	if (spec === 'first')
	{

		for (let i = col + 1; i < 8 ; i++) {
			if ( arr[row][i] !== '') {
				break
			}
			arr[row][i] = move_dot
		}
		for (let i = row + 1; i < 8 ; i++) {
			if ( arr[i][col] !== '') {
				break
			}
			arr[i][col] = move_dot
		}	
		for (let i = col - 1; i > 0 ; i--) {
			if ( arr[row][i] !== '') {
				break
			}
			arr[row][i] = move_dot
		}
		for (let i = row - 1; i > 0 ; i--) {
			if ( arr[i][col] !== '') {
				break
			}
			arr[i][col] = move_dot
		}	

		return arr
	}
	if (spec === 'kill')
	{
		let kills = []

		for (let i = col + 1; i < 8 ; i++) {
			if ( arr[row][i] !== '') {
				kills.push([row, i])
				break
			}
		}
		for (let i = col - 1; i >= 0 ; i--) {
			if ( arr[row][i] !== '') {
				kills.push([row, i])
				break
			}
		}
		for (let i = row + 1; i < 8 ; i++) {
			if ( arr[i][col] !== '') {
				kills.push([i, col])
				break
			}
		}	
		for (let i = row - 1; i >= 0 ; i--) {
			if ( arr[i][col] !== '') {
				kills.push([i, col])
				break
			}
		}	


		return kills
	}
}

export function parseKnight({row, col, init_arr, fam, spec})
{
	const west       = col - 1
	const westwest   = col - 2
	const east       = col + 1
	const easteast   = col + 2
	const north      = row - 1
	const northnorth = row - 2
	const south      = row + 1
	const southsouth = row + 2

	const validate_ss  = ( southsouth < 8)
	const validate_nn  = ( northnorth >=0)
	const validate_ee  = ( easteast   < 8)
	const validate_ww  = ( westwest   >=0)
	const validate_s   = ( south < 8)
	const validate_n   = ( north >=0)
	const validate_e   = ( east  < 8)
	const validate_w   = ( west  >=0)

	const validate_ss_e = (validate_ss && validate_e)
	const validate_ss_w = (validate_ss && validate_w)
	const validate_nn_e = (validate_nn && validate_e)
	const validate_nn_w = (validate_nn && validate_w)

	const validate_n_ee = (validate_ee && validate_n)
	const validate_s_ee = (validate_ee && validate_s)
	const validate_n_ww = (validate_ww && validate_n)
	const validate_s_ww = (validate_ww && validate_s)

	const elem_ss_e = validate_ss_e ? init_arr[southsouth][east] : null
	const elem_ss_w = validate_ss_w ? init_arr[southsouth][west] : null
	const elem_nn_e = validate_nn_e ? init_arr[northnorth][east] : null
	const elem_nn_w = validate_nn_w ? init_arr[northnorth][west] : null

	const elem_n_ee = validate_n_ee ? init_arr[north][easteast]  : null
	const elem_s_ee = validate_s_ee ? init_arr[south][easteast]  : null
	const elem_n_ww = validate_n_ww ? init_arr[north][westwest]  : null
	const elem_s_ww = validate_s_ww ? init_arr[south][westwest]  : null

	if       (spec === 'kill'){
		const kills = []

		/* The if statements always short circuits with the location fails
			* the `validate_xx_x` validation. this prevents overflows */
		/* SS */
		if (validate_ss_e &&  elem_ss_e !== '') {
			kills.push([southsouth, east])
		}
		if (validate_ss_w &&  elem_ss_w !== '') {
			kills.push([southsouth, west])
		}
		/* NN */
		if (validate_nn_e &&  elem_nn_e !== '') {
			kills.push([northnorth, east])
		}
		if (validate_nn_w &&  elem_nn_w !== '') {
			kills.push([northnorth, west])
		}
		/* EE */
		if (validate_n_ee &&  elem_n_ee !== '') {
			kills.push([north, easteast])
		}
		if (validate_s_ee &&  elem_s_ee !== '') {
			kills.push([south, easteast])
		}
		/* WW */
		if (validate_n_ww &&  elem_n_ww !== '') {
			kills.push([north, westwest])
		}
		if (validate_s_ww &&  elem_s_ww !== '') {
			kills.push([south, westwest])
		}

		return kills
	}
	else if (spec === 'first'){
		console.log('kkk')
		const arr = JSON.parse(JSON.stringify(init_arr))
		/* SS */
		if (validate_ss_e && elem_ss_e === '') {
			arr[southsouth][east] = move_dot
			console.log('sse ->', [southsouth, east])
		}
		if (validate_ss_w && elem_ss_w === '') {
			arr[southsouth][west] = move_dot
			console.log('ssw ->', [southsouth, west])
		}
		/* NN */
		if (validate_nn_e && elem_nn_e === '') {
			arr[northnorth][east] = move_dot
			console.log('nne ->', [northnorth, east])
		}
		if (validate_nn_w && elem_nn_w === '') {
			arr[northnorth][west] = move_dot
			console.log('nnw ->', [northnorth, west])
		}

		/* EE */
		if (validate_n_ee && elem_n_ee === '') {
			// console.log(westwest)
			arr[north][easteast] = move_dot
			console.log('een ->', [north, easteast])
		}
		if (validate_s_ee && elem_s_ee === '') {
			arr[south][easteast] = move_dot
			console.log('ees ->', [south, easteast])
		}
		// /* WW */
		if (validate_n_ww && elem_n_ww === '') {
			// console.log(westwest, north)
			arr[north][westwest] = move_dot
			console.log('wwn ->', [north, westwest])
		}
		if (validate_s_ww && elem_s_ww === '') {
			arr[south][westwest] = move_dot
			console.log('wws ->' [south, westwest])
		}
		return arr
	}

}

export function parsePawn({row, col, init_arr, spec, fam})
{
	console.log(fam)
	// const arr = [ ...init_arr ]
	const arr = JSON.parse(JSON.stringify(init_arr))

	if (fam === 'negative') {
		console.log('object')
		row *= -1
	}

	if ( spec === 'first')
	{

		const start = row + 1
		const end   = row + 3
		console.log(start, end, row)

		for (let i = start; i < end ; i++) {
			const _i = Math.abs(i)
			// console.log(i, col)
			if (_i >= 8 ) {
				break
			}
			// console.log(next)
			const next = arr[_i][col]
			
			if ( next == '' ) {
				arr[_i][col] = move_dot
				// console.log('next')
			}
			else {
				// console.log('no next')
				break
			}
		}
		console.log(arr)
		return arr
	}

	if ( spec === 'normal')
	{

		const start = row + 1
		const end   = row + 2
		console.log(start, end, row)

		for (let i = start; i < end ; i++) {
			const _i = Math.abs(i)
			// console.log(i, col)
			if (_i >= 8 ) {
				break
			}
			// console.log(next)
			const next = arr[_i][col]
			
			if ( next == '' ) {
				arr[_i][col] = move_dot
				// console.log('next')
			}
			else {
				// console.log('no next')
				break
			}
		}
		console.log(arr)
		return arr
	}
	else if (spec === 'kill') {
		const arr = JSON.parse(JSON.stringify(init_arr))
		let kills = []

		const i = Math.abs(row + 1)
		const right = col + 1
		const left = col - 1

		if (i > 7 || i < 0) {
			return kills
		}

		const elem_right = arr[i][right]
		const elem_left = arr[i][left]

		if (elem_left !== '') {
			kills.push([i, left])
		}
		if (elem_right !== '') {
			kills.push([i, right])
		}
		console.log(kills)
		return kills
	}


}


export function GetArr()
{
	let arr = []

	for (let i = 0; i < 64; i++) {
		arr[i] = i
	}
	return arr
}



export function GetSquareColor(index)
{/**
		* board_arr -> 2d array representing the board
		*/
	const i = index % 16
	const first = i % 2
	const second =  (i % 8) % 2 == 0

	if ((first && i < 8) || (second && i >= 8)) {
		return 'negative'
	}
	else {
		return 'postive'
	}
}

export function checkKill(each, new_move)
{
	// console.log(each)
	if (new_move != true) {
		const arr = JSON.stringify([parseInt(each / 8), (each % 8)])
		const kill = JSON.stringify(new_move.kill)
		// console.log(arr)

		if (kill.indexOf(arr) === -1) {
			return false
		}
		else {
			return true
		}
	}
	else {
		return false
	}
}


export function GetRow(no)
{
	no = parseInt(no / 8) + 1
	return ' row-' + no
}

export function GetLocation(class_)
{
	const loc =class_[3].slice(4) + class_[4].slice(4)

	return loc
}

export function GetCol(no)
{
	no = no % 8
	const charset = 'hgfedcba'
	return ' col-' + charset[no]
}

export function CalcIfFirst(piece_type, fam, row, col, arrangement)
{ /** Rules
	* Pawns:   If at 2nd row in family
	* Rook :   If at corner in family
	* bishop:  If beside rook
	* Knight:  If beside bishop
	etc....
	**/
	
	// For pawns 
	if (piece_type === 'pawn') {
		if (fam === 'positive') {
			if (row === arrangement['white'][1]) {
				return true
			}
			else {
				return false
			}
		}
		if (fam === 'negative') {
			if (row === arrangement['black'][1]) {
				return true
			}
			else {
				return false
			}
		}
		throw 'calc first error: ' + fam
	}

	return ''
}
