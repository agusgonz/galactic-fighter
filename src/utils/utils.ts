export function getRandomNumberBetween(
	min: number,
	max: number
) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getRandomItemFromArray(arr: any[]) {
	return arr[Math.floor(Math.random() * arr.length)]
}

export function getRandomColor(colors: string[]) {
	return colors[Math.floor(Math.random() * colors.length)]
}

export function isInTouch({ obj1, obj2 }: any) {
	if (
		obj1.x + obj1.w > obj2.x &&
		obj1.x < obj2.x + obj2.w &&
		obj1.y + obj1.h > obj2.y &&
		obj1.y < obj2.y + obj2.h
	) {
		return true
	} else {
		return false
	}
}
