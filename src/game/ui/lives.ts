import { currentLivesInGame } from "../../main"
import { Sprite, SpriteProps } from "../sprite"

interface Heart extends SpriteProps {}

interface HeartsRowProps {
	x: number
	y: number
	fullSrc: string
	whiteTransition: string
	emptySrc: string
	maxLives: number
	imageScale: number
	spaceBetweenHearts: number
}

export class HeartsRow {
	maxLives: number
	hearts: Sprite[]
	emptyHearts: Sprite[]
	x: number
	y: number
	spaceBetweenHearts: number
	currentLives: any
	constructor({
		x,
		y,
		fullSrc,
		whiteTransition,
		emptySrc,
		maxLives,
		imageScale,
		spaceBetweenHearts,
	}: HeartsRowProps) {
		this.x = x
		this.y = y
		this.spaceBetweenHearts = spaceBetweenHearts
		this.maxLives = maxLives
		this.hearts = []
		this.emptyHearts = []
		this.currentLives = currentLivesInGame

		for (let i = 0; i < maxLives; i++) {
			this.hearts.push(
				new Sprite({
					x: this.x + this.spaceBetweenHearts * i,
					y: this.y,
					scale: imageScale,
					spritesDataList: [
						{
							key: "fullHeart",
							imageSrc: fullSrc,
							framesMax: 1,
							isLoop: false,
							framesHold: 1,
						},
						{
							key: "whiteTransitionHeart",
							imageSrc: whiteTransition,
							framesMax: 4,
							isLoop: false,
							framesHold: 10,
							waitToBeFinished: true,
						},
					],
				})
			)
			this.emptyHearts.push(
				new Sprite({
					x: this.x + this.spaceBetweenHearts * i,
					y: this.y,
					scale: imageScale,
					spritesDataList: [
						{
							key: "emptyHeart",
							imageSrc: emptySrc,
							framesMax: 1,
							isLoop: false,
							framesHold: 1,
						},
					],
				})
			)
		}
	}

	update() {
		this.emptyHearts.forEach(emptyHeart => {
			emptyHeart.drawAnimation()
		})

		for (let i = 0; i < currentLivesInGame; i++) {
			this.hearts[i].drawAnimation()
			this.hearts[i].setSprite("fullHeart")
		}
	}

	heartLost() {
		this.hearts.forEach(heart => {
			heart.setSprite("whiteTransitionHeart")
		})
	}
}
