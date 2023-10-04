import { ctx } from "../../canvas"
import { isInTouch } from "../../utils/utils"
import { Enemy } from "../character/enemy"
import { CharacterPlayable } from "../character/player"

interface PunchAbilityProps {
	x: number
	y: number
	w: number
	h: number
}

export class PunchAbility {
	x: number
	y: number
	w: number
	h: number
	isActive: any
	targets: Enemy[] | CharacterPlayable[] | undefined

	constructor({ x, y, w, h }: PunchAbilityProps) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.isActive = false
		this.targets
	}

	draw() {
		ctx.beginPath()
		ctx.fillStyle = "red"
		ctx.rect(this.x, this.y, this.w, this.h)
		ctx.fill()
		ctx.closePath()
	}

	update() {
		// this.draw()
	}

	active({
		secondsLong,
		waitAfter,
	}: {
		secondsLong: number
		waitAfter: number
	}) {
		if (this.isActive) return

		this.isActive = true

		// this.draw()

		this.targets?.forEach((target, i) => {
			if (isInTouch({ obj1: this, obj2: target })) {
				target.takeDamage()
			}
		})
		setTimeout(() => (this.isActive = false), secondsLong)
	}
}
