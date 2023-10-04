import { Sprite, SpriteProps } from "../sprite"

interface PlatformProps extends SpriteProps {
	w: number
	h: number
}

export class Platform extends Sprite {
	w: number
	h: number
	constructor({ w, h, ...props }: PlatformProps) {
		super(props)
		this.w = w
		this.h = h
	}

	update() {
		let xAdded = this.x

		if (this.defaultImage.width == 0) return

		while (xAdded < this.x + this.w) {
			this.drawInPlace({
				xToDraw: xAdded,
				yToDraw: this.y,
			})

			xAdded += this.defaultImage.width * this.scale
		}
	}
}
