const canvas = document.querySelector(
	"canvas"
) as HTMLCanvasElement
const ctx = canvas.getContext(
	"2d"
) as CanvasRenderingContext2D

function initCanvas() {
	canvas!.width = 1280
	canvas!.height = 720
}

export { initCanvas, canvas, ctx }
