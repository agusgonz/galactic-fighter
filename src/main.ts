import {
	BackgroundImage,
	BackgroundPlanet,
} from "./game/background"
import {
	Enemy,
	EnemyBasic,
	EnemyBasicFlying,
	EnemyBoss1,
	EnemyMedium,
} from "./game/character/enemy"
import { CharacterPlayable } from "./game/character/player"
import { Platform } from "./game/platform"
import { HeartsRow } from "./game/ui/lives"
import {
	getRandomItemFromArray,
	getRandomNumberBetween,
	isInTouch,
} from "./utils/utils"

export const canvas = document.querySelector(
	"canvas"
) as HTMLCanvasElement
export const ctx = canvas.getContext(
	"2d"
) as CanvasRenderingContext2D

const buttonUI = document.getElementById("button")
const scoreUI = document.getElementById("round-div")

buttonUI?.addEventListener("click", () => {
	initGame()
})

canvas!.width = 1240
canvas!.height = 700

// UI variables

const MAX_LIFES = 5
export let currentLivesInGame = MAX_LIFES

export function playerLostLive() {
	currentLivesInGame--
	heartRowUI.heartLost()
}

const heartRowUI = new HeartsRow({
	x: 20,
	y: 80,
	imageScale: 3,
	spaceBetweenHearts: 50,
	maxLives: MAX_LIFES,
	fullSrc: "/images/ui/lives/heartFull.png",
	whiteTransition: "/images/ui/lives/fullRow.png",
	emptySrc: "/images/ui/lives/heartEmpty.png",
})

// Game options variables
const PLANETS_SRC = [
	"/images/background/earth.png",
	"/images/background/mars.png",
	"/images/background/moon.png",
	"/images/background/jupiter.png",
]

let isPaused = false

let background: BackgroundImage[] = []
const backgroundPlanet = new BackgroundPlanet({
	src: getRandomItemFromArray(PLANETS_SRC),
})

let players: CharacterPlayable[] = []
export let enemiesArr: Enemy[] = []
let platforms: Platform[] = []

// Game rounds variables
const ENEMIES_TO_SPAWN_INCREMENTOR = 0.25
const ENEMIES_SPEED_INCREMENTOR = 0.05
const INTERVAL_BETWEEN_ENEMIES_MULTIPLIER = 0.99

let round = 0
let intervalBetweenEnemies = 6000
let enemiesToSpawn = 1
let enemiesSpeed = 0.5

const SPAWN_POINTS = [
	{
		x: 10,
		y: canvas.height - 300,
	},
	{
		x: canvas.width - 10,
		y: canvas.height - 300,
	},
	// {
	// 	x: 100,
	// 	y: 10,
	// },
	// {
	// 	x: canvas.width,
	// 	y: canvas.height / 2,
	// },
]
const SPAWN_POINTS_SLIME = [
	{
		x: getRandomNumberBetween(0, canvas.width * 0.07),
		y: -100,
	},
	{
		x: getRandomNumberBetween(
			canvas.width * 0.93,
			canvas.width
		),
		y: -100,
	},
]
const SPAWN_POINTS_BOSS_1 = [
	{
		x: 0,
		y: canvas.height / 5,
	},
	{
		x: 0,
		y: canvas.height / 1.5,
	},
	{
		x: canvas.width,
		y: canvas.height / 5,
	},
	{
		x: canvas.width,
		y: canvas.height / 1.5,
	},
]
function generateEnemies() {
	// Slime basic
	for (let i = 0; i < enemiesToSpawn * 3; i++) {
		const spawn = getRandomItemFromArray(SPAWN_POINTS_SLIME)
		const speed = (Math.random() + 1) * enemiesSpeed

		enemiesArr.push(
			new EnemyBasic({
				x: spawn.x,
				y: spawn.y,
				lives: 1,
				playersToKill: players,
				speed: speed,
				scale: 1.7,
				platforms: platforms,
				spritesDataList: [
					{
						key: "idle",
						imageSrc:
							"../images/sprites/slime-basic/idle.png",
						framesMax: 8,
						isLoop: true,
						framesHold: 5,
						offset: {
							x: 30,
							y: -30,
						},
					},
					{
						key: "idleLeft",
						imageSrc:
							"../images/sprites/slime-basic/idle.png",
						framesMax: 8,
						isLoop: true,
						framesHold: 5,
						offset: {
							x: 30,
							y: -30,
						},
					},
					{
						key: "run",
						imageSrc:
							"../images/sprites/slime-basic/run.png",
						framesMax: 8,
						isLoop: true,
						framesHold: 5,
						offset: {
							x: 40,
							y: -30,
						},
					},
					{
						key: "runLeft",
						imageSrc:
							"../images/sprites/slime-basic/runLeft.png",
						framesMax: 8,
						isLoop: true,
						rotateAnimation: false,
						framesHold: 5,
						offset: {
							x: 35,
							y: -30,
						},
					},
					{
						key: "death",
						imageSrc:
							"../images/sprites/slime-basic/death.png",
						framesMax: 8,
						isLoop: false,
						framesHold: 5,
						offset: {
							x: 40,
							y: -30,
						},
					},
				],
			})
		)
	}

	// // Slime advance
	if (round < 3) return
	for (let i = 0; i < enemiesToSpawn; i++) {
		const spawn = getRandomItemFromArray(SPAWN_POINTS)
		const speed = (Math.random() + 1) * enemiesSpeed

		enemiesArr.push(
			new EnemyMedium({
				x: spawn.x,
				y: spawn.y,
				lives: 3,
				playersToKill: players,
				speed: speed,
				scale: 3,
				wPunchAbility: 50,
				hPunchAbility: 20,
				platforms: platforms,
				spritesDataList: [
					{
						key: "idle",
						imageSrc:
							"../images/sprites/slime-advance/idle.png",
						framesMax: 6,
						isLoop: true,
						framesHold: 8,
						offset: {
							x: 5,
							y: -60,
						},
					},
					{
						key: "idleLeft",
						imageSrc:
							"../images/sprites/slime-advance/idleLeft.png",
						framesMax: 6,
						isLoop: true,
						framesHold: 8,
						rotateAnimation: true,
						offset: {
							x: 20,
							y: -60,
						},
					},
					{
						key: "run",
						imageSrc:
							"../images/sprites/slime-advance/run.png",
						framesMax: 8,
						isLoop: true,
						framesHold: 5,
						rotateAnimation: true,
						offset: {
							x: 5,
							y: -130,
						},
					},
					{
						key: "runLeft",
						imageSrc:
							"../images/sprites/slime-advance/runLeft.png",
						framesMax: 8,
						isLoop: true,
						framesHold: 5,
						offset: {
							x: 20,
							y: -130,
						},
					},
					{
						key: "punch",
						imageSrc:
							"../images/sprites/slime-advance/punch.png",
						framesMax: 8,
						isLoop: false,
						framesHold: 6,
						offset: {
							x: 30,
							y: -130,
						},
					},
					{
						key: "punchLeft",
						imageSrc:
							"../images/sprites/slime-advance/punchLeft.png",
						framesMax: 8,
						isLoop: false,
						rotateAnimation: true,
						framesHold: 6,
						offset: {
							x: 0,
							y: -130,
						},
					},
					{
						key: "death",
						imageSrc:
							"../images/sprites/slime-advance/death.png",
						framesMax: 5,
						isLoop: false,
						framesHold: 5,
						offset: {
							x: 40,
							y: -30,
						},
					},
				],
			})
		)
	}

	// // Flying Enemy
	if (round < 5) return
	for (let i = 0; i < enemiesToSpawn / 3; i++) {
		const spawn = getRandomItemFromArray(SPAWN_POINTS)
		const speed = (Math.random() + 1) * enemiesSpeed

		enemiesArr.push(
			new EnemyBasicFlying({
				x: spawn.x,
				y: spawn.y,
				lives: 1,
				playersToKill: players,
				speed: speed,
				scale: 0.8,
				wPunchAbility: 50,
				hPunchAbility: 20,
				spritesDataList: [
					{
						key: "run",
						imageSrc:
							"../images/sprites/flying-basic/run.png",
						framesMax: 4,
						isLoop: false,
						framesHold: 8,
						offset: {
							x: 210,
							y: -100,
						},
					},
					{
						key: "runLeft",
						imageSrc:
							"../images/sprites/flying-basic/runLeft.png",
						framesMax: 4,
						isLoop: false,
						framesHold: 8,
						rotateAnimation: true,
						offset: {
							x: 210,
							y: -100,
						},
					},
					{
						key: "death",
						imageSrc:
							"../images/sprites/flying-basic/run.png",
						framesMax: 4,
						isLoop: false,
						framesHold: 8,
						offset: {
							x: 210,
							y: -100,
						},
					},
					{
						key: "deathLeft",
						imageSrc:
							"../images/sprites/flying-basic/runLeft.png",
						framesMax: 4,
						isLoop: false,
						framesHold: 8,
						rotateAnimation: true,
						offset: {
							x: 210,
							y: -100,
						},
					},
				],
			})
		)
	}

	// Boss 1
	if (round < 7) return
	let bossToSpawn = 1

	if (round > 9) {
		bossToSpawn = 2
	}

	if (round > 12) {
		bossToSpawn = 3
	}
	if (round > 13) {
		bossToSpawn = 4
	}
	for (let i = 0; i < bossToSpawn; i++) {
		const spawn = getRandomItemFromArray(
			SPAWN_POINTS_BOSS_1
		)
		const speed = (Math.random() + 1) * enemiesSpeed
		enemiesArr.push(
			new EnemyBoss1({
				x: spawn.x - 200,
				y: spawn.y,
				lives: 500,
				playersToKill: players,
				speed: speed,
				scale: 2,
				wPunchAbility: 50,
				hPunchAbility: 20,
				spritesDataList: [
					{
						key: "run",
						imageSrc: "../images/sprites/boss1/run.png",
						framesMax: 5,
						isLoop: true,
						framesHold: 20,
						offset: {
							x: 200,
							y: -60,
						},
					},
					{
						key: "runLeft",
						imageSrc: "../images/sprites/boss1/runLeft.png",
						framesMax: 5,
						isLoop: true,
						framesHold: 20,
						// rotateAnimation: true,
						offset: {
							x: 230,
							y: -60,
						},
					},
				],
			})
		)
	}
}

function initGame() {
	// Variables restart
	currentLivesInGame = MAX_LIFES
	round = 0
	intervalBetweenEnemies = 6000
	enemiesToSpawn = 1
	enemiesSpeed = 0.5

	// Platform init
	platforms = []

	for (let i = 0; platforms.length < 6; i++) {
		const w = getRandomItemFromArray([70, 140, 140, 220])
		const h = 70
		const x = getRandomNumberBetween(100, canvas.width - w)
		const y = getRandomNumberBetween(
			100,
			canvas.height * 0.75
		)

		const isTouchingOtherPlatform = platforms.some(
			platform =>
				isInTouch({ obj1: platform, obj2: { x, y, w, h } })
		)

		if (!isTouchingOtherPlatform) {
			platforms.push(
				new Platform({
					x,
					y,
					w,
					h,
					defaultImageSrc: "/images/sprites/tiles/tile.png",
					scale: 0.3,
				})
			)
		}
	}

	platforms.push(
		new Platform({
			x: -canvas.width,
			y: canvas.height - 40,
			w: canvas.width * 3,
			h: 20,
			defaultImageSrc: "/images/sprites/tiles/tile-2.png",
			scale: 0.3,
		})
	)

	// Player1 init
	players = []
	players.push(
		new CharacterPlayable({
			x: canvas.width / 3,
			y: canvas.height / 1.5,
			speed: 5,
			scale: 3,
			wPunchAbility: 80,
			hPunchAbility: 50,
			spritesDataList: [
				{
					key: "idle",
					imageSrc: "../images/sprites/player1/idle.png",
					framesMax: 10,
					isLoop: true,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
				},
				{
					key: "idleLeft",
					imageSrc:
						"../images/sprites/player1/idleLeft.png",
					framesMax: 10,
					isLoop: true,
					rotateAnimation: true,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
				},
				{
					key: "run",
					imageSrc: "../images/sprites/player1/run.png",
					framesMax: 8,
					isLoop: true,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
				},

				{
					key: "runLeft",
					imageSrc: "../images/sprites/player1/runLeft.png",
					framesMax: 8,
					isLoop: true,
					rotateAnimation: true,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
				},
				{
					key: "jump",
					imageSrc: "../images/sprites/player1/jump.png",
					framesMax: 3,
					isLoop: false,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
				},
				{
					key: "jumpLeft",
					imageSrc:
						"../images/sprites/player1/jumpLeft.png",
					framesMax: 3,
					isLoop: false,
					rotateAnimation: true,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
				},
				{
					key: "punch",
					imageSrc: "../images/sprites/player1/punch.png",
					framesMax: 4,
					isLoop: false,
					framesHold: 6,
					offset: {
						x: 10,
						y: -65,
					},
				},
				{
					key: "punchLeft",
					imageSrc:
						"../images/sprites/player1/punchLeft.png",
					framesMax: 4,
					isLoop: false,
					rotateAnimation: true,
					framesHold: 6,
					offset: {
						x: -50,
						y: -65,
					},
				},
				{
					key: "death",
					imageSrc: "../images/sprites/explotion2.png",
					framesMax: 19,
					isLoop: false,
					rotateAnimation: true,
					framesHold: 6,
					offset: {
						x: 0,
						y: -50,
					},
				},
				{
					key: "hurt",
					imageSrc: "../images/sprites/player1/hurt.png",
					framesMax: 4,
					isLoop: false,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
					waitToBeFinished: true,
				},
				{
					key: "hurtLeft",
					imageSrc:
						"../images/sprites/player1/hurtLeft.png",
					framesMax: 4,
					isLoop: false,
					rotateAnimation: true,
					framesHold: 6,
					offset: {
						x: -10,
						y: -40,
					},
					waitToBeFinished: true,
				},
			],
			platforms: platforms,
		})
	)

	// Player2 init
	// players.push(
	// 	new CharacterPlayable({
	// 		x: canvas.width / 3,
	// 		y: canvas.height / 2,
	// 		speed: 5,
	// 		scale: 2.1,
	// 		wPunchAbility: 80,
	// 		hPunchAbility: 50,
	// 		spritesDataList: [
	// 			{
	// 				key: "idle",
	// 				imageSrc: "../images/sprites/player2/idle.png",
	// 				framesMax: 12,
	// 				isLoop: true,
	// 				framesHold: 4,
	// 				offset: {
	// 					x: 8,
	// 					y: -52,
	// 				},
	// 			},
	// 			{
	// 				key: "idleLeft",
	// 				imageSrc:
	// 					"../images/sprites/player2/idleLeft.png",
	// 				framesMax: 12,
	// 				isLoop: true,
	// 				rotateAnimation: true,
	// 				framesHold: 6,
	// 				offset: {
	// 					x: 10,
	// 					y: -52,
	// 				},
	// 			},
	// 			{
	// 				key: "run",
	// 				imageSrc: "../images/sprites/player2/run.png",
	// 				framesMax: 8,
	// 				isLoop: true,
	// 				framesHold: 6,
	// 				offset: {
	// 					x: 0,
	// 					y: -52,
	// 				},
	// 			},

	// 			{
	// 				key: "runLeft",
	// 				imageSrc: "../images/sprites/player2/runLeft.png",
	// 				framesMax: 8,
	// 				isLoop: true,
	// 				rotateAnimation: true,
	// 				framesHold: 6,
	// 				offset: {
	// 					x: 0,
	// 					y: -52,
	// 				},
	// 			},
	// 			{
	// 				key: "jump",
	// 				imageSrc: "../images/sprites/player2/jump.png",
	// 				framesMax: 4,
	// 				isLoop: false,
	// 				framesHold: 6,
	// 				offset: {
	// 					x: 10,
	// 					y: -52,
	// 				},
	// 			},
	// 			{
	// 				key: "jumpLeft",
	// 				imageSrc:
	// 					"../images/sprites/player2/jumpLeft.png",
	// 				framesMax: 4,
	// 				isLoop: false,
	// 				rotateAnimation: true,
	// 				framesHold: 6,
	// 				offset: {
	// 					x: 10,
	// 					y: -52,
	// 				},
	// 			},
	// 			{
	// 				key: "punch",
	// 				imageSrc: "../images/sprites/player2/punch.png",
	// 				framesMax: 7,
	// 				isLoop: false,
	// 				framesHold: 2,
	// 				offset: {
	// 					x: -20,
	// 					y: -90,
	// 				},
	// 			},
	// 			{
	// 				key: "punchLeft",
	// 				imageSrc:
	// 					"../images/sprites/player2/punchLeft.png",
	// 				framesMax: 7,
	// 				isLoop: false,
	// 				rotateAnimation: true,
	// 				framesHold: 2,
	// 				offset: {
	// 					x: 20,
	// 					y: -90,
	// 				},
	// 			},
	// 			{
	// 				key: "death",
	// 				imageSrc: "../images/sprites/explotion2.png",
	// 				framesMax: 19,
	// 				isLoop: false,
	// 				rotateAnimation: true,
	// 				framesHold: 6,
	// 				offset: {
	// 					x: 0,
	// 					y: 0,
	// 				},
	// 			},
	// 		],
	// 		platforms: platforms,
	// 	})
	// )

	// Enemies init
	enemiesArr = []

	// Background init
	background = []

	let x = 0
	let y = 0

	while (x < canvas.width) {
		while (y < canvas.height) {
			background.push(new BackgroundImage({ x: x, y: y }))
			y += 228
		}
		y = 0
		x += 522
	}

	backgroundPlanet.x = getRandomNumberBetween(
		canvas.width / 2,
		canvas.width - backgroundPlanet.image.width * 2
	)
	backgroundPlanet.y = getRandomNumberBetween(
		0 + backgroundPlanet.image.height,
		canvas.height / 3 - backgroundPlanet.image.height * 2
	)
}

function nextRound() {
	generateEnemies()
	enemiesToSpawn += ENEMIES_TO_SPAWN_INCREMENTOR
	enemiesSpeed += ENEMIES_SPEED_INCREMENTOR
	intervalBetweenEnemies *=
		INTERVAL_BETWEEN_ENEMIES_MULTIPLIER
	round++
	if (scoreUI != null) {
		scoreUI.innerHTML = "ROUND " + round
	}
}

function animate() {
	requestAnimationFrame(animate)

	if (isPaused) return

	background.forEach(image => image.draw())

	backgroundPlanet.draw()

	platforms.forEach(plataform => plataform.update())

	enemiesArr.forEach(enemy => {
		enemy.update()
	})

	players.forEach(player => {
		player.enemies = enemiesArr
		player.update()
	})

	heartRowUI.update()

	// player2.enemies = enemiesArr
	// player2.update()

	if (players.some(player => player.isDead)) {
		endGame()
	}

	const isNotFinished = enemiesArr.some(
		enemy => !enemy.isDead
	)

	if (!isNotFinished) {
		// If an enemy is alive do not move to next round
		nextRound()
	}
}

initGame()
animate()

function endGame() {
	console.log("game ended")
}

// Basic keys
window.addEventListener("keydown", event => {
	switch (event.key) {
		case "Escape":
			isPaused = !isPaused
			break
	}
})
// Player 1

window.addEventListener("keydown", event => {
	switch (event.code) {
		case "KeyW":
			players[0].jump()
			break
		case "KeyA":
			players[0].keys.a.pressed = true
			players[0].lastKey = "a"

			break
		case "KeyD":
			players[0].keys.d.pressed = true
			players[0].lastKey = "d"

			break
		case "KeyJ":
			players[0].punch()
			break
	}
})

window.addEventListener("keyup", event => {
	switch (event.key) {
		case "a":
			players[0].keys.a.pressed = false

			break
		case "d":
			players[0].keys.d.pressed = false
			break
	}
})

// Player 2
window.addEventListener("keydown", event => {
	switch (event.key) {
		case "ArrowUp":
			players[1].jump()
			break
		case "ArrowLeft":
			players[1].keys.a.pressed = true
			players[1].lastKey = "a"
			break
		case "ArrowRight":
			players[1].keys.d.pressed = true
			players[1].lastKey = "d"

			break
		case "Enter":
			players[1].punch()
			break
	}
})

window.addEventListener("keyup", event => {
	switch (event.key) {
		case "ArrowLeft":
			players[1].keys.a.pressed = false

			break
		case "ArrowRight":
			players[1].keys.d.pressed = false
			break
	}
})
