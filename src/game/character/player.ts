import { Character, CharacterProps } from "."
import {
	canvas,
	currentLivesInGame,
	playerLostLive,
} from "../../main"
import { isInTouch } from "../../utils/utils"
import { Enemy } from "./enemy"

interface CharacterPlayableProps
	extends Omit<CharacterProps, "w" | "h"> {}

export class CharacterPlayable extends Character {
	keys: { a: { pressed: boolean }; d: { pressed: boolean } }
	lastKey: string | undefined
	enemies: Enemy[] | undefined
	isLanding: boolean
	isHitOnCooldown: boolean
	COOLDOWN_TIME: number
	isInvincible: boolean

	constructor(props: CharacterPlayableProps) {
		super({ ...props, w: 20, h: 80 })

		this.keys = {
			a: {
				pressed: false,
			},
			d: {
				pressed: false,
			},
		}
		this.lastKey = "d"
		this.enemies
		this.isLanding = false
		this.isHitOnCooldown = false
		this.COOLDOWN_TIME = 500
		this.isInvincible = false
	}

	update() {
		this.drawAnimation()
		// this.drawHitBox()

		if (this.isDead) return

		// Movement Acceleration
		this.y += this.dy
		this.x += this.dx

		// Movement Y

		this.dy += this.gravity
		this.isOnFloor = false
		this.checkPlatforms()

		// Movement X
		this.dx = 0

		if (!this.punchAbility.isActive) {
			if (this.keys.a.pressed && this.lastKey == "a") {
				this.goToLeft()
			} else if (
				this.keys.d.pressed &&
				this.lastKey == "d"
			) {
				this.goToRight()
			} else if (this.dx === 0 && this.isOnFloor) {
				this.stand()
			}
		}

		// Abilities
		if (this.punchAbility.isActive) {
			this.punchAbility.update()
		}

		// Enemy touch player
		if (!this.isInvincible && this.enemies) {
			for (let i = 0; i < this.enemies.length; i++) {
				if (this.enemies[i].isDead) continue

				if (
					isInTouch({ obj1: this, obj2: this.enemies[i] })
				) {
					this.takeDamage()
					break
				}
			}
		}

		// Do not go outside the limits
		if (
			this.x + this.dx <= 0 ||
			this.x + this.w + this.dx >= canvas.width
		) {
			this.dx = 0
		}
	}

	punch() {
		if (this.isDead) return

		if (this.isHitOnCooldown) return

		this.isHitOnCooldown = true

		setTimeout(() => {
			this.isHitOnCooldown = false
		}, this.COOLDOWN_TIME)

		if (this.lastKey == "d") {
			this.setSprite("punch")
		} else {
			this.setSprite("punchLeft")
		}

		const x =
			this.lastKey == "a"
				? this.x - this.punchAbility.w
				: this.x + this.w

		const y = this.y + this.h / 4

		this.punchAbility.x = x
		this.punchAbility.y = y
		this.punchAbility.targets = this.enemies

		this.punchAbility.active({
			secondsLong: 150,
			waitAfter: 0,
		})
	}

	stand() {
		if (this.lastKey == "d") {
			this.setSprite("idle")
		} else {
			this.setSprite("idleLeft")
		}
	}

	jump() {
		if (this.isDead) return
		this.dy = -15
		if (this.lastKey == "d") {
			this.setSprite("jump")
		} else {
			this.setSprite("jumpLeft")
		}
	}

	goToLeft() {
		if (this.isDead) return
		this.dx = -this.speed
		if (this.isOnFloor) {
			this.setSprite("runLeft")
		}
	}

	goToRight() {
		if (this.isDead) return
		this.dx = this.speed
		if (this.isOnFloor) {
			this.setSprite("run")
		}
	}

	takeDamage() {
		if (currentLivesInGame - 1 <= 0) {
			// Die if the next hit kills the player
			playerLostLive()
			this.die()
			return
		}

		if (this.lastKey == "d") {
			this.setSprite("hurt")
		} else {
			this.setSprite("hurtLeft")
		}
		playerLostLive()
		this.isInvincible = true
		setTimeout(() => {
			this.isInvincible = false
		}, 2000)
	}

	land() {
		this.setSprite("land")
		this.isLanding = true
	}
}
