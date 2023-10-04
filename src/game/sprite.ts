import { ctx } from "../canvas"

export interface SpriteData {
	key: string
	imageSrc: string
	framesMax: number
	framesHold: number
	image?: HTMLImageElement
	isLoop: boolean
	rotateAnimation?: boolean
	waitToBeFinished?: boolean
	offset?: {
		x: number
		y: number
	}
} // Create interface for sprite data object

export interface SpriteProps {
	x: number
	y: number
	scale?: number
	defaultImageSrc?: string
	defaultOffset?: {
		x: number
		y: number
	}
	spritesDataList?: SpriteData[]
} // Create interface for sprite class

export class Sprite {
	x: number
	y: number
	scale: number // To scale the image
	defaultImage: HTMLImageElement
	framesCurrent: number // To know in whitch sprite step we are
	framesElapsed: number // To slow down the sprite
	spritesDataList: SpriteData[] | undefined
	currentSpriteData: SpriteData | undefined
	defaultOffset: { x: number; y: number }
	waitAnimationToFinish: boolean

	constructor({
		x,
		y,
		scale = 1,
		spritesDataList,
		defaultImageSrc,
		defaultOffset,
	}: SpriteProps) {
		this.x = x
		this.y = y
		this.scale = scale
		this.defaultImage = new Image()
		this.defaultImage.src = defaultImageSrc || ""
		this.defaultOffset = defaultOffset || { x: 0, y: 0 }
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.spritesDataList = spritesDataList?.map(sprite => {
			const newSpriteData = {
				...sprite,
				image: new Image(),
			}
			newSpriteData.image.src = sprite.imageSrc

			return newSpriteData
		}) // Creates a new image object with the data received

		this.currentSpriteData // Manage current sprite

		this.waitAnimationToFinish = false
		// Avoid setting new sprite if is true (so it can let finish the current sprite animation)
	}

	draw() {
		if (this.defaultImage.src == "") return

		ctx.drawImage(
			this.defaultImage,
			this.x + this.defaultOffset.x,
			this.y + this.defaultOffset.y,
			this.defaultImage.width * this.scale,
			this.defaultImage.height * this.scale
		)
	}

	drawInPlace({
		xToDraw,
		yToDraw,
	}: {
		xToDraw: number
		yToDraw: number
	}) {
		if (this.defaultImage.src == "") return

		ctx.drawImage(
			this.defaultImage,
			xToDraw + this.defaultOffset.x,
			yToDraw + this.defaultOffset.y,
			this.defaultImage.width * this.scale,
			this.defaultImage.height * this.scale
		)
	}

	drawAnimation() {
		if (!this.currentSpriteData?.image) {
			//If it has no current sprite set the first one in the list
			if (!this.spritesDataList) return
			this.currentSpriteData = this.spritesDataList[0]
			return
		}

		const {
			image,
			framesMax,
			offset = { x: 0, y: 0 }, //Default is 0,
			framesHold,
			rotateAnimation,
			waitToBeFinished,
		} = this.currentSpriteData //Destructure

		if (waitToBeFinished) {
			this.waitAnimationToFinish = true
		}

		// Render sprites calculating animation
		ctx.drawImage(
			image,
			(this.framesCurrent * image.width) / framesMax,
			0,
			image.width / framesMax,
			image.height,
			this.x - image.width / framesMax + offset.x,
			this.y + offset.y,
			(image.width / framesMax) * this.scale,
			image.height * this.scale
		)

		// Loop through the sprite steps
		this.framesElapsed++
		if (this.framesElapsed % framesHold === 0) {
			if (rotateAnimation) {
				// Rotated
				if (this.framesCurrent > 0) {
					this.framesCurrent--
				} else if (this.currentSpriteData.isLoop) {
					// Only restart if it is loop
					this.framesCurrent = framesMax - 1
				} else if (waitToBeFinished) {
					this.waitAnimationToFinish = false
				}
			} else {
				//  Normal
				if (this.framesCurrent < framesMax - 1) {
					this.framesCurrent++
				} else if (this.currentSpriteData.isLoop) {
					// Only restart if it is loop
					this.framesCurrent = 0
				} else if (waitToBeFinished) {
					this.waitAnimationToFinish = false
				}
			}
		}
	}

	setSprite(name: string) {
		//Change sprite
		if (!this.spritesDataList) return
		if (this.waitAnimationToFinish) return

		if (
			this.currentSpriteData?.key === name &&
			name != "jump" &&
			name != "jumpLeft"
		) {
			return //Do not change sprite if it is the same unless needs to jump again
		}

		const newSpriteData = this.spritesDataList.find(
			sprite => sprite.key == name
		)
		this.currentSpriteData = newSpriteData

		if (newSpriteData?.rotateAnimation) {
			// Reset frames
			this.framesCurrent = newSpriteData.framesMax - 1
		} else {
			this.framesCurrent = 0
		}
	}
}
