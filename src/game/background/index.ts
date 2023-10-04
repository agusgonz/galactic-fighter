import { canvas, ctx } from "../../main"
import { getRandomNumberBetween } from "../../utils/utils"

export class BackgroundImage {
	x: number
	y: number
	image: HTMLImageElement
	constructor({ x, y }: any) {
		this.x = x
		this.y = y
		this.image = new Image()
		this.image.src = "/images/background/background.png"
	}

	draw() {
		ctx.drawImage(this.image, this.x, this.y)
	}
}

export class BackgroundPlanet {
	x: number
	y: number
	image: HTMLImageElement
	constructor({ src }: { src: string }) {
		this.image = new Image()
		this.image.src = src
		this.x = 0
		this.y = 0
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.x,
			this.y,
			this.image.width * 2,
			this.image.height * 2
		)
	}
}
