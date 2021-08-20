// This file contains small helper methods

// From here: http://stackoverflow.com/a/8809472/1456971
export function generateUUID(){
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0
        d = Math.floor(d/16)
        return (c=='x' ? r : (r&0x3|0x8)).toString(16)
    })
    return uuid
}

export function generateIntArray() {
	const buffer = new Uint32Array(4)
	const UUID = new DataView(buffer.buffer)
	const paddings = [8, 4, 4, 4, 12]
	
	let hexUUID = generateUUID().split("-").map((val, i) => val.padStart(paddings[i], "0")).join("")
	let ints = []

	for (let i = 0; i < 4; i++) { 
		num = Number("0x" + hexUUID.substring(i*8, (i+1)*8))
		UUID.setInt32(i*4, num)
		ints.push(UUID.getInt32(i*4))
	}

	return '[I;' + ints.join(",") + ']'
}

// Check if the x, y, z attributes of the given thing are all zero.
export function isXYZZero(thing) {
    return thing.x == 0 && thing.y == 0 && thing.z == 0
}

// Returns a string with a JSON array from the x, y, z attributes of the given thing.
export function xyzToTextArray(thing) {
    return "["+thing.x+"f,"+thing.y+"f,"+thing.z+"f]";
}