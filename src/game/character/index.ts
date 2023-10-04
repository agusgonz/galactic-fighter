import { canvas, ctx } from "../../canvas"
import { enemiesArr } from "../../main"
import { isInTouch } from "../../utils/utils"
import { PunchAbility } from "../habilities/habilities"
import { Platform } from "../platform"
import { Sprite, SpriteProps } from "../sprite"
import { Enemy } from "./enemy"

export interface CharacterProps extends SpriteProps {
	w: number
	h: number
	color?: string
	speed: number
	platforms?: Platform[]
	lives?: number
	wPunchAbility?: number
	hPunchAbility?: number
}

export class Character extends Sprite {
	w: number
	h: number
	dx: number
	dy: number
	gravity: number
	isDead: boolean
	color: string
	speed: number
	isOnFloor: boolean
	platforms: Platform[] | undefined
	isLeftLastDirection: boolean
	punchAbility: PunchAbility
	lives: number
	isPunching: boolean

	constructor({
		w,
		h,
		color,
		speed,
		platforms,
		lives,
		wPunchAbility,
		hPunchAbility,
		...props
	}: CharacterProps) {
		super(props)
		this.w = w
		this.h = h
		this.dx = 0
		this.dy = 0
		this.gravity = 1
		this.isDead = false
		this.color = color || "rgba(0, 0, 0, 0.3)"
		this.speed = speed
		this.isOnFloor = true
		this.platforms = platforms
		this.isLeftLastDirection = false
		this.punchAbility = new PunchAbility({
			x: this.x,
			y: this.y,
			w: wPunchAbility || 0,
			h: hPunchAbility || 0,
		})
		this.lives = lives || 1
		this.isPunching = false
	}

	drawHitBox() {
		// To check hitbox
		ctx.beginPath()
		ctx.fillStyle = this.color
		ctx.rect(this.x, this.y, this.w, this.h)
		ctx.fill()
		ctx.closePath()
	}

	update() {
		this.drawAnimation()

		if (this.y + this.h + this.dy >= canvas.height) {
			this.dy = 0
		} else {
			this.dy += this.gravity
		}

		this.y += this.dy
		this.x += this.dx
	}

	checkPlatforms() {
		this.platforms?.forEach(platform => {
			if (
				this.y + this.h - this.dy <= platform.y &&
				this.y + this.h + this.dy >= platform.y &&
				this.x + this.w >= platform.x &&
				this.x <= platform.x + platform.w
			) {
				this.y = platform.y - this.h
				this.dy = 0
				this.isOnFloor = true
			}
		})
	}

	die() {
		this.isDead = true
		this.setSprite("death")
	}
}
