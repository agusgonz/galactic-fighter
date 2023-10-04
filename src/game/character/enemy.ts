import { Character, CharacterProps } from "."
import { canvas } from "../../main"
import {
	getRandomItemFromArray,
	getRandomNumberBetween,
} from "../../utils/utils"
import { CharacterPlayable } from "./player"

interface EnemyProps extends CharacterProps {
	playersToKill: CharacterPlayable[]
}

export class Enemy extends Character {
	playersToKill: CharacterPlayable[]
	playerToFocus: CharacterPlayable

	constructor({ playersToKill, ...props }: EnemyProps) {
		super(props)
		this.playersToKill = playersToKill
		this.playerToFocus = playersToKill[0]
	}

	update() {
		this.drawAnimation()
		// this.drawHitBox()

		if (this.isDead) return

		if (this.y + this.h + this.dy >= canvas.height) {
			this.dy = 0
		} else {
			this.dy += this.gravity
		}

		this.checkPlatforms()

		this.dx = 0

		this.moveToFocusedPlayer()
		this.focusNearbyPlayerY()

		this.y += this.dy
		this.x += this.dx
	}

	moveToFocusedPlayer() {
		if (
			this.playerToFocus.x + this.playerToFocus.w / 2 <
			this.x
		) {
			this.dx = -this.speed
			this.setSprite("runLeft")
			this.isLeftLastDirection = true
		} else if (
			this.playerToFocus.x >
			this.x + this.w - this.playerToFocus.w / 2
		) {
			this.dx = this.speed
			this.setSprite("run")
			this.isLeftLastDirection = false
		} else {
			if (this.isLeftLastDirection) {
				this.setSprite("idleLeft")
			} else {
				this.setSprite("idle")
			}
		}
	}

	focusNearbyPlayerY() {
		this.playersToKill.forEach(playerToKill => {
			const distanceFromCurrentY =
				this.y - this.playerToFocus.y

			const distanceFromNewY = this.y - playerToKill.y

			if (
				distanceFromCurrentY > distanceFromNewY ||
				!playerToKill.isDead
			) {
				this.playerToFocus = playerToKill
			}
		})
	}

	focusNearbyPlayerX() {
		this.playersToKill.forEach(playerToKill => {
			if (playerToKill.isDead) return
			const distanceFromCurrentX =
				this.x - this.playerToFocus.x

			const distanceFromNewX = this.x - playerToKill.x

			if (distanceFromCurrentX > distanceFromNewX) {
				this.playerToFocus = playerToKill
			}
		})
	}

	takeDamage() {
		if (this.lives - 1 == 0) {
			// Die if the next hit kills the player
			this.die()
			return
		}
		this.lives--
	}
}

interface EnemyBasicProps
	extends Omit<EnemyProps, "w" | "h"> {}

export class EnemyBasic extends Enemy {
	constructor(props: EnemyBasicProps) {
		super({ ...props, w: 50, h: 60 })
	}
}

interface EnemyMediumProps
	extends Omit<EnemyProps, "w" | "h"> {}

export class EnemyMedium extends Enemy {
	isOnCooldown: boolean
	isChargingPunch: boolean
	timeoutId: undefined | number
	COOLDOWN_TIME: number
	CHARGING_TIME: number
	constructor(props: EnemyMediumProps) {
		super({ ...props, w: 100, h: 110 })
		this.isOnCooldown = false
		this.CHARGING_TIME = 700
		this.COOLDOWN_TIME = 5000
		this.isChargingPunch = false
		this.timeoutId = undefined
	}

	update() {
		this.drawAnimation()
		// this.drawHitBox()

		if (this.isDead) return

		if (this.y + this.h + this.dy >= canvas.height) {
			this.dy = 0
		} else {
			this.dy += this.gravity
		}

		this.checkPlatforms()

		this.dx = 0

		if (!this.punchAbility.isActive) {
			// Move only if is not hitting
			this.moveToFocusedPlayer()
			this.focusNearbyPlayerY()

			// Abilities
			if (!this.isOnCooldown) {
				// Checks if it can hit
				if (
					this.x + this.w + this.punchAbility.w >
						this.playerToFocus.x &&
					this.playerToFocus.x > this.x + this.w &&
					this.y <=
						this.playerToFocus.y + this.playerToFocus.h
				) {
					this.isLeftLastDirection = false
					this.dx = 0
					this.chargePunch()
				} else if (
					this.playerToFocus.x + this.playerToFocus.w >
						this.x - this.punchAbility.w &&
					this.x > this.playerToFocus.x &&
					this.y <=
						this.playerToFocus.y + this.playerToFocus.h
				) {
					this.isLeftLastDirection = true
					this.dx = 0
					this.chargePunch()
				} else {
					this.unChargePunch()
				}
			}
		}

		this.y += this.dy
		this.x += this.dx
	}

	chargePunch() {
		if (this.isChargingPunch) return

		this.isChargingPunch = true

		this.timeoutId = setTimeout(() => {
			this.punch()
			this.isChargingPunch = false
		}, this.CHARGING_TIME)
	}

	unChargePunch() {
		clearTimeout(this.timeoutId)

		this.isChargingPunch = false
	}

	punch() {
		if (this.isDead) return

		this.isOnCooldown = true

		setTimeout(() => {
			this.isOnCooldown = false
		}, this.COOLDOWN_TIME)

		if (this.isLeftLastDirection) {
			this.setSprite("punchLeft")
		} else {
			this.setSprite("punch")
		}

		const x = this.isLeftLastDirection
			? this.x - this.punchAbility.w
			: this.x + this.w

		const y = this.y + this.h / 4

		this.punchAbility.x = x
		this.punchAbility.y = y
		this.punchAbility.targets = this.playersToKill

		this.punchAbility.active({
			secondsLong: 800,
			waitAfter: 1000,
		})
	}

	moveToFocusedPlayer() {
		if (
			this.playerToFocus.x + this.playerToFocus.w <
			this.x - this.punchAbility.w
		) {
			this.dx = -this.speed
			this.setSprite("runLeft")
			this.isLeftLastDirection = true
		} else if (
			this.playerToFocus.x >
			this.x + this.w + this.punchAbility.w
		) {
			this.dx = this.speed
			this.setSprite("run")
			this.isLeftLastDirection = false
		} else {
			if (this.isLeftLastDirection) {
				this.setSprite("idleLeft")
			} else {
				this.setSprite("idle")
			}
		}
	}
}

interface EnemyBasicFlyingProps
	extends Omit<EnemyProps, "w" | "h"> {}

export class EnemyBasicFlying extends Enemy {
	constructor(props: EnemyBasicFlyingProps) {
		super({ ...props, w: 50, h: 70 })
	}

	update() {
		this.drawAnimation()
		// this.drawHitBox()

		this.dy += this.gravity

		this.dx = 0

		if (!this.isDead) {
			if (
				this.y - getRandomNumberBetween(100, 130) >
				this.playerToFocus.y
			) {
				// Decides when to jump depends the high
				this.jump()
			}

			this.moveToFocusedPlayer()
		}

		this.y += this.dy
		this.x += this.dx
	}

	moveToFocusedPlayer() {
		if (
			this.playerToFocus.x + this.playerToFocus.w / 2 <
			this.x
		) {
			this.dx = -this.speed
			this.setSprite("runLeft")
			this.isLeftLastDirection = true
		} else if (
			this.playerToFocus.x >
			this.x + this.w - this.playerToFocus.w / 2
		) {
			this.dx = this.speed
			this.setSprite("run")
			this.isLeftLastDirection = false
		} else {
			if (this.isLeftLastDirection) {
				this.setSprite("runLeft")
			} else {
				this.setSprite("run")
			}
		}
	}

	focusRandomPlayer() {
		const newPlayer = getRandomItemFromArray(
			this.playersToKill
		)

		if (newPlayer.isDead) return

		this.playerToFocus = newPlayer
	}

	jump() {
		this.dy = getRandomNumberBetween(-20, -25)
		if (this.isLeftLastDirection) {
			this.setSprite("jumpLeft")
		} else {
			this.setSprite("jump")
		}
		this.focusRandomPlayer()
	}
}

interface EnemyBoss1Props
	extends Omit<EnemyProps, "w" | "h"> {}

export class EnemyBoss1 extends Enemy {
	directionToGo: undefined | number
	constructor(props: EnemyBoss1Props) {
		super({ ...props, w: 400, h: 150 })
		this.directionToGo = undefined
	}

	update() {
		if (this.isDead) return

		this.drawAnimation()
		// this.drawHitBox()

		if (!this.directionToGo) {
			// Decide which direction go depends of where it spawns
			if (this.x > this.playersToKill[0].x) {
				this.setSprite("runLeft")
				this.directionToGo = -this.speed
			} else {
				this.setSprite("run")
				this.directionToGo = this.speed
			}
		}

		if (
			(this.directionToGo > 0 &&
				this.x - 100 > canvas.width) ||
			(this.directionToGo < 0 && this.x + this.w + 100 < 0)
		) {
			// If it goes outside the limits die
			this.die()
		}

		this.dx = this.directionToGo!

		this.y += this.dy
		this.x += this.dx
	}
}
